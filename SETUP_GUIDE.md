# HMS SaaS Platform - Complete Setup & Testing Guide

## 📋 Prerequisites Checklist

Before starting, ensure you have:
- [ ] Node.js 18+ installed
- [ ] PostgreSQL 14+ installed and running
- [ ] Git installed
- [ ] A code editor (VS Code recommended)
- [ ] Postman or similar API testing tool

## 🔧 Step 1: Environment Setup

### 1.1 Install Dependencies
```bash
# Navigate to project root
cd e:\Windsurf

# Install all dependencies
npm install

# Verify installation
npm list --depth=0
```

### 1.2 Database Setup
```bash
# Start PostgreSQL service (Windows)
net start postgresql-x64-14

# Create database
psql -U postgres
CREATE DATABASE hms_saas;
\q
```

### 1.3 Environment Configuration

**Create `apps/api/.env`:**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hms_saas?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="1d"
RAZORPAY_KEY_ID="rzp_test_your_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
RAZORPAY_WEBHOOK_SECRET="your_webhook_secret"
```

**Create `apps/web/.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id
```

## 🗄️ Step 2: Database Migration

### 2.1 Generate Prisma Client
```bash
# Generate Prisma client
npm --workspace api exec prisma generate
```

### 2.2 Run Database Migrations
```bash
# Push schema to database
npm --workspace api exec prisma db push

# Verify schema
npm --workspace api exec prisma studio
# This opens Prisma Studio at http://localhost:5555
```

### 2.3 Seed Initial Data (Optional)
```bash
# Create seed script if needed
npm --workspace api exec prisma db seed
```

## 🚀 Step 3: Start Development Servers

### 3.1 Start Backend API
```bash
# Terminal 1: Start API server
npm run dev:api

# Should see:
# [Nest] Application successfully started on port 3001
```

### 3.2 Start Frontend Web App
```bash
# Terminal 2: Start web server
npm run dev:web

# Should see:
# ▲ Next.js ready on http://localhost:3000
```

### 3.3 Verify Both Servers
- API Health Check: http://localhost:3001/health
- Frontend: http://localhost:3000

## 🧪 Step 4: Testing the Platform

### 4.1 Test API Endpoints

**Health Check:**
```bash
curl http://localhost:3001/health
# Expected: {"status":"ok","database":"connected"}
```

**Create Tenant:**
```bash
curl -X POST http://localhost:3001/tenants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Demo Hospital",
    "slug": "demo-hospital"
  }'
```

**Register User:**
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: <tenant-id-from-above>" \
  -d '{
    "email": "admin@demo-hospital.com",
    "password": "SecurePass123!",
    "role": "HOSPITAL_ADMIN",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: <tenant-id>" \
  -d '{
    "email": "admin@demo-hospital.com",
    "password": "SecurePass123!"
  }'
```

### 4.2 Test Frontend Interface

1. **Access Frontend:** http://localhost:3000
2. **Navigate to Login:** http://localhost:3000/login
3. **Test Registration:** http://localhost:3000/onboarding
4. **Test Dashboard:** http://localhost:3000/dashboard

## 🏥 Step 5: Module-by-Module Testing

### 5.1 Patient Management
```bash
# Create Patient
curl -X POST http://localhost:3001/patients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -H "x-tenant-id: <tenant-id>" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "dob": "1990-01-01",
    "gender": "Female",
    "phone": "+1234567890",
    "email": "jane.smith@email.com"
  }'

# List Patients
curl http://localhost:3001/patients \
  -H "Authorization: Bearer <jwt-token>" \
  -H "x-tenant-id: <tenant-id>"
```

### 5.2 Emergency Department
```bash
# Create Emergency Case
curl -X POST http://localhost:3001/emergency/cases \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -H "x-tenant-id: <tenant-id>" \
  -d '{
    "patientId": "<patient-id>",
    "triageLevel": "HIGH",
    "chiefComplaint": "Chest pain and shortness of breath",
    "vitals": {
      "bloodPressure": "140/90",
      "heartRate": 95,
      "temperature": 98.6
    }
  }'

# List Emergency Cases
curl http://localhost:3001/emergency/cases \
  -H "Authorization: Bearer <jwt-token>" \
  -H "x-tenant-id: <tenant-id>"
```

### 5.3 Laboratory Module
```bash
# Create Lab Test
curl -X POST http://localhost:3001/lab/tests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -H "x-tenant-id: <tenant-id>" \
  -d '{
    "name": "Complete Blood Count",
    "code": "CBC",
    "description": "Full blood panel analysis",
    "priceCents": 5000
  }'

# Order Lab Test
curl -X POST http://localhost:3001/lab/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -H "x-tenant-id: <tenant-id>" \
  -d '{
    "patientId": "<patient-id>",
    "testId": "<test-id>"
  }'
```

