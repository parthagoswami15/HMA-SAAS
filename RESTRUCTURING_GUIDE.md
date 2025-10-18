# HMS Restructuring Guide

## 🎯 Goal
Transform the current HMS application into an enterprise-grade, layered architecture following healthcare industry best practices.

---

## 📋 Current vs. Target Structure

### Current Structure
```
HMS/
├── apps/
│   ├── web/       # Frontend (Next.js)
│   └── api/       # Backend (might be minimal)
├── packages/
└── docs/
```

### Target Structure
```
HMS/
├── 1_core/        # Core Platform Layer
├── 2_modules/     # Application Modules
├── 3_data/        # Data Layer
├── 4_integrations/# Integration Layer
├── 5_frontend/    # Frontend Layer
├── 6_infrastructure/ # Infra & DevOps
├── 7_security/    # Security & Compliance
└── docs/          # Documentation
```

---

## 🚀 Migration Steps

### Phase 1: Setup New Structure (Week 1)

#### Step 1.1: Create Directory Structure

```bash
# Navigate to HMS root
cd C:\Users\HP\Desktop\HMS

# Create core layer directories
mkdir -p apps\api\src\core\auth
mkdir -p apps\api\src\core\rbac\guards
mkdir -p apps\api\src\core\rbac\decorators
mkdir -p apps\api\src\core\tenant
mkdir -p apps\api\src\core\gateway
mkdir -p apps\api\src\core\audit
mkdir -p apps\api\src\core\notifications\email
mkdir -p apps\api\src\core\notifications\sms
mkdir -p apps\api\src\core\notifications\push

# Create modules layer
mkdir -p apps\api\src\modules\patient-management\dto
mkdir -p apps\api\src\modules\patient-management\demographics
mkdir -p apps\api\src\modules\patient-management\medical-history
mkdir -p apps\api\src\modules\patient-management\emr
mkdir -p apps\api\src\modules\patient-management\encounters
mkdir -p apps\api\src\modules\patient-management\documents

mkdir -p apps\api\src\modules\appointments\scheduling
mkdir -p apps\api\src\modules\appointments\booking
mkdir -p apps\api\src\modules\appointments\teleconsultation

mkdir -p apps\api\src\modules\opd\queue
mkdir -p apps\api\src\modules\opd\prescriptions
mkdir -p apps\api\src\modules\opd\billing
mkdir -p apps\api\src\modules\opd\followup

mkdir -p apps\api\src\modules\ipd\admission
mkdir -p apps\api\src\modules\ipd\bed-management
mkdir -p apps\api\src\modules\ipd\orders
mkdir -p apps\api\src\modules\ipd\nursing
mkdir -p apps\api\src\modules\ipd\discharge

mkdir -p apps\api\src\modules\laboratory\test-catalog
mkdir -p apps\api\src\modules\laboratory\sample
mkdir -p apps\api\src\modules\laboratory\results
mkdir -p apps\api\src\modules\laboratory\reports
mkdir -p apps\api\src\modules\laboratory\integration

mkdir -p apps\api\src\modules\pharmacy\catalog
mkdir -p apps\api\src\modules\pharmacy\inventory
mkdir -p apps\api\src\modules\pharmacy\dispensing
mkdir -p apps\api\src\modules\pharmacy\purchase

mkdir -p apps\api\src\modules\billing\invoices
mkdir -p apps\api\src\modules\billing\payments
mkdir -p apps\api\src\modules\billing\insurance
mkdir -p apps\api\src\modules\billing\accounting

# Create data layer
mkdir -p apps\api\src\database\entities
mkdir -p apps\api\src\database\repositories
mkdir -p apps\api\src\cache
mkdir -p apps\api\src\search\indices
mkdir -p apps\api\src\queue\processors
mkdir -p apps\api\src\queue\jobs
mkdir -p apps\api\src\storage\providers

# Create integration layer
mkdir -p apps\api\src\integrations\payment\providers
mkdir -p apps\api\src\integrations\messaging\providers
mkdir -p apps\api\src\integrations\insurance\providers
mkdir -p apps\api\src\integrations\lab-instruments\hl7
mkdir -p apps\api\src\integrations\lab-instruments\fhir
mkdir -p apps\api\src\integrations\lab-instruments\devices

# Create frontend structure
mkdir -p apps\web\src\app\(auth)
mkdir -p apps\web\src\app\(super-admin)
mkdir -p apps\web\src\app\(tenant-admin)
mkdir -p apps\web\src\app\(doctor)
mkdir -p apps\web\src\app\(nurse)
mkdir -p apps\web\src\app\(lab-technician)
mkdir -p apps\web\src\app\(pharmacist)
mkdir -p apps\web\src\app\(receptionist)
mkdir -p apps\web\src\app\(accountant)
mkdir -p apps\web\src\app\(patient-portal)

mkdir -p apps\web\src\components\core
mkdir -p apps\web\src\components\modules\patient
mkdir -p apps\web\src\components\modules\appointment
mkdir -p apps\web\src\components\modules\billing
mkdir -p apps\web\src\components\role-based\doctor
mkdir -p apps\web\src\components\role-based\nurse

# Create infrastructure
mkdir -p infrastructure\docker
mkdir -p infrastructure\kubernetes\deployments
mkdir -p infrastructure\terraform\aws
mkdir -p infrastructure\ci-cd\.github\workflows
mkdir -p infrastructure\monitoring\prometheus
mkdir -p infrastructure\monitoring\grafana\dashboards

# Create security layer
mkdir -p apps\api\src\security\encryption
mkdir -p apps\api\src\security\rls
mkdir -p apps\api\src\security\mfa
mkdir -p apps\api\src\security\sso
mkdir -p apps\api\src\security\audit
mkdir -p apps\api\src\security\compliance\hipaa
mkdir -p apps\api\src\security\compliance\gdpr
```

