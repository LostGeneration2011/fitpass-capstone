import React from 'react';
import {
  Box,
  VStack,
  Text,
  Avatar,
  Button,
  Divider,
  useColorModeValue
} from 'native-base';

export default function StudentProfileScreen() {
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
            JS
          </Avatar>
          
          <VStack space={2} alignItems="center">
            <Text fontSize="lg" fontWeight="semibold">
              John Student
            </Text>
            <Text color="gray.500">
              john.student@email.com
            </Text>
          </VStack>
          
          <Divider />
          
          <VStack space={3} w="100%">
            <Button variant="outline">Edit Profile</Button>
            <Button variant="outline">Membership Details</Button>
            <Button variant="outline">Payment Methods</Button>
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