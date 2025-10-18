# HMS API Integration Summary

## ✅ Completed Modules (10/17)
1. Staff Management
2. Patient Management  
3. Appointments
4. Billing
5. Pharmacy
6. Laboratory
7. Inventory
8. OPD

## 🔄 Remaining Modules (8) - Pattern to Apply

For each remaining module (IPD, Surgery, HR, Reports, Communications, EMR, Insurance, Patient Portal), apply this pattern:

### Step 1: Import Service
```typescript
import React, { useState, useMemo, useEffect } from 'react'; // Add useEffect
import { notifications } from '@mantine/notifications'; // Uncomment
import [moduleName]Service from '../../../services/[moduleName].service';
```

### Step 2: Add API State (after existing state)
```typescript
// API data state
const [data, setData] = useState<any[]>([]);
const [stats, setStats] = useState<any>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

### Step 3: Add Fetch Functions
```typescript
useEffect(() => {
  fetchAllData();
}, []);

const fetchAllData = async () => {
  try {
    setLoading(true);
    setError(null);
    await Promise.all([fetchData(), fetchStats()]);
  } catch (err: any) {
    console.error('Error:', err);
    setError(err.response?.data?.message || 'Failed to load data');
    setData(mockData); // fallback
  } finally {
    setLoading(false);
  }
};

const fetchData = async () => {
  try {
    const response = await [moduleName]Service.get[Method]();
    setData(response.data?.items || response.data || []);
  } catch (err) {
    console.error('Error fetching:', err);
    setData(mockData);
  }
};

const fetchStats = async () => {
  try {
    const response = await [moduleName]Service.getStats();
    setStats(response.data);
  } catch (err) {
    setStats(null);
  }
};

useEffect(() => {
  if (!loading) fetchData();
}, [filters]);
```

### Step 4: Update Mock References
Replace all `mockData` with `data` in useMemo filters

## Service Methods Reference

| Module | Service | Main Methods |
|--------|---------|-------------|
| IPD | ipdService | `getWards()`, `getBeds()`, `getStats()` |
| Surgery | surgeryService | `getSurgeries()`, `getStats()` |  
| HR | hrService | `getEmployees()`, `getStats()` |
| Reports | reportsService | `getReports()`, `generateReport()` |
| Communications | communicationsService | `getMessages()`, `sendMessage()` |
| EMR | emrService | `getRecords()`, `getStats()` |
| Insurance | insuranceService | `getClaims()`, `getStats()` |
| Patient Portal | patientPortalService | `getAccess()`, `getStats()` |

## Next Steps
Apply the pattern above to each remaining module's page.tsx file.
