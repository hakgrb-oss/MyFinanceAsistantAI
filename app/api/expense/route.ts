import { NextRequest, NextResponse } from 'next/server';
import { FirestoreService } from '@/lib/db/firestore-service';

const db = new FirestoreService();

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    const { amount, category, description, date, isRecurring, paymentMethod } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'Kullanıcı ID gereklidir' },
        { status: 401 }
      );
    }

    if (!amount || !category) {
      return NextResponse.json(
        { error: 'Miktar ve kategori gereklidir' },
        { status: 400 }
      );
    }

    const expenseId = await db.addExpense(userId, {
      amount: parseFloat(amount),
      category,
      description: description || '',
      date: new Date(date),
      isRecurring: isRecurring || false,
      paymentMethod: paymentMethod || 'cash',
    });

    return NextResponse.json(
      { message: 'Gider eklendi', expenseId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Add Expense Error:', error);
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

    const expenses = await db.getUserExpenses(userId);

    return NextResponse.json({ expenses }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Hata oluştu' },
      { status: 500 }
    );
  }
}
