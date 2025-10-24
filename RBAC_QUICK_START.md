# RBAC Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- PostgreSQL database running
- Backend API server ready
- Environment variables configured

---

## Step 1: Run Setup Script (Automated)

```powershell
cd apps/api
.\setup-rbac.ps1
```

This script will:
1. Generate Prisma migration
2. Apply migration to database
3. Generate Prisma Client
4. Seed permissions (100+ default permissions)
5. Create Admin role for existing tenants
6. Assign Admin role to existing admin users

**Expected Output:**
```
🚀 Setting up RBAC System for HMS
=================================

Step 1: Generating Prisma migration...
✅ Migration generated successfully

Step 2: Review the migration file if needed
Do you want to apply the migration now? (y/n): y

Step 3: Applying migration...
✅ Migration applied successfully

Step 4: Generating Prisma Client...
✅ Prisma Client generated successfully

Step 5: Seeding permissions and default roles...
🌱 Seeding permissions...
✅ Successfully seeded 100+ permissions
🌱 Creating default roles for existing tenants...
✅ Created Admin role with all permissions
✅ Assigned Admin role to admin users

🎉 RBAC System setup completed successfully!
```

---

## Step 2: Verify Installation

### Check Database Tables

```sql
-- Check permissions table
SELECT COUNT(*) FROM permissions;
-- Should return 100+

-- Check tenant_roles table
SELECT * FROM tenant_roles;
-- Should show Admin role for each tenant

-- Check role_permissions table
SELECT COUNT(*) FROM role_permissions;
-- Should show many permission assignments
```

### Test API Endpoints

```bash
# Get your auth token
TOKEN="your_jwt_token_here"

# Test permissions endpoint
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/permissions

# Test roles endpoint
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/roles
```

---

## Step 3: Access Role Management UI

1. **Login to Dashboard**
   - Navigate to `http://localhost:3000/dashboard` (or 3002)
   - Login with admin credentials

2. **Access Roles Page**
   - Go to `/dashboard/roles`
   - You should see the Admin role created

3. **Create Your First Custom Role**
   - Click "Create Role"
   - Name: "Doctor"
   - Description: "Medical practitioner with patient access"
   - Select permissions:
     - `patient.view`
     - `patient.create`
     - `patient.update`
     - `appointment.view`
     - `appointment.create`
     - `emr.view`
     - `emr.create`
     - `prescription.create`
   - Click "Create Role"

---

## Step 4: Assign Role to User

### Option A: Via API

```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  http://localhost:3001/roles/{roleId}/assign/{userId}
```

### Option B: Via Database (Temporary)

```sql
UPDATE users 
SET role_id = 'role_id_here' 
WHERE id = 'user_id_here';
```

### Option C: During User Creation

When creating new staff members, assign role immediately:

```typescript
const newUser = await prisma.user.create({
  data: {
    email: 'doctor@hospital.com',
    passwordHash: hashedPassword,
    firstName: 'John',
    lastName: 'Doe',
    role: 'DOCTOR',
    roleId: doctorRoleId, // Assign role here
    tenantId: tenantId,
  },
});
```

---

## Step 5: Protect Your Routes

### Backend Route Protection

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../rbac/guards/permissions.guard';
import { RequirePermissions } from '../rbac/decorators/require-permissions.decorator';

@Controller('patients')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PatientsController {
  
  @Get()
  @RequirePermissions('patient.view')
  async findAll() {
    // Only users with 'patient.view' permission can access
    return this.patientsService.findAll();
  }

  @Post()
  @RequirePermissions('patient.create')
  async create(@Body() createPatientDto: CreatePatientDto) {
    // Only users with 'patient.create' permission can access
    return this.patientsService.create(createPatientDto);
  }
}
```

### Frontend Route Protection

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { hasPermission, PERMISSIONS } from '@/lib/permissions';

export default function PatientsPage() {
  const router = useRouter();
  const user = getCurrentUser(); // Your auth hook

  useEffect(() => {
    if (!hasPermission(user, PERMISSIONS.PATIENT_VIEW)) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return <div>Patients List</div>;
}
```

---

## Common Use Cases

### 1. Create "Receptionist" Role

**Permissions:**
- `patient.view`
- `patient.create`
- `appointment.view`
- `appointment.create`
- `appointment.update`
- `billing.view`

### 2. Create "Nurse" Role

