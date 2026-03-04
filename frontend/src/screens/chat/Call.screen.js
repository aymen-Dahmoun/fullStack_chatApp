import React, { useMemo } from "react";
import { SafeAreaView, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";

import { useSocket } from "../../context/socketContext";
import { useCall } from "../../hooks/useCall";

import CallHeader from "../../comps/CallHeader";
import VideoStage from "../../comps/VideoStage";
import IncomingCallBanner from "../../comps/IncomingCallBanner";
import CallControls from "../../comps/CallControls";

export default function CallScreen({ route, navigation }) {
  const { socket, isConnected } = useSocket();
  const call = useCall({ route, navigation, socket, isConnected });

  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const peerName = route?.params?.peerName || "Unknown User";

  const statusLabel = useMemo(() => {
    if (!isConnected) return "Disconnected";
    if (call?.callStatus) return call.callStatus;
    return "Idle";
  }, [isConnected, call?.callStatus]);

  return (
    <SafeAreaView className={`flex-1 ${isDark ? "bg-black" : "bg-white"}`}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <CallHeader
        onBack={() => navigation.goBack()}
        statusLabel={statusLabel}
        peerName={peerName}
        isDark={isDark}
      />

      <View className="flex-1">
        <VideoStage
          remoteStream={call?.remoteStream}
          localStream={call?.localStream}
          isDark={isDark}
        />

        {call?.incomingOffer && !route?.params?.isCaller && (
          <IncomingCallBanner
            incomingOffer={call.incomingOffer}
            onAnswer={() => call.answerCall?.()}
            onDecline={() => {
              if (call.endCall) call.endCall();
              else navigation.goBack();
            }}
            isDark={isDark}
          />
        )}
      </View>

      <CallControls
        call={call}
        onEndCall={() => {
          if (call.endCall) call.endCall();
          else navigation.goBack();
        }}
        isDark={isDark}
      />
    </SafeAreaView>
  );
}
