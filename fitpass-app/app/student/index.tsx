import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  ScrollView,
  Card,
  Button,
  useColorModeValue
} from 'native-base';

export default function StudentHomeScreen() {
  return (
    <Box flex={1} bg={useColorModeValue('white', 'dark.900')} safeArea>
      <VStack space={4} p={4}>
        <Text fontSize="2xl" fontWeight="bold">
          Welcome, Student!
        </Text>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          <VStack space={4}>
            <Card>
              <Text fontSize="lg" fontWeight="semibold" p={4}>
                Upcoming Classes
              </Text>
              <Text p={4} pt={0} color="gray.500">
                No upcoming classes scheduled
              </Text>
            </Card>
            
            <Card>
              <Text fontSize="lg" fontWeight="semibold" p={4}>
                Your Progress
              </Text>
              <Text p={4} pt={0} color="gray.500">
                Track your fitness journey here
              </Text>
            </Card>
            
            <Card>
              <Text fontSize="lg" fontWeight="semibold" p={4}>
                Quick Actions
              </Text>
              <VStack space={2} p={4} pt={0}>
                <Button variant="outline">Book a Class</Button>
                <Button variant="outline">View Schedule</Button>
                <Button variant="outline">Contact Trainer</Button>
              </VStack>
            </Card>
          </VStack>
        </ScrollView>
      </VStack>
    </Box>
  );
}