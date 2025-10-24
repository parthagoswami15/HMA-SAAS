# 🏥 Hospital Management System (HMS) SaaS - Complete Documentation

**Version:** 1.0  
**Last Updated:** October 24, 2025  
**Tech Stack:** Next.js, NestJS, PostgreSQL (Supabase), Prisma ORM

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Key Features](#key-features)
6. [Database Schema](#database-schema)
7. [Authentication & RBAC](#authentication--rbac)
8. [Deployment](#deployment)
9. [Environment Variables](#environment-variables)

---

## Project Overview

### What is HMS SaaS?

HMS SaaS is a comprehensive **Hospital Management System** built as a multi-tenant SaaS application. It enables hospitals, clinics, and healthcare facilities to manage their operations digitally.

### Key Capabilities

- **Patient Management**: Complete patient records, registration, and history
- **Appointment Scheduling**: Book, manage, and track appointments
- **Billing & Invoicing**: Generate bills, track payments, insurance claims
- **Pharmacy Management**: Medicine inventory, prescriptions, sales
- **Laboratory Management**: Test orders, results, reports
- **Inventory Tracking**: Medical supplies, equipment tracking
- **Role-Based Access Control**: Granular permissions for different user roles
- **Multi-Tenancy**: Complete data isolation between organizations
- **Audit Logging**: Track all important operations

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│  Web Browser (Next.js Frontend on Vercel)                   │
│  - React Components                                          │
│  - API Client (Axios)                                        │
│  - JWT Token Storage                                         │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                       │
│  NestJS Backend API (Render)                                │
│  - Controllers (HTTP Endpoints)                              │
│  - Services (Business Logic)                                 │
│  - Guards (Auth & Permissions)                               │
│  - DTOs (Validation)                                         │
└─────────────────────────────────────────────────────────────┘
                            ↓ Prisma ORM
┌─────────────────────────────────────────────────────────────┐
│                        DATA LAYER                            │
│  PostgreSQL Database (Supabase)                              │
│  - Multi-tenant data isolation                               │
│  - RBAC tables                                               │
│  - Business data                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 13+ | React framework with SSR |
| **UI Library** | Mantine UI | Component library |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **Backend** | NestJS | Node.js framework |
| **Database** | PostgreSQL | Relational database |
| **ORM** | Prisma | Type-safe database client |
| **Authentication** | JWT | Token-based auth |
| **Deployment** | Vercel + Render | Cloud hosting |
| **Language** | TypeScript | Type safety |

---

## Project Structure

### Root Directory

```
HMS/
├── apps/
│   ├── api/          # NestJS Backend
│   └── web/          # Next.js Frontend
├── docs/             # Documentation
├── package.json      # Root dependencies
└── README.md         # Project readme
```

### Frontend Structure (`apps/web/`)

```
src/
├── app/              # Next.js App Router
│   ├── (auth)/      # Login, Register
│   └── dashboard/   # Protected routes
│       ├── patients/
│       ├── appointments/
│       ├── billing/
│       ├── pharmacy/
│       ├── lab/
│       └── roles/
├── components/       # React components
├── services/         # API services
├── lib/             # Utilities
├── types/           # TypeScript types
└── hooks/           # Custom hooks
```

### Backend Structure (`apps/api/`)

```
src/
├── main.ts          # Entry point
├── auth/            # Authentication
├── patients/        # Patient module
├── appointments/    # Appointments
├── billing/         # Billing
├── pharmacy/        # Pharmacy
├── lab/             # Laboratory
├── rbac/            # RBAC system
├── tenants/         # Multi-tenancy
└── prisma/          # Database client
```

---

## Key Features

### 1. Patient Management
- Multi-step registration form
- Complete patient profiles
- Medical history tracking
- Document uploads
- Search and filter

### 2. Appointment Scheduling
- Calendar view
- Book/reschedule appointments
- Doctor availability
- Status tracking

### 3. Billing & Invoicing
- Generate invoices
- Payment tracking
- Tax calculations
- Insurance claims

### 4. Pharmacy Management
- Medicine inventory
- Stock tracking
- Prescription management
- Sales tracking

### 5. Laboratory Management
- Test catalog
- Order tests
- Record results
- Generate reports

### 6. Role-Based Access Control
- 100+ predefined permissions
- Custom role creation
- Tenant-specific roles
- Audit logging

---

## Database Schema

### Core Tables

**User**: System users (doctors, nurses, admins)
**Tenant**: Organizations (hospitals, clinics)
**Patient**: Patient records
**Appointment**: Patient appointments
**Billing**: Invoices and payments

### RBAC Tables

**Permission**: Global permission definitions (100+)
**TenantRole**: Roles per tenant
**RolePermission**: Role-permission mapping
**AuditLog**: Operation tracking

### Key Relationships

```
Tenant → Users → Role → Permissions
Tenant → Patients → Appointments
Tenant → Billing → BillingItems
```

---

## Authentication & RBAC

### Authentication Flow

1. User logs in with email/password
2. Backend validates credentials
3. Backend generates JWT with permissions
4. Frontend stores token
5. Token attached to all requests
6. Backend validates and checks permissions

### JWT Token Structure

```json
{
  "sub": "user_id",
  "email": "doctor@hospital.com",
  "tenantId": "tenant_id",
  "permissions": ["patient.view", "patient.create"],
  "exp": 1698209856
}
```

### Permission Format

```
<resource>.<action>

Examples:
- patient.view
- patient.create
- billing.create
- pharmacy.manage
```

### Multi-Tenancy

- Every record has `tenantId`
- Automatic tenant isolation
- Users can only access their tenant's data
- No cross-tenant data access

---

## Deployment

### Architecture

```
Frontend (Vercel) ←→ Backend (Render) ←→ Database (Supabase)
```

### Deployment URLs

- **Frontend**: https://hms-saas-staging.vercel.app
- **Backend**: https://hms-saas-staging.onrender.com
- **Database**: Supabase PostgreSQL

### Deployment Process

**Frontend (Vercel):**
1. Push to GitHub
2. Vercel auto-deploys
3. Build Next.js app
4. Deploy to CDN

**Backend (Render):**
1. Push to GitHub
2. Render builds Docker image
3. Runs migrations (if enabled)
4. Deploys to container

---

## Environment Variables

### Backend (.env)

```bash
# Database
DATABASE_URL=postgresql://...@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_DATABASE_URL=postgresql://...@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGINS=https://hms-saas-staging.vercel.app

# Migrations
SKIP_MIGRATIONS=true
```

### Frontend (.env.local)

```bash
NEXT_PUBLIC_API_URL=https://hms-saas-staging.onrender.com
NEXT_PUBLIC_APP_NAME=HMS SaaS
```

---

## How to Convert to Word

### Option 1: Using Microsoft Word
1. Open Microsoft Word
2. File → Open → Select `PROJECT_DOCUMENTATION.md`
3. Word will automatically convert Markdown
4. File → Save As → Choose `.docx` format

### Option 2: Using Pandoc (Command Line)
```bash
pandoc PROJECT_DOCUMENTATION.md -o PROJECT_DOCUMENTATION.docx
```

### Option 3: Using Online Converter
1. Go to https://www.markdowntoword.com/
2. Upload `PROJECT_DOCUMENTATION.md`
3. Download as Word document

### Option 4: Copy-Paste
1. Open `PROJECT_DOCUMENTATION.md` in VS Code
2. Install "Markdown Preview Enhanced" extension
3. Right-click → "Markdown Preview Enhanced: Open Preview"
4. Copy content from preview
5. Paste into Word document

---

## Quick Reference

### Important Files

**Frontend:**
- `PatientForm.tsx` - Patient registration form
- `api-client.ts` - API client with auth
- `patients.service.ts` - Patient API calls
- `permissions.ts` - RBAC helpers

**Backend:**
- `main.ts` - App entry point
- `auth.service.ts` - Authentication logic
- `patients.service.ts` - Patient business logic
- `create-patient.dto.ts` - Validation rules

**Database:**
- `schema.prisma` - Database schema
- `migrations/` - Migration history

### Common Commands

```bash
# Frontend
cd apps/web
npm run dev          # Start dev server
npm run build        # Build for production

# Backend
cd apps/api
npm run start:dev    # Start dev server
npm run build        # Build for production
npx prisma migrate deploy  # Run migrations
npx prisma generate  # Generate Prisma client

# Database
npx prisma studio    # Open database GUI
npx prisma db push   # Push schema changes
```

---

## Support & Resources

- **GitHub**: Repository with full source code
- **Documentation**: `/docs` folder
- **API Docs**: https://hms-saas-staging.onrender.com/api/docs
- **Deployment Guide**: `DEPLOYMENT_INSTRUCTIONS.md`
- **RBAC Guide**: `docs/RBAC_IMPLEMENTATION_GUIDE.md`

---

**End of Documentation**
