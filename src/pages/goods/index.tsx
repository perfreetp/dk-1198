import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useProducts } from '@/store';
import type { Product, CategoryType } from '@/types';

export default function GoodsPage() {
  const [activeTab, setActiveTab] = useState<CategoryType | 'all'>('all');
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    type: 'food' as CategoryType,
    unitPrice: '',
    spec: '',
    brand: ''
  });
  const { products, addProduct } = useProducts();

  const tabs = [
    { key: 'all', label: '全部' },
    { key: 'food', label: '猫粮' },
    { key: 'medicine', label: '药品' },
    { key: 'snack', label: '零食' }
  ];

  const filteredProducts = activeTab === 'all' 
    ? products 
    : products.filter(p => p.type === activeTab);

  const handleSubmit = () => {
    if (!newProduct.name) {
      Taro.showToast({ title: '请填写商品名称', icon: 'none' });
      return;
    }
    if (!newProduct.unitPrice || parseFloat(newProduct.unitPrice) <= 0) {
      Taro.showToast({ title: '请填写有效单价', icon: 'none' });
      return;
    }
    if (!newProduct.spec) {
      Taro.showToast({ title: '请填写规格', icon: 'none' });
      return;
    }
    if (!newProduct.brand) {
      Taro.showToast({ title: '请填写品牌', icon: 'none' });
      return;
    }

    addProduct({
      name: newProduct.name,
      type: newProduct.type,
      unitPrice: parseFloat(newProduct.unitPrice),
      spec: newProduct.spec,
      brand: newProduct.brand
    });

    Taro.showToast({ title: '添加成功', icon: 'success' });
    setShowModal(false);
    setNewProduct({ name: '', type: 'food', unitPrice: '', spec: '', brand: '' });
  };

  const handleCompare = () => {
    Taro.navigateTo({ url: '/pages/compare/index' });
  };

  return (
    <View className={styles.page}>
      <View className={styles.tabBar}>
        {tabs.map(tab => (
          <View
            key={tab.key}
            className={`${styles.tabItem} ${activeTab === tab.key ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.key as CategoryType | 'all')}
          >
            <Text>{tab.label}</Text>
          </View>
        ))}
      </View>

      <View className={styles.goodsList}>
        {filteredProducts.map((product: Product) => (
          <View key={product.id} className={styles.goodsItem}>
            <View className={styles.goodsHeader}>
              <View className={styles.goodsInfo}>
                <Text className={styles.goodsName}>{product.name}</Text>
                {product.brand && <Text className={styles.goodsBrand}>{product.brand}</Text>}
              </View>
              <Text className={styles.goodsPrice}>¥{product.unitPrice}</Text>
            </View>
            <Text className={styles.goodsSpec}>规格：{product.spec}</Text>
            <Text className={styles.shopsTitle}>购买渠道</Text>
            <View className={styles.shopsList}>
              {product.shops.map((shop, index) => (
                <View key={index} className={styles.shopItem}>
                  <Text className={styles.shopName}>{shop.shopName}</Text>
                  <Text className={styles.shopPrice}>¥{shop.price}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      <View className={styles.addBtn} onClick={() => setShowModal(true)}>
        <Text className={styles.addIcon}>+</Text>
      </View>

      {showModal && (
        <View className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <Text className={styles.modalTitle}>添加商品</Text>
            
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>商品名称 *</Text>
              <Text 
                className={styles.formInput} 
                placeholder="输入商品名称" 
                onInput={(e: any) => setNewProduct({ ...newProduct, name: e.detail.value })} 
              />
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>分类</Text>
              <View className={styles.shopsList}>
                {(['food', 'medicine', 'snack'] as CategoryType[]).map(type => (
                  <View
                    key={type}
                    className={`${styles.shopItem} ${newProduct.type === type ? styles.active : ''}`}
                    onClick={() => setNewProduct({ ...newProduct, type })}
                  >
                    <Text className={styles.shopName}>{type === 'food' ? '猫粮' : type === 'medicine' ? '药品' : '零食'}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>品牌 *</Text>
              <Text 
                className={styles.formInput} 
                placeholder="输入品牌" 
                onInput={(e: any) => setNewProduct({ ...newProduct, brand: e.detail.value })} 
              />
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>规格 *</Text>
              <Text 
                className={styles.formInput} 
                placeholder="如：2kg" 
                onInput={(e: any) => setNewProduct({ ...newProduct, spec: e.detail.value })} 
              />
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>单价 *</Text>
              <Text 
                className={styles.formInput} 
                placeholder="输入单价" 
                onInput={(e: any) => setNewProduct({ ...newProduct, unitPrice: e.detail.value })} 
              />
            </View>

            <View className={styles.modalActions}>
              <View className={`${styles.modalBtn} ${styles.secondary}`} onClick={() => setShowModal(false)}>
                <Text>取消</Text>
              </View>
              <View className={`${styles.modalBtn} ${styles.primary}`} onClick={handleSubmit}>
                <Text>保存</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      <View className={styles.compareBtn} onClick={handleCompare}>
        <Text>🔍 对比商品价格</Text>
      </View>
    </View>
  );
}
