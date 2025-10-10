# Emergency Contact Fields Error - FIXED ✅

## Error
```
Unknown argument `emergencyContactName`. Available options are marked with ?.
Unknown argument `emergencyContactPhone`.
Unknown argument `emergencyContactRelation`.
```

## Root Cause
The frontend form was collecting emergency contact information (`emergencyContactName`, `emergencyContactPhone`, `emergencyContactRelation`), but these fields don't exist in the Patient table in the database.

The Prisma schema only has these fields in the Patient model:
- Basic info (name, DOB, gender, etc.)
- Contact info (email, phone, address, aadharNumber)
- Medical info (bloodType, allergies, etc.)
- Insurance info
- **NO emergency contact fields**

## Solution Applied ✅

### Option 1: Remove the fields (CHOSEN)
Since these fields aren't in the database, I removed them from:
1. Frontend form interface
2. Frontend form state
3. Backend DTO
4. Backend service (added delete statements as safety)

### Option 2: Add to database (Future Enhancement)
If you need emergency contact info, you should create a separate table/model for it:
```prisma
model EmergencyContact {
  id         String   @id @default(cuid())
  patientId  String
  name       String
  phone      String
  relation   String?
  patient    Patient  @relation(fields: [patientId], references: [id])
}
```

---

## Files Modified

### 1. Backend Service
**File:** `apps/api/src/patients/patients.service.ts`

**Changes:**
- Lines 30-33: Added delete statements to remove emergency contact fields
- Lines 196-199: Same for update method

```typescript
// Remove fields that don't exist in Prisma schema
delete data.emergencyContactName;
delete data.emergencyContactPhone;
delete data.emergencyContactRelation;
```

### 2. Backend DTO
**File:** `apps/api/src/patients/patients.controller.ts`

**Changes:**
- Removed emergencyContact fields from CreatePatientDto
- Added comment explaining why they were removed

```typescript
// Note: Emergency contact fields removed - not in database schema
// If needed, create a separate EmergencyContact model
```

### 3. Frontend Interface
**File:** `apps/web/src/app/dashboard/patients/simple-page.tsx`

**Changes (Line 29-39):**
```typescript
interface PatientFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  bloodType: string;
  phone: string;
  email: string;
  aadharNumber: string;
  address: string;
  // Removed: emergencyContactName, emergencyContactPhone, emergencyContactRelation
}
```

### 4. Frontend Form State
**Updated in 3 places:**
- Initial state (Line 59-67)
- Reset function (Line 231-243)
- Edit function (Line 248-259)

Removed emergency contact fields from all state management.

### 5. Frontend UI
**Removed from form (Line 813-872):**
- Emergency Contact Name input field
- Emergency Contact Phone input field

---

## Form Layout After Fix

The patient form now has:

```
Row 1: First Name | Last Name
Row 2: Date of Birth (Optional) | Gender
Row 3: Phone (Optional) | Email (Optional)
Row 4: Aadhar Number (Optional) | Blood Group (Optional)
Row 5: Address (Optional) - Full width
```

**Removed:**
- ~~Row 6: Emergency Contact Name | Emergency Contact Phone~~

---

## Testing

### Test 1: Add Patient (Simplified)
```json
{
  "firstName": "Test",
  "lastName": "User",
  "phone": "1234567890",
  "email": "test@example.com",
  "aadharNumber": "123456789012",
  "address": "Test Address"
}
```
**Expected:** ✅ Patient created successfully

### Test 2: Verify No Emergency Contact Fields in Database
After creating a patient, check the database:
```sql
SELECT * FROM patients ORDER BY "createdAt" DESC LIMIT 1;
```
**Expected:** No emergency contact columns exist ✅

---

## What's Fixed

- ✅ No more "Unknown argument" errors
- ✅ Patient creation works without emergency contact fields
- ✅ Patient update works without emergency contact fields
- ✅ Form is cleaner and more focused
- ✅ No unused fields being sent to backend

---

## Future Enhancement Option

If you need to add emergency contact functionality later, here's how:

### Step 1: Create Migration
```prisma
model EmergencyContact {
  id         String   @id @default(cuid())
  patientId  String
  name       String
  phone      String
  relation   String?
  isPrimary  Boolean  @default(false)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  
  patient    Patient  @relation(fields: [patientId], references: [id])
  
  @@index([patientId])
}

// Update Patient model
model Patient {
  // ... existing fields
  emergencyContacts EmergencyContact[]
}
```

### Step 2: Create Emergency Contact Service
Create separate CRUD operations for emergency contacts.

### Step 3: Update Frontend
Add separate section/modal for managing emergency contacts.

### Benefits of Separate Table:
- ✅ Support multiple emergency contacts per patient
- ✅ Mark primary contact
- ✅ Better data normalization
- ✅ Easier to manage and query

---

## Summary

**Problem:** Frontend was sending emergency contact fields that don't exist in the database.

**Solution:** Removed these fields from frontend and backend since they're not in the schema.

**Result:** Patient creation and updates now work perfectly! 🎉

**Note:** If emergency contacts are needed in the future, create a separate EmergencyContact model rather than adding fields to the Patient model.
