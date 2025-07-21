import React, { useEffect, useState, useCallback, useRef } from "react";
import { View, FlatList, Text, ActivityIndicator, TextInput, TouchableOpacity, Alert } from "react-native";
import useChat from "../../hooks/useChat";
import { useAuth } from "../../context/authContext";
import Message from "../../comps/Message";
import { useSocket } from "../../hooks/useSocket";

export default function ChatScreen({ route }) {
  const conversationId = route?.params?.conversationId;
  const messengerId = route?.params?.messenger;

  const { data: messages, loading, error, refetch, setMessages } = useChat(conversationId);
  const { user } = useAuth();
  const { socket } = useSocket();
  
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const flatListRef = useRef(null);
  

  // Handle incoming messages
  useEffect(() => {
    if (!socket || !conversationId) return;

    const handleIncomingMessage = (incomingMessage) => {
      console.log("Received message:", incomingMessage);
      
      // Only add message if it belongs to current conversation
      if (incomingMessage.conversationId === conversationId) {
        setMessages((prevMessages) => {
          // Check if message already exists to prevent duplicates
          const messageExists = prevMessages.some(msg => msg.id === incomingMessage.id);
          if (messageExists) return prevMessages;
          
          // Add new message at the beginning (since FlatList is inverted)
          return [incomingMessage, ...prevMessages];
        });
      }
    };

    const handleMessageError = (error) => {
      console.error("Socket message error:", error);
      Alert.alert("Error", "Failed to send message. Please try again.");
      setIsSending(false);
    };

    const handleMessageSent = (sentMessage) => {
      console.log("Message sent successfully:", sentMessage);
      setIsSending(false);
      
      // Update the temporary message with the server response
      if (sentMessage.conversationId === conversationId) {
        setMessages((prevMessages) => {
          return prevMessages.map(msg => 
            msg.tempId === sentMessage.tempId ? sentMessage : msg
          );
        });
      }
    };

    // Join the conversation room
    socket.emit("join conversation", conversationId);

    // Set up event listeners
    socket.on("chat message", handleIncomingMessage);
    socket.on("message error", handleMessageError);
    socket.on("message sent", handleMessageSent);

    return () => {
      socket.off("chat message", handleIncomingMessage);
      socket.off("message error", handleMessageError);
      socket.off("message sent", handleMessageSent);
      socket.emit("leave conversation", conversationId);
    };
  }, [socket, conversationId, setMessages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages?.length > 0 && flatListRef.current) {
      // Small delay to ensure the FlatList has rendered
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index: 0, animated: true });
      }, 100);
    }
  }, [messages?.length]);

const handleSend = useCallback(() => {
  const trimmedContent = newMessage.trim();

  if (!socket || !trimmedContent || isSending) return;

  setIsSending(true);

  const tempId = `${Date.now()}-${Math.random()}`; // unique temp ID

  const tempMessage = {
    content: trimmedContent,
    conversationId,
    receiverId: messengerId,
    sender: { id: user.id, username: user.username },
    createdAt: new Date().toISOString(),
    tempId,
    isPending: true
  };

  setMessages((prev) => [tempMessage, ...prev]);
  setNewMessage(""); // clear AFTER we've captured trimmedContent

  try {
    socket.emit("chat message", {
      content: trimmedContent,
      conversationId,
      receiverId: messengerId,
      tempId
    });
    setIsSending(false);
  } catch (err) {
    console.error("Failed to send message:", err);
    setNewMessage(trimmedContent); // restore input
    setIsSending(false);
    setMessages((prev) => prev.filter((msg) => msg.tempId !== tempId));
    Alert.alert("Error", "Failed to send message. Please try again.");
  }
}, [socket, newMessage, isSending, conversationId, messengerId, user, setMessages]);

  // Handle retry for failed messages
  const handleRetry = useCallback(() => {
    if (refetch) {
      refetch();
    }
  }, [refetch]);

  // Validation
  if (!conversationId) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <Text className="text-red-500 text-lg">No conversation ID provided.</Text>
      </View>
    );
  }

  if (!user?.id) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <Text className="text-red-500 text-lg">User not authenticated.</Text>
      </View>
    );
  }

  if (loading && (!messages || messages.length === 0)) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <ActivityIndicator size="large" color="#007aff" />
        <Text className="mt-2 text-gray-600">Loading messages...</Text>
      </View>
    );
  }

  if (error && (!messages || messages.length === 0)) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <Text className="text-red-500 text-lg mb-4">Failed to load messages</Text>
        <TouchableOpacity
          onPress={handleRetry}
          className="bg-blue-500 px-4 py-2 rounded-lg"
        >
          <Text className="text-white font-medium">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <FlatList
        ref={flatListRef}
        data={messages || []}
        keyExtractor={(item) => item.id?.toString() || item.tempId}
        contentContainerStyle={{ 
          paddingVertical: 10,
          paddingHorizontal: 12,
          flexGrow: 1
        }}
        inverted
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Message
            content={item.content}
            senderName={item.sender?.username || item.sender?.name || "Unknown"}
            isSignedUser={user.id === item.sender?.id}
            timestamp={item.createdAt}
            isPending={item.isPending}
            onRetry={() => handleRetry()}
          />
        )}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-gray-500 text-lg">No messages yet</Text>
            <Text className="text-gray-400 text-sm mt-1">Start the conversation!</Text>
          </View>
        )}
      />
      
      <View className="flex-row items-center p-3 bg-white border-t border-gray-200">
        <TextInput
          style={{ 
            flex: 1, 
            borderWidth: 1, 
            borderColor: '#e5e7eb',
            borderRadius: 20, 
            paddingHorizontal: 16,
            paddingVertical: 10,
            marginRight: 8,
            maxHeight: 100
          }}
          placeholder="Type a message..."
          placeholderTextColor="#9ca3af"
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
          textAlignVertical="center"
          onSubmitEditing={handleSend}
          blurOnSubmit={false}
        />
        <TouchableOpacity
          onPress={handleSend}
          disabled={!newMessage.trim() || isSending}
          className={`px-4 py-2 rounded-full ${
            newMessage.trim() && !isSending 
              ? 'bg-blue-500' 
              : 'bg-gray-300'
          }`}
        >
          {isSending ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className={`font-medium ${
              newMessage.trim() ? 'text-white' : 'text-gray-500'
            }`}>
              Send
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}