import React from 'react';
import {
  Box,
  VStack,
  Text,
  ScrollView,
  Card,
  Badge,
  HStack,
  useColorModeValue
} from 'native-base';

export default function StudentClassesScreen() {
  return (
    <Box flex={1} bg={useColorModeValue('white', 'dark.900')} safeArea>
      <VStack space={4} p={4}>
        <Text fontSize="2xl" fontWeight="bold">
          My Classes
        </Text>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          <VStack space={4}>
            <Card>
              <VStack space={2} p={4}>
                <HStack justifyContent="space-between" alignItems="center">
                  <Text fontSize="lg" fontWeight="semibold">
                    Yoga Class
                  </Text>
                  <Badge colorScheme="green">Active</Badge>
                </HStack>
                <Text color="gray.500">
                  Monday, Wednesday, Friday - 9:00 AM
                </Text>
                <Text color="gray.500">
                  Instructor: Jane Smith
                </Text>
              </VStack>
            </Card>
            
            <Card>
              <VStack space={2} p={4}>
                <HStack justifyContent="space-between" alignItems="center">
                  <Text fontSize="lg" fontWeight="semibold">
                    HIIT Training
                  </Text>
                  <Badge colorScheme="orange">Upcoming</Badge>
                </HStack>
                <Text color="gray.500">
                  Tuesday, Thursday - 6:00 PM
                </Text>
                <Text color="gray.500">
                  Instructor: Mike Johnson
                </Text>
              </VStack>
            </Card>
          </VStack>
        </ScrollView>
      </VStack>
    </Box>
  );
}