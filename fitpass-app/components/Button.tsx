import React from 'react';
import { Button as NBButton, IButtonProps } from 'native-base';

interface CustomButtonProps extends IButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export default function Button({
  title,
  onPress,
  variant = 'solid',
  size = 'md',
  ...props
}: CustomButtonProps) {
  return (
    <NBButton
      variant={variant}
      size={size}
      onPress={onPress}
      {...props}
    >
      {title}
    </NBButton>
  );
}