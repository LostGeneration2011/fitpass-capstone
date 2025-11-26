import React from 'react';
import {
  Box,
  VStack,
  Text,
  ScrollView,
  Card,
  Badge,
  HStack,
  Button,
  useColorModeValue
} from 'native-base';

export default function TeacherClassesScreen() {
  return (
    <Box flex={1} bg={useColorModeValue('white', 'dark.900')} safeArea>
      <VStack space={4} p={4}>
        <HStack justifyContent="space-between" alignItems="center">
          <Text fontSize="2xl" fontWeight="bold">
            My Classes
          </Text>
          <Button size="sm">+ New Class</Button>
        </HStack>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          <VStack space={4}>
            <Card>
              <VStack space={2} p={4}>
                <HStack justifyContent="space-between" alignItems="center">
                  <Text fontSize="lg" fontWeight="semibold">
                    Yoga Fundamentals
                  </Text>
                  <Badge colorScheme="green">Active</Badge>
                </HStack>
                <Text color="gray.500">
                  Monday, Wednesday, Friday - 9:00 AM
                </Text>
                <Text color="gray.500">
                  Students: 12/15
                </Text>
                <HStack space={2} mt={2}>
                  <Button size="sm" variant="outline">Edit</Button>
                  <Button size="sm" variant="outline">View Students</Button>
                </HStack>
              </VStack>
            </Card>
            
            <Card>
              <VStack space={2} p={4}>
                <HStack justifyContent="space-between" alignItems="center">
                  <Text fontSize="lg" fontWeight="semibold">
                    Advanced HIIT
                  </Text>
                  <Badge colorScheme="orange">Draft</Badge>
                </HStack>
                <Text color="gray.500">
                  Tuesday, Thursday - 6:00 PM
                </Text>
                <Text color="gray.500">
                  Students: 0/20
                </Text>
                <HStack space={2} mt={2}>
                  <Button size="sm" variant="outline">Edit</Button>
                  <Button size="sm" variant="outline">Publish</Button>
                </HStack>
              </VStack>
            </Card>
          </VStack>
        </ScrollView>
      </VStack>
    </Box>
  );
}