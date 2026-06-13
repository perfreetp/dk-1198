import React from 'react';
import { View, Text } from '@tarojs/components';
import Card from '../Card';
import styles from './index.module.scss';
import type { CategoryType } from '@/types';
import { categoryColors } from '@/types';

interface CategoryItem {
  type: CategoryType;
  label: string;
  value: number;
  percentage: number;
}

interface CategoryStatsProps {
  data: CategoryItem[];
  title?: string;
}

export default function CategoryStats({ data, title }: CategoryStatsProps) {
  return (
    <Card>
      {title && <Text className={styles.title}>{title}</Text>}
      <View className={styles.stats}>
        {data.map((item) => (
          <View key={item.type} className={styles.statItem}>
            <View className={styles.statLeft}>
              <View className={styles.colorDot} style={{ backgroundColor: categoryColors[item.type] }} />
              <Text className={styles.label}>{item.label}</Text>
            </View>
            <View className={styles.statRight}>
              <Text className={styles.value}>¥{item.value}</Text>
              <View className={styles.barWrap}>
                <View className={styles.barBg}>
                  <View className={styles.bar} style={{ width: `${item.percentage}%`, backgroundColor: categoryColors[item.type] }} />
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
}
