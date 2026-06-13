import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import { useStore } from '@/store';
import type { CategoryType } from '@/types';

export default function ComparePage() {
  const [activeFilter, setActiveFilter] = useState<CategoryType | 'all'>('all');
  const store = useStore();

  const filters = [
    { key: 'all', label: '全部' },
    { key: 'food', label: '猫粮' },
    { key: 'medicine', label: '药品' },
    { key: 'snack', label: '零食' }
  ];

  const filteredProducts = activeFilter === 'all' 
    ? store.products.filter(p => p.shops.length > 0)
    : store.products.filter(p => p.type === activeFilter && p.shops.length > 0);

  const getBestPrice = (shops: { shopName: string; price: number }[]) => {
    return Math.min(...shops.map(s => s.price));
  };

  const getMaxPrice = (shops: { shopName: string; price: number }[]) => {
    return Math.max(...shops.map(s => s.price));
  };

  return (
    <View className={styles.page}>
      <View className={styles.filterBar}>
        {filters.map(filter => (
          <View
            key={filter.key}
            className={`${styles.filterItem} ${activeFilter === filter.key ? styles.active : ''}`}
            onClick={() => setActiveFilter(filter.key as CategoryType | 'all')}
          >
            <Text>{filter.label}</Text>
          </View>
        ))}
      </View>

      {filteredProducts.length > 0 ? (
        filteredProducts.map(product => {
          const bestPrice = getBestPrice(product.shops);
          const maxPrice = getMaxPrice(product.shops);
          
          return (
            <View key={product.id} className={styles.compareCard}>
              <View className={styles.cardHeader}>
                <Text className={styles.productName}>{product.name}</Text>
                <Text className={styles.productSpec}>{product.spec}</Text>
              </View>
              
              <View className={styles.shopsTable}>
                {product.shops.map((shop, index) => (
                  <View key={index} className={styles.shopRow}>
                    <Text className={styles.shopName}>{shop.shopName}</Text>
                    <View style={{ display: 'flex', alignItems: 'center' }}>
                      <Text className={`${styles.shopPrice} ${shop.price === bestPrice ? styles.bestPrice : ''}`}>
                        ¥{shop.price}
                      </Text>
                      {shop.price === bestPrice && <Text className={styles.bestTag}>最低价</Text>}
                    </View>
                  </View>
                ))}
              </View>

              <View className={styles.priceChart}>
                {product.shops.map((shop, index) => {
                  const heightPercent = maxPrice > 0 ? ((shop.price / maxPrice) * 100) : 0;
                  return (
                    <View key={index} className={styles.priceBarItem}>
                      <Text className={styles.priceValue}>¥{shop.price}</Text>
                      <View className={`${styles.priceBar} ${shop.price === bestPrice ? styles.best : ''}`} style={{ height: `${heightPercent}%` }} />
                      <Text className={styles.priceLabel}>{shop.shopName.slice(0, 2)}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })
      ) : (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>🔍</Text>
          <Text className={styles.emptyText}>暂无商品</Text>
        </View>
      )}
    </View>
  );
}