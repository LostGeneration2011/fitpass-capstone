import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Camera, CameraView } from 'expo-camera';
import { getUser, getToken } from '../../lib/auth';
import Constants from 'expo-constants';

function getApiBaseUrl(): string {
  const base = Constants.expoConfig?.extra?.EXPO_PUBLIC_API || "http://192.168.1.13:3001/api";
  return base.replace(/\/api$/, "");
}

export default function StudentQRScannerScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleQRScanned = async ({ data }: { data: string }) => {
    setScanned(true);
    setLoading(true);

    try {
      console.log('Scanned QR data:', data);
      
      // Validate that this is a FitPass checkin URL
      const apiBaseUrl = getApiBaseUrl();
      if (!data.startsWith(`${apiBaseUrl}/api/attendance/checkin`)) {
        throw new Error('Invalid QR code. Please scan a FitPass attendance QR code.');
      }

      // Get auth token and user
      const token = await getToken();
      const user = await getUser();
      
      if (!token || !user || user.role !== 'STUDENT') {
        throw new Error('You must be logged in as a student to check in.');
      }

      // Call the backend URL directly
      const response = await fetch(data, {
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
          [{ text: 'OK', onPress: () => setScanned(false) }]
        );
      } else {
        throw new Error(result.error || 'Check-in failed');
      }

    } catch (error: any) {
      console.error('QR Scan Error:', error);
      Alert.alert(
        'Check-in Failed ❌',
        error.message || 'Unable to check in. Please try again.',
        [
          { text: 'Try Again', onPress: () => setScanned(false) },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-slate-300">Requesting camera permission...</Text>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center p-6">
        <Ionicons name="camera" size={64} color="#9ca3af" />
        <Text className="text-white text-xl font-bold mt-4 mb-2">Camera Permission Required</Text>
        <Text className="text-slate-300 text-center mb-6">
          We need camera access to scan QR codes for attendance check-in.
        </Text>
        <TouchableOpacity
          className="bg-blue-600 px-6 py-3 rounded-xl"
          onPress={async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
          }}
        >
          <Text className="text-white font-semibold">Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1">
        {/* Header */}
        <View className="bg-slate-950 px-6 py-4">
          <Text className="text-white text-xl font-bold">Scan QR Code</Text>
          <Text className="text-slate-300 mt-1">
            Point your camera at the teacher's attendance QR code
          </Text>
        </View>

        {/* Camera View */}
        <View className="flex-1 relative">
          <CameraView
            onBarcodeScanned={scanned ? undefined : handleQRScanned}
            style={{ flex: 1 }}
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
          />
          
          {/* Overlay */}
          <View className="absolute inset-0 items-center justify-center">
            {/* Scanning frame */}
            <View className="w-64 h-64 border-2 border-white rounded-lg relative">
              <View className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500" />
              <View className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500" />
              <View className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500" />
              <View className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500" />
            </View>
            
            {/* Instructions */}
            <Text className="text-white text-center mt-6 mx-8">
              {loading ? 'Checking in...' : 'Position the QR code within the frame'}
            </Text>
            
            {loading && (
              <ActivityIndicator size="large" color="#3b82f6" className="mt-4" />
            )}
          </View>
        </View>

        {/* Bottom Controls */}
        <View className="bg-slate-950 px-6 py-6">
          <TouchableOpacity
            className="bg-slate-700 py-3 rounded-xl"
            onPress={() => setScanned(false)}
            disabled={loading}
          >
            <Text className="text-white text-center font-semibold">
              {scanned ? 'Tap to Scan Again' : 'Scanner Active'}
            </Text>
          </TouchableOpacity>
          
          <View className="flex-row items-center justify-center mt-4">
            <Ionicons name="information-circle" size={16} color="#64748b" />
            <Text className="text-slate-500 text-sm ml-2">
              Make sure you're enrolled in the class
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}