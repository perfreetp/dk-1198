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

class DataStore {
  private static instance: DataStore;
  
  private _consumptions: Consumption[];
  private _products: Product[];
  private _budget: Budget;
  private _shoppingList: ShoppingItem[];
  private _memberInfo: MemberInfo;
  private _listeners: Set<() => void> = new Set();
  
  private constructor() {
    this._consumptions = loadFromStorage<Consumption[]>(STORAGE_KEYS.CONSUMPTIONS, mockConsumptions);
    this._products = loadFromStorage<Product[]>(STORAGE_KEYS.PRODUCTS, mockProducts);
    this._budget = loadFromStorage<Budget>(STORAGE_KEYS.BUDGET, mockBudget);
    this._shoppingList = loadFromStorage<ShoppingItem[]>(STORAGE_KEYS.SHOPPING_LIST, mockShoppingList);
    this._memberInfo = { ...mockMemberInfo };
  }
  
  static getInstance(): DataStore {
    if (!DataStore.instance) {
      DataStore.instance = new DataStore();
    }
    return DataStore.instance;
  }
  
  private notify() {
    this._listeners.forEach(listener => listener());
  }
  
  subscribe(listener: () => void) {
    this._listeners.add(listener);
    return () => {
      this._listeners.delete(listener);
    };
  }
  
  get consumptions() {
    return this._consumptions;
  }
  
  get products() {
    return this._products;
  }
  
  get budget() {
    return this._budget;
  }
  
  get shoppingList() {
    return this._shoppingList;
  }
  
  get memberInfo() {
    return this._memberInfo;
  }
  
  addConsumption(consumption: Omit<Consumption, 'id'>) {
    const newConsumption: Consumption = {
      ...consumption,
      id: Date.now().toString(),
      date: consumption.date || new Date().toISOString().split('T')[0]
    };
    this._consumptions = [newConsumption, ...this._consumptions];
    saveToStorage(STORAGE_KEYS.CONSUMPTIONS, this._consumptions);
    this._budget.currentMonthSpent += consumption.amount;
    this._budget = { ...this._budget };
    saveToStorage(STORAGE_KEYS.BUDGET, this._budget);
    this.notify();
    return newConsumption;
  }
  
