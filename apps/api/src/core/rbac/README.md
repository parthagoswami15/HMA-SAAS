# RBAC System Documentation

## Overview

This is a comprehensive Role-Based Access Control (RBAC) system for the HMS application with:
- **16 User Roles** with clear hierarchy
- **150+ Granular Permissions** organized by domain
- **Role-Permission Mapping** for all roles
- **Guards & Decorators** for easy route protection
- **Multi-Tenancy Support** with data isolation

---

## Quick Start

### 1. Protect a Route by Role

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { RolesGuard } from '@core/rbac/guards/roles.guard';
import { Roles } from '@core/rbac/decorators/roles.decorator';
import { UserRole } from '@core/rbac/roles.enum';

@Controller('patients')
@UseGuards(RolesGuard)
export class PatientsController {
  @Get()
  @Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST)
  findAll() {
    return 'Only doctors, nurses, and receptionists can access this';
  }
}
```

### 2. Protect a Route by Permission

```typescript
import { Controller, Post, UseGuards } from '@nestjs/common';
import { PermissionsGuard } from '@core/rbac/guards/permissions.guard';
import { Permissions } from '@core/rbac/decorators/permissions.decorator';
import { Permission } from '@core/rbac/permissions.enum';

@Controller('patients')
@UseGuards(PermissionsGuard)
export class PatientsController {
  @Post()
  @Permissions(Permission.CREATE_PATIENTS)
  create() {
    return 'Only users with CREATE_PATIENTS permission can access this';
  }
}
```

### 3. Require Multiple Permissions

```typescript
import { RequireAllPermissions, RequireAnyPermission } from '@core/rbac/decorators/permissions.decorator';

@Controller('medical-records')
export class MedicalRecordsController {
  // User must have ALL specified permissions
  @Put(':id')
  @RequireAllPermissions(
    Permission.UPDATE_MEDICAL_RECORDS,
    Permission.SIGN_MEDICAL_RECORDS
  )
  updateAndSign() {
    return 'User must be able to update AND sign medical records';
  }

  // User needs at least ONE of the specified permissions
  @Get(':id')
  @RequireAnyPermission(
    Permission.VIEW_MEDICAL_RECORDS,
    Permission.VIEW_SENSITIVE_RECORDS
  )
  viewRecord() {
    return 'User needs to view medical records OR sensitive records';
  }
}
```

### 4. Multi-Tenancy Protection

```typescript
import { UseGuards } from '@nestjs/common';
import { TenantGuard, SkipTenantCheck } from '@core/rbac/guards/tenant.guard';

@Controller('patients')
@UseGuards(TenantGuard)
export class PatientsController {
  // Automatically enforces tenant isolation
  @Get()
  findAll() {
    // Only returns patients from user's tenant
    return 'Tenant-isolated data';
  }

  // Skip tenant check for super admin routes
  @Get('all-tenants')
  @SkipTenantCheck()
  findAllTenants() {
    // Returns data from all tenants (super admin only)
    return 'All tenant data';
  }
}
```

### 5. Combine Multiple Guards

```typescript
@Controller('appointments')
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard, PermissionsGuard)
export class AppointmentsController {
  @Post()
  @Roles(UserRole.DOCTOR, UserRole.RECEPTIONIST)
  @Permissions(Permission.CREATE_APPOINTMENTS)
  create() {
    // User must be:
    // 1. Authenticated (JwtAuthGuard)
    // 2. From correct tenant (TenantGuard)
    // 3. Either Doctor or Receptionist (RolesGuard)
    // 4. Have CREATE_APPOINTMENTS permission (PermissionsGuard)
    return 'Fully protected endpoint';
  }
}
```

---

## Available Roles

### Platform Level
- `SUPER_ADMIN` - Full platform access

### Tenant Level
- `TENANT_ADMIN` - Hospital administrator

### Clinical Staff
- `DOCTOR` - Primary physician
- `SPECIALIST` - Senior doctor with advanced privileges
- `RESIDENT` - Junior doctor with supervised access
- `NURSE` - Clinical support staff

### Support Staff
- `LAB_TECHNICIAN` - Laboratory operations
- `PHARMACIST` - Pharmacy operations
- `RADIOLOGIST` - Radiology operations
- `RECEPTIONIST` - Front desk operations

### Administrative
- `ACCOUNTANT` - Financial operations
- `HR_MANAGER` - Human resources
- `INVENTORY_MANAGER` - Inventory & supplies

### External
- `PATIENT` - Limited self-service access
- `VENDOR` - External supplier
- `INSURANCE_PROVIDER` - Insurance company

---

## Permission Categories

### Platform Management
- `MANAGE_PLATFORM`, `MANAGE_TENANTS`, `VIEW_PLATFORM_ANALYTICS`

### Patient Management
- `VIEW_PATIENTS`, `CREATE_PATIENTS`, `UPDATE_PATIENTS`, `DELETE_PATIENTS`

### Medical Records
- `VIEW_MEDICAL_RECORDS`, `CREATE_MEDICAL_RECORDS`, `UPDATE_MEDICAL_RECORDS`, `SIGN_MEDICAL_RECORDS`

### Appointments
- `VIEW_APPOINTMENTS`, `CREATE_APPOINTMENTS`, `UPDATE_APPOINTMENTS`, `CANCEL_APPOINTMENTS`

### Laboratory
- `VIEW_LAB_ORDERS`, `CREATE_LAB_ORDERS`, `ENTER_LAB_RESULTS`, `APPROVE_LAB_RESULTS`

### Pharmacy
- `VIEW_PHARMACY_INVENTORY`, `DISPENSE_MEDICATION`, `MANAGE_PHARMACY_INVENTORY`

### Billing
- `VIEW_BILLING`, `CREATE_INVOICES`, `PROCESS_PAYMENTS`, `APPLY_DISCOUNTS`

### Reports
- `VIEW_REPORTS`, `EXPORT_REPORTS`, `VIEW_AUDIT_LOGS`

[See `permissions.enum.ts` for complete list]

---

## Helper Functions

### Check Role Permissions

```typescript
import { roleHasPermission, getPermissionsForRole } from '@core/rbac/role-permission.mapping';
import { UserRole } from '@core/rbac/roles.enum';
import { Permission } from '@core/rbac/permissions.enum';

