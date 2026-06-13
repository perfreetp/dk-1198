import React, { useState } from 'react';
import { View, Text, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useBudget, useShoppingList, useMemberInfo, useConsumptions } from '@/store';
import type { ShoppingItem } from '@/types';

export default function MinePage() {
  const { budget, updateBudget } = useBudget();
  const { shoppingList, toggleItem, addItem } = useShoppingList();
  const [memberInfo] = useMemberInfo();
  const { consumptions } = useConsumptions();
  
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showShoppingModal, setShowShoppingModal] = useState(false);
  const [newBudget, setNewBudget] = useState('');
  const [newItem, setNewItem] = useState({ name: '', quantity: '1', priority: 'medium' });

  const menuItems = [
    { icon: '📊', text: '消费报表', path: '/pages/analysis/index' },
    { icon: '🎴', text: '养宠卡片', action: () => Taro.switchTab({ url: '/pages/analysis/index' }) },
    { icon: '💳', text: '会员卡', action: () => Taro.showToast({ title: '会员卡详情', icon: 'none' }) },
    { icon: '⚙️', text: '设置', action: () => Taro.showToast({ title: '设置页面', icon: 'none' }) }
  ];

  const openBudgetModal = () => {
    setNewBudget(budget.monthlyLimit.toString());
    setShowBudgetModal(true);
  };

  const saveBudget = () => {
    const amount = parseFloat(newBudget);
    if (!newBudget.trim() || amount <= 0) {
      Taro.showToast({ title: '请输入有效的预算金额', icon: 'none' });
      return;
    }
    updateBudget(amount);
    Taro.showToast({ title: '预算设置成功', icon: 'success' });
    setShowBudgetModal(false);
  };

  const addShoppingItem = () => {
    if (!newItem.name.trim()) {
      Taro.showToast({ title: '请输入物品名称', icon: 'none' });
      return;
    }
    addItem({
      name: newItem.name.trim(),
      type: 'food',
      quantity: parseInt(newItem.quantity) || 1,
      priority: newItem.priority as 'high' | 'medium' | 'low'
    });
    setShowShoppingModal(false);
    setNewItem({ name: '', quantity: '1', priority: 'medium' });
    Taro.showToast({ title: '添加成功', icon: 'success' });
  };

  const handleMenuClick = (item: typeof menuItems[0]) => {
    if (item.path) {
      Taro.switchTab({ url: item.path });
    } else if (item.action) {
      item.action();
    }
  };

  const totalSpent = consumptions.reduce((sum, c) => sum + c.amount, 0);

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.userInfo}>
          <View className={styles.avatar}>
            <Text className={styles.avatarIcon}>🐱</Text>
          </View>
          <View className={styles.userDetail}>
            <Text className={styles.userName}>{memberInfo.name}</Text>
            <Text className={styles.userLevel}>{memberInfo.memberLevel}</Text>
          </View>
        </View>
        <View className={styles.stats}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>¥{memberInfo.balance}</Text>
            <Text className={styles.statLabel}>余额</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>¥{totalSpent}</Text>
            <Text className={styles.statLabel}>累计消费</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{consumptions.length}</Text>
            <Text className={styles.statLabel}>记录数</Text>
          </View>
        </View>
      </View>

      <View className={styles.menuList}>
        {menuItems.map((item, index) => (
          <View key={index} className={styles.menuItem} onClick={() => handleMenuClick(item)}>
            <Text className={styles.menuIcon}>{item.icon}</Text>
            <Text className={styles.menuText}>{item.text}</Text>
            <Text className={styles.menuArrow}>›</Text>
          </View>
        ))}
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>月度预算</Text>
        <View className={styles.budgetCard}>
          <View className={styles.budgetHeader}>
            <Text className={styles.budgetTitle}>本月消费上限</Text>
            <Text className={styles.budgetEdit} onClick={openBudgetModal}>修改</Text>
          </View>
          <Text className={styles.budgetAmount}>¥{budget.monthlyLimit}</Text>
          <Text className={styles.budgetDesc}>本月已消费 ¥{budget.currentMonthSpent}</Text>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>待买清单</Text>
        <View className={styles.shoppingList}>
          {shoppingList.map((item: ShoppingItem) => (
            <View key={item.id} className={styles.shoppingItem}>
              <View 
                className={`${styles.checkbox} ${item.isChecked ? styles.checked : ''}`} 
                onClick={() => toggleItem(item.id)}
              >
                {item.isChecked && <Text className={styles.checkIcon}>✓</Text>}
              </View>
              <View className={styles.shoppingInfo}>
                <Text className={styles.shoppingName} style={{ textDecoration: item.isChecked ? 'line-through' : 'none' }}>
                  {item.name}
                </Text>
                <Text className={styles.shoppingQty}>数量：{item.quantity}</Text>
              </View>
              <Text className={`${styles.priority} ${styles[item.priority]}`}>
                {item.priority === 'high' ? '紧急' : item.priority === 'medium' ? '一般' : '低'}
              </Text>
            </View>
          ))}
        </View>
        <View className={styles.addShoppingBtn} onClick={() => setShowShoppingModal(true)}>
          <Text>+ 添加待买物品</Text>
        </View>
      </View>

      {showBudgetModal && (
        <View className={styles.modalOverlay} onClick={() => setShowBudgetModal(false)}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <Text className={styles.modalTitle}>设置月度预算</Text>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>预算金额</Text>
              <Input 
                className={styles.formInput} 
                placeholder="输入预算金额" 
                type="number"
                value={newBudget}
                onInput={(e) => setNewBudget(e.detail.value)} 
              />
            </View>
            <View className={styles.modalActions}>
              <View className={`${styles.modalBtn} ${styles.secondary}`} onClick={() => setShowBudgetModal(false)}>
                <Text>取消</Text>
              </View>
              <View className={`${styles.modalBtn} ${styles.primary}`} onClick={saveBudget}>
                <Text>保存</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {showShoppingModal && (
        <View className={styles.modalOverlay} onClick={() => setShowShoppingModal(false)}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <Text className={styles.modalTitle}>添加待买物品</Text>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>物品名称</Text>
              <Input 
                className={styles.formInput} 
                placeholder="输入物品名称" 
                value={newItem.name}
                onInput={(e) => setNewItem({ ...newItem, name: e.detail.value })} 
              />
            </View>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>数量</Text>
              <Input 
                className={styles.formInput} 
                placeholder="输入数量" 
                type="number"
                value={newItem.quantity}
                onInput={(e) => setNewItem({ ...newItem, quantity: e.detail.value })} 
              />
            </View>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>优先级</Text>
              <View className={styles.shopsList}>
                {(['high', 'medium', 'low'] as const).map(priority => (
                  <View
                    key={priority}
                    className={`${styles.shopItem} ${newItem.priority === priority ? styles.active : ''}`}
                    onClick={() => setNewItem({ ...newItem, priority })}
                  >
                    <Text className={styles.shopName}>{priority === 'high' ? '紧急' : priority === 'medium' ? '一般' : '低'}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View className={styles.modalActions}>
              <View className={`${styles.modalBtn} ${styles.secondary}`} onClick={() => setShowShoppingModal(false)}>
                <Text>取消</Text>
              </View>
              <View className={`${styles.modalBtn} ${styles.primary}`} onClick={addShoppingItem}>
                <Text>添加</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}