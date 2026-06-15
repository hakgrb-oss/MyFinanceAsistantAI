import { NextRequest, NextResponse } from 'next/server';
import { FirestoreService } from '@/lib/db/firestore-service';

const db = new FirestoreService();

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    const { bankName, accountType, balance, creditLimit, currentDebt, minimumPayment, dueDate, interestRate, description } =
      await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'Kullanıcı ID gereklidir' },
        { status: 401 }
      );
    }

    const bankId = await db.addBankAccount(userId, {
      bankName,
      accountType,
      balance: parseFloat(balance),
      creditLimit: creditLimit ? parseFloat(creditLimit) : undefined,
      currentDebt: currentDebt ? parseFloat(currentDebt) : undefined,
      minimumPayment: minimumPayment ? parseFloat(minimumPayment) : undefined,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      interestRate: interestRate ? parseFloat(interestRate) : undefined,
      description,
    });

    return NextResponse.json(
      { message: 'Banka hesabı eklendi', bankId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Add Bank Account Error:', error);
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

    const bankAccounts = await db.getUserBankAccounts(userId);

    return NextResponse.json({ bankAccounts }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Hata oluştu' },
      { status: 500 }
    );
  }
}
