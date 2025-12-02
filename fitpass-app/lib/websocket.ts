// WebSocket helper for FitPass - Production Ready with Auto-reconnect
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { API_URL } from './api';

let ws: WebSocket | null = null;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
const reconnectDelay = 1000; // Start with 1 second
let reconnectTimeout: NodeJS.Timeout | null = null;
let currentToken: string | null = null;

// Get WebSocket URL based on environment
const getWebSocketUrl = (): string => {
  // Try to get from expo config first
  const configUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_WS;
  if (configUrl) return configUrl;
  
  // Auto-detect from API URL for consistent connection
  if (__DEV__) {
    // Use same host as API but with ws protocol
    const apiUrl = API_URL.replace('/api', '');
    const wsUrl = apiUrl.replace('http://', 'ws://').replace('https://', 'wss://');
    return `${wsUrl}/ws`;
  } else {
    // Production: use current domain with proper ws/wss protocol
    const protocol = API_URL.startsWith('https') ? 'wss' : 'ws';
    const host = API_URL.includes('//') ? new URL(API_URL).host : window?.location?.host || 'localhost:3001';
    return `${protocol}://${host}/ws`;
  }
};

// Auto-reconnect function
const attemptReconnect = () => {
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
  }
  
  reconnectAttempts++;
  const delay = reconnectDelay * Math.pow(2, reconnectAttempts - 1); // Exponential backoff
  
  console.log(`WebSocket reconnect attempt ${reconnectAttempts}/${maxReconnectAttempts} in ${delay}ms`);
  
  reconnectTimeout = setTimeout(() => {
    if (currentToken) {
      connectWebSocket(currentToken);
    }
  }, delay);
};

// Connect with auto-reconnect capability
export const connectWebSocket = (token?: string): WebSocket | null => {
  if (token) {
    currentToken = token;
  }
  
  if (ws && (ws.readyState === WebSocket.CONNECTING || ws.readyState === WebSocket.OPEN)) {
    return ws;
  }

  const url = getWebSocketUrl();
  console.log('[WebSocket] Connecting to:', url);
  
  try {
    ws = new WebSocket(url);
    
    ws.onopen = () => {
      console.log('[WebSocket] Connected successfully');
      reconnectAttempts = 0; // Reset reconnect attempts on successful connection
      
      // Send authentication message
      if (currentToken) {
        ws?.send(JSON.stringify({
          type: 'auth',
          token: currentToken
        }));
        console.log('[WebSocket] Auth message sent');
      }
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('[WebSocket] Message received:', data);
        
        // Handle different message types
        if (data.type === 'auth_success') {
          console.log('[WebSocket] Authentication successful');
        } else if (data.type === 'attendance_update') {
          console.log('[WebSocket] Attendance update:', data.payload);
        } else if (data.event === 'attendance.update') {
          console.log('[WebSocket] Attendance update event:', data.data);
        }
      } catch (error) {
        console.log('[WebSocket] Non-JSON message:', event.data);
      }
    };
    
    ws.onerror = (error) => {
      console.error('[WebSocket] Connection error:', error);
    };
    
    ws.onclose = (event) => {
      console.log('[WebSocket] Connection closed:', event.code, event.reason);
      ws = null;
      
      // Auto-reconnect if not intentionally closed and we have attempts left
      if (event.code !== 1000 && reconnectAttempts < maxReconnectAttempts && currentToken) {
        attemptReconnect();
      }
    };
    
  } catch (error) {
    console.error('[WebSocket] Failed to connect:', error);
    if (currentToken && reconnectAttempts < maxReconnectAttempts) {
      attemptReconnect();
    }
  }
  
  return ws;
};

export const disconnectWebSocket = (): void => {
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }
  
  reconnectAttempts = 0;
  currentToken = null;
  
  if (ws) {
    console.log('[WebSocket] Disconnecting...');
    ws.close(1000, 'User disconnect'); // Normal closure
    ws = null;
  }
};

// Force reconnect (useful for network changes)
export const reconnectWebSocket = (): void => {
  if (currentToken) {
    disconnectWebSocket();
    setTimeout(() => connectWebSocket(currentToken!), 100);
  }
};

export const sendWebSocketMessage = (message: any): void => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    const jsonMessage = JSON.stringify(message);
    ws.send(jsonMessage);
    console.log('[WebSocket] Message sent:', message);
  } else {
    console.warn('[WebSocket] Not connected. Cannot send message.');
  }
};

export default {
  connect: connectWebSocket,
  disconnect: disconnectWebSocket,
  reconnect: reconnectWebSocket,
  send: sendWebSocketMessage,
  get isConnected() {
    return ws?.readyState === WebSocket.OPEN;
  },
  get connectionState() {
    return ws?.readyState || WebSocket.CLOSED;
  }
};
