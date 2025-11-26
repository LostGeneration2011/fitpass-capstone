import React from 'react';
import {
  Box,
  VStack,
  Text,
  ScrollView,
  Card,
  Avatar,
  HStack,
  Badge,
  useColorModeValue
} from 'native-base';

export default function TeacherStudentsScreen() {
  return (
    <Box flex={1} bg={useColorModeValue('white', 'dark.900')} safeArea>
      <VStack space={4} p={4}>
        <Text fontSize="2xl" fontWeight="bold">
          My Students
        </Text>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          <VStack space={4}>
            <Card>
              <HStack space={3} p={4} alignItems="center">
                <Avatar size="md" source={{
                  uri: "https://via.placeholder.com/100"
                }}>
                  AS
                </Avatar>
                <VStack flex={1}>
                  <Text fontSize="md" fontWeight="semibold">
                    Alice Smith
                  </Text>
                  <Text color="gray.500" fontSize="sm">
                    Yoga Fundamentals
                  </Text>
                  <Badge colorScheme="green" size="sm" maxW="20">
                    Active
                  </Badge>
                </VStack>
              </HStack>
            </Card>
            
            <Card>
              <HStack space={3} p={4} alignItems="center">
                <Avatar size="md" source={{
                  uri: "https://via.placeholder.com/100"
                }}>
                  BJ
                </Avatar>
                <VStack flex={1}>
                  <Text fontSize="md" fontWeight="semibold">
                    Bob Johnson
                  </Text>
                  <Text color="gray.500" fontSize="sm">
                    Yoga Fundamentals, Advanced HIIT
                  </Text>
                  <Badge colorScheme="green" size="sm" maxW="20">
                    Active
                  </Badge>
                </VStack>
              </HStack>
            </Card>
            
            <Card>
              <HStack space={3} p={4} alignItems="center">
                <Avatar size="md" source={{
                  uri: "https://via.placeholder.com/100"
                }}>
                  CD
                </Avatar>
                <VStack flex={1}>
                  <Text fontSize="md" fontWeight="semibold">
                    Carol Davis
                  </Text>
                  <Text color="gray.500" fontSize="sm">
                    Yoga Fundamentals
                  </Text>
                  <Badge colorScheme="yellow" size="sm" maxW="20">
                    Inactive
                  </Badge>
                </VStack>
              </HStack>
            </Card>
          </VStack>
        </ScrollView>
      </VStack>
    </Box>
  );
}