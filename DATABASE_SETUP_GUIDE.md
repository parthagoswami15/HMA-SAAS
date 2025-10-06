# Database Setup Guide for HMS SaaS Deployment

## Current Deployment Issue

The deployment is failing with:
```
Error: P1001: Can't reach database server at `db.uoxyyqbwuzjraxhaypko.supabase.co:5432`
```

This indicates either:
1. The Supabase database is not accessible
2. The DATABASE_URL environment variable is incorrect or missing
3. The database server is down or has connectivity issues

## Quick Fix Steps

### 1. Check Environment Variables in Render Dashboard

Go to your Render service dashboard and verify these environment variables are set:

**Required Variables:**
```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_ID.supabase.co:5432/postgres
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

### 2. Get Correct Database URL from Supabase

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **Database** 
4. Find **Connection string** and copy the **URI** format:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

### 3. Update Environment Variables

**Option A: Via Render Dashboard**
1. Go to your Render service
2. Click **Environment** tab
3. Update `DATABASE_URL` with the correct Supabase connection string
4. Save and trigger manual deploy

**Option B: Update render-supabase.yaml**
If you're using the yaml file for deployment, ensure the correct variables are set.

### 4. Test Database Connection

Before deployment, test your database connection:

```bash
# Install postgresql client (if not already installed)
npm install -g postgresql

# Test connection (replace with your actual DATABASE_URL)
psql "postgresql://postgres:password@db.your-project-id.supabase.co:5432/postgres" -c "SELECT version();"
```

## Alternative Solutions

### Option 1: Use Render PostgreSQL Database
If Supabase is having connectivity issues, use Render's built-in PostgreSQL:

1. Deploy using `render.yaml` instead of `render-supabase.yaml`
2. This will create a Render PostgreSQL database automatically

### Option 2: Skip Migrations During Build
If database is temporary unavailable, modify the Docker CMD to be more resilient:

```dockerfile
CMD ["dumb-init", "sh", "-c", "cd apps/api && (npx prisma migrate deploy --schema=./prisma/schema.prisma || echo 'Migration failed, starting anyway') && cd ../.. && node apps/api/dist/main.js"]
```

## Troubleshooting Steps

1. **Check Supabase Status**: Visit [Supabase Status Page](https://status.supabase.com/)

2. **Verify Database Credentials**: 
   - Ensure password is correct
   - Check if project is paused/suspended
   - Verify project ID in connection string

3. **Network Issues**: 
   - Try connecting from your local machine
   - Check if IP restrictions are configured

4. **Database Quota**: 
   - Check if you've exceeded connection limits
   - Verify database storage isn't full

## Environment Variable Template

Copy this template to your Render environment variables:

```
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://postgres:YOUR_SUPABASE_PASSWORD@db.YOUR_PROJECT_ID.supabase.co:5432/postgres
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
JWT_SECRET=your-secure-jwt-secret-32-chars-minimum
JWT_ACCESS_SECRET=your-jwt-access-secret
JWT_REFRESH_SECRET=your-jwt-refresh-secret
BCRYPT_SALT_ROUNDS=12
CORS_ORIGINS=https://your-frontend-app.vercel.app
FRONTEND_URL=https://your-frontend-app.vercel.app
```

## Next Steps

1. Fix the DATABASE_URL environment variable
2. Ensure Supabase database is running and accessible  
3. Redeploy the service
4. Monitor deployment logs for successful database connection