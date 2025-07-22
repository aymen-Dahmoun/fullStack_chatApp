import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import useChat from "../../hooks/useChat";
import { useAuth } from "../../context/authContext";
import Message from "../../comps/Message";
import { useSocket } from "../../hooks/useSocket";
import { Icon } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import MainLayout from "../../comps/MainLayout";

export default function ChatScreen({ route }) {
  const conversationId = route?.params?.conversationId;
  const messengerId = route?.params?.messenger;

  const { data: messages, loading, setMessages } = useChat(conversationId);
  const { user } = useAuth();
  const { socket } = useSocket();

  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    if (!socket || !conversationId) return;

    const handleIncomingMessage = (incoming) => {
      if (incoming.conversationId !== conversationId) return;
      setMessages((prev) => {
        if (prev.some((msg) => msg.id === incoming.id)) return prev;
        return [incoming, ...prev];
      });
    };

    const handleMessageSent = (sent) => {
      if (sent.conversationId !== conversationId) return;
      setMessages((prev) =>
        prev.map((msg) => (msg.tempId === sent.tempId ? sent : msg))
      );
      setIsSending(false);
    };

    socket.on("chat message", handleIncomingMessage);
    socket.on("message sent", handleMessageSent);

    return () => {
      socket.off("chat message", handleIncomingMessage);
      socket.off("message sent", handleMessageSent);
    };
  }, [socket, conversationId]);

  const handleSend = useCallback(() => {
    const content = newMessage.trim();
    if (!socket || !content || isSending) return;

    const tempId = `${Date.now()}-${Math.random()}`;
    const tempMessage = {
      content,
      conversationId,
      receiverId: messengerId,
      sender: { id: user.id, username: user.username },
      createdAt: new Date().toISOString(),
      tempId,
      isPending: true,
    };

    setMessages((prev) => [tempMessage, ...prev]);
    setNewMessage("");
    setIsSending(true);

    socket.emit("chat message", { content, conversationId, receiverId: messengerId });
  }, [socket, conversationId, messengerId, newMessage, isSending]);

  if (!conversationId || !user?.id) {
    return (
      <View className="flex-1 items-center justify-center">
        <Icon source="alert-circle" color="#dc2626" size={60} />
        <Text className="text-red-500 text-lg mt-2">Failed to load conversation</Text>
      </View>
    );
  }

  return (
        <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "android" ? 120 : 120}
      >

        {loading && messages.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#007aff" />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id?.toString() || item.tempId}
            contentContainerStyle={{ padding: 12, flexGrow: 1 }}
            inverted
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <Message
              content={item.content}
              senderName={item.sender?.username || "Unknown"}
              isSignedUser={user.id === item.sender?.id}
              timestamp={item.createdAt}
              isPending={item.isPending}
              />
            )}
            ListEmptyComponent={() => (
              <View className="flex-1 items-center justify-center py-20">
                <Text className="text-gray-500 text-lg">No messages yet</Text>
              </View>
            )}
            />
        )}

        <View className="flex-row items-center p-3 bg-white border-t border-gray-200">
          <TextInput
            style={{
              borderWidth: 0.5,
              fontSize: 18,
            }}
            className="flex-1 border-neutral-400 rounded-lg p-4 mr-5"
            placeholder="Type a message..."
            placeholderTextColor="#9ca3af"
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            textAlignVertical="center"
            blurOnSubmit={false}
          />

          <TouchableOpacity
            onPress={handleSend}
            disabled={!newMessage.trim() || isSending}
            className={`px-5 py-3 rounded-full ${
              newMessage.trim() && !isSending ? "bg-sky-700" : "bg-gray-300"
            }`}
            >
            {isSending ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text
              className={`font-medium ${
                newMessage.trim() ? "text-white" : "text-gray-500"
              }`}
              >
                Send
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      </SafeAreaView>
  );
}
