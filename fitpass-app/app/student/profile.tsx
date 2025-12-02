import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getUser, removeToken, removeUser, User } from '../../lib/auth';

export default function StudentProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await getUser();
      setUser(currentUser);
    };
    loadUser();
  }, []);
  
  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await removeToken();
            await removeUser();
            navigation.navigate('Login' as never);
          },
        },
      ]
    );
  };

  const getInitials = (name: string) => {
    if (!name) return 'S';
    const names = name.split(' ');
    return names.length > 1 
      ? `${names[0][0]}${names[names.length - 1][0]}` 
      : names[0][0];
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <View className="flex-1 px-4 pt-6">
        {/* Profile Header */}
        <View className="items-center mb-8">
          <View className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full items-center justify-center mb-4"
               style={{
                 shadowColor: '#3b82f6',
                 shadowOffset: { width: 0, height: 6 },
                 shadowOpacity: 0.4,
                 shadowRadius: 12,
               }}>
            <Text className="text-3xl font-bold text-white">
              {getInitials(user?.fullName || 'Student')}
            </Text>
          </View>
          
          <Text className="text-2xl font-bold text-white mb-2">
            {user?.fullName || 'Student User'}
          </Text>
          <Text className="text-slate-300">
            {user?.email || 'student@email.com'}
          </Text>
          <View className="w-16 h-1 bg-blue-500 rounded-full mt-3" 
               style={{
                 shadowColor: '#3b82f6',
                 shadowOffset: { width: 0, height: 2 },
                 shadowOpacity: 0.5,
                 shadowRadius: 4,
               }} />
        </View>
        
        {/* Sign Out Button */}
        <TouchableOpacity 
          onPress={handleSignOut}
          className="bg-red-600 rounded-xl py-4 items-center"
          style={{
            shadowColor: '#dc2626',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            borderWidth: 1,
            borderColor: '#991b1b',
          }}
        >
          <Text className="text-white font-semibold text-lg">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}