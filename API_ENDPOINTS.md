# HMS API Endpoints Documentation

## Authentication Endpoints

### Public Endpoints (No Auth Required)

#### `POST /auth/login`
Login with email and password
```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "tenantId": "uuid" // optional
}
```
**Response:**
```json
{
  "user": { "id": "...", "email": "...", "role": "..." },
  "tokens": {
    "accessToken": "jwt...",
    "refreshToken": "jwt...",
    "expiresIn": 900
  }
}
```

#### `POST /auth/register`
Register new user
```json
{
  "email": "newuser@example.com",
  "password": "Password123!",
  "firstName": "John",
  "lastName": "Doe",
  "tenantId": "uuid",
  "role": "PATIENT" // optional
}
```

#### `POST /auth/refresh`
Refresh access token
```json
{
  "refreshToken": "jwt..."
}
```

#### `POST /auth/password/reset-request`
Request password reset
```json
{
  "email": "user@example.com",
  "tenantId": "uuid"
}
```

#### `POST /auth/password/reset`
Reset password with token
```json
{
  "token": "reset-token",
  "newPassword": "NewPassword123!"
}
```

#### `GET /auth/verify-email/:token`
Verify email address

---

### Protected Endpoints (Require Auth)

#### `PATCH /auth/password/change`
Change password (authenticated users)
```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!"
}
```

#### `POST /auth/logout`
Logout current user

#### `GET /auth/me`
Get current user profile

---

## Tenant Endpoints

### Public Endpoints

#### `POST /tenants`
Create new tenant (self-registration)
```json
{
  "name": "My Hospital",
  "type": "hospital",
  "email": "contact@hospital.com",
  "subscriptionPlan": "FREE"
}
```

#### `GET /tenants/slug/:slug`
Get tenant by slug (for login page)

---

### Protected Endpoints

#### `GET /tenants`
**Permission:** `SUPER_ADMIN` role  
Get all tenants with pagination
```
Query params: ?page=1&limit=10&status=active
```

#### `GET /tenants/:id`
**Permission:** `VIEW_TENANT`  
Get tenant by ID

#### `PATCH /tenants/:id`
**Permission:** `UPDATE_TENANT`  
Update tenant details
```json
{
  "name": "Updated Hospital Name",
  "email": "newemail@hospital.com",
  "settings": { "timezone": "America/New_York" }
}
```

#### `POST /tenants/:id/activate`
**Permission:** `SUPER_ADMIN` role  
Activate tenant

#### `POST /tenants/:id/suspend`
**Permission:** `SUPER_ADMIN` role  
Suspend tenant
```json
{
  "reason": "Payment overdue"
}
```

#### `POST /tenants/:id/deactivate`
**Permission:** `SUPER_ADMIN` role  
Deactivate tenant

#### `PATCH /tenants/:id/subscription`
**Permission:** `MANAGE_TENANT_BILLING`  
Update subscription plan
```json
{
  "plan": "PROFESSIONAL",
  "startDate": "2025-01-01T00:00:00Z",
  "endDate": "2026-01-01T00:00:00Z"
}
```

#### `GET /tenants/:id/limits/:resource`
**Permission:** `VIEW_TENANT`  
Check resource limits (e.g., Users, Patients)

#### `DELETE /tenants/:id`
**Permission:** `SUPER_ADMIN` role  
Soft delete tenant

---

## Audit Endpoints

All audit endpoints require authentication and `VIEW_AUDIT_LOGS` permission.

#### `GET /audit/logs`
Query audit logs with filters
```
Query params:
?tenantId=uuid
&userId=uuid
&action=CREATE
&entityType=PATIENT
&startDate=2025-01-01
&endDate=2025-01-31
&isSuspicious=true
&page=1
&limit=50
```

#### `GET /audit/entity/:entityType/:entityId`
Get audit trail for specific entity
```
Example: GET /audit/entity/PATIENT/uuid-123
Query params: ?tenantId=uuid
```

#### `GET /audit/user/:userId`
Get user activity history
```
Query params: ?tenantId=uuid&limit=100
```

#### `GET /audit/suspicious`
Get suspicious activities
```
Query params: ?tenantId=uuid&limit=50
```

#### `GET /audit/review`
Get activities requiring review
```
Query params: ?tenantId=uuid&limit=50
```

#### `POST /audit/statistics`
Get audit statistics
```json
{
  "tenantId": "uuid",
  "startDate": "2025-01-01T00:00:00Z",
  "endDate": "2025-01-31T23:59:59Z"
}
```
**Response:**
```json
{
  "totalLogs": 15420,
  "byAction": {
    "CREATE": 3200,
    "READ": 8500,
    "UPDATE": 2800,
    "DELETE": 920
  },
  "byEntityType": {
    "PATIENT": 5000,
    "APPOINTMENT": 4200,
    "MEDICAL_RECORD": 3100
  },
  "suspiciousCount": 12,
  "sensitiveAccessCount": 450
}
```

#### `POST /audit/logs/:id/reviewed`
**Permission:** `MANAGE_AUDIT_LOGS`  
Mark audit log as reviewed
```json
{
  "reviewedBy": "user-uuid"
}
```

---

## Authentication Headers

All protected endpoints require:
```
Authorization: Bearer <access-token>
```

Optional tenant context (for super admin accessing specific tenant data):
```
X-Tenant-Id: <tenant-uuid>
```

---

## Response Formats

### Success Response
```json
{
  "data": { ... },
  "message": "Success message"
}
```

### Error Response
```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request"
}
```

### Validation Error
```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than 8 characters"
  ],
  "error": "Bad Request"
}
```

---

## RBAC Guards Usage

### Role-Based Protection
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.DOCTOR, UserRole.NURSE)
@Get('patients')
async getPatients() { ... }
```

### Permission-Based Protection
```typescript
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Permissions(Permission.VIEW_PATIENTS)
@Get('patients')
async getPatients() { ... }
```

### Combined Protection
```typescript
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@Permissions(Permission.CREATE_APPOINTMENTS)
@Post('appointments')
async createAppointment() { ... }
```

### Public Endpoints
```typescript
@Public()
@Post('login')
async login() { ... }
```

---

## Next Steps

1. **Database Setup**: Configure TypeORM and run migrations
2. **Test Endpoints**: Use Postman/Insomnia to test
3. **Add Patient Module**: First application module
4. **Integrate Frontend**: Connect to API endpoints

---

## Environment Variables Required

See `.env.example` for all required configuration:
- `JWT_ACCESS_TOKEN_SECRET`
- `JWT_REFRESH_TOKEN_SECRET`
- `DATABASE_*` variables
- `SMTP_*` for emails
- And more...

---

**Status**: Phase 4 Complete - Controllers & DTOs Ready ✅
