import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getUser, User } from '../../lib/auth';
import { sessionsAPI, classesAPI } from "../../lib/api";

interface TeacherDashboardStats {
  classesCount: number;
  todaySessions: number;
  attendanceRate: number;
  todaySessionsList: any[];
  teacherClasses: any[];
}

export default function TeacherDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<TeacherDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const currentUser = await getUser();
      setUser(currentUser);
      
      if (!currentUser?.id || currentUser.role !== 'TEACHER') {
        console.log('Invalid user or role:', currentUser);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const [allSessions, allClasses] = await Promise.all([
        sessionsAPI.getAll(),
        classesAPI.getAll(),
      ]);

      console.log("🔍 Dashboard - Sessions from API:", allSessions);
      console.log("🔍 Dashboard - Classes from API:", allClasses);

      // Filter teacher's classes
      const teacherClasses = Array.isArray(allClasses) 
        ? allClasses.filter((c: any) => c.teacherId === currentUser.id)
        : [];

      // Filter teacher's sessions
      const teacherSessions = Array.isArray(allSessions) 
        ? allSessions.filter((s: any) => 
            teacherClasses.some((c: any) => c.id === s.classId)
          )
        : [];

      console.log("🔍 Dashboard - Teacher sessions:", teacherSessions);

      // Today's sessions
      const today = new Date().toDateString();
      const todaySessionsList = teacherSessions.filter((s: any) => {
        if (!s.startTime) return false;
        const sessionDate = new Date(s.startTime).toDateString();
        return sessionDate === today;
      });

      const dashboardStats: TeacherDashboardStats = {
        classesCount: teacherClasses.length,
        todaySessions: todaySessionsList.length,
        attendanceRate: 85, // Mock data
        todaySessionsList,
        teacherClasses,
      };

      setStats(dashboardStats);
    } catch (error) {
      console.error('Error loading teacher dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-950">
        <View className="flex-1 justify-center items-center">
          <View className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full items-center justify-center mb-4"
                style={{
                  shadowColor: '#3b82f6',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                }}>
            <ActivityIndicator size="large" color="white" />
          </View>
          <Text className="text-slate-300 text-lg font-medium">Loading your dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!stats || !user) {
    return (
      <SafeAreaView className="flex-1 bg-slate-950 items-center justify-center">
        <Text className="text-slate-300 text-lg font-medium">Unable to load dashboard</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <View className="flex-1">
        <ScrollView 
          className="flex-1"
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <View className="px-6 py-8">
            {/* Header */}
            <View className="mb-8">
              <Text className="text-cyan-400 text-base font-medium">Good morning</Text>
              <Text className="text-white text-3xl font-bold">
                {user?.fullName || "Teacher"}
              </Text>
              <View className="w-12 h-1 bg-blue-500 rounded-full mt-2" 
                   style={{
                     shadowColor: '#3b82f6',
                     shadowOffset: { width: 0, height: 2 },
                     shadowOpacity: 0.5,
                     shadowRadius: 4,
                   }} />
            </View>

            {/* Stats Cards */}
            <View className="flex-row justify-between mb-8">
              <View className="bg-slate-800 rounded-xl p-6 flex-1 mr-3"
                   style={{
                     shadowColor: '#000',
                     shadowOffset: { width: 0, height: 4 },
                     shadowOpacity: 0.3,
                     shadowRadius: 8,
                     borderWidth: 1,
                     borderColor: '#475569'
                   }}>
                <View className="bg-blue-600 p-3 rounded-lg mb-3 self-start"
                     style={{
                       shadowColor: '#3b82f6',
                       shadowOffset: { width: 0, height: 2 },
                       shadowOpacity: 0.4,
                       shadowRadius: 4,
                     }}>
                  <Ionicons name="school" size={24} color="#fff" />
                </View>
                <Text className="text-white text-2xl font-bold">{stats.classesCount}</Text>
                <Text className="text-slate-300 text-sm">Active Classes</Text>
              </View>
              
              <View className="bg-slate-800 rounded-xl p-6 flex-1 ml-3"
                   style={{
                     shadowColor: '#000',
                     shadowOffset: { width: 0, height: 4 },
                     shadowOpacity: 0.3,
                     shadowRadius: 8,
                     borderWidth: 1,
                     borderColor: '#475569'
                   }}>
                <View className="bg-purple-600 p-3 rounded-lg mb-3 self-start"
                     style={{
                       shadowColor: '#8b5cf6',
                       shadowOffset: { width: 0, height: 2 },
                       shadowOpacity: 0.4,
                       shadowRadius: 4,
                     }}>
                  <Ionicons name="time" size={24} color="#fff" />
                </View>
                <Text className="text-white text-2xl font-bold">{stats.todaySessions}</Text>
                <Text className="text-slate-300 text-sm">Today's Sessions</Text>
              </View>
            </View>

            {/* Attendance Rate */}
            <View className="bg-slate-800 rounded-xl p-6 mb-8"
                 style={{
                   shadowColor: '#000',
                   shadowOffset: { width: 0, height: 4 },
                   shadowOpacity: 0.3,
                   shadowRadius: 8,
                   borderWidth: 1,
                   borderColor: '#475569'
                 }}>
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-white text-lg font-semibold">Attendance Rate</Text>
                <View className="bg-yellow-500 p-2 rounded-lg"
                     style={{
                       shadowColor: '#eab308',
                       shadowOffset: { width: 0, height: 2 },
                       shadowOpacity: 0.4,
                       shadowRadius: 4,
                     }}>
                  <Ionicons name="analytics" size={20} color="#fff" />
                </View>
              </View>
              <View className="flex-row items-end">
                <Text className="text-white text-3xl font-bold">{stats.attendanceRate}%</Text>
                <Text className="text-green-400 text-sm ml-2 mb-1 font-medium">+5% this week</Text>
              </View>
              <View className="bg-slate-700 h-3 rounded-full mt-3">
                <View 
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full" 
                  style={{ 
                    width: `${stats.attendanceRate}%`,
                    shadowColor: '#eab308',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                  }}
                />
              </View>
            </View>

            {/* Today's Schedule */}
            <View className="bg-slate-800 rounded-xl p-6 mb-8"
                 style={{
                   shadowColor: '#000',
                   shadowOffset: { width: 0, height: 4 },
                   shadowOpacity: 0.3,
                   shadowRadius: 8,
                   borderWidth: 1,
                   borderColor: '#475569'
                 }}>
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-white text-lg font-semibold">Today's Schedule</Text>
                <Ionicons name="calendar" size={20} color="#3b82f6" />
              </View>
              
              {stats.todaySessionsList.length === 0 ? (
                <View className="bg-slate-700 rounded-lg p-6 items-center">
                  <Ionicons name="calendar-clear" size={32} color="#94a3b8" />
                  <Text className="text-slate-300 text-center mt-2 font-medium">
                    No sessions scheduled for today
                  </Text>
                </View>
              ) : (
                <View className="space-y-3">
                  {stats.todaySessionsList.map((session: any) => (
                    <View key={session.id} className="bg-slate-700 rounded-lg p-4"
                         style={{
                           borderWidth: 1,
                           borderColor: '#475569',
                           shadowColor: '#000',
                           shadowOffset: { width: 0, height: 2 },
                           shadowOpacity: 0.2,
                           shadowRadius: 4,
                         }}>
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1">
                          <Text className="text-white font-semibold">
                            {session.class?.name || "Class Session"}
                          </Text>
                          <Text className="text-blue-400 text-sm mt-1 font-medium">
                            {new Date(session.startTime).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </Text>
                        </View>
                        <View className="bg-green-600 px-3 py-1 rounded-full"
                             style={{
                               shadowColor: '#16a34a',
                               shadowOffset: { width: 0, height: 2 },
                               shadowOpacity: 0.3,
                               shadowRadius: 4,
                             }}>
                          <Text className="text-white text-xs font-bold">Active</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Quick Actions */}
            <View className="bg-slate-800 rounded-xl p-6"
                 style={{
                   shadowColor: '#000',
                   shadowOffset: { width: 0, height: 4 },
                   shadowOpacity: 0.3,
                   shadowRadius: 8,
                   borderWidth: 1,
                   borderColor: '#475569'
                 }}>
              <Text className="text-white text-lg font-semibold mb-4">Quick Actions</Text>
              <View className="space-y-3">
                <TouchableOpacity className="bg-blue-600 rounded-lg p-4 flex-row items-center justify-between"
                                style={{
                                  shadowColor: '#3b82f6',
                                  shadowOffset: { width: 0, height: 3 },
                                  shadowOpacity: 0.3,
                                  shadowRadius: 6,
                                }}>
                  <View className="flex-row items-center">
                    <Ionicons name="add-circle" size={24} color="#fff" />
                    <View className="ml-3">
                      <Text className="text-white font-semibold">Create Session</Text>
                      <Text className="text-blue-200 text-sm">Start a new class session</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#fff" />
                </TouchableOpacity>
                
                <TouchableOpacity className="bg-slate-700 rounded-lg p-4 flex-row items-center justify-between"
                                style={{
                                  borderWidth: 1,
                                  borderColor: '#475569',
                                  shadowColor: '#000',
                                  shadowOffset: { width: 0, height: 2 },
                                  shadowOpacity: 0.2,
                                  shadowRadius: 4,
                                }}>
                  <View className="flex-row items-center">
                    <Ionicons name="qr-code" size={24} color="#8b5cf6" />
                    <View className="ml-3">
                      <Text className="text-white font-semibold">Generate QR Code</Text>
                      <Text className="text-slate-300 text-sm">For student attendance</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#8b5cf6" />
                </TouchableOpacity>
                
                <TouchableOpacity className="bg-slate-700 rounded-lg p-4 flex-row items-center justify-between"
                                style={{
                                  borderWidth: 1,
                                  borderColor: '#475569',
                                  shadowColor: '#000',
                                  shadowOffset: { width: 0, height: 2 },
                                  shadowOpacity: 0.2,
                                  shadowRadius: 4,
                                }}>
                  <View className="flex-row items-center">
                    <Ionicons name="people" size={24} color="#3b82f6" />
                    <View className="ml-3">
                      <Text className="text-white font-semibold">Manage Students</Text>
                      <Text className="text-slate-300 text-sm">View and manage enrollments</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#3b82f6" />
                </TouchableOpacity>
                
                <TouchableOpacity className="bg-slate-700 rounded-lg p-4 flex-row items-center justify-between"
                                style={{
                                  borderWidth: 1,
                                  borderColor: '#475569',
                                  shadowColor: '#000',
                                  shadowOffset: { width: 0, height: 2 },
                                  shadowOpacity: 0.2,
                                  shadowRadius: 4,
                                }}>
                  <View className="flex-row items-center">
                    <Ionicons name="stats-chart" size={24} color="#10b981" />
                    <View className="ml-3">
                      <Text className="text-white font-semibold">View Analytics</Text>
                      <Text className="text-slate-300 text-sm">Class performance insights</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#10b981" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}