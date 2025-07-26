import React, { useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import useConversation from "../../hooks/useConversation";
import ChatElement from "../../comps/ChatElement";
import AuthBackground from "../../comps/AuthBackground";
import SearchBar from "../../comps/SearchBar"; // ✅ import your search bar
import bg_image from '../../../assets/wwwhirl.png';

export default function ListScreen() {
  const { data, loading, error } = useConversation();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = data?.filter(item =>
    item.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading)
    return <ActivityIndicator size={80} className="dark:bg-black h-screen" />;
  if (error)
    return (
      <Text className="text-red-500 text-center mt-4">
        Error loading conversations
      </Text>
    );

  return (
    <View className="flex-1 bg-white px-2 pt-20 dark:bg-black">
      <AuthBackground
        secondImage={bg_image}
        mainImage={bg_image}
        thirdImage={bg_image}
      />
      
      {/* ✅ Search Bar Above FlatList */}
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.conversationId}
        renderItem={({ item }) => <ChatElement item={item} />}
        ListHeaderComponent={() => (
          <View>
            <Text className="text-5xl font-medium text-left p-1 pl-4 pb-2 dark:text-white">
              Conversations
            </Text>
            <Text className="text-3xl font-light text-left p-1 pl-6 pb-4 dark:text-white">
              Recent Messages
            </Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
