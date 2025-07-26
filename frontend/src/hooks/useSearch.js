import { useEffect, useState } from "react";
import api from "../api/ax";

export default function useSearch(query) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) return

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await api.get(`/api/search/users?query=${query}`);
        console.log("users:", response.data);
        setData(response.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return { data, loading, error };
}
