# RBAC Implementation Guide

## 🎯 Overview

This guide documents the complete Role-Based Access Control (RBAC) system implementation for the Hospital Management SaaS platform. The system provides secure, tenant-isolated permission management compatible with PostgreSQL and Prisma.

---

## 📋 Table of Contents

1. [Architecture](#architecture)
2. [Database Schema](#database-schema)
3. [Installation & Setup](#installation--setup)
4. [Backend API](#backend-api)
5. [Frontend Integration](#frontend-integration)
6. [Permission Management](#permission-management)
7. [Security Considerations](#security-considerations)
8. [Testing](#testing)
9. [Troubleshooting](#troubleshooting)

---

## 🏗️ Architecture

### Design Principles

- **Tenant Isolation**: Each tenant manages its own roles independently
- **Additive Only**: No destructive changes to existing data
- **Backward Compatible**: Existing auth flows remain unchanged
- **Flexible Permissions**: Global permission registry, tenant-specific role assignments
- **Audit Trail**: All RBAC operations are logged

### Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Role Mgmt UI │  │ Staff Mgmt   │  │ Navigation   │      │
│  │              │  │ with Roles   │  │ Filtering    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (NestJS)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Permissions  │  │ Roles        │  │ Guards &     │      │
│  │ Service      │  │ Service      │  │ Decorators   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Database (PostgreSQL)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ permissions  │  │ tenant_roles │  │ role_        │      │
│  │ (global)     │  │ (per tenant) │  │ permissions  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema

### New Tables

#### 1. `permissions` (Global)
```sql
CREATE TABLE permissions (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,        -- e.g., "patient.view"
  description TEXT,
  category TEXT,                     -- e.g., "patient", "billing"
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 2. `tenant_roles` (Per Tenant)
```sql
CREATE TABLE tenant_roles (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  is_system BOOLEAN DEFAULT false,  -- System roles cannot be deleted
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tenant_id, name)
);
```

#### 3. `role_permissions` (Join Table)
```sql
CREATE TABLE role_permissions (
  id TEXT PRIMARY KEY,
  role_id TEXT NOT NULL REFERENCES tenant_roles(id) ON DELETE CASCADE,
  permission_id TEXT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(role_id, permission_id)
);
```

### Modified Tables

#### `users` Table
```sql
ALTER TABLE users ADD COLUMN role_id TEXT REFERENCES tenant_roles(id) ON DELETE SET NULL;
```

**Note**: The existing `role` enum field is kept for backward compatibility.

---

## 🚀 Installation & Setup

### Step 1: Apply Database Migration

```bash
cd apps/api

# Generate migration
npx prisma migrate dev --name add_rbac_system

# Apply migration
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

### Step 2: Seed Permissions and Default Roles

```bash
# Run the seed script
npx ts-node prisma/seeds/index.ts
```

This will:
- Insert 100+ default permissions
- Create "Admin" role for each existing tenant
- Assign all permissions to Admin roles
- Assign Admin role to existing ADMIN and HOSPITAL_ADMIN users

### Step 3: Restart Backend Server

```bash
npm run start:dev
```

### Step 4: Verify Installation

```bash
# Test permissions endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/permissions

# Test roles endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/roles
```

---

## 🔌 Backend API

### Permissions Endpoints

#### Get All Permissions
```http
GET /permissions
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": "perm_123",
    "name": "patient.view",
    "description": "View patient information",
    "category": "patient",
    "isActive": true
  }
]
```

#### Get Permission Categories
```http
GET /permissions/categories
Authorization: Bearer {token}
```

### Roles Endpoints

#### Get All Roles (Tenant-Scoped)
```http
GET /roles
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": "role_123",
    "name": "Doctor",
    "description": "Medical practitioner",
    "isActive": true,
    "isSystem": false,
    "_count": {
      "users": 5
    },
    "rolePermissions": [
      {
        "permission": {
          "id": "perm_123",
          "name": "patient.view",
          "description": "View patient information"
        }
      }
    ]
  }
]
```

#### Create Role
```http
POST /roles
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Nurse",
  "description": "Nursing staff",
  "permissionIds": ["perm_123", "perm_456"],
  "isActive": true
}
```

#### Update Role
```http
PATCH /roles/{roleId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Senior Nurse",
  "description": "Senior nursing staff",
  "permissionIds": ["perm_123", "perm_456", "perm_789"],
  "isActive": true
}
```

#### Delete Role
```http
DELETE /roles/{roleId}
Authorization: Bearer {token}
```

**Note**: Cannot delete system roles or roles with assigned users.

#### Assign Role to User
```http
POST /roles/{roleId}/assign/{userId}
Authorization: Bearer {token}
```

#### Remove Role from User
```http
DELETE /roles/remove/{userId}
Authorization: Bearer {token}
```

---

## 🎨 Frontend Integration

### 1. Role Management Page

Located at: `/dashboard/roles`

Features:
- View all roles with permission counts
- Create new roles with permission selection
- Edit existing roles (except system roles)
- Delete roles (only if no users assigned)
- Real-time stats dashboard

### 2. Permission Utilities

```typescript
import { hasPermission, PERMISSIONS } from '@/lib/permissions';

// Check single permission
if (hasPermission(user, PERMISSIONS.PATIENT_VIEW)) {
  // Show patient list
}

// Check multiple permissions (OR logic)
if (hasAnyPermission(user, [PERMISSIONS.BILLING_VIEW, PERMISSIONS.BILLING_CREATE])) {
  // Show billing section
}

// Check all permissions (AND logic)
if (hasAllPermissions(user, [PERMISSIONS.STAFF_VIEW, PERMISSIONS.STAFF_CREATE])) {
  // Show staff management
}
```

### 3. Protected Routes

```typescript
'use client';

import { useAuth } from '@/hooks/useAuth';
import { hasPermission, PERMISSIONS } from '@/lib/permissions';
import { redirect } from 'next/navigation';

export default function ProtectedPage() {
  const { user } = useAuth();

  if (!hasPermission(user, PERMISSIONS.PATIENT_VIEW)) {
    redirect('/dashboard');
  }

  return <div>Protected Content</div>;
}
```

### 4. Conditional UI Rendering

```typescript
import { hasPermission, PERMISSIONS } from '@/lib/permissions';

export function PatientActions({ user }) {
  return (
    <Group>
      {hasPermission(user, PERMISSIONS.PATIENT_VIEW) && (
        <Button>View Patients</Button>
      )}
      
      {hasPermission(user, PERMISSIONS.PATIENT_CREATE) && (
        <Button>Add Patient</Button>
      )}
      
      {hasPermission(user, PERMISSIONS.PATIENT_DELETE) && (
        <Button color="red">Delete Patient</Button>
      )}
    </Group>
  );
}
```

### 5. Dynamic Navigation

```typescript
import { filterNavigationByPermissions, PERMISSIONS } from '@/lib/permissions';

const navigationItems = [
  { label: 'Patients', href: '/patients', permission: PERMISSIONS.PATIENT_VIEW },
  { label: 'Billing', href: '/billing', permission: PERMISSIONS.BILLING_VIEW },
  { label: 'Staff', href: '/staff', permission: PERMISSIONS.STAFF_VIEW },
  { label: 'Settings', href: '/settings', permission: PERMISSIONS.SETTINGS_VIEW },
];

const filteredNav = filterNavigationByPermissions(navigationItems, user);
```

---

## 🔐 Permission Management

### Default Permission Categories

1. **Patient Management**: `patient.*`
2. **Appointments**: `appointment.*`
3. **Billing & Finance**: `billing.*`, `finance.*`
4. **Pharmacy**: `pharmacy.*`, `prescription.*`
5. **Laboratory**: `lab.*`
6. **Radiology**: `radiology.*`
7. **Inventory**: `inventory.*`
8. **Staff**: `staff.*`
9. **RBAC**: `roles.*`, `permissions.*`
10. **EMR**: `emr.*`
11. **IPD/OPD**: `ipd.*`, `opd.*`
12. **Emergency**: `emergency.*`
13. **Surgery**: `surgery.*`
14. **Telemedicine**: `telemedicine.*`
15. **Insurance**: `insurance.*`
16. **Reports**: `reports.*`
17. **Quality**: `quality.*`
18. **Research**: `research.*`
19. **Communications**: `communications.*`
20. **Settings**: `settings.*`, `tenant.*`
21. **Audit**: `audit.*`

### Permission Naming Convention

Format: `{resource}.{action}`

Examples:
- `patient.view` - View patient information
- `patient.create` - Create new patients
- `billing.create` - Create invoices
- `roles.manage` - Full role management

### Common Permission Patterns

```typescript
// View-only access
const viewPermissions = [
  'patient.view',
  'appointment.view',
  'billing.view',
];

// Full CRUD access
const fullAccessPermissions = [
  'patient.view',
  'patient.create',
  'patient.update',
  'patient.delete',
];

// Management access (includes all operations)
const managementPermissions = [
  'staff.manage',
  'inventory.manage',
  'pharmacy.manage',
];
```

---

## 🛡️ Security Considerations

### 1. Tenant Isolation

All role and permission queries are automatically scoped to the user's tenant:

```typescript
// Backend automatically filters by tenantId from JWT
const roles = await rolesService.findAll(req.user.tenantId);
```

### 2. System Role Protection

System roles (like "Admin") cannot be:
- Modified
- Deleted
- Have their core permissions removed

### 3. Permission Guard

The `PermissionsGuard` validates permissions on every protected route:

```typescript
@Controller('patients')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PatientsController {
  @Get()
  @RequirePermissions('patient.view')
  async findAll() {
    // Only accessible with patient.view permission
  }
}
```

### 4. Super Admin Bypass

Users with `SUPER_ADMIN` role bypass all permission checks (use sparingly).

### 5. Audit Logging

All RBAC operations are logged:
- Role creation/update/deletion
- Permission assignments
- Role assignments to users

Query audit logs:
```sql
SELECT * FROM audit_logs 
WHERE entity_type IN ('TenantRole', 'User')
  AND action LIKE 'ROLE_%'
ORDER BY created_at DESC;
```

---

## 🧪 Testing

### Backend Tests

```bash
# Test permission service
npm run test -- permissions.service.spec.ts

# Test roles service
npm run test -- roles.service.spec.ts

# Test permissions guard
npm run test -- permissions.guard.spec.ts
```

### Manual Testing Checklist

- [ ] Create a new role
- [ ] Assign permissions to role
- [ ] Assign role to user
- [ ] Login as user and verify permissions
- [ ] Try to access restricted route (should fail)
- [ ] Update role permissions
- [ ] Verify updated permissions apply immediately
- [ ] Try to delete role with users (should fail)
- [ ] Remove users from role
- [ ] Delete role successfully
- [ ] Verify audit logs

---

## 🔧 Troubleshooting

### Issue: TypeScript errors after schema changes

**Solution:**
```bash
cd apps/api
npx prisma generate
npm run build
```

### Issue: Permissions not applying

**Checklist:**
1. User has `roleId` set
2. Role has permissions assigned
3. Permissions are active (`isActive: true`)
4. JWT token is fresh (contains updated permissions)
5. PermissionsGuard is applied to route

**Fix:** Force user to re-login to get fresh JWT with updated permissions.

### Issue: Cannot delete role

**Reasons:**
- Role is a system role (`isSystem: true`)
- Role has users assigned (`_count.users > 0`)

**Solution:** Reassign users to different role first.

### Issue: Migration fails

**Common causes:**
- Database connection issue
- Conflicting migration
- Schema syntax error

**Solution:**
```bash
# Reset migrations (CAUTION: Development only)
npx prisma migrate reset

# Or manually fix migration file
# Then run:
npx prisma migrate deploy
```

### Issue: Seed script fails

**Check:**
1. Database is accessible
2. Migrations are applied
3. Prisma client is generated

**Re-run:**
```bash
npx prisma generate
npx ts-node prisma/seeds/index.ts
```

---

## 📚 Additional Resources

### Files Created

**Backend:**
- `apps/api/prisma/schema.prisma` (modified)
- `apps/api/prisma/seeds/permissions.seed.ts`
- `apps/api/prisma/seeds/default-roles.seed.ts`
- `apps/api/prisma/seeds/index.ts`
- `apps/api/src/rbac/` (entire module)
- `apps/api/src/auth/auth.service.ts` (modified)
- `apps/api/src/auth/jwt.strategy.ts` (modified)

**Frontend:**
- `apps/web/src/app/dashboard/roles/page.tsx`
- `apps/web/src/lib/permissions.ts`

**Scripts:**
- `apps/api/setup-rbac.ps1`

### Next Steps

1. **Customize Permissions**: Add/remove permissions based on your needs
2. **Create Role Templates**: Define common roles (Doctor, Nurse, Admin, etc.)
3. **Implement Row-Level Security**: Add data-level permissions
4. **Add Permission Groups**: Group related permissions for easier management
5. **Build Permission UI**: Create visual permission matrix
6. **Add Role Cloning**: Allow duplicating roles
7. **Implement Permission Inheritance**: Support role hierarchies

---

## 📞 Support

For issues or questions:
1. Check this guide first
2. Review audit logs for RBAC operations
3. Check backend logs for permission errors
4. Verify database state directly

---

**Last Updated:** 2025-01-23  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
