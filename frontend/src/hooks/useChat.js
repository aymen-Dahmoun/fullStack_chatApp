// hooks/useChat.js

import { useEffect, useState } from "react";
import api from "../api/ax";

export default function useChat(conversationId) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const response = await api.get(`/api/conversation/chat/${conversationId}`);
        console.log("convs from useChat: ", response.data);
        setData(response.data);
      } catch (err) {
        console.error("Failed to fetch conversations:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (conversationId) getConversations(); // prevent undefined
  }, [conversationId]);

  return {
    data,
    loading,
    error,
    refetch: () => {
      setLoading(true);
      setError(null);
      return api
        .get(`/api/conversation/chat/${conversationId}`)
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          setError(err);
        })
        .finally(() => setLoading(false));
    },
    setMessages: setData // ✅ here is the fix
  };
}
