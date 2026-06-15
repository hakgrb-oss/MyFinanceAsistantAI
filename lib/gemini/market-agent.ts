import { GoogleGenerativeAI } from '@google/generative-ai';
import type { MarketData } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export class MarketAgent {
  private model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  async analyzeMarketTrends(marketData: MarketData[]): Promise<string> {
    const marketAnalysis = `
Piyasa Analizi:
${marketData
  .map(
    (m) => `
- ${m.name} (${m.symbol})
  Fiyat: ${m.currency} ${m.currentPrice}
  Değişim: ${m.change} (${m.changePercent}%)
  Güncelleme: ${m.timestamp}
  `
  )
  .join('\n')}

Analiz et:
1. Piyasa trendleri
2. Volatilite analizi
3. Fırsat ve riskler
4. Alım satım önerileri
5. Risk yönetimi stratejileri
    `;

    try {
      const response = await this.model.generateContent(marketAnalysis);
      return (
        response.response.candidates?.[0]?.content?.parts?.[0]?.type === 'text'
          ? response.response.candidates[0].content.parts[0].text
          : ''
      );
    } catch (error) {
      console.error('Market Analysis Error:', error);
      throw error;
    }
  }

  async getTrendingAssets(): Promise<string> {
    const trendPrompt = `
Türkiye'de güncel yatırım trendleri:
1. En popüler hisseler (BIST 100)
2. GYO performansları
3. Döviz hareketleri
4. Altın fiyat trendi
5. Tahvil verim eğrisi

Yatırımcılar hangi sektörlere yatırım yapıyor?
    `;

    try {
      const response = await this.model.generateContent(trendPrompt);
      return (
        response.response.candidates?.[0]?.content?.parts?.[0]?.type === 'text'
          ? response.response.candidates[0].content.parts[0].text
          : ''
      );
    } catch (error) {
      console.error('Trending Assets Error:', error);
      throw error;
    }
  }

  async getMarketForecast(timeframe: string = '1month'): Promise<string> {
    const forecastPrompt = `
Piyasa Tahmini (${timeframe}):

1. BIST 100 endeksi tahmini
2. Döviz kurları (USD/TL, EUR/TL)
3. Altın fiyat projeksiyonu
4. Faiz oranı beklentileri
5. Enflasyon tahminleri

Riskleri de belirt.
    `;

    try {
      const response = await this.model.generateContent(forecastPrompt);
      return (
        response.response.candidates?.[0]?.content?.parts?.[0]?.type === 'text'
          ? response.response.candidates[0].content.parts[0].text
          : ''
      );
    } catch (error) {
      console.error('Market Forecast Error:', error);
      throw error;
    }
  }
}
