// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Income Types
export interface Income {
  id: string;
  userId: string;
  amount: number;
  sourceType: 'salary' | 'bonus' | 'freelance' | 'investment' | 'other';
  description: string;
  paymentDate: Date;
  isRecurring: boolean;
  recurringDay?: number; // Day of month (1-31)
  recurringFrequency?: 'monthly' | 'quarterly' | 'yearly';
  createdAt: Date;
  updatedAt: Date;
}

// Expense Types
export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: 'rent' | 'utilities' | 'food' | 'transport' | 'healthcare' | 'entertainment' | 'other';
  description: string;
  date: Date;
  isRecurring: boolean;
  paymentMethod: 'cash' | 'credit_card' | 'debit_card' | 'transfer';
  createdAt: Date;
  updatedAt: Date;
}

// Bank/Debt Types
export interface BankAccount {
  id: string;
  userId: string;
  bankName: string;
  accountType: 'checking' | 'savings' | 'credit_card' | 'loan';
  balance: number;
  creditLimit?: number;
  currentDebt?: number;
  minimumPayment?: number;
  dueDate?: Date;
  interestRate?: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Investment Types
export interface Investment {
  id: string;
  userId: string;
  assetType: 'stock' | 'gyo' | 'ppf' | 'gold' | 'forex' | 'fund' | 'crypto' | 'bond';
  symbol: string; // BIST code or name
  purchasePrice: number;
  quantity: number;
  purchaseDate: Date;
  currentPrice: number;
  totalValue: number;
  currency: 'TRY' | 'USD' | 'EUR' | 'GBP';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Portfolio Summary
export interface PortfolioSummary {
  totalValue: number;
  totalInvested: number;
  totalProfit: number;
  profitPercentage: number;
  byAssetType: {
    [key: string]: {
      value: number;
      percentage: number;
      items: Investment[];
    };
  };
}

// Market Data
export interface MarketData {
  symbol: string;
  name: string;
  currentPrice: number;
  currency: string;
  change: number;
  changePercent: number;
  timestamp: Date;
  source: string;
}

// Financial Summary
export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  totalDebt: number;
  netWorth: number;
  savingsRate: number;
  investmentValue: number;
  cashAvailable: number;
}

// AI Advisor Recommendation
export interface AIRecommendation {
  id: string;
  userId: string;
  type: 'savings' | 'investment' | 'debt_management' | 'budget' | 'portfolio_optimization';
  title: string;
  description: string;
  actionItems: string[];
  estimatedImpact: string;
  riskLevel: 'low' | 'medium' | 'high';
  timeframe: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: Date;
}

// AI Agent Context
export interface AIAgentContext {
  userId: string;
  userProfile: User;
  financialSummary: FinancialSummary;
  recentIncomes: Income[];
  recentExpenses: Expense[];
  bankAccounts: BankAccount[];
  investments: Investment[];
  portfolio: PortfolioSummary;
  marketData: MarketData[];
}

// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
