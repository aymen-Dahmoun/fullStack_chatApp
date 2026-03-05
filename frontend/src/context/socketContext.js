import React, { createContext, useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import * as SecureStore from "expo-secure-store";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [incomingCall, setIncomingCall] = useState(null);

  const connectSocket = async () => {
    const token = await SecureStore.getItemAsync("token");

    if (!token) {
      setLoading(false);
      return;
    }

    if (socket) return;

    const newSocket = io(process.env.EXPO_PUBLIC_API_LINK, {
      transports: ["websocket"],
      auth: { token },
      autoConnect: true,
    });

    newSocket.on("connect", () => {
      console.log("socket connected:", newSocket.id);
      setIsConnected(true);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("socket disconnected:", reason);
      setIsConnected(false);
    });

    newSocket.on("connect_error", (err) => {
      console.log("socket connection error:", err.message);
    });

    newSocket.on("offer", (data) => {
      console.log("Incoming call (offer received):", data);
      setIncomingCall(data);
    });
    newSocket.onAny((event, ...args) => {
      console.log("Received event:", event, args);
    });

    setSocket(newSocket);
    setLoading(false);
  };

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    connectSocket();

    return () => {
      disconnectSocket();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        loading,
        reconnect: connectSocket,
        disconnect: disconnectSocket,
        incomingCall,
        setIncomingCall,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used inside SocketProvider");
  }
  return context;
};
