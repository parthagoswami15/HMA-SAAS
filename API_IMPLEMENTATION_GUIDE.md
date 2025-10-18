# API Implementation Guide - HMS SaaS

## Overview
This guide provides templates for implementing API fetching and empty states across all modules.

## 1. Standard Implementation Pattern

### Step 1: Import Required Dependencies
```typescript
import { useState, useEffect } from 'react';
import { notifications } from '@mantine/notifications';
import { EmptyState } from '../../../components/EmptyState';
import { useDataFetch } from '../../../hooks/useDataFetch';
import [serviceName] from '../../../services/[module].service';
```

### Step 2: Add State Management
```typescript
const [data, setData] = useState<Type[]>([]);
const [stats, setStats] = useState<StatsType | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

### Step 3: Implement Fetch Functions
```typescript
const fetchData = async () => {
  try {
    setLoading(true);
    setError(null);
    const response = await serviceName.getAll();
    setData(response.data || []);
  } catch (err: any) {
    const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch data';
    setError(errorMsg);
    console.error('Error fetching data:', err);
    notifications.show({
      title: 'Error',
      message: errorMsg,
      color: 'red'
    });
  } finally {
    setLoading(false);
  }
};

const fetchStats = async () => {
  try {
    const response = await serviceName.getStats();
    setStats(response.data);
  } catch (err: any) {
    console.warn('Error fetching stats:', err);
  }
};
```

### Step 4: Use Effect Hook
```typescript
useEffect(() => {
  fetchData();
  fetchStats();
}, []);
```

### Step 5: Render Logic with Empty State
```typescript
if (loading) {
  return (
    <Container size="xl" py="md">
      <Center style={{ minHeight: '400px' }}>
        <Loader size="lg" />
      </Center>
    </Container>
  );
}

if (error) {
  return (
    <Container size="xl" py="md">
      <Alert color="red" title="Error Loading Data">
        {error}
        <Button onClick={fetchData} mt="md" variant="light">
          Retry
        </Button>
      </Alert>
    </Container>
  );
}

// In table/list rendering:
{data.length === 0 ? (
  <EmptyState
    icon={<IconUsers size={48} />}
    title="No data found"
    description="Get started by adding your first record"
    action={{
      label: "Add New",
      onClick: openAddModal
    }}
  />
) : (
  data.map(item => <ItemComponent key={item.id} {...item} />)
)}
```

## 2. Module-Specific Implementations

### Patients Module
```typescript
// Service: patients.service.ts
const fetchPatients = async () => {
  const response = await patientsService.getAll();
  setPatients(response.data || []);
};

// Empty State
<EmptyState
  icon={<IconUsers size={48} />}
  title="No patients registered"
  description="Add your first patient to start managing medical records"
  action={{
    label: "Register Patient",
    onClick: openRegisterModal
  }}
/>
```

### Appointments Module
```typescript
// Service: appointments.service.ts
const fetchAppointments = async () => {
  const response = await appointmentsService.getAll();
  setAppointments(response.data || []);
};

const fetchStats = async () => {
  const response = await appointmentsService.getStats();
  setStats(response.data);
};

// Empty State
<EmptyState
  icon={<IconCalendar size={48} />}
  title="No appointments scheduled"
  description="Book your first appointment to get started"
  action={{
    label: "Book Appointment",
    onClick: openBookModal
  }}
/>
```

### IPD Module
```typescript
// Service: ipd.service.ts
const fetchAdmissions = async () => {
  const response = await ipdService.getAdmissions();
  setAdmissions(response.data || []);
};

const fetchStats = async () => {
  const response = await ipdService.getStats();
  setStats(response.data);
};

// Empty State
<EmptyState
  icon={<IconBed size={48} />}
  title="No IPD admissions"
  description="Admit your first patient to start inpatient care"
  action={{
    label: "New Admission",
    onClick: openAdmissionModal
  }}
/>
```

### Laboratory Module
```typescript
// Service: laboratory.service.ts
const fetchTests = async () => {
  const response = await laboratoryService.getTests();
  setTests(response.data || []);
};

const fetchStats = async () => {
  const response = await laboratoryService.getStats();
  setStats(response.data);
};

// Empty State
<EmptyState
  icon={<IconTestPipe size={48} />}
  title="No lab tests"
  description="Order your first lab test to begin diagnostics"
  action={{
    label: "Order Test",
    onClick: openOrderModal
  }}
/>
```

### Pharmacy Module
```typescript
// Service: pharmacy.service.ts
const fetchMedications = async () => {
  const response = await pharmacyService.getMedications();
  setMedications(response.data || []);
};

// Empty State
<EmptyState
  icon={<IconPill size={48} />}
  title="No medications"
  description="Add medications to your pharmacy inventory"
  action={{
    label: "Add Medication",
    onClick: openAddModal
  }}
