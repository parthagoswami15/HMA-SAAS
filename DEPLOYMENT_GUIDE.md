# 🚀 HMS SAAS - DEPLOYMENT GUIDE

**Date:** October 18, 2025, 8:28 PM IST  
**Status:** Ready for Production Deployment

---

## 📋 DEPLOYMENT ARCHITECTURE

- **Frontend:** Vercel (Next.js)
- **Backend:** Render (NestJS API)
- **Database:** Supabase (PostgreSQL)

---

## 🗄️ STEP 1: DATABASE (SUPABASE) - ✅ ALREADY CONFIGURED

Your Supabase database is already set up! No changes needed.

### ✅ Current Configuration:
```
Database URL: postgresql://postgres.uoxyyqbwuzjraxhaypko:...@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres
Supabase URL: https://uoxyyqbwuzjraxhaypko.supabase.co
Region: ap-southeast-1 (Singapore)
```

### 📝 Action Required:
1. ✅ Database is ready
2. ✅ Connection pooling enabled (port 6543)
3. ⚠️ **Run migrations before deploying backend**

---

## 🔧 STEP 2: BACKEND (RENDER) - CONFIGURATION NEEDED

### 2.1 Create Render Web Service

1. Go to https://render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the `apps/api` directory

### 2.2 Render Configuration

**Build Settings:**
```
Name: hms-saas-api
Environment: Node
Region: Singapore (closest to your Supabase)
Branch: main
Root Directory: apps/api
Build Command: npm install && npm run build
Start Command: npm run start:prod
```

**Instance Type:**
- Start with **Free** tier for testing
- Upgrade to **Starter ($7/month)** for production

### 2.3 Environment Variables for Render

Add these in Render Dashboard → Environment:

```bash
# Server Configuration
NODE_ENV=production
PORT=3001

# Database - Supabase (COPY FROM YOUR .env)
DATABASE_URL=postgresql://postgres.uoxyyqbwuzjraxhaypko:9800975588pG@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1

# Database Details
DATABASE_HOST=aws-1-ap-southeast-1.pooler.supabase.com
DATABASE_PORT=6543
DATABASE_USERNAME=postgres.uoxyyqbwuzjraxhaypko
DATABASE_PASSWORD=9800975588pG
DATABASE_NAME=postgres
DATABASE_SYNCHRONIZE=false
DATABASE_LOGGING=false
DATABASE_SSL=true

# Supabase
SUPABASE_URL=https://uoxyyqbwuzjraxhaypko.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVveHl5cWJ3dXpqcmF4aGF5cGtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NjUzNDMsImV4cCI6MjA3NTE0MTM0M30.ji2oHJykS6eFzkuMJssp8_zH83rjJyT11z2mw3NQLpw
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVveHl5cWJ3dXpqcmF4aGF5cGtvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTU2NTM0MywiZXhwIjoyMDc1MTQxMzQzfQ.17ZYMGLqzcntTgpQwm1YzCT6eE8OGkGUCOONBgPC9DE

# JWT Configuration
JWT_SECRET=LBxZkVGZOFv63/NW7KHJoSqpxy4UmOgydImcsUPeqL0s0H5zF6s/p85UQwkWjZl5PEKqW1RKPyP36cI1ikv2fQ==
JWT_EXPIRES_IN=1d
JWT_ACCESS_TOKEN_SECRET=ynV9+MHiz9BDGvBH0eeD2QZtFfFrLrf3LfJVT8LaIu0=
JWT_ACCESS_TOKEN_EXPIRY=15m
JWT_REFRESH_TOKEN_SECRET=0yqN0qpJDu8uKOL5NhXJsDIWW1Ps8perSVRjO+5mBI8=
JWT_REFRESH_TOKEN_EXPIRY=7d

# Security
BCRYPT_SALT_ROUNDS=12

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100

# CORS - UPDATE AFTER VERCEL DEPLOYMENT
CORS_ORIGINS=https://your-vercel-app.vercel.app
CORS_ORIGIN=https://your-vercel-app.vercel.app

# Frontend URLs - UPDATE AFTER VERCEL DEPLOYMENT
FRONTEND_URL=https://your-vercel-app.vercel.app
RESET_PASSWORD_URL=https://your-vercel-app.vercel.app/reset-password

# File Uploads
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# App Configuration
APP_NAME=HMS SaaS
APP_VERSION=1.0.0
APP_URL=https://your-render-service.onrender.com

# Logging
LOG_LEVEL=info
LOG_TO_FILE=false

# API Documentation
SWAGGER_ENABLED=true
SWAGGER_PATH=api-docs
```

