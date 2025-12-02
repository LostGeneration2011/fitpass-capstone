import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getUser } from '../../lib/auth';
import { enrollmentAPI } from '../../lib/api';

export default function StudentClassesScreen() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadClasses = async () => {
    try {
      const user = await getUser();
      console.log('Student Classes - Current User:', user);
      if (user?.id) {
        console.log('Loading enrollments for student:', user.id);
        const res = await enrollmentAPI.getAll();
        console.log('Raw enrollments response:', res);
        
        // Filter enrollments by current student
        const enrollmentsList = Array.isArray(res) 
          ? res.filter((e: any) => {
              console.log('Enrollment:', e.id, 'studentId:', e.studentId, 'matches:', e.studentId === user.id);
              return e.studentId === user.id;
            })
          : [];
        
        console.log('Filtered enrollments:', enrollmentsList);
        setEnrollments(enrollmentsList);
      }
    } catch (error) {
      console.error('Error loading enrollments:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadClasses();
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-950">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="text-slate-300 mt-4 text-lg font-medium">Loading classes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <View className="flex-1 px-4 pt-6">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-white">My Classes</Text>
          <Text className="text-slate-300">{enrollments.length} enrolled</Text>
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
          <View className="space-y-4 pb-6">
            {enrollments.length === 0 ? (
              <View className="bg-slate-800 rounded-xl p-8 items-center"
                   style={{
                     borderWidth: 1,
                     borderColor: '#475569',
                     shadowColor: '#000',
                     shadowOffset: { width: 0, height: 4 },
                     shadowOpacity: 0.3,
                     shadowRadius: 8,
                   }}>
                <View className="bg-blue-600 p-6 rounded-full mb-4"
                     style={{
                       shadowColor: '#3b82f6',
                       shadowOffset: { width: 0, height: 3 },
                       shadowOpacity: 0.4,
                       shadowRadius: 6,
                     }}>
                  <Ionicons name="calendar-outline" size={32} color="#fff" />
                </View>
                <Text className="text-xl font-semibold text-white mb-2">No Classes Yet</Text>
                <Text className="text-slate-300 text-center leading-6">
                  You haven't enrolled in any classes yet. Browse available classes to get started!
                </Text>
              </View>
            ) : (
              enrollments.map((enrollment: any) => (
                <View key={enrollment.id} className="bg-slate-800 rounded-xl overflow-hidden"
                     style={{
                       borderWidth: 1,
                       borderColor: '#475569',
                       shadowColor: '#000',
                       shadowOffset: { width: 0, height: 4 },
                       shadowOpacity: 0.3,
                       shadowRadius: 8,
                     }}>
                  <View className="p-6">
                    <View className="flex-row items-start justify-between mb-3">
                      <View className="flex-1">
                        <Text className="text-xl font-semibold text-white mb-1">
                          {enrollment.class?.name || 'Class Name'}
                        </Text>
                        <Text className="text-slate-300 text-sm mb-2">
                          {enrollment.class?.description || 'No description available'}
                        </Text>
                        <View className="flex-row items-center">
                          <Ionicons name="person" size={16} color="#94a3b8" />
                          <Text className="text-slate-300 text-sm ml-2">
                            {enrollment.class?.teacher?.fullName || 'Teacher'}
                          </Text>
                        </View>
                      </View>
                      <View className="bg-green-600 px-3 py-1 rounded-full ml-3"
                           style={{
                             shadowColor: '#16a34a',
                             shadowOffset: { width: 0, height: 2 },
                             shadowOpacity: 0.3,
                             shadowRadius: 4,
                           }}>
                        <Text className="text-white text-xs font-medium">Enrolled</Text>
                      </View>
                    </View>

                    <View className="flex-row items-center space-x-6 mt-4">
                      <View className="flex-row items-center">
                        <View className="bg-blue-600 p-2 rounded-lg mr-3"
                             style={{
                               shadowColor: '#3b82f6',
                               shadowOffset: { width: 0, height: 2 },
                               shadowOpacity: 0.3,
                               shadowRadius: 4,
                             }}>
                          <Ionicons name="people" size={16} color="#fff" />
                        </View>
                        <View>
                          <Text className="text-slate-300 text-xs">Capacity</Text>
                          <Text className="text-white font-semibold">{enrollment.class?.capacity || 0}</Text>
                        </View>
                      </View>
                      
                      <View className="flex-row items-center">
                        <View className="bg-purple-600 p-2 rounded-lg mr-3"
                             style={{
                               shadowColor: '#8b5cf6',
                               shadowOffset: { width: 0, height: 2 },
                               shadowOpacity: 0.3,
                               shadowRadius: 4,
                             }}>
                          <Ionicons name="time" size={16} color="#fff" />
                        </View>
                        <View>
                          <Text className="text-slate-300 text-xs">Duration</Text>
                          <Text className="text-white font-semibold">{enrollment.class?.duration || 0} mins</Text>
                        </View>
                      </View>
                    </View>

                    <View className="flex-row space-x-3 mt-6">
                      <TouchableOpacity className="flex-1 bg-blue-600 rounded-lg py-3 flex-row items-center justify-center"
                                      style={{
                                        shadowColor: '#3b82f6',
                                        shadowOffset: { width: 0, height: 3 },
                                        shadowOpacity: 0.3,
                                        shadowRadius: 6,
                                      }}>
                        <Ionicons name="qr-code" size={20} color="#fff" />
                        <Text className="text-white font-medium ml-2">Check-in</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity className="bg-slate-700 rounded-lg py-3 px-4 flex-row items-center justify-center border border-slate-600">
                        <Ionicons name="information-circle" size={20} color="#94a3b8" />
                        <Text className="text-slate-300 font-medium ml-2">Details</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))
            )}

            {/* Add more classes card */}
            <TouchableOpacity className="bg-slate-800 rounded-xl p-8 items-center border border-slate-700 border-dashed">
              <View className="bg-slate-700 p-6 rounded-full mb-4">
                <Ionicons name="add" size={32} color="#94a3b8" />
              </View>
              <Text className="text-xl font-semibold text-white mb-2">Find More Classes</Text>
              <Text className="text-slate-300 text-center leading-6">
                Browse available classes and expand your fitness journey
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}