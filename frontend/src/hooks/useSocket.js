import { useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';


export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const connectSocket = useCallback(async () => {
    const token = await SecureStore.getItemAsync('token');

    const newSocket = io(Constants.expoConfig.extra.API_LINK, {
      auth: { token },
    });

    newSocket.on('connect', () => {
      console.log('Connected to socket:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from socket');
      setIsConnected(false);
    });

    setSocket(newSocket);
  }, []);

  useEffect(() => {
    connectSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  return { socket, isConnected };
};
