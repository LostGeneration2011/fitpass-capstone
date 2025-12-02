import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, Pressable, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import QRCode from "react-native-qrcode-svg";
import { sessionsAPI, classesAPI } from "../../lib/api";
import Constants from "expo-constants";
import { getUser } from "../../lib/auth";
import { useWebSocket } from "../../lib/WebSocketContext";

// Simple base64 encode function for React Native
function base64Encode(str: string): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let result = '';
  let i = 0;
  
  while (i < str.length) {
    const a = str.charCodeAt(i++);
    const b = i < str.length ? str.charCodeAt(i++) : 0;
    const c = i < str.length ? str.charCodeAt(i++) : 0;
    
    const bitmap = (a << 16) | (b << 8) | c;
    
    result += chars.charAt((bitmap >> 18) & 63) +
              chars.charAt((bitmap >> 12) & 63) +
              (i - 2 >= str.length ? '=' : chars.charAt((bitmap >> 6) & 63)) +
              (i - 1 >= str.length ? '=' : chars.charAt(bitmap & 63));
  }
  
  return result;
}

// Generate a secure nonce for QR payload
function generateNonce(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 15);
  return `${timestamp}_${random}_${Math.random().toString(36).substring(2, 15)}`;
}

// Get API base URL
function getApiBaseUrl(): string {
  const base = Constants.expoConfig?.extra?.EXPO_PUBLIC_API || "http://192.168.1.13:3001/api";
  return base.replace(/\/api$/, "");
}

// Build QR payload and encode it
function buildQRPayload(sessionId: string): string {
  const payload = {
    sessionId,
    nonce: generateNonce(),
    expiresAt: Date.now() + 15000 // 15 seconds from now
  };
  
  // Use react-native-base64 library
  const jsonString = JSON.stringify(payload);
  const encodedPayload = base64Encode(jsonString);
  return `${getApiBaseUrl()}/api/attendance/checkin?payload=${encodedPayload}`;
}

