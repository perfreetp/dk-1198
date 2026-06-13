import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import type { CategoryType } from '@/types';
import { categoryLabels } from '@/types';

export default function RecordPage() {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<CategoryType>('food');
  const [description, setDescription] = useState('');
  const [isEssential, setIsEssential] = useState(true);

  const categories: { type: CategoryType; icon: string }[] = [
    { type: 'food', icon: '🥣' },
    { type: 'medicine', icon: '💊' },
    { type: 'snack', icon: '🍪' },
    { type: 'other', icon: '🔧' }
  ];

  const handleKeyPress = (key: string) => {
    if (key === 'delete') {
      setAmount(prev => prev.slice(0, -1));
    } else if (key === '.') {
      if (!amount.includes('.')) {
        setAmount(prev => prev + key);
      }
    } else if (key === 'confirm') {
      submitRecord();
    } else {
      if (amount.includes('.') && amount.split('.')[1].length >= 2) {
        return;
      }
      setAmount(prev => prev + key);
    }
  };

  const submitRecord = () => {
    if (!amount || parseFloat(amount) <= 0) {
      Taro.showToast({ title: '请输入金额', icon: 'none' });
      return;
    }
    Taro.showToast({ title: '记账成功', icon: 'success' });
    setAmount('');
    setDescription('');
    setCategory('food');
    setIsEssential(true);
  };

  const handleCamera = () => {
    Taro.showToast({ title: '拍照识别功能开发中', icon: 'none' });
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.title}>记一笔</Text>
        <Text className={styles.subtitle}>记录宠物消费</Text>
      </View>

      <View className={styles.amountSection}>
        <Text className={styles.amountUnit}>¥</Text>
        <Text className={styles.amountInput}>{amount || '0'}</Text>
      </View>

      <View className={styles.keyboard}>
        {['1', '2', '3', 'delete'].map(key => (
          <View
            key={key}
            className={`${styles.keyboardBtn} ${key === 'delete' ? styles.keyboardBtnDelete : ''}`}
            onClick={() => handleKeyPress(key)}
          >
            <Text>{key === 'delete' ? '⌫' : key}</Text>
          </View>
        ))}
        {['4', '5', '6', '+'].map(key => (
          <View
            key={key}
            className={`${styles.keyboardBtn} ${key === '+' ? styles.keyboardBtnOperation : ''}`}
            onClick={() => handleKeyPress(key)}
          >
            <Text>{key}</Text>
          </View>
        ))}
        {['7', '8', '9', '-'].map(key => (
          <View
            key={key}
            className={`${styles.keyboardBtn} ${key === '-' ? styles.keyboardBtnOperation : ''}`}
            onClick={() => handleKeyPress(key)}
          >
            <Text>{key}</Text>
          </View>
        ))}
        {['.', '0', '00', 'confirm'].map(key => (
          <View
            key={key}
            className={`${styles.keyboardBtn} ${key === 'confirm' ? styles.keyboardBtnConfirm : ''}`}
            onClick={() => handleKeyPress(key)}
          >
            <Text>{key === 'confirm' ? '确认' : key}</Text>
          </View>
        ))}
      </View>

      <View className={styles.formSection}>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>分类</Text>
          <View className={styles.categoryGrid}>
            {categories.map(item => (
              <View
                key={item.type}
                className={`${styles.categoryItem} ${category === item.type ? styles.active : ''}`}
                onClick={() => setCategory(item.type)}
              >
                <View className={`${styles.categoryIcon} ${category === item.type ? styles.active : ''}`}>
                  <Text className={styles.categoryIconText}>{item.icon}</Text>
                </View>
                <Text className={styles.categoryText}>{categoryLabels[item.type]}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>备注</Text>
          <Text className={styles.input} placeholder="输入消费备注" onInput={(e: any) => setDescription(e.detail.value)} />
        </View>

        <View className={styles.formItem}>
          <View className={styles.switchWrap}>
            <Text className={styles.switchText}>必需消费</Text>
            <View className={`${styles.switch} ${isEssential ? styles.active : ''}`} onClick={() => setIsEssential(!isEssential)}>
              <View className={styles.switchDot} />
            </View>
          </View>
        </View>
      </View>

      <View className={styles.cameraSection}>
        <View className={styles.cameraBtn} onClick={handleCamera}>
          <Text className={styles.cameraIcon}>📷</Text>
          <Text className={styles.cameraText}>拍照识别金额</Text>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.submitBtn} onClick={submitRecord}>
          <Text>保存记账</Text>
        </View>
      </View>
    </View>
  );
}
