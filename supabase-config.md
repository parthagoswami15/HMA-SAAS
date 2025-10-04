# Supabase Configuration for HMS

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Choose a database password
4. Wait for project to be ready

## 2. Get Your Supabase Credentials

From your Supabase project dashboard:
- **Project URL**: https://your-project-id.supabase.co
- **Anon Key**: Found in Settings > API
- **Service Role Key**: Found in Settings > API
- **Database URL**: Found in Settings > Database

## 3. Database Schema Migration

Your Prisma schema will be automatically applied to Supabase Postgres.

## 4. Authentication Setup

Supabase provides built-in authentication. Configure:

### Email Authentication
```sql
-- Enable email auth in Supabase Dashboard > Authentication > Settings
-- Or run this SQL in Supabase SQL Editor:

-- Enable RLS (Row Level Security)
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for user data access
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);
```

## 5. Environment Variables for Applications

### Backend (.env)
```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:your-db-password@db.your-project-id.supabase.co:5432/postgres
```

### Frontend (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 6. Testing Connection

Run this in your backend to test Supabase connection:
```bash
npm run test:supabase-auth
```