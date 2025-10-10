# 🔌 HMS Module Integration Guide

**Purpose**: Step-by-step guide to connect all frontend modules to backend APIs  
**Status**: Ready to implement  
**Date**: October 9, 2025

---

## 📋 Module Status

| Module | Backend API | Frontend UI | Service Created | Integration Status |
|--------|-------------|-------------|-----------------|-------------------|
| Patients | ✅ | ✅ | ✅ | ⏳ **START HERE** |
| Staff | ✅ | ✅ | ✅ | ⏳ Next |
| Laboratory | ✅ | ✅ | ✅ | ⏳ Then |
| Pharmacy | ✅ | ✅ | ✅ | ⏳ Then |
| Billing | ✅ | ✅ | ✅ | ⏳ Finally |

---

## 🎯 Integration Pattern (Same for All Modules)

### Step 1: Import the Service
```typescript
import { patientsService, handleApiError } from '@/services';
import { useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';
```

### Step 2: Replace Mock Data with State
```typescript
// OLD (Mock Data):
const patients = mockPatients;

// NEW (Real API):
const [patients, setPatients] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

### Step 3: Load Data on Mount
```typescript
useEffect(() => {
  loadData();
}, []);

async function loadData() {
  try {
    setLoading(true);
    setError(null);
    const response = await patientsService.getPatients({ 
      page: 1, 
      limit: 100 
    });
    
    // Backend returns: { success: true, data: { patients: [...], pagination: {...} } }
    setPatients(response.data.patients || response.data || []);
  } catch (err) {
    const message = handleApiError(err);
    setError(message);
    notifications.show({
      title: 'Error',
      message,
      color: 'red',
    });
  } finally {
    setLoading(false);
  }
}
```

### Step 4: Add Loading State UI
```typescript
if (loading) {
  return (
    <Container size="xl" py="md">
      <Text>Loading...</Text>
    </Container>
  );
}

if (error) {
  return (
    <Container size="xl" py="md">
      <Alert color="red" title="Error">
        {error}
      </Alert>
    </Container>
  );
}
```

### Step 5: Handle Create/Update/Delete Operations
```typescript
async function handleCreate(formData) {
  try {
    await patientsService.createPatient(formData);
    notifications.show({
      title: 'Success',
      message: 'Created successfully',
      color: 'green',
    });
    closeModal();
    loadData(); // Refresh list
  } catch (err) {
    notifications.show({
      title: 'Error',
      message: handleApiError(err),
      color: 'red',
    });
  }
}

async function handleUpdate(id, formData) {
  try {
    await patientsService.updatePatient(id, formData);
    notifications.show({
      title: 'Success',
      message: 'Updated successfully',
      color: 'green',
    });
    closeModal();
    loadData(); // Refresh list
  } catch (err) {
    notifications.show({
      title: 'Error',
      message: handleApiError(err),
      color: 'red',
    });
  }
}

async function handleDelete(id) {
  try {
    await patientsService.deletePatient(id);
    notifications.show({
      title: 'Success',
      message: 'Deleted successfully',
      color: 'green',
    });
    loadData(); // Refresh list
  } catch (err) {
    notifications.show({
      title: 'Error',
      message: handleApiError(err),
      color: 'red',
    });
  }
}
```

---

## 📁 Files to Update

### 1. Patients Module
**File**: `apps/web/src/app/dashboard/patients/page.tsx`

**Changes**:
- Import `patientsService` from `@/services`
- Replace `mockPatients` with `useState` and API call
- Add loading/error states
- Connect create/update/delete handlers

**Service Available**: ✅ `patientsService`

---

### 2. Staff Module
**File**: `apps/web/src/app/dashboard/staff/page.tsx`

**Changes**:
- Import `staffService` from `@/services`
- Replace mock data with API calls
- Add loading/error states
- Connect CRUD handlers

**Service Available**: ✅ `staffService`

---

### 3. Laboratory Module
**File**: `apps/web/src/app/dashboard/laboratory/page.tsx`

**Changes**:
- Import `laboratoryService` from `@/services`
- Replace mock lab tests with API calls
- Replace mock lab orders with API calls
- Add loading/error states
- Connect test/order handlers

**Service Available**: ✅ `laboratoryService`

**Additional Methods**:
```typescript
// Lab Tests
await laboratoryService.getLabTests();
await laboratoryService.createLabTest(data);

