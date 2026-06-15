# 🚀 MyFinanceAsistantAI - AI-Powered Personal Finance Management System

**Türkiye'ye özgü, yapay zeka destekli finansal yönetim sistemi**

## 📋 İçindekiler
- [Özellikler](#-özellikler)
- [Teknoloji Stack](#-teknoloji-stack)
- [Kurulum](#-kurulum)
- [API Endpoints](#-api-endpoints)
- [AI Agents](#-5-ai-agent-mimarisi)
- [Kullanıcı Rehberi](#-kullanıcı-rehberi)
- [Katkı](#-katkı)

---

## ✨ Özellikler

### 💰 Finansal Yönetim
- ✅ **Gelir Yönetimi** - Maaş, bonus, serbest çalışma, yatırım geliri
- ✅ **Gider Takibi** - Kategorilere göre gider analizi
- ✅ **Banka Hesapları** - Kredi kartı, borç, faiz yönetimi
- ✅ **Yatırım Portföyü** - BIST, GYO, PPF, Altın, Forex, Kripto
- ✅ **Piyasa Verileri** - Real-time BIST, TCMB döviz, altın fiyatları

### 🤖 5 AI Agent Sistemi
1. **Coordinator Agent** - Genel finansal analiz ve koordinasyon
2. **Income Agent** - Gelir optimizasyonu ve büyüme stratejileri
3. **Expense Agent** - Gider analizi ve tasarruf önerileri
4. **Investment Agent** - Portföy analizi ve rebalancing
5. **Market Agent** - Piyasa trendleri ve yatırım önerileri

### 📊 Dashboard Özellikleri
- Net worth hesaplaması
- Tasarruf oranı izleme
- Gelir/Gider özeti
- Yatırım performansı
- Borç yönetimi
- Piyasa haberleri

### 🧠 AI Danışman (Chatbot)
- Doğal dil sorgularına cevap
- Finansal tavsiye
- Portföy optimizasyonu
- Vergi planlama
- Çok aşamalı sohbet (Multi-turn conversation)

---

## 🛠 Teknoloji Stack

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - UI styling
- **Recharts** - Grafikleri (gelecek sürüm)

### Backend
- **Next.js API Routes** - Serverless backend
- **Google Gemini 2.0 Flash** - AI/LLM
- **Firebase** - Authentication & Firestore
- **Node.js** - Runtime

### Piyasa Verileri
- **TCMB API** - Türkiye döviz kurları
- **Metals.live API** - Altın fiyatları
- **Finnhub API** - BIST hisse fiyatları

### Deployment
- **Vercel** - Frontend hosting
- **Firebase Functions** - Backend (optional)
- **Docker** - Containerization

---

## 📦 Kurulum

### Ön Gereksinimler
- Node.js 18+ 
- npm veya yarn
- Firebase hesabı
- Google Gemini API key
- Finnhub API key (optional)

### 1. Repository'yi Clone Edin
```bash
git clone https://github.com/hakgrb-oss/MyFinanceAsistantAI.git
cd MyFinanceAsistantAI
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
# veya
yarn install
```

### 3. Environment Variables'ı Konfigüre Edin
```bash
cp .env.local.example .env.local
```

`.env.local` dosyasını düzenleyin:
```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Market Data
FINNHUB_API_KEY=your_finnhub_key (optional)
```

### 4. Firebase Setup
1. [Firebase Console](https://console.firebase.google.com)'a gidin
2. Yeni proje oluşturun
3. Authentication: Email/Password etkinleştirin
4. Firestore Database oluşturun
5. Web uygulamasını kaydedin
6. Credentials'ı `.env.local`'a yapıştırın

### 5. Development Server Başlatın
```bash
npm run dev
```

`http://localhost:3000` adresini açın

### 6. Production Build
```bash
npm run build
npm start
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register    - Kayıt
POST   /api/auth/login       - Giriş
GET    /api/auth/me          - Profil
```

### Finansal Veriler
```
POST   /api/income           - Gelir ekle
GET    /api/income           - Gelirleri listele
POST   /api/expense          - Gider ekle
GET    /api/expense          - Giderleri listele
POST   /api/bank             - Banka hesabı ekle
GET    /api/bank             - Banka hesaplarını listele
POST   /api/investment       - Yatırım ekle
GET    /api/investment       - Yatırımları listele
```

### AI & Market
```
POST   /api/ai-advisor       - AI danışman sorgula
GET    /api/market-data      - Piyasa verileri
```

---

## 🤖 5 AI Agent Mimarisi

### Coordinator Agent
- Tüm finansal veriyi toplar
- Genel analiz yapar
- Diğer agentleri koordine eder
- Multi-turn conversation

### Income Agent
- Gelir çeşitlendirmesi analizi
- Passive income fırsatları
- Gelir artırma stratejileri
- Vergi optimizasyonu

### Expense Agent
- Gider kategorisi analizi
- Tasarruf önerileri
- Borç ödeme stratejileri
- Faiz tasarrufu

### Investment Agent
- Portföy analizi
- Diversifikasyon önerileri
- Rebalancing stratejileri
- Risk yönetimi

### Market Agent
- Piyasa trendleri
- BIST analizi
- Döviz hareketleri
- Yatırım önerileri

---

## 📊 Kullanıcı Rehberi

### 1. Giriş Yapın
- Email ve şifre ile kayıt olun
- İlk kez mi? "Kayıt Ol" seçeneğini kullanın

### 2. Finansal Verilerinizi Ekleyin
- **Gelir**: Aylık maaş, bonus, freelance vb.
- **Giderler**: Kira, yemek, ulaşım vb.
- **Banka**: Kredi kartı borcu, faiz oranları
- **Yatırımlar**: BIST hisseleri, GYO, altın

### 3. Dashboard'ı İzleyin
- Net worth hesaplaması
- Tasarruf oranı
- Gelir/gider dengesi

### 4. AI Danışmanı Kullanın
- "Tavsiye" butonlarını tıklayın
- Doğal dil ile soru sorun
- AI önerilerini uygulayın

### 5. Piyasa Verilerini Takip Edin
- BIST hisse fiyatları
- Döviz kurları (USD, EUR)
- Altın fiyatları

---

## 🔐 Güvenlik

- ✅ Firebase Authentication
- ✅ Environment variables kullanımı
- ✅ HTTPS-only
- ✅ Firestore Security Rules
- ✅ API rate limiting (gelecek sürüm)

---

## 📝 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced charting (Recharts)
- [ ] SMS/Email notifications
- [ ] Budget planning wizard
- [ ] Tax calculation module
- [ ] Investment recommendations
- [ ] Real-time portfolio tracking
- [ ] Data export (PDF, CSV)
- [ ] Multi-currency support
- [ ] Social features (investment sharing)

---

## 🤝 Katkı

Katkılar hoş geldiniz! Lütfen:

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

---

## 📄 Lisans

MIT License

---

## 📧 İletişim

- 📧 Email: hakgrb@gmail.com
- 🐙 GitHub: [@hakgrb-oss](https://github.com/hakgrb-oss)

---

## ⭐ Eğer Beğendiyseniz

Lütfen projeyi yıldızlayın! ⭐

---

**Yapımcı**: Hak0nuzz 🚀  
**Son Güncelleme**: Haziran 2026
