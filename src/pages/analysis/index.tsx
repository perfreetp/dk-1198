import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useStore } from '@/store';

export default function AnalysisPage() {
  const store = useStore();
  const [showReportModal, setShowReportModal] = useState(false);
  const [showCostCardModal, setShowCostCardModal] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [costCardData, setCostCardData] = useState<any>(null);

  const analysis = store.getAnalysisData();
  const maxAmount = Math.max(...analysis.monthlyTrend.map(item => item.amount), 1);

  const handleGenerateReport = () => {
    try {
      const report = store.generateQuarterlyReport();
      setReportData(report);
      setShowReportModal(true);
    } catch (e) {
      Taro.showToast({ title: '生成账单失败', icon: 'none' });
    }
  };

  const handleGenerateCostCard = () => {
    try {
      const card = store.generateCostCard();
      setCostCardData(card);
      setShowCostCardModal(true);
    } catch (e) {
      Taro.showToast({ title: '生成卡片失败', icon: 'none' });
    }
  };

  const handleShare = (type: string) => {
    Taro.showToast({ title: `${type}已生成，可分享给好友`, icon: 'success', duration: 2000 });
  };

  const categoryLabels: Record<string, string> = {
    food: '猫粮',
    medicine: '药品',
    snack: '零食',
    other: '其他'
  };

  const getRankingBg = (rank: number) => {
    if (rank === 1) return '#FFD700';
    if (rank === 2) return '#C0C0C0';
    if (rank === 3) return '#CD7F32';
    return '#909399';
  };

  return (
    <View className={styles.page}>
      <View className={`${styles.section}`}>
        <View className={`${styles.card} ${styles.costCard}`}>
          <Text className={styles.cardTitle}>每公斤猫粮成本</Text>
          <Text className={styles.cardValue}>¥{analysis.foodCostPerKg}</Text>
          <Text className={styles.cardUnit}>元/公斤</Text>
        </View>
      </View>

      <View className={`${styles.section}`}>
        <View className={styles.statGrid}>
          <View className={styles.statItem}>
            <View className={styles.statIcon}>
              <Text className={styles.statIconText}>💊</Text>
            </View>
            <Text className={styles.statValue}>{analysis.medicinePercentage}%</Text>
            <Text className={styles.statLabel}>医疗占比</Text>
          </View>
          <View className={styles.statItem}>
            <View className={styles.statIcon}>
              <Text className={styles.statIconText}>📦</Text>
            </View>
            <Text className={styles.statValue}>{analysis.stockCycle}</Text>
            <Text className={styles.statLabel}>囤货周期(天)</Text>
          </View>
          <View className={styles.statItem}>
            <View className={styles.statIcon}>
              <Text className={styles.statIconText}>📈</Text>
            </View>
            <Text className={styles.statValue}>{store.products.length}</Text>
            <Text className={styles.statLabel}>商品数量</Text>
          </View>
        </View>
      </View>

      <View className={`${styles.section}`}>
        <View className={styles.card}>
          <Text className={styles.sectionTitle}>消费趋势</Text>
          <View className={styles.chartContainer}>
            <View className={styles.chartBar}>
              {analysis.monthlyTrend.length > 0 ? analysis.monthlyTrend.map((item, index) => (
                <View key={index} className={styles.barItem}>
                  <Text className={styles.barValue}>¥{item.amount}</Text>
                  <View 
                    className={styles.bar} 
                    style={{ height: `${(item.amount / maxAmount) * 100}%` }} 
                  />
                  <Text className={styles.barLabel}>{item.month.slice(5)}</Text>
                </View>
              )) : (
                <Text className={styles.emptyText}>暂无消费数据</Text>
              )}
            </View>
          </View>
        </View>
      </View>

      <View className={`${styles.section}`}>
        <View className={styles.card}>
          <Text className={styles.sectionTitle}>涨价提醒</Text>
          <View className={styles.alertList}>
            {store.products.slice(0, 2).map((item, index) => (
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
                <Text className={styles.alertRight}>¥{item.unitPrice}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={`${styles.section}`}>
        <View className={styles.reportBtn} onClick={handleGenerateReport}>
          <Text>📊 生成季度账单</Text>
        </View>
      </View>

      <View className={`${styles.section}`}>
        <View className={styles.reportBtn} onClick={handleGenerateCostCard}>
          <Text>🎴 生成养宠成本卡片</Text>
        </View>
      </View>

      {showReportModal && reportData && (
        <View className={styles.modalOverlay} onClick={() => setShowReportModal(false)}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <Text className={styles.modalTitle}>{reportData.quarter}消费账单</Text>
            
            <View className={styles.summaryCard}>
              <Text className={styles.summaryLabel}>季度总消费</Text>
              <Text className={styles.summaryAmount}>¥{reportData.totalAmount}</Text>
              <Text className={styles.summaryDesc}>共{reportData.recordCount}笔记录</Text>
            </View>

            <Text className={styles.modalSectionTitle}>分类占比</Text>
            <View className={styles.categoryList}>
              {reportData.categoryList.map((item: any, index: number) => (
                <View key={index} className={styles.categoryItem}>
                  <Text className={styles.categoryName}>{categoryLabels[item.type] || item.type}</Text>
                  <View className={styles.categoryBarWrap}>
                    <View className={styles.categoryBarBg}>
                      <View className={styles.categoryBar} style={{ width: `${item.percentage}%` }} />
                    </View>
                    <Text className={styles.categoryValue}>¥{item.amount} ({item.percentage}%)</Text>
                  </View>
                </View>
              ))}
            </View>

            <Text className={styles.modalSectionTitle}>月度明细</Text>
            <View className={styles.monthlyList}>
              {reportData.monthlyBreakdown.map((item: any, index: number) => (
                <View key={index} className={styles.monthlyItem}>
                  <Text className={styles.monthlyName}>{item.month.slice(5)}月</Text>
                  <Text className={styles.monthlyValue}>¥{item.amount}</Text>
                </View>
              ))}
            </View>

            <View className={styles.modalActions}>
              <View className={`${styles.modalBtn} ${styles.secondary}`} onClick={() => setShowReportModal(false)}>
                <Text>关闭</Text>
              </View>
              <View className={`${styles.modalBtn} ${styles.primary}`} onClick={() => handleShare('季度账单')}>
                <Text>分享账单</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {showCostCardModal && costCardData && (
        <View className={styles.modalOverlay} onClick={() => setShowCostCardModal(false)}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <View className={styles.costCardHeader}>
              <Text className={styles.costCardTitle}>🐱 养宠成本卡片</Text>
              <Text className={styles.costCardSubtitle}>记录每一份爱与责任</Text>
            </View>

            <View className={styles.costCardTotal}>
              <Text className={styles.costTotalLabel}>累计消费</Text>
              <Text className={styles.costTotalAmount}>¥{costCardData.totalSpent}</Text>
            </View>

            <Text className={styles.modalSectionTitle}>分类占比</Text>
            <View className={styles.costCategoryList}>
              {costCardData.categoryRanking.map((item: any, index: number) => (
                <View key={index} className={styles.costCategoryItem}>
                  <View className={styles.costCategoryLeft}>
                    <Text className={styles.costCategoryIcon}>{item.icon}</Text>
                    <Text className={styles.costCategoryName}>{item.name}</Text>
                  </View>
                  <View className={styles.costCategoryRight}>
                    <View className={styles.costCategoryBarBg}>
                      <View className={styles.costCategoryBar} style={{ width: `${item.percentage}%` }} />
                    </View>
                    <Text className={styles.costCategoryValue}>¥{item.amount} ({item.percentage}%)</Text>
                  </View>
                </View>
              ))}
            </View>

            <Text className={styles.modalSectionTitle}>消费排名</Text>
            <View className={styles.costRankingList}>
              {costCardData.categoryRanking.map((item: any, index: number) => (
                <View key={index} className={styles.costRankingItem}>
                  <View className={styles.costRankingLeft}>
                    <View className={styles.costRankingBadge} style={{ background: getRankingBg(index + 1) }}>
                      <Text className={styles.costRankingNum}>{index + 1}</Text>
                    </View>
                    <Text className={styles.costCategoryIcon}>{item.icon}</Text>
                    <Text className={styles.costRankingName}>{item.name}</Text>
                  </View>
                  <Text className={styles.costRankingAmount}>¥{item.amount}</Text>
                </View>
              ))}
            </View>

            <View className={styles.costCardAvg}>
              <Text className={styles.costAvgLabel}>月均消费</Text>
              <Text className={styles.costAvgAmount}>¥{costCardData.averageMonthly}</Text>
              <Text className={styles.costAvgDesc}>共{costCardData.recordCount}笔记录</Text>
            </View>

            <View className={styles.modalActions}>
              <View className={`${styles.modalBtn} ${styles.secondary}`} onClick={() => setShowCostCardModal(false)}>
                <Text>关闭</Text>
              </View>
              <View className={`${styles.modalBtn} ${styles.primary}`} onClick={() => handleShare('养宠成本卡片')}>
                <Text>分享卡片</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}