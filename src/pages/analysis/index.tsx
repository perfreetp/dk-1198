import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { mockAnalysis } from '@/data/mockData';

export default function AnalysisPage() {
  const maxAmount = Math.max(...mockAnalysis.monthlyTrend.map(item => item.amount));

  const generateReport = () => {
    Taro.showToast({ title: '生成季度账单', icon: 'success' });
  };

  const generateCostCard = () => {
    Taro.showToast({ title: '生成养宠成本卡片', icon: 'success' });
  };

  return (
    <View className={styles.page}>
      <View className={`${styles.section}`}>
        <View className={`${styles.card} ${styles.costCard}`}>
          <Text className={styles.cardTitle}>每公斤猫粮成本</Text>
          <Text className={styles.cardValue}>¥{mockAnalysis.foodCostPerKg}</Text>
          <Text className={styles.cardUnit}>元/公斤</Text>
        </View>
      </View>

      <View className={`${styles.section}`}>
        <View className={styles.statGrid}>
          <View className={styles.statItem}>
            <View className={styles.statIcon}>
              <Text className={styles.statIconText}>💊</Text>
            </View>
            <Text className={styles.statValue}>{mockAnalysis.medicinePercentage}%</Text>
            <Text className={styles.statLabel}>医疗占比</Text>
          </View>
          <View className={styles.statItem}>
            <View className={styles.statIcon}>
              <Text className={styles.statIconText}>📦</Text>
            </View>
            <Text className={styles.statValue}>{mockAnalysis.stockCycle}</Text>
            <Text className={styles.statLabel}>囤货周期(天)</Text>
          </View>
          <View className={styles.statItem}>
            <View className={styles.statIcon}>
              <Text className={styles.statIconText}>📈</Text>
            </View>
            <Text className={styles.statValue}>2</Text>
            <Text className={styles.statLabel}>涨价提醒</Text>
          </View>
        </View>
      </View>

      <View className={`${styles.section}`}>
        <View className={styles.card}>
          <Text className={styles.sectionTitle}>消费趋势</Text>
          <View className={styles.chartContainer}>
            <View className={styles.chartBar}>
              {mockAnalysis.monthlyTrend.map((item, index) => (
                <View key={index} className={styles.barItem}>
                  <Text className={styles.barValue}>¥{item.amount}</Text>
                  <View 
                    className={styles.bar} 
                    style={{ height: `${(item.amount / maxAmount) * 100}%` }} 
                  />
                  <Text className={styles.barLabel}>{item.month.slice(5)}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>

      <View className={`${styles.section}`}>
        <View className={styles.card}>
          <Text className={styles.sectionTitle}>涨价提醒</Text>
          <View className={styles.alertList}>
            {mockAnalysis.priceIncreaseAlert.map((item, index) => (
              <View key={index} className={styles.alertItem}>
                <View className={styles.alertLeft}>
                  <View className={styles.alertIcon}>
                    <Text className={styles.alertIconText}>⚠️</Text>
                  </View>
                  <View className={styles.alertInfo}>
                    <Text className={styles.alertTitle}>{item.name}</Text>
                    <Text className={styles.alertDesc}>{item.spec}</Text>
                  </View>
                </View>
                <Text className={styles.alertRight}>价格上涨</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={`${styles.section}`}>
        <View className={styles.card}>
          <Text className={styles.sectionTitle}>消费排名</Text>
          <View className={styles.alertList}>
            {[
              { name: '猫粮', amount: 615, rank: 1 },
              { name: '医疗', amount: 245, rank: 2 },
              { name: '美容', amount: 200, rank: 3 },
              { name: '零食', amount: 103, rank: 4 }
            ].map((item, index) => (
              <View key={index} className={styles.alertItem}>
                <View className={styles.alertLeft}>
                  <View className={styles.alertIcon} style={{ background: item.rank === 1 ? '#FFD700' : item.rank === 2 ? '#C0C0C0' : item.rank === 3 ? '#CD7F32' : '#909399' }}>
                    <Text className={styles.alertIconText}>{item.rank}</Text>
                  </View>
                  <View className={styles.alertInfo}>
                    <Text className={styles.alertTitle}>{item.name}</Text>
                  </View>
                </View>
                <Text className={styles.alertRight}>¥{item.amount}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={`${styles.section}`}>
        <View className={styles.reportBtn} onClick={generateReport}>
          <Text>📊 生成季度账单</Text>
        </View>
      </View>

      <View className={`${styles.section}`}>
        <View className={styles.reportBtn} onClick={generateCostCard}>
          <Text>🎴 生成养宠成本卡片</Text>
        </View>
      </View>
    </View>
  );
}
