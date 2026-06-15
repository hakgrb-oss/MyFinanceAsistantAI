import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Income, AIAgentContext } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export class IncomeAgent {
  private model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  async optimizeIncome(
    incomes: Income[],
    context: AIAgentContext
  ): Promise<string> {
    const incomeAnalysis = `
Gelirlerin Analizi:
${incomes.map((i) => `- ${i.sourceType}: ₺${i.amount} (${i.isRecurring ? 'Tekrarlayan' : 'Tek seferlik'})`).join('\n')}

Toplam Gelir: ₺${context.financialSummary.totalIncome}

Su konuları analiz et:
1. Gelir çeşitlendirmesi
2. Passive income fırsatları
3. Gelir artırma stratejileri
4. Vergi optimizasyonu
    `;

    try {
      const response = await this.model.generateContent(incomeAnalysis);
      return (
        response.response.candidates?.[0]?.content?.parts?.[0]?.type === 'text'
          ? response.response.candidates[0].content.parts[0].text
          : ''
      );
    } catch (error) {
      console.error('Income Agent Error:', error);
      throw error;
    }
  }

  async suggestIncomeGoals(currentIncome: number): Promise<string> {
    const prompt = `
Mevcut Aylık Gelir: ₺${currentIncome}

6 ay, 1 yıl ve 3 yıl sonrası için gelir artırma hedefleri öner.
Türkiye ekonomisi ve enflasyon oranını dikkate al.
    `;

    try {
      const response = await this.model.generateContent(prompt);
      return (
        response.response.candidates?.[0]?.content?.parts?.[0]?.type === 'text'
          ? response.response.candidates[0].content.parts[0].text
          : ''
      );
    } catch (error) {
      console.error('Income Goals Error:', error);
      throw error;
    }
  }
}
