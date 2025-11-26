import React from 'react';
import {
  Card as NBCard,
  Box,
  VStack,
  Text,
  useColorModeValue
} from 'native-base';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  onPress?: () => void;
}

export default function Card({ title, children, onPress }: CardProps) {
  return (
    <NBCard
      bg={useColorModeValue('white', 'gray.800')}
      shadow={2}
      onPress={onPress}
    >
      <Box p={4}>
        {title && (
          <Text fontSize="lg" fontWeight="semibold" mb={2}>
            {title}
          </Text>
        )}
        {children}
      </Box>
    </NBCard>
  );
}