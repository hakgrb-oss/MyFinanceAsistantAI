import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Expense, BankAccount, AIAgentContext } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export class ExpenseAgent {
  private model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  async analyzeExpenses(
    expenses: Expense[],
    debts: BankAccount[],
    context: AIAgentContext
  ): Promise<string> {
    const expenseAnalysis = `
Gider Analizi:
${expenses.map((e) => `- ${e.category}: ₺${e.amount}`).join('\n')}

Borç Analizi:
${debts
  .map(
    (d) => `- ${d.bankName} (${d.accountType}): ₺${d.currentDebt || 0} - Min. Ödeme: ₺${d.minimumPayment || 0}`
  )
  .join('\n')}

Toplam Aylık Gider: ₺${context.financialSummary.totalExpenses}
Toplam Borç: ₺${context.financialSummary.totalDebt}

Analiz et:
1. Gider kategorisi analizi
2. Kesilebilecek giderler
3. Borç ödeme stratejisi
4. Faiz tasarrufu fırsatları
    `;

    try {
      const response = await this.model.generateContent(expenseAnalysis);
      return (
        response.response.candidates?.[0]?.content?.parts?.[0]?.type === 'text'
          ? response.response.candidates[0].content.parts[0].text
          : ''
      );
    } catch (error) {
      console.error('Expense Agent Error:', error);
      throw error;
    }
  }

  async optimizeDebtPayment(debts: BankAccount[]): Promise<string> {
    const debtPrompt = `
Borç Yönetimi Önerileri:
${debts
  .map(
    (d) => `
- Banka: ${d.bankName}
- Tür: ${d.accountType}
- Güncel Borç: ₺${d.currentDebt}
- Faiz Oranı: %${d.interestRate || 0}
- Asgeri Ödeme: ₺${d.minimumPayment}
- Vade Tarihi: ${d.dueDate}
  `
  )
  .join('\n')}

Öneriler:
1. Hangi borçu önce öde (Snowball vs Avalanche)
2. Faiz tasarrufu analizi
3. Refinansman fırsatları
4. Kredi kartı optimizasyonu
    `;

    try {
      const response = await this.model.generateContent(debtPrompt);
      return (
        response.response.candidates?.[0]?.content?.parts?.[0]?.type === 'text'
          ? response.response.candidates[0].content.parts[0].text
          : ''
      );
    } catch (error) {
      console.error('Debt Optimization Error:', error);
      throw error;
    }
  }
}
