import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import BalanceCard from '@/components/BalanceCard';
import CategoryStats from '@/components/CategoryStats';
import ConsumptionList from '@/components/ConsumptionList';
import BudgetCard from '@/components/BudgetCard';
import Card from '@/components/Card';
import { useStore } from '@/store';

export default function HomePage() {
  const store = useStore();
  const categoryStats = store.getCategoryStats();

  const quickActions = [
    { icon: '📝', text: '记账', path: '/pages/record/index' },
    { icon: '💰', text: '预算', path: '/pages/mine/index' },
    { icon: '📊', text: '分析', path: '/pages/analysis/index' },
    { icon: '🛒', text: '清单', path: '/pages/mine/index' }
  ];

  return (
    <View className={styles.page}>
      <View className={`${styles.section}`}>
        <BalanceCard balance={store.memberInfo.balance} memberLevel={store.memberInfo.memberLevel} />
      </View>

      <View className={`${styles.section}`}>
        <Card className={styles.quickActions}>
          {quickActions.map((item, index) => (
            <View key={index} className={styles.actionItem}>
              <View className={styles.actionIcon}>
                <Text className={styles.actionIconText}>{item.icon}</Text>
              </View>
              <Text className={styles.actionText}>{item.text}</Text>
            </View>
          ))}
        </Card>
      </View>

      <View className={`${styles.section}`}>
        <BudgetCard budget={store.budget} />
      </View>

      <View className={`${styles.section}`}>
        <CategoryStats data={categoryStats} title="常买品类" />
      </View>

      <View className={`${styles.section}`}>
        <Card>
          <View className={styles.titleRow}>
            <Text className={styles.sectionTitle}>最近消费</Text>
            <Text className={styles.viewAll}>查看全部</Text>
          </View>
          <ConsumptionList data={store.consumptions} />
        </Card>
      </View>
    </View>
  );
}