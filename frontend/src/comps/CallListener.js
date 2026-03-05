import { useEffect } from "react";
import { useSocket } from "../context/socketContext";
import { useNavigation } from "@react-navigation/native";

export default function CallListener() {
  const { incomingCall, setIncomingCall } = useSocket();
  const navigation = useNavigation();

  useEffect(() => {
    console.log("Incoming call:", incomingCall);

    if (!incomingCall) return;
    console.log("Incoming call:", incomingCall);

    navigation.navigate("Call", {
      offer: incomingCall,
      isCaller: false,
    });
    setIncomingCall(null);
  }, [incomingCall]);

  return null;
}
