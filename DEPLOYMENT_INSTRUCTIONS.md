# 🚀 HMS SaaS Deployment Instructions - Fix Database Migration Error

## Problem Summary

Your production deployment on Render is failing with:
```
The column `User.roleId` does not exist in the current database.
```

This is because the RBAC system migrations were never applied to your production Supabase database.

## ✅ Solution Implemented

I've configured your Render deployment to **automatically run database migrations** on every deploy.

## 📋 What Was Changed

### 1. **Package.json** (`apps/api/package.json`)
- Added `prisma:migrate:deploy` script
- Added `deploy:migrate` script for production deployments

### 2. **Dockerfile** (`apps/api/Dockerfile`)
- Modified to include migration script
- Updated CMD to run migrations before starting the app

### 3. **Migration Script** (`apps/api/scripts/migrate-and-start.sh`)
- Created shell script that:
  - Runs `prisma migrate deploy`
  - Starts the NestJS application
  - Includes error handling

### 4. **RBAC Migration** (`apps/api/prisma/migrations/1761280332032_add_rbac_system/`)
- Generated complete RBAC migration SQL
- Creates `permissions`, `tenant_roles`, `role_permissions` tables
- Adds `roleId` column to `User` and `users` tables
- Includes all indexes and foreign keys
- **Idempotent** (safe to run multiple times)

### 5. **Gitignore** (`.gitignore`)
- Updated to allow migration files to be committed
- Previously migrations were ignored, now they're tracked

## 🎯 Next Steps - Deploy to Production

### Step 1: Commit and Push Changes

```bash
# Navigate to your project
cd c:\Users\HP\Desktop\HMS

# Check what changed
git status

# Add all changes
git add .

# Commit with a descriptive message
git commit -m "feat: Add automatic database migrations for Render deployment

- Configure Dockerfile to run migrations on startup
- Add RBAC migration for production database
- Update gitignore to track migration files
- Add migration script for automatic deployment"

# Push to GitHub
git push origin main
```

### Step 2: Verify Render Deployment

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Find your service**: `hms-backend-api` (or whatever you named it)
3. **Watch the deployment logs**:
   - You should see: "📦 Running database migrations..."
   - Then: "✅ Migrations completed successfully"
   - Finally: "🎯 Starting application..."

### Step 3: Verify the Fix

After deployment completes:

1. **Check Render Logs**:
   - Look for migration success messages
   - Ensure no errors about `roleId` column

2. **Test Login**:
   - Go to: https://hms-saas-staging.vercel.app/login
   - Try logging in with your credentials
   - Should work without the 500 error

3. **Check Health Endpoint**:
   - Visit: https://hms-saas-staging.onrender.com/health
   - Should return healthy status

## 🔍 What Happens on Each Deploy

```
1. Render pulls latest code from GitHub
2. Builds Docker image
3. Starts container
4. Container runs migrate-and-start.sh:
   ├─ Runs: npx prisma migrate deploy
   ├─ Applies all pending migrations
   └─ Starts: node apps/api/dist/main.js
5. Application is live with updated database schema
```

## 📊 Migration Details

The RBAC migration will create:

**Tables:**
- `permissions` - Global permission definitions
- `tenant_roles` - Roles per tenant
- `role_permissions` - Many-to-many relationship

**Columns:**
- `User.roleId` - Links users to their role
- `users.role_id` - Same for the users table

**Features:**
- All foreign keys with proper CASCADE/SET NULL
- Indexes for performance
- Idempotent (uses IF NOT EXISTS checks)

## ⚠️ Important Notes

1. **Database Permissions**: Ensure your Supabase user has CREATE/ALTER permissions
2. **Backup**: Render doesn't automatically backup. Consider Supabase's backup features
3. **Rollback**: If something goes wrong, you can rollback the Render deployment
4. **Logs**: Always check Render logs after deployment

## 🐛 Troubleshooting

### If migration fails:

**Check Render Logs:**
```bash
# Look for error messages in the deployment logs
# Common issues:
# - DATABASE_URL not set correctly
# - Database user lacks permissions
# - Network connectivity issues
```

**Manual Migration (Emergency):**
If automatic migration fails, you can run it manually:
1. Go to Render Dashboard → Your Service → Shell
2. Run: `cd /app/apps/api && npx prisma migrate deploy`

### If you still see the roleId error:

1. Check that the migration file was committed to git
2. Verify Render pulled the latest code
3. Check Render logs for migration execution
4. Manually inspect your Supabase database to see if tables exist

## 📞 Support

If you encounter issues:
1. Check Render deployment logs
2. Check Supabase database directly
3. Verify all environment variables are set
4. Ensure DATABASE_URL points to the correct database

## ✨ Success Indicators

You'll know it worked when:
- ✅ Render logs show "Migrations completed successfully"
- ✅ Login works without 500 errors
- ✅ No more "roleId does not exist" errors
- ✅ Health check returns 200 OK

---

**Ready to deploy?** Run the git commands in Step 1 above! 🚀
