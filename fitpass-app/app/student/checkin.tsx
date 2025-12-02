import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, Camera, useCameraPermissions } from 'expo-camera';
import { getUser, getToken } from '../../lib/auth';
import Constants from 'expo-constants';

function getApiBaseUrl(): string {
  const base = Constants.expoConfig?.extra?.EXPO_PUBLIC_API || "http://192.168.1.13:3001/api";
  return base.replace(/\/api$/, "");
}

export default function StudentCheckInScreen() {
  const [cameraModalVisible, setCameraModalVisible] = useState(false);
  const [qrInput, setQrInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const processQRData = async (qrData: string) => {
    if (loading) return;
    
    setLoading(true);

    try {
      console.log('Processing QR data:', qrData);
      
      // Validate that this is a FitPass checkin URL
      const apiBaseUrl = getApiBaseUrl();
      if (!qrData.startsWith(`${apiBaseUrl}/api/attendance/checkin`)) {
        throw new Error('Invalid QR code. Please scan a FitPass attendance QR code.');
      }

      // Get auth token and user
      const token = await getToken();
      const user = await getUser();
      
      if (!token || !user || user.role !== 'STUDENT') {
        throw new Error('You must be logged in as a student to check in.');
      }

      // Call the backend URL directly
      const response = await fetch(qrData, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Check-in failed');
      }

      Alert.alert(
        'Success!', 
        result.message || 'Checked in successfully',
        [{ text: 'OK', onPress: () => {
          setQrInput('');
          setCameraModalVisible(false);
          setScanned(false);
        }}]
      );

    } catch (error: any) {
      console.error('Check-in error:', error);
      Alert.alert('Check-in Error', error.message || 'Failed to check in');
    } finally {
      setLoading(false);
    }
  };

  const handleBarCodeScanned = (scanningResult: any) => {
    if (scanned || !scanningResult?.data) return;
    
    setScanned(true);
    setCameraModalVisible(false);
    processQRData(scanningResult.data);
  };

  const handleManualEntry = async () => {
    if (!qrInput.trim()) {
      Alert.alert('Error', 'Please enter a QR code URL');
      return;
    }

    await processQRData(qrInput);
  };

  const openCamera = async () => {
    if (!permission) {
      Alert.alert('Permission Required', 'Requesting camera permission...');
      return;
    }
    
    if (!permission.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert('No Camera Access', 'Camera permission is required to scan QR codes. Please enable camera access in your device settings.');
        return;
      }
    }

    setScanned(false);
    setCameraModalVisible(true);
  };

  if (!permission) {
    return (
      <SafeAreaView className="flex-1 bg-slate-950 items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-slate-300 mt-2">Please allow camera permissions...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <ScrollView className="flex-1 p-6">
        <Text className="text-white text-2xl font-bold mb-6">Attendance Check-in</Text>
        
        {/* QR Scanner Section */}
        <View className="bg-slate-800 rounded-xl p-6 mb-6"
             style={{
               borderWidth: 1,
               borderColor: '#475569',
               shadowColor: '#000',
               shadowOffset: { width: 0, height: 4 },
               shadowOpacity: 0.3,
               shadowRadius: 8,
             }}>
          <View className="items-center mb-4">
            <Ionicons name="qr-code-outline" size={64} color="#3b82f6" />
            <Text className="text-white text-xl font-semibold mt-4 mb-2">
              Scan QR Code
            </Text>
            <Text className="text-slate-600 text-center">
              Use your device camera to scan the attendance QR code from your teacher
            </Text>
          </View>
          
          <TouchableOpacity
            className="bg-purple-500 rounded-xl py-4 px-6 items-center"
            onPress={openCamera}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons name="camera" size={24} color="white" />
                <Text className="text-white font-semibold mt-2">Open Camera</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Manual Entry Section */}
        <View className="bg-slate-800 rounded-xl p-6">
          <Text className="text-white text-lg font-semibold mb-4">
            Manual Entry (Fallback)
          </Text>
          <Text className="text-slate-300 text-sm mb-4">
            If camera scanning doesn't work, you can manually paste the QR code URL here
          </Text>
          
          <TextInput
            className="bg-slate-700 text-white px-4 py-3 rounded-lg mb-4"
            placeholder="Paste QR code URL here..."
            placeholderTextColor="#64748b"
            value={qrInput}
            onChangeText={setQrInput}
            autoCapitalize="none"
            autoCorrect={false}
            multiline={true}
            numberOfLines={3}
          />
          
          <TouchableOpacity
            className="bg-emerald-600 rounded-xl py-4 px-6 items-center"
            onPress={handleManualEntry}
            disabled={loading || !qrInput.trim()}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={24} color="white" />
                <Text className="text-white font-semibold mt-2">Check In</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Demo Section */}
        <View className="bg-slate-800 rounded-xl p-6 mt-6">
          <Text className="text-yellow-400 text-sm font-medium mb-2">
            🔧 Demo/Testing
          </Text>
          <Text className="text-slate-300 text-xs">
            For testing: Ask your teacher to show the QR code, then scan it with the camera or copy the URL and paste it above.
          </Text>
        </View>
      </ScrollView>

      {/* Camera Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={cameraModalVisible}
        onRequestClose={() => setCameraModalVisible(false)}
      >
        <View className="flex-1 bg-black">
          <SafeAreaView className="flex-1">
            <View className="flex-1">
              <View className="flex-row justify-between items-center p-4 bg-slate-900">
                <Text className="text-white text-lg font-semibold">Scan QR Code</Text>
                <TouchableOpacity 
                  onPress={() => setCameraModalVisible(false)}
                  className="p-2"
                >
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>
              
              {permission?.granted && (
                <CameraView
                  style={{ flex: 1 }}
                  barcodeScannerSettings={{
                    barcodeTypes: ['qr'],
                  }}
                  onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                />
              )}
              
              <View className="absolute bottom-0 left-0 right-0 bg-slate-900 bg-opacity-90 p-4">
                <Text className="text-white text-center mb-2">
                  Position the QR code within the camera frame
                </Text>
                {scanned && (
                  <TouchableOpacity
                    className="bg-blue-600 rounded-xl py-3 px-6 items-center"
                    onPress={() => setScanned(false)}
                  >
                    <Text className="text-white font-semibold">Tap to Scan Again</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}