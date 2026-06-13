export interface Consumption {
  id: string;
  type: 'food' | 'medicine' | 'snack' | 'other';
  amount: number;
  date: string;
  description: string;
  isEssential: boolean;
  shopName?: string;
  productName?: string;
  weight?: number;
}

export interface Product {
  id: string;
  name: string;
  type: 'food' | 'medicine' | 'snack';
  unitPrice: number;
  spec: string;
  weight?: number;
  brand?: string;
  shops: ShopPrice[];
  lastPurchaseDate?: string;
}

export interface ShopPrice {
  shopName: string;
  price: number;
  spec?: string;
}

export interface Budget {
  monthlyLimit: number;
  currentMonthSpent: number;
  warningThreshold: number;
}

export interface ShoppingItem {
  id: string;
  name: string;
  type: 'food' | 'medicine' | 'snack';
  quantity: number;
  priority: 'high' | 'medium' | 'low';
  isChecked: boolean;
}

export interface MemberInfo {
  name: string;
  balance: number;
  totalSpent: number;
  memberLevel: string;
}

export interface AnalysisResult {
  foodCostPerKg: number;
  medicinePercentage: number;
  stockCycle: number;
  priceIncreaseAlert: Product[];
  monthlyTrend: MonthlyData[];
}

export interface MonthlyData {
  month: string;
  amount: number;
}

export type CategoryType = 'food' | 'medicine' | 'snack' | 'other';

export const categoryLabels: Record<CategoryType, string> = {
  food: '猫粮',
  medicine: '药品',
  snack: '零食',
  other: '其他'
};

export const categoryColors: Record<CategoryType, string> = {
  food: '#FF8C42',
  medicine: '#F56C6C',
  snack: '#E6A23C',
  other: '#909399'
};
