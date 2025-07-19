import React from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import useConversation from "../../hooks/useConversation";

export default function ListScreen() {
  const { data, loading, error } = useConversation();

  if (loading) return <ActivityIndicator className="mt-10" />;
  if (error) return <Text className="text-red-500 text-center mt-4">Error loading conversations</Text>;

  const renderItem = ({ item }) => {
    const username = item.lastMessage?.sender?.username || "Unknown";
    const message = item.lastMessage?.content || "No messages yet";
    const time = item.lastMessage?.createdAt || item.updatedAt;

    return (
      <View className="flex-row justify-between items-center bg-white p-4 m-2 rounded-2xl shadow-md">
        <View className="flex-1 pr-2">
          <Text className="text-lg font-semibold text-gray-900">
            {username}
          </Text>
          <Text className="text-sm text-gray-500" numberOfLines={1}>
            {message}
          </Text>
        </View>
        <Text className="text-xs text-gray-400">
          {formatTime(time)}
        </Text>
      </View>
    );
  };

  const formatTime = (isoTime) => {
    const date = new Date(isoTime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View className="flex-1 bg-gray-100 px-2">
      <FlatList
        data={data}
        keyExtractor={(item) => item.conversationId}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
