// 1. FIXED useSocket Hook
import { useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

export const useSocket = () => {
  // Add this to your useSocket hook temporarily for debugging
const debugToken = async () => {
  const token = await SecureStore.getItemAsync('token');
  console.log('Stored token:', token);
  
  if (token) {
    try {
      // Decode JWT without verification to see contents
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Token payload:', payload);
      console.log('Token expires:', new Date(payload.exp * 1000));
      console.log('Current time:', new Date());
    } catch (e) {
      console.log('Token is not a valid JWT:', e.message);
    }
  }
};

// Call this in your useSocket hook
useEffect(() => {
  debugToken();
}, []);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const connectSocket = useCallback(async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      console.log('token: ', token)
      
      if (!token) {
        console.error('No token found for socket authentication');
        return;
      }

      const newSocket = io(Constants.expoConfig.extra.API_LINK, {
        auth: { token },
        transports: ['websocket'], // Force WebSocket transport
        timeout: 20000, // Increase timeout
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      newSocket.on('connect', () => {
        console.log('Connected to socket:', newSocket.id);
        setIsConnected(true);
      });

      newSocket.on('disconnect', (reason) => {
        console.log('Disconnected from socket:', reason);
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setIsConnected(false);
      });

      newSocket.on('error', (error) => {
        console.error('Socket error:', error);
      });

      setSocket(newSocket);
    } catch (error) {
      console.error('Error connecting socket:', error);
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
