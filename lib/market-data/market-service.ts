import type { MarketData } from '@/types';

export class MarketService {
  // TCMB Döviz Verileri
  async getTCMBExchangeRates(): Promise<MarketData[]> {
    try {
      // TCMB API - https://www.tcmb.gov.tr/kurlar/today
      const response = await fetch('https://www.tcmb.gov.tr/kurlar/today.xml');
      const xmlText = await response.text();
      
      // Parse XML ve dönüştür
      return this.parseExchangeRates(xmlText);
    } catch (error) {
      console.error('TCMB Exchange Rates Error:', error);
      return [];
    }
  }

  // Altın Fiyatları (Gamiş API)
  async getGoldPrices(): Promise<MarketData[]> {
    try {
      // İstanbul Altın Piyasası verileri
      const response = await fetch(
        'https://api.metals.live/v1/spot/gold?currency=TRY'
      );
      const data = await response.json();
      
      return [
        {
          symbol: 'GOLD',
          name: 'Altın (gr)',
          currentPrice: data.gold,
          currency: 'TRY',
          change: 0,
          changePercent: 0,
          timestamp: new Date(),
          source: 'metals.live',
        },
      ];
    } catch (error) {
      console.error('Gold Prices Error:', error);
      return [];
    }
  }

  // BIST Hisse Verileri (Finnhub Free Tier)
  async getBISTStocks(symbols: string[]): Promise<MarketData[]> {
    try {
      const apiKey = process.env.FINNHUB_API_KEY;
      const results: MarketData[] = [];

      for (const symbol of symbols) {
        const response = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=${symbol}.IS&token=${apiKey}`
        );
        const data = await response.json();

        results.push({
          symbol: symbol,
          name: symbol, // BIST hisse adı
          currentPrice: data.c || 0,
          currency: 'TRY',
          change: data.d || 0,
          changePercent: data.dp || 0,
          timestamp: new Date(),
          source: 'finnhub',
        });
      }

      return results;
    } catch (error) {
      console.error('BIST Stocks Error:', error);
      return [];
    }
  }

  private parseExchangeRates(xmlText: string): MarketData[] {
    // XML parser (simple regex)
    const rates: MarketData[] = [];

    const usdMatch = xmlText.match(
      /<Currency code="USD">[^]*?<BanknoteBuying>([^<]+)</
    );
    const eurMatch = xmlText.match(
      /<Currency code="EUR">[^]*?<BanknoteBuying>([^<]+)</
    );

    if (usdMatch?.[1]) {
      rates.push({
        symbol: 'USDTRY',
        name: 'USD/TL',
        currentPrice: parseFloat(usdMatch[1]),
        currency: 'TRY',
        change: 0,
        changePercent: 0,
        timestamp: new Date(),
        source: 'tcmb',
      });
    }

    if (eurMatch?.[1]) {
      rates.push({
        symbol: 'EURTRY',
        name: 'EUR/TL',
        currentPrice: parseFloat(eurMatch[1]),
        currency: 'TRY',
        change: 0,
        changePercent: 0,
        timestamp: new Date(),
        source: 'tcmb',
      });
    }

    return rates;
  }
}
