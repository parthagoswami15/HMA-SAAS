# 🚀 Quick Deploy Guide

**Time to deploy: ~15 minutes**

This is a condensed version of the full deployment guide. Follow these steps for rapid deployment to staging.

## ✅ Prerequisites Check

Make sure you have:
- [ ] GitHub/GitLab repository with your code
- [ ] Node.js 18+ installed locally
- [ ] Accounts on Supabase, Render, and Vercel

---

## 🎯 1-Minute Setup Commands

```bash
# 1. Clone/navigate to your project
cd your-hms-project

# 2. Install dependencies
npm install

# 3. Run pre-deployment check
node scripts/deploy.js check
```

---

## ⚡ Supabase Setup (3 minutes)

1. **Create Project**: Go to [supabase.com](https://supabase.com) → New Project
2. **Get Credentials**: Settings → API → Copy Project URL, Anon Key, Service Role Key
3. **Database URL**: Settings → Database → Copy connection string

**Quick Test:**
```bash
cd apps/api
cp .env.example .env
# Edit .env with your Supabase credentials
npm run prisma:generate
npm run prisma:migrate
```

---

## 🔥 Render Backend Deploy (5 minutes)

1. **Go to**: [render.com](https://render.com) → New Web Service
2. **Connect**: Your GitHub repo
3. **Configure**:
   - **Runtime**: Docker
   - **Dockerfile**: `./apps/api/Dockerfile`
   - **Docker Context**: `.`
   - **Health Check**: `/health`

4. **Environment Variables** (Copy-paste these):
```bash
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_ID.supabase.co:5432/postgres
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_64_char_secret_here
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
BCRYPT_SALT_ROUNDS=12
CORS_ORIGINS=http://localhost:3000
FRONTEND_URL=https://your-app.vercel.app
APP_NAME=HMS SaaS
LOG_LEVEL=info
SWAGGER_ENABLED=true
```

5. **Deploy**: Click "Create Web Service"

**Your backend URL**: `https://your-service-name.onrender.com`

---

## ⚡ Vercel Frontend Deploy (3 minutes)

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend
cd apps/web

# Deploy
vercel login
vercel

# Set environment variables in Vercel dashboard:
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_APP_ENV=production

# Deploy to production
vercel --prod
```

**Your frontend URL**: `https://your-app.vercel.app`

---

## 🔗 Link Everything (2 minutes)

1. **Update Backend CORS** (in Render dashboard):
```bash
CORS_ORIGINS=https://your-app.vercel.app,http://localhost:3000
FRONTEND_URL=https://your-app.vercel.app
```

2. **Update Supabase Auth** (in Supabase dashboard):
- Authentication → Settings
- Site URL: `https://your-app.vercel.app`

---

## 🧪 Test Everything (2 minutes)

```bash
# Test backend
curl https://your-backend.onrender.com/health

# Test frontend
open https://your-app.vercel.app

# Test registration flow
# Go to your frontend → Register → Login
```

---

## 🎯 Automation Script

Use our deployment helper:

```bash
# Validate everything is ready
node scripts/deploy.js validate

# Auto-deploy to staging
node scripts/deploy.js deploy staging

# Check deployment status
node scripts/deploy.js check
```

---

## 🆘 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| **Backend 404** | Check Dockerfile path and context |
| **CORS errors** | Update CORS_ORIGINS with your Vercel URL |
| **DB connection failed** | Verify DATABASE_URL format and credentials |
| **Frontend build failed** | Check NEXT_PUBLIC_* environment variables |
| **Auth not working** | Verify Supabase keys and Site URL |

---

## 📋 Environment Variables Checklist

### Backend (Render)
- [ ] `DATABASE_URL`
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `JWT_SECRET`
- [ ] `CORS_ORIGINS`
- [ ] `FRONTEND_URL`

### Frontend (Vercel)
- [ ] `NEXT_PUBLIC_API_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 🎉 Success Checklist

- [ ] Backend health check returns 200
- [ ] Frontend loads without errors
- [ ] User registration works
- [ ] User login works
- [ ] API documentation accessible at `/api-docs`
- [ ] Database migrations completed successfully

---

**🚀 Your HMS SaaS is now live!**

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.onrender.com`
- **API Docs**: `https://your-backend.onrender.com/api-docs`

For production deployment or detailed customization, see the full [DEPLOYMENT.md](./DEPLOYMENT.md) guide.