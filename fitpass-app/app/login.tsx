import React, { useState } from 'react';
import { 
  Platform, 
  Alert, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView,
  ActivityIndicator 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { authAPI } from '../lib/api';
import { saveToken, saveUser, User } from '../lib/auth';
import { WebLogin } from '../components/WebLogin';
import { useWebSocket } from '../lib/WebSocketContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { reconnect } = useWebSocket();

  // Use web-specific component for web platform
  if (Platform.OS === 'web') {
    return <WebLogin />;
  }

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.login(email, password);
      console.log('Login response:', response); // Debug log
      
      // Extract token and user from response
      const { token, user } = response;

      if (!token || !user) {
        throw new Error('Invalid response format');
      }

      // Save token and user to storage
      console.log('Saving token and user to storage...');
      await saveToken(token);
      await saveUser(user);
      console.log('Token and user saved successfully');

      // Connect WebSocket with new token
      console.log('Connecting WebSocket...');
      reconnect();

      // Validate user role and navigate accordingly
      if (user.role === 'TEACHER') {
        // Navigate to teacher dashboard
        navigation.navigate('Teacher' as never);
      } else if (user.role === 'STUDENT') {
        // Navigate to student dashboard
        navigation.navigate('Student' as never);
      } else {
        Alert.alert('Error', 'Invalid user role. Please contact support.');
        setLoading(false);
        return;
      }
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', error.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <View className="flex-1 justify-center items-center px-6">
        {/* Header Section */}
        <View className="items-center mb-10">
          <View 
            className="w-24 h-24 rounded-full items-center justify-center mb-6"
            style={{
              backgroundColor: '#3B82F6',
              shadowColor: '#3B82F6',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.4,
              shadowRadius: 12,
              elevation: 12,
            }}
          >
            <Text className="text-white text-3xl font-bold">💪</Text>
          </View>
          <Text className="text-4xl font-bold text-white mb-3">
            Welcome to FitPass
          </Text>
          <Text className="text-lg text-slate-300 text-center leading-6">
            Your fitness journey starts here
          </Text>
        </View>

        {/* Login Form */}
        <View className="w-full max-w-sm">
          <View className="bg-slate-800 rounded-3xl p-8"
               style={{
                 shadowColor: '#000',
                 shadowOffset: { width: 0, height: 8 },
                 shadowOpacity: 0.3,
                 shadowRadius: 16,
                 borderWidth: 1,
                 borderColor: '#475569',
               }}>
            <Text className="text-2xl font-bold text-white text-center mb-8">
              Sign In
            </Text>

            {/* Email Input */}
            <View className="mb-5">
              <Text className="text-slate-300 font-semibold mb-2">Email</Text>
              <TextInput
                className={`w-full px-4 py-4 bg-slate-700 rounded-xl border border-slate-600 text-white font-medium ${
                  loading ? 'opacity-50' : ''
                }`}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#94a3b8"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={!loading}
              />
            </View>

            {/* Password Input */}
            <View className="mb-8">
              <Text className="text-slate-300 font-semibold mb-2">Password</Text>
              <TextInput
                className={`w-full px-4 py-4 bg-slate-700 rounded-xl border border-slate-600 text-white font-medium ${
                  loading ? 'opacity-50' : ''
                }`}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="#94a3b8"
                autoComplete="password"
                editable={!loading}
              />
            </View>

            {/* Login Button */}
            <TouchableOpacity
              className={`w-full py-4 rounded-xl items-center justify-center mb-6 ${
                loading ? 'bg-slate-600' : 'bg-blue-600'
              }`}
              style={!loading ? {
                backgroundColor: '#3B82F6',
                shadowColor: '#3B82F6',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              } : {}}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text className="text-white text-lg font-bold">
                  Sign In
                </Text>
              )}
            </TouchableOpacity>
            
            {/* Demo Accounts */}
            <View className="bg-slate-700 rounded-2xl p-4"
                 style={{
                   borderWidth: 1,
                   borderColor: '#475569',
                 }}>
              <Text className="text-blue-400 text-sm text-center font-bold mb-3">
                🎯 Demo Accounts
              </Text>
              <View className="space-y-2">
                <View className="bg-slate-600 rounded-lg p-3">
                  <Text className="text-blue-400 text-xs font-bold">👨‍🏫 Teacher:</Text>
                  <Text className="text-slate-300 text-xs">teacher1@fitpass.com / password123</Text>
                </View>
                <View className="bg-slate-600 rounded-lg p-3">
                  <Text className="text-purple-400 text-xs font-bold">👨‍🎓 Student:</Text>
                  <Text className="text-slate-300 text-xs">student1@fitpass.com / password123</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View className="mt-8 items-center">
            <Text className="text-slate-500 text-sm">
              Powered by FitPass Technology
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}