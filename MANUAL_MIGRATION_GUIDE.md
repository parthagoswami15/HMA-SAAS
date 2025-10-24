# 🔧 Manual Migration Guide - Fix Hanging Deployment

## Problem

The automatic migration is hanging because:
1. Using PgBouncer pooler (port 6543) which doesn't support migrations
2. Migration is taking too long and timing out

## ✅ Solution: Run Migration Manually First

### Option 1: Skip Migrations Temporarily (FASTEST)

1. **Add Environment Variable on Render**:
   - Go to Render Dashboard → Your Service → Environment
   - Add: `SKIP_MIGRATIONS` = `true`
   - Save changes
   - This will trigger a new deployment that skips migrations

2. **Run Migration Manually via Render Shell**:
   ```bash
   # Once the app is running, go to Render Dashboard → Shell
   cd /app/apps/api
   
   # Use direct connection (port 5432) for migrations
   DATABASE_URL=$(echo "$DATABASE_URL" | sed 's/:6543/:5432/g')
   DATABASE_URL="${DATABASE_URL}?pgbouncer=false"
   
   # Run migration
   npx prisma migrate deploy
   ```

3. **Remove SKIP_MIGRATIONS**:
   - After migration succeeds, remove the `SKIP_MIGRATIONS` variable
   - Future deployments will run migrations automatically

### Option 2: Run Migration from Your Local Machine

This is the RECOMMENDED approach for the first migration:

1. **Get Your Production DATABASE_URL**:
   - Go to Supabase Dashboard
   - Settings → Database → Connection String → Direct Connection
   - Copy the connection string (should use port 5432, not 6543)

2. **Set Environment Variable Locally**:
   ```bash
   # Windows PowerShell
   $env:DATABASE_URL="your-supabase-direct-connection-string"
   
   # Or create a .env file in apps/api/
   # DATABASE_URL=postgresql://postgres:[PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres
   ```

3. **Run Migration**:
   ```bash
   cd apps/api
   npx prisma migrate deploy
   ```

4. **Verify Migration**:
   ```bash
   # Check if tables were created
   npx prisma studio
   # Or connect to Supabase and check for:
   # - permissions table
   # - tenant_roles table
   # - role_permissions table
   # - User.roleId column
   ```

5. **Deploy Without Migrations**:
   - Add `SKIP_MIGRATIONS=true` to Render
   - Deploy
   - Once app is running, remove `SKIP_MIGRATIONS`

### Option 3: Use Supabase SQL Editor

1. **Go to Supabase Dashboard**:
   - Your Project → SQL Editor

2. **Run the Migration SQL Directly**:
   ```sql
   -- Copy the contents from:
   -- apps/api/prisma/migrations/1761280332032_add_rbac_system/migration.sql
   -- Paste and run in Supabase SQL Editor
   ```

3. **Mark Migration as Applied**:
   ```bash
   # From your local machine or Render shell
   cd apps/api
   npx prisma migrate resolve --applied 1761280332032_add_rbac_system
   ```

## 🎯 Recommended Steps (Quickest Fix)

1. **Right Now - Stop the Failing Deployment**:
   - Go to Render Dashboard
   - Cancel the current deployment if it's still running

2. **Add SKIP_MIGRATIONS**:
   - Environment → Add `SKIP_MIGRATIONS` = `true`
   - Save (this triggers new deployment)

3. **Wait for App to Start**:
   - App should start successfully now (without migrations)
   - Check logs for "Starting application..."

4. **Run Migration from Local Machine**:
   ```bash
   # In your project directory
   cd c:\Users\HP\Desktop\HMS\apps\api
   
   # Set your Supabase direct connection URL
   # Get it from: Supabase → Settings → Database → Connection String → Direct
   $env:DATABASE_URL="postgresql://postgres:[PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"
   
   # Run migration
   npx prisma migrate deploy
   ```

5. **Remove SKIP_MIGRATIONS**:
   - Go back to Render → Environment
   - Delete the `SKIP_MIGRATIONS` variable
   - Save

6. **Test Login**:
   - Try logging in at https://hms-saas-staging.vercel.app/login
   - Should work now!

## 📊 Verify Migration Success

After running the migration, verify it worked:

```sql
-- In Supabase SQL Editor
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('permissions', 'tenant_roles', 'role_permissions');

-- Check if roleId column exists
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name = 'role_id';
```

Should return:
- permissions
- tenant_roles
- role_permissions
- role_id

## 🔄 Future Deployments

After the initial migration is complete:
- Remove `SKIP_MIGRATIONS` from Render
- Future deployments will run migrations automatically
- The script now uses port 5432 (direct connection) for migrations

## ⚠️ Important Notes

- **Always use port 5432 for migrations** (direct connection)
- **Use port 6543 for app runtime** (PgBouncer pooler for better performance)
- The migration script automatically handles this conversion
- First migration should be done manually to avoid timeouts

## 🆘 If Still Having Issues

Check Render logs for specific errors:
- Connection refused → Check DATABASE_URL
- Timeout → Use manual migration approach
- Permission denied → Check Supabase user permissions