#### Step 1.2: Move Existing RBAC Files

```bash
# Move the RBAC provider we created
# From: apps/web/src/lib/rbac/RBACProvider.tsx
# To: Keep it but also create backend version

# Copy frontend RBAC
cp apps\web\src\lib\rbac\RBACProvider.tsx apps\web\src\lib\rbac\RBACProvider.backup.tsx

# We'll create a new backend RBAC structure
```

---

### Phase 2: Core Platform Layer (Weeks 1-2)

#### Create Authentication Service

```bash
# File: apps/api/src/core/auth/authentication.service.ts
```

```typescript
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthenticationService {
  constructor(private jwtService: JwtService) {}

  async validateUser(email: string, password: string) {
    // Implement user validation
    const user = await this.findUserByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role,
      tenantId: user.tenantId 
    };
    return {
      access_token: this.jwtService.sign(payload),
      user
    };
  }

  private async findUserByEmail(email: string) {
    // Implement database lookup
    return null;
  }
}
```

#### Create RBAC Guards

```bash
# File: apps/api/src/core/rbac/guards/roles.guard.ts
```

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role === role);
  }
}
```

#### Create Tenant Service

```bash
# File: apps/api/src/core/tenant/tenant.service.ts
```

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class TenantService {
  async createTenant(tenantData: CreateTenantDto) {
    // 1. Create tenant record
    // 2. Provision database schema (if using schema-based isolation)
    // 3. Set up default roles and permissions
    // 4. Create tenant admin user
    // 5. Initialize billing
    return tenant;
  }

  async getTenantById(tenantId: string) {
    // Fetch tenant details
    return tenant;
  }

  async updateTenantConfig(tenantId: string, config: any) {
    // Update tenant settings
    return tenant;
  }

  async getTenantByDomain(domain: string) {
    // Fetch tenant by custom domain
    return tenant;
  }
}
```

---

### Phase 3: Migrate Existing Modules (Weeks 3-6)

#### Step 3.1: Migrate Patient Module

```bash
# Current location: apps/web/src/app/patients/
# Target: apps/api/src/modules/patient-management/

# Create the module structure
```

```typescript
// apps/api/src/modules/patient-management/patient.module.ts
import { Module } from '@nestjs/common';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { DemographicsService } from './demographics/demographics.service';
import { MedicalHistoryService } from './medical-history/medical-history.service';
import { EMRService } from './emr/emr.service';
import { EncounterService } from './encounters/encounter.service';
import { DocumentService } from './documents/document.service';

@Module({
  controllers: [PatientController],
  providers: [
    PatientService,
    DemographicsService,
    MedicalHistoryService,
    EMRService,
    EncounterService,
    DocumentService,
  ],
  exports: [PatientService],
})
export class PatientModule {}
```

```typescript
// apps/api/src/modules/patient-management/patient.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/core/auth/jwt-auth.guard';
import { RolesGuard } from '@/core/rbac/guards/roles.guard';
import { PermissionsGuard } from '@/core/rbac/guards/permissions.guard';
import { Roles } from '@/core/rbac/decorators/roles.decorator';
import { Permissions } from '@/core/rbac/decorators/permissions.decorator';
import { UserRole } from '@/core/rbac/roles.enum';
import { Permission } from '@/core/rbac/permissions.enum';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Controller('patients')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get()
  @Permissions(Permission.VIEW_PATIENTS)
  async findAll() {
    return this.patientService.findAll();
  }

  @Get(':id')
  @Permissions(Permission.VIEW_PATIENTS)
  async findOne(@Param('id') id: string) {
    return this.patientService.findOne(id);
  }

  @Post()
  @Permissions(Permission.CREATE_PATIENTS)
  async create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientService.create(createPatientDto);
  }

  @Put(':id')
  @Permissions(Permission.UPDATE_PATIENTS)
  async update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientService.update(id, updatePatientDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Permissions(Permission.DELETE_PATIENTS)
  async remove(@Param('id') id: string) {
    return this.patientService.remove(id);
  }
}
```

