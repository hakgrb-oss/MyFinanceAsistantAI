import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import type {
  User,
  Income,
  Expense,
  BankAccount,
  Investment,
} from '@/types';

export class FirestoreService {
  // User Operations
  async createUser(userId: string, userData: Partial<User>) {
    await setDoc(doc(db, 'users', userId), {
      ...userData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  }

  async getUser(userId: string) {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.exists() ? (userDoc.data() as User) : null;
  }

  async updateUser(userId: string, data: Partial<User>) {
    await updateDoc(doc(db, 'users', userId), {
      ...data,
      updatedAt: Timestamp.now(),
    });
  }

  // Income Operations
  async addIncome(userId: string, incomeData: Partial<Income>) {
    const docRef = await addDoc(collection(db, 'incomes'), {
      userId,
      ...incomeData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  }

  async getUserIncomes(userId: string): Promise<Income[]> {
    const q = query(collection(db, 'incomes'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Income));
  }

  // Expense Operations
  async addExpense(userId: string, expenseData: Partial<Expense>) {
    const docRef = await addDoc(collection(db, 'expenses'), {
      userId,
      ...expenseData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  }

  async getUserExpenses(userId: string): Promise<Expense[]> {
    const q = query(collection(db, 'expenses'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Expense));
  }

  // Bank Account Operations
  async addBankAccount(userId: string, bankData: Partial<BankAccount>) {
    const docRef = await addDoc(collection(db, 'bankAccounts'), {
      userId,
      ...bankData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  }

  async getUserBankAccounts(userId: string): Promise<BankAccount[]> {
    const q = query(
      collection(db, 'bankAccounts'),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as BankAccount));
  }

  // Investment Operations
  async addInvestment(userId: string, investmentData: Partial<Investment>) {
    const docRef = await addDoc(collection(db, 'investments'), {
      userId,
      ...investmentData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  }

  async getUserInvestments(userId: string): Promise<Investment[]> {
    const q = query(
      collection(db, 'investments'),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Investment));
  }

  async updateInvestment(investmentId: string, data: Partial<Investment>) {
    await updateDoc(doc(db, 'investments', investmentId), {
      ...data,
      updatedAt: Timestamp.now(),
    });
  }

  // AI Recommendations
  async saveAIRecommendation(userId: string, recommendation: any) {
    const docRef = await addDoc(collection(db, 'aiRecommendations'), {
      userId,
      ...recommendation,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  }

  async getUserRecommendations(userId: string) {
    const q = query(
      collection(db, 'aiRecommendations'),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data());
  }
}
