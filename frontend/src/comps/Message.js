import { View, Text } from "react-native";

export default function Message({ content, senderName, isSignedUser, timestamp }) {
  return (
    <View
      className={`max-w-[80%] my-3 p-2 rounded-xl ${
        isSignedUser ? "bg-sky-600 self-end dark:bg-slate-700" : "bg-blue-100 self-start dark:bg-slate-800"
      }`}
    >
      {!isSignedUser && (
        <Text className='text-xl mb-1 font-bold dark:text-neutral-200'>{senderName}</Text>
      )}
      <Text className={` text-lg font-medium
        ${isSignedUser ? 'text-white' : 'text-black dark:text-neutral-200'}
        `}>{content}</Text>
      <Text className={`text-gray-300 text-[10px] text-right mt-1
          ${isSignedUser ? 'text-neutral-200' : 'text-neutral-700 dark:text-neutral-200'}
        `}>
        {new Date(timestamp).toLocaleTimeString()}
      </Text>
    </View>
  );
}