/>
```

## 3. Dropdown/Select Data Fetching

### Patients Dropdown
```typescript
const [patients, setPatients] = useState<any[]>([]);

useEffect(() => {
  const fetchPatients = async () => {
    try {
      const response = await patientsService.getAll();
      setPatients(response.data || []);
    } catch (err) {
      console.warn('Error fetching patients:', err);
    }
  };
  fetchPatients();
}, []);

// In Select component:
<Select
  label="Patient"
  placeholder="Select patient"
  data={patients.map(p => ({
    value: p.id,
    label: `${p.firstName} ${p.lastName}`
  }))}
  searchable
  required
/>
```

### Staff/Doctors Dropdown
```typescript
const [staff, setStaff] = useState<any[]>([]);

useEffect(() => {
  const fetchStaff = async () => {
    try {
      const response = await staffService.getAll();
      setStaff(response.data || []);
    } catch (err) {
      console.warn('Error fetching staff:', err);
    }
  };
  fetchStaff();
}, []);

// In Select component:
<Select
  label="Doctor"
  placeholder="Select doctor"
  data={staff
    .filter(s => s.role === 'DOCTOR')
    .map(d => ({
      value: d.id,
      label: `Dr. ${d.firstName} ${d.lastName}`
    }))}
  searchable
  required
/>
```

## 4. Error Handling Best Practices

### Network Errors
```typescript
try {
  const response = await service.getData();
  setData(response.data);
} catch (err: any) {
  if (err.response?.status === 401) {
    // Unauthorized - redirect to login
    router.push('/login');
  } else if (err.response?.status === 403) {
    // Forbidden
    notifications.show({
      title: 'Access Denied',
      message: 'You do not have permission to view this data',
      color: 'red'
    });
  } else if (err.response?.status === 404) {
    // Not found
    setData([]);
  } else {
    // Other errors
    setError(err.response?.data?.message || 'Failed to fetch data');
  }
}
```

### Retry Logic
```typescript
const [retryCount, setRetryCount] = useState(0);

const fetchWithRetry = async (maxRetries = 3) => {
  try {
    const response = await service.getData();
    setData(response.data);
    setRetryCount(0);
  } catch (err) {
    if (retryCount < maxRetries) {
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        fetchWithRetry(maxRetries);
      }, 1000 * (retryCount + 1)); // Exponential backoff
    } else {
      setError('Failed after multiple attempts');
    }
  }
};
```

## 5. Loading States

### Skeleton Loaders
```typescript
import { Skeleton } from '@mantine/core';

{loading ? (
  <Stack gap="md">
    {[1, 2, 3, 4, 5].map(i => (
      <Skeleton key={i} height={80} radius="md" />
    ))}
  </Stack>
) : (
  <Table>
    {/* Actual data */}
  </Table>
)}
```

### Inline Loading
```typescript
<Button
  onClick={handleSubmit}
  loading={submitting}
  disabled={submitting}
>
  {submitting ? 'Saving...' : 'Save'}
</Button>
```

## 6. Real-time Updates

### Polling
```typescript
useEffect(() => {
  fetchData();
  
  const interval = setInterval(() => {
    fetchData();
  }, 30000); // Refresh every 30 seconds
  
  return () => clearInterval(interval);
}, []);
```

### Manual Refresh
```typescript
const handleRefresh = async () => {
  await fetchData();
  notifications.show({
    title: 'Refreshed',
    message: 'Data updated successfully',
    color: 'green'
  });
};

<Button
  leftSection={<IconRefresh size={16} />}
  onClick={handleRefresh}
  loading={loading}
>
  Refresh
</Button>
```

## 7. Implementation Checklist

For each module, ensure:

- [ ] Import EmptyState component
- [ ] Import useDataFetch hook (optional)
- [ ] Add loading state
- [ ] Add error state
- [ ] Implement fetchData function
- [ ] Implement fetchStats function (if applicable)
- [ ] Add useEffect hook
- [ ] Replace TODO comments with actual API calls
- [ ] Add EmptyState for zero data
- [ ] Add loading skeleton/spinner
- [ ] Add error alert with retry
- [ ] Test with real API
- [ ] Test with no data
- [ ] Test with API errors

## 8. Priority Order

### High Priority (User-facing):
1. Patients
2. Appointments
3. IPD
4. OPD
5. Billing

### Medium Priority:
6. Laboratory
7. Pharmacy
8. Radiology
9. Emergency
10. Staff

### Low Priority:
11. Reports
12. Analytics
13. Settings
14. Admin

## Next Steps

1. Start with high-priority modules
2. Test each implementation thoroughly
3. Ensure error handling works
4. Verify empty states display correctly
5. Check loading states
6. Test with real backend API
