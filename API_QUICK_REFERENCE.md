# 🚀 HMS API Quick Reference

## Server Information
- **Base URL:** `http://localhost:3001`
- **Documentation:** `http://localhost:3001/api-docs`
- **Health Check:** `http://localhost:3001/health`

---

## 🔐 Authentication Flow

### 1. Register (First Time)
```http
POST /auth/register
Content-Type: application/json

{
  "email": "admin@hospital.com",
  "password": "Admin@123456",
  "firstName": "Hospital",
  "lastName": "Admin",
  "role": "ADMIN"
}
```

**Response:**
```json
{
  "user": {
    "id": "...",
    "email": "admin@hospital.com",
    "role": "ADMIN"
  },
  "accessToken": "eyJhbGci...",
  "refreshToken": "eyJhbGci..."
}
```

### 2. Login (Subsequent Times)
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@hospital.com",
  "password": "Admin@123456"
}
```

### 3. Get Profile
```http
GET /auth/profile
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

## 👥 Patient Management

### Create Patient
```http
POST /patients
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-15",
  "gender": "MALE",
  "email": "john.doe@email.com",
  "phone": "+1234567890",
  "address": "123 Main St, City, State"
}
```

### Get All Patients
```http
GET /patients
Authorization: Bearer YOUR_TOKEN
```

### Search Patients
```http
GET /patients/search?query=John
Authorization: Bearer YOUR_TOKEN
```

### Get Patient by ID
```http
GET /patients/:id
Authorization: Bearer YOUR_TOKEN
```

### Update Patient
```http
PATCH /patients/:id
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "phone": "+9876543210",
  "address": "456 New Address"
}
```

---

## 📅 Appointment Management

### Create Appointment
```http
POST /appointments
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "patientId": "patient-uuid",
  "doctorId": "doctor-uuid",
  "appointmentDate": "2025-10-15T10:00:00Z",
  "reason": "Regular checkup",
  "type": "CHECKUP"
}
```

### Get All Appointments
```http
GET /appointments
Authorization: Bearer YOUR_TOKEN
```

### Update Appointment Status
```http
PATCH /appointments/:id/status
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "status": "CONFIRMED"
}
```

