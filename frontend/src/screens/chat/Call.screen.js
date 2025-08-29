import React, { useEffect, useRef, useState } from "react";
import { View, Text, Button, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { RTCPeerConnection, RTCView, mediaDevices, RTCIceCandidate, RTCSessionDescription } from "react-native-webrtc";
import io from "socket.io-client";

/**
 * Props/route.params.callData expected shape (one of these flows):
 * - Caller flow (from Chat screen):
 *   {
 *     isCaller: true,
 *     calleeId: "<receiverUserId>",
 *     calleeName: "Alice",
 *     signalingUrl: "https://your-socket-server.com",   // optional if you pass socket
 *     token: "JWT_TOKEN"                                // optional auth for socket
 *   }
 *
 * - Callee flow (if you navigate user to CallScreen after receiving an incoming call):
 *   {
 *     isCaller: false,
 *     callerId: "<callerUserId>",
 *     callerName: "Bob",
 *     incomingOffer: <SDP Object>   // optional; if you already have the offer
 *     signalingUrl, token
 *   }
 *
 * Alternatively, provide an existing socket instance via callData.socket
 */

const ICE_SERVERS = [
  { urls: "stun:stun.l.google.com:19302" },
  // Example TURN placeholder — replace with your TURN server in production:
  // { urls: "turn:your.turn.host:3478", username: "user", credential: "pass" }
];

export default function CallScreen({ navigation, route }) {
  const callData = route?.params?.callData || {};
  const { isCaller, calleeId, calleeName, callerId, callerName, incomingOffer, signalingUrl, token } = callData;

  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [cameraFacing, setCameraFacing] = useState("front");
  const [callState, setCallState] = useState(isCaller ? "calling" : "ringing"); // calling, ringing, in-call, ended
  const [socketConnected, setSocketConnected] = useState(false);

  const pcRef = useRef(null);
  const socketRef = useRef(null);
  const localTracksRef = useRef([]);

  // Helper to create or reuse socket
  const initSocket = () => {
    if (callData.socket) {
      socketRef.current = callData.socket;
      setSocketConnected(true);
      return;
    }
    // create new socket instance if signalingUrl provided
    if (!signalingUrl) {
      console.warn("No signalingUrl or socket provided in callData.");
      return;
    }
    const opts = token ? { auth: { token } } : {};
    const s = io(signalingUrl, opts);
    socketRef.current = s;
    s.on("connect", () => setSocketConnected(true));
    s.on("disconnect", () => setSocketConnected(false));
  };

  useEffect(() => {
    initSocket();
    startLocalMedia();

    // Register socket listeners
    const s = socketRef.current;
    if (s) {
      s.on("incoming call", onIncomingCall);  // server -> callee
      s.on("call accepted", onCallAccepted);  // server -> caller
      s.on("call refused", onCallRefused);
      s.on("ice-candidate", onRemoteIceCandidate);
      s.on("call ended", onRemoteCallEnded);
    }

    // If callee navigated with incomingOffer (maybe your code forwarded it), prefill
    if (!isCaller && incomingOffer) {
      // we stay in ringing state until user accepts; save offer for accept flow
      pcRef.current = null; // ensure we create PC when accept
      pcRef.current = null;
      // store incomingOffer on ref for later use
      pcRef.incomingOffer = incomingOffer;
    }

    return () => {
      cleanup();
      if (socketRef.current && !callData.socket) {
        socketRef.current.off("incoming call", onIncomingCall);
        socketRef.current.off("call accepted", onCallAccepted);
        socketRef.current.off("call refused", onCallRefused);
        socketRef.current.off("ice-candidate", onRemoteIceCandidate);
        socketRef.current.off("call ended", onRemoteCallEnded);
        socketRef.current.disconnect?.();
      }
    };
  }, []);

  // Start camera/mic
  const startLocalMedia = async () => {
    try {
      const stream = await mediaDevices.getUserMedia({
        audio: true,
        video: { facingMode: cameraFacing },
      });
      setLocalStream(stream);
      localTracksRef.current = stream.getTracks();
    } catch (err) {
      console.error("getUserMedia error:", err);
      Alert.alert("Permission error", "Please grant camera/microphone permissions.");
    }
  };

  // Create peer connection and hook events
  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

    pc.onicecandidate = ({ candidate }) => {
      if (candidate) {
        // send ICE candidate to peer via socket
        const payload = {
          to: isCaller ? calleeId : callerId,
          candidate,
        };
        socketRef.current?.emit("ice-candidate", payload);
      }
    };

    pc.ontrack = (event) => {
      const stream = event.streams && event.streams[0];
      if (stream) setRemoteStream(stream);
    };

    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;
      console.log("PC state:", state);
      if (state === "connected") setCallState("in-call");
      if (state === "disconnected" || state === "failed" || state === "closed") {
        setCallState("ended");
      }
    };

    // attach local tracks
    if (localTracksRef.current?.length) {
      localTracksRef.current.forEach((t) => pc.addTrack(t, localStream));
    }

    pcRef.current = pc;
    return pc;
  };

  // Caller: create offer -> send 'call user'
  const makeOfferAndCall = async () => {
    const pc = createPeerConnection();
    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      // send offer to callee via Socket.IO
      socketRef.current?.emit("call user", {
        receiverId: calleeId,
        signalData: offer,
        from: /* your user id - you should pass in callData */ callData.myId || null,
        name: callData.myName || "Caller",
      });
      setCallState("calling");
    } catch (err) {
      console.error("Error creating offer", err);
    }
  };

  // Server -> caller: 'call accepted' with answer SDP
  const onCallAccepted = async ({ signal, from }) => {
    console.log("call accepted from", from);
    try {
      if (!pcRef.current) {
        console.warn("No pc when receiving answer — creating new PC");
        createPeerConnection();
      }
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(signal));
      setCallState("in-call");
    } catch (err) {
      console.error("Failed to apply answer", err);
    }
  };

  // Server -> caller: 'call refused'
  const onCallRefused = ({ from }) => {
    Alert.alert("Call refused", "The user declined the call.");
    hangUp(true);
  };

  // Server -> callee: 'incoming call'
  const onIncomingCall = (payload) => {
    // payload: { signal: offer, from, name }
    console.log("Incoming call payload", payload);
    // Save incoming offer on ref to use when accepting
    pcRef.incomingOffer = payload.signal;
    pcRef.incomingCallerId = payload.from;
    pcRef.incomingCallerName = payload.name;
    setCallState("ringing");
    // Optionally you could navigate to call screen here; if already on screen just show UI
    // display Accept / Decline UI handled below
  };

  // Callee: accept -> create answer & emit 'answer call'
  const acceptCall = async () => {
    const pc = createPeerConnection();
    try {
      // set remote (offer) saved earlier
      const offer = pcRef.incomingOffer;
      if (!offer) {
        Alert.alert("No offer", "No incoming offer found.");
        return;
      }
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      // send answer back to caller
      socketRef.current?.emit("answer call", {
        to: pcRef.incomingCallerId, // callerId
        signalData: answer,
      });

      setCallState("in-call");
    } catch (err) {
      console.error("Error accepting call", err);
    }
  };

  // Callee: refuse
  const refuseCall = () => {
    const to = pcRef.incomingCallerId;
    if (to) socketRef.current?.emit("refuse call", { to });
    hangUp(true);
  };

  // ICE candidate received from remote
  const onRemoteIceCandidate = async ({ candidate }) => {
    if (!candidate) return;
    try {
      if (!pcRef.current) {
        console.warn("No pcRef when receiving remote candidate — delaying add");
        // In some rare cases, store candidate and apply later
        pcRef.pendingCandidates = pcRef.pendingCandidates || [];
        pcRef.pendingCandidates.push(candidate);
        return;
      }
      await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (err) {
      console.error("Error adding remote ICE candidate:", err);
    }
  };

  // Hangup / end call (local)
  const hangUp = (silent = false) => {
    // notify peer
    const to = isCaller ? calleeId : (pcRef.incomingCallerId || callerId);
    if (to && socketRef.current) socketRef.current.emit("end call", { to });

    cleanup();
    if (!silent) navigation.goBack?.();
  };

  // Remote hangs up
  const onRemoteCallEnded = ({ from }) => {
    Alert.alert("Call ended", "The other user has ended the call.");
    cleanup();
    navigation.goBack?.();
  };

  // mute/unmute
  const toggleMute = () => {
    const tracks = localTracksRef.current || [];
    tracks.forEach((t) => {
      if (t.kind === "audio") t.enabled = !t.enabled;
    });
    setIsMuted((m) => !m);
  };

  // switch camera (front/back)
  const switchCamera = async () => {
    if (!localStream) return;
    // find video track and switch facing mode by restarting getUserMedia (simplest)
    const newFacing = cameraFacing === "front" ? "environment" : "front";
    setCameraFacing(newFacing);

    // stop current video tracks
    localTracksRef.current?.forEach((t) => {
      if (t.kind === "video") t.stop();
    });

    try {
      const stream = await mediaDevices.getUserMedia({
        audio: true,
        video: { facingMode: newFacing },
      });
      // replace local tracks in pc
      const videoTrack = stream.getVideoTracks()[0];
      const sender = pcRef.current
        ? pcRef.current.getSenders().find((s) => s.track && s.track.kind === "video")
        : null;
      if (sender && videoTrack) {
        sender.replaceTrack(videoTrack);
      }
      // update refs
      localTracksRef.current = stream.getTracks();
      setLocalStream(stream);
    } catch (err) {
      console.error("Error switching camera", err);
    }
  };

  // Cleanup: stop tracks, close pc
  const cleanup = () => {
    try {
      localTracksRef.current?.forEach((t) => t.stop && t.stop());
      localTracksRef.current = [];
    } catch (e) {}
    try {
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
    } catch (e) {}
    setLocalStream(null);
    setRemoteStream(null);
    setCallState("ended");
  };

  // If caller start immediately after component mounts
  useEffect(() => {
    // only start offer flow if caller
    if (isCaller && socketConnected) {
      // slight delay to ensure socket is connected and local media obtained
      const attempt = async () => {
        // ensure local media is ready
        if (!localStream) {
          // wait a bit and retry
          setTimeout(attempt, 300);
          return;
        }
        await makeOfferAndCall();
      };
      attempt();
    }
  }, [isCaller, socketConnected, localStream]);

  // Minimal UI
  return (
    <View style={styles.container}>
      <Text style={styles.status}>State: {callState}</Text>

      <View style={styles.videoContainer}>
        {remoteStream ? (
          <RTCView streamURL={remoteStream.toURL()} style={styles.remoteVideo} objectFit="cover" />
        ) : (
          <View style={styles.remotePlaceholder}>
            <Text style={{ color: "#fff" }}>{callState === "ringing" ? "Ringing..." : "Waiting for remote"}</Text>
          </View>
        )}

        {localStream && (
          <RTCView streamURL={localStream.toURL()} style={styles.localVideo} objectFit="cover" />
        )}
      </View>

      <View style={styles.controls}>
        {callState === "ringing" && !isCaller && (
          <>
            <TouchableOpacity style={[styles.btn, { backgroundColor: "green" }]} onPress={acceptCall}>
              <Text style={styles.btnText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, { backgroundColor: "red" }]} onPress={refuseCall}>
              <Text style={styles.btnText}>Decline</Text>
            </TouchableOpacity>
          </>
        )}

        {callState === "calling" && (
          <Text style={{ color: "#fff", marginVertical: 10 }}>Calling {calleeName || "user"}...</Text>
        )}

        {(callState === "in-call" || callState === "calling") && (
          <>
            <TouchableOpacity style={styles.smallBtn} onPress={toggleMute}>
              <Text style={styles.btnText}>{isMuted ? "Unmute" : "Mute"}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.smallBtn} onPress={switchCamera}>
              <Text style={styles.btnText}>Switch</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.btn, { backgroundColor: "red" }]} onPress={() => hangUp(false)}>
              <Text style={styles.btnText}>Hang Up</Text>
            </TouchableOpacity>
          </>
        )}

        {callState === "ended" && (
          <TouchableOpacity style={styles.btn} onPress={() => navigation.goBack?.()}>
            <Text style={styles.btnText}>Back</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 8 },
  status: { color: "#fff", textAlign: "center", marginVertical: 6 },
  videoContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  remoteVideo: { width: "100%", height: "100%" },
  remotePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
  },
  localVideo: {
    width: 120,
    height: 160,
    position: "absolute",
    top: 20,
    right: 10,
    zIndex: 10,
    borderRadius: 8,
    overflow: "hidden",
  },
  controls: { padding: 12, alignItems: "center" },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    marginVertical: 8,
    backgroundColor: "#444",
  },
  smallBtn: {
    padding: 10,
    borderRadius: 16,
    backgroundColor: "#333",
    marginVertical: 6,
  },
  btnText: { color: "#fff", fontWeight: "600" },
});
