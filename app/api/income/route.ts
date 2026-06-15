import { NextRequest, NextResponse } from 'next/server';
import { FirestoreService } from '@/lib/db/firestore-service';

const db = new FirestoreService();

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    const { amount, sourceType, description, paymentDate, isRecurring, recurringDay, recurringFrequency } =
      await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'Kullanıcı ID gereklidir' },
        { status: 401 }
      );
    }

    if (!amount || !sourceType) {
      return NextResponse.json(
        { error: 'Miktar ve kaynak türü gereklidir' },
        { status: 400 }
      );
    }

    const incomeId = await db.addIncome(userId, {
      amount: parseFloat(amount),
      sourceType,
      description: description || '',
      paymentDate: new Date(paymentDate),
      isRecurring: isRecurring || false,
      recurringDay,
      recurringFrequency,
    });

    return NextResponse.json(
      { message: 'Gelir eklendi', incomeId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Add Income Error:', error);
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

    const incomes = await db.getUserIncomes(userId);

    return NextResponse.json({ incomes }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Hata oluştu' },
      { status: 500 }
    );
  }
}
