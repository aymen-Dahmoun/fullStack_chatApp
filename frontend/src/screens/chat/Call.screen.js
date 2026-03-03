import React, { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ActivityIndicator,
  Pressable,
  Alert,
} from "react-native";
import { RTCView } from "react-native-webrtc";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useSocket } from "../../hooks/useSocket";
import { useCall } from "../../hooks/useCall";
import { FontAwesome } from "@expo/vector-icons";

export default function CallScreen({ route, navigation }) {
  const { socket, isConnected } = useSocket();
  const call = useCall({ route, navigation, socket, isConnected });

  const [muted, setMuted] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [speakerOn, setSpeakerOn] = useState(true);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const peerName = route?.params?.peerName || "Unknown User";

  const statusLabel = useMemo(() => {
    if (!isConnected) return "Disconnected";
    if (call.callStatus) return call.callStatus;
    return "Idle";
  }, [isConnected, call.callStatus]);

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

  const answerCall = () => {
    if (call.answerCall) call.answerCall();
  };

  const endCall = () => {
    if (call.endCall) call.endCall();
    else navigation.goBack();
  };

  useEffect(() => {
    if (!call.localStream) setVideoEnabled(false);
    else setVideoEnabled(true);

    try {
      const aud = call.localStream?.getAudioTracks?.()[0];
      if (aud) setMuted(!aud.enabled);
    } catch (e) {}
  }, [call.localStream]);

  return (
    <SafeAreaView className={`flex-1 ${isDark ? "bg-black" : "bg-white"}`}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <View
        className="flex-row items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: isDark ? "#111" : "#e6e6e6" }}
      >
        <View className="flex-row items-center">
          <Pressable onPress={() => navigation.goBack()} className="p-2">
            <FontAwesome
              name="arrow-left"
              size={22}
              color={isDark ? "#fff" : "#0c5991"}
            />
          </Pressable>

          <View>
            <Text
              className={`text-lg font-bold ${
                isDark ? "text-white" : "text-slate-800"
              }`}
            >
              Call
            </Text>
            <Text
              className={`text-xs ${
                isDark ? "text-slate-300" : "text-slate-500"
              }`}
            >
              {statusLabel}
            </Text>
          </View>
        </View>

        <Text
          className={`text-xs ${isDark ? "text-slate-300" : "text-slate-500"}`}
        >
          Calling: <Text className="font-medium">{peerName}</Text>
        </Text>
      </View>

      <View className="flex-1 items-center justify-center px-4">
        {call.remoteStream ? (
          <View className="w-full h-full items-center justify-center">
            <RTCView
              streamURL={call.remoteStream.toURL()}
              objectFit="cover"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 12,
                backgroundColor: "#000",
              }}
            />
          </View>
        ) : (
          <View className="items-center">
            <ActivityIndicator size="large" />
            <Text
              className={`mt-4 ${isDark ? "text-slate-300" : "text-slate-600"}`}
            >
              Waiting for remote video...
            </Text>
          </View>
        )}

        {call.localStream && (
          <View className="absolute top-4 right-4">
            <RTCView
              streamURL={call.localStream.toURL()}
              objectFit="cover"
              style={{
                width: 140,
                height: 190,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: isDark ? "#111827" : "#e6eef8",
                backgroundColor: "#111",
              }}
            />
          </View>
        )}
      </View>

      {call.incomingOffer && !route?.params?.isCaller && (
        <View className="px-6 pb-4">
          <View className="p-4 rounded-lg bg-slate-100 dark:bg-neutral-900">
            <Text
              className={`font-semibold ${
                isDark ? "text-white" : "text-slate-800"
              }`}
            >
              Incoming call
            </Text>

            <Text
              className={`text-sm mb-3 ${
                isDark ? "text-slate-300" : "text-slate-500"
              }`}
            >
              {call.incomingOffer.fromUsername || "Caller"}
            </Text>

            <View className="flex-row space-x-4">
              <Pressable
                onPress={answerCall}
                className="px-4 py-2 rounded-full flex-row items-center"
                style={{ backgroundColor: "#0c5991" }}
              >
                <FontAwesome name="phone" size={16} color="#fff" />
                <Text className="text-white ml-2">Answer</Text>
              </Pressable>

              <Pressable
                onPress={endCall}
                className="px-4 py-2 rounded-full flex-row items-center border"
                style={{ borderColor: "#ef4444" }}
              >
                <FontAwesome name="phone" size={16} color="#ef4444" />
                <Text
                  className="ml-2"
                  style={{ color: isDark ? "#ff6b6b" : "#ef4444" }}
                >
                  Decline
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

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
              className={`mt-2 text-xs ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
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
              className={`mt-2 text-xs ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
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
              className={`mt-2 text-xs ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
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
              className={`mt-2 text-xs ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Speaker
            </Text>
          </Pressable>
        </View>

        <View className="items-center mt-8">
          <Pressable
            onPress={endCall}
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
    </SafeAreaView>
  );
}
