# HMS Optimization & Security Guide

This guide documents the comprehensive optimizations, role-based access control (RBAC), security measures, and performance enhancements implemented in the Hospital Management System.

---

## Table of Contents

1. [Role-Based Access Control (RBAC)](#role-based-access-control-rbac)
2. [API Optimization with React Query](#api-optimization-with-react-query)
3. [Code Splitting & Lazy Loading](#code-splitting--lazy-loading)
4. [Security Features](#security-features)
5. [Loading States & UX](#loading-states--ux)
6. [Performance Best Practices](#performance-best-practices)
7. [Usage Examples](#usage-examples)

---

## Role-Based Access Control (RBAC)

### Overview

The RBAC system provides fine-grained access control based on user roles and permissions.

### User Roles

- **SUPER_ADMIN**: Full system access
- **ADMIN**: Administrative access (manage staff, patients, settings)
- **DOCTOR**: Medical staff access (patients, appointments, medical records)
- **NURSE**: Clinical support access
- **RECEPTIONIST**: Front desk access (patients, appointments, billing)
- **PHARMACIST**: Pharmacy module access
- **LAB_TECHNICIAN**: Laboratory module access
- **RADIOLOGIST**: Radiology module access
- **ACCOUNTANT**: Billing and financial access
- **PATIENT**: Limited patient portal access

### Permissions

Permissions are granular capabilities such as:
- `VIEW_PATIENTS`, `CREATE_PATIENTS`, `EDIT_PATIENTS`, `DELETE_PATIENTS`
- `VIEW_APPOINTMENTS`, `CREATE_APPOINTMENTS`, `EDIT_APPOINTMENTS`
- `VIEW_MEDICAL_RECORDS`, `EDIT_MEDICAL_RECORDS`
- `VIEW_BILLING`, `CREATE_INVOICES`, `PROCESS_PAYMENTS`
- `VIEW_STAFF`, `MANAGE_STAFF`
- `MANAGE_SYSTEM`, `VIEW_REPORTS`, `MANAGE_SETTINGS`

### Implementation

#### 1. Wrap Your App with RBACProvider

```tsx
// apps/web/src/app/layout.tsx
import { RBACProvider } from '@/lib/rbac/RBACProvider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <RBACProvider>
          {children}
        </RBACProvider>
      </body>
    </html>
  );
}
```

#### 2. Use RBAC Hooks

```tsx
import { useRBAC, Permission } from '@/lib/rbac/RBACProvider';

function PatientList() {
  const { hasPermission, user } = useRBAC();

  if (!hasPermission(Permission.VIEW_PATIENTS)) {
    return <div>Access Denied</div>;
  }

  return (
    <div>
      <h1>Patients</h1>
      {hasPermission(Permission.CREATE_PATIENTS) && (
        <button>Add Patient</button>
      )}
    </div>
  );
}
```

#### 3. Protect Components

```tsx
import { ProtectedElement, Permission } from '@/lib/rbac/RBACProvider';

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      
      <ProtectedElement permissions={[Permission.VIEW_PATIENTS]}>
        <PatientsSummary />
      </ProtectedElement>

      <ProtectedElement 
        permissions={[Permission.VIEW_REPORTS]}
        fallback={<div>Upgrade to view reports</div>}
      >
        <ReportsWidget />
      </ProtectedElement>
    </div>
  );
}
```

#### 4. Use HOC for Entire Pages

```tsx
import { withRBAC, Permission } from '@/lib/rbac/RBACProvider';

function PatientsPage() {
  return <div>Patient Management</div>;
}

export default withRBAC(PatientsPage, [Permission.VIEW_PATIENTS]);
```

### Route Protection

Routes are automatically protected based on the `protectedRoutes` configuration in `RBACProvider.tsx`. Users attempting to access restricted routes will be redirected to the dashboard with a notification.

---

## API Optimization with React Query

### Features

- **Automatic caching**: Data is cached for 5 minutes by default
- **Request deduplication**: Identical requests are merged
- **Automatic retries**: Failed requests retry once
- **Background refetching**: Data refreshes on reconnection
- **Optimistic updates**: UI updates before server confirmation
- **Error handling**: Centralized error notifications

### Setup

#### 1. Wrap App with QueryProvider

```tsx
// apps/web/src/app/layout.tsx
import { QueryProvider } from '@/lib/api/queryClient';

export default function RootLayout({ children }) {
  return (
    <QueryProvider>
      {children}
    </QueryProvider>
  );
}
```

#### 2. Use Custom Hooks

```tsx
import { usePatients, useCreatePatient } from '@/lib/api/hooks';

function PatientsList() {
  const { data: patients, isLoading, error } = usePatients();
  const createPatient = useCreatePatient();

  const handleCreate = async (patientData) => {
    await createPatient.mutateAsync(patientData);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {patients.map(patient => (
        <PatientCard key={patient.id} patient={patient} />
      ))}
      <button onClick={() => handleCreate(newPatient)}>
        Add Patient
      </button>
    </div>
  );
}
```

#### 3. Use API Client Directly

```tsx
import { apiClient } from '@/lib/api/queryClient';

async function fetchCustomData() {
  const data = await apiClient.get('/api/custom-endpoint');
  return data;
}
```

### Query Keys

Use the predefined query keys factory for consistent cache management:

```tsx
import { queryKeys } from '@/lib/api/queryClient';

// Invalidate all patient queries
queryClient.invalidateQueries({ queryKey: queryKeys.patients.all });

// Invalidate specific patient
queryClient.invalidateQueries({ queryKey: queryKeys.patients.detail(patientId) });
```

---

## Code Splitting & Lazy Loading

### Benefits

- **Reduced initial bundle size**
- **Faster page load times**
- **Better performance on slow connections**
- **Improved Time to Interactive (TTI)**

### Implementation

#### 1. Use Lazy Load Utility

```tsx
import { lazyLoad } from '@/lib/lazy/LazyComponents';

const HeavyComponent = lazyLoad(
  () => import('@/components/HeavyComponent')
);

function Page() {
  return <HeavyComponent />;
}
```

#### 2. Use Pre-built Lazy Components

```tsx
import { PatientsPage, AppointmentsPage } from '@/lib/lazy/LazyComponents';

// These components are automatically wrapped with Suspense
function Dashboard() {
  return (
    <Tabs>
      <TabPanel>
        <PatientsPage />
      </TabPanel>
      <TabPanel>
        <AppointmentsPage />
      </TabPanel>
    </Tabs>
  );
}
```

#### 3. Preload Components

```tsx
import { preloadComponent, preloadCommonPages } from '@/lib/lazy/LazyComponents';

// Preload on hover
<button 
  onMouseEnter={() => preloadComponent(() => import('@/app/dashboard/patients/page'))}
>
  Go to Patients
</button>

// Preload common pages on app mount
useEffect(() => {
  preloadCommonPages();
}, []);
```

---

## Security Features

### CSRF Protection

```tsx
import { initializeCSRFToken, secureFetch } from '@/lib/security/csrf';

// Initialize on app mount
useEffect(() => {
  initializeCSRFToken();
}, []);

// Use secure fetch
const response = await secureFetch('/api/protected', {
  method: 'POST',
  body: JSON.stringify(data),
});
```

### Input Sanitization

```tsx
import { sanitizeInput } from '@/lib/security/headers';

const userInput = sanitizeInput(rawInput);
```

### File Validation

```tsx
import { validateFile } from '@/lib/security/headers';

function handleFileUpload(file: File) {
  const validation = validateFile(file, {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png'],
    allowedExtensions: ['.jpg', '.png'],
  });

  if (!validation.valid) {
    alert(validation.error);
    return;
  }

  // Process file
}
```

### Rate Limiting

```tsx
import { rateLimiter } from '@/lib/security/headers';

function handleSearch() {
  if (!rateLimiter.isAllowed('search', 10, 60000)) {
    alert('Too many requests. Please wait.');
    return;
  }

  // Perform search
}
```

### Middleware Authentication

Routes are automatically protected by Next.js middleware in `src/middleware.ts`. Unauthenticated users are redirected to login.

---

## Loading States & UX

### Available Components

```tsx
import {
  LoadingSpinner,
  FullPageLoader,
  LoadingSkeleton,
  TableSkeleton,
  CardSkeleton,
  EmptyState,
  ErrorState,
  LoadingOverlay,
} from '@/components/shared/LoadingStates';
```

### Usage Examples

```tsx
// Spinner for inline loading
{isLoading && <LoadingSpinner size="lg" />}

// Full page loader
{isLoading && <FullPageLoader message="Loading dashboard..." />}

// Skeleton for tables
{isLoading ? <TableSkeleton rows={5} /> : <Table data={data} />}

// Empty state
{data.length === 0 && (
  <EmptyState
    title="No patients found"
    message="Add your first patient to get started"
    actionLabel="Add Patient"
    onAction={() => openCreateModal()}
  />
)}

// Error state
{error && (
  <ErrorState
    title="Failed to load data"
    message={error.message}
    actionLabel="Retry"
    onAction={() => refetch()}
  />
)}
```

---

## Performance Best Practices

### 1. Use Memoization

```tsx
import { useMemo, useCallback } from 'react';

const expensiveValue = useMemo(() => computeExpensiveValue(data), [data]);
const handleClick = useCallback(() => doSomething(), []);
```

### 2. Virtualize Long Lists

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualList({ items }) {
  const parentRef = useRef();
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  });

  return (
    <div ref={parentRef} style={{ height: '500px', overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div key={virtualItem.key} data-index={virtualItem.index}>
            {items[virtualItem.index]}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 3. Optimize Images

```tsx
import Image from 'next/image';

<Image
  src="/avatar.jpg"
  width={200}
  height={200}
  alt="User avatar"
  loading="lazy"
  quality={85}
/>
```

### 4. Bundle Analysis

```bash
npm run analyze
```

---

## Usage Examples

### Complete Protected Page with Loading & API

```tsx
'use client';

import { withRBAC, Permission } from '@/lib/rbac/RBACProvider';
import { usePatients } from '@/lib/api/hooks';
import { TableSkeleton, EmptyState, ErrorState } from '@/components/shared/LoadingStates';

function PatientsPage() {
  const { data: patients, isLoading, error, refetch } = usePatients();

  if (isLoading) {
    return <TableSkeleton rows={10} />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load patients"
        message={error.message}
        actionLabel="Retry"
        onAction={refetch}
      />
    );
  }

  if (patients.length === 0) {
    return (
      <EmptyState
        title="No patients found"
        message="Start by adding your first patient"
      />
    );
  }

  return (
    <div>
      <h1>Patients</h1>
      <table>
        {patients.map(patient => (
          <tr key={patient.id}>
            <td>{patient.name}</td>
            <td>{patient.email}</td>
          </tr>
        ))}
      </table>
    </div>
  );
}

export default withRBAC(PatientsPage, [Permission.VIEW_PATIENTS]);
```

### Dashboard with Multiple Modules

```tsx
'use client';

import { useRBAC, Permission } from '@/lib/rbac/RBACProvider';
import { useDashboardReport } from '@/lib/api/hooks';
import { PatientsPage, AppointmentsPage } from '@/lib/lazy/LazyComponents';
import { ProtectedElement } from '@/lib/rbac/RBACProvider';

export default function Dashboard() {
  const { user } = useRBAC();
  const { data: stats, isLoading } = useDashboardReport();

  return (
    <div>
      <h1>Welcome, {user?.firstName}!</h1>

      <ProtectedElement permissions={[Permission.VIEW_REPORTS]}>
        {isLoading ? (
          <CardSkeleton />
        ) : (
          <StatsCards data={stats} />
        )}
      </ProtectedElement>

      <ProtectedElement permissions={[Permission.VIEW_PATIENTS]}>
        <PatientsPage />
      </ProtectedElement>

      <ProtectedElement permissions={[Permission.VIEW_APPOINTMENTS]}>
        <AppointmentsPage />
      </ProtectedElement>
    </div>
  );
}
```

---

## Next Steps

1. **Install dependencies**:
   ```bash
   npm install @tanstack/react-query @tanstack/react-query-devtools
   ```

2. **Integrate providers** in your root layout

3. **Replace existing data fetching** with React Query hooks

4. **Apply RBAC** to protected routes and components

5. **Add loading states** throughout the application

6. **Test security features** and rate limiting

7. **Monitor performance** with React Query DevTools

---

## Support

For questions or issues, refer to:
- React Query: https://tanstack.com/query/latest
- Next.js Security: https://nextjs.org/docs/advanced-features/security-headers
- Mantine UI: https://mantine.dev/

---

**Last Updated**: 2024
**Version**: 1.0.0
