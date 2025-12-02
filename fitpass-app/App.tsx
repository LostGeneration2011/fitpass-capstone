import React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import './global.css';
import LoginScreen from './app/login';
import StudentTabNavigator from './app/student/_layout';
import TeacherTabNavigator from './app/teacher/_layout';
import { WebSocketProvider } from './lib/WebSocketContext';

// Import global CSS for web
if (Platform.OS === 'web') {
  require('./global.css');
  require('./web-styles.css');
}

const Stack = createStackNavigator();
const isWeb = Platform.OS === 'web';

export default function App() {
  return (
    <WebSocketProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Student" component={StudentTabNavigator} />
          <Stack.Screen name="Teacher" component={TeacherTabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </WebSocketProvider>
  );
}