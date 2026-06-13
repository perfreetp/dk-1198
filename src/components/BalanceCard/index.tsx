import React from 'react';
import { View, Text } from '@tarojs/components';
import Card from '../Card';
import styles from './index.module.scss';

interface BalanceCardProps {
  balance: number;
  memberLevel: string;
}

export default function BalanceCard({ balance, memberLevel }: BalanceCardProps) {
  return (
    <Card className={styles.balanceCard}>
      <View className={styles.header}>
        <View className={styles.memberInfo}>
          <Text className={styles.memberLevel}>{memberLevel}</Text>
        </View>
        <Text className={styles.title}>会员余额</Text>
      </View>
      <View className={styles.amountWrap}>
        <Text className={styles.amountPrefix}>¥</Text>
        <Text className={styles.amount}>{balance.toLocaleString()}</Text>
      </View>
      <View className={styles.footer}>
        <Text className={styles.hint}>会员卡余额可在合作门店消费使用</Text>
      </View>
    </Card>
  );
}
