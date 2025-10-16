# Clean Architecture - HMS Module Structure

## 🏗️ Architecture Layers

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │  Controllers, DTOs, Routes
├─────────────────────────────────────────┤
│         Application Layer               │  Use Cases, Business Logic
├─────────────────────────────────────────┤
│         Domain Layer                    │  Entities, Interfaces
├─────────────────────────────────────────┤
│         Infrastructure Layer            │  Database, External Services
└─────────────────────────────────────────┘
```

---

## 📁 Backend Structure (NestJS)

```
apps/api/src/
├── core/                                    # Business Logic (Domain + Application)
│   ├── domain/                             # Domain Layer
│   │   ├── entities/                       # Domain entities
│   │   ├── repositories/                   # Repository interfaces
│   │   └── value-objects/                  # Value objects
│   │
│   └── use-cases/                          # Application Layer
│       ├── patients/
│       ├── appointments/
│       └── ...
│
├── infrastructure/                          # External Dependencies
│   ├── database/
│   │   ├── prisma/
│   │   └── repositories/                   # Repository implementations
│   ├── external-services/
│   └── config/
│
├── modules/                                 # Presentation Layer (Feature Modules)
│   ├── auth/
│   ├── patients/
│   ├── appointments/
│   └── ... (20+ modules)
│
└── shared/                                  # Shared utilities
    ├── decorators/
    ├── guards/
    ├── interceptors/
    └── utils/
```

---

## 📦 Module Template (Self-Contained)

### Backend Module Structure

```
modules/patients/
├── patients.module.ts                       # Module definition
├── controllers/
│   └── patients.controller.ts              # HTTP endpoints
├── dto/
│   ├── create-patient.dto.ts               # Input validation
│   ├── update-patient.dto.ts
│   └── patient-response.dto.ts             # Output format
└── mappers/
    └── patient.mapper.ts                   # Entity ↔ DTO conversion
```

### Frontend Module Structure

```
app/(dashboard)/patients/
├── page.tsx                                 # List page
├── [id]/
│   ├── page.tsx                            # Detail page
│   ├── edit/
│   │   └── page.tsx                        # Edit page
│   └── appointments/
│       └── page.tsx                        # Related feature
└── new/
    └── page.tsx                            # Create page

components/features/patients/
├── patient-list.tsx                         # List component
├── patient-card.tsx                         # Card component
├── patient-form.tsx                         # Form component
└── patient-details.tsx                      # Details component

hooks/
└── use-patients.ts                          # Data fetching hook

lib/api/services/
└── patients.service.ts                      # API calls

stores/
└── patients-store.ts                        # State management (optional)
```

---

## 🔧 Complete Module List (20+ Modules)

### Core Medical Modules
1. **patients** - Patient management
2. **appointments** - Appointment scheduling
3. **staff** - Staff management
4. **laboratory** - Lab tests & results
5. **pharmacy** - Medications & prescriptions
6. **radiology** - Imaging & scans
7. **pathology** - Pathology tests
8. **emr** - Electronic Medical Records

### Department Modules
9. **opd** - Outpatient Department
10. **ipd** - Inpatient Department (admissions, beds)
11. **emergency** - Emergency & triage
12. **surgery** - Surgery scheduling & records

### Business Modules
13. **billing** - Invoices & payments
14. **finance** - Financial management
15. **insurance** - Insurance claims
16. **inventory** - Stock management

### Support Modules
17. **hr** - Human Resources
18. **communications** - Notifications (SMS, Email)
19. **reports** - Analytics & reporting
20. **patient-portal** - Patient self-service
21. **telemedicine** - Virtual consultations
22. **quality** - Quality assurance
23. **research** - Research data
24. **integration** - Third-party integrations
25. **ai-assistant** - AI clinical assistant

---

## 📝 Implementation Examples

### 1. Backend Module Example (Patients)

```typescript
// modules/patients/patients.module.ts
import { Module } from '@nestjs/common';
import { PatientsController } from './controllers/patients.controller';
import { CreatePatientUseCase } from '@/core/use-cases/patients/create-patient.use-case';
import { PatientRepository } from '@/infrastructure/database/repositories/patient.repository';
import { PrismaModule } from '@/infrastructure/database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PatientsController],
  providers: [
    CreatePatientUseCase,
    PatientRepository,
  ],
  exports: [CreatePatientUseCase],
})
export class PatientsModule {}

