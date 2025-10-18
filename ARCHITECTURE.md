# HMS Architecture Documentation

## Overview
This document outlines the layered architecture of the Hospital Management System (HMS), designed for scalability, multi-tenancy, and compliance with healthcare standards.

---

## 🏗️ Architecture Layers

### 1. Core Platform Layer
**Purpose**: Foundational services that support all other layers

```
apps/api/src/core/
├── auth/
│   ├── authentication.service.ts
│   ├── authorization.service.ts
│   ├── jwt.strategy.ts
│   ├── oauth.strategy.ts
│   └── token.service.ts
├── rbac/
│   ├── roles.enum.ts
│   ├── permissions.enum.ts
│   ├── role-permission.service.ts
│   ├── guards/
│   │   ├── roles.guard.ts
│   │   ├── permissions.guard.ts
│   │   └── tenant.guard.ts
│   └── decorators/
│       ├── roles.decorator.ts
│       └── permissions.decorator.ts
├── tenant/
│   ├── tenant.service.ts
│   ├── tenant-provisioning.service.ts
│   ├── tenant-config.service.ts
│   ├── tenant-billing.service.ts
│   └── tenant-isolation.middleware.ts
├── gateway/
│   ├── api-gateway.service.ts
│   ├── rate-limiter.middleware.ts
│   └── request-logger.middleware.ts
├── audit/
│   ├── audit-log.service.ts
│   ├── activity-tracker.service.ts
│   └── compliance-logger.service.ts
└── notifications/
    ├── notification.service.ts
    ├── email/
    │   ├── email.service.ts
    │   └── email.templates.ts
    ├── sms/
    │   ├── sms.service.ts
    │   └── sms.provider.ts
    └── push/
        ├── push.service.ts
        └── fcm.service.ts
```

---

### 2. Application Modules Layer
**Purpose**: Core business logic and domain-specific features