export default function TeacherQR() {
  const navigation = useNavigation();
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedSession, setSelectedSession] = useState<any | null>(null);
  const [qrValue, setQrValue] = useState<string>("");
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { isConnected, reconnect } = useWebSocket();

  // Generate new QR code
  const generateNewQR = () => {
    if (!selectedSession) return;
    
    const newQrValue = buildQRPayload(selectedSession.id);
    const newExpiresAt = Date.now() + 15000;
    
    setQrValue(newQrValue);
    setExpiresAt(newExpiresAt);
    
    console.log("🔍 Generated new QR for session:", selectedSession.id);
  };

  // Auto-refresh QR every 10 seconds
  useEffect(() => {
    if (!selectedSession) return;
    
    generateNewQR();
    const interval = setInterval(generateNewQR, 10000);
    
    return () => clearInterval(interval);
  }, [selectedSession]);

  // Load teacher sessions
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const user = await getUser();
        if (!user?.id || user.role !== 'TEACHER') {
          console.log('Invalid user for QR:', user);
          setLoading(false);
          return;
        }

        const [allSessions, allClasses] = await Promise.all([
          sessionsAPI.getAll(),
          classesAPI.getAll(),
        ]);

        // Filter teacher's classes
        const teacherClasses = Array.isArray(allClasses) 
          ? allClasses.filter((c: any) => c.teacherId === user.id)
          : [];
        
        // Filter teacher's sessions with ACTIVE + UPCOMING status
        const teacherSessions = Array.isArray(allSessions) 
          ? allSessions.filter((s: any) => {
              const statusUpper = s.status?.toUpperCase?.() || "";
              const isValidStatus = statusUpper === "ACTIVE" || statusUpper === "UPCOMING";
              const isTeacherClass = teacherClasses.some((c: any) => c.id === s.classId);
              return isValidStatus && isTeacherClass;
            })
          : [];
        
        console.log("🔍 QR - Valid sessions:", teacherSessions);
        setSessions(teacherSessions);
        
        // Auto-select if only one session
        if (teacherSessions.length === 1) {
          setSelectedSession(teacherSessions[0]);
        }
      } catch (error) {
        console.error('Error loading sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-950 items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-slate-300 mt-2">Loading sessions...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <ScrollView className="flex-1 p-6">
        {/* Header with connection status */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-white text-2xl font-bold">Attendance QR</Text>
          <View className={`flex-row items-center px-3 py-1 rounded-full ${isConnected ? 'bg-green-800' : 'bg-red-800'}`}>
            <View className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
            <Text className={`text-xs font-medium ${isConnected ? 'text-green-200' : 'text-red-200'}`}>
              {isConnected ? 'Connected' : 'Offline'}
            </Text>
            {!isConnected && (
              <Pressable onPress={reconnect} className="ml-2">
                <Ionicons name="refresh" size={12} color="#fecaca" />
              </Pressable>
            )}
          </View>
        </View>

        {sessions.length === 0 ? (
          <View className="bg-slate-800 rounded-xl p-6 items-center">
            <Ionicons name="calendar-clear" size={48} color="#64748b" />
            <Text className="text-slate-300 text-center mt-4 mb-2 text-lg">
              No Active Sessions
            </Text>
            <Text className="text-slate-500 text-center">
              No ACTIVE or UPCOMING sessions. Create or start a session first.
            </Text>
          </View>
        ) : !selectedSession ? (
          <>
            <Text className="text-slate-300 text-lg mb-4">Select a session:</Text>
            {sessions.map((session) => (
              <Pressable
                key={session.id}
                className="bg-slate-800 rounded-xl p-4 mb-3"
                onPress={() => setSelectedSession(session)}
              >
                <Text className="text-white font-semibold text-lg">
                  {session.class?.name || "Class Session"}
                </Text>
                <Text className="text-slate-300 mt-1">
                  {new Date(session.startTime).toLocaleString()}
                </Text>
                <View className="bg-blue-600 px-3 py-1 rounded-full mt-2 self-start">
                  <Text className="text-white text-xs font-medium">{session.status}</Text>
                </View>
              </Pressable>
            ))}
          </>
        ) : (
          <View className="items-center">
            {/* Session Info */}
            <View className="bg-slate-800 rounded-xl p-6 w-full mb-6"
                 style={{
                   borderWidth: 1,
                   borderColor: '#475569',
                   shadowColor: '#000',
                   shadowOffset: { width: 0, height: 4 },
                   shadowOpacity: 0.3,
                   shadowRadius: 8,
                 }}>
              <Text className="text-slate-900 text-xl font-bold text-center">
                {selectedSession.class?.name || "Class Session"}
              </Text>
              <Text className="text-slate-600 text-center mt-2">
                {new Date(selectedSession.startTime).toLocaleString()}
              </Text>
              <View className="flex-row justify-center mt-3">
                <View className="bg-green-500 px-4 py-2 rounded-full">
                  <Text className="text-white font-medium">{selectedSession.status}</Text>
                </View>
              </View>
            </View>

            {/* QR Code */}
            <View className="bg-slate-800 p-8 rounded-xl mb-6"
                 style={{
                   shadowColor: '#000',
                   shadowOffset: { width: 0, height: 4 },
                   shadowOpacity: 0.3,
                   shadowRadius: 8,
                 }}>
              {qrValue ? (
                <QRCode
                  value={qrValue}
                  size={200}
                  color="black"
                  backgroundColor="white"
                />
              ) : (
                <View className="w-50 h-50 items-center justify-center">
                  <ActivityIndicator size="large" color="#7c3aed" />
                </View>
              )}
            </View>

            {/* Instructions */}
            <View className="bg-purple-50 rounded-xl p-4 mb-6 border border-purple-100">
              <Text className="text-purple-800 text-center text-sm leading-5">
                QR auto-refreshes every 10 seconds.{"\n"}
                Ask students to scan using the FitPass app.
              </Text>
            </View>

            {/* Controls */}
            <View className="flex-row space-x-4">
              <Pressable
                className="bg-slate-700 px-6 py-3 rounded-xl flex-1"
                style={{
                  borderWidth: 1,
                  borderColor: '#475569',
                }}
                onPress={() => setSelectedSession(null)}
              >
                <Text className="text-white text-center font-medium">Change Session</Text>
              </Pressable>
              
              <Pressable
                className="bg-purple-500 px-6 py-3 rounded-xl flex-1"
                onPress={generateNewQR}
              >
                <Text className="text-white text-center font-medium">Refresh QR</Text>
              </Pressable>
            </View>
            
            {/* Navigation to Sessions */}
            {sessions.length > 0 && (
              <Pressable
                className="bg-slate-700 rounded-xl p-4 mt-4 w-full"
                style={{
                  borderWidth: 1,
                  borderColor: '#475569',
                }}
                onPress={() => {
                  try {
                    const firstSession = sessions[0];
                    if (firstSession?.classId && firstSession?.class?.name) {
                      (navigation as any).navigate('Sessions', {
                        classId: firstSession.classId,
                        className: firstSession.class.name,
                      });
                    }
                  } catch (error) {
                    console.log("Navigation error:", error);
                  }
                }}
              >
                <Text className="text-slate-700 font-semibold text-center">
                  View All Sessions for {sessions[0]?.class?.name}
                </Text>
              </Pressable>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}