'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

export default function ExpenseForm() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    amount: '',
    category: 'food',
    description: '',
    date: new Date().toISOString().split('T')[0],
    isRecurring: false,
    paymentMethod: 'cash',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? e.target.checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const headers = {
        'Content-Type': 'application/json',
        'x-user-id': user?.uid || '',
      };

      const response = await fetch('/api/expense', {
        method: 'POST',
        headers,
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Gider başarıyla eklendi!');
        setFormData({
          amount: '',
          category: 'food',
          description: '',
          date: new Date().toISOString().split('T')[0],
          isRecurring: false,
          paymentMethod: 'cash',
        });
      } else {
        setMessage(`❌ Hata: ${data.error}`);
      }
    } catch (error) {
      setMessage('❌ Bir hata oluştu');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Gider Ekle 💳</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl p-8">
          {/* Amount */}
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">Miktar (₺)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="500"
              step="0.01"
              required
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Category */}
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">Kategori</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
            >
              <option value="rent">Kira</option>
              <option value="utilities">Elektrik/Su/İnternet</option>
              <option value="food">Yemek</option>
              <option value="transport">Ulaşım</option>
              <option value="healthcare">Sağlık</option>
              <option value="entertainment">Eğlence</option>
              <option value="other">Diğer</option>
            </select>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">Açıklama</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Örn: Tüm ay kira"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Date */}
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">Tarih</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">Ödeme Yöntemi</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
            >
              <option value="cash">Nakit</option>
              <option value="debit_card">Banka Kartı</option>
              <option value="credit_card">Kredi Kartı</option>
              <option value="transfer">Havale</option>
            </select>
          </div>

          {/* Recurring */}
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isRecurring"
                checked={formData.isRecurring}
                onChange={handleChange}
                className="w-4 h-4 text-red-500"
              />
              <span className="ml-2 text-gray-700">Tekrarlayan Gider</span>
            </label>
          </div>

          {/* Message */}
          {message && <div className="mb-4 p-4 bg-blue-100 text-blue-700 rounded-lg">{message}</div>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-400 to-red-600 text-white font-bold py-3 rounded-lg hover:from-red-500 hover:to-red-700 transition disabled:opacity-50"
          >
            {loading ? 'Kaydediliyor...' : 'Gideri Kaydet ✅'}
          </button>
        </form>
      </div>
    </div>
  );
}
