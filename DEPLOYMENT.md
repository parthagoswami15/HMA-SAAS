# HMS SaaS Deployment Guide

This guide walks you through deploying your Hospital Management System to **Supabase** (database + auth), **Render** (backend), and **Vercel** (frontend).

## 🎯 Quick Overview

- **Database & Auth**: Supabase (PostgreSQL + Authentication)
- **Backend API**: Render (NestJS/Node.js)
- **Frontend**: Vercel (Next.js/React)
- **Environment**: Staging first, then Production

---

## 📋 Prerequisites

Before starting, ensure you have:
- [Node.js 18+](https://nodejs.org/) installed
- [Git](https://git-scm.com/) configured
- Accounts on [Supabase](https://supabase.com), [Render](https://render.com), and [Vercel](https://vercel.com)
- Your HMS project code ready

---

## 1️⃣ Supabase Setup (Database + Authentication)

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Choose your organization
4. Fill in project details:
   - **Name**: `hms-saas-staging` (or your preferred name)
   - **Database Password**: Generate a strong password and save it!
   - **Region**: Choose closest to your users
5. Click **"Create new project"** and wait for setup (~2 minutes)

### Step 2: Configure Database
1. In your Supabase dashboard, go to **Settings → Database**
2. Copy your **Connection String** - it looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres
   ```
3. Replace `[YOUR-PASSWORD]` with your actual database password

### Step 3: Get API Keys
1. Go to **Settings → API**
2. Copy these values (you'll need them later):
   - **Project URL**: `https://[PROJECT-ID].supabase.co`
   - **Anon public key**: `eyJhbG...` (starts with eyJ)
   - **Service role key**: `eyJhbG...` (starts with eyJ, different from anon)

### Step 4: Run Database Migrations
```bash
# In your project root
cd apps/api

# Update your .env with Supabase credentials
cp .env.example .env

# Edit .env and update:
# DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres
# SUPABASE_URL=https://[PROJECT-ID].supabase.co
# SUPABASE_ANON_KEY=your-anon-key
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Generate Prisma client and run migrations
npm run prisma:generate
npm run prisma:migrate
```

### Step 5: Configure Authentication
1. In Supabase dashboard, go to **Authentication → Settings**
2. Enable **Email** authentication
3. Configure **Site URL** and **Redirect URLs**:
   - Site URL: `https://your-app-name.vercel.app` (you'll get this after Vercel deployment)
   - Redirect URLs: Add both staging and production URLs

---

## 2️⃣ Render Deployment (Backend API)

### Step 1: Prepare Your Repository
1. Ensure your code is pushed to GitHub/GitLab
2. Verify these files exist:
   - `apps/api/Dockerfile` ✅
   - `render-supabase.yaml` ✅ (or `render.yaml`)
   - `apps/api/.env.staging` ✅

### Step 2: Create Render Service
1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub/GitLab repository
4. Configure the service:

   **Basic Settings:**
   - **Name**: `hms-backend-staging`
   - **Region**: Same as Supabase (or closest)
   - **Branch**: `main` (or your deployment branch)
   - **Runtime**: `Docker`
   - **Dockerfile Path**: `./apps/api/Dockerfile`
   - **Docker Context**: `.` (root directory)

   **Advanced Settings:**
   - **Auto-Deploy**: `Yes`
   - **Health Check Path**: `/health`

### Step 3: Configure Environment Variables
In Render dashboard, go to your service → **Environment** and add:

```bash
# Required Environment Variables
NODE_ENV=production
PORT=10000

# Database (from Supabase)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres

# Supabase
SUPABASE_URL=https://[PROJECT-ID].supabase.co
SUPABASE_ANON_KEY=eyJhbG...your-anon-key...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...your-service-role-key...

# JWT (Generate strong secrets!)
JWT_SECRET=your-super-secure-64-char-random-string-for-production-use
JWT_ACCESS_SECRET=another-super-secure-random-string-for-access-tokens
JWT_REFRESH_SECRET=yet-another-secure-random-string-for-refresh-tokens

# Security
BCRYPT_SALT_ROUNDS=12

# CORS (you'll update this after Vercel deployment)
CORS_ORIGINS=https://your-frontend-app.vercel.app,http://localhost:3000

# Frontend URLs (you'll update these after Vercel deployment)
FRONTEND_URL=https://your-frontend-app.vercel.app
RESET_PASSWORD_URL=https://your-frontend-app.vercel.app/reset-password

# App Config
APP_NAME=HMS SaaS
APP_VERSION=1.0.0
LOG_LEVEL=info
SWAGGER_ENABLED=true
```

**💡 Pro Tips:**
- Generate strong secrets using: `openssl rand -base64 64`
- Save all secrets securely (password manager)
- You'll update CORS_ORIGINS after Vercel deployment

### Step 4: Deploy Backend
1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Your backend URL will be: `https://hms-backend-staging.onrender.com`
4. Test health endpoint: `https://your-backend-url.onrender.com/health`

---

## 3️⃣ Vercel Deployment (Frontend)

### Step 1: Prepare Frontend
1. Ensure `apps/web/vercel.json` exists ✅
2. Update `apps/web/.env.local` with your backend URL:
   ```bash
   NEXT_PUBLIC_API_URL=https://your-backend-app.onrender.com
   NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-ID].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   NEXT_PUBLIC_APP_ENV=production
   ```

### Step 2: Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# In your project root
cd apps/web

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# ? Set up and deploy "~/path/to/your/project/apps/web"? [Y/n] Y
# ? Which scope do you want to deploy to? [Your account]
# ? Link to existing project? [y/N] N
# ? What's your project's name? hms-frontend-staging
# ? In which directory is your code located? ./
```

### Step 3: Configure Environment Variables
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project → **Settings** → **Environment Variables**
3. Add these variables:

   **For all environments (Production, Preview, Development):**
   ```bash
   NEXT_PUBLIC_API_URL=https://your-backend-app.onrender.com
   NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-ID].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   NEXT_PUBLIC_APP_ENV=production
   NEXT_PUBLIC_APP_NAME=HMS SaaS
   ```

### Step 4: Deploy Production Build
```bash
# Deploy to production
vercel --prod

# Your app will be available at: https://hms-frontend-staging.vercel.app
```

---

## 4️⃣ Link Services Together

### Step 1: Update Backend CORS
1. Go to Render dashboard → Your backend service → **Environment**
2. Update these variables with your actual Vercel URL:
   ```bash
   CORS_ORIGINS=https://your-frontend-app.vercel.app,http://localhost:3000
   FRONTEND_URL=https://your-frontend-app.vercel.app
   RESET_PASSWORD_URL=https://your-frontend-app.vercel.app/reset-password
   APP_URL=https://your-backend-app.onrender.com
   ```
3. Save and redeploy

### Step 2: Update Supabase URLs
1. Go to Supabase dashboard → **Authentication** → **Settings**
2. Update **Site URL**: `https://your-frontend-app.vercel.app`
3. Update **Redirect URLs**: Add your Vercel app URL
4. **Save** configuration

---

## 5️⃣ Testing Your Deployment

### Health Checks
```bash
# Test backend health
curl https://your-backend-app.onrender.com/health

# Test API documentation
open https://your-backend-app.onrender.com/api-docs

# Test frontend
open https://your-frontend-app.vercel.app
```

### Test Authentication Flow
1. Go to your frontend URL
2. Try to register a new user
3. Check email for verification
4. Try to log in
5. Test protected routes

---

## 6️⃣ Environment Management

### Local Development
```bash
# Backend
cd apps/api
cp .env.example .env
# Edit .env with local values

# Frontend  
cd apps/web
# .env.local already configured for local development
```

### Staging Environment
- **Backend**: Update Render environment variables
- **Frontend**: Use Preview deployments with staging environment variables
- **Database**: Use the same Supabase project or create a separate staging project

### Production Environment
- **Backend**: Create a new Render service with production environment variables
- **Frontend**: Deploy to production domain with production environment variables
- **Database**: Consider using a separate production Supabase project

---

## 🚨 Security Checklist

- [ ] Strong JWT secrets (64+ characters, random)
- [ ] Database password is secure
- [ ] Supabase service role key is kept secure
- [ ] CORS origins are restricted to your domains only
- [ ] Environment variables are not committed to git
- [ ] API rate limiting is enabled
- [ ] HTTPS is enforced on all endpoints
- [ ] Sentry or error tracking is configured (optional)

---

## 🔧 Troubleshooting

### Backend Issues
```bash
# Check Render logs
render logs your-service-name

# Check database connection
# In Render terminal or local development
npx prisma db push
```

### Frontend Issues
```bash
# Check Vercel function logs
vercel logs

# Test API connectivity
curl https://your-backend-url/health
```

### Common Issues
1. **CORS errors**: Update CORS_ORIGINS in backend environment
2. **Database connection**: Verify DATABASE_URL format and credentials
3. **404 errors**: Check API_URL in frontend environment
4. **Build failures**: Check Node.js version compatibility
5. **Environment variables**: Ensure all required variables are set

---

## 🚀 Quick Deploy Commands

```bash
# Quick redeploy backend (after code changes)
git push origin main  # Triggers auto-deploy on Render

# Quick redeploy frontend
cd apps/web
vercel --prod

# Run migrations after schema changes
cd apps/api
npm run prisma:migrate
# Or in Render terminal: npm run prisma:migrate

# Check deployment status
render status your-service-name
vercel status your-project-name
```

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review logs in Render and Vercel dashboards
3. Verify all environment variables are set correctly
4. Test API endpoints individually
5. Check Supabase database connection

Remember to update this guide as you customize your deployment process!

---

**🎉 Congratulations!** Your HMS SaaS is now deployed and ready for testing. The staging environment is perfect for testing all features before going to production.