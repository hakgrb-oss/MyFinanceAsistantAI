'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Yükleniyor...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">💰 MyFinanceAI</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-4">
              <a href="/dashboard" className="hover:bg-blue-700 px-3 py-2 rounded-md transition">
                📊 Dashboard
              </a>
              <a href="/gelir" className="hover:bg-blue-700 px-3 py-2 rounded-md transition">
                ➕ Gelir
              </a>
              <a href="/giderler" className="hover:bg-blue-700 px-3 py-2 rounded-md transition">
                💳 Giderler
              </a>
              <a href="/yatirim" className="hover:bg-blue-700 px-3 py-2 rounded-md transition">
                📈 Yatırım
              </a>
              <a href="/ai-danisma" className="hover:bg-blue-700 px-3 py-2 rounded-md transition">
                🤖 AI Danışman
              </a>
            </div>

            {/* User Profile */}
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-sm">{user?.email}</span>
              <button
                onClick={() => {
                  localStorage.clear();
                  router.push('/');
                }}
                className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md transition"
              >
                Çıkış
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white"
            >
              ☰
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              <a href="/dashboard" className="block hover:bg-blue-700 px-3 py-2 rounded-md transition">
                📊 Dashboard
              </a>
              <a href="/gelir" className="block hover:bg-blue-700 px-3 py-2 rounded-md transition">
                ➕ Gelir
              </a>
              <a href="/giderler" className="block hover:bg-blue-700 px-3 py-2 rounded-md transition">
                💳 Giderler
              </a>
              <a href="/yatirim" className="block hover:bg-blue-700 px-3 py-2 rounded-md transition">
                📈 Yatırım
              </a>
              <a href="/ai-danisma" className="block hover:bg-blue-700 px-3 py-2 rounded-md transition">
                🤖 AI Danışman
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}