```
apps/api/src/modules/
├── patient-management/
│   ├── patient.module.ts
│   ├── patient.controller.ts
│   ├── patient.service.ts
│   ├── patient.entity.ts
│   ├── dto/
│   │   ├── create-patient.dto.ts
│   │   ├── update-patient.dto.ts
│   │   └── patient-query.dto.ts
│   ├── demographics/
│   │   ├── demographics.service.ts
│   │   └── demographics.entity.ts
│   ├── medical-history/
│   │   ├── medical-history.service.ts
│   │   └── medical-history.entity.ts
│   ├── emr/
│   │   ├── emr.service.ts
│   │   ├── emr.entity.ts
│   │   └── emr-templates.ts
│   ├── encounters/
│   │   ├── encounter.service.ts
│   │   └── encounter.entity.ts
│   └── documents/
│       ├── document.service.ts
│       ├── document.entity.ts
│       └── document-storage.service.ts
│
├── appointments/
│   ├── appointment.module.ts
│   ├── appointment.controller.ts
│   ├── appointment.service.ts
│   ├── appointment.entity.ts
│   ├── scheduling/
│   │   ├── schedule.service.ts
│   │   ├── availability.service.ts
│   │   └── calendar.service.ts
│   ├── booking/
│   │   ├── online-booking.service.ts
│   │   └── booking-confirmation.service.ts
│   └── teleconsultation/
│       ├── teleconsult.service.ts
│       └── video-provider.integration.ts
│
├── opd/
│   ├── opd.module.ts
│   ├── opd.controller.ts
│   ├── opd.service.ts
│   ├── queue/
│   │   ├── queue-management.service.ts
│   │   └── queue.entity.ts
│   ├── prescriptions/
│   │   ├── prescription.service.ts
│   │   ├── prescription.entity.ts
│   │   └── drug-interaction.service.ts
│   ├── billing/
│   │   ├── opd-billing.service.ts
│   │   └── opd-invoice.entity.ts
│   └── followup/
│       ├── followup.service.ts
│       └── followup-tracker.service.ts
│
├── ipd/
│   ├── ipd.module.ts
│   ├── ipd.controller.ts
│   ├── ipd.service.ts
│   ├── admission/
│   │   ├── admission.service.ts
│   │   └── admission.entity.ts
│   ├── bed-management/
│   │   ├── bed.service.ts
│   │   ├── ward.service.ts
│   │   └── bed-allocation.service.ts
│   ├── orders/
│   │   ├── order.service.ts
│   │   ├── order.entity.ts
│   │   └── order-execution.service.ts
│   ├── nursing/
│   │   ├── nursing-notes.service.ts
│   │   ├── vitals.service.ts
│   │   └── nursing-assessment.entity.ts
│   └── discharge/
│       ├── discharge.service.ts
│       ├── discharge-summary.entity.ts
│       └── discharge-billing.service.ts
│
├── laboratory/
│   ├── lab.module.ts
│   ├── lab.controller.ts
│   ├── lab.service.ts
│   ├── test-catalog/
│   │   ├── test.service.ts
│   │   ├── test.entity.ts
│   │   └── test-parameters.service.ts
│   ├── sample/
│   │   ├── sample-collection.service.ts
│   │   ├── sample-tracking.service.ts
│   │   └── sample.entity.ts
│   ├── results/
│   │   ├── result-entry.service.ts
│   │   ├── result-validation.service.ts
│   │   └── result.entity.ts
│   ├── reports/
│   │   ├── lab-report.service.ts
│   │   └── report-approval.service.ts
│   └── integration/
│       ├── hl7.service.ts
│       ├── fhir.service.ts
│       └── instrument-interface.service.ts
│
├── pharmacy/
│   ├── pharmacy.module.ts
│   ├── pharmacy.controller.ts
│   ├── pharmacy.service.ts
│   ├── catalog/
│   │   ├── drug.service.ts
│   │   ├── drug.entity.ts
│   │   └── drug-formulary.service.ts
│   ├── inventory/
│   │   ├── stock.service.ts
│   │   ├── batch.service.ts
│   │   ├── expiry-tracking.service.ts
│   │   └── inventory.entity.ts
│   ├── dispensing/
│   │   ├── dispensing.service.ts
│   │   ├── sales.service.ts
│   │   └── dispensing-validation.service.ts
│   └── purchase/
│       ├── purchase-order.service.ts
│       ├── supplier.service.ts
│       └── procurement.entity.ts
│
├── billing/
│   ├── billing.module.ts
│   ├── billing.controller.ts
│   ├── billing.service.ts
│   ├── invoices/
│   │   ├── invoice.service.ts
│   │   ├── invoice.entity.ts
│   │   └── invoice-generation.service.ts
│   ├── payments/
│   │   ├── payment.service.ts
│   │   ├── receipt.service.ts
│   │   └── payment.entity.ts
│   ├── insurance/
│   │   ├── insurance.service.ts
│   │   ├── claims.service.ts
│   │   └── insurance-provider.entity.ts
│   └── accounting/
│       ├── accounting.service.ts
│       ├── ledger.service.ts
│       └── financial-report.service.ts
│
├── inventory/
│   ├── inventory.module.ts
│   ├── inventory.controller.ts
│   ├── inventory.service.ts
│   ├── reagents/
│   │   ├── reagent.service.ts
│   │   └── reagent.entity.ts
│   ├── consumables/
│   │   ├── consumable.service.ts
│   │   └── consumable.entity.ts
│   ├── purchase/
│   │   ├── purchase-order.service.ts
│   │   └── po.entity.ts
│   ├── movement/
│   │   ├── stock-movement.service.ts
│   │   └── movement-log.entity.ts
│   └── alerts/
│       ├── expiry-alert.service.ts
│       ├── threshold-alert.service.ts
│       └── alert-notification.service.ts
│
├── reporting/
│   ├── reporting.module.ts
│   ├── reporting.controller.ts
│   ├── reporting.service.ts
│   ├── operational/
│   │   ├── operational-reports.service.ts
│   │   └── kpi-calculator.service.ts
│   ├── clinical/
│   │   ├── clinical-dashboard.service.ts
│   │   └── clinical-metrics.service.ts
│   ├── financial/
│   │   ├── financial-analytics.service.ts
│   │   └── revenue-report.service.ts
│   └── audit/
│       ├── audit-reports.service.ts
│       └── compliance-reports.service.ts
│
└── communication/
    ├── communication.module.ts
    ├── messaging/
    │   ├── internal-chat.service.ts
    │   ├── message.entity.ts
    │   └── websocket.gateway.ts
    ├── notifications/
    │   ├── user-notification.service.ts
    │   └── notification-preferences.service.ts
    └── patient-portal/
        ├── patient-portal.service.ts
        └── portal-access.service.ts
```

