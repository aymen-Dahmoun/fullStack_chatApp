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
import { useColorScheme } from "nativewind";
import ProfileIcon from "../../comps/ProfileIcon";
import { createConversation } from "../../utils/createConversation.utils";

export default function ChatScreen({ route }) {
  const conversationId = route?.params?.conversationId || '';
  const messenger = route?.params?.messenger;
  const messengerUsername = route?.params?.messenger?.username || "Unknown";
  const setConversation = route?.params?.messenger?.setConversation


  const { data: messages, loading, setMessages } = useChat(conversationId);
  const { user } = useAuth();
  const { socket } = useSocket();

  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const flatListRef = useRef(null);
  const { colorScheme } = useColorScheme();
  const [newConversation, setNewConversation] = useState(conversationId === '')

  useEffect(() => {
    if (!socket || !conversationId) return;

const handleIncomingMessage = (incoming) => {
  console.log('sent: ', incoming);
  console.log(incoming.conversationId !== conversationId)

  
  if (incoming.conversationId !== conversationId) return;

  const isOwnMessage = incoming.sender?.id === user.id;

  setMessages((prev) => {
    if (prev.some((msg) => msg.id === incoming.id)) return prev;

    if (isOwnMessage) {

      return prev.map((msg) =>
        msg.tempId && msg.content === incoming.content
          ? { ...incoming, isPending: false }
          : msg
      );
    }

    return [incoming, ...prev];
  });

  setIsSending(false);
};


    socket.on("chat message", handleIncomingMessage);

    return () => {
      socket.off("chat message", handleIncomingMessage);
    };
  }, [socket, conversationId]);

const handleSend = useCallback(async () => {
  const content = newMessage.trim();
  if (!socket || !content || isSending) return;

  setIsSending(true);

  let finalConversationId = conversationId;

  if (!conversationId || messages.length === 0) {
    try {
      const response = await createConversation({ userId: user.id, messengerId: messenger.id });
      finalConversationId = response.conversation.id;
      route.params.conversationId = finalConversationId;
    } catch (err) {
      console.error("Failed to create conversation:", err);
      setIsSending(false);
      return;
    }
  }

  const tempId = `${Date.now()}-${Math.random()}`;
  const tempMessage = {
    content,
    conversationId: finalConversationId,
    receiverId: messenger.id,
    sender: { id: user.id, username: user.username },
    createdAt: new Date().toISOString(),
    tempId,
    isPending: true,
  };

  setMessages((prev) => [tempMessage, ...prev]);
  setNewMessage("");
  if(!newConversation) {
    setNewConversation(false);
  }

  socket.emit("chat message", {
    content,
    conversationId: finalConversationId,
    receiverId: messenger.id,
  });
}, [socket, conversationId, messenger, newMessage, isSending, messages]);

  if (!user?.id) {
    return (
      <View className="flex-1 items-center justify-center">
        <Icon source="alert-circle" color="#dc2626" size={60} />
        <Text className="text-red-500 text-lg mt-2">Failed to load conversation</Text>
      </View>
    );
  }

  return (
<View className="flex-1 bg-white mt-6 dark:bg-gray-950">
  <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={{ flex: 1 }}
    keyboardVerticalOffset={Platform.OS === "android" ? 20 : 0}
  >

    <View className="flex-row items-center gap-4 px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <ProfileIcon username={messengerUsername} size={40} />
      <View>
        <Text className="text-base font-semibold text-gray-800 dark:text-gray-100">
          {messengerUsername}
        </Text>
      </View>
    </View>

    {loading && messages.length === 0 && !newConversation ? (
      <View className="flex-1 items-center justify-center bg-inherit">
        <ActivityIndicator size="large" color="#007aff" className='bg-inherit' />
      </View>
    ) : (
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id?.toString() || item.tempId}
        contentContainerStyle={{ padding: 12, flexGrow: 1 }}
        inverted={!newConversation}
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

    {/* MESSAGE INPUT */}
    <View className="flex-row items-center p-3 bg-white border-t border-gray-200 dark:bg-gray-950 dark:border-neutral-700">
      <TextInput
        style={{
          borderWidth: 0.5,
          fontSize: 18,
          color: "rgb(250,250,250)",
        }}
        className="flex-1 border-neutral-400 rounded-lg p-4 mr-5"
        placeholder="Type a message..."
        placeholderTextColor={colorScheme === "dark" ? "#9ca3af" : "#edf1f7"}
        value={newMessage}
        onChangeText={setNewMessage}
        multiline
        textAlignVertical="center"
      />

      <TouchableOpacity
        onPress={handleSend}
        disabled={!newMessage.trim() || isSending}
        className={`px-5 py-3 rounded-full ${
          newMessage.trim() && !isSending
            ? "bg-sky-700 dark:bg-slate-700"
            : "bg-gray-300"
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
</View>
  );
}
