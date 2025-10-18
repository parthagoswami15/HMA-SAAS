# 🚀 HMS Setup Guide - Supabase + Local Development

## 📋 Overview

**What we're doing:**
- ✅ Database: Supabase (Cloud PostgreSQL) - FREE tier
- ✅ Backend: Running locally (localhost:3001)
- ✅ Frontend: Running locally (localhost:3000 or 4200)
- 🔜 Later: Deploy backend to Render, frontend to Vercel

**Time Required:** 45 minutes  
**Prerequisites:** Node.js installed, Internet connection

---

## 📑 Table of Contents

1. [Supabase Setup (10 min)](#step-1-supabase-setup)
2. [Get Database Credentials (2 min)](#step-2-get-database-credentials)
3. [Install Dependencies (5 min)](#step-3-install-dependencies)
4. [Configure Environment (3 min)](#step-4-configure-environment)
5. [Update App Module (2 min)](#step-5-update-app-module)
6. [Add Package Scripts (2 min)](#step-6-add-package-scripts)
7. [Generate Migration (5 min)](#step-7-generate-migration)
8. [Run Migration (2 min)](#step-8-run-migration)
9. [Seed Database (3 min)](#step-9-seed-database)
10. [Start Backend (2 min)](#step-10-start-backend)
11. [Test API (5 min)](#step-11-test-api)
12. [Verify in Supabase (2 min)](#step-12-verify-in-supabase)
13. [Test Frontend Connection (5 min)](#step-13-test-frontend-connection)

---

## Step 1: Supabase Setup (10 min)

### 1.1 Create Supabase Account

1. Go to **https://supabase.com**
2. Click **"Start your project"**
3. Sign up with:
   - GitHub (recommended)
   - OR Email

### 1.2 Create New Project

1. After login, click **"New Project"**
2. Fill in details:
   - **Organization**: Create new or select existing
   - **Project Name**: `hms-database` (or any name you like)
   - **Database Password**: Create a STRONG password
     - Example: `HMS@Secure2025!Database`
     - **⚠️ IMPORTANT**: Copy this password immediately! You'll need it.
   - **Region**: Choose closest to you
     - Africa: Cape Town
     - Asia: Singapore, Mumbai, Seoul, Tokyo
     - Europe: Frankfurt, London
     - US: East (Virginia), West (Oregon)
   - **Pricing Plan**: Free (0$/month)

3. Click **"Create new project"**
4. Wait 2-3 minutes for project to initialize

### 1.3 Wait for Database Ready

You'll see a progress indicator. Wait until you see:
- ✅ "Project is ready"
- Green checkmark next to project name

---

## Step 2: Get Database Credentials (2 min)

### 2.1 Navigate to Database Settings

1. In Supabase dashboard, click **"Settings"** (bottom left, gear icon)
2. Click **"Database"** in the left menu

### 2.2 Copy Connection Info

Scroll to **"Connection info"** section. You'll see:

```
Host: db.xxxxxxxxx.supabase.co
Database name: postgres
Port: 5432
User: postgres
Password: [hidden] (the password you set)
```

### 2.3 Get Direct Connection String

Scroll to **"Connection string"** section:

1. Click **"URI"** tab
2. You'll see something like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxx.supabase.co:5432/postgres
   ```
3. Copy this ENTIRE string
4. **Replace `[YOUR-PASSWORD]`** with the actual password you set

**Example:**
```
postgresql://postgres:HMS@Secure2025!Database@db.abcdefgh.supabase.co:5432/postgres
```

**⚠️ IMPORTANT:** Save this in a secure place (Notepad, password manager)

---

## Step 3: Install Dependencies (5 min)

### 3.1 Open Terminal

1. Press `Windows + X`
2. Select **"Windows PowerShell"** or **"Terminal"**
3. Navigate to your project:

```powershell
cd C:\Users\HP\Desktop\HMS\apps\api
```

### 3.2 Install Required Packages

Copy and paste this entire command:

```powershell
npm install --save @nestjs/typeorm typeorm pg dotenv bcrypt @nestjs/config @nestjs/jwt @nestjs/passport passport passport-jwt class-validator class-transformer
```

**This installs:**
- `@nestjs/typeorm` - TypeORM integration for NestJS
- `typeorm` - ORM for database operations
- `pg` - PostgreSQL driver
- `dotenv` - Environment variable management
- `bcrypt` - Password hashing
- `@nestjs/config` - Configuration module
- `@nestjs/jwt` - JWT authentication
- `@nestjs/passport` - Passport integration
- `passport-jwt` - JWT strategy
- `class-validator` - DTO validation
- `class-transformer` - Object transformation

### 3.3 Install Dev Dependencies

```powershell
npm install --save-dev @types/node @types/bcrypt @types/passport-jwt ts-node
```

**This installs:**
- TypeScript type definitions
- `ts-node` - TypeScript execution for scripts

### 3.4 Verify Installation

```powershell
npm list typeorm pg
```

**Expected output:**
```
├── pg@8.x.x
└── typeorm@0.3.x
```

**⏱️ Time:** 3-5 minutes (depending on internet speed)

---

## Step 4: Configure Environment (3 min)

### 4.1 Locate .env File

```powershell
# Check if .env exists
Test-Path .env

# If False, create it
New-Item .env -ItemType File
```

### 4.2 Open .env File

```powershell
notepad .env
```

### 4.3 Add/Update Configuration

**IMPORTANT:** Keep EXISTING variables, just ADD these new ones:

```env
# ============================================
# EXISTING VARIABLES (Keep these as they are)
# ============================================
NODE_ENV=development
PORT=3001
DATABASE_URL=your-existing-prisma-url
CORS_ORIGIN=http://localhost:3000

# ============================================
# NEW: TypeORM/Supabase Configuration
# ============================================
# Replace with YOUR Supabase credentials from Step 2

DATABASE_HOST=db.xxxxxxxxx.supabase.co
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=YOUR_SUPABASE_PASSWORD_HERE
DATABASE_NAME=postgres
DATABASE_SYNCHRONIZE=false
DATABASE_LOGGING=true
DATABASE_SSL=true

# ============================================
# NEW: JWT Configuration (REQUIRED)
# ============================================
# Generate random strings (32+ characters each)
# You can use: https://randomkeygen.com/ (CodeIgniter Encryption Keys)

JWT_ACCESS_TOKEN_SECRET=your-super-secret-access-token-min-32-chars-change-this-random-string
JWT_REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-min-32-chars-change-this-random-string
JWT_ACCESS_TOKEN_EXPIRY=15m
JWT_REFRESH_TOKEN_EXPIRY=7d

# ============================================
# Optional: Email Configuration (for later)
# ============================================
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASSWORD=your-app-password
```

### 4.4 Replace Placeholders

**Example filled out:**

```env
DATABASE_HOST=db.abcdefghijklmn.supabase.co
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=HMS@Secure2025!Database
DATABASE_NAME=postgres
DATABASE_SYNCHRONIZE=false
DATABASE_LOGGING=true
DATABASE_SSL=true

JWT_ACCESS_TOKEN_SECRET=k7Bm9Qp3Xz5Wc8Nf2Lj6Vr4Hy1Td0Sg9Ae
JWT_REFRESH_TOKEN_SECRET=Ux3Zq7Mp5Kw9Rt2Fn6Jc8Vb4Lh1Dn0Yg3Ps
JWT_ACCESS_TOKEN_EXPIRY=15m
JWT_REFRESH_TOKEN_EXPIRY=7d
```

### 4.5 Save and Close

- Press `Ctrl + S` to save
- Close Notepad

### 4.6 Verify Configuration

```powershell
# Check if file contains required variables
Select-String -Path .env -Pattern "DATABASE_HOST"
Select-String -Path .env -Pattern "JWT_ACCESS_TOKEN_SECRET"
```

**Expected:** Should show the lines with your values

---

## Step 5: Update App Module (2 min)

### 5.1 Backup Current Module

```powershell
# Still in C:\Users\HP\Desktop\HMS\apps\api
Copy-Item src/app.module.ts src/app.module.backup.ts
```

### 5.2 Use New Module

```powershell
Copy-Item src/app.module.new.ts src/app.module.ts -Force
```

### 5.3 Verify

```powershell
# Check if file was copied
Get-Content src/app.module.ts | Select-String "CoreModule"
```

**Expected output:** Should show line with `CoreModule`

---

## Step 6: Add Package Scripts (2 min)

### 6.1 Open package.json

```powershell
notepad package.json
```

### 6.2 Find "scripts" Section

Look for:
```json
{
  "name": "api",
  "version": "1.0.0",
  "scripts": {
    "start": "...",
    "start:dev": "...",
    // ... existing scripts
  }
}
```

### 6.3 Add Migration Scripts

**ADD these lines** inside the `"scripts"` object (after existing scripts):

```json
{
  "scripts": {
    // ... existing scripts (keep all of these) ...
    
    "typeorm": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js",
    "migration:generate": "npm run typeorm -- migration:generate -d src/data-source.ts",
    "migration:run": "npm run typeorm -- migration:run -d src/data-source.ts",
    "migration:revert": "npm run typeorm -- migration:revert -d src/data-source.ts",
    "migration:show": "npm run typeorm -- migration:show -d src/data-source.ts",
    "seed": "ts-node -r tsconfig-paths/register src/database/seeds/initial-seed.ts"
  }
}
```

**⚠️ IMPORTANT:** Make sure:
- Each line (except the last one) ends with a comma
- JSON syntax is valid (no extra/missing commas)

### 6.4 Save and Close

- Press `Ctrl + S`
- Close Notepad

### 6.5 Verify

```powershell
npm run typeorm -- --version
```

**Expected:** Shows TypeORM version (e.g., `0.3.17`)

---

## Step 7: Generate Migration (5 min)

### 7.1 Generate Migration File

```powershell
npm run typeorm migration:generate -- src/migrations/InitialSchema
```

**What happens:**
- TypeORM reads your entities (User, Tenant, AuditLog)
- Compares with database (empty)
- Generates SQL migration file

**⏱️ Time:** 30-60 seconds

### 7.2 Expected Output

```
Migration C:/Users/HP/Desktop/HMS/apps/api/src/migrations/1234567890123-InitialSchema.ts has been generated successfully.
```

### 7.3 Verify Migration File Created

```powershell
Get-ChildItem src/migrations/
```

**Expected:** You should see a file like:
```
1234567890123-InitialSchema.ts
```

### 7.4 (Optional) Preview Migration

```powershell
Get-Content src/migrations/*InitialSchema.ts | Select-Object -First 50
```

**You should see SQL commands like:**
```typescript
CREATE TABLE "tenants" (
  "id" uuid PRIMARY KEY,
  "name" varchar(255),
  ...
)
```

**⚠️ If you see errors:**
- Check .env has correct database credentials
- Make sure all entities are properly defined
- Check TypeScript compilation: `npm run build`

---

## Step 8: Run Migration (2 min)

### 8.1 Apply Migration to Supabase

```powershell
npm run migration:run
```

**What happens:**
- Connects to Supabase PostgreSQL
- Creates tables: `tenants`, `users`, `audit_logs`
- Adds indexes and constraints

**⏱️ Time:** 10-20 seconds

### 8.2 Expected Output

```
query: SELECT * FROM "information_schema"."tables" WHERE "table_schema" = current_schema()...
query: CREATE TABLE "migrations" ...
query: CREATE TABLE "tenants" ...
query: CREATE TABLE "users" ...
query: CREATE TABLE "audit_logs" ...
Migration InitialSchema1234567890123 has been executed successfully.
```

### 8.3 Verify Migration Status

```powershell
npm run migration:show
```

**Expected output:**
```
 [X] InitialSchema1234567890123
```

**✅ Success:** The [X] means migration ran successfully

**❌ If you see errors:**
- "password authentication failed" → Check DATABASE_PASSWORD in .env
- "could not connect" → Check DATABASE_HOST in .env
- "database does not exist" → Should use `postgres` as DATABASE_NAME

---

## Step 9: Seed Database (3 min)

### 9.1 Run Seed Script

```powershell
npm run seed
```

**What happens:**
- Creates 2 tenants:
  - Platform Admin
  - Demo Hospital
- Creates 5 users:
  - Super Admin
  - Hospital Admin
  - Doctor
  - Nurse
  - Patient

**⏱️ Time:** 30-60 seconds

### 9.2 Expected Output

```
🌱 Starting database seed...
✅ Data source initialized

Creating super admin tenant...
✅ Super admin tenant created

Creating super admin user...
✅ Super admin user created
   Email: admin@hms.com
   Password: Admin@123!

Creating demo hospital tenant...
✅ Demo hospital tenant created

Creating demo tenant admin...
✅ Demo tenant admin created
   Email: admin@demo-hospital.com
   Password: Demo@123!

Creating demo doctor...
✅ Demo doctor created
   Email: doctor@demo-hospital.com
   Password: Doctor@123!

Creating demo nurse...
✅ Demo nurse created
   Email: nurse@demo-hospital.com
   Password: Nurse@123!

Creating demo patient...
✅ Demo patient created
   Email: patient@demo-hospital.com
   Password: Patient@123!

✅ Seed completed successfully!

============================================================
DEMO ACCOUNTS CREATED:
============================================================

🔐 Super Admin (Platform):
   Email: admin@hms.com
   Password: Admin@123!
   Role: SUPER_ADMIN

🏥 Demo Hospital Admin:
   Email: admin@demo-hospital.com
   Password: Demo@123!
   Role: TENANT_ADMIN

👨‍⚕️ Demo Doctor:
   Email: doctor@demo-hospital.com
   Password: Doctor@123!
   Role: DOCTOR

👩‍⚕️ Demo Nurse:
   Email: nurse@demo-hospital.com
   Password: Nurse@123!
   Role: NURSE

🤒 Demo Patient:
   Email: patient@demo-hospital.com
   Password: Patient@123!
   Role: PATIENT

============================================================
✅ Seed script completed
```

### 9.3 Copy Demo Credentials

**⚠️ IMPORTANT:** Save these credentials for testing:

```
Super Admin:
Email: admin@hms.com
Password: Admin@123!

Hospital Admin:
Email: admin@demo-hospital.com
Password: Demo@123!

Doctor:
Email: doctor@demo-hospital.com
Password: Doctor@123!

Nurse:
Email: nurse@demo-hospital.com
Password: Nurse@123!

Patient:
Email: patient@demo-hospital.com
Password: Patient@123!
```

**📝 Pro Tip:** Create a file `DEMO_ACCOUNTS.txt` with these credentials

---

## Step 10: Start Backend (2 min)

### 10.1 Start Development Server

```powershell
npm run start:dev
```

**What happens:**
- NestJS compiles TypeScript
- Connects to Supabase database
- Starts server on port 3001

**⏱️ Time:** 30-60 seconds (first time), 5-10 seconds (subsequent starts)

### 10.2 Expected Output

```
[Nest] 12345  - 01/17/2025, 3:00:00 AM     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 01/17/2025, 3:00:01 AM     LOG [InstanceLoader] ConfigHostModule dependencies initialized
[Nest] 12345  - 01/17/2025, 3:00:01 AM     LOG [InstanceLoader] TypeOrmModule dependencies initialized
[Nest] 12345  - 01/17/2025, 3:00:01 AM     LOG [InstanceLoader] CoreModule dependencies initialized
[Nest] 12345  - 01/17/2025, 3:00:01 AM     LOG [InstanceLoader] AuthModule dependencies initialized
[Nest] 12345  - 01/17/2025, 3:00:01 AM     LOG [InstanceLoader] TenantModule dependencies initialized
[Nest] 12345  - 01/17/2025, 3:00:01 AM     LOG [InstanceLoader] AuditModule dependencies initialized
[Nest] 12345  - 01/17/2025, 3:00:02 AM     LOG [RoutesResolver] AuthController {/auth}:
[Nest] 12345  - 01/17/2025, 3:00:02 AM     LOG [RouterExplorer] Mapped {/auth/login, POST} route
[Nest] 12345  - 01/17/2025, 3:00:02 AM     LOG [RouterExplorer] Mapped {/auth/register, POST} route
[Nest] 12345  - 01/17/2025, 3:00:02 AM     LOG [RouterExplorer] Mapped {/auth/me, GET} route
[Nest] 12345  - 01/17/2025, 3:00:02 AM     LOG [RoutesResolver] TenantController {/tenants}:
[Nest] 12345  - 01/17/2025, 3:00:02 AM     LOG [RouterExplorer] Mapped {/tenants, POST} route
[Nest] 12345  - 01/17/2025, 3:00:02 AM     LOG [RouterExplorer] Mapped {/tenants, GET} route
[Nest] 12345  - 01/17/2025, 3:00:02 AM     LOG [RoutesResolver] AuditController {/audit}:
[Nest] 12345  - 01/17/2025, 3:00:02 AM     LOG [RouterExplorer] Mapped {/audit/logs, GET} route
[Nest] 12345  - 01/17/2025, 3:00:02 AM     LOG [NestApplication] Nest application successfully started
[Nest] 12345  - 01/17/2025, 3:00:02 AM     LOG Application is running on: http://localhost:3001
```

### 10.3 Verify Server Running

**✅ Success indicators:**
- "Application is running on: http://localhost:3001"
- No error messages
- Terminal stays active (doesn't exit)

**❌ If you see errors:**
- "EADDRINUSE" → Port 3001 is in use. Close other apps or change PORT in .env
- "password authentication failed" → Check DATABASE_PASSWORD in .env
- "Module not found" → Run `npm install` again

### 10.4 Keep Terminal Open

**⚠️ IMPORTANT:** Keep this terminal window open. The server needs to run.

For next steps, open a **NEW terminal window** (don't close this one!)

---

## Step 11: Test API (5 min)

### 11.1 Open New Terminal

- Press `Windows + X`
- Select **"Windows PowerShell"** (new window)
- Navigate to project:

```powershell
cd C:\Users\HP\Desktop\HMS\apps\api
```

### 11.2 Test 1: Health Check

```powershell
curl http://localhost:3001
```

**Expected:** Some response (might be HTML or JSON)

### 11.3 Test 2: Login as Super Admin

```powershell
$body = @{
    email = "admin@hms.com"
    password = "Admin@123!"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3001/auth/login" -Method Post -ContentType "application/json" -Body $body

# Display response
$response

# Save token for next tests
$token = $response.tokens.accessToken
Write-Host "`n✅ Login successful! Access token saved.`n"
```

**Expected output:**
```json
{
  "user": {
    "id": "some-uuid",
    "email": "admin@hms.com",
    "role": "SUPER_ADMIN",
    "firstName": "Super",
    "lastName": "Admin",
    ...
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900
  }
}

✅ Login successful! Access token saved.
```

### 11.4 Test 3: Get Current User

```powershell
$headers = @{
    Authorization = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:3001/auth/me" -Method Get -Headers $headers
```

**Expected output:**
```json
{
  "user": {
    "sub": "some-uuid",
    "email": "admin@hms.com",
    "role": "SUPER_ADMIN",
    "tenantId": "some-uuid",
    "permissions": ["ALL"]
  }
}
```

### 11.5 Test 4: List Tenants

```powershell
Invoke-RestMethod -Uri "http://localhost:3001/tenants" -Method Get -Headers $headers
```

**Expected output:**
```json
{
  "data": [
    {
      "id": "uuid-1",
      "name": "Platform Administration",
      "slug": "platform-admin",
      "status": "active",
      ...
    },
    {
      "id": "uuid-2",
      "name": "Demo Hospital",
      "slug": "demo-hospital",
      "status": "trial",
      ...
    }
  ],
  "total": 2
}
```

### 11.6 Test 5: Login as Doctor

```powershell
$doctorBody = @{
    email = "doctor@demo-hospital.com"
    password = "Doctor@123!"
} | ConvertTo-Json

$doctorResponse = Invoke-RestMethod -Uri "http://localhost:3001/auth/login" -Method Post -ContentType "application/json" -Body $doctorBody

Write-Host "Doctor logged in! Role: $($doctorResponse.user.role)"
```

**Expected output:**
```
Doctor logged in! Role: DOCTOR
```

### 11.7 Success Checklist

✅ All 5 tests passed:
- [ ] Server responds to requests
- [ ] Can login with super admin
- [ ] Token is generated
- [ ] Can access protected route with token
- [ ] Can list tenants
- [ ] Can login with other roles

---

## Step 12: Verify in Supabase (2 min)

### 12.1 Open Supabase Dashboard

1. Go to **https://app.supabase.com**
2. Select your **hms-database** project

### 12.2 View Tables

1. Click **"Table Editor"** in left menu
2. You should see tables:
   - `migrations`
   - `tenants`
   - `users`
   - `audit_logs`

### 12.3 Check Data

1. Click **`tenants`** table
   - Should see 2 rows (Platform Admin, Demo Hospital)

2. Click **`users`** table
   - Should see 5 rows (Super Admin, Hospital Admin, Doctor, Nurse, Patient)

3. Click **`audit_logs`** table
   - Should see login events from your tests

### 12.4 Run SQL Query (Optional)

1. Click **"SQL Editor"** in left menu
2. Click **"New query"**
3. Paste and run:

```sql
SELECT 
  u.email, 
  u.role, 
  t.name as tenant_name
FROM users u
JOIN tenants t ON u.tenant_id = t.id
ORDER BY u.role;
```

**Expected:** Shows all users with their roles and tenant names

---

## Step 13: Test Frontend Connection (5 min)

### 13.1 Update Frontend Environment

Navigate to frontend directory:

```powershell
cd C:\Users\HP\Desktop\HMS\apps\web
# OR if using Angular:
# cd C:\Users\HP\Desktop\HMS\apps\angular-app
```

### 13.2 Create/Update Environment File

**For React/Next.js (apps/web/.env.local):**

```powershell
notepad .env.local
```

Add:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
# OR for React:
REACT_APP_API_URL=http://localhost:3001
```

**For Angular (apps/angular-app/src/environments/environment.ts):**

```powershell
notepad src/environments/environment.ts
```

Update:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3001'
};
```

### 13.3 Start Frontend

```powershell
npm run dev
# OR for Angular:
# npm run start
```

### 13.4 Test Login from Frontend

1. Open browser: **http://localhost:3000** (or 4200 for Angular)
2. Navigate to login page
3. Login with:
   - Email: `admin@hms.com`
   - Password: `Admin@123!`
4. Should successfully authenticate!

---

## ✅ Verification Checklist

After completing all steps, verify:

- [x] **Supabase project created**
- [x] **Database credentials obtained**
- [x] **Dependencies installed**
- [x] **Environment configured (.env)**
- [x] **App module updated**
- [x] **Package scripts added**
- [x] **Migration generated**
- [x] **Migration ran successfully**
- [x] **Database seeded (5 accounts)**
- [x] **Backend running on localhost:3001**
- [x] **Can login via API**
- [x] **Can access protected routes**
- [x] **Data visible in Supabase**
- [x] **Frontend can connect to backend**

---

## 🎉 Success! What You Have Now

✅ **Cloud Database**: Supabase PostgreSQL with 3 tables  
✅ **Backend API**: Running locally on port 3001  
✅ **28 Endpoints**: All working with RBAC protection  
✅ **5 Demo Accounts**: Ready for testing all roles  
✅ **Frontend Ready**: Can connect and authenticate  
✅ **Production Path**: Easy to deploy to Render/Vercel later  

---

## 🚀 Next Steps

### Immediate
1. ✅ Test all 28 endpoints with Postman
2. ✅ Test different user roles
3. ✅ Verify RBAC protection works
4. ✅ Check audit logs in Supabase

### Soon
5. ✅ Build Patient Management module
6. ✅ Add more application modules
7. ✅ Connect frontend fully

### Later (Deployment)
8. ✅ Deploy backend to Render
9. ✅ Deploy frontend to Vercel
10. ✅ Update environment variables for production

---

## 🆘 Troubleshooting

### Issue: Can't connect to Supabase

**Check:**
```powershell
# Test connection with psql (if installed)
$env:PGPASSWORD="YOUR_PASSWORD"
psql -h db.xxxxxxxxx.supabase.co -U postgres -d postgres -c "SELECT version();"
```

**OR use Supabase SQL Editor:**
1. Go to Supabase dashboard
2. SQL Editor → New query
3. Run: `SELECT version();`

### Issue: Migration fails

```powershell
# Check current migrations
npm run migration:show

# If needed, revert
npm run migration:revert

# Fix entities, then regenerate
npm run migration:generate -- src/migrations/InitialSchema

# Run again
npm run migration:run
```

### Issue: "password authentication failed"

**Solution:**
1. Go to Supabase dashboard
2. Settings → Database → Reset database password
3. Update DATABASE_PASSWORD in .env
4. Try again

### Issue: Port 3001 already in use

```powershell
# Find process using port
netstat -ano | findstr :3001

# Kill process (replace PID with actual number)
taskkill /PID <PID> /F

# OR change port in .env
# PORT=3002
```

### Issue: Seed script fails

**Make sure:**
- Migration ran first: `npm run migration:show` shows [X]
- Database credentials are correct
- Tables exist in Supabase (check Table Editor)

**To re-run seed:**
```powershell
# Seed is idempotent - safe to run multiple times
npm run seed
```

---

## 📝 Demo Accounts Reference

| Role | Email | Password | Access |
|------|-------|----------|--------|
| Super Admin | admin@hms.com | Admin@123! | All tenants, all permissions |
| Tenant Admin | admin@demo-hospital.com | Demo@123! | Demo Hospital management |
| Doctor | doctor@demo-hospital.com | Doctor@123! | Clinical access |
| Nurse | nurse@demo-hospital.com | Nurse@123! | Patient care |
| Patient | patient@demo-hospital.com | Patient@123! | Self-service portal |

---

## 💡 Pro Tips

1. **Supabase Dashboard**: Bookmark it - you'll use it often to check data
2. **Keep .env Secure**: Never commit to git (add to .gitignore)
3. **Monitor Supabase Usage**: Free tier has limits (check dashboard)
4. **Database Backups**: Supabase auto-backs up (Settings → Database → Backups)
5. **API Logs**: Check terminal for all requests/errors
6. **Postman**: Better than curl for testing - import API_ENDPOINTS.md

---

## 🔗 Useful Links

- **Supabase Dashboard**: https://app.supabase.com
- **Your API**: http://localhost:3001
- **API Docs**: See `API_ENDPOINTS.md`
- **Supabase Docs**: https://supabase.com/docs

---

## 📊 What's Running Where

```
┌─────────────────────────────────────┐
│  DATABASE (Supabase - Cloud)        │
│  ✅ PostgreSQL                       │
│  ✅ 3 tables (tenants, users, logs) │
│  ✅ 5 demo accounts                 │
└─────────────────────────────────────┘
              ↕ (SSL Connection)
┌─────────────────────────────────────┐
│  BACKEND (Local - localhost:3001)   │
│  ✅ NestJS API                       │
│  ✅ 28 endpoints                     │
│  ✅ RBAC protection                  │
│  ✅ Audit logging                    │
└─────────────────────────────────────┘
              ↕ (HTTP)
┌─────────────────────────────────────┐
│  FRONTEND (Local - localhost:3000)  │
│  ✅ React/Angular                    │
│  ✅ Role-based UI                    │
│  ✅ JWT authentication              │
└─────────────────────────────────────┘
```

---

**Total Time**: ~45 minutes  
**Result**: Fully functional HMS with cloud database!  
**Status**: Ready for development & testing  
**Next**: Build application modules or deploy to production

🎉 **Congratulations! Your HMS is now running!** 🚀
