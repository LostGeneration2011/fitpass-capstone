import React from 'react';
import {
  Box,
  VStack,
  Text,
  ScrollView,
  Card,
  Button,
  HStack,
  useColorModeValue
} from 'native-base';

export default function TeacherHomeScreen() {
  return (
    <Box flex={1} bg={useColorModeValue('white', 'dark.900')} safeArea>
      <VStack space={4} p={4}>
        <Text fontSize="2xl" fontWeight="bold">
          Welcome, Teacher!
        </Text>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          <VStack space={4}>
            <Card>
              <Text fontSize="lg" fontWeight="semibold" p={4}>
                Today's Schedule
              </Text>
              <Text p={4} pt={0} color="gray.500">
                No classes scheduled for today
              </Text>
            </Card>
            
            <Card>
              <Text fontSize="lg" fontWeight="semibold" p={4}>
                Class Statistics
              </Text>
              <VStack space={2} p={4} pt={0}>
                <HStack justifyContent="space-between">
                  <Text>Total Students:</Text>
                  <Text fontWeight="bold">0</Text>
                </HStack>
                <HStack justifyContent="space-between">
                  <Text>Active Classes:</Text>
                  <Text fontWeight="bold">0</Text>
                </HStack>
                <HStack justifyContent="space-between">
                  <Text>This Month:</Text>
                  <Text fontWeight="bold">0 sessions</Text>
                </HStack>
              </VStack>
            </Card>
            
            <Card>
              <Text fontSize="lg" fontWeight="semibold" p={4}>
                Quick Actions
              </Text>
              <VStack space={2} p={4} pt={0}>
                <Button variant="outline">Create Class</Button>
                <Button variant="outline">View Students</Button>
                <Button variant="outline">Send Message</Button>
              </VStack>
            </Card>
          </VStack>
        </ScrollView>
      </VStack>
    </Box>
  );
}