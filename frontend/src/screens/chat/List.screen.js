import React from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import useConversation from "../../hooks/useConversation";
import { SafeAreaView } from "react-native-safe-area-context";
import { Divider } from "react-native-paper";
import ChatElement from "../../comps/ChatElement";

export default function ListScreen() {
  const { data, loading, error } = useConversation();

  if (loading) return <ActivityIndicator className="mt-10" />;
  if (error) return <Text className="text-red-500 text-center mt-4">Error loading conversations</Text>;

  return (
    <SafeAreaView className="flex-1 bg-white px-2">
      <FlatList
        data={data}
        keyExtractor={(item) => item.conversationId}
        renderItem={({ item }) => <ChatElement item={item} />}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}