---

### 3. Data Layer
**Purpose**: Data persistence, caching, search, and message queuing

```
apps/api/src/database/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   ├── seeds/
│   │   ├── tenants.seed.ts
│   │   ├── users.seed.ts
│   │   ├── roles.seed.ts
│   │   └── permissions.seed.ts
│   └── generated/
│
├── entities/
│   ├── tenant.entity.ts
│   ├── user.entity.ts
│   ├── role.entity.ts
│   ├── permission.entity.ts
│   ├── patient.entity.ts
│   ├── appointment.entity.ts
│   ├── encounter.entity.ts
│   ├── lab-order.entity.ts
│   ├── lab-result.entity.ts
│   ├── prescription.entity.ts
│   ├── inventory.entity.ts
│   ├── invoice.entity.ts
│   ├── payment.entity.ts
│   └── audit-log.entity.ts
│
├── repositories/
│   ├── base.repository.ts
│   ├── tenant.repository.ts
│   ├── patient.repository.ts
│   └── [module].repository.ts
│
└── migrations/
    └── [timestamp]-[description].ts

apps/api/src/cache/
├── redis.service.ts
├── cache.module.ts
├── cache-keys.constant.ts
└── cache.decorator.ts

apps/api/src/search/
├── elasticsearch.service.ts
├── search.module.ts
├── indices/
│   ├── patient.index.ts
│   ├── appointment.index.ts
│   └── document.index.ts
└── search-query.builder.ts

apps/api/src/queue/
├── queue.module.ts
├── queue.service.ts
├── processors/
│   ├── email.processor.ts
│   ├── sms.processor.ts
│   ├── report.processor.ts
│   └── backup.processor.ts
└── jobs/
    ├── notification.job.ts
    └── data-sync.job.ts

apps/api/src/storage/
├── storage.module.ts
├── storage.service.ts
├── providers/
│   ├── s3.provider.ts
│   ├── gcs.provider.ts
│   └── azure-blob.provider.ts
└── file-upload.service.ts
```

---

### 4. Integration Layer
**Purpose**: External service integrations

```
apps/api/src/integrations/
├── payment/
│   ├── payment-gateway.module.ts
│   ├── payment-gateway.interface.ts
│   ├── providers/
│   │   ├── stripe.provider.ts
│   │   ├── razorpay.provider.ts
│   │   └── paypal.provider.ts
│   └── payment-webhook.controller.ts
│
├── messaging/
│   ├── sms-gateway.module.ts
│   ├── sms-gateway.interface.ts
│   ├── providers/
│   │   ├── twilio.provider.ts
│   │   ├── msg91.provider.ts
│   │   └── aws-sns.provider.ts
│   └── email-gateway.module.ts
│
├── insurance/
│   ├── insurance-api.module.ts
│   ├── insurance-api.service.ts
│   ├── providers/
│   │   ├── insurance-provider-a.ts
│   │   └── insurance-provider-b.ts
│   └── claim-submission.service.ts
│
├── lab-instruments/
│   ├── instrument-interface.module.ts
│   ├── instrument-adapter.interface.ts
│   ├── hl7/
│   │   ├── hl7-parser.service.ts
│   │   ├── hl7-sender.service.ts
│   │   └── hl7-receiver.service.ts
│   ├── fhir/
│   │   ├── fhir-client.service.ts
│   │   └── fhir-resources.mapper.ts
│   └── devices/
│       ├── analyzer-adapter.ts
│       └── device-registry.service.ts
│
├── government/
│   ├── health-api.module.ts
│   ├── health-api.service.ts
│   └── compliance-reporting.service.ts
│
└── analytics/
    ├── bi-tools.module.ts
    ├── bi-export.service.ts
    └── providers/
        ├── tableau.provider.ts
        └── power-bi.provider.ts
```

---

### 5. Frontend Layer
**Purpose**: User interfaces for different roles

