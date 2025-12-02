import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from 'expo-constants';

// Get API URL from expo config with smart defaults
const getAPIUrl = (): string => {
  // Check expo config first
  const configUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_API;
  if (configUrl) return configUrl;
  
  // Development: Use Expo's automatic tunneling
  if (__DEV__) {
    // Expo automatically creates tunnel and handles network changes
    // Use the manifest URL to get the correct tunnel URL
    const { manifest } = Constants;
    if (manifest?.debuggerHost) {
      const host = manifest.debuggerHost.split(':')[0];
      return `http://${host}:3001/api`;
    }
    
    // Fallback to localhost for web
    if (Platform.OS === 'web') {
      return 'http://localhost:3001/api';
    }
    
    // Last resort fallback
    return 'http://192.168.1.13:3001/api';
  }
  
  // Production: use your production API
  return '/api';
};

const API_URL = getAPIUrl();

// Export API_URL for WebSocket usage
export { API_URL };

// Fetch wrapper
async function apiRequest(method, path, body) {
  const token = await AsyncStorage.getItem("fitpass_token");
  
  console.log("API Request:", method, `${API_URL}${path}`, "Token:", !!token);

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  console.log("API Response:", res.status);

  if (!res.ok) {
    const err = await res.text();
    console.error("API Error:", err);
    throw new Error(err || "Request failed");
  }

  const data = await res.json();
  console.log("API Data count:", Array.isArray(data) ? data.length : typeof data);
  
  return data;
}

export const apiGet = (path) => apiRequest("GET", path, undefined);
export const apiPost = (path, body) => apiRequest("POST", path, body);
export const apiPatch = (path, body) => apiRequest("PATCH", path, body);
export const apiDelete = (path) => apiRequest("DELETE", path, undefined);

// Auth
export const authAPI = {
  login: (email, password) =>
    apiPost("/auth/login", { email, password })
};

// Classes
export const classesAPI = {
  getAll: (teacherId?: string) => {
    const endpoint = teacherId ? `/classes?teacherId=${teacherId}` : "/classes";
    return apiGet(endpoint).then(res => {
      console.log("🔍 classesAPI raw response:", res);
      // Backend returns direct array for classes
      const items = Array.isArray(res) ? res : (res.classes ?? []);
      console.log("🔍 classesAPI normalized:", items);
      return items;
    });
  },
  getById: (id) => apiGet(`/classes/${id}`)
};

// Sessions
export const sessionsAPI = {
  getAll: (teacherId?: string) => {
    const endpoint = teacherId ? `/sessions?teacherId=${teacherId}` : "/sessions";
    return apiGet(endpoint).then(res => {
      console.log("🔍 sessionsAPI raw response:", res);
      // Fix API response mapping exactly as specified
      const items = res.sessions ?? res.classSessions ?? [];
      console.log("🔍 sessionsAPI normalized:", items);
      return items;
    });
  },
  getById: (id) => apiGet(`/sessions/${id}`),
  updateStatus: (id, status) => apiPatch(`/sessions/${id}/status`, { status })
};

// Attendance
export const attendanceAPI = {
  getBySession: (sessionId) => apiGet(`/attendance/session/${sessionId}`)
};

// Enrollment
export const enrollmentAPI = {
  getAll: () => {
    return apiGet("/enrollments").then(res => {
      const items = res.enrollments ?? [];
      return items;
    });
  },
  create: (data) => apiPost("/enrollments", data)
};

// QR
export const getQRBaseUrl = () => API_URL;

// Export axios instance for simplified usage
import axios from "axios";

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("fitpass_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
