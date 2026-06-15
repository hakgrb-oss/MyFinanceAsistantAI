'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

export default function IncomeForm() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    amount: '',
    sourceType: 'salary',
    description: '',
    paymentDate: new Date().toISOString().split('T')[0],
    isRecurring: false,
    recurringDay: 1,
    recurringFrequency: 'monthly',
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

      const response = await fetch('/api/income', {
        method: 'POST',
        headers,
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Gelir başarıyla eklendi!');
        setFormData({
          amount: '',
          sourceType: 'salary',
          description: '',
          paymentDate: new Date().toISOString().split('T')[0],
          isRecurring: false,
          recurringDay: 1,
          recurringFrequency: 'monthly',
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Gelir Ekle ➕</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl p-8">
          {/* Amount */}
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">Miktar (₺)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="5000"
              step="0.01"
              required
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
            />
          </div>

          {/* Source Type */}
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">Gelir Kaynağı</label>
            <select
              name="sourceType"
              value={formData.sourceType}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
            >
              <option value="salary">Maaş</option>
              <option value="bonus">Bonus</option>
              <option value="freelance">Serbest Çalışma</option>
              <option value="investment">Yatırım Geliri</option>
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
              placeholder="Aylık maaş, bonus vb."
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
            />
          </div>

          {/* Payment Date */}
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">Ödeme Tarihi</label>
            <input
              type="date"
              name="paymentDate"
              value={formData.paymentDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
            />
          </div>

          {/* Recurring */}
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isRecurring"
                checked={formData.isRecurring}
                onChange={handleChange}
                className="w-4 h-4 text-green-500"
              />
              <span className="ml-2 text-gray-700">Tekrarlayan Gelir</span>
            </label>
          </div>

          {formData.isRecurring && (
            <>
              <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-2">Tekrarlanma Sıklığı</label>
                <select
                  name="recurringFrequency"
                  value={formData.recurringFrequency}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                >
                  <option value="monthly">Aylık</option>
                  <option value="quarterly">Üç Aylık</option>
                  <option value="yearly">Yıllık</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-2">Ayın Kaçıncı Günü</label>
                <input
                  type="number"
                  name="recurringDay"
                  value={formData.recurringDay}
                  onChange={handleChange}
                  min="1"
                  max="31"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                />
              </div>
            </>
          )}

          {/* Message */}
          {message && <div className="mb-4 p-4 bg-blue-100 text-blue-700 rounded-lg">{message}</div>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white font-bold py-3 rounded-lg hover:from-green-500 hover:to-green-700 transition disabled:opacity-50"
          >
            {loading ? 'Kaydediliyor...' : 'Geliri Kaydet ✅'}
          </button>
        </form>
      </div>
    </div>
  );
}