### 5.4 Pharmacy Module
```bash
# Add Inventory Item
curl -X POST http://localhost:3001/pharmacy/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -H "x-tenant-id: <tenant-id>" \
  -d '{
    "name": "Paracetamol 500mg",
    "sku": "PAR500",
    "quantity": 100,
    "priceCents": 500,
    "expiryDate": "2025-12-31"
  }'

# Create Prescription
curl -X POST http://localhost:3001/pharmacy/prescriptions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -H "x-tenant-id: <tenant-id>" \
  -d '{
    "patientId": "<patient-id>",
    "doctorId": "<doctor-user-id>",
    "items": [
      {
        "sku": "PAR500",
        "name": "Paracetamol 500mg",
        "quantity": 10,
        "instructions": "Take 1 tablet twice daily after meals"
      }
    ]
  }'
```

### 5.5 Private Chambers
```bash
# Create Chamber
curl -X POST http://localhost:3001/chambers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -H "x-tenant-id: <tenant-id>" \
  -d '{
    "name": "Dr. Smith Cardiology Clinic",
    "address": "123 Medical Center, City",
    "phone": "+1234567890",
    "consultationFee": 10000,
    "workingHours": {
      "monday": {"start": "09:00", "end": "17:00"},
      "tuesday": {"start": "09:00", "end": "17:00"}
    }
  }'
```

## 🎨 Step 6: Frontend Testing

### 6.1 Test Emergency Department UI
1. Navigate to: http://localhost:3000/emergency
2. Click "New Emergency Case"
3. Fill in patient details and triage level
4. Verify case appears in the dashboard

### 6.2 Test Private Chambers UI
1. Navigate to: http://localhost:3000/chambers
2. Click "Add New Chamber"
3. Fill in chamber details
4. Verify chamber appears in the list

### 6.3 Test Patient Management
1. Navigate to: http://localhost:3000/patients
2. Add new patient
3. View patient details
4. Edit patient information

## 🔍 Step 7: Audit & Compliance Testing

### 7.1 Test Audit Logging
```bash
# View audit logs
curl http://localhost:3001/audit/logs \
  -H "Authorization: Bearer <jwt-token>" \
  -H "x-tenant-id: <tenant-id>"
```

### 7.2 Test Multi-Tenant Isolation
1. Create second tenant
2. Create users for both tenants
3. Verify data isolation between tenants

## 📊 Step 8: Performance & Load Testing

### 8.1 Database Performance
```bash
# Check database connections
npm --workspace api exec prisma studio
```

### 8.2 API Performance
Use tools like Apache Bench or Artillery:
```bash
# Install artillery
npm install -g artillery

# Create load test config
artillery quick --count 10 --num 5 http://localhost:3001/health
```

## 🐛 Step 9: Troubleshooting Common Issues

### 9.1 Database Connection Issues
```bash
# Check PostgreSQL status
pg_isready -h localhost -p 5432

# Reset database
npm --workspace api exec prisma migrate reset
```

### 9.2 Port Conflicts
```bash
# Check what's running on ports
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Kill processes if needed
taskkill /PID <process-id> /F
```

### 9.3 Prisma Issues
```bash
# Regenerate Prisma client
npm --workspace api exec prisma generate

# Reset and regenerate
npm --workspace api exec prisma migrate reset
npm --workspace api exec prisma db push
```

## ✅ Step 10: Production Readiness Checklist

### 10.1 Security
- [ ] Change default JWT secret
- [ ] Set up HTTPS certificates
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable audit logging

### 10.2 Database
- [ ] Set up database backups
- [ ] Configure connection pooling
- [ ] Set up monitoring
- [ ] Optimize indexes

### 10.3 Deployment
- [ ] Set up CI/CD pipeline
- [ ] Configure environment variables
- [ ] Set up monitoring and logging
- [ ] Configure load balancing

## 🎯 Success Criteria

Your HMS SaaS platform is successfully set up when:
- ✅ Both servers start without errors
- ✅ Database migrations complete successfully
- ✅ API endpoints respond correctly
- ✅ Frontend loads and functions properly
- ✅ Multi-tenant isolation works
- ✅ All modules (Emergency, Lab, Pharmacy, Chambers) function
- ✅ Audit logging captures activities
- ✅ Authentication and authorization work

## 🆘 Getting Help

If you encounter issues:
1. Check the console logs for both frontend and backend
2. Verify database connection and schema
3. Ensure all environment variables are set correctly
4. Check network connectivity and port availability
5. Review the troubleshooting section above

Your HMS SaaS platform is now ready for healthcare professionals! 🏥✨
