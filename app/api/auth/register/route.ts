import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { FirestoreService } from '@/lib/db/firestore-service';

const db = new FirestoreService();

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, şifre ve ad gereklidir' },
        { status: 400 }
      );
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;

    await db.createUser(userId, {
      id: userId,
      email,
      name,
      profileImage: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { message: 'Kayıt başarılı', userId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Register Error:', error);
    return NextResponse.json(
      { error: error.message || 'Kayıt hatası' },
      { status: 500 }
    );
  }
}
