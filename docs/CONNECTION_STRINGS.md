# Supabase Connection Strings for Render Deployment

## Option 1: Direct Connection (Port 5432)
```
postgresql://postgres:9800975588pG@db.uoxyyqbwuzjraxhaypko.supabase.co:5432/postgres?sslmode=require&connect_timeout=60
```

## Option 2: Session Mode/Pooler (Port 6543) - Recommended for Production
```
postgresql://postgres:9800975588pG@db.uoxyyqbwuzjraxhaypko.supabase.co:6543/postgres?sslmode=require&connect_timeout=60&pool_timeout=60&statement_timeout=60000&idle_in_transaction_session_timeout=60000
```

## Option 3: Transaction Mode (Port 6543) - For high-traffic apps
```
postgresql://postgres:9800975588pG@db.uoxyyqbwuzjraxhaypko.supabase.co:6543/postgres?sslmode=require&connect_timeout=60&pool_timeout=60&pgbouncer=true
```

## Steps to fix:

1. **Go to your Supabase dashboard**: https://app.supabase.com/projects
2. **Find your project**: uoxyyqbwuzjraxhaypko
3. **Check if database is paused** - if so, unpause it
4. **Go to Settings > Database** and copy the exact connection string
5. **Update the DATABASE_URL in Render** with the working connection string

## Current Issue:
Both port 5432 and 6543 are not responding, which indicates:
- Database might be paused (most likely)
- Database might have been deleted/moved
- Network connectivity issues from your location

## Recommendation:
Use **Option 2 (Session Mode)** as it's more reliable for serverless deployments like Render.