// Lab Orders
await laboratoryService.getLabOrders();
await laboratoryService.createLabOrder(data);
await laboratoryService.updateTestResult(orderId, testId, result);
```

---

### 4. Pharmacy Module
**File**: `apps/web/src/app/dashboard/pharmacy/page.tsx`

**Changes**:
- Import `pharmacyService` from `@/services`
- Replace mock medications with API calls
- Replace mock orders with API calls
- Add loading/error states
- Connect medication/order handlers

**Service Available**: ✅ `pharmacyService`

**Additional Methods**:
```typescript
// Medications
await pharmacyService.getMedications();
await pharmacyService.createMedication(data);

// Orders
await pharmacyService.getPharmacyOrders();
await pharmacyService.createPharmacyOrder(data);
await pharmacyService.updateOrderItem(orderId, itemId, data);
```

---

### 5. Billing Module
**File**: `apps/web/src/app/dashboard/billing/page.tsx`

**Changes**:
- Import `billingService` from `@/services`
- Replace mock invoices with API calls
- Replace mock payments with API calls
- Add loading/error states
- Connect invoice/payment handlers

**Service Available**: ✅ `billingService`

**Additional Methods**:
```typescript
// Invoices
await billingService.getInvoices();
await billingService.createInvoice(data);
await billingService.getBillingStats();

// Payments
await billingService.createPayment(data);
await billingService.getPayments();
```

---

## 🚀 Quick Implementation Commands

### Option 1: Manual Update (Recommended for Learning)
1. Open each file listed above
2. Follow the integration pattern
3. Test each module individually
4. Verify data persistence

### Option 2: Automated Update (Faster)
I can create modified versions of each file with API integration.
Let me know which modules you want me to update first!

---

## ✅ Testing Checklist (Per Module)

After integrating each module:

- [ ] Page loads without errors
- [ ] Data fetches from backend
- [ ] Loading state shows properly
- [ ] Create operation works
- [ ] Update operation works
- [ ] Delete operation works
- [ ] Data persists after refresh
- [ ] Error messages display correctly
- [ ] Success notifications show

---

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot read property of undefined"
**Cause**: Backend response structure different than expected  
**Solution**: Log the response and adjust data extraction:
```typescript
console.log('API Response:', response);
const data = response.data?.patients || response.data || [];
```

### Issue 2: "401 Unauthorized"
**Cause**: Token missing or expired  
**Solution**: Check localStorage for token, re-login if needed

### Issue 3: Empty data shows after API call
**Cause**: Data might be nested differently  
**Solution**: Check response structure:
```typescript
// Try different access patterns:
setData(response.data.patients);  // Nested
setData(response.data);            // Direct
setData(response.data.data);       // Double nested
```

---

## 📊 API Response Formats

### Standard Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "patients": [...],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "pages": 10
    }
  }
}
```

### Standard Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error info"
}
```

---

## 🎯 Priority Order

1. **Patients** (Most fundamental)
2. **Staff** (Required for appointments)
3. **Laboratory** (Common workflow)
4. **Pharmacy** (Common workflow)
5. **Billing** (Final step in workflow)

---

## 💡 Tips for Success

1. **Test incrementally**: Don't integrate all at once
2. **Use browser DevTools**: Check Network tab for API calls
3. **Console.log everything**: When debugging
4. **Keep backend running**: Always have backend server active
5. **Clear cache**: If data doesn't update, try hard refresh (Ctrl+Shift+R)

---

## 🆘 Need Help?

If you encounter issues:
1. Check browser console for errors
2. Check Network tab for failed API calls
3. Verify backend is running on port 3001
4. Check that .env.local has correct API_URL
5. Try logging the response structure

---

**Ready to integrate? Start with Patients module!** 🚀

*Last Updated: October 9, 2025*