### 2.4 After Render Deployment

Once deployed, your backend URL will be:
```
https://hms-saas-api.onrender.com
```

⚠️ **IMPORTANT:** Copy this URL - you'll need it for frontend configuration!

---

## 🌐 STEP 3: FRONTEND (VERCEL) - CONFIGURATION NEEDED

### 3.1 Create Vercel Project

1. Go to https://vercel.com
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Select the `apps/web` directory

### 3.2 Vercel Configuration

**Framework Preset:** Next.js  
**Root Directory:** `apps/web`  
**Build Command:** `npm run build`  
**Output Directory:** `.next`  
**Install Command:** `npm install`  
**Node Version:** 18.x or 20.x

### 3.3 Environment Variables for Vercel

Add these in Vercel Dashboard → Settings → Environment Variables:

```bash
# API Configuration - UPDATE WITH YOUR RENDER URL
NEXT_PUBLIC_API_URL=https://hms-saas-api.onrender.com
NEXT_PUBLIC_API_BASE_URL=https://hms-saas-api.onrender.com/api

# App Configuration
NEXT_PUBLIC_APP_NAME=HMS SaaS
NEXT_PUBLIC_APP_VERSION=1.0.0

# Supabase (Optional - if using Supabase Auth in frontend)
NEXT_PUBLIC_SUPABASE_URL=https://uoxyyqbwuzjraxhaypko.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVveHl5cWJ3dXpqcmF4aGF5cGtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NjUzNDMsImV4cCI6MjA3NTE0MTM0M30.ji2oHJykS6eFzkuMJssp8_zH83rjJyT11z2mw3NQLpw
```

### 3.4 After Vercel Deployment

Your frontend URL will be:
```
https://hms-saas.vercel.app (or your custom domain)
```

---

## 🔄 STEP 4: UPDATE CORS & FRONTEND URLS

### 4.1 Update Backend Environment Variables on Render

Once you have your Vercel URL, go back to Render and update:

```bash
CORS_ORIGINS=https://hms-saas.vercel.app
CORS_ORIGIN=https://hms-saas.vercel.app
FRONTEND_URL=https://hms-saas.vercel.app
RESET_PASSWORD_URL=https://hms-saas.vercel.app/reset-password
```

Then **restart** your Render service.

### 4.2 Update Frontend API URL

Make sure your frontend `.env` or Vercel environment variables have:

```bash
NEXT_PUBLIC_API_URL=https://hms-saas-api.onrender.com
```

---

## 📝 STEP 5: RUN DATABASE MIGRATIONS

### Before First Deployment:

```bash
# Navigate to backend directory
cd apps/api

# Run Prisma migrations
npx prisma migrate deploy

# (Optional) Seed initial data
npm run seed
```

---

## ✅ DEPLOYMENT CHECKLIST

### Pre-Deployment:
- [ ] Database migrations run on Supabase
- [ ] All environment variables ready
- [ ] Code pushed to GitHub

### Backend (Render):
- [ ] Create Render Web Service
- [ ] Configure build settings
- [ ] Add all environment variables
- [ ] Deploy backend
- [ ] Copy backend URL
- [ ] Test API: `https://your-render-url.onrender.com/api-docs`

### Frontend (Vercel):
- [ ] Create Vercel Project
- [ ] Configure Next.js settings
- [ ] Add environment variables with Render URL
- [ ] Deploy frontend
- [ ] Copy frontend URL

### Post-Deployment:
- [ ] Update CORS_ORIGINS on Render with Vercel URL
- [ ] Update FRONTEND_URL on Render with Vercel URL
- [ ] Restart Render service
- [ ] Test login flow
- [ ] Test API calls from frontend

---

## 🔧 UPDATED .ENV FILE FOR RENDER

Here's your updated `.env` file for Render deployment:

