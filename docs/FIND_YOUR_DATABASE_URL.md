# 🔍 Find Your Database Connection String

## You Have a User - Let's Connect to YOUR Database!

Since you mentioned you have a user created, you need to use **your own database connection string**, not the one from the handover document.

---

## Step 1: Log into Your Supabase Account

1. Go to https://supabase.com
2. Log in with your account
3. You should see your project(s)

---

## Step 2: Open Your Project

Click on the project where you created your user (probably named something like "HMS", "Hospital", etc.)

---

## Step 3: Get Connection String

### Option A: Transaction Pooler (Recommended)

1. Click **Settings** (⚙️ gear icon in bottom left)
2. Click **Database** from the left menu
3. Scroll down to **Connection string**
4. Select **Transaction** tab
5. Click the **URI** format
6. Copy the entire connection string

It looks like:
```
postgresql://postgres.[YOUR-REF]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
```

### Option B: Direct Connection

1. Same steps as above
2. But select **Session** tab instead
3. Copy that connection string

It looks like:
```
postgresql://postgres.[YOUR-REF]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:5432/postgres
```

⚠️ **IMPORTANT**: Replace `[YOUR-PASSWORD]` with your actual database password!

---

## Step 4: Update Your .env File

1. Open: `C:\Users\HP\Desktop\HMS\apps\api\.env`
2. Find the line starting with `DATABASE_URL=`
3. Replace it with your copied connection string

Example:
```env
DATABASE_URL=postgresql://postgres.abcdefghijk:MySecurePass123@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

---

## Step 5: Restart Backend

```powershell
# Press Ctrl+C to stop current server, then:
npm run start:dev
```

---

## Alternative: If You Don't Know Your Supabase Account

### Check if there's a different .env file:

```powershell
cd C:\Users\HP\Desktop\HMS
Get-ChildItem -Recurse -Filter ".env*" | Select-Object FullName
```

This will show all .env files. Check if there's another one with the correct database URL.

---

## Still Having Issues?

### Try This Quick Test:

Can you access your Supabase project at all? 

1. Go to https://supabase.com
2. Log in
3. Can you see your project?
4. Can you see the "Table Editor" with your user data?

If YES → Follow steps above to get connection string  
If NO → You might need to create a new Supabase project

---

## Need the Database Password?

If you forgot your database password:

1. Go to your Supabase project
2. Click **Settings** → **Database**
3. Scroll to **Database password**
4. Click **Reset database password**
5. Copy the new password
6. Update your connection string with new password

---

## Quick Commands After Updating .env

```powershell
# 1. Stop current server (Ctrl+C)

# 2. Regenerate Prisma client with new database
cd C:\Users\HP\Desktop\HMS\apps\api
npx prisma generate

# 3. Start server
npm run start:dev
```

---

## What's Happening?

The error "Tenant or user not found" means:
- The connection string in your .env is pointing to someone else's database
- You need to update it to point to YOUR database where your user exists

Once you update the DATABASE_URL to your actual database, everything will work! 🚀
