// WebSocket Context for managing connection state across the app
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AppState } from 'react-native';
import WebSocketClient from './websocket';
import { getToken } from './auth';

interface WebSocketContextType {
  isConnected: boolean;
  connectionState: number;
  reconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

interface Props {
  children: ReactNode;
}

export const WebSocketProvider = ({ children }: Props) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState(WebSocket.CLOSED);

  // Monitor app state changes
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      console.log('[WebSocket Provider] App state changed to:', nextAppState);
      
      if (nextAppState === 'active') {
        // App became active, ensure connection
        setTimeout(() => reconnectWebSocket(), 500);
      } else if (nextAppState === 'background') {
        // App went to background, disconnect to save resources
        WebSocketClient.disconnect();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, []);

  // Monitor WebSocket connection state
  useEffect(() => {
    const interval = setInterval(() => {
      const state = WebSocketClient.connectionState;
      const connected = WebSocketClient.isConnected;
      
      setConnectionState(state);
      setIsConnected(connected);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const reconnectWebSocket = async () => {
    try {
      const token = await getToken();
      if (token) {
        console.log('[WebSocket Provider] Reconnecting with token...');
        WebSocketClient.connect(token);
      }
    } catch (error) {
      console.error('[WebSocket Provider] Failed to reconnect:', error);
    }
  };

  // Initialize connection on mount
  useEffect(() => {
    reconnectWebSocket();
  }, []);

  const value = {
    isConnected,
    connectionState,
    reconnect: reconnectWebSocket,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};