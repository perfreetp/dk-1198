import { useState, useEffect, useCallback } from 'react';
import Taro from '@tarojs/taro';
import type { Consumption, Product, Budget, ShoppingItem, MemberInfo, AnalysisResult, MonthlyData } from '@/types';
import { mockConsumptions, mockProducts, mockBudget, mockShoppingList, mockMemberInfo } from '@/data/mockData';

const STORAGE_KEYS = {
  CONSUMPTIONS: 'pet_consumptions',
  PRODUCTS: 'pet_products',
  BUDGET: 'pet_budget',
  SHOPPING_LIST: 'pet_shopping_list'
};

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const data = Taro.getStorageSync(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage(key: string, value: unknown) {
  try {
    Taro.setStorageSync(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage save error:', e);
  }
}

export function useConsumptions() {
  const [consumptions, setConsumptions] = useState<Consumption[]>(() => 
    loadFromStorage<Consumption[]>(STORAGE_KEYS.CONSUMPTIONS, mockConsumptions)
  );

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CONSUMPTIONS, consumptions);
  }, [consumptions]);

  const addConsumption = useCallback((consumption: Omit<Consumption, 'id'>) => {
    const newConsumption: Consumption = {
      ...consumption,
      id: Date.now().toString(),
      date: consumption.date || new Date().toISOString().split('T')[0]
    };
    setConsumptions(prev => [newConsumption, ...prev]);
    return newConsumption;
  }, []);

  return { consumptions, addConsumption, setConsumptions };
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(() => 
    loadFromStorage<Product[]>(STORAGE_KEYS.PRODUCTS, mockProducts)
  );

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PRODUCTS, products);
  }, [products]);

  const addProduct = useCallback((product: Omit<Product, 'id' | 'shops' | 'lastPurchaseDate'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      unitPrice: parseFloat(product.unitPrice.toString()) || 0,
      shops: [{ shopName: '默认店铺', price: parseFloat(product.unitPrice.toString()) || 0 }],
      lastPurchaseDate: new Date().toISOString().split('T')[0]
    };
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  }, []);

  return { products, addProduct, setProducts };
}

export function useBudget() {
  const [budget, setBudget] = useState<Budget>(() => 
    loadFromStorage<Budget>(STORAGE_KEYS.BUDGET, mockBudget)
  );

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.BUDGET, budget);
  }, [budget]);

  const updateBudget = useCallback((monthlyLimit: number) => {
    setBudget(prev => ({ ...prev, monthlyLimit }));
  }, []);

  const addSpent = useCallback((amount: number) => {
    setBudget(prev => ({ ...prev, currentMonthSpent: prev.currentMonthSpent + amount }));
  }, []);

  return { budget, updateBudget, addSpent, setBudget };
}

export function useShoppingList() {
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>(() => 
    loadFromStorage<ShoppingItem[]>(STORAGE_KEYS.SHOPPING_LIST, mockShoppingList)
  );

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SHOPPING_LIST, shoppingList);
  }, [shoppingList]);

  const toggleItem = useCallback((id: string) => {
    setShoppingList(prev => prev.map(item => 
      item.id === id ? { ...item, isChecked: !item.isChecked } : item
    ));
  }, []);

  const addItem = useCallback((item: Omit<ShoppingItem, 'id' | 'isChecked'>) => {
    const newItem: ShoppingItem = {
      ...item,
      id: Date.now().toString(),
      isChecked: false
    };
    setShoppingList(prev => [...prev, newItem]);
    return newItem;
  }, []);

  return { shoppingList, toggleItem, addItem, setShoppingList };
}

export const useMemberInfo = () => {
  return useState<MemberInfo>(mockMemberInfo);
};