```
apps/web/src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   │
│   ├── (super-admin)/
│   │   ├── tenants/
│   │   ├── billing/
│   │   ├── system-settings/
│   │   └── platform-analytics/
│   │
│   ├── (tenant-admin)/
│   │   ├── dashboard/
│   │   ├── users/
│   │   ├── departments/
│   │   ├── settings/
│   │   └── reports/
│   │
│   ├── (doctor)/
│   │   ├── dashboard/
│   │   ├── patients/
│   │   ├── appointments/
│   │   ├── consultations/
│   │   ├── prescriptions/
│   │   └── orders/
│   │
│   ├── (nurse)/
│   │   ├── dashboard/
│   │   ├── patients/
│   │   ├── vitals/
│   │   ├── medication-administration/
│   │   └── nursing-notes/
│   │
│   ├── (lab-technician)/
│   │   ├── dashboard/
│   │   ├── sample-collection/
│   │   ├── result-entry/
│   │   └── reports/
│   │
│   ├── (pharmacist)/
│   │   ├── dashboard/
│   │   ├── prescriptions/
│   │   ├── dispensing/
│   │   ├── inventory/
│   │   └── stock-management/
│   │
│   ├── (receptionist)/
│   │   ├── dashboard/
│   │   ├── registration/
│   │   ├── appointments/
│   │   └── billing/
│   │
│   ├── (accountant)/
│   │   ├── dashboard/
│   │   ├── invoices/
│   │   ├── payments/
│   │   ├── insurance-claims/
│   │   └── financial-reports/
│   │
│   └── (patient-portal)/
│       ├── dashboard/
│       ├── my-records/
│       ├── appointments/
│       ├── prescriptions/
│       ├── lab-results/
│       └── billing/
│
├── components/
│   ├── core/
│   ├── modules/
│   │   ├── patient/
│   │   ├── appointment/
│   │   ├── billing/
│   │   └── [module]/
│   ├── role-based/
│   │   ├── doctor/
│   │   ├── nurse/
│   │   └── [role]/
│   └── shared/
│
├── lib/
│   ├── api/
│   ├── auth/
│   ├── rbac/
│   ├── storage/
│   └── utils/
│
└── styles/

apps/mobile/
├── doctor-app/
│   ├── src/
│   ├── android/
│   └── ios/
├── patient-app/
│   ├── src/
│   ├── android/
│   └── ios/
└── pharmacy-lab-app/
    ├── src/
    ├── android/
    └── ios/
```

---

### 6. Infrastructure Layer

```
infrastructure/
├── docker/
│   ├── Dockerfile.api
│   ├── Dockerfile.web
│   ├── docker-compose.yml
│   └── docker-compose.prod.yml
│
├── kubernetes/
│   ├── namespaces/
│   ├── deployments/
│   │   ├── api-deployment.yaml
│   │   ├── web-deployment.yaml
│   │   ├── postgres-deployment.yaml
│   │   └── redis-deployment.yaml
│   ├── services/
│   ├── ingress/
│   ├── configmaps/
│   ├── secrets/
│   └── helm/
│       └── hms-chart/
│
├── terraform/
│   ├── aws/
│   ├── gcp/
│   └── azure/
│
├── ci-cd/
│   ├── .github/
│   │   └── workflows/
│   │       ├── api-ci.yml
│   │       ├── web-ci.yml
│   │       ├── deploy-staging.yml
│   │       └── deploy-production.yml
│   └── .gitlab-ci.yml
│
├── monitoring/
│   ├── prometheus/
│   │   └── prometheus.yml
│   ├── grafana/
│   │   └── dashboards/
│   ├── elk/
│   │   ├── elasticsearch.yml
│   │   ├── logstash.conf
│   │   └── kibana.yml
│   └── opentelemetry/
│       └── otel-collector-config.yaml
│
└── backup/
    ├── scripts/
    │   ├── db-backup.sh
    │   ├── tenant-backup.sh
    │   └── restore.sh
    └── policies/
        └── retention-policy.md
```

---

### 7. Security & Compliance

