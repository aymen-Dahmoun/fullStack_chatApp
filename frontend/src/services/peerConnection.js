import {
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
} from "react-native-webrtc";

export function createPeerConnection({
  iceServers = [],
  onTrack,
  onIceCandidate,
  onConnectionStateChange,
} = {}) {
  const pc = new RTCPeerConnection({
    iceServers,
    iceCandidatePoolSize: 10,
  });

  pc.ontrack = (event) => {
    if (typeof onTrack === "function") onTrack(event);
  };

  pc.onicecandidate = (ev) => {
    if (ev.candidate && typeof onIceCandidate === "function") {
      onIceCandidate(ev.candidate);
    }
  };

  pc.onconnectionstatechange = () => {
    if (typeof onConnectionStateChange === "function") {
      onConnectionStateChange(pc.connectionState);
    }
  };

  return {
    pc,
    async addLocalStream(stream) {
      if (!stream) return;
      const existingSenders = pc.getSenders ? pc.getSenders() : [];
      const tracks = stream.getTracks();
      for (const track of tracks) {
        const exists = existingSenders.some(
          (s) => s.track && s.track.kind === track.kind,
        );
        if (!exists) pc.addTrack(track, stream);
      }
    },
    async createOffer() {
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      await pc.setLocalDescription(offer);
      return offer;
    },
    async createAnswer() {
      const answer = await pc.createAnswer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      await pc.setLocalDescription(answer);
      return answer;
    },
    async setRemoteDescription(desc) {
      await pc.setRemoteDescription(new RTCSessionDescription(desc));
    },
    async addIceCandidate(candidate) {
      try {
        if (!pc.remoteDescription) {
          throw new Error("Remote description is null");
        }
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        throw err;
      }
    },
    close() {
      try {
        pc.ontrack = null;
        pc.onicecandidate = null;
        pc.onconnectionstatechange = null;
        pc.oniceconnectionstatechange = null;
        pc.onicegatheringstatechange = null;
        pc.close();
      } catch (e) {
        console.error("Error closing peer connection:", e);
      }
    },
  };
}