export function useAnalysis(consumptions: Consumption[]) {
  const getCategoryStats = useCallback(() => {
    const stats: Record<string, number> = { food: 0, medicine: 0, snack: 0, other: 0 };
    const total = consumptions.reduce((sum, item) => {
      stats[item.type] += item.amount;
      return sum + item.amount;
    }, 0);
    
    return [
      { type: 'food' as const, label: '猫粮', value: stats.food, percentage: total > 0 ? Math.round((stats.food / total) * 100) : 0 },
      { type: 'medicine' as const, label: '药品', value: stats.medicine, percentage: total > 0 ? Math.round((stats.medicine / total) * 100) : 0 },
      { type: 'snack' as const, label: '零食', value: stats.snack, percentage: total > 0 ? Math.round((stats.snack / total) * 100) : 0 },
      { type: 'other' as const, label: '其他', value: stats.other, percentage: total > 0 ? Math.round((stats.other / total) * 100) : 0 }
    ];
  }, [consumptions]);

  const getAnalysisData = useCallback((): AnalysisResult => {
    const foodConsumptions = consumptions.filter(c => c.type === 'food');
    const totalWeight = foodConsumptions.reduce((sum, c) => sum + (c.weight || 0), 0);
    const totalFoodCost = foodConsumptions.reduce((sum, c) => sum + c.amount, 0);
    const foodCostPerKg = totalWeight > 0 ? (totalFoodCost / totalWeight).toFixed(1) : '0';
    
    const totalConsumption = consumptions.reduce((sum, c) => sum + c.amount, 0);
    const medicineCost = consumptions.filter(c => c.type === 'medicine').reduce((sum, c) => sum + c.amount, 0);
    const medicinePercentage = totalConsumption > 0 ? ((medicineCost / totalConsumption) * 100).toFixed(1) : '0';
    
    const monthlyTrend: MonthlyData[] = [];
    const monthMap = new Map<string, number>();
    
    consumptions.forEach(c => {
      const month = c.date.slice(0, 7);
      monthMap.set(month, (monthMap.get(month) || 0) + c.amount);
    });
    
    Array.from(monthMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-6)
      .forEach(([month, amount]) => {
        monthlyTrend.push({ month, amount });
      });
    
    return {
      foodCostPerKg: parseFloat(foodCostPerKg),
      medicinePercentage: parseFloat(medicinePercentage),
      stockCycle: 28,
      priceIncreaseAlert: [],
      monthlyTrend
    };
  }, [consumptions]);

  const generateQuarterlyReport = useCallback(() => {
    const now = new Date();
    const quarter = Math.ceil((now.getMonth() + 1) / 3);
    const year = now.getFullYear();
    
    const quarterStart = new Date(year, (quarter - 1) * 3, 1);
    const quarterEnd = new Date(year, quarter * 3, 0);
    
    const quarterConsumptions = consumptions.filter(c => {
      const date = new Date(c.date);
      return date >= quarterStart && date <= quarterEnd;
    });
    
    const totalAmount = quarterConsumptions.reduce((sum, c) => sum + c.amount, 0);
    
    const categoryStats: Record<string, number> = { food: 0, medicine: 0, snack: 0, other: 0 };
    quarterConsumptions.forEach(c => {
      categoryStats[c.type] += c.amount;
    });
    
    const categoryList = Object.entries(categoryStats)
      .map(([type, amount]) => ({ type, amount, percentage: totalAmount > 0 ? ((amount / totalAmount) * 100).toFixed(1) : '0' }))
      .sort((a, b) => b.amount - a.amount);
    
    return {
      quarter: `${year}年第${quarter}季度`,
      totalAmount,
      recordCount: quarterConsumptions.length,
      categoryList,
      monthlyBreakdown: [
        { month: `${year}-${String((quarter - 1) * 3 + 1).padStart(2, '0')}`, amount: quarterConsumptions.filter(c => c.date.startsWith(`${year}-${String((quarter - 1) * 3 + 1).padStart(2, '0')}`).reduce((sum, c) => sum + c.amount, 0) },
        { month: `${year}-${String((quarter - 1) * 3 + 2).padStart(2, '0')}`, amount: quarterConsumptions.filter(c => c.date.startsWith(`${year}-${String((quarter - 1) * 3 + 2).padStart(2, '0')}`).reduce((sum, c) => sum + c.amount, 0) },
        { month: `${year}-${String((quarter - 1) * 3 + 3).padStart(2, '0')}`, amount: quarterConsumptions.filter(c => c.date.startsWith(`${year}-${String((quarter - 1) * 3 + 3).padStart(2, '0')}`).reduce((sum, c) => sum + c.amount, 0) }
      ]
    };
  }, [consumptions]);

  const generateCostCard = useCallback(() => {
    const totalSpent = consumptions.reduce((sum, c) => sum + c.amount, 0);
    const foodSpent = consumptions.filter(c => c.type === 'food').reduce((sum, c) => sum + c.amount, 0);
    const medicineSpent = consumptions.filter(c => c.type === 'medicine').reduce((sum, c) => sum + c.amount, 0);
    const snackSpent = consumptions.filter(c => c.type === 'snack').reduce((sum, c) => sum + c.amount, 0);
    const otherSpent = consumptions.filter(c => c.type === 'other').reduce((sum, c) => sum + c.amount, 0);
    
    const monthCount = new Set(consumptions.map(c => c.date.slice(0, 7))).size;
    
    const categoryRanking = [
      { name: '猫粮', amount: foodSpent, icon: '🥣', percentage: totalSpent > 0 ? Math.round((foodSpent / totalSpent) * 100) : 0 },
      { name: '医疗', amount: medicineSpent, icon: '💊', percentage: totalSpent > 0 ? Math.round((medicineSpent / totalSpent) * 100) : 0 },
      { name: '零食', amount: snackSpent, icon: '🍪', percentage: totalSpent > 0 ? Math.round((snackSpent / totalSpent) * 100) : 0 },
      { name: '其他', amount: otherSpent, icon: '🔧', percentage: totalSpent > 0 ? Math.round((otherSpent / totalSpent) * 100) : 0 }
    ].sort((a, b) => b.amount - a.amount);
    
    return {
      totalSpent,
      foodSpent,
      medicineSpent,
      snackSpent,
      otherSpent,
      recordCount: consumptions.length,
      averageMonthly: monthCount > 0 ? Math.round(totalSpent / monthCount) : 0,
      categoryRanking
    };
  }, [consumptions]);

  return { getCategoryStats, getAnalysisData, generateQuarterlyReport, generateCostCard };
};