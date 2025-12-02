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
import { classesAPI, enrollmentAPI } from '../../lib/api';

export default function StudentHomeScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const currentUser = await getUser();
      setUser(currentUser);
      console.log('Student Dashboard - Current User:', currentUser);

      if (currentUser?.id) {
        console.log('Loading student data for:', currentUser.id);
        // Load all enrollments and filter by student
        const enrollmentsRes = await enrollmentAPI.getAll();
        console.log('Raw enrollments response:', enrollmentsRes);
        
        // Filter enrollments by current student
        const enrollmentsList = Array.isArray(enrollmentsRes) 
          ? enrollmentsRes.filter((e: any) => {
              console.log('Enrollment:', e.id, 'studentId:', e.studentId, 'matches:', e.studentId === currentUser.id);
              return e.studentId === currentUser.id;
            })
          : [];
        
        console.log('Filtered enrollments for student:', enrollmentsList);
        setEnrollments(enrollmentsList);
      }
    } catch (error) {
      console.error('Error loading student data:', error);
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

  // Calculate stats
  const totalEnrollments = enrollments.length;
  const todaysClasses = enrollments.filter(enrollment => {
    // Check if there are sessions today for this class
    return enrollment.class?.sessions?.some((session: any) => {
      const sessionDate = new Date(session.startTime).toDateString();
      const today = new Date().toDateString();
      return sessionDate === today;
    });
  }).length;

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-950">
        <View className="flex-1 justify-center items-center">
          <View className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full items-center justify-center mb-4"
               style={{
                 shadowColor: '#3b82f6',
                 shadowOffset: { width: 0, height: 6 },
                 shadowOpacity: 0.4,
                 shadowRadius: 12,
               }}>
            <ActivityIndicator size="large" color="white" />
          </View>
          <Text className="text-slate-300 text-lg font-medium">Loading your dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <View className="flex-1 px-6 pt-6">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-white mb-2">
            Welcome back! 💪
          </Text>
          <Text className="text-lg text-cyan-400">
            {user?.fullName || 'Student'}
          </Text>
          <View className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-3" 
               style={{
                 shadowColor: '#3b82f6',
                 shadowOffset: { width: 0, height: 2 },
                 shadowOpacity: 0.5,
                 shadowRadius: 4,
               }} />
        </View>
        
        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              tintColor="#3b82f6"
            />
          }
        >
          <View className="space-y-6 pb-6">
            {/* Stats Overview */}
            <View className="flex-row space-x-4">
              <View className="flex-1 bg-slate-800 rounded-2xl p-6"
                   style={{
                     shadowColor: '#000',
                     shadowOffset: { width: 0, height: 6 },
                     shadowOpacity: 0.3,
                     shadowRadius: 12,
                     borderWidth: 1,
                     borderColor: '#475569'
                   }}>
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-slate-300 text-sm font-medium">Today's Classes</Text>
                    <Text className="text-white text-3xl font-bold mt-1">{todaysClasses}</Text>
                  </View>
                  <View className="bg-blue-600 p-3 rounded-full"
                       style={{
                         shadowColor: '#3b82f6',
                         shadowOffset: { width: 0, height: 3 },
                         shadowOpacity: 0.4,
                         shadowRadius: 6,
                       }}>
                    <Ionicons name="calendar" size={28} color="#fff" />
                  </View>
                </View>
              </View>
              
              <View className="flex-1 bg-slate-800 rounded-2xl p-6"
                   style={{
                     shadowColor: '#000',
                     shadowOffset: { width: 0, height: 6 },
                     shadowOpacity: 0.3,
                     shadowRadius: 12,
                     borderWidth: 1,
                     borderColor: '#475569'
                   }}>
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-slate-300 text-sm font-medium">Enrolled Classes</Text>
                    <Text className="text-white text-3xl font-bold mt-1">{totalEnrollments}</Text>
                  </View>
                  <View className="bg-purple-600 p-3 rounded-full"
                       style={{
                         shadowColor: '#8b5cf6',
                         shadowOffset: { width: 0, height: 3 },
                         shadowOpacity: 0.4,
                         shadowRadius: 6,
                       }}>
                    <Ionicons name="fitness" size={28} color="#fff" />
                  </View>
                </View>
              </View>
            </View>

            {/* Quick Actions */}
            <View className="bg-slate-800 rounded-2xl p-6"
                 style={{
                   shadowColor: '#000',
                   shadowOffset: { width: 0, height: 6 },
                   shadowOpacity: 0.3,
                   shadowRadius: 12,
                   borderWidth: 1,
                   borderColor: '#475569'
                 }}>
              <Text className="text-xl font-bold text-white mb-4">Quick Actions</Text>
              <View className="flex-row space-x-4">
                <TouchableOpacity className="flex-1 bg-green-600 rounded-xl p-4 items-center"
                                style={{
                                  shadowColor: '#16a34a',
                                  shadowOffset: { width: 0, height: 4 },
                                  shadowOpacity: 0.3,
                                  shadowRadius: 8,
                                }}>
                  <Ionicons name="qr-code" size={24} color="#fff" />
                  <Text className="text-white font-semibold mt-2">Scan QR</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 bg-orange-600 rounded-xl p-4 items-center"
                                style={{
                                  shadowColor: '#ea580c',
                                  shadowOffset: { width: 0, height: 4 },
                                  shadowOpacity: 0.3,
                                  shadowRadius: 8,
                                }}>
                  <Ionicons name="calendar" size={24} color="#fff" />
                  <Text className="text-white font-semibold mt-2">Classes</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Enrolled Classes */}
            <View className="bg-slate-800 rounded-2xl p-6"
                 style={{
                   shadowColor: '#000',
                   shadowOffset: { width: 0, height: 6 },
                   shadowOpacity: 0.3,
                   shadowRadius: 12,
                   borderWidth: 1,
                   borderColor: '#475569'
                 }}>
              <Text className="text-xl font-bold text-white mb-4">My Classes</Text>
              {enrollments.length === 0 ? (
                <View className="bg-slate-700 rounded-xl p-6 flex-row items-center justify-center">
                  <Ionicons name="calendar-outline" size={32} color="#06b6d4" />
                  <Text className="text-cyan-400 ml-3 font-medium">No enrolled classes yet</Text>
                </View>
              ) : (
                <View className="space-y-3">
                  {enrollments.slice(0, 3).map((enrollment: any) => (
                    <View key={enrollment.id} className="bg-slate-700 rounded-xl p-4"
                         style={{
                           borderWidth: 1,
                           borderColor: '#475569',
                           shadowColor: '#000',
                           shadowOffset: { width: 0, height: 2 },
                           shadowOpacity: 0.2,
                           shadowRadius: 4,
                         }}>
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                          <View className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl mr-4"
                               style={{
                                 shadowColor: '#3b82f6',
                                 shadowOffset: { width: 0, height: 2 },
                                 shadowOpacity: 0.4,
                                 shadowRadius: 4,
                               }}>
                            <Ionicons name="school" size={20} color="#fff" />
                          </View>
                          <View>
                            <Text className="text-white font-bold text-lg">
                              {enrollment.class?.name || 'Class'}
                            </Text>
                            <Text className="text-slate-300 text-sm font-medium">
                              {enrollment.class?.teacherId ? '✅ Active' : '⏸️ Inactive'}
                            </Text>
                          </View>
                        </View>
                        <View className="bg-green-600 px-4 py-2 rounded-full"
                             style={{
                               shadowColor: '#16a34a',
                               shadowOffset: { width: 0, height: 2 },
                               shadowOpacity: 0.3,
                               shadowRadius: 4,
                             }}>
                          <Text className="text-white text-xs font-bold">✓ Enrolled</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                  
                  {enrollments.length > 3 && (
                    <TouchableOpacity className="bg-blue-50 border border-blue-200 rounded-xl p-4 items-center">
                      <Text className="text-blue-600 font-semibold">
                        View All {enrollments.length} Classes
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>

            {/* Achievement Section */}
            <View className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 shadow-lg">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-white font-bold text-lg">Keep it up! 🔥</Text>
                  <Text className="text-yellow-100 mt-1">You're doing great this week</Text>
                </View>
                <View className="bg-white/20 p-3 rounded-full">
                  <Ionicons name="trophy" size={28} color="#fff" />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}