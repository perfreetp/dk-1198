import React from 'react';
import { View, Text } from '@tarojs/components';
import Card from '../Card';
import styles from './index.module.scss';
import type { Consumption } from '@/types';
import { categoryLabels, categoryColors } from '@/types';

interface ConsumptionListProps {
  data: Consumption[];
  title?: string;
  maxItems?: number;
}

export default function ConsumptionList({ data, title, maxItems = 5 }: ConsumptionListProps) {
  const displayData = maxItems ? data.slice(0, maxItems) : data;
  
  return (
    <Card>
      {title && <Text className={styles.title}>{title}</Text>}
      <View className={styles.list}>
        {displayData.map((item) => (
          <View key={item.id} className={styles.listItem}>
            <View className={styles.itemLeft}>
              <View className={styles.icon} style={{ backgroundColor: `${categoryColors[item.type]}20` }}>
                <Text className={styles.iconText}>{categoryLabels[item.type][0]}</Text>
              </View>
              <View className={styles.info}>
                <Text className={styles.description}>{item.description}</Text>
                <Text className={styles.date}>{item.date}</Text>
              </View>
            </View>
            <View className={styles.itemRight}>
              <Text className={styles.amount}>-¥{item.amount}</Text>
              {item.isEssential && (
                <Text className={styles.essentialTag}>必需</Text>
              )}
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
}
