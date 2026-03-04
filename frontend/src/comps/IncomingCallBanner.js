import React from "react";
import { View, Text, Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function IncomingCallBanner({
  incomingOffer,
  onAnswer,
  onDecline,
  isDark,
}) {
  return (
    <View className="px-6 pb-4">
      <View className="p-4 rounded-lg bg-slate-100 dark:bg-neutral-900">
        <Text
          className={`font-semibold ${isDark ? "text-white" : "text-slate-800"}`}
        >
          Incoming call
        </Text>

        <Text
          className={`text-sm mb-3 ${isDark ? "text-slate-300" : "text-slate-500"}`}
        >
          {incomingOffer?.fromUsername || "Caller"}
        </Text>

        <View className="flex-row space-x-4">
          <Pressable
            onPress={onAnswer}
            className="px-4 py-2 rounded-full flex-row items-center"
            style={{ backgroundColor: "#0c5991" }}
          >
            <FontAwesome name="phone" size={16} color="#fff" />
            <Text className="text-white ml-2">Answer</Text>
          </Pressable>

          {/* <Pressable
            onPress={onDecline}
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
          </Pressable>*/}
        </View>
      </View>
    </View>
  );
}
