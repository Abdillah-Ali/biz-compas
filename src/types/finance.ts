export interface Business {
  id: string;
  name: string;
  category?: string;
  color: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  business_id: string;
  amount: number;
  date: string;
  category: string;
  description?: string;
}

export interface Account {
  id: string;
  name: string;
  type: 'cash' | 'bank' | 'mobile';
  balance: number;
}

export interface MonthlySummary {
  month: string;
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  byBusiness: {
    business_id: string;
    income: number;
    expenses: number;
    profit: number;
  }[];
}
