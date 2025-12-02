import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

declare global {
  var window: any;
}

const TOKEN_KEY = 'fitpass_token';
const USER_KEY = 'fitpass_user';

// Platform-aware storage
const storage = {
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
      return;
    }
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Storage setItem error:', error);
    }
  },

  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return null;
    }
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('Storage getItem error:', error);
      return null;
    }
  },

  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
      return;
    }
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Storage removeItem error:', error);
    }
  }
};

export interface User {
  id: string;
  email: string;
  fullName?: string;
  role: 'TEACHER' | 'STUDENT' | 'ADMIN';
}

export const saveToken = async (token: string): Promise<void> => {
  console.log('💾 saveToken called with token length:', token.length);
  try {
    await storage.setItem(TOKEN_KEY, token);
    console.log('✅ Token saved successfully');
  } catch (error) {
    console.error('❌ Error saving token:', error);
    throw error;
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    const token = await storage.getItem(TOKEN_KEY);
    console.log('🔑 getToken returned token length:', token ? token.length : 'null');
    return token;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const removeToken = async (): Promise<void> => {
  try {
    await storage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error removing token:', error);
    throw error;
  }
};

export const saveUser = async (user: User): Promise<void> => {
  console.log('👤 saveUser called with user:', user);
  try {
    await storage.setItem(USER_KEY, JSON.stringify(user));
    console.log('✅ User saved successfully');
  } catch (error) {
    console.error('❌ Error saving user:', error);
    throw error;
  }
};

export const getUser = async (): Promise<User | null> => {
  try {
    const userStr = await storage.getItem(USER_KEY);
    const user = userStr ? JSON.parse(userStr) : null;
    console.log('👤 getUser returned:', user ? `${user.email} (${user.role})` : 'null');
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const removeUser = async (): Promise<void> => {
  try {
    await storage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Error removing user:', error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await removeToken();
    await removeUser();
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
};

export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const token = await getToken();
    return !!token;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};
