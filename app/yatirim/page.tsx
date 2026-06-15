'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

export default function InvestmentForm() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    assetType: 'stock',
    symbol: '',
    purchasePrice: '',
    quantity: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    currentPrice: '',
    currency: 'TRY',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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

      const response = await fetch('/api/investment', {
        method: 'POST',
        headers,
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Yatırım başarıyla eklendi!');
        setFormData({
          assetType: 'stock',
          symbol: '',
          purchasePrice: '',
          quantity: '',
          purchaseDate: new Date().toISOString().split('T')[0],
          currentPrice: '',
          currency: 'TRY',
          notes: '',
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Yatırım Ekle 📊</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl p-8">
          {/* Asset Type */}
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">Varlık Türü</label>
            <select
              name="assetType"
              value={formData.assetType}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="stock">Hisse Senedi (BIST)</option>
              <option value="gyo">GYO (Gayrimenkul Yatırım Ortaklığı)</option>
              <option value="ppf">PPF (Geri Ödeme Planı)</option>
              <option value="gold">Altın</option>
              <option value="forex">Döviz</option>
              <option value="fund">Yatırım Fonu</option>
              <option value="crypto">Kripto Para</option>
              <option value="bond">Tahvil</option>
            </select>
          </div>

          {/* Symbol */}
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">Sembol/Kod</label>
            <input
              type="text"
              name="symbol"
              value={formData.symbol}
              onChange={handleChange}
              placeholder="Örn: GARAN, ASELS, GOLD, USD"
              required
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Purchase Price */}
            <div>
              <label className="block text-gray-700 font-bold mb-2">Alış Fiyatı</label>
              <input
                type="number"
                name="purchasePrice"
                value={formData.purchasePrice}
                onChange={handleChange}
                placeholder="100"
                step="0.01"
                required
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-gray-700 font-bold mb-2">Miktar</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="10"
                step="0.01"
                required
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Current Price */}
            <div>
              <label className="block text-gray-700 font-bold mb-2">Güncel Fiyat</label>
              <input
                type="number"
                name="currentPrice"
                value={formData.currentPrice}
                onChange={handleChange}
                placeholder="120"
                step="0.01"
                required
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Purchase Date */}
            <div>
              <label className="block text-gray-700 font-bold mb-2">Satın Alma Tarihi</label>
              <input
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Currency */}
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">Para Birimi</label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="TRY">Türk Lirası (₺)</option>
              <option value="USD">ABD Doları ($)</option>
              <option value="EUR">Euro (€)</option>
              <option value="GBP">İngiliz Sterlini (£)</option>
            </select>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">Notlar</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Yatırım hakkında ek notlar..."
              rows={3}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Message */}
          {message && <div className="mb-4 p-4 bg-blue-100 text-blue-700 rounded-lg">{message}</div>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold py-3 rounded-lg hover:from-blue-500 hover:to-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Kaydediliyor...' : 'Yatırımı Kaydet ✅'}
          </button>
        </form>
      </div>
    </div>
  );
}
