# 📊 Phase 5: Database Setup & Configuration

## ✅ What Was Completed

Phase 5 focused on **database setup, configuration, and seeding** to make the Core Platform ready for testing and use.

---

## 🗄️ Database Configuration

### 1. TypeORM Configuration
**File**: `config/database.config.ts` (28 lines)

Features:
- PostgreSQL connection settings
- Environment-based configuration
- Connection pooling (max 20 connections)
- SSL support for production
- Logging control
- Migration and entity paths

### 2. DataSource Configuration
**File**: `data-source.ts` (18 lines)

Purpose:
- TypeORM CLI configuration
- Used for migrations and seeds
- Loads environment variables

---

## 🚀 Application Module

### Updated App Module
**File**: `app.module.new.ts` (175 lines)

**New Additions:**
- ✅ TypeORM integration
- ✅ CoreModule integration (Auth, Tenant, Audit)
- ✅ Global ValidationPipe with:
  - Automatic transformation
  - Whitelist validation
  - Forbid non-whitelisted properties
- ✅ Joi validation schema for environment variables
- ✅ Rate limiting (Throttler)
- ✅ Backward compatibility with existing Prisma modules

**Coexistence Strategy:**
- New TypeORM-based core platform
- Existing Prisma-based HMS modules
- Both databases work side-by-side during migration
- New core endpoints: `/auth/*`, `/tenants/*`, `/audit/*`
- Existing endpoints: `/patients/*`, `/appointments/*`, etc.

---

## 🌱 Database Seeding

### Seed Script
**File**: `database/seeds/initial-seed.ts` (287 lines)

**Creates:**

#### 1. Platform Admin Tenant
- Name: "Platform Administration"
- Slug: `platform-admin`
- Status: ACTIVE
- Plan: ENTERPRISE

#### 2. Super Admin User
- Email: `admin@hms.com`
- Password: `Admin@123!`
- Role: SUPER_ADMIN
- Full platform access

#### 3. Demo Hospital Tenant
- Name: "Demo Hospital"
- Slug: `demo-hospital`
- Status: TRIAL (30 days)
- Plan: PROFESSIONAL
- Full settings and limits configured

#### 4. Demo Hospital Users

**Admin:**
- Email: `admin@demo-hospital.com`
- Password: `Demo@123!`
- Role: TENANT_ADMIN

**Doctor:**
- Email: `doctor@demo-hospital.com`
- Password: `Doctor@123!`
- Role: DOCTOR

**Nurse:**
- Email: `nurse@demo-hospital.com`
- Password: `Nurse@123!`
- Role: NURSE

**Patient:**
- Email: `patient@demo-hospital.com`
- Password: `Patient@123!`
- Role: PATIENT

**Features:**
- ✅ Idempotent (safe to re-run)
- ✅ Checks for existing data
- ✅ Detailed console output
- ✅ Passwords follow strength requirements
- ✅ Email verification flags set

---

## 📚 Documentation

### Database Setup Guide
**File**: `DATABASE_SETUP.md` (354 lines)

**Comprehensive Guide Including:**

1. **Prerequisites** - PostgreSQL, Node.js
2. **Installation** - Required npm packages
3. **Database Creation** - psql and GUI options
4. **Environment Variables** - Complete configuration
5. **Package Scripts** - Migration and seed commands
6. **Migration Generation** - Step-by-step process
7. **Running Migrations** - Execute and verify
8. **Seeding Data** - Initial data population
9. **Verification** - Database checks
10. **Testing** - Authentication endpoint tests
11. **Troubleshooting** - Common issues and solutions
12. **Database Reset** - Development workflow
13. **Production Checklist** - Deployment requirements
14. **Useful Commands** - Quick reference

---

## 🔧 Required Package Scripts

Add to `apps/api/package.json`:

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

## 🎯 Setup Workflow

### Quick Start (10 minutes)

```bash
# 1. Install dependencies
npm install --save @nestjs/typeorm typeorm pg dotenv
npm install --save-dev ts-node

# 2. Create PostgreSQL database
psql -U postgres -c "CREATE DATABASE hms_db;"

# 3. Configure .env file
# Add DATABASE_HOST, DATABASE_PORT, etc.

# 4. Generate and run migrations
npm run typeorm migration:generate -- src/migrations/InitialSchema
npm run migration:run

# 5. Seed database
npm run seed

# 6. Start application
npm run start:dev

# 7. Test auth endpoint
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@hms.com", "password": "Admin@123!"}'
```

---

## 📊 Database Schema

### Tables Created by Migrations:

