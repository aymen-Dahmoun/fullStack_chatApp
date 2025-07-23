import { View, Text } from "react-native";

export default function Message({ content, senderName, isSignedUser, timestamp }) {
  return (
    <View
      className={`max-w-[80%] my-3 p-2 rounded-xl ${
        isSignedUser ? "bg-sky-600 self-end" : "bg-blue-100 self-start"
      }`}
    >
      {!isSignedUser && (
        <Text className='text-xl mb-1 font-bold'>{senderName}</Text>
      )}
      <Text className={` text-lg font-medium
        ${isSignedUser ? 'text-white' : 'text-black'}
        `}>{content}</Text>
      <Text className={`text-gray-300 text-[10px] text-right mt-1
          ${isSignedUser ? 'text-neutral-200' : 'text-neutral-700'}
        `}>
        {new Date(timestamp).toLocaleTimeString()}
      </Text>
    </View>
  );
}
