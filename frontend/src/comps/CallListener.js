import { useEffect } from "react";
import { useSocket } from "../context/socketContext";
import { useNavigation } from "@react-navigation/native";

export default function CallListener() {
  const { socket } = useSocket();
  const navigation = useNavigation();

  useEffect(() => {
    console.log("CallListener here");
    if (!socket) return;

    const handleIncomingCall = (data) => {
      console.log("Incoming call:", data);

      navigation.navigate("Call", {
        incoming: true,
        callerData: data,
      });
    };

    socket.on("incoming call", handleIncomingCall);

    return () => {
      socket.off("incoming call", handleIncomingCall);
    };
  }, [socket]);

  return null;
}