#### 1. **tenants**
- Platform and hospital/clinic tenants
- Subscription management
- Settings (JSONB)
- Branding configuration
- Billing integration

#### 2. **users**
- Multi-tenant users
- Role-based access
- Custom permissions override
- Authentication fields
- Account security (lockout, 2FA)
- Email/phone verification

#### 3. **audit_logs**
- Comprehensive activity tracking
- User actions
- Data changes (old/new values)
- Security flags
- Performance metrics
- Compliance-ready

#### 4. **migrations**
- TypeORM migration tracking

---

## 🔐 Security Features

### Password Requirements
- Minimum 8 characters
- Uppercase, lowercase, number, special character
- Bcrypt hashing (12 rounds)
- Account lockout after 5 failed attempts

### Demo Passwords
All demo passwords: `<Role>@123!`
- Strong enough for demo
- Easy to remember
- **MUST be changed in production**

### Environment Security
- JWT secrets must be changed
- Database passwords must be strong
- Never use synchronize=true in production
- Enable SSL in production

---

## 🎯 Testing Endpoints

### 1. Login as Super Admin
```bash
POST http://localhost:3001/auth/login
Body: {
  "email": "admin@hms.com",
  "password": "Admin@123!"
}
```

### 2. Get Current User
```bash
GET http://localhost:3001/auth/me
Headers: Authorization: Bearer <access_token>
```

### 3. List Tenants
```bash
GET http://localhost:3001/tenants
Headers: Authorization: Bearer <super_admin_token>
```

### 4. Query Audit Logs
```bash
GET http://localhost:3001/audit/logs?tenantId=<uuid>
Headers: Authorization: Bearer <token>
```

---

## 📈 Statistics

### Files Created
- **5 new files**
- **~850 lines of code**
- **1 comprehensive guide** (354 lines)

### Configuration
- Database configuration
- DataSource for CLI
- App module integration
- Seed script with 2 tenants, 5 users

### Documentation
- Complete setup guide
- Troubleshooting section
- Production checklist
- Testing instructions

---

## 🔄 Migration Path

### For Existing HMS Apps

The setup supports **gradual migration**:

1. **New Core Platform (TypeORM)**
   - Auth, Tenant, Audit
   - New endpoints: `/auth/*`, `/tenants/*`, `/audit/*`
   - PostgreSQL database

2. **Existing Modules (Prisma)**
   - Patients, Appointments, Staff, etc.
   - Existing endpoints unchanged
   - Keep current database

3. **Migration Strategy**
   - Run both in parallel
   - Migrate one module at a time
   - Switch auth to new system
   - Gradually move data

---

## ⚠️ Important Notes

### 1. App Module
- Created as `app.module.new.ts`
- Review and rename to `app.module.ts` when ready
- Backup existing `app.module.ts` first

### 2. Environment Variables
- Both databases require configuration:
  - `DATABASE_URL` (Prisma)
  - `DATABASE_HOST`, etc. (TypeORM)
- JWT secrets are required
- See `.env.example` for full list

### 3. Migration Strategy
- Use `DATABASE_SYNCHRONIZE=false`
- Always generate migrations
- Test migrations in development first
- Keep migration files in version control

### 4. Seed Data
- Seed script is idempotent
- Safe to run multiple times
- Demo accounts for all roles
- Change passwords in production

---

## 🚀 Next Steps (Phase 6)

### 1. Run Database Setup
- Follow `DATABASE_SETUP.md`
- Create PostgreSQL database
- Run migrations
- Seed initial data

### 2. Test Core Platform
- Test auth endpoints
- Test RBAC protection
- Test tenant CRUD
- Test audit logging

### 3. Build First Module
- Patient Management module
- Use new TypeORM entities
- Full RBAC integration
- Audit logging

### 4. Create Postman Collection
- Document all endpoints
- Example requests
- Environment variables

### 5. Frontend Integration
- Update auth service
- Use new endpoints
- JWT token management

---

## 💡 Key Achievements

Phase 5 completes the **database foundation**:

- ✅ TypeORM configured
- ✅ PostgreSQL integration
- ✅ Migration system
- ✅ Seed scripts with demo data
- ✅ Comprehensive documentation
- ✅ Production-ready configuration
- ✅ Backward compatibility
- ✅ Security best practices

**Overall Progress: 55% → 60%**

Ready for database setup and testing! 🚀

---

**Phase 5 Completed**: 2025-01-16  
**Time Spent**: ~2 hours  
**Lines of Code**: ~850  
**Files Created**: 5  
**Documentation**: 354 lines  
**Demo Accounts**: 5 users across 2 tenants  
**Ready for**: Database Setup & Testing ✅
