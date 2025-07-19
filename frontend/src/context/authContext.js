import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../api/ax";
import * as SecureStore from "expo-secure-store";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {

  const checkSession = async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync("token");
      console.log('token in session check:', token);

      if (!token) {
        setUser(null);
        return;
      }

      const response = await api.get("/api/session", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data.user);
    } catch (err) {
      console.error("Session check failed:", err?.response?.data || err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  checkSession();
}, []);

return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
