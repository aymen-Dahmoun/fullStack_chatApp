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
        console.log("convs: ", response.data);
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

  return { data, loading, error };
}
