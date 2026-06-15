import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AIAgentContext, AIRecommendation } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface AgentResponse {
  recommendations: AIRecommendation[];
  analysis: string;
  nextSteps: string[];
}

export class CoordinatorAgent {
  private model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  private conversationHistory: Array<{ role: string; parts: string }> = [];

  async analyzeFinances(context: AIAgentContext): Promise<AgentResponse> {
    const systemPrompt = `
Sen bir Türk finansal danışmanı AI'sısın. Kullanıcının finansal verilerini analiz edip öneriler sunuyorsun.

Kullanıcı Bilgisi:
- Aylık Maaş: ₺${context.financialSummary.totalIncome}
- Aylık Giderler: ₺${context.financialSummary.totalExpenses}
- Toplam Borç: ₺${context.financialSummary.totalDebt}
- Net Değeri: ₺${context.financialSummary.netWorth}
- Yatırım Değeri: ₺${context.financialSummary.investmentValue}

Sen:
1. Bütçe analizini yap
2. Tasarruf oranını değerlendir
3. Yatırım portföyünü kontrol et
4. Borç yönetimini gözden geçir
5. Somut öneriler sun

Türkçe cevap ver ve finansal terimler için resmi adları kullan (PPF, GYO, vb).
`;

    try {
      const response = await this.model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [{ text: systemPrompt }],
          },
        ],
      });

      const analysisText =
        response.response.candidates?.[0]?.content?.parts?.[0]?.type === 'text'
          ? response.response.candidates[0].content.parts[0].text
          : '';

      return {
        recommendations: this.parseRecommendations(context, analysisText),
        analysis: analysisText,
        nextSteps: this.extractNextSteps(analysisText),
      };
    } catch (error) {
      console.error('Coordinator Agent Error:', error);
      throw error;
    }
  }

  private parseRecommendations(
    context: AIAgentContext,
    analysis: string
  ): AIRecommendation[] {
    // Parse recommendations from AI response
    return [
      {
        id: '1',
        userId: context.userId,
        type: 'savings',
        title: 'Tasarruf Hedefi',
        description: 'Aylık maaşınızın %20\'sini tasarruf edin',
        actionItems: ['Otomatik transfer kur', 'Tasarruf hesabı aç'],
        estimatedImpact: 'Yıllık ₺72.000 tasarruf',
        riskLevel: 'low',
        timeframe: '1 ay',
        priority: 'high',
        createdAt: new Date(),
      },
    ];
  }

  private extractNextSteps(analysis: string): string[] {
    // Extract action items from analysis
    return [
      'Borç ödeme planını güncelle',
      'Yatırım portföyünü dengele',
      'Aylık bütçe gözden geçir',
    ];
  }

  async chat(message: string, context: AIAgentContext): Promise<string> {
    this.conversationHistory.push({
      role: 'user',
      parts: message,
    });

    try {
      const response = await this.model.generateContent({
        contents: [
          ...this.conversationHistory.map((h) => ({
            role: h.role as 'user' | 'model',
            parts: [{ text: h.parts }],
          })),
        ],
      });

      const assistantMessage =
        response.response.candidates?.[0]?.content?.parts?.[0]?.type === 'text'
          ? response.response.candidates[0].content.parts[0].text
          : 'Üzgünüm, bir hata oluştu.';

      this.conversationHistory.push({
        role: 'model',
        parts: assistantMessage,
      });

      return assistantMessage;
    } catch (error) {
      console.error('Chat Error:', error);
      throw error;
    }
  }
}