**Status Options:** `SCHEDULED`, `CONFIRMED`, `CHECKED_IN`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`, `NO_SHOW`

---

## 🏥 OPD (Outpatient Department)

### Create OPD Visit
```http
POST /opd/visits
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "patientId": "patient-uuid",
  "doctorId": "doctor-uuid",
  "visitDate": "2025-10-15T09:00:00Z",
  "chiefComplaint": "Fever and cough",
  "symptoms": "High temperature, dry cough",
  "vitalSigns": {
    "temperature": "38.5",
    "bloodPressure": "120/80",
    "pulse": "72",
    "weight": "70"
  }
}
```

### Get OPD Queue
```http
GET /opd/queue
Authorization: Bearer YOUR_TOKEN
```

### Get OPD Stats
```http
GET /opd/stats
Authorization: Bearer YOUR_TOKEN
```

---

## 🧪 Laboratory

### Create Lab Test (Test Definition)
```http
POST /laboratory/tests
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Complete Blood Count",
  "code": "CBC",
  "category": "HEMATOLOGY",
  "price": 25.00,
  "description": "Full blood panel analysis"
}
```

### Create Lab Order (Patient Test)
```http
POST /laboratory/orders
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "patientId": "patient-uuid",
  "doctorId": "doctor-uuid",
  "tests": [
    {
      "testId": "test-uuid",
      "priority": "ROUTINE"
    }
  ],
  "notes": "Fasting required"
}
```

### Update Test Result
```http
PATCH /laboratory/orders/:orderId/tests/:testId/result
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "result": "Normal",
  "status": "COMPLETED",
  "performedAt": "2025-10-15T14:00:00Z"
}
```

---

## 💊 Pharmacy

### Create Medication
```http
POST /pharmacy/medications
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Paracetamol",
  "genericName": "Acetaminophen",
  "manufacturer": "PharmaCorp",
  "dosageForm": "TABLET",
  "strength": "500mg",
  "unitPrice": 0.50,
  "stockQuantity": 1000
}
```

### Create Pharmacy Order (Prescription)
```http
POST /pharmacy/orders
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "patientId": "patient-uuid",
  "doctorId": "doctor-uuid",
  "medications": [
    {
      "medicationId": "medication-uuid",
      "quantity": 20,
      "dosage": "500mg",
      "frequency": "Twice daily",
      "duration": "10 days"
    }
  ]
}
```

---

## 💰 Billing

### Create Invoice
```http
POST /billing/invoices
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "patientId": "patient-uuid",
  "items": [
    {
      "description": "Consultation Fee",
      "quantity": 1,
      "unitPrice": 50.00
    },
    {
      "description": "Lab Test - CBC",
      "quantity": 1,
      "unitPrice": 25.00
    }
  ],
  "dueDate": "2025-10-30"
}
```

### Process Payment
```http
POST /billing/payments
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "invoiceId": "invoice-uuid",
  "amount": 75.00,
  "method": "CASH"
}
```

**Payment Methods:** `CASH`, `CARD`, `INSURANCE`, `BANK_TRANSFER`, `UPI`, `OTHER`

---

## 🏨 IPD (Inpatient Department)

### Create Ward
```http
POST /ipd/wards
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "General Ward A",
  "floor": 2,
  "capacity": 20,
  "type": "GENERAL"
}
```

### Create Bed
```http
POST /ipd/beds
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "wardId": "ward-uuid",
  "bedNumber": "A-101",
  "type": "GENERAL"
}
```

### Check Available Beds
```http
GET /ipd/beds/available
Authorization: Bearer YOUR_TOKEN
```

### Update Bed Status
```http
PATCH /ipd/beds/:id/status
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "status": "OCCUPIED",
  "patientId": "patient-uuid"
}
```

**Bed Status:** `AVAILABLE`, `OCCUPIED`, `RESERVED`, `MAINTENANCE`, `CLEANING`

---

## 🚑 Emergency

### Create Emergency Case
```http
POST /emergency/cases
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "patientId": "patient-uuid",
  "arrivalTime": "2025-10-15T08:30:00Z",
  "chiefComplaint": "Chest pain",
  "triageLevel": "URGENT",
  "vitalSigns": {
    "bloodPressure": "140/90",
    "pulse": "95",
    "temperature": "37.2"
  }
}
```

**Triage Levels:** `CRITICAL`, `URGENT`, `SEMI_URGENT`, `NON_URGENT`

### Get Emergency Queue
```http
GET /emergency/queue
Authorization: Bearer YOUR_TOKEN
```

---

## 🔬 Radiology

### Create Radiology Study
```http
POST /radiology/studies
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "patientId": "patient-uuid",
  "studyType": "X-RAY",
  "bodyPart": "Chest",
  "reason": "Suspected pneumonia"
}
```

### Create Radiology Report
```http
POST /radiology/reports
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "studyId": "study-uuid",
  "findings": "No abnormalities detected",
  "impression": "Normal chest X-ray"
}
```

---

## 🩺 Surgery

### Schedule Surgery
```http
POST /surgery
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "patientId": "patient-uuid",
  "surgeonId": "doctor-uuid",
  "surgeryType": "Appendectomy",
  "scheduledDate": "2025-10-20T09:00:00Z",
  "estimatedDuration": 120,
  "theater": "OT-1"
}
```

### Get Upcoming Surgeries
```http
GET /surgery/schedule/upcoming
Authorization: Bearer YOUR_TOKEN
```

---

## 📊 Reports & Analytics

### Dashboard Overview
```http
GET /reports/dashboard
Authorization: Bearer YOUR_TOKEN
```

### Patient Statistics
```http
GET /reports/patients?from=2025-01-01&to=2025-12-31
Authorization: Bearer YOUR_TOKEN
```

### Revenue Report
```http
GET /reports/revenue?period=monthly
Authorization: Bearer YOUR_TOKEN
```

---

## 🔑 Common Query Parameters

### Pagination
```
?page=1&limit=10
```

### Filtering
```
?status=ACTIVE&role=DOCTOR
```

### Date Ranges
```
?from=2025-01-01&to=2025-12-31
```

### Sorting
```
?sortBy=createdAt&order=desc
```

---

## ❌ Common Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    "email must be a valid email"
  ]
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

---

## 💡 Tips

1. **Always include the JWT token** in the Authorization header for protected routes
2. **Use UUIDs** for all ID references (generated automatically)
3. **Dates** should be in ISO 8601 format: `2025-10-15T10:00:00Z`
4. **Enums** are case-sensitive (use UPPERCASE)
5. **Test in this order:** Auth → Patients → Appointments → Other modules

---

## 🛠️ Testing Tools

### Postman
- Import collection or create requests manually
- Set up environment variables for token management
- Use pre-request scripts for automatic token refresh

### Thunder Client (VS Code)
- Lightweight alternative to Postman
- Built into VS Code
- Easy to use for quick tests

### cURL (Command Line)
- Quick testing from terminal
- Good for automation and scripts

---

## 📝 Sample Test Sequence

1. **Register** an admin user
2. **Login** to get access token
3. **Create** a patient
4. **Create** a staff member (doctor)
5. **Schedule** an appointment
6. **Create** an OPD visit
7. **Order** lab tests
8. **Create** pharmacy order
9. **Generate** invoice
10. **Process** payment

---

**Happy Testing! 🚀**
