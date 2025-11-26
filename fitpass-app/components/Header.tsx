import React from 'react';
import {
  Box,
  HStack,
  Text,
  IconButton,
  useColorModeValue
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightComponent?: React.ReactNode;
}

export default function Header({
  title,
  showBack = false,
  onBack,
  rightComponent
}: HeaderProps) {
  return (
    <Box
      bg={useColorModeValue('white', 'gray.800')}
      px={4}
      py={3}
      safeAreaTop
      shadow={1}
    >
      <HStack alignItems="center" justifyContent="space-between">
        <HStack alignItems="center" flex={1}>
          {showBack && (
            <IconButton
              icon={<Ionicons name="arrow-back" size={24} />}
              onPress={onBack}
              mr={2}
            />
          )}
          <Text fontSize="lg" fontWeight="bold" flex={1}>
            {title}
          </Text>
        </HStack>
        {rightComponent}
      </HStack>
    </Box>
  );
}