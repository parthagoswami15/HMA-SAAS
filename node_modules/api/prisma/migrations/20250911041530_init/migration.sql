-- CreateEnum
CREATE TYPE "public"."TenantType" AS ENUM ('HOSPITAL', 'CLINIC', 'LAB', 'PHARMACY', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."RegistrationType" AS ENUM ('WALK_IN', 'ONLINE', 'REFERRAL', 'TRANSFER', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."InsuranceType" AS ENUM ('CASH', 'CARD', 'UPI', 'INSURANCE', 'CORPORATE', 'GOVERNMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."MaritalStatus" AS ENUM ('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', 'SEPARATED', 'DOMESTIC_PARTNERSHIP', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "public"."BloodType" AS ENUM ('A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "public"."StaffType" AS ENUM ('DOCTOR', 'NURSE', 'TECHNICIAN', 'ADMINISTRATIVE', 'SUPPORT_STAFF');

-- CreateEnum
CREATE TYPE "public"."StaffStatus" AS ENUM ('ACTIVE', 'ON_LEAVE', 'SUSPENDED', 'TERMINATED', 'RETIRED');

-- CreateEnum
CREATE TYPE "public"."LeaveStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'ON_LEAVE');

-- CreateEnum
CREATE TYPE "public"."CredentialStatus" AS ENUM ('PENDING_VERIFICATION', 'VERIFIED', 'EXPIRED', 'REJECTED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('SUPER_ADMIN', 'HOSPITAL_ADMIN', 'DOCTOR', 'NURSE', 'PHARMACIST', 'RECEPTIONIST', 'LAB_TECHNICIAN', 'ACCOUNTANT', 'PATIENT', 'OWNER', 'PHYSICIAN');

-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'UNKNOWN', 'NOT_SPECIFIED');

-- CreateEnum
CREATE TYPE "public"."AppointmentStatus" AS ENUM ('SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "public"."OPDVisitStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."BedType" AS ENUM ('GENERAL', 'ICU', 'CCU', 'NICU', 'PICU', 'PRIVATE', 'SEMI_PRIVATE');

-- CreateEnum
CREATE TYPE "public"."BillingStatus" AS ENUM ('DRAFT', 'GENERATED', 'PAID', 'PARTIALLY_PAID', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'INSURANCE', 'BANK_TRANSFER', 'UPI', 'CHEQUE', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."LabTestStatus" AS ENUM ('REQUESTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."AdmissionStatus" AS ENUM ('ADMITTED', 'DISCHARGED', 'TRANSFERRED', 'ABSENT');

-- CreateEnum
CREATE TYPE "public"."MedicationStatus" AS ENUM ('PENDING', 'DISPENSED', 'CANCELLED', 'RETURNED');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RefreshToken" (
    "id" TEXT NOT NULL,
    "jti" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tenants" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."patients" (
    "id" TEXT NOT NULL,
    "medicalRecordNumber" TEXT NOT NULL,
    "registrationNumber" TEXT,
    "externalId" TEXT,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "gender" "public"."Gender",
    "bloodType" "public"."BloodType",
    "maritalStatus" "public"."MaritalStatus",
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT DEFAULT 'India',
    "pincode" TEXT,
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "alternatePhone" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "postalCode" TEXT,
    "aadhaarNumber" TEXT,
    "aadhaarVerified" BOOLEAN NOT NULL DEFAULT false,
    "panNumber" TEXT,
    "passportNumber" TEXT,
    "drivingLicense" TEXT,
    "nationalId" TEXT,
    "bloodGroup" TEXT,
    "rhFactor" TEXT,
    "allergies" JSONB,
    "chronicConditions" TEXT[],
    "currentMedications" TEXT[],
    "knownAllergies" TEXT[],
    "familyHistory" JSONB,
    "insuranceProvider" TEXT,
    "insuranceId" TEXT,
    "insuranceGroup" TEXT,
    "insuranceValidUntil" TIMESTAMP(3),
    "insuranceType" "public"."InsuranceType",
    "tpaId" TEXT,
    "registrationType" "public"."RegistrationType" NOT NULL DEFAULT 'WALK_IN',
    "referralSource" TEXT,
    "referralDoctor" TEXT,
    "referralHospital" TEXT,
    "religion" TEXT,
    "nationality" TEXT,
    "language" TEXT NOT NULL DEFAULT 'en',
    "preferredLanguage" TEXT,
    "isVIP" BOOLEAN NOT NULL DEFAULT false,
    "isDeceased" BOOLEAN NOT NULL DEFAULT false,
    "dateOfDeath" DATE,
    "causeOfDeath" TEXT,
    "notes" TEXT,
    "tenantId" TEXT NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "verifiedBy" TEXT,
    "verificationDate" TIMESTAMP(3),
    "verificationMethod" TEXT,
    "verificationNotes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "staffId" TEXT,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EmergencyContact" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "relationship" TEXT,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmergencyContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MedicalRecord" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "recordType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "appointmentId" TEXT,
    "labOrderId" TEXT,
    "isCritical" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "recordDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "doctorId" TEXT,

    CONSTRAINT "MedicalRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PatientDocument" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT,
    "fileSize" INTEGER,
    "category" TEXT,
    "uploadedBy" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PatientDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Department" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Specialty" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Specialty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Staff" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "type" "public"."StaffType" NOT NULL,
    "status" "public"."StaffStatus" NOT NULL DEFAULT 'ACTIVE',
    "designation" TEXT,
    "departmentId" TEXT,
    "joiningDate" TIMESTAMP(3),
    "leavingDate" TIMESTAMP(3),
    "qualification" TEXT,
    "experience" DOUBLE PRECISION DEFAULT 0,
    "bio" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StaffSpecialty" (
    "id" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "specialtyId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "experience" DOUBLE PRECISION DEFAULT 0,
    "notes" TEXT,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "StaffSpecialty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StaffRole" (
    "id" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "StaffRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Location" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Shift" (
    "id" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "type" TEXT,
    "notes" TEXT,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurrence" TEXT,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Leave" (
    "id" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "status" "public"."LeaveStatus" NOT NULL DEFAULT 'PENDING',
    "reason" TEXT,
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "comments" TEXT,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Leave_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Attendance" (
    "id" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "public"."AttendanceStatus" NOT NULL,
    "checkIn" TIMESTAMP(3),
    "checkOut" TIMESTAMP(3),
    "totalHours" DOUBLE PRECISION,
    "notes" TEXT,
    "recordedById" TEXT,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StaffCredential" (
    "id" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "issuingBody" TEXT NOT NULL,
    "credentialId" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "status" "public"."CredentialStatus" NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "documentUrl" TEXT,
    "verifiedById" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "notes" TEXT,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffCredential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StaffPrivilege" (
    "id" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "grantedBy" TEXT,
    "expiresAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffPrivilege_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Permission" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RolePermission" (
    "id" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL,
    "permissionId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "patientId" TEXT,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "type" TEXT,
    "metadata" JSONB,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PatientAuditLog" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "oldValue" JSONB,
    "newValue" JSONB,
    "performedBy" TEXT,
    "tenantId" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PatientAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Appointment" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "bedId" TEXT,
    "title" TEXT,
    "description" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "status" "public"."AppointmentStatus" NOT NULL DEFAULT 'SCHEDULED',
    "notes" TEXT,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."billings" (
    "id" TEXT NOT NULL,
    "invoiceNumber" VARCHAR(50) NOT NULL,
    "patientId" TEXT NOT NULL,
    "appointmentId" TEXT,
    "admissionId" TEXT,
    "opdVisitId" TEXT,
    "subtotal" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "discount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "taxAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "paidAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "dueAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "status" "public"."BillingStatus" NOT NULL DEFAULT 'DRAFT',
    "billingDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3),
    "notes" TEXT,
    "tenantId" TEXT NOT NULL,
    "bedId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "billings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BillingItem" (
    "id" TEXT NOT NULL,
    "billingId" TEXT NOT NULL,
    "itemType" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "unitPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BillingItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Payment" (
    "id" TEXT NOT NULL,
    "billingId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentMethod" "public"."PaymentMethod" NOT NULL,
    "transactionId" TEXT,
    "notes" TEXT,
    "receivedBy" TEXT,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Medication" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "genericName" TEXT,
    "description" TEXT,
    "manufacturer" TEXT,
    "dosageForm" TEXT,
    "strength" TEXT,
    "unit" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "reorderLevel" INTEGER NOT NULL DEFAULT 10,
    "unitPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Medication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PharmacyOrder" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT,
    "status" "public"."MedicationStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "dispensedBy" TEXT,
    "dispensedAt" TIMESTAMP(3),
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PharmacyOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PharmacyOrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "medicationId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "dosage" TEXT,
    "frequency" TEXT,
    "duration" TEXT,
    "instructions" TEXT,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PharmacyOrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LabTest" (
    "id" TEXT NOT NULL,
    "testCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LabTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LabOrder" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT,
    "status" "public"."LabTestStatus" NOT NULL DEFAULT 'REQUESTED',
    "notes" TEXT,
    "result" TEXT,
    "resultDate" TIMESTAMP(3),
    "verifiedBy" TEXT,
    "tenantId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LabOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LabOrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "status" "public"."LabTestStatus" NOT NULL DEFAULT 'REQUESTED',
    "result" TEXT,
    "resultDate" TIMESTAMP(3),
    "referenceRange" TEXT,
    "notes" TEXT,
    "performedBy" TEXT,
    "verifiedBy" TEXT,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LabOrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."IPDAdmission" (
    "id" TEXT NOT NULL,
    "admissionNumber" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "admissionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dischargeDate" TIMESTAMP(3),
    "status" "public"."AdmissionStatus" NOT NULL DEFAULT 'ADMITTED',
    "diagnosis" TEXT,
    "treatmentPlan" TEXT,
    "notes" TEXT,
    "bedId" TEXT,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IPDAdmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."beds" (
    "id" TEXT NOT NULL,
    "bedNumber" VARCHAR(20) NOT NULL,
    "roomNumber" VARCHAR(20) NOT NULL,
    "floor" VARCHAR(10),
    "bedType" "public"."BedType" DEFAULT 'GENERAL',
    "isOccupied" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "beds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."IPDVital" (
    "id" TEXT NOT NULL,
    "admissionId" TEXT NOT NULL,
    "temperature" DOUBLE PRECISION,
    "bloodPressure" TEXT,
    "pulse" INTEGER,
    "respiratoryRate" INTEGER,
    "oxygenSaturation" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "bmi" DOUBLE PRECISION,
    "notes" TEXT,
    "recordedById" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IPDVital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."IPDMedication" (
    "id" TEXT NOT NULL,
    "admissionId" TEXT NOT NULL,
    "medicationId" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "route" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "instructions" TEXT,
    "prescribedById" TEXT NOT NULL,
    "status" "public"."MedicationStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IPDMedication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."IPDProcedure" (
    "id" TEXT NOT NULL,
    "admissionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "procedureDate" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "performedById" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IPDProcedure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."opd_visits" (
    "id" TEXT NOT NULL,
    "visitNumber" VARCHAR(50) NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "visitDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "symptoms" TEXT,
    "diagnosis" VARCHAR(20),
    "treatment" TEXT,
    "notes" TEXT,
    "followUpDate" TIMESTAMP(3),
    "status" "public"."OPDVisitStatus" NOT NULL DEFAULT 'PENDING',
    "bedId" TEXT,
    "tenantId" TEXT NOT NULL,
    "billingId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "opd_visits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OPDVital" (
    "id" TEXT NOT NULL,
    "visitId" TEXT NOT NULL,
    "temperature" DOUBLE PRECISION,
    "bloodPressure" TEXT,
    "pulse" INTEGER,
    "respiratoryRate" INTEGER,
    "oxygenSaturation" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "bmi" DOUBLE PRECISION,
    "notes" TEXT,
    "recordedById" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OPDVital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OPDPrescription" (
    "id" TEXT NOT NULL,
    "visitId" TEXT NOT NULL,
    "medicationId" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "route" TEXT,
    "instructions" TEXT,
    "prescribedById" TEXT NOT NULL,
    "status" "public"."MedicationStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OPDPrescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."audit_logs" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" TEXT,
    "oldValues" JSONB,
    "newValues" JSONB,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "statusCode" INTEGER,
    "metadata" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_tenantId_idx" ON "public"."User"("tenantId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "public"."User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_jti_key" ON "public"."RefreshToken"("jti");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "public"."RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "RefreshToken_token_idx" ON "public"."RefreshToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_slug_key" ON "public"."tenants"("slug");

-- CreateIndex
CREATE INDEX "tenants_slug_idx" ON "public"."tenants"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "patients_medicalRecordNumber_key" ON "public"."patients"("medicalRecordNumber");

-- CreateIndex
CREATE UNIQUE INDEX "patients_registrationNumber_key" ON "public"."patients"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "patients_externalId_key" ON "public"."patients"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "patients_email_key" ON "public"."patients"("email");

-- CreateIndex
CREATE UNIQUE INDEX "patients_aadhaarNumber_key" ON "public"."patients"("aadhaarNumber");

-- CreateIndex
CREATE UNIQUE INDEX "patients_panNumber_key" ON "public"."patients"("panNumber");

-- CreateIndex
CREATE UNIQUE INDEX "patients_passportNumber_key" ON "public"."patients"("passportNumber");

-- CreateIndex
CREATE UNIQUE INDEX "patients_drivingLicense_key" ON "public"."patients"("drivingLicense");

-- CreateIndex
CREATE INDEX "patients_tenantId_idx" ON "public"."patients"("tenantId");

-- CreateIndex
CREATE INDEX "patients_medicalRecordNumber_idx" ON "public"."patients"("medicalRecordNumber");

-- CreateIndex
CREATE INDEX "patients_aadhaarNumber_idx" ON "public"."patients"("aadhaarNumber");

-- CreateIndex
CREATE INDEX "patients_phone_idx" ON "public"."patients"("phone");

-- CreateIndex
CREATE INDEX "patients_email_idx" ON "public"."patients"("email");

-- CreateIndex
CREATE INDEX "patients_lastName_firstName_idx" ON "public"."patients"("lastName", "firstName");

-- CreateIndex
CREATE INDEX "patients_createdAt_idx" ON "public"."patients"("createdAt");

-- CreateIndex
CREATE INDEX "patients_isVerified_idx" ON "public"."patients"("isVerified");

-- CreateIndex
CREATE INDEX "patients_isActive_idx" ON "public"."patients"("isActive");

-- CreateIndex
CREATE INDEX "patients_registrationType_idx" ON "public"."patients"("registrationType");

-- CreateIndex
CREATE INDEX "EmergencyContact_patientId_idx" ON "public"."EmergencyContact"("patientId");

-- CreateIndex
CREATE INDEX "MedicalRecord_patientId_idx" ON "public"."MedicalRecord"("patientId");

-- CreateIndex
CREATE INDEX "MedicalRecord_recordDate_idx" ON "public"."MedicalRecord"("recordDate");

-- CreateIndex
CREATE INDEX "MedicalRecord_recordType_idx" ON "public"."MedicalRecord"("recordType");

-- CreateIndex
CREATE INDEX "MedicalRecord_doctorId_idx" ON "public"."MedicalRecord"("doctorId");

-- CreateIndex
CREATE INDEX "PatientDocument_patientId_idx" ON "public"."PatientDocument"("patientId");

-- CreateIndex
CREATE INDEX "PatientDocument_category_idx" ON "public"."PatientDocument"("category");

-- CreateIndex
CREATE UNIQUE INDEX "Department_code_key" ON "public"."Department"("code");

-- CreateIndex
CREATE INDEX "Department_tenantId_idx" ON "public"."Department"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "Specialty_code_key" ON "public"."Specialty"("code");

-- CreateIndex
CREATE INDEX "Specialty_tenantId_idx" ON "public"."Specialty"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_userId_key" ON "public"."Staff"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_employeeId_key" ON "public"."Staff"("employeeId");

-- CreateIndex
CREATE INDEX "Staff_tenantId_idx" ON "public"."Staff"("tenantId");

-- CreateIndex
CREATE INDEX "Staff_employeeId_idx" ON "public"."Staff"("employeeId");

-- CreateIndex
CREATE INDEX "Staff_type_idx" ON "public"."Staff"("type");

-- CreateIndex
CREATE INDEX "Staff_status_idx" ON "public"."Staff"("status");

-- CreateIndex
CREATE INDEX "StaffSpecialty_tenantId_idx" ON "public"."StaffSpecialty"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "StaffSpecialty_staffId_specialtyId_key" ON "public"."StaffSpecialty"("staffId", "specialtyId");

-- CreateIndex
CREATE INDEX "StaffRole_tenantId_idx" ON "public"."StaffRole"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "StaffRole_staffId_role_key" ON "public"."StaffRole"("staffId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "Location_code_key" ON "public"."Location"("code");

-- CreateIndex
CREATE INDEX "Location_tenantId_idx" ON "public"."Location"("tenantId");

-- CreateIndex
CREATE INDEX "Shift_staffId_idx" ON "public"."Shift"("staffId");

-- CreateIndex
CREATE INDEX "Shift_locationId_idx" ON "public"."Shift"("locationId");

-- CreateIndex
CREATE INDEX "Shift_tenantId_idx" ON "public"."Shift"("tenantId");

-- CreateIndex
CREATE INDEX "Shift_startTime_endTime_idx" ON "public"."Shift"("startTime", "endTime");

-- CreateIndex
CREATE INDEX "Leave_staffId_idx" ON "public"."Leave"("staffId");

-- CreateIndex
CREATE INDEX "Leave_tenantId_idx" ON "public"."Leave"("tenantId");

-- CreateIndex
CREATE INDEX "Leave_startDate_endDate_idx" ON "public"."Leave"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "Attendance_staffId_idx" ON "public"."Attendance"("staffId");

-- CreateIndex
CREATE INDEX "Attendance_tenantId_idx" ON "public"."Attendance"("tenantId");

-- CreateIndex
CREATE INDEX "Attendance_date_idx" ON "public"."Attendance"("date");

-- CreateIndex
CREATE INDEX "StaffCredential_staffId_idx" ON "public"."StaffCredential"("staffId");

-- CreateIndex
CREATE INDEX "StaffCredential_tenantId_idx" ON "public"."StaffCredential"("tenantId");

-- CreateIndex
CREATE INDEX "StaffCredential_credentialId_idx" ON "public"."StaffCredential"("credentialId");

-- CreateIndex
CREATE INDEX "StaffPrivilege_staffId_idx" ON "public"."StaffPrivilege"("staffId");

-- CreateIndex
CREATE INDEX "StaffPrivilege_tenantId_idx" ON "public"."StaffPrivilege"("tenantId");

-- CreateIndex
CREATE INDEX "StaffPrivilege_code_idx" ON "public"."StaffPrivilege"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_key_key" ON "public"."Permission"("key");

-- CreateIndex
CREATE INDEX "Permission_tenantId_idx" ON "public"."Permission"("tenantId");

-- CreateIndex
CREATE INDEX "Permission_key_idx" ON "public"."Permission"("key");

-- CreateIndex
CREATE INDEX "RolePermission_tenantId_idx" ON "public"."RolePermission"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_role_permissionId_key" ON "public"."RolePermission"("role", "permissionId");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "public"."Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_tenantId_idx" ON "public"."Notification"("tenantId");

-- CreateIndex
CREATE INDEX "Notification_isRead_idx" ON "public"."Notification"("isRead");

-- CreateIndex
CREATE INDEX "PatientAuditLog_patientId_idx" ON "public"."PatientAuditLog"("patientId");

-- CreateIndex
CREATE INDEX "PatientAuditLog_tenantId_idx" ON "public"."PatientAuditLog"("tenantId");

-- CreateIndex
CREATE INDEX "PatientAuditLog_action_idx" ON "public"."PatientAuditLog"("action");

-- CreateIndex
CREATE INDEX "PatientAuditLog_entity_entityId_idx" ON "public"."PatientAuditLog"("entity", "entityId");

-- CreateIndex
CREATE INDEX "Appointment_patientId_idx" ON "public"."Appointment"("patientId");

-- CreateIndex
CREATE INDEX "Appointment_doctorId_idx" ON "public"."Appointment"("doctorId");

-- CreateIndex
CREATE INDEX "Appointment_startTime_idx" ON "public"."Appointment"("startTime");

-- CreateIndex
CREATE INDEX "Appointment_status_idx" ON "public"."Appointment"("status");

-- CreateIndex
CREATE INDEX "Appointment_tenantId_idx" ON "public"."Appointment"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "billings_invoiceNumber_key" ON "public"."billings"("invoiceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "billings_opdVisitId_key" ON "public"."billings"("opdVisitId");

-- CreateIndex
CREATE INDEX "billings_patientId_idx" ON "public"."billings"("patientId");

-- CreateIndex
CREATE INDEX "billings_appointmentId_idx" ON "public"."billings"("appointmentId");

-- CreateIndex
CREATE INDEX "billings_admissionId_idx" ON "public"."billings"("admissionId");

-- CreateIndex
CREATE INDEX "billings_opdVisitId_idx" ON "public"."billings"("opdVisitId");

-- CreateIndex
CREATE INDEX "billings_bedId_idx" ON "public"."billings"("bedId");

-- CreateIndex
CREATE INDEX "billings_status_idx" ON "public"."billings"("status");

-- CreateIndex
CREATE INDEX "billings_billingDate_idx" ON "public"."billings"("billingDate");

-- CreateIndex
CREATE INDEX "billings_dueDate_idx" ON "public"."billings"("dueDate");

-- CreateIndex
CREATE INDEX "billings_tenantId_idx" ON "public"."billings"("tenantId");

-- CreateIndex
CREATE INDEX "BillingItem_billingId_idx" ON "public"."BillingItem"("billingId");

-- CreateIndex
CREATE INDEX "BillingItem_tenantId_idx" ON "public"."BillingItem"("tenantId");

-- CreateIndex
CREATE INDEX "Payment_billingId_idx" ON "public"."Payment"("billingId");

-- CreateIndex
CREATE INDEX "Payment_tenantId_idx" ON "public"."Payment"("tenantId");

-- CreateIndex
CREATE INDEX "Payment_paymentDate_idx" ON "public"."Payment"("paymentDate");

-- CreateIndex
CREATE INDEX "Medication_name_idx" ON "public"."Medication"("name");

-- CreateIndex
CREATE INDEX "Medication_genericName_idx" ON "public"."Medication"("genericName");

-- CreateIndex
CREATE INDEX "Medication_tenantId_idx" ON "public"."Medication"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "PharmacyOrder_orderNumber_key" ON "public"."PharmacyOrder"("orderNumber");

-- CreateIndex
CREATE INDEX "PharmacyOrder_patientId_idx" ON "public"."PharmacyOrder"("patientId");

-- CreateIndex
CREATE INDEX "PharmacyOrder_doctorId_idx" ON "public"."PharmacyOrder"("doctorId");

-- CreateIndex
CREATE INDEX "PharmacyOrder_status_idx" ON "public"."PharmacyOrder"("status");

-- CreateIndex
CREATE INDEX "PharmacyOrder_tenantId_idx" ON "public"."PharmacyOrder"("tenantId");

-- CreateIndex
CREATE INDEX "PharmacyOrderItem_orderId_idx" ON "public"."PharmacyOrderItem"("orderId");

-- CreateIndex
CREATE INDEX "PharmacyOrderItem_medicationId_idx" ON "public"."PharmacyOrderItem"("medicationId");

-- CreateIndex
CREATE INDEX "PharmacyOrderItem_tenantId_idx" ON "public"."PharmacyOrderItem"("tenantId");

-- CreateIndex
CREATE INDEX "LabTest_testCode_idx" ON "public"."LabTest"("testCode");

-- CreateIndex
CREATE INDEX "LabTest_name_idx" ON "public"."LabTest"("name");

-- CreateIndex
CREATE INDEX "LabTest_category_idx" ON "public"."LabTest"("category");

-- CreateIndex
CREATE INDEX "LabTest_tenantId_idx" ON "public"."LabTest"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "LabOrder_orderNumber_key" ON "public"."LabOrder"("orderNumber");

-- CreateIndex
CREATE INDEX "LabOrder_patientId_idx" ON "public"."LabOrder"("patientId");

-- CreateIndex
CREATE INDEX "LabOrder_doctorId_idx" ON "public"."LabOrder"("doctorId");

-- CreateIndex
CREATE INDEX "LabOrder_status_idx" ON "public"."LabOrder"("status");

-- CreateIndex
CREATE INDEX "LabOrder_resultDate_idx" ON "public"."LabOrder"("resultDate");

-- CreateIndex
CREATE INDEX "LabOrder_tenantId_idx" ON "public"."LabOrder"("tenantId");

-- CreateIndex
CREATE INDEX "LabOrderItem_orderId_idx" ON "public"."LabOrderItem"("orderId");

-- CreateIndex
CREATE INDEX "LabOrderItem_testId_idx" ON "public"."LabOrderItem"("testId");

-- CreateIndex
CREATE INDEX "LabOrderItem_status_idx" ON "public"."LabOrderItem"("status");

-- CreateIndex
CREATE INDEX "LabOrderItem_resultDate_idx" ON "public"."LabOrderItem"("resultDate");

-- CreateIndex
CREATE INDEX "LabOrderItem_tenantId_idx" ON "public"."LabOrderItem"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "IPDAdmission_admissionNumber_key" ON "public"."IPDAdmission"("admissionNumber");

-- CreateIndex
CREATE INDEX "IPDAdmission_patientId_idx" ON "public"."IPDAdmission"("patientId");

-- CreateIndex
CREATE INDEX "IPDAdmission_doctorId_idx" ON "public"."IPDAdmission"("doctorId");

-- CreateIndex
CREATE INDEX "IPDAdmission_status_idx" ON "public"."IPDAdmission"("status");

-- CreateIndex
CREATE INDEX "IPDAdmission_bedId_idx" ON "public"."IPDAdmission"("bedId");

-- CreateIndex
CREATE INDEX "IPDAdmission_tenantId_idx" ON "public"."IPDAdmission"("tenantId");

-- CreateIndex
CREATE INDEX "beds_isOccupied_idx" ON "public"."beds"("isOccupied");

-- CreateIndex
CREATE INDEX "beds_bedType_idx" ON "public"."beds"("bedType");

-- CreateIndex
CREATE INDEX "beds_tenantId_idx" ON "public"."beds"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "beds_bedNumber_roomNumber_tenantId_key" ON "public"."beds"("bedNumber", "roomNumber", "tenantId");

-- CreateIndex
CREATE INDEX "IPDVital_admissionId_idx" ON "public"."IPDVital"("admissionId");

-- CreateIndex
CREATE INDEX "IPDVital_recordedById_idx" ON "public"."IPDVital"("recordedById");

-- CreateIndex
CREATE INDEX "IPDVital_tenantId_idx" ON "public"."IPDVital"("tenantId");

-- CreateIndex
CREATE INDEX "IPDMedication_admissionId_idx" ON "public"."IPDMedication"("admissionId");

-- CreateIndex
CREATE INDEX "IPDMedication_medicationId_idx" ON "public"."IPDMedication"("medicationId");

-- CreateIndex
CREATE INDEX "IPDMedication_prescribedById_idx" ON "public"."IPDMedication"("prescribedById");

-- CreateIndex
CREATE INDEX "IPDMedication_status_idx" ON "public"."IPDMedication"("status");

-- CreateIndex
CREATE INDEX "IPDMedication_tenantId_idx" ON "public"."IPDMedication"("tenantId");

-- CreateIndex
CREATE INDEX "IPDProcedure_admissionId_idx" ON "public"."IPDProcedure"("admissionId");

-- CreateIndex
CREATE INDEX "IPDProcedure_performedById_idx" ON "public"."IPDProcedure"("performedById");

-- CreateIndex
CREATE INDEX "IPDProcedure_procedureDate_idx" ON "public"."IPDProcedure"("procedureDate");

-- CreateIndex
CREATE INDEX "IPDProcedure_tenantId_idx" ON "public"."IPDProcedure"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "opd_visits_visitNumber_key" ON "public"."opd_visits"("visitNumber");

-- CreateIndex
CREATE UNIQUE INDEX "opd_visits_billingId_key" ON "public"."opd_visits"("billingId");

-- CreateIndex
CREATE INDEX "opd_visits_patientId_idx" ON "public"."opd_visits"("patientId");

-- CreateIndex
CREATE INDEX "opd_visits_doctorId_idx" ON "public"."opd_visits"("doctorId");

-- CreateIndex
CREATE INDEX "opd_visits_visitDate_idx" ON "public"."opd_visits"("visitDate");

-- CreateIndex
CREATE INDEX "opd_visits_status_idx" ON "public"."opd_visits"("status");

-- CreateIndex
CREATE INDEX "opd_visits_bedId_idx" ON "public"."opd_visits"("bedId");

-- CreateIndex
CREATE INDEX "opd_visits_tenantId_idx" ON "public"."opd_visits"("tenantId");

-- CreateIndex
CREATE INDEX "OPDVital_visitId_idx" ON "public"."OPDVital"("visitId");

-- CreateIndex
CREATE INDEX "OPDVital_recordedById_idx" ON "public"."OPDVital"("recordedById");

-- CreateIndex
CREATE INDEX "OPDVital_tenantId_idx" ON "public"."OPDVital"("tenantId");

-- CreateIndex
CREATE INDEX "OPDPrescription_visitId_idx" ON "public"."OPDPrescription"("visitId");

-- CreateIndex
CREATE INDEX "OPDPrescription_medicationId_idx" ON "public"."OPDPrescription"("medicationId");

-- CreateIndex
CREATE INDEX "OPDPrescription_prescribedById_idx" ON "public"."OPDPrescription"("prescribedById");

-- CreateIndex
CREATE INDEX "OPDPrescription_status_idx" ON "public"."OPDPrescription"("status");

-- CreateIndex
CREATE INDEX "OPDPrescription_tenantId_idx" ON "public"."OPDPrescription"("tenantId");

-- CreateIndex
CREATE INDEX "audit_logs_tenantId_idx" ON "public"."audit_logs"("tenantId");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "public"."audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_resource_idx" ON "public"."audit_logs"("resource");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "public"."audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_timestamp_idx" ON "public"."audit_logs"("timestamp");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RefreshToken" ADD CONSTRAINT "RefreshToken_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."patients" ADD CONSTRAINT "patients_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."patients" ADD CONSTRAINT "patients_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "public"."Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EmergencyContact" ADD CONSTRAINT "EmergencyContact_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MedicalRecord" ADD CONSTRAINT "MedicalRecord_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MedicalRecord" ADD CONSTRAINT "MedicalRecord_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "public"."Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MedicalRecord" ADD CONSTRAINT "MedicalRecord_labOrderId_fkey" FOREIGN KEY ("labOrderId") REFERENCES "public"."LabOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PatientDocument" ADD CONSTRAINT "PatientDocument_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Department" ADD CONSTRAINT "Department_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Specialty" ADD CONSTRAINT "Specialty_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Staff" ADD CONSTRAINT "Staff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Staff" ADD CONSTRAINT "Staff_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Staff" ADD CONSTRAINT "Staff_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StaffSpecialty" ADD CONSTRAINT "StaffSpecialty_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "public"."Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StaffSpecialty" ADD CONSTRAINT "StaffSpecialty_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "public"."Specialty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StaffSpecialty" ADD CONSTRAINT "StaffSpecialty_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StaffRole" ADD CONSTRAINT "StaffRole_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "public"."Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StaffRole" ADD CONSTRAINT "StaffRole_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Location" ADD CONSTRAINT "Location_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Shift" ADD CONSTRAINT "Shift_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "public"."Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Shift" ADD CONSTRAINT "Shift_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Shift" ADD CONSTRAINT "Shift_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Leave" ADD CONSTRAINT "Leave_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "public"."Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Leave" ADD CONSTRAINT "Leave_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Attendance" ADD CONSTRAINT "Attendance_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "public"."Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Attendance" ADD CONSTRAINT "Attendance_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StaffCredential" ADD CONSTRAINT "StaffCredential_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "public"."Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StaffCredential" ADD CONSTRAINT "StaffCredential_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StaffPrivilege" ADD CONSTRAINT "StaffPrivilege_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "public"."Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StaffPrivilege" ADD CONSTRAINT "StaffPrivilege_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Permission" ADD CONSTRAINT "Permission_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "public"."Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RolePermission" ADD CONSTRAINT "RolePermission_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."patients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PatientAuditLog" ADD CONSTRAINT "PatientAuditLog_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PatientAuditLog" ADD CONSTRAINT "PatientAuditLog_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Appointment" ADD CONSTRAINT "Appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Appointment" ADD CONSTRAINT "Appointment_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Appointment" ADD CONSTRAINT "Appointment_bedId_fkey" FOREIGN KEY ("bedId") REFERENCES "public"."beds"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Appointment" ADD CONSTRAINT "Appointment_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."billings" ADD CONSTRAINT "billings_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."billings" ADD CONSTRAINT "billings_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "public"."Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."billings" ADD CONSTRAINT "billings_admissionId_fkey" FOREIGN KEY ("admissionId") REFERENCES "public"."IPDAdmission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."billings" ADD CONSTRAINT "billings_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."billings" ADD CONSTRAINT "billings_bedId_fkey" FOREIGN KEY ("bedId") REFERENCES "public"."beds"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BillingItem" ADD CONSTRAINT "BillingItem_billingId_fkey" FOREIGN KEY ("billingId") REFERENCES "public"."billings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BillingItem" ADD CONSTRAINT "BillingItem_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_billingId_fkey" FOREIGN KEY ("billingId") REFERENCES "public"."billings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Medication" ADD CONSTRAINT "Medication_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PharmacyOrder" ADD CONSTRAINT "PharmacyOrder_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PharmacyOrder" ADD CONSTRAINT "PharmacyOrder_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PharmacyOrder" ADD CONSTRAINT "PharmacyOrder_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PharmacyOrderItem" ADD CONSTRAINT "PharmacyOrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."PharmacyOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PharmacyOrderItem" ADD CONSTRAINT "PharmacyOrderItem_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "public"."Medication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PharmacyOrderItem" ADD CONSTRAINT "PharmacyOrderItem_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LabTest" ADD CONSTRAINT "LabTest_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LabOrder" ADD CONSTRAINT "LabOrder_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LabOrder" ADD CONSTRAINT "LabOrder_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LabOrder" ADD CONSTRAINT "LabOrder_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LabOrder" ADD CONSTRAINT "LabOrder_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LabOrder" ADD CONSTRAINT "LabOrder_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LabOrderItem" ADD CONSTRAINT "LabOrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."LabOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LabOrderItem" ADD CONSTRAINT "LabOrderItem_testId_fkey" FOREIGN KEY ("testId") REFERENCES "public"."LabTest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LabOrderItem" ADD CONSTRAINT "LabOrderItem_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."IPDAdmission" ADD CONSTRAINT "IPDAdmission_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."IPDAdmission" ADD CONSTRAINT "IPDAdmission_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."IPDAdmission" ADD CONSTRAINT "IPDAdmission_bedId_fkey" FOREIGN KEY ("bedId") REFERENCES "public"."beds"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."IPDAdmission" ADD CONSTRAINT "IPDAdmission_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."beds" ADD CONSTRAINT "beds_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."IPDVital" ADD CONSTRAINT "IPDVital_admissionId_fkey" FOREIGN KEY ("admissionId") REFERENCES "public"."IPDAdmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."IPDVital" ADD CONSTRAINT "IPDVital_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."IPDVital" ADD CONSTRAINT "IPDVital_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."IPDMedication" ADD CONSTRAINT "IPDMedication_admissionId_fkey" FOREIGN KEY ("admissionId") REFERENCES "public"."IPDAdmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."IPDMedication" ADD CONSTRAINT "IPDMedication_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "public"."Medication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."IPDMedication" ADD CONSTRAINT "IPDMedication_prescribedById_fkey" FOREIGN KEY ("prescribedById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."IPDMedication" ADD CONSTRAINT "IPDMedication_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."IPDProcedure" ADD CONSTRAINT "IPDProcedure_admissionId_fkey" FOREIGN KEY ("admissionId") REFERENCES "public"."IPDAdmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."IPDProcedure" ADD CONSTRAINT "IPDProcedure_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."IPDProcedure" ADD CONSTRAINT "IPDProcedure_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."opd_visits" ADD CONSTRAINT "opd_visits_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."opd_visits" ADD CONSTRAINT "opd_visits_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."opd_visits" ADD CONSTRAINT "opd_visits_bedId_fkey" FOREIGN KEY ("bedId") REFERENCES "public"."beds"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."opd_visits" ADD CONSTRAINT "opd_visits_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."opd_visits" ADD CONSTRAINT "opd_visits_billingId_fkey" FOREIGN KEY ("billingId") REFERENCES "public"."billings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OPDVital" ADD CONSTRAINT "OPDVital_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "public"."opd_visits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OPDVital" ADD CONSTRAINT "OPDVital_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OPDVital" ADD CONSTRAINT "OPDVital_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OPDPrescription" ADD CONSTRAINT "OPDPrescription_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "public"."opd_visits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OPDPrescription" ADD CONSTRAINT "OPDPrescription_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "public"."Medication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OPDPrescription" ADD CONSTRAINT "OPDPrescription_prescribedById_fkey" FOREIGN KEY ("prescribedById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OPDPrescription" ADD CONSTRAINT "OPDPrescription_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."audit_logs" ADD CONSTRAINT "audit_logs_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