// modules/patients/controllers/patients.controller.ts
@Controller('patients')
@UseGuards(JwtAuthGuard, TenantGuard)
export class PatientsController {
  constructor(
    private readonly createPatientUseCase: CreatePatientUseCase,
  ) {}

  @Post()
  @Roles(Role.ADMIN, Role.DOCTOR)
  async create(@Body() dto: CreatePatientDto, @CurrentUser() user: User) {
    return this.createPatientUseCase.execute(dto, user.tenantId);
  }
}

// core/use-cases/patients/create-patient.use-case.ts
@Injectable()
export class CreatePatientUseCase {
  constructor(private readonly patientRepo: PatientRepository) {}

  async execute(dto: CreatePatientDto, tenantId: string) {
    // Business logic here
    return this.patientRepo.create({ ...dto, tenantId });
  }
}
```

### 2. Frontend Module Example (Patients)

```typescript
// app/(dashboard)/patients/page.tsx
'use client';
import { PatientList } from '@/components/features/patients/patient-list';
import { usePatients } from '@/hooks/use-patients';

export default function PatientsPage() {
  const { data, isLoading } = usePatients();
  
  return <PatientList patients={data} loading={isLoading} />;
}

// hooks/use-patients.ts
import { useQuery } from '@tanstack/react-query';
import { patientsService } from '@/lib/api/services/patients.service';

export function usePatients(filters?: PatientFilters) {
  return useQuery({
    queryKey: ['patients', filters],
    queryFn: () => patientsService.getAll(filters),
  });
}

// lib/api/services/patients.service.ts
import { apiClient } from '../client';

export const patientsService = {
  getAll: (filters?: PatientFilters) => 
    apiClient.get('/patients', { params: filters }),
  
  getById: (id: string) => 
    apiClient.get(`/patients/${id}`),
  
  create: (data: CreatePatientDto) => 
    apiClient.post('/patients', data),
};
```

---

## 🎯 Key Principles

### 1. **Self-Contained Modules**
- Each module has its own controllers, DTOs, and mappers
- No cross-module dependencies (use shared interfaces)
- Can be developed/tested independently

### 2. **Dependency Inversion**
- Core layer doesn't depend on infrastructure
- Use interfaces for external dependencies
- Infrastructure implements core interfaces

### 3. **Single Responsibility**
- One module = one business domain
- Clear separation: Controller → Use Case → Repository

### 4. **Scalability**
- Add new modules without touching existing ones
- Shared code in `shared/` or `core/`
- Feature flags for gradual rollout

---

## 🚀 Migration Path

### Phase 1: Create Structure (Week 1)
```bash
# Create core directories
mkdir -p apps/api/src/core/{domain,use-cases}
mkdir -p apps/api/src/infrastructure/{database,external-services}

# Reorganize modules
# Move existing modules to new structure
```

### Phase 2: Refactor One Module (Week 2)
- Start with `patients` module
- Extract use cases from service
- Create repository interface
- Implement repository

### Phase 3: Apply to All Modules (Weeks 3-6)
- Refactor remaining modules one by one
- Test each module independently
- Update frontend to match

---

## 📚 Module Dependencies

```
auth → (base module, no dependencies)
patients → auth
appointments → patients, staff, auth
laboratory → patients, appointments
pharmacy → patients, prescriptions
billing → patients, appointments, services
...
```

**Rule:** Modules can only depend on:
1. Shared utilities
2. Core domain interfaces
3. Auth module (for authentication)

---

## ✅ Checklist for Each Module

- [ ] Module is in correct layer
- [ ] Has clear single responsibility
- [ ] DTOs for input validation
- [ ] Use cases for business logic
- [ ] Repository for data access
- [ ] Controller only handles HTTP
- [ ] Mappers for entity ↔ DTO
- [ ] Unit tests for use cases
- [ ] E2E tests for endpoints
- [ ] Frontend components separated
- [ ] API service for data fetching
- [ ] Custom hooks for state
- [ ] Documentation updated

---

This structure ensures each module is independent, testable, and can scale without breaking others.