**Permissions:**
- `patient.view`
- `appointment.view`
- `emr.view`
- `emr.create`
- `lab.view`
- `pharmacy.view`

### 3. Create "Pharmacist" Role

**Permissions:**
- `pharmacy.view`
- `pharmacy.manage`
- `pharmacy.dispense`
- `prescription.view`
- `inventory.view`
- `inventory.update`

### 4. Create "Lab Technician" Role

**Permissions:**
- `lab.view`
- `lab.create`
- `lab.results.view`
- `lab.results.update`
- `patient.view`

### 5. Create "Billing Staff" Role

**Permissions:**
- `billing.view`
- `billing.create`
- `billing.update`
- `payment.process`
- `patient.view`
- `invoice.view`

---

## Testing Your RBAC Setup

### Test 1: Permission Check

```typescript
// Login as user with Doctor role
const response = await fetch('/api/patients', {
  headers: { Authorization: `Bearer ${token}` }
});

// Should succeed if Doctor has patient.view permission
console.log(response.status); // 200 OK
```

### Test 2: Permission Denial

```typescript
// Login as user with Receptionist role
const response = await fetch('/api/roles', {
  headers: { Authorization: `Bearer ${token}` }
});

// Should fail if Receptionist lacks roles.view permission
console.log(response.status); // 403 Forbidden
```

### Test 3: Dynamic UI

```typescript
// UI should hide/show based on permissions
{hasPermission(user, PERMISSIONS.PATIENT_CREATE) && (
  <Button>Add New Patient</Button>
)}

{hasPermission(user, PERMISSIONS.BILLING_CREATE) && (
  <Button>Create Invoice</Button>
)}
```

---

## Troubleshooting

### Issue: "Permission denied" for admin user

**Solution:** Re-login to get fresh JWT token with permissions.

```typescript
// Force logout and login again
localStorage.removeItem('token');
window.location.href = '/login';
```

### Issue: Permissions not showing in JWT

**Check:**
1. User has `roleId` assigned
2. Role has permissions
3. Permissions are active

**Fix:**
```sql
-- Check user's role
SELECT u.email, u.role_id, tr.name as role_name
FROM users u
LEFT JOIN tenant_roles tr ON u.role_id = tr.id
WHERE u.email = 'user@example.com';

-- Check role permissions
SELECT p.name, p.description
FROM role_permissions rp
JOIN permissions p ON rp.permission_id = p.id
WHERE rp.role_id = 'role_id_here';
```

### Issue: Cannot create role

**Check:** User must have `roles.create` permission.

**Fix:** Assign permission to user's role or login as admin.

---

## Next Steps

1. ✅ **Create Role Templates** - Define standard roles for your organization
2. ✅ **Assign Roles to Staff** - Update existing users with appropriate roles
3. ✅ **Protect All Routes** - Add `@RequirePermissions()` to all controllers
4. ✅ **Update Frontend** - Add permission checks to UI components
5. ✅ **Test Thoroughly** - Verify permissions work as expected
6. ✅ **Train Staff** - Educate admins on role management
7. ✅ **Monitor Audit Logs** - Review RBAC changes regularly

---

## Quick Reference

### Permission Naming Pattern
```
{resource}.{action}

Examples:
- patient.view
- patient.create
- billing.create
- roles.manage
```

### Common Decorators

```typescript
// Require single permission
@RequirePermissions('patient.view')

// Require any of multiple permissions (OR)
@RequirePermissions('billing.view', 'billing.create')
```

### Frontend Permission Checks

```typescript
import { hasPermission, PERMISSIONS } from '@/lib/permissions';

// Single check
hasPermission(user, PERMISSIONS.PATIENT_VIEW)

// Multiple checks (OR)
hasAnyPermission(user, [PERMISSIONS.BILLING_VIEW, PERMISSIONS.FINANCE_VIEW])

// Multiple checks (AND)
hasAllPermissions(user, [PERMISSIONS.STAFF_VIEW, PERMISSIONS.STAFF_CREATE])
```

---

## Support

Need help? Check:
1. **Full Guide**: `RBAC_IMPLEMENTATION_GUIDE.md`
2. **Audit Logs**: `SELECT * FROM audit_logs WHERE action LIKE 'ROLE_%'`
3. **Backend Logs**: Check NestJS console for permission errors

---

**Setup Time:** ~5 minutes  
**Difficulty:** Easy  
**Status:** ✅ Ready to Use
