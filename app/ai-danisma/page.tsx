'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';

export default function AIAdvisor() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState('');
  const [selectedAction, setSelectedAction] = useState('chat');

  const handleActionClick = async (action: string) => {
    setSelectedAction(action);
    setLoading(true);

    try {
      const headers = {
        'Content-Type': 'application/json',
        'x-user-id': user?.uid || '',
      };

      const response = await fetch('/api/ai-advisor', {
        method: 'POST',
        headers,
        body: JSON.stringify({ action, query: '' }),
      });

      const data = await response.json();

      if (response.ok) {
        const content = typeof data.response === 'string' ? data.response : JSON.stringify(data.response);
        setMessages([...messages, { role: 'assistant', content }]);
      }
    } catch (error) {
      console.error('AI Advisor Error:', error);
      setMessages([...messages, { role: 'assistant', content: 'Bir hata oluştu, lütfen tekrar deneyin.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages([...messages, { role: 'user', content: input }]);
    setLoading(true);

    try {
      const headers = {
        'Content-Type': 'application/json',
        'x-user-id': user?.uid || '',
      };

      const response = await fetch('/api/ai-advisor', {
        method: 'POST',
        headers,
        body: JSON.stringify({ action: 'chat', query: input }),
      });

      const data = await response.json();

      if (response.ok) {
        const content = typeof data.response === 'string' ? data.response : JSON.stringify(data.response);
        setMessages((prev) => [...prev, { role: 'assistant', content }]);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setInput('');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">🤖 AI Finansal Danışman</h1>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => handleActionClick('analyze')}
            className="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-4 rounded-lg hover:shadow-lg transition"
            disabled={loading}
          >
            📊 Analiz
          </button>
          <button
            onClick={() => handleActionClick('income-advice')}
            className="bg-gradient-to-br from-green-400 to-green-600 text-white p-4 rounded-lg hover:shadow-lg transition"
            disabled={loading}
          >
            💰 Gelir
          </button>
          <button
            onClick={() => handleActionClick('expense-advice')}
            className="bg-gradient-to-br from-red-400 to-red-600 text-white p-4 rounded-lg hover:shadow-lg transition"
            disabled={loading}
          >
            💳 Giderler
          </button>
          <button
            onClick={() => handleActionClick('investment-advice')}
            className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-white p-4 rounded-lg hover:shadow-lg transition"
            disabled={loading}
          >
            📈 Yatırım
          </button>
          <button
            onClick={() => handleActionClick('market-trends')}
            className="bg-gradient-to-br from-pink-400 to-pink-600 text-white p-4 rounded-lg hover:shadow-lg transition"
            disabled={loading}
          >
            📉 Piyasa
          </button>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden flex flex-col h-96">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-20">
                <p className="text-2xl mb-2">👋 Hoş Geldiniz!</p>
                <p>Yukarıdaki butonlardan birini seçin ya da bana bir soru sorun</p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="border-t p-4 bg-gray-50">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Finansal konularında bana sor..."
                disabled={loading}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
              >
                {loading ? '⏳' : '➤'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
