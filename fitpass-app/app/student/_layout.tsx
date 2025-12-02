import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import StudentHomeScreen from './index';
import StudentClassesScreen from './classes';
import StudentCheckInScreen from './checkin';
import StudentProfileScreen from './profile';

const Tab = createBottomTabNavigator();

export default function StudentTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Classes') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Check-in') {
            iconName = focused ? 'qr-code' : 'qr-code-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: '#1e293b',
          borderTopColor: '#334155',
          borderTopWidth: 1,
        },
        headerStyle: {
          backgroundColor: '#1e293b',
          borderBottomColor: '#334155',
          borderBottomWidth: 1,
        },
        headerTitleStyle: {
          color: '#ffffff',
          fontWeight: '600',
        },
        headerTintColor: '#ffffff',
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={StudentHomeScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen 
        name="Classes" 
        component={StudentClassesScreen}
        options={{ title: 'My Classes' }}
      />
      <Tab.Screen 
        name="Check-in" 
        component={StudentCheckInScreen}
        options={{ title: 'Check-in' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={StudentProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}