```
apps/api/src/security/
├── encryption/
│   ├── encryption.service.ts
│   ├── data-encryption.service.ts
│   └── field-encryption.decorator.ts
│
├── rls/
│   ├── row-level-security.middleware.ts
│   ├── data-isolation.service.ts
│   └── tenant-filter.decorator.ts
│
├── mfa/
│   ├── mfa.service.ts
│   ├── totp.service.ts
│   └── sms-verification.service.ts
│
├── sso/
│   ├── sso.module.ts
│   ├── saml.strategy.ts
│   └── oidc.strategy.ts
│
├── audit/
│   ├── audit-interceptor.ts
│   ├── access-log.service.ts
│   └── compliance-audit.service.ts
│
└── compliance/
    ├── hipaa/
    │   ├── hipaa-compliance.md
    │   └── hipaa-audit.service.ts
    └── gdpr/
        ├── gdpr-compliance.md
        └── data-protection.service.ts

docs/security/
├── data-encryption.md
├── access-control.md
├── security-headers.md
└── compliance-checklist.md
```

---

### 8. User Roles & Permissions

```typescript
// apps/api/src/core/rbac/roles.enum.ts
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  TENANT_ADMIN = 'TENANT_ADMIN',
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  LAB_TECHNICIAN = 'LAB_TECHNICIAN',
  PHARMACIST = 'PHARMACIST',
  RECEPTIONIST = 'RECEPTIONIST',
  ACCOUNTANT = 'ACCOUNTANT',
  PATIENT = 'PATIENT',
  VENDOR = 'VENDOR',
}

// apps/api/src/core/rbac/permissions.enum.ts
export enum Permission {
  // Platform Management
  MANAGE_TENANTS = 'manage:tenants',
  MANAGE_PLATFORM = 'manage:platform',
  
  // Tenant Administration
  MANAGE_USERS = 'manage:users',
  MANAGE_ROLES = 'manage:roles',
  MANAGE_SETTINGS = 'manage:settings',
  
  // Patient Operations
  VIEW_PATIENTS = 'view:patients',
  CREATE_PATIENTS = 'create:patients',
  UPDATE_PATIENTS = 'update:patients',
  DELETE_PATIENTS = 'delete:patients',
  
  // Clinical Operations
  VIEW_MEDICAL_RECORDS = 'view:medical_records',
  UPDATE_MEDICAL_RECORDS = 'update:medical_records',
  PRESCRIBE_MEDICATION = 'prescribe:medication',
  ORDER_TESTS = 'order:tests',
  
  // Laboratory Operations
  COLLECT_SAMPLES = 'collect:samples',
  ENTER_RESULTS = 'enter:lab_results',
  APPROVE_RESULTS = 'approve:lab_results',
  
  // Pharmacy Operations
  VIEW_INVENTORY = 'view:pharmacy_inventory',
  DISPENSE_MEDICATION = 'dispense:medication',
  MANAGE_STOCK = 'manage:pharmacy_stock',
  
  // Financial Operations
  VIEW_BILLING = 'view:billing',
  CREATE_INVOICES = 'create:invoices',
  PROCESS_PAYMENTS = 'process:payments',
  MANAGE_INSURANCE = 'manage:insurance',
  
  // Reporting
  VIEW_REPORTS = 'view:reports',
  EXPORT_DATA = 'export:data',
  
  // Appointments
  VIEW_APPOINTMENTS = 'view:appointments',
  CREATE_APPOINTMENTS = 'create:appointments',
  CANCEL_APPOINTMENTS = 'cancel:appointments',
}
```

---

## 🚀 Implementation Priorities

### Phase 1: Core Platform (Weeks 1-3)
1. Authentication & Authorization
2. RBAC Implementation
3. Tenant Management
4. API Gateway Setup

### Phase 2: Essential Modules (Weeks 4-8)
1. Patient Management
2. Appointments & Scheduling
3. OPD Module
4. Basic Billing

### Phase 3: Clinical Modules (Weeks 9-12)
1. Laboratory Module
2. Pharmacy Module
3. IPD Module
4. EMR Enhancement

### Phase 4: Advanced Features (Weeks 13-16)
1. Reporting & Analytics
2. Communication Module
3. Inventory Management
4. Insurance Integration

### Phase 5: Infrastructure & Security (Weeks 17-20)
1. Cloud Deployment
2. CI/CD Pipeline
3. Monitoring & Logging
4. Security Hardening

---

## 📚 Additional Documentation

- [API Documentation](./API_DOCUMENTATION.md)
- [Database Schema](./DATABASE_SCHEMA.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Security Guidelines](./SECURITY.md)
- [RBAC Configuration](./RBAC_CONFIG.md)

---

**Last Updated**: 2024
**Version**: 2.0.0
