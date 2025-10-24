# HMS SaaS API Deployment Guide

## Automatic Database Migrations on Render

This API is configured to automatically run Prisma migrations on every deployment to Render.

### How It Works

1. **Docker Build**: When you push to GitHub, Render builds the Docker image
2. **Migration Script**: The Docker container includes a migration script (`scripts/migrate-and-start.sh`)
3. **Startup Process**: On container start, it:
   - Runs `prisma migrate deploy` to apply pending migrations
   - Starts the NestJS application

### Migration Files

All migration files are tracked in git under `prisma/migrations/`. When you create a new migration locally, commit it to git and push. Render will automatically apply it on the next deployment.

### Environment Variables Required on Render

Make sure these environment variables are set in your Render dashboard:

- `DATABASE_URL` - Your Supabase or PostgreSQL connection string
- `NODE_ENV=production`
- `PORT=10000`
- All other app-specific variables (JWT secrets, CORS origins, etc.)

### Manual Migration (if needed)

If you need to run migrations manually on Render:

1. Go to Render Dashboard → Your Service → Shell
2. Run: `cd /app/apps/api && npx prisma migrate deploy`

### Creating New Migrations

When developing locally:

```bash
# Create a new migration
cd apps/api
npx prisma migrate dev --name your_migration_name

# The migration will be created in prisma/migrations/
# Commit it to git
git add prisma/migrations/
git commit -m "Add migration: your_migration_name"
git push
```

### RBAC Migration

The RBAC system migration (`1761280332032_add_rbac_system`) includes:
- `permissions` table
- `tenant_roles` table
- `role_permissions` table
- `roleId` column added to `User` and `users` tables
- All necessary indexes and foreign keys

This migration is idempotent (safe to run multiple times).

### Troubleshooting

**Migration fails on Render:**
- Check Render logs for specific error messages
- Verify `DATABASE_URL` is correct and accessible
- Ensure database user has CREATE/ALTER permissions

**"Column already exists" errors:**
- The RBAC migration uses `IF NOT EXISTS` checks, so it's safe to run even if some tables/columns exist

**Need to rollback a migration:**
- Prisma doesn't support automatic rollbacks in production
- You'll need to manually write a rollback SQL script
- Or restore from a database backup

### Health Check

The API includes a health check endpoint at `/health` that Render uses to verify the service is running.

### Deployment Checklist

Before deploying:
- [ ] All migrations are committed to git
- [ ] Environment variables are set on Render
- [ ] Database connection string is correct
- [ ] CORS origins include your frontend URL
- [ ] JWT secrets are generated and set

After deploying:
- [ ] Check Render logs for migration success
- [ ] Test the `/health` endpoint
- [ ] Verify login functionality works
- [ ] Check that RBAC permissions are loaded
