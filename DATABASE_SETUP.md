# Database Setup Guide

## Prerequisites

1. **PostgreSQL installed** (version 12 or higher)
2. **Node.js and npm** installed
3. **Environment variables** configured in `.env`

---

## Step 1: Install Required Packages

```bash
npm install --save @nestjs/typeorm typeorm pg
npm install --save-dev @types/node ts-node
```

---

## Step 2: Create PostgreSQL Database

### Option A: Using PostgreSQL CLI (psql)

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE hms_db;

# Create user (optional, if not using postgres user)
CREATE USER hms_user WITH PASSWORD 'your_secure_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE hms_db TO hms_user;

# Exit
\q
```

### Option B: Using pgAdmin or GUI Tool

1. Open pgAdmin
2. Right-click on "Databases" → "Create" → "Database"
3. Name: `hms_db`
4. Save

---

## Step 3: Configure Environment Variables

Update your `.env` file with database credentials:

```env
# TypeORM/PostgreSQL Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password_here
DATABASE_NAME=hms_db
DATABASE_SYNCHRONIZE=false
DATABASE_LOGGING=true

# JWT Configuration (required)
JWT_ACCESS_TOKEN_SECRET=your-super-secret-access-token-change-this
JWT_REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-change-this
JWT_ACCESS_TOKEN_EXPIRY=15m
JWT_REFRESH_TOKEN_EXPIRY=7d
```

**⚠️ Important:**
- NEVER use `DATABASE_SYNCHRONIZE=true` in production
- Change JWT secrets to random secure strings
- Use strong database passwords

---

## Step 4: Add Scripts to package.json

Add these scripts to `apps/api/package.json`:

```json
{
  "scripts": {
    "typeorm": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js",
    "migration:generate": "npm run typeorm -- migration:generate -d src/data-source.ts",
    "migration:run": "npm run typeorm -- migration:run -d src/data-source.ts",
    "migration:revert": "npm run typeorm -- migration:revert -d src/data-source.ts",
    "migration:show": "npm run typeorm -- migration:show -d src/data-source.ts",
    "seed": "ts-node -r tsconfig-paths/register src/database/seeds/initial-seed.ts"
  }
}
```

---

## Step 5: Generate Migrations

```bash
cd apps/api

# Generate initial migration from entities
npm run typeorm migration:generate -- src/migrations/InitialSchema

# This will create a migration file in src/migrations/
```

---

## Step 6: Run Migrations

```bash
# Run all pending migrations
npm run migration:run

# Check migration status
npm run migration:show
```

**Expected Output:**
```
✓ Migrations have been executed successfully
 [X] InitialSchema
```

---

## Step 7: Seed Database with Initial Data

```bash
# Run seed script
npm run seed
```

**Expected Output:**
```
🌱 Starting database seed...
✅ Data source initialized
Creating super admin tenant...
✅ Super admin tenant created
...
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
```

---

## Step 8: Verify Database

### Using psql:

```bash
psql -U postgres -d hms_db

# List tables
\dt

# Check tenants
SELECT id, name, slug, status FROM tenants;

# Check users
SELECT id, email, role FROM users;

# Exit
\q
```

### Expected Tables:
- `tenants`
- `users`
- `audit_logs`
- `migrations`

---

## Step 9: Start the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

---

## Step 10: Test Authentication

### Using curl:

```bash
# Login as Super Admin
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@hms.com",
    "password": "Admin@123!"
  }'
```

### Using Postman/Insomnia:

1. **POST** `http://localhost:3001/auth/login`
2. **Body** (JSON):
   ```json
   {
     "email": "admin@hms.com",
     "password": "Admin@123!"
   }
   ```
3. **Response**: Should return access token and user info

---

## Common Issues & Solutions

### Issue 1: "password authentication failed"

**Solution:**
- Check DATABASE_PASSWORD in .env
- Verify PostgreSQL user credentials
- Reset password: `ALTER USER postgres WITH PASSWORD 'new_password';`

### Issue 2: "database does not exist"

**Solution:**
```bash
psql -U postgres -c "CREATE DATABASE hms_db;"
```

### Issue 3: "connection refused"

**Solution:**
- Check if PostgreSQL is running:
  - Windows: Services → PostgreSQL
  - Mac: `brew services list`
  - Linux: `sudo systemctl status postgresql`
- Check DATABASE_HOST and DATABASE_PORT in .env

### Issue 4: Migration fails

**Solution:**
```bash
# Revert last migration
npm run migration:revert

# Fix entity issues
# Re-run migration
npm run migration:run
```

### Issue 5: Seed fails with "already exists"

**Solution:** Seed is idempotent. Re-running it won't create duplicates.

---

## Database Reset (Development Only)

**⚠️ WARNING: This will delete all data!**

```bash
# Drop and recreate database
psql -U postgres -c "DROP DATABASE hms_db;"
psql -U postgres -c "CREATE DATABASE hms_db;"

# Run migrations
npm run migration:run

# Seed data
npm run seed
```

---

## Next Steps

1. ✅ Database configured
2. ✅ Migrations run
3. ✅ Initial data seeded
4. ✅ Test auth endpoints
5. → Build first application module (Patient Management)
6. → Add more entities and modules
7. → Deploy to production

---

## Production Deployment Checklist

- [ ] Use strong DATABASE_PASSWORD
- [ ] Change all JWT secrets
- [ ] Set DATABASE_SYNCHRONIZE=false
- [ ] Enable SSL connection (DATABASE_SSL=true)
- [ ] Use managed PostgreSQL (AWS RDS, Google Cloud SQL, etc.)
- [ ] Set up database backups
- [ ] Configure connection pooling
- [ ] Enable query logging for monitoring
- [ ] Set up read replicas (optional)

---

## Useful Commands

```bash
# Check TypeORM CLI version
npm run typeorm -- --version

# Show all migrations
npm run migration:show

# Revert last migration
npm run migration:revert

# Re-seed database
npm run seed

# Check database connection
psql -U postgres -d hms_db -c "SELECT version();"
```

---

**Status**: Ready for Phase 5 Testing ✅
