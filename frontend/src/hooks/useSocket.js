import { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import * as SecureStore from "expo-secure-store";

export const useSocket = () => {
  const debugToken = async () => {
    const token = await SecureStore.getItemAsync("token");
    console.log("Stored token:", token);

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        console.log("Token payload:", payload);
        console.log("Token expires:", new Date(payload.exp * 1000));
      } catch (e) {
        console.log("Token is not a valid JWT:", e.message);
      }
    }
  };

  useEffect(() => {
    if (__DEV__) debugToken();
  }, []);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const connectSocket = useCallback(async () => {
    try {
      const token = await SecureStore.getItemAsync("token");

      if (!token) {
        console.error("No token found for socket authentication");
        return;
      }

      const newSocket = io(process.env.EXPO_PUBLIC_API_LINK, {
        auth: { token },
        transports: ["websocket"],
        timeout: 20000,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      newSocket.on("connect", () => {
        console.log("Connected to socket:", newSocket.id);
        setIsConnected(true);
      });

      newSocket.on("disconnect", (reason) => {
        console.log("Disconnected from socket:", reason);
        setIsConnected(false);
      });

      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        setIsConnected(false);
      });

      newSocket.on("error", (error) => {
        console.error("Socket error:", error);
      });

      setSocket(newSocket);
    } catch (error) {
      console.error("Error connecting socket:", error);
    }
  }, []);

  useEffect(() => {
    connectSocket();

    return () => {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
    };
  }, [connectSocket]);

  return { socket, isConnected, reconnect: connectSocket };
};
