import { NextRequest, NextResponse } from 'next/server';
import { MarketService } from '@/lib/market-data/market-service';

const marketService = new MarketService();

export async function GET(req: NextRequest) {
  try {
    const type = req.nextUrl.searchParams.get('type') || 'all';

    let data: any = {};

    if (type === 'all' || type === 'forex') {
      data.exchangeRates = await marketService.getTCMBExchangeRates();
    }

    if (type === 'all' || type === 'gold') {
      data.goldPrices = await marketService.getGoldPrices();
    }

    if (type === 'all' || type === 'stocks') {
      const topStocks = ['GARAN', 'ASELS', 'EREGL', 'THYAO', 'TOASO'];
      data.stocks = await marketService.getBISTStocks(topStocks);
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    console.error('Market Data Error:', error);
    return NextResponse.json(
      { error: error.message || 'Hata oluştu' },
      { status: 500 }
    );
  }
}
