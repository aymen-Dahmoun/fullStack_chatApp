import React from "react";
import { View, Text, Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function CallHeader({ onBack, statusLabel, peerName, isDark }) {
  return (
    <View
      className="flex-row items-center justify-between px-4 py-3 border-b"
      style={{ borderColor: isDark ? "#111" : "#e6e6e6" }}
    >
      <View className="flex-row items-center">
        <Pressable onPress={onBack} className="p-2">
          <FontAwesome
            name="arrow-left"
            size={22}
            color={isDark ? "#fff" : "#0c5991"}
          />
        </Pressable>

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

      <Text
        className={`text-xs ${isDark ? "text-slate-300" : "text-slate-500"}`}
      >
        Calling: <Text className="font-medium">{peerName}</Text>
      </Text>
    </View>
  );
}
