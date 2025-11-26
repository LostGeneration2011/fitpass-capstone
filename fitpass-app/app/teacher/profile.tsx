import React from 'react';
import {
  Box,
  VStack,
  Text,
  Avatar,
  Button,
  Divider,
  HStack,
  useColorModeValue
} from 'native-base';

export default function TeacherProfileScreen() {
  return (
    <Box flex={1} bg={useColorModeValue('white', 'dark.900')} safeArea>
      <VStack space={4} p={4}>
        <Text fontSize="2xl" fontWeight="bold">
          Profile
        </Text>
        
        <VStack space={4} alignItems="center">
          <Avatar size="xl" source={{
            uri: "https://via.placeholder.com/150"
          }}>
            JT
          </Avatar>
          
          <VStack space={2} alignItems="center">
            <Text fontSize="lg" fontWeight="semibold">
              Jane Teacher
            </Text>
            <Text color="gray.500">
              Certified Yoga Instructor
            </Text>
            <Text color="gray.500">
              jane.teacher@email.com
            </Text>
          </VStack>
          
          <HStack space={4} justifyContent="center">
            <VStack alignItems="center">
              <Text fontSize="lg" fontWeight="bold">
                2
              </Text>
              <Text color="gray.500" fontSize="sm">
                Classes
              </Text>
            </VStack>
            <VStack alignItems="center">
              <Text fontSize="lg" fontWeight="bold">
                15
              </Text>
              <Text color="gray.500" fontSize="sm">
                Students
              </Text>
            </VStack>
            <VStack alignItems="center">
              <Text fontSize="lg" fontWeight="bold">
                4.8
              </Text>
              <Text color="gray.500" fontSize="sm">
                Rating
              </Text>
            </VStack>
          </HStack>
          
          <Divider />
          
          <VStack space={3} w="100%">
            <Button variant="outline">Edit Profile</Button>
            <Button variant="outline">Certifications</Button>
            <Button variant="outline">Earnings</Button>
            <Button variant="outline">Settings</Button>
            <Button variant="outline" colorScheme="red">
              Sign Out
            </Button>
          </VStack>
        </VStack>
      </VStack>
    </Box>
  );
}