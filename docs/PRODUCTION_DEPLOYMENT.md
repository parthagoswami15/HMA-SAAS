# Production Deployment Guide

## 🚀 After Local Testing is Successful

### 1. Update Frontend for Production

Update `apps/web/.env.local`:
```bash
# Frontend API Configuration - Production
NEXT_PUBLIC_API_URL=https://hms-saas-staging.onrender.com
NEXT_PUBLIC_APP_NAME=HMS SAAS
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 2. Update Signup Page for Production

In `apps/web/src/app/signup/page.tsx`, line 22:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://hms-saas-staging.onrender.com';
```

### 3. Update Login Page for Production

In `apps/web/src/app/login/page.tsx`, line 13:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://hms-saas-staging.onrender.com';
```

### 4. Commit and Push Changes

```bash
git add -A
git commit -m "feat: Add functional signup and login with API integration

- Convert static signup/login forms to functional React components
- Add proper state management and form validation
- Implement API integration with backend
- Add error handling and loading states
- Fix CORS configuration for Vercel domains
- Add proper hydration handling for Next.js"

git push origin main
```

### 5. Vercel Environment Variables

In your Vercel dashboard, add these environment variables:
- `NEXT_PUBLIC_API_URL` = `https://hms-saas-staging.onrender.com`
- `NEXT_PUBLIC_APP_NAME` = `HMS SAAS`
- `NEXT_PUBLIC_APP_VERSION` = `1.0.0`

### 6. Backend Auto-Deploy

Your Render backend will automatically deploy when you push to GitHub.

## 📋 Changes Made

### Frontend Changes:
- ✅ Functional signup form with API integration
- ✅ Functional login form with API integration
- ✅ Proper state management with React hooks
- ✅ Form validation and error handling
- ✅ Loading states and success messages
- ✅ Hydration fixes for Next.js SSR
- ✅ Environment variable configuration

### Backend Changes:
- ✅ CORS configuration updated for Vercel domains
- ✅ Support for both localhost and production origins
- ✅ Dynamic CORS origin handling

### Database:
- ✅ Using Supabase session pooler for reliability
- ✅ Database schema synchronized and working
- ✅ All migrations resolved

## 🎯 Testing Checklist

Before deploying to production, ensure:
- [ ] Signup works locally
- [ ] Login works locally  
- [ ] User data is stored correctly in Supabase
- [ ] JWT tokens are generated and stored
- [ ] No console errors in browser
- [ ] Both signup and login forms show proper loading states
- [ ] Error messages display correctly
- [ ] Success messages and redirects work

## 🚀 Deploy Order

1. **Git push** - triggers both Render backend and Vercel frontend deployments
2. **Add Vercel env vars** - if not already added
3. **Test on production** - verify everything works on live URLs

## 📞 Production URLs

- **Frontend (Vercel)**: Your Vercel URL
- **Backend (Render)**: https://hms-saas-staging.onrender.com
- **Database**: Supabase (already configured)