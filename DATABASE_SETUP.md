# 🗄️ Database Setup Guide

## Problem
The database credentials in the handover document have expired or are invalid.

**Error**: `Tenant or user not found`

---

## Solution: Create Your Own Supabase Database

### Step 1: Create Supabase Account

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub, Google, or Email

### Step 2: Create New Project

1. Click "New Project"
2. Fill in:
   - **Name**: HMS-SAAS (or any name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to you (e.g., Mumbai for India)
3. Click "Create new project"
4. Wait 2-3 minutes for database to be provisioned

### Step 3: Get Database URL

1. In your Supabase project dashboard, click **Settings** (gear icon)
2. Click **Database** in the left sidebar
3. Scroll to **Connection string** section
4. Select **Session mode** (for connection pooling)
5. Copy the connection string

It will look like:
```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
```

### Step 4: Update Your .env File

1. Open `C:\Users\HP\Desktop\HMS\apps\api\.env`
2. Replace the DATABASE_URL with your new connection string:

```env
DATABASE_URL=postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1
```

**Important**: Replace `[YOUR-PASSWORD]` with your actual database password!

### Step 5: Run Database Migrations

Open PowerShell and run:

```powershell
cd C:\Users\HP\Desktop\HMS\apps\api
npx prisma migrate dev --name init
```

This will:
- Create all database tables
- Set up the schema
- Generate Prisma client

### Step 6: Start the Server

```powershell
npm run start:dev
```

---

## Alternative: Use SQLite for Local Development

If you don't want to use Supabase, you can use SQLite locally:

### Step 1: Update Prisma Schema

Open `apps/api/prisma/schema.prisma` and change:

```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

### Step 2: Update .env

```env
DATABASE_URL="file:./dev.db"
```

### Step 3: Run Migrations

```powershell
cd C:\Users\HP\Desktop\HMS\apps\api
npx prisma migrate dev --name init
```

---

## Verify Database Connection

After setup, test the connection:

```powershell
cd C:\Users\HP\Desktop\HMS\apps\api
npx prisma studio
```

This opens a database GUI at http://localhost:5555

---

## Quick Fix: Contact Your Friend

The fastest solution is to get updated database credentials from your friend who set up the original database. Ask them for:

1. Updated DATABASE_URL
2. Or access to their Supabase project
3. Or they can share the new connection string

---

## Current Issue Summary

✅ Backend code is complete and compiled successfully  
✅ All 3 new modules (Staff, Laboratory, Pharmacy) are implemented  
✅ Dependencies installed  
❌ Database connection credentials are invalid  

**Next Step**: Set up a new Supabase database OR get updated credentials

---

## Need Help?

The backend is ready to run. Once you have valid database credentials, the application will start successfully and all APIs will work!

For now, you can:
1. Create your own Supabase database (5 minutes)
2. Contact your friend for updated credentials
3. Use SQLite for local testing
