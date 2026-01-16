import { useState, useMemo, useEffect } from 'react';
import { Transaction, Business } from '@/types/finance';
import { api } from '@/lib/api';

export function useFinanceData() {
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | 'all'>('all');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [businessesData, transactionsData] = await Promise.all([
          api.get('/finance/businesses'),
          api.get('/finance/transactions'),
        ]);
        setBusinesses(businessesData.map((b: any) => ({ ...b, color: b.color || '#3b82f6' })));
        setTransactions(transactionsData);
      } catch (error) {
        console.error('Error fetching finance data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredTransactions = useMemo(() => {
    if (selectedBusinessId === 'all') return transactions;
    return transactions.filter(t => t.business_id === selectedBusinessId);
  }, [transactions, selectedBusinessId]);

  const metrics = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      totalIncome: income,
      totalExpenses: expenses,
      netProfit: income - expenses,
      transactionCount: filteredTransactions.length,
    };
  }, [filteredTransactions]);

  const businessMetrics = useMemo(() => {
    return businesses.map(business => {
      const businessTransactions = transactions.filter(t => t.business_id === business.id);
      const income = businessTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
      const expenses = businessTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);
      return {
        ...business,
        income,
        expenses,
        profit: income - expenses,
      };
    });
  }, [transactions, businesses]);

  const expensesByCategory = useMemo(() => {
    const categoryMap: Record<string, number> = {};
    filteredTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryMap[t.category] = (categoryMap[t.category] || 0) + Number(t.amount);
      });
    return Object.entries(categoryMap)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [filteredTransactions]);

  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const dayTransactions = filteredTransactions.filter(t => t.date.startsWith(date));
      const income = dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
      const expenses = dayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);
      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        income,
        expenses,
      };
    });
  }, [filteredTransactions]);

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const newTransaction = await api.post('/finance/transactions', transaction);
      setTransactions(prev => [newTransaction, ...prev]);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const addBusiness = async (business: Omit<Business, 'id'>) => {
    try {
      const newBusiness = await api.post('/finance/businesses', business);
      setBusinesses(prev => [...prev, newBusiness]);
    } catch (error) {
      console.error('Error adding business:', error);
    }
  };

  return {
    businesses,
    accounts: [],
    transactions: filteredTransactions,
    metrics,
    businessMetrics,
    expensesByCategory,
    chartData,
    selectedBusinessId,
    setSelectedBusinessId,
    addTransaction,
    addBusiness,
    isLoading,
  };
}
