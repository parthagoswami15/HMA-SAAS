# Render Environment Variables Setup

## 🎯 **IMMEDIATE FIX NEEDED**

Your deployment is failing because the DATABASE_URL is pointing to:
`db.uoxyyqbwuzjraxhaypko.supabase.co:5432`

But the connection is being refused. Here's how to fix it:

## 🔑 **Required Environment Variables**

Copy these to your Render service **Environment** tab:

```bash
# Database Configuration
DATABASE_URL=postgresql://postgres:[YOUR_SUPABASE_PASSWORD]@db.uoxyyqbwuzjraxhaypko.supabase.co:5432/postgres

# Supabase Configuration  
SUPABASE_URL=https://uoxyyqbwuzjraxhaypko.supabase.co
SUPABASE_ANON_KEY=[GET_FROM_SUPABASE_DASHBOARD]
SUPABASE_SERVICE_ROLE_KEY=[GET_FROM_SUPABASE_DASHBOARD]

# Application Configuration
NODE_ENV=production
PORT=10000
JWT_SECRET=[GENERATE_RANDOM_32_CHAR_STRING]
JWT_ACCESS_SECRET=[GENERATE_RANDOM_32_CHAR_STRING]  
JWT_REFRESH_SECRET=[GENERATE_RANDOM_32_CHAR_STRING]
BCRYPT_SALT_ROUNDS=12

# Optional (adjust as needed)
CORS_ORIGINS=https://your-frontend-url.vercel.app
FRONTEND_URL=https://your-frontend-url.vercel.app
```

## 🚀 **Quick Steps to Fix**

### Option 1: Fix Supabase Connection
1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → Project `uoxyyqbwuzjraxhaypko`
2. Settings → Database → Connection String
3. Copy the URI format connection string
4. Replace `[YOUR_SUPABASE_PASSWORD]` with your actual database password
5. Update `DATABASE_URL` in Render Environment variables
6. Save and redeploy

### Option 2: Use Render PostgreSQL (Simpler)
1. In Render Dashboard, remove/delete the current `DATABASE_URL` 
2. Use `render.yaml` instead of `render-supabase.yaml` for deployment
3. This auto-creates a Render PostgreSQL database
4. No Supabase setup needed

## 🔍 **How to Get Supabase Credentials**

1. **Database Password**: 
   - Go to Supabase → Settings → Database
   - Use the password you set during project creation
   - If forgotten, reset it in Database settings

2. **API Keys**:
   - Go to Supabase → Settings → API
   - Copy `anon/public` key for SUPABASE_ANON_KEY
   - Copy `service_role` key for SUPABASE_SERVICE_ROLE_KEY

## 📝 **Test Database Connection**

Once you update the DATABASE_URL, test it locally:
```bash
# Replace with your actual DATABASE_URL
DATABASE_URL="postgresql://postgres:your-password@db.uoxyyqbwuzjraxhaypko.supabase.co:5432/postgres"

# Test connection
psql "$DATABASE_URL" -c "SELECT version();"
```

## ⚡ **After Setting Environment Variables**

1. Save environment variables in Render
2. Trigger manual redeploy or push a small change to GitHub
3. Monitor deployment logs - you should see:
   ```
   Running database migrations...
   Migrations completed successfully
   Starting Node.js application...
   ```

The deployment should then succeed! 🎉