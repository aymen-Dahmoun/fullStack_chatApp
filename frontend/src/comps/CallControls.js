import React, { useEffect, useState } from "react";
import { View, Pressable, Text, Alert } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function CallControls({ call, onEndCall, isDark }) {
  const [muted, setMuted] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [speakerOn, setSpeakerOn] = useState(true);

  useEffect(() => {
    if (!call?.localStream) {
      setVideoEnabled(false);
      return;
    } else {
      setVideoEnabled(true);
    }

    try {
      const aud = call.localStream?.getAudioTracks?.()[0];
      if (aud) setMuted(!aud.enabled);
    } catch (e) {}
  }, [call?.localStream]);

  const toggleMute = () => {
    const newMuted = !muted;
    setMuted(newMuted);
    try {
      call.localStream?.getAudioTracks().forEach((t) => {
        t.enabled = !newMuted;
      });
    } catch (e) {}
  };

  const toggleVideo = () => {
    const newVideoEnabled = !videoEnabled;
    setVideoEnabled(newVideoEnabled);
    try {
      call.localStream?.getVideoTracks().forEach((t) => {
        t.enabled = newVideoEnabled;
      });
    } catch (e) {}
  };

  const switchCamera = () => {
    try {
      const vt = call.localStream?.getVideoTracks?.()[0];
      if (vt && typeof vt._switchCamera === "function") {
        vt._switchCamera();
        return;
      }
      Alert.alert("Switch camera", "Not available.");
    } catch (e) {
      Alert.alert("Switch camera failed", String(e));
    }
  };

  const toggleSpeaker = () => {
    setSpeakerOn(!speakerOn);
  };

  return (
    <View
      className="px-6 py-6 border-t"
      style={{ borderColor: isDark ? "#0b0b0b" : "#eee" }}
    >
      <View className="flex-row items-center justify-around w-full">
        <Pressable onPress={toggleMute} className="items-center">
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#0c5991",
              backgroundColor: muted ? "#1f2937" : "transparent",
            }}
          >
            <FontAwesome
              name={muted ? "microphone-slash" : "microphone"}
              size={22}
              color={muted ? "#fff" : "#0c5991"}
            />
          </View>
          <Text
            className={`mt-2 text-xs ${isDark ? "text-slate-300" : "text-slate-600"}`}
          >
            Mute
          </Text>
        </Pressable>

        <Pressable onPress={toggleVideo} className="items-center">
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#0c5991",
              backgroundColor: videoEnabled ? "transparent" : "#1f2937",
            }}
          >
            <FontAwesome
              name="video-camera"
              size={22}
              color={videoEnabled ? "#0c5991" : "#fff"}
            />
          </View>
          <Text
            className={`mt-2 text-xs ${isDark ? "text-slate-300" : "text-slate-600"}`}
          >
            Video
          </Text>
        </Pressable>

        <Pressable onPress={switchCamera} className="items-center">
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#0c5991",
            }}
          >
            <FontAwesome name="exchange" size={22} color="#0c5991" />
          </View>
          <Text
            className={`mt-2 text-xs ${isDark ? "text-slate-300" : "text-slate-600"}`}
          >
            Switch
          </Text>
        </Pressable>

        <Pressable onPress={toggleSpeaker} className="items-center">
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#0c5991",
              backgroundColor: speakerOn ? "transparent" : "#1f2937",
            }}
          >
            <FontAwesome
              name={speakerOn ? "volume-up" : "volume-off"}
              size={22}
              color={speakerOn ? "#0c5991" : "#fff"}
            />
          </View>
          <Text
            className={`mt-2 text-xs ${isDark ? "text-slate-300" : "text-slate-600"}`}
          >
            Speaker
          </Text>
        </Pressable>
      </View>

      <View className="items-center mt-8">
        <Pressable
          onPress={onEndCall}
          style={{
            width: 75,
            height: 75,
            borderRadius: 37.5,
            backgroundColor: "#ef4444",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FontAwesome name="phone" size={26} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}
