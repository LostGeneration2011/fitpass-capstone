import React from 'react';
import {
  Center,
  Spinner,
  Text,
  VStack,
  useColorModeValue
} from 'native-base';

interface LoadingProps {
  message?: string;
}

export default function Loading({ message = 'Loading...' }: LoadingProps) {
  return (
    <Center flex={1} bg={useColorModeValue('white', 'gray.900')}>
      <VStack space={4} alignItems="center">
        <Spinner size="lg" color="blue.500" />
        <Text color="gray.500">{message}</Text>
      </VStack>
    </Center>
  );
}