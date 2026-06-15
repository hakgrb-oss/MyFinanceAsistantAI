import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Investment, PortfolioSummary, AIAgentContext } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export class InvestmentAgent {
  private model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  async analyzePortfolio(
    investments: Investment[],
    portfolio: PortfolioSummary,
    context: AIAgentContext
  ): Promise<string> {
    const portfolioAnalysis = `
Portföy Analizi:
Toplam Değer: ₺${portfolio.totalValue}
Yatırılan Miktar: ₺${portfolio.totalInvested}
Kâr/Zarar: ₺${portfolio.totalProfit} (%${portfolio.profitPercentage})

Varlıklar:
${investments
  .map(
    (inv) => `
- ${inv.assetType.toUpperCase()}: ${inv.symbol}
  Alış: ₺${inv.purchasePrice}
  Güncel: ₺${inv.currentPrice}
  Miktar: ${inv.quantity}
  Toplam Değer: ₺${inv.totalValue}
  Kâr/Zarar: ₺${inv.totalValue - inv.purchasePrice * inv.quantity}
  `
  )
  .join('\n')}

Risk Profili: Orta
Zaman Ufku: ${context.userProfile.createdAt.toLocaleDateString()}

Analiz et:
1. Portfolio dengesini değerlendir
2. Risk dağılımını kontrol et
3. Diversifikasyon önerileri
4. Rebalancing stratejisi
5. Vergi optimizasyonu fırsatları
    `;

    try {
      const response = await this.model.generateContent(portfolioAnalysis);
      return (
        response.response.candidates?.[0]?.content?.parts?.[0]?.type === 'text'
          ? response.response.candidates[0].content.parts[0].text
          : ''
      );
    } catch (error) {
      console.error('Investment Agent Error:', error);
      throw error;
    }
  }

  async suggestInvestments(
    availableFunds: number,
    riskProfile: string = 'moderate'
  ): Promise<string> {
    const investmentPrompt = `
Mevcut Yatırım Yapılacak Miktar: ₺${availableFunds}
Risk Profili: ${riskProfile}

Türkiye'de yatırım seçenekleri:
- Hisse Senedi (Borsa İstanbul - BIST)
- Gayrimenkul Yatırım Ortaklığı (GYO)
- Devlet Tahvili / Kamu Borç Yönetimi (DÖF)
- Altın (Spot Altın)
- Döviz (USD, EUR)
- Yatırım Fonları
- Kripto Para (Opsiyonel)

Öneriler:
1. Her kategoriye ne kadar ayırmalı
2. Hangi hisseleri al
3. Hangi GYO'ları seç
4. Tahvil stratejisi
5. Altın / Döviz yüzdesi
    `;

    try {
      const response = await this.model.generateContent(investmentPrompt);
      return (
        response.response.candidates?.[0]?.content?.parts?.[0]?.type === 'text'
          ? response.response.candidates[0].content.parts[0].text
          : ''
      );
    } catch (error) {
      console.error('Investment Suggestion Error:', error);
      throw error;
    }
  }

  async rebalancePortfolio(
    currentPortfolio: Investment[],
    targetAllocation: { [key: string]: number }
  ): Promise<string> {
    const rebalancePrompt = `
Portföy Yeniden Dengeleme:

Mevcut Portföy:
${currentPortfolio
  .map((inv) => `- ${inv.assetType}: %${(inv.totalValue / currentPortfolio.reduce((sum, i) => sum + i.totalValue, 0)) * 100}`)}

Hedef Dağılım:
${Object.entries(targetAllocation)
  .map(([asset, percentage]) => `- ${asset}: %${percentage}`)
  .join('\n')}

Al/Sat önerileri:
1. Hangi varlıkları sat
2. Hangi varlıkları al
3. Vergi etkisi analizi
4. İşlem maliyetleri
    `;

    try {
      const response = await this.model.generateContent(rebalancePrompt);
      return (
        response.response.candidates?.[0]?.content?.parts?.[0]?.type === 'text'
          ? response.response.candidates[0].content.parts[0].text
          : ''
      );
    } catch (error) {
      console.error('Portfolio Rebalance Error:', error);
      throw error;
    }
  }
}
