import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { enrollmentAPI } from '../../lib/api';

interface Student {
  id: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
  status: string;
  createdAt: string;
  class: {
    name: string;
  };
}

interface GroupedStudents {
  [studentId: string]: {
    user: {
      id: string;
      fullName: string;
      email: string;
    };
    classes: string[];
    status: string;
  };
}

export default function TeacherStudentsScreen() {
  const [students, setStudents] = useState<GroupedStudents>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadStudents = async () => {
    try {
      const enrollmentsResponse = await enrollmentAPI.getAll();
      const enrollments: Student[] = Array.isArray(enrollmentsResponse) 
        ? enrollmentsResponse 
        : enrollmentsResponse.enrollments || [];

      // Group students by user and collect their classes
      const grouped: GroupedStudents = {};
      enrollments.forEach(enrollment => {
        if (!enrollment.user) return;
        
        const userId = enrollment.user.id;
        if (!grouped[userId]) {
          grouped[userId] = {
            user: enrollment.user,
            classes: [],
            status: enrollment.status || 'ACTIVE'
          };
        }
        
        if (enrollment.class?.name) {
          grouped[userId].classes.push(enrollment.class.name);
        }
      });

      setStudents(grouped);
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStudents();
    setRefreshing(false);
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const getStatusColor = (status: string) => {
    return status === 'ACTIVE' ? 'bg-green-600' : 'bg-yellow-600';
  };

  const getStatusText = (status: string) => {
    return status === 'ACTIVE' ? 'Active' : 'Pending';
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <View className="flex-1 p-4">
        <Text className="text-3xl font-bold text-white mb-6">
          My Students
        </Text>
        
        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View className="gap-4">
            {Object.values(students).length > 0 ? (
              Object.values(students).map((student, index) => (
                <View key={student.user.id} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                  <View className="flex-row items-center">
                    <View className="w-14 h-14 rounded-full bg-blue-600 justify-center items-center mr-4">
                      <Text className="text-lg font-bold text-white">
                        {getInitials(student.user.fullName)}
                      </Text>
                    </View>
                    
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-white mb-1">
                        {student.user.fullName}
                      </Text>
                      <Text className="text-slate-300 text-sm mb-2">
                        {student.user.email}
                      </Text>
                      
                      {student.classes.length > 0 && (
                        <Text className="text-slate-300 text-sm mb-3">
                          {student.classes.join(', ')}
                        </Text>
                      )}
                      
                      <View className="flex-row items-center">
                        <View className={`${getStatusColor(student.status)} px-3 py-1 rounded-full mr-3`}>
                          <Text className="text-white text-xs font-medium">
                            {getStatusText(student.status)}
                          </Text>
                        </View>
                        
                        <View className="flex-row items-center">
                          <Ionicons name="school" size={16} color="#94a3b8" />
                          <Text className="text-slate-300 text-sm ml-1">
                            {student.classes.length} classes
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              ))
            ) : loading ? (
              <View className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <Text className="text-slate-300 text-center">Loading students...</Text>
              </View>
            ) : (
              <View className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <View className="items-center">
                  <Ionicons name="people" size={48} color="#64748b" />
                  <Text className="text-white text-lg font-semibold mt-4 mb-2">
                    No Students Found
                  </Text>
                  <Text className="text-slate-300 text-center">
                    Students who enroll in your classes will appear here
                  </Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}