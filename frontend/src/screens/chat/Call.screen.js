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
import { IconButton, Button } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useSocket } from "../../hooks/useSocket";
import { useCall } from "../../hooks/useCall";

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

    if (call.toggleMute) {
      try {
        call.toggleMute(newMuted);
        return;
      } catch (e) {}
    }

    try {
      call.localStream?.getAudioTracks().forEach((t) => {
        t.enabled = !newMuted;
      });
    } catch (e) {}
  };

  const toggleVideo = () => {
    const newVideoEnabled = !videoEnabled;
    setVideoEnabled(newVideoEnabled);

    if (call.toggleVideo) {
      try {
        call.toggleVideo(newVideoEnabled);
        return;
      } catch (e) {}
    }

    try {
      call.localStream?.getVideoTracks().forEach((t) => {
        t.enabled = newVideoEnabled;
      });
    } catch (e) {}
  };

  const switchCamera = () => {
    if (call.switchCamera) {
      call.switchCamera().catch((e) => {
        Alert.alert("Switch camera failed", String(e));
      });
      return;
    }

    try {
      const vt = call.localStream?.getVideoTracks?.()[0];
      if (vt && typeof vt._switchCamera === "function") {
        vt._switchCamera();
        return;
      }
      Alert.alert("Switch camera", "Switch camera is not available.");
    } catch (e) {
      Alert.alert("Switch camera failed", String(e));
    }
  };

  const toggleSpeaker = () => {
    const newSpeaker = !speakerOn;
    setSpeakerOn(newSpeaker);

    if (call.toggleSpeaker) {
      call.toggleSpeaker(newSpeaker).catch(() => {});
      return;
    }
  };

  const answerCall = async () => {
    if (call.answerCall) return call.answerCall();
    Alert.alert("Answer", "No answer handler available.");
  };

  const endCall = async () => {
    if (call.endCall) {
      call.endCall();
    } else {
      navigation.goBack();
    }
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
          <IconButton
            icon="arrow-left"
            mode="contained"
            size={22}
            onPress={() => navigation.goBack()}
            style={{ backgroundColor: "transparent" }}
            iconColor={isDark ? "#fff" : "#0c5991"}
          />
          <View>
            <Text
              className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-800"}`}
            >
              Call
            </Text>
            <Text
              className={`text-xs ${isDark ? "text-slate-300" : "text-slate-500"}`}
            >
              {statusLabel}
            </Text>
          </View>
        </View>

        <View className="items-end">
          <Text
            className={`text-xs ${isDark ? "text-slate-300" : "text-slate-500"}`}
          >
            Calling: <Text className="font-medium">{peerName}</Text>
          </Text>
        </View>
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
            <View
              className="absolute top-4 left-4 px-3 py-1 rounded-full"
              style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
            >
              <Text className="text-sm text-white">
                {call.incomingOffer?.fromUsername || "Remote"}
              </Text>
            </View>
          </View>
        ) : (
          <View className="w-full h-full items-center justify-center">
            <View className="items-center">
              <ActivityIndicator size="large" />
              <Text
                className={`mt-4 ${isDark ? "text-slate-300" : "text-slate-600"}`}
              >
                Waiting for remote video...
              </Text>
            </View>
          </View>
        )}

        {call.localStream && (
          <View className="absolute top-4 right-4">
            <Pressable
              onPress={() => {
                Alert.alert("Preview", "Local preview tapped.");
              }}
            >
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
            </Pressable>
          </View>
        )}
      </View>

      {call.incomingOffer && !route?.params?.isCaller && (
        <View className="px-6 pb-4">
          <View className="bg-slate-100 dark:bg-neutral-900 p-3 rounded-lg flex-row items-center justify-between">
            <View>
              <Text
                className={`${isDark ? "text-white" : "text-slate-800"} font-semibold`}
              >
                Incoming call
              </Text>
              <Text
                className={`${isDark ? "text-slate-300" : "text-slate-500"} text-sm`}
              >
                {call.incomingOffer.fromUsername || "Caller"}
              </Text>
            </View>

            <View className="flex-row">
              <Button
                mode="contained"
                onPress={answerCall}
                labelStyle={{ color: "#fff" }}
                style={{ marginRight: 8, backgroundColor: "#0c5991" }}
                icon="phone"
              >
                Answer
              </Button>

              <Button
                mode="outlined"
                onPress={endCall}
                labelStyle={{ color: isDark ? "#ff6b6b" : "#ef4444" }}
                style={{ borderColor: isDark ? "#3b3b3b" : "#ef4444" }}
                icon="phone-hangup"
              >
                Decline
              </Button>
            </View>
          </View>
        </View>
      )}

      <View
        className="px-6 py-4 border-t"
        style={{ borderColor: isDark ? "#0b0b0b" : "#eee" }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row space-x-2">
            <IconButton
              icon={muted ? "microphone-off" : "microphone"}
              size={24}
              mode="contained"
              onPress={toggleMute}
              style={{
                backgroundColor: muted ? "#1f2937" : "transparent",
                borderColor: "#0c5991",
                borderWidth: 1,
              }}
              iconColor={muted ? "#fff" : "#0c5991"}
            />

            <IconButton
              icon={videoEnabled ? "video" : "video-off"}
              size={24}
              mode="contained"
              onPress={toggleVideo}
              style={{
                backgroundColor: videoEnabled ? "transparent" : "#1f2937",
                borderColor: "#0c5991",
                borderWidth: 1,
              }}
              iconColor={videoEnabled ? "#0c5991" : "#fff"}
            />

            <IconButton
              icon="camera-switch"
              size={24}
              mode="contained"
              onPress={switchCamera}
              style={{
                backgroundColor: "transparent",
                borderColor: "#0c5991",
                borderWidth: 1,
              }}
              iconColor="#0c5991"
            />

            <IconButton
              icon={speakerOn ? "speaker" : "speaker-off"}
              size={24}
              mode="contained"
              onPress={toggleSpeaker}
              style={{
                backgroundColor: speakerOn ? "transparent" : "#1f2937",
                borderColor: "#0c5991",
                borderWidth: 1,
              }}
              iconColor={speakerOn ? "#0c5991" : "#fff"}
            />
          </View>

          <View>
            <Button
              mode="contained"
              onPress={endCall}
              icon="phone-hangup"
              style={{ backgroundColor: "#ef4444", paddingHorizontal: 18 }}
              labelStyle={{ color: "#fff" }}
            >
              End
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