// Check if a role has a specific permission
const canViewPatients = roleHasPermission(UserRole.DOCTOR, Permission.VIEW_PATIENTS);
// Returns: true

// Get all permissions for a role
const doctorPermissions = getPermissionsForRole(UserRole.DOCTOR);
// Returns: Array of Permission enums
```

### Check Multiple Permissions

```typescript
import { roleHasAnyPermission, roleHasAllPermissions } from '@core/rbac/role-permission.mapping';

// Check if role has ANY of the permissions
const hasAny = roleHasAnyPermission(UserRole.NURSE, [
  Permission.CREATE_PATIENTS,
  Permission.VIEW_PATIENTS
]);
// Returns: true (nurses can view patients)

// Check if role has ALL of the permissions
const hasAll = roleHasAllPermissions(UserRole.NURSE, [
  Permission.CREATE_PATIENTS,
  Permission.UPDATE_PATIENTS
]);
// Returns: false (nurses can update but not create)
```

---

## Best Practices

### 1. Use Permissions over Roles

✅ **Good** - More flexible and maintainable:
```typescript
@Permissions(Permission.CREATE_INVOICES)
createInvoice() {}
```

❌ **Avoid** - Tightly coupled to roles:
```typescript
@Roles(UserRole.ACCOUNTANT, UserRole.RECEPTIONIST)
createInvoice() {}
```

### 2. Apply Guards at Controller Level

```typescript
@Controller('patients')
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
export class PatientsController {
  // All routes are automatically protected
}
```

### 3. Use Appropriate Permission Checks

- Use `@Permissions()` when user needs ANY of the permissions
- Use `@RequireAllPermissions()` when user needs ALL permissions
- Use `@RequireAnyPermission()` to be explicit about "any" logic

### 4. Document Custom Permissions

```typescript
/**
 * Discharge a patient from IPD
 * Requires: DISCHARGE_PATIENT permission
 * Roles: DOCTOR, SPECIALIST, TENANT_ADMIN
 */
@Permissions(Permission.DISCHARGE_PATIENT)
dischargePatient() {}
```

---

## Testing

### Test Role Permissions

```typescript
import { Test } from '@nestjs/testing';
import { RolesGuard } from '@core/rbac/guards/roles.guard';
import { Reflector } from '@nestjs/core';

describe('RolesGuard', () => {
  let guard: RolesGuard;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [RolesGuard, Reflector],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
  });

  it('should allow access when user has required role', () => {
    // Test implementation
  });
});
```

---

## Extending the System

### Add New Role

1. Add to `roles.enum.ts`:
```typescript
export enum UserRole {
  // ... existing roles
  NEW_ROLE = 'NEW_ROLE',
}
```

2. Add to hierarchy:
```typescript
export const RoleHierarchy: Record<UserRole, number> = {
  // ... existing roles
  [UserRole.NEW_ROLE]: 45,
};
```

3. Add to role-permission mapping:
```typescript
[UserRole.NEW_ROLE]: [
  Permission.VIEW_PATIENTS,
  // ... other permissions
],
```

### Add New Permission

1. Add to `permissions.enum.ts`:
```typescript
export enum Permission {
  // ... existing permissions
  NEW_PERMISSION = 'new:permission',
}
```

2. Assign to relevant roles in `role-permission.mapping.ts`

---

## Troubleshooting

### Permission Denied Issues

1. Check user has correct role
2. Verify role has required permission in mapping
3. Ensure guards are applied in correct order
4. Check tenant isolation if applicable

### Guard Not Working

1. Verify guard is imported and applied
2. Check `@UseGuards()` decorator is present
3. Ensure guard is provided in module
4. Verify user object is attached to request

---

## Files Reference

- `roles.enum.ts` - Role definitions
- `permissions.enum.ts` - Permission definitions
- `role-permission.mapping.ts` - Role-permission assignments
- `guards/roles.guard.ts` - Role-based protection
- `guards/permissions.guard.ts` - Permission-based protection
- `guards/tenant.guard.ts` - Multi-tenancy isolation
- `decorators/roles.decorator.ts` - @Roles() decorator
- `decorators/permissions.decorator.ts` - @Permissions() decorator

---

## Support

For questions or issues:
1. Check `ARCHITECTURE.md` for system design
2. Review `IMPLEMENTATION_STATUS.md` for progress
3. See example implementations in modules

---

**Version**: 1.0.0  
**Last Updated**: 2024-10-16
