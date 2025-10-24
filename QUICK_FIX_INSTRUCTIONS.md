# 🚨 QUICK FIX - Deployment Hanging on Migration

## What's Happening

Your Render deployment is **hanging during database migration** because:
- Using PgBouncer pooler (port 6543) which doesn't support migrations
- Need to use direct connection (port 5432) instead

## ✅ FASTEST FIX (5 minutes)

### Step 1: Stop Current Deployment & Skip Migrations

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Find your service**: `hms-backend-api`
3. **Cancel the current deployment** (if still running)
4. **Go to Environment tab**
5. **Add new environment variable**:
   - Key: `SKIP_MIGRATIONS`
   - Value: `true`
6. **Click "Save Changes"** - This will trigger a new deployment

### Step 2: Wait for App to Start

- Watch the logs
- Should see: "⏭️ Skipping migrations (SKIP_MIGRATIONS=true)"
- Then: "🎯 Starting application..."
- App should start successfully in ~2 minutes

### Step 3: Run Migration from Your Local Machine

```powershell
# Open PowerShell in your project directory
cd c:\Users\HP\Desktop\HMS\apps\api

# Get your Supabase DIRECT connection string
# Go to: Supabase Dashboard → Settings → Database → Connection String
# Select "Direct connection" (NOT "Connection pooling")
# It should have port 5432, not 6543

# Set the environment variable (replace with your actual connection string)
$env:DATABASE_URL="postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"

# Run the migration
npx prisma migrate deploy
```

### Step 4: Remove SKIP_MIGRATIONS

1. **Go back to Render Dashboard** → Environment
2. **Delete the `SKIP_MIGRATIONS` variable**
3. **Save** (this will redeploy)

### Step 5: Test Login

- Go to: https://hms-saas-staging.vercel.app/login
- Try logging in
- Should work! ✅

## 📝 What Changed in the Code

I've updated the migration script to:
1. **Automatically convert port 6543 → 5432** for migrations
2. **Add `SKIP_MIGRATIONS` option** for manual control
3. **Not fail the deployment** if migration fails (just warns)

## 🔄 Commit These Changes

After the manual migration works:

```bash
cd c:\Users\HP\Desktop\HMS

git add .
git commit -m "fix: Update migration script to use direct connection (port 5432)

- Convert PgBouncer pooler port to direct connection for migrations
- Add SKIP_MIGRATIONS environment variable option
- Don't fail deployment if migration fails
- Add manual migration guides"

git push origin main
```

## 🎯 Summary

**Right Now:**
1. Add `SKIP_MIGRATIONS=true` to Render → Deploy succeeds
2. Run `npx prisma migrate deploy` from your local machine
3. Remove `SKIP_MIGRATIONS` from Render
4. Test login → Should work!

**Future Deployments:**
- Migrations will run automatically
- Script uses port 5432 for migrations
- Uses port 6543 for app runtime

## 🆘 Need Your Supabase Connection String?

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Settings → Database
4. Connection String → **Direct connection** (not pooling)
5. Copy the string (should have `:5432`)
6. Replace `[YOUR-PASSWORD]` with your actual database password

---

**Questions?** Check `MANUAL_MIGRATION_GUIDE.md` for more detailed options.
