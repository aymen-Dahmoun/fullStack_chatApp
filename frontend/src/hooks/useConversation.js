import { useEffect, useState } from "react";
import api from "../api/ax";
import { useAuth } from "../context/authContext";

export default function useConversation() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const response = await api.get(`/api/conversation/${user.id}`);
        console.log('convs: ',response.data)
        setData(response.data);
      } catch (err) {
        console.error("Failed to fetch conversations:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      getConversations();
    }
  }, [user]);

  return { data, loading, error };
}
