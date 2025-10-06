# HMS SaaS API - Module Restoration Plan

## Current Status ✅
- **Backend server is running successfully** on http://localhost:3001
- **Zero TypeScript compilation errors**
- **Core infrastructure working**: Database (Prisma), Configuration (Joi), Rate Limiting, CORS
- **Basic endpoints available**: `/` (API info) and `/health` (health check)

## Temporarily Moved Modules
The following modules were moved to `../temp_modules/` to resolve compilation issues:

### Core System Modules
- `admin-tenant/` - Tenant administration and management
- `auth/` - Authentication and authorization system  
- `common/` - Shared utilities, guards, interceptors, filters
- `audit/` - Audit logging and compliance tracking

### Healthcare Modules
- `appointments/` - Appointment scheduling and management
- `billing/` - Invoice and payment processing
- `chambers/` - Medical chamber management
- `emergency/` - Emergency case handling
- `patients/` - Patient data management
- `users/` - User management system

### Specialty Modules
- `ai-assistive/` - AI-powered medical assistance
- `compliance/` - Regulatory compliance features
- `ipd/`, `opd/` - In-patient/Out-patient management
- `lab/`, `radiology/` - Laboratory and imaging services
- `pharmacy/` - Pharmacy management
- `telemedicine/` - Telehealth services

### Infrastructure Modules
- `devops-sre/` - DevOps and site reliability
- `export/` - Data export functionality
- `file-storage/` - File upload and management
- `integrations/` - Third-party integrations
- `notifications/` - Notification system
- `reports/` - Reporting and analytics

## Restoration Strategy

### Phase 1: Core Foundation (Week 1)
**Priority: CRITICAL**
1. **Common Module** - Shared utilities, guards, interceptors
   - Fix import paths to match current structure
   - Update Prisma field references to match schema
   - Test: Guards, interceptors work correctly

2. **Auth Module** - Authentication system
   - Fix JWT strategies and guards
   - Update user model references
   - Fix refresh token field names (`isRevoked` → `revoked`)
   - Test: Login/logout, token validation

3. **Users Module** - User management
   - Align user fields with Prisma schema
   - Fix role enums (`OWNER` doesn't exist)
   - Test: User CRUD operations

### Phase 2: Essential Healthcare (Week 2)
**Priority: HIGH**
4. **Patients Module** - Patient management
   - Fix patient model field mismatches
   - Update missing fields (dataLocalized, isVIP, etc.)
   - Test: Patient registration and data management

5. **Tenants Module** - Multi-tenancy
   - Fix tenant model inconsistencies
   - Remove non-existent fields (description, enabledModules, etc.)
   - Test: Tenant creation and management

6. **Appointments Module** - Core scheduling
   - Fix missing models (schedule, slot, booking, etc.)
   - Update Prisma schema to include required appointment tables
   - Test: Appointment booking flow

### Phase 3: Business Logic (Week 3)
**Priority: MEDIUM**
7. **Billing Module** - Financial operations
   - Fix payment model mismatches
   - Add missing invoice fields
   - Test: Invoice generation and payment processing

8. **Audit Module** - Compliance tracking
   - Fix audit log model fields
   - Update timestamp field references
   - Test: Audit trail generation

### Phase 4: Advanced Features (Week 4+)
**Priority: LOW**
9. **Specialty Modules** (AI, Lab, Radiology, etc.)
   - Add missing database models
   - Fix service references
   - Test: Feature-specific functionality

10. **Infrastructure Modules** (DevOps, Export, etc.)
    - Update to work with current architecture
    - Fix integration points
    - Test: System reliability features

## Database Schema Updates Required

### Missing Tables (to be added to Prisma schema):
```prisma
model Schedule { ... }
model Slot { ... }
model Booking { ... }
model Counter { ... }
model Token { ... }
model Reminder { ... }
model AppointmentConfig { ... }
// ... and many others
```

### Field Updates Needed:
- RefreshToken: `isRevoked` → `revoked`, remove `reason` field
- Tenant: Remove `description`, `enabledModules`, `storageQuota`, etc.
- User: Remove `password` field, fix role enum
- Patient: Add `dataLocalized`, `isVIP`, etc.
- Invoice: Add `visitId`, `paidAmount`, `gstAmount`, etc.

## Testing Strategy
1. **Unit Tests**: Each module's services and controllers
2. **Integration Tests**: Module interactions  
3. **E2E Tests**: Complete user workflows
4. **Database Tests**: Schema compatibility

## Success Criteria
- [ ] All modules compile without TypeScript errors
- [ ] Database schema matches code expectations
- [ ] All endpoints return proper responses
- [ ] Authentication and authorization work end-to-end
- [ ] Core healthcare workflows functional

## Tools and Commands
```bash
# Start with working minimal version
npm run start:dev

# Add modules one by one from temp_modules
mv ../temp_modules/common src/

# Check compilation after each addition
npm run build

# Update Prisma schema as needed
npx prisma generate
npx prisma db push

# Run tests
npm test
```

## Risk Mitigation
- Keep backups of working state after each phase
- Test thoroughly before moving to next phase  
- Update documentation as modules are restored
- Maintain compatibility with existing API contracts