#### Step 3.2: Create Module Service

```typescript
// apps/api/src/modules/patient-management/patient.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { AuditService } from '@/core/audit/audit-log.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  async findAll() {
    return this.prisma.patient.findMany({
      include: {
        demographics: true,
        medicalHistory: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.patient.findUnique({
      where: { id },
      include: {
        demographics: true,
        medicalHistory: true,
        encounters: true,
        documents: true,
      },
    });
  }

  async create(createPatientDto: CreatePatientDto) {
    const patient = await this.prisma.patient.create({
      data: createPatientDto,
    });

    await this.auditService.log({
      action: 'CREATE_PATIENT',
      resourceType: 'Patient',
      resourceId: patient.id,
      details: createPatientDto,
    });

    return patient;
  }

  async update(id: string, updatePatientDto: UpdatePatientDto) {
    const patient = await this.prisma.patient.update({
      where: { id },
      data: updatePatientDto,
    });

    await this.auditService.log({
      action: 'UPDATE_PATIENT',
      resourceType: 'Patient',
      resourceId: id,
      details: updatePatientDto,
    });

    return patient;
  }

  async remove(id: string) {
    await this.auditService.log({
      action: 'DELETE_PATIENT',
      resourceType: 'Patient',
      resourceId: id,
    });

    return this.prisma.patient.delete({
      where: { id },
    });
  }
}
```

---

### Phase 4: Frontend Role-Based Routing (Week 7)

#### Create Role-Based Layouts

```typescript
// apps/web/src/app/(doctor)/layout.tsx
'use client';

import { useRBAC, UserRole } from '@/lib/rbac/RBACProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import DoctorNavigation from '@/components/role-based/doctor/Navigation';

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useRBAC();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user?.role !== UserRole.DOCTOR) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (user?.role !== UserRole.DOCTOR) return null;

  return (
    <div>
      <DoctorNavigation />
      <main>{children}</main>
    </div>
  );
}
```

---

## 📝 Migration Checklist

### Backend

- [ ] Create core authentication service
- [ ] Implement RBAC guards and decorators
- [ ] Set up tenant management
- [ ] Create API gateway middleware
- [ ] Set up audit logging
- [ ] Implement notification services
- [ ] Migrate patient module
- [ ] Migrate appointments module
- [ ] Create OPD module
- [ ] Create IPD module
- [ ] Create laboratory module
- [ ] Create pharmacy module
- [ ] Create billing module
- [ ] Set up database entities
- [ ] Configure caching layer
- [ ] Set up search indexing
- [ ] Configure message queue
- [ ] Set up file storage

### Frontend

- [ ] Create role-based route groups
- [ ] Implement role-specific layouts
- [ ] Migrate dashboard pages
- [ ] Create modular components
- [ ] Set up role-based navigation
- [ ] Implement tenant switching
- [ ] Create patient portal
- [ ] Set up mobile apps structure

### Infrastructure

- [ ] Create Docker configurations
- [ ] Set up Kubernetes manifests
- [ ] Configure CI/CD pipelines
- [ ] Set up monitoring
- [ ] Configure logging
- [ ] Implement backup strategies

### Security

- [ ] Implement data encryption
- [ ] Set up RLS (Row-Level Security)
- [ ] Configure MFA
- [ ] Set up SSO integration
- [ ] Implement audit trails
- [ ] Document compliance (HIPAA/GDPR)

---

## 🎯 Testing Strategy

### Unit Tests
- Test each service independently
- Mock dependencies
- Aim for 80%+ coverage

### Integration Tests
- Test module interactions
- Test API endpoints
- Test database operations

### E2E Tests
- Test complete user workflows
- Test role-based access
- Test multi-tenancy

---

## 📚 Next Steps

1. **Review** the `ARCHITECTURE.md` file
2. **Start** with Phase 1 (Core Platform)
3. **Follow** the implementation priorities
4. **Test** each phase before moving forward
5. **Document** as you go

---

## 💡 Tips

- **Start Small**: Migrate one module at a time
- **Test Often**: Write tests as you migrate
- **Document**: Keep README files updated
- **Iterate**: Refine the structure as you learn
- **Ask for Help**: Refer to the architecture docs

---

**Good luck with your restructuring!** 🚀
