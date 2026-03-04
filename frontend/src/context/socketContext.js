import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";
import { io } from "socket.io-client";
import * as SecureStore from "expo-secure-store";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);

  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const connectSocket = async () => {
    const token = await SecureStore.getItemAsync("token");

    if (!token) {
      setLoading(false);
      return;
    }

    if (socketRef.current) return;

    const socket = io(process.env.EXPO_PUBLIC_API_LINK, {
      transports: ["websocket"],
      auth: { token },
      autoConnect: true,
    });

    socket.on("connect", () => {
      console.log("socket connected:", socket.id);
      setIsConnected(true);
    });

    socket.on("disconnect", (reason) => {
      console.log("socket disconnected:", reason);
      setIsConnected(false);
    });

    socket.on("connect_error", (err) => {
      console.log("socket connection error:", err.message);
    });

    socketRef.current = socket;
    setLoading(false);
  };

  const disconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
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
        socket: socketRef.current,
        isConnected,
        reconnect: connectSocket,
        disconnect: disconnectSocket,
        loading,
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
