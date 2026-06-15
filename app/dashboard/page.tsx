'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import type { Income, Expense, Investment, BankAccount, FinancialSummary } from '@/types';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [stats, setStats] = useState({ incomes: 0, expenses: 0, investments: 0, debts: 0 });

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const token = await user?.getIdToken();
      const headers = { 'x-user-id': user?.uid };

      // Gelir, gider, yatırım verilerini çek
      const [incomeRes, expenseRes, investmentRes, bankRes] = await Promise.all([
        fetch('/api/income', { headers }),
        fetch('/api/expense', { headers }),
        fetch('/api/investment', { headers }),
        fetch('/api/bank', { headers }),
      ]);

      const incomeData = await incomeRes.json();
      const expenseData = await expenseRes.json();
      const investmentData = await investmentRes.json();
      const bankData = await bankRes.json();

      const totalIncome = incomeData.incomes?.reduce((sum: number, i: any) => sum + i.amount, 0) || 0;
      const totalExpense = expenseData.expenses?.reduce((sum: number, e: any) => sum + e.amount, 0) || 0;
      const totalInvestment = investmentData.investments?.reduce((sum: number, inv: any) => sum + inv.totalValue, 0) || 0;
      const totalDebt = bankData.bankAccounts?.reduce((sum: number, b: any) => sum + (b.currentDebt || 0), 0) || 0;

      setSummary({
        totalIncome,
        totalExpenses: totalExpense,
        totalDebt,
        netWorth: totalIncome - totalExpense - totalDebt + totalInvestment,
        savingsRate: totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0,
        investmentValue: totalInvestment,
        cashAvailable: bankData.bankAccounts?.reduce((sum: number, b: any) => sum + b.balance, 0) || 0,
      });

      setStats({
        incomes: incomeData.incomes?.length || 0,
        expenses: expenseData.expenses?.length || 0,
        investments: investmentData.investments?.length || 0,
        debts: bankData.bankAccounts?.length || 0,
      });
    } catch (error) {
      console.error('Dashboard Error:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Yükleniyor...</div>;
  }

  if (!user) {
    return <div className="flex justify-center items-center h-screen">Lütfen giriş yapın</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Hoş Geldin, {user.displayName || 'Kullanıcı'}! 👋</h1>
        <p className="text-gray-600 mt-2">Finansal durumun özeti</p>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Income */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Toplam Gelir</p>
                <p className="text-3xl font-bold text-green-600">₺{summary.totalIncome.toLocaleString('tr-TR')}</p>
              </div>
              <div className="text-4xl">📈</div>
            </div>
            <p className="text-gray-500 text-xs mt-2">({stats.incomes} kayıt)</p>
          </div>

          {/* Total Expenses */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Toplam Giderler</p>
                <p className="text-3xl font-bold text-red-600">₺{summary.totalExpenses.toLocaleString('tr-TR')}</p>
              </div>
              <div className="text-4xl">💸</div>
            </div>
            <p className="text-gray-500 text-xs mt-2">({stats.expenses} kayıt)</p>
          </div>

          {/* Net Worth */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Net Değeri</p>
                <p className="text-3xl font-bold text-blue-600">₺{summary.netWorth.toLocaleString('tr-TR')}</p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
            <p className="text-gray-500 text-xs mt-2">Toplam varlık</p>
          </div>

          {/* Savings Rate */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Tasarruf Oranı</p>
                <p className="text-3xl font-bold text-purple-600">{summary.savingsRate.toFixed(1)}%</p>
              </div>
              <div className="text-4xl">🎯</div>
            </div>
            <p className="text-gray-500 text-xs mt-2">Hedef: %20</p>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <a
          href="/gelir"
          className="bg-gradient-to-br from-green-400 to-green-600 text-white rounded-lg shadow-lg p-6 hover:shadow-xl transition transform hover:scale-105"
        >
          <div className="text-4xl mb-2">➕</div>
          <h3 className="font-bold text-lg">Gelir Ekle</h3>
          <p className="text-green-100 text-sm">Yeni gelir kaydı oluştur</p>
        </a>

        <a
          href="/giderler"
          className="bg-gradient-to-br from-red-400 to-red-600 text-white rounded-lg shadow-lg p-6 hover:shadow-xl transition transform hover:scale-105"
        >
          <div className="text-4xl mb-2">💳</div>
          <h3 className="font-bold text-lg">Gider Ekle</h3>
          <p className="text-red-100 text-sm">Gider kaydı oluştur</p>
        </a>

        <a
          href="/yatirim"
          className="bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-lg shadow-lg p-6 hover:shadow-xl transition transform hover:scale-105"
        >
          <div className="text-4xl mb-2">📊</div>
          <h3 className="font-bold text-lg">Yatırım Ekle</h3>
          <p className="text-blue-100 text-sm">Portföy ekle/güncelle</p>
        </a>

        <a
          href="/ai-danisma"
          className="bg-gradient-to-br from-purple-400 to-purple-600 text-white rounded-lg shadow-lg p-6 hover:shadow-xl transition transform hover:scale-105"
        >
          <div className="text-4xl mb-2">🤖</div>
          <h3 className="font-bold text-lg">AI Danışman</h3>
          <p className="text-purple-100 text-sm">Akıllı öneriler al</p>
        </a>
      </div>
    </div>
  );
}
