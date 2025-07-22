import { View, Text } from "react-native";
import { Icon, TextInput } from "react-native-paper";

export default function Message({ content, senderName, isSignedUser, timestamp, isPending }) {
  return (
    <View
      className={`max-w-[80%] my-1 p-2 rounded-xl ${
        isSignedUser ? "bg-blue-600 self-end" : "bg-neutral-500 self-start"
      }`}
    >
      {!isSignedUser && (
        <Text className="text-white text-xs mb-1 font-bold">{senderName}</Text>
      )}
      <Text className="text-white text-sm">{content}</Text>
      <Text className="text-gray-300 text-[10px] text-right mt-1">
        {new Date(timestamp).toLocaleTimeString()}
      </Text>
      {isPending && isSignedUser && (<Icon source="upload" color="#64748b" size={2} />)}
    </View>
  );
}