  addProduct(product: Omit<Product, 'id' | 'shops' | 'lastPurchaseDate'>) {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      unitPrice: typeof product.unitPrice === 'string' ? parseFloat(product.unitPrice) : product.unitPrice,
      shops: [{ shopName: '默认店铺', price: typeof product.unitPrice === 'string' ? parseFloat(product.unitPrice) : product.unitPrice }],
      lastPurchaseDate: new Date().toISOString().split('T')[0]
    };
    this._products = [...this._products, newProduct];
    saveToStorage(STORAGE_KEYS.PRODUCTS, this._products);
    this.notify();
    return newProduct;
  }
  
  updateBudget(monthlyLimit: number) {
    this._budget = { ...this._budget, monthlyLimit };
    saveToStorage(STORAGE_KEYS.BUDGET, this._budget);
    this.notify();
  }
  
  addSpent(amount: number) {
    this._budget = { ...this._budget, currentMonthSpent: this._budget.currentMonthSpent + amount };
    saveToStorage(STORAGE_KEYS.BUDGET, this._budget);
    this.notify();
  }
  
  toggleShoppingItem(id: string) {
    this._shoppingList = this._shoppingList.map(item => 
      item.id === id ? { ...item, isChecked: !item.isChecked } : item
    );
    saveToStorage(STORAGE_KEYS.SHOPPING_LIST, this._shoppingList);
    this.notify();
  }
  
  addShoppingItem(item: Omit<ShoppingItem, 'id' | 'isChecked'>) {
    const newItem: ShoppingItem = {
      ...item,
      id: Date.now().toString(),
      isChecked: false
    };
    this._shoppingList = [...this._shoppingList, newItem];
    saveToStorage(STORAGE_KEYS.SHOPPING_LIST, this._shoppingList);
    this.notify();
    return newItem;
  }
  
  getCategoryStats() {
    const stats: Record<string, number> = { food: 0, medicine: 0, snack: 0, other: 0 };
    const total = this._consumptions.reduce((sum, item) => {
      stats[item.type] += item.amount;
      return sum + item.amount;
    }, 0);
    
    return [
      { type: 'food' as const, label: '猫粮', value: stats.food, percentage: total > 0 ? Math.round((stats.food / total) * 100) : 0 },
      { type: 'medicine' as const, label: '药品', value: stats.medicine, percentage: total > 0 ? Math.round((stats.medicine / total) * 100) : 0 },
      { type: 'snack' as const, label: '零食', value: stats.snack, percentage: total > 0 ? Math.round((stats.snack / total) * 100) : 0 },
      { type: 'other' as const, label: '其他', value: stats.other, percentage: total > 0 ? Math.round((stats.other / total) * 100) : 0 }
    ];
  }
  
  getAnalysisData(): AnalysisResult {
    const foodConsumptions = this._consumptions.filter(c => c.type === 'food');
    const totalWeight = foodConsumptions.reduce((sum, c) => sum + (c.weight || 0), 0);
    const totalFoodCost = foodConsumptions.reduce((sum, c) => sum + c.amount, 0);
    const foodCostPerKg = totalWeight > 0 ? (totalFoodCost / totalWeight).toFixed(1) : '0';
    
    const totalConsumption = this._consumptions.reduce((sum, c) => sum + c.amount, 0);
    const medicineCost = this._consumptions.filter(c => c.type === 'medicine').reduce((sum, c) => sum + c.amount, 0);
    const medicinePercentage = totalConsumption > 0 ? ((medicineCost / totalConsumption) * 100).toFixed(1) : '0';
    
    const monthlyTrend: MonthlyData[] = [];
    const monthMap = new Map<string, number>();
    
    this._consumptions.forEach(c => {
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
  }
  
  generateQuarterlyReport() {
    const now = new Date();
    const quarter = Math.ceil((now.getMonth() + 1) / 3);
    const year = now.getFullYear();
    
    const quarterStart = new Date(year, (quarter - 1) * 3, 1);
    const quarterEnd = new Date(year, quarter * 3, 0);
    
    const quarterConsumptions = this._consumptions.filter(c => {
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
        { month: `${year}-${String((quarter - 1) * 3 + 1).padStart(2, '0')}`, amount: quarterConsumptions.filter(c => c.date.startsWith(`${year}-${String((quarter - 1) * 3 + 1).padStart(2, '0')}`)).reduce((sum, c) => sum + c.amount, 0) },
        { month: `${year}-${String((quarter - 1) * 3 + 2).padStart(2, '0')}`, amount: quarterConsumptions.filter(c => c.date.startsWith(`${year}-${String((quarter - 1) * 3 + 2).padStart(2, '0')}`)).reduce((sum, c) => sum + c.amount, 0) },
        { month: `${year}-${String((quarter - 1) * 3 + 3).padStart(2, '0')}`, amount: quarterConsumptions.filter(c => c.date.startsWith(`${year}-${String((quarter - 1) * 3 + 3).padStart(2, '0')}`)).reduce((sum, c) => sum + c.amount, 0) }
      ]
    };
  }
  
  generateCostCard() {
    const totalSpent = this._consumptions.reduce((sum, c) => sum + c.amount, 0);
    const foodSpent = this._consumptions.filter(c => c.type === 'food').reduce((sum, c) => sum + c.amount, 0);
    const medicineSpent = this._consumptions.filter(c => c.type === 'medicine').reduce((sum, c) => sum + c.amount, 0);
    const snackSpent = this._consumptions.filter(c => c.type === 'snack').reduce((sum, c) => sum + c.amount, 0);
    const otherSpent = this._consumptions.filter(c => c.type === 'other').reduce((sum, c) => sum + c.amount, 0);
    
    const monthCount = new Set(this._consumptions.map(c => c.date.slice(0, 7))).size;
    
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
      recordCount: this._consumptions.length,
      averageMonthly: monthCount > 0 ? Math.round(totalSpent / monthCount) : 0,
      categoryRanking
    };
  }
}

export const store = DataStore.getInstance();

export function useStore() {
  const [, setUpdateKey] = require('react').useState(0);
  
  require('react').useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setUpdateKey(prev => prev + 1);
    });
    return unsubscribe;
  }, []);
  
  return store;
}