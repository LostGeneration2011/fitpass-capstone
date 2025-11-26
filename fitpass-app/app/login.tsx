import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Center,
  Image,
  Pressable,
  useColorModeValue
} from 'native-base';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'student' | 'teacher'>('student');
  const navigation = useNavigation();

  const handleLogin = () => {
    // Login logic here
    if (userType === 'student') {
      navigation.navigate('Student' as never);
    } else {
      navigation.navigate('Teacher' as never);
    }
  };

  return (
    <Center flex={1} px="3" bg={useColorModeValue('white', 'dark.900')}>
      <Box safeArea p="2" py="8" w="90%" maxW="290">
        <VStack space={3} mt="5">
          <Text fontSize="lg" fontWeight="600" textAlign="center">
            Welcome to FitPass
          </Text>
          
          <HStack space={4} justifyContent="center" mb={4}>
            <Pressable
              onPress={() => setUserType('student')}
              bg={userType === 'student' ? 'primary.500' : 'gray.100'}
              px={4}
              py={2}
              rounded="md"
            >
              <Text color={userType === 'student' ? 'white' : 'black'}>
                Student
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setUserType('teacher')}
              bg={userType === 'teacher' ? 'primary.500' : 'gray.100'}
              px={4}
              py={2}
              rounded="md"
            >
              <Text color={userType === 'teacher' ? 'white' : 'black'}>
                Teacher
              </Text>
            </Pressable>
          </HStack>

          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button mt="2" colorScheme="indigo" onPress={handleLogin}>
            Sign in
          </Button>
        </VStack>
      </Box>
    </Center>
  );
}