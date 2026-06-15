# Vercel Deployment Configuration

When deploying to Vercel:

## 1. Connect Repository
```bash
vercel link
```

## 2. Set Environment Variables
```bash
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID
vercel env add GEMINI_API_KEY
vercel env add FINNHUB_API_KEY
```

## 3. Deploy
```bash
vercel deploy --prod
```

## 4. Configure Custom Domain
- Go to Project Settings
- Add your custom domain
- Configure DNS records

## Build Settings
- Framework: Next.js
- Build Command: npm run build
- Output Directory: .next
- Install Command: npm install

## Important Notes
- Public environment variables (NEXT_PUBLIC_*) are safe to expose
- Private variables are kept secret
- Firebase handles authentication securely
- All API calls are server-side where needed
