import React from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import useChat from "../../hooks/useChat";

export default function ChatScreen({ route }) {

const conversationId = route?.params?.conversationId;

if (!conversationId) {
    console.log(route)
  return (
    <View style={styles.center}>
      <Text style={styles.errorText}>No conversation ID provided.</Text>
    </View>
  );
}
  const { data: messages, loading, error } = useChat(conversationId);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007aff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Failed to load messages</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 10 }}
        inverted // newest at bottom
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBubble,
              item.sender.id === "me" ? styles.myMessage : styles.theirMessage,
            ]}
          >
            <Text style={styles.messageText}>{item.content}</Text>
            <Text style={styles.metaText}>{new Date(item.createdAt).toLocaleTimeString()}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
  },
  messageBubble: {
    maxWidth: "80%",
    marginVertical: 6,
    padding: 10,
    borderRadius: 12,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#007aff",
  },
  theirMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#e5e5ea",
  },
  messageText: {
    color: "#fff",
  },
  metaText: {
    fontSize: 10,
    color: "#ddd",
    marginTop: 4,
    textAlign: "right",
  },
});
