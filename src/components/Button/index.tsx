import React from 'react';
import { View } from '@tarojs/components';
import styles from './index.module.scss';

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  type?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
}

export default function Button({ children, className, type = 'primary', size = 'md', onClick, disabled }: ButtonProps) {
  return (
    <View
      className={`${styles.button} ${styles[`button${type.charAt(0).toUpperCase()}${type.slice(1)}`]} ${styles[`button${size.charAt(0).toUpperCase()}${size.slice(1)}`]} ${disabled ? styles.buttonDisabled : ''} ${className || ''}`}
      onClick={!disabled ? onClick : undefined}
    >
      {children}
    </View>
  );
}
