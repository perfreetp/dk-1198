import React from 'react';
import { View } from '@tarojs/components';
import styles from './index.module.scss';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}

export default function Card({ children, className, padding = true }: CardProps) {
  return (
    <View className={`${styles.card} ${padding ? styles.cardPadding : ''} ${className || ''}`}>
      {children}
    </View>
  );
}
