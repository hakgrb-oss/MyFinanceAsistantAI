import { NextRequest, NextResponse } from 'next/server';
import { CoordinatorAgent } from '@/lib/gemini/coordinator-agent';
import { IncomeAgent } from '@/lib/gemini/income-agent';
import { ExpenseAgent } from '@/lib/gemini/expense-agent';
import { InvestmentAgent } from '@/lib/gemini/investment-agent';
import { MarketAgent } from '@/lib/gemini/market-agent';
import { FirestoreService } from '@/lib/db/firestore-service';
import { MarketService } from '@/lib/market-data/market-service';
import type { AIAgentContext } from '@/types';

const coordinator = new CoordinatorAgent();
const incomeAgent = new IncomeAgent();
const expenseAgent = new ExpenseAgent();
const investmentAgent = new InvestmentAgent();
const marketAgent = new MarketAgent();
const db = new FirestoreService();
const marketService = new MarketService();

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    const { query, action } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'Kullanıcı ID gereklidir' },
        { status: 401 }
      );
    }

    // Kullanıcı verilerini topla
    const user = await db.getUser(userId);
    const incomes = await db.getUserIncomes(userId);
    const expenses = await db.getUserExpenses(userId);
    const bankAccounts = await db.getUserBankAccounts(userId);
    const investments = await db.getUserInvestments(userId);

    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    // Piyasa verilerini al
    const goldPrices = await marketService.getGoldPrices();
    const exchangeRates = await marketService.getTCMBExchangeRates();
    const marketData = [...goldPrices, ...exchangeRates];

    // Finansal özet oluştur
    const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalDebt = bankAccounts.reduce((sum, b) => sum + (b.currentDebt || 0), 0);
    const investmentValue = investments.reduce((sum, i) => sum + i.totalValue, 0);
    const cashAvailable = bankAccounts.reduce((sum, b) => sum + b.balance, 0);

    const context: AIAgentContext = {
      userId,
      userProfile: user,
      financialSummary: {
        totalIncome,
        totalExpenses,
        totalDebt,
        netWorth: totalIncome - totalExpenses - totalDebt + investmentValue,
        savingsRate: totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0,
        investmentValue,
        cashAvailable,
      },
      recentIncomes: incomes.slice(-5),
      recentExpenses: expenses.slice(-5),
      bankAccounts,
      investments,
      portfolio: {
        totalValue: investmentValue,
        totalInvested: investments.reduce((sum, i) => sum + i.purchasePrice * i.quantity, 0),
        totalProfit: investmentValue - investments.reduce((sum, i) => sum + i.purchasePrice * i.quantity, 0),
        profitPercentage:
          investments.length > 0
            ? ((investmentValue - investments.reduce((sum, i) => sum + i.purchasePrice * i.quantity, 0)) /
                investments.reduce((sum, i) => sum + i.purchasePrice * i.quantity, 0)) *
              100
            : 0,
        byAssetType: {},
      },
      marketData,
    };

    let response: any;

    // Aksiyon türüne göre işle
    if (action === 'analyze') {
      response = await coordinator.analyzeFinances(context);
    } else if (action === 'income-advice') {
      response = await incomeAgent.optimizeIncome(incomes, context);
    } else if (action === 'expense-advice') {
      response = await expenseAgent.analyzeExpenses(expenses, bankAccounts, context);
    } else if (action === 'investment-advice') {
      response = await investmentAgent.analyzePortfolio(investments, context.portfolio, context);
    } else if (action === 'market-trends') {
      response = await marketAgent.analyzeMarketTrends(marketData);
    } else if (action === 'chat') {
      response = await coordinator.chat(query, context);
    } else {
      response = await coordinator.chat(query, context);
    }

    return NextResponse.json({ response, context }, { status: 200 });
  } catch (error: any) {
    console.error('AI Advisor Error:', error);
    return NextResponse.json(
      { error: error.message || 'Hata oluştu' },
      { status: 500 }
    );
  }
}
