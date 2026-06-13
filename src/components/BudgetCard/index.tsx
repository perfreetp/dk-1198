import React from 'react';
import { View, Text } from '@tarojs/components';
import Card from '../Card';
import styles from './index.module.scss';
import type { Budget } from '@/types';

interface BudgetCardProps {
  budget: Budget;
}

export default function BudgetCard({ budget }: BudgetCardProps) {
  const percentage = Math.min((budget.currentMonthSpent / budget.monthlyLimit) * 100, 100);
  const isWarning = percentage >= budget.warningThreshold;
  const remaining = Math.max(budget.monthlyLimit - budget.currentMonthSpent, 0);
  
  return (
    <Card className={styles.budgetCard}>
      <View className={styles.header}>
        <Text className={styles.title}>本月预算</Text>
        <Text className={styles.remaining}>剩余 ¥{remaining}</Text>
      </View>
      <View className={styles.amountWrap}>
        <Text className={styles.spentAmount}>¥{budget.currentMonthSpent}</Text>
        <Text className={styles.limit}>/ ¥{budget.monthlyLimit}</Text>
      </View>
      <View className={styles.progressWrap}>
        <View className={styles.progressBg}>
          <View 
            className={`${styles.progress} ${isWarning ? styles.progressWarning : ''}`} 
            style={{ width: `${percentage}%` }} 
          />
        </View>
        <Text className={`${styles.percentage} ${isWarning ? styles.percentageWarning : ''}`}>
          {percentage.toFixed(1)}%
        </Text>
      </View>
      {isWarning && (
        <Text className={styles.warningText}>⚠️ 本月消费已超过预算预警线</Text>
      )}
    </Card>
  );
}
