import type { Consumption, Product, Budget, ShoppingItem, MemberInfo, AnalysisResult } from '@/types';

export const mockConsumptions: Consumption[] = [
  { id: '1', type: 'food', amount: 158, date: '2024-01-15', description: '皇家猫粮 2kg', isEssential: true, shopName: '宠物乐园', productName: '皇家幼猫粮', weight: 2 },
  { id: '2', type: 'medicine', amount: 89, date: '2024-01-14', description: '驱虫药', isEssential: true, shopName: '宠物医院', productName: '拜耳驱虫' },
  { id: '3', type: 'snack', amount: 35, date: '2024-01-12', description: '猫条12支装', isEssential: false, shopName: '宠物店', productName: '猫条' },
  { id: '4', type: 'food', amount: 268, date: '2024-01-10', description: '渴望猫粮 5kg', isEssential: true, shopName: '天猫超市', productName: '渴望鸡肉', weight: 5 },
  { id: '5', type: 'medicine', amount: 156, date: '2024-01-08', description: '疫苗接种', isEssential: true, shopName: '宠物医院', productName: '猫三联' },
  { id: '6', type: 'other', amount: 200, date: '2024-01-05', description: '美容洗澡', isEssential: false, shopName: '宠物美容店' },
  { id: '7', type: 'snack', amount: 68, date: '2024-01-03', description: '冻干零食', isEssential: false, shopName: '宠物店', productName: '冻干鸡胸肉' },
  { id: '8', type: 'food', amount: 189, date: '2023-12-28', description: '爱肯拿猫粮 4kg', isEssential: true, shopName: '京东', productName: '爱肯拿海洋盛宴', weight: 4 }
];

export const mockProducts: Product[] = [
  { id: '1', name: '皇家幼猫粮', type: 'food', unitPrice: 158, spec: '2kg', weight: 2, brand: '皇家', shops: [{ shopName: '宠物乐园', price: 158 }, { shopName: '天猫超市', price: 149 }, { shopName: '京东', price: 155 }], lastPurchaseDate: '2024-01-15' },
  { id: '2', name: '渴望鸡肉', type: 'food', unitPrice: 268, spec: '5kg', weight: 5, brand: '渴望', shops: [{ shopName: '天猫超市', price: 268 }, { shopName: '京东', price: 279 }, { shopName: '宠物店', price: 299 }], lastPurchaseDate: '2024-01-10' },
  { id: '3', name: '爱肯拿海洋盛宴', type: 'food', unitPrice: 189, spec: '4kg', weight: 4, brand: '爱肯拿', shops: [{ shopName: '京东', price: 189 }, { shopName: '天猫超市', price: 199 }], lastPurchaseDate: '2023-12-28' },
  { id: '4', name: '拜耳驱虫', type: 'medicine', unitPrice: 89, spec: '1片', brand: '拜耳', shops: [{ shopName: '宠物医院', price: 89 }, { shopName: '天猫药店', price: 69 }], lastPurchaseDate: '2024-01-14' },
  { id: '5', name: '猫三联疫苗', type: 'medicine', unitPrice: 156, spec: '1针', brand: '辉瑞', shops: [{ shopName: '宠物医院', price: 156 }], lastPurchaseDate: '2024-01-08' },
  { id: '6', name: '猫条', type: 'snack', unitPrice: 35, spec: '12支', brand: '希宝', shops: [{ shopName: '宠物店', price: 35 }, { shopName: '天猫超市', price: 32 }], lastPurchaseDate: '2024-01-12' },
  { id: '7', name: '冻干鸡胸肉', type: 'snack', unitPrice: 68, spec: '100g', brand: '麦富迪', shops: [{ shopName: '宠物店', price: 68 }, { shopName: '京东', price: 65 }], lastPurchaseDate: '2024-01-03' }
];

export const mockBudget: Budget = {
  monthlyLimit: 800,
  currentMonthSpent: 795,
  warningThreshold: 80
};

export const mockShoppingList: ShoppingItem[] = [
  { id: '1', name: '猫粮', type: 'food', quantity: 1, priority: 'high', isChecked: false },
  { id: '2', name: '驱虫药', type: 'medicine', quantity: 2, priority: 'high', isChecked: false },
  { id: '3', name: '猫条', type: 'snack', quantity: 2, priority: 'medium', isChecked: false },
  { id: '4', name: '猫砂', type: 'other', quantity: 1, priority: 'medium', isChecked: true },
  { id: '5', name: '玩具', type: 'other', quantity: 1, priority: 'low', isChecked: false }
];

export const mockMemberInfo: MemberInfo = {
  name: '喵星人铲屎官',
  balance: 1256,
  totalSpent: 8920,
  memberLevel: '黄金会员'
};

export const mockAnalysis: AnalysisResult = {
  foodCostPerKg: 52.8,
  medicinePercentage: 23.5,
  stockCycle: 28,
  priceIncreaseAlert: [mockProducts[0], mockProducts[3]],
  monthlyTrend: [
    { month: '2023-08', amount: 580 },
    { month: '2023-09', amount: 720 },
    { month: '2023-10', amount: 650 },
    { month: '2023-11', amount: 890 },
    { month: '2023-12', amount: 780 },
    { month: '2024-01', amount: 795 }
  ]
};

export const categoryStats = [
  { type: 'food' as const, label: '猫粮', value: 615, percentage: 45 },
  { type: 'medicine' as const, label: '药品', value: 245, percentage: 18 },
  { type: 'snack' as const, label: '零食', value: 103, percentage: 8 },
  { type: 'other' as const, label: '其他', value: 200, percentage: 29 }
];
