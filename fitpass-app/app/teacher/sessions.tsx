import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, SafeAreaView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getUser } from "../../lib/auth";
import { sessionsAPI, classesAPI } from "../../lib/api";

export default function TeacherSessionsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { classId, className }: any = route.params || {};

  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        setLoading(true);
        setError(null);

        const user = await getUser();

        if (!user || user.role !== "TEACHER") {
          setError("Invalid user role. Please sign in again as TEACHER.");
          setLoading(false);
          return;
        }

        // Load all sessions and filter appropriately
        const [allSessions, allClasses] = await Promise.all([
          sessionsAPI.getAll(),
          classesAPI.getAll(),
        ]);
        
        console.log("🔍 Sessions - All sessions:", allSessions);
        console.log("🔍 Sessions - All classes:", allClasses);
        console.log("🔍 Sessions - ClassId from params:", classId);

        // Get teacher's classes
        const teacherClasses = Array.isArray(allClasses) 
          ? allClasses.filter((c: any) => c.teacherId === user.id)
          : [];

        // Filter sessions
        let filteredSessions;
        if (classId) {
          // If classId provided, show only sessions for that class
          filteredSessions = Array.isArray(allSessions) 
            ? allSessions.filter((s: any) => s.classId === classId)
            : [];
        } else {
          // If no classId, show all teacher's sessions
          filteredSessions = Array.isArray(allSessions) 
            ? allSessions.filter((s: any) => 
                teacherClasses.some((c: any) => c.id === s.classId)
              )
            : [];
        }

        console.log("🔍 Sessions - Filtered sessions:", filteredSessions);
        setSessions(filteredSessions);
      } catch (e: any) {
        console.log("[TeacherSessions] Error loading sessions:", e);
        setError(e?.message ?? "Failed to load sessions.");
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, [classId]);

  const handleOpenQR = (session: any) => {
    try {
      (navigation as any).navigate('QR', {
        sessionId: session.id,
        className: session.class?.name || className || "",
        startTime: session.startTime,
      });
    } catch (error) {
      console.log("Navigation error:", error);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const start = new Date(item.startTime);
    const end = new Date(item.endTime);

    const timeLabel = `${start.toLocaleDateString()} ${start.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })} - ${end.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;

    const statusUpper = item.status?.toUpperCase?.() || "";

    return (
      <View className="p-4 mb-3 bg-slate-800 rounded-xl">
        <Text className="text-white font-semibold mb-1">
          {item.class?.name || className || "Session"}
        </Text>
        <Text className="text-slate-300 mb-2">{timeLabel}</Text>
        <View className="flex-row items-center justify-between mb-3">
          <View 
            className={`px-3 py-1 rounded-full ${
              statusUpper === "ACTIVE"
                ? "bg-green-600" 
                : statusUpper === "UPCOMING"
                ? "bg-blue-600"
                : "bg-slate-600"
            }`}
          >
            <Text className={`text-xs font-medium ${
              statusUpper === "ACTIVE" || statusUpper === "UPCOMING" 
                ? "text-white" 
                : "text-slate-300"
            }`}>
              {item.status}
            </Text>
          </View>
        </View>

        {(statusUpper === "ACTIVE" || statusUpper === "UPCOMING") && (
          <TouchableOpacity
            onPress={() => handleOpenQR(item)}
            className="bg-blue-600 py-3 rounded-lg items-center"
          >
            <Text className="text-white font-semibold">
              Generate QR for this session
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-slate-950">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-slate-300 mt-2">Loading sessions...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center p-4 bg-slate-950">
        <Text className="text-red-400 mb-2 text-lg font-semibold">Error</Text>
        <Text className="text-slate-300 text-center">{error}</Text>
      </SafeAreaView>
    );
  }

  if (!sessions.length) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center p-4 bg-slate-950">
        <Text className="text-slate-300 text-center">
          No sessions scheduled for this class yet.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <View className="flex-1 p-4">
        <Text className="text-white text-xl font-bold mb-4">
          {classId ? className || "Class Sessions" : "All My Sessions"}
        </Text>
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      </View>
    </SafeAreaView>
  );
}