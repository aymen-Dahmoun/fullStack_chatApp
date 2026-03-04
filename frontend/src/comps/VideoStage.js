import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { RTCView } from "react-native-webrtc";

export default function VideoStage({ remoteStream, localStream, isDark }) {
  return (
    <View className="flex-1 items-center justify-center px-4">
      {remoteStream ? (
        <View className="w-full h-full items-center justify-center">
          <RTCView
            streamURL={remoteStream.toURL()}
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

      {localStream && (
        <View className="absolute top-4 right-4">
          <RTCView
            streamURL={localStream.toURL()}
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
  );
}
