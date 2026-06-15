import { NextRequest, NextResponse } from 'next/server';
import { FirestoreService } from '@/lib/db/firestore-service';

const db = new FirestoreService();

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    const { assetType, symbol, purchasePrice, quantity, purchaseDate, currentPrice, currency, notes } =
      await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'Kullanıcı ID gereklidir' },
        { status: 401 }
      );
    }

    const investmentId = await db.addInvestment(userId, {
      assetType,
      symbol,
      purchasePrice: parseFloat(purchasePrice),
      quantity: parseFloat(quantity),
      purchaseDate: new Date(purchaseDate),
      currentPrice: parseFloat(currentPrice),
      totalValue: parseFloat(quantity) * parseFloat(currentPrice),
      currency: currency || 'TRY',
      notes,
    });

    return NextResponse.json(
      { message: 'Yatırım eklendi', investmentId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Add Investment Error:', error);
    return NextResponse.json(
      { error: error.message || 'Hata oluştu' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'Kullanıcı ID gereklidir' },
        { status: 401 }
      );
    }

    const investments = await db.getUserInvestments(userId);

    return NextResponse.json({ investments }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Hata oluştu' },
      { status: 500 }
    );
  }
}
