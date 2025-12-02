import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getUser, getToken } from '../../lib/auth';
import Constants from 'expo-constants';

function getApiBaseUrl(): string {
  const base = Constants.expoConfig?.extra?.EXPO_PUBLIC_API || "http://192.168.1.13:3001/api";
  return base.replace(/\/api$/, "");
}

export default function StudentAttendanceScreen() {
  const [qrInput, setQrInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleManualEntry = async () => {
    if (!qrInput.trim()) {
      Alert.alert('Error', 'Please enter a QR code URL');
      return;
    }

    setLoading(true);

    try {
      console.log('Processing QR data:', qrInput);
      
      // Validate that this is a FitPass checkin URL
      const apiBaseUrl = getApiBaseUrl();
      if (!qrInput.startsWith(`${apiBaseUrl}/api/attendance/checkin`)) {
        throw new Error('Invalid QR code. Please scan a FitPass attendance QR code.');
      }

      // Get auth token and user
      const token = await getToken();
      const user = await getUser();
      
      if (!token || !user || user.role !== 'STUDENT') {
        throw new Error('You must be logged in as a student to check in.');
      }

      // Call the backend URL directly
      const response = await fetch(qrInput, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        Alert.alert(
          'Check-in Successful! ✅',
          result.message || 'You have been successfully checked in to the session.',
          [{ text: 'OK', onPress: () => setQrInput('') }]
        );
      } else {
        throw new Error(result.error || 'Check-in failed');
      }

    } catch (error: any) {
      console.error('QR Process Error:', error);
      Alert.alert(
        'Check-in Failed ❌',
        error.message || 'Unable to check in. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const simulateQRScan = () => {
    const apiBaseUrl = getApiBaseUrl();
    const samplePayload = Buffer.from(JSON.stringify({
      sessionId: "sample_session_id",
      nonce: `${Date.now()}_${Math.random().toString(36)}`,
      expiresAt: Date.now() + 15000
    })).toString('base64');
    
    const sampleQR = `${apiBaseUrl}/api/attendance/checkin?payload=${samplePayload}`;
    setQrInput(sampleQR);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 p-6">
        <Text className="text-slate-900 text-2xl font-bold mb-2">Attendance Check-in</Text>
        <Text className="text-slate-600 mb-8">
          Enter the QR code URL from your teacher's screen to check in to class.
        </Text>

        {/* QR Scanner Simulation */}
        <View className="bg-slate-800 rounded-xl p-6 mb-6">
          <View className="flex-row items-center mb-4">
            <Ionicons name="qr-code" size={24} color="#3b82f6" />
            <Text className="text-white text-lg font-semibold ml-3">QR Code Entry</Text>
          </View>
          
          <Text className="text-slate-300 text-sm mb-4">
            Paste or type the QR code URL from your teacher's screen:
          </Text>
          
          <TextInput
            className="bg-slate-700 text-white p-4 rounded-lg mb-4"
            value={qrInput}
            onChangeText={setQrInput}
            placeholder="Paste QR code URL here..."
            placeholderTextColor="#64748b"
            multiline
            numberOfLines={3}
            autoCapitalize="none"
            autoCorrect={false}
          />
          
          <TouchableOpacity
            className={`py-3 rounded-xl ${loading ? 'bg-slate-600' : 'bg-blue-600'}`}
            onPress={handleManualEntry}
            disabled={loading || !qrInput.trim()}
          >
            <Text className="text-white text-center font-semibold">
              {loading ? 'Checking in...' : 'Check In'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Instructions */}
        <View className="bg-slate-800 rounded-xl p-6 mb-6">
          <View className="flex-row items-center mb-3">
            <Ionicons name="information-circle" size={20} color="#3b82f6" />
            <Text className="text-white font-semibold ml-2">How to use:</Text>
          </View>
          
          <Text className="text-slate-300 text-sm leading-5">
            1. Ask your teacher to show the attendance QR code{'\n'}
            2. Copy the QR code URL from the teacher's screen{'\n'}
            3. Paste it in the field above and tap "Check In"{'\n'}
            4. Make sure you're enrolled in the class
          </Text>
        </View>

        {/* Demo Section */}
        <View className="bg-slate-800 rounded-xl p-6">
          <View className="flex-row items-center mb-3">
            <Ionicons name="flask" size={20} color="#f59e0b" />
            <Text className="text-white font-semibold ml-2">Demo Mode:</Text>
          </View>
          
          <Text className="text-slate-300 text-sm mb-4">
            Generate a sample QR code URL for testing:
          </Text>
          
          <TouchableOpacity
            className="bg-yellow-600 py-3 rounded-xl"
            onPress={simulateQRScan}
          >
            <Text className="text-white text-center font-semibold">
              Generate Sample QR URL
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}