```bash
# ====================
# PRODUCTION ENVIRONMENT - RENDER
# ====================

# Server Configuration
NODE_ENV=production
PORT=3001

# Database - Supabase PostgreSQL
DATABASE_URL="postgresql://postgres.uoxyyqbwuzjraxhaypko:9800975588pG@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# TypeORM Configuration
DATABASE_HOST=aws-1-ap-southeast-1.pooler.supabase.com
DATABASE_PORT=6543
DATABASE_USERNAME=postgres.uoxyyqbwuzjraxhaypko
DATABASE_PASSWORD=9800975588pG
DATABASE_NAME=postgres
DATABASE_SYNCHRONIZE=false
DATABASE_LOGGING=false
DATABASE_SSL=true

# Supabase Configuration
SUPABASE_URL=https://uoxyyqbwuzjraxhaypko.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVveHl5cWJ3dXpqcmF4aGF5cGtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NjUzNDMsImV4cCI6MjA3NTE0MTM0M30.ji2oHJykS6eFzkuMJssp8_zH83rjJyT11z2mw3NQLpw
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVveHl5cWJ3dXpqcmF4aGF5cGtvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTU2NTM0MywiZXhwIjoyMDc1MTQxMzQzfQ.17ZYMGLqzcntTgpQwm1YzCT6eE8OGkGUCOONBgPC9DE

# JWT Configuration
JWT_SECRET=LBxZkVGZOFv63/NW7KHJoSqpxy4UmOgydImcsUPeqL0s0H5zF6s/p85UQwkWjZl5PEKqW1RKPyP36cI1ikv2fQ==
JWT_EXPIRES_IN=1d
JWT_ACCESS_TOKEN_SECRET=ynV9+MHiz9BDGvBH0eeD2QZtFfFrLrf3LfJVT8LaIu0=
JWT_ACCESS_TOKEN_EXPIRY=15m
JWT_REFRESH_TOKEN_SECRET=0yqN0qpJDu8uKOL5NhXJsDIWW1Ps8perSVRjO+5mBI8=
JWT_REFRESH_TOKEN_EXPIRY=7d

# Security
BCRYPT_SALT_ROUNDS=12

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100

# CORS - UPDATE AFTER VERCEL DEPLOYMENT
CORS_ORIGINS=https://your-vercel-app.vercel.app
CORS_ORIGIN=https://your-vercel-app.vercel.app

# File Uploads
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Frontend URLs - UPDATE AFTER VERCEL DEPLOYMENT
FRONTEND_URL=https://your-vercel-app.vercel.app
RESET_PASSWORD_URL=https://your-vercel-app.vercel.app/reset-password

# App Configuration
APP_NAME=HMS SaaS
APP_VERSION=1.0.0
APP_URL=https://your-render-service.onrender.com

# Logging
LOG_LEVEL=info
LOG_TO_FILE=false

# API Documentation
SWAGGER_ENABLED=true
SWAGGER_PATH=api-docs
```

---

## 🚨 IMPORTANT NOTES

### 1. **Render Free Tier Limitations:**
- Service spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- Consider upgrading to Starter plan ($7/month) for production

### 2. **Database Connection Pooling:**
- You're using port 6543 (pooler) - ✅ Correct for Render
- Connection limit set to 1 - ✅ Good for serverless

### 3. **Security:**
- Never commit `.env` files to Git
- Use Render/Vercel environment variables dashboard
- Your JWT secrets are strong ✅

### 4. **CORS Configuration:**
- Must update CORS_ORIGINS after getting Vercel URL
- Without this, frontend won't be able to call API

---

## 🧪 TESTING AFTER DEPLOYMENT

### Test Backend:
```bash
# Health check
curl https://your-render-url.onrender.com/health

# API docs
https://your-render-url.onrender.com/api-docs
```

### Test Frontend:
```bash
# Visit your Vercel URL
https://your-vercel-app.vercel.app

# Check browser console for API connection
```

---

## 📞 NEXT STEPS

1. **Deploy Backend First:**
   - Create Render service
   - Add environment variables
   - Deploy and get URL

2. **Deploy Frontend:**
   - Create Vercel project
   - Add environment variables with Render URL
   - Deploy and get URL

3. **Update CORS:**
   - Go back to Render
   - Update CORS_ORIGINS with Vercel URL
   - Restart service

4. **Test Everything:**
   - Login flow
   - API calls
   - All dashboard pages

---

**READY TO DEPLOY!** 🚀✅

Let me know when you have your Render and Vercel URLs, and I'll help you update the final configuration!
