import { useCallback, useEffect, useRef, useState } from "react";
import { createPeerConnection } from "../services/peerConnection";
import { getLocalStream } from "../services/media";
import { ICE_SERVERS } from "../api/iceServers";

export function useCall({ route, navigation, socket, isConnected }) {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [callStatus, setCallStatus] = useState("idle");
  const [incomingOffer, setIncomingOffer] = useState(
    route?.params?.offer || null,
  );

  const pcServiceRef = useRef(null);
  const peerIdRef = useRef(route?.params?.peerId || null);
  const isCaller = route?.params?.isCaller || false;
  const hasRemoteDescriptionRef = useRef(false);
  const startInProgressRef = useRef(false);
  const callActiveRef = useRef(false);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const pendingIceCandidatesRef = useRef([]);

  const setupPeerConnection = useCallback(() => {
    if (pcServiceRef.current) return pcServiceRef.current;

    const svc = createPeerConnection({
      iceServers: ICE_SERVERS,
      onTrack: (event) => {
        const stream = event.streams && event.streams[0];
        remoteStreamRef.current = stream;
        setRemoteStream(stream);
      },
      onIceCandidate: (candidate) => {
        if (candidate && socket && peerIdRef.current) {
          socket.emit("ice-candidate", {
            to: peerIdRef.current,
            candidate,
          });
        }
      },
      onConnectionStateChange: (state) => {
        console.log("connection state:", state);
        if (state === "connected") {
          setCallStatus("in-call");
        } else if (state === "connecting") {
          setCallStatus("connecting");
        } else if (state === "failed") {
          endCall();
        } else if (
          state === "disconnected" &&
          hasRemoteDescriptionRef.current
        ) {
          console.warn("Connection disconnected");
          setTimeout(() => {
            if (pcServiceRef.current?.pc?.connectionState === "disconnected") {
              console.log("Still disconnected after timeout, ending call");
              endCall();
            }
          }, 5000); // 5 seconds to reconnect
        }
      },
    });

    pcServiceRef.current = svc;
    return svc;
  }, [socket]);

  const attachLocalStream = useCallback(async () => {
    if (localStreamRef.current) {
      if (pcServiceRef.current) {
        await pcServiceRef.current.addLocalStream(localStreamRef.current);
      }
      return localStreamRef.current;
    }

    const stream = await getLocalStream({ video: true, audio: true });
    localStreamRef.current = stream;
    setLocalStream(stream);

    if (pcServiceRef.current) {
      await pcServiceRef.current.addLocalStream(stream);
    }

    return stream;
  }, []);

  const startCall = useCallback(async () => {
    if (startInProgressRef.current) return;
    startInProgressRef.current = true;

    if (!socket || !peerIdRef.current) {
      console.warn("Missing socket or peerId");
      setCallStatus("error");
      startInProgressRef.current = false;
      return;
    }

    if (!isConnected) {
      setCallStatus("waiting-socket");
      startInProgressRef.current = false;
      return;
    }

    try {
      setCallStatus("calling");
      callActiveRef.current = true;

      setupPeerConnection();
      await attachLocalStream();

      const offer = await pcServiceRef.current.createOffer();
      socket.emit("offer", { to: peerIdRef.current, offer });
      console.log("Offer sent to:", peerIdRef.current);
    } catch (err) {
      console.error("startCall failed:", err);
      setCallStatus("error");
      callActiveRef.current = false;
    } finally {
      startInProgressRef.current = false;
    }
  }, [socket, isConnected, setupPeerConnection, attachLocalStream]);

  const answerCall = useCallback(async () => {
    if (!socket || !incomingOffer) return;
    try {
      peerIdRef.current = incomingOffer.from;
      setCallStatus("answering");
      callActiveRef.current = true;

      setupPeerConnection();
      await attachLocalStream();

      await pcServiceRef.current.setRemoteDescription(incomingOffer.offer);
      hasRemoteDescriptionRef.current = true;

      if (pendingIceCandidatesRef.current.length > 0) {
        for (const candidate of pendingIceCandidatesRef.current) {
          await pcServiceRef.current.addIceCandidate(candidate);
        }
        pendingIceCandidatesRef.current = [];
      }

      const answer = await pcServiceRef.current.createAnswer();
      socket.emit("answer", { to: incomingOffer.from, answer });

      setIncomingOffer(null);
      setCallStatus("in-call");
      console.log("Answer sent to:", incomingOffer.from);
    } catch (err) {
      console.error("answerCall failed:", err);
      setCallStatus("error");
      callActiveRef.current = false;
    }
  }, [socket, incomingOffer, setupPeerConnection, attachLocalStream]);

  const cleanup = useCallback(() => {
    if (pcServiceRef.current) {
      pcServiceRef.current.close();
      pcServiceRef.current = null;
    }

    if (localStreamRef.current) {
      try {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
      } catch (e) {}
      localStreamRef.current = null;
    }

    if (remoteStreamRef.current) {
      try {
        remoteStreamRef.current.getTracks().forEach((t) => t.stop());
      } catch (e) {}
      remoteStreamRef.current = null;
    }

    setLocalStream(null);
    setRemoteStream(null);

    pendingIceCandidatesRef.current = [];
    hasRemoteDescriptionRef.current = false;

    if (callActiveRef.current) {
      setCallStatus("ended");
      callActiveRef.current = false;
    }
  }, []);

  const endCall = useCallback(() => {
    if (socket && peerIdRef.current) {
      socket.emit("end-call", { to: peerIdRef.current });
    }
    cleanup();
    if (navigation?.goBack) navigation.goBack();
  }, [socket, navigation, cleanup]);

  useEffect(() => {
    if (!socket) return;

    const handleOffer = (data) => {
      console.log("Offer received:", data?.from);
      if (callStatus === "in-call") {
        socket.emit("reject-call", { to: data.from, reason: "busy" });
        return;
      }
      peerIdRef.current = data.from;
      setIncomingOffer(data);
      setCallStatus("incoming");
    };

    const handleAnswer = async (data) => {
      console.log("Answer received from:", data?.from);
      if (!pcServiceRef.current) return;
      try {
        await pcServiceRef.current.setRemoteDescription(data.answer);
        hasRemoteDescriptionRef.current = true;

        if (pendingIceCandidatesRef.current.length > 0) {
          console.log(
            `Processing ${pendingIceCandidatesRef.current.length} pending ICE candidates`,
          );
          for (const candidate of pendingIceCandidatesRef.current) {
            await pcServiceRef.current.addIceCandidate(candidate);
          }
          pendingIceCandidatesRef.current = [];
        }

        setCallStatus("in-call");
      } catch (err) {
        console.error("Failed to set remote description", err);
      }
    };

    const handleIce = async (data) => {
      if (!pcServiceRef.current || !data?.candidate) return;

      if (!hasRemoteDescriptionRef.current) {
        console.log("Queuing ICE candidate (remote description not set yet)");
        pendingIceCandidatesRef.current.push(data.candidate);
        return;
      }

      await pcServiceRef.current.addIceCandidate(data.candidate);
    };

    const handleCallEnded = () => {
      cleanup();
      if (navigation?.goBack) navigation.goBack();
    };

    const handleCallRejected = () => {
      cleanup();
      if (navigation?.goBack) navigation.goBack();
    };

    const handleUserOffline = () => {
      cleanup();
      if (navigation?.goBack) navigation.goBack();
    };

    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleIce);
    socket.on("call-ended", handleCallEnded);
    socket.on("call-rejected", handleCallRejected);
    socket.on("user-offline", handleUserOffline);

    return () => {
      socket.off("offer", handleOffer);
      socket.off("answer", handleAnswer);
      socket.off("ice-candidate", handleIce);
      socket.off("call-ended", handleCallEnded);
      socket.off("call-rejected", handleCallRejected);
      socket.off("user-offline", handleUserOffline);
    };
  }, [socket, cleanup, navigation, callStatus]);

  useEffect(() => {
    if (isCaller && isConnected) startCall();
  }, [isCaller, isConnected, startCall]);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  return {
    localStream,
    remoteStream,
    callStatus,
    incomingOffer,
    peerId: peerIdRef.current,
    socketId: socket?.id,
    startCall,
    answerCall,
    endCall,
    setIncomingOffer,
  };
}
