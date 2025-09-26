"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const tenant_info_dto_1 = require("../../tenants/dto/tenant-info.dto");
const class_transformer_1 = require("class-transformer");
class PatientResponseDto {
    constructor(patient) {
        this.id = patient.id;
        this.medicalRecordNumber = patient.medicalRecordNumber;
        this.registrationNumber = patient.registrationNumber || null;
        this.externalId = patient.externalId || null;
        this.title = patient.title || null;
        this.firstName = patient.firstName;
        this.middleName = patient.middleName || null;
        this.lastName = patient.lastName;
        this.fullName = [patient.title, patient.firstName, patient.middleName, patient.lastName]
            .filter(Boolean)
            .join(' ');
        this.photoUrl = patient.photoUrl || null;
        this.dob = patient.dob || null;
        this.gender = patient.gender || null;
        this.bloodType = patient.bloodType || null;
        this.maritalStatus = patient.maritalStatus || null;
        this.occupation = patient.occupation || null;
        this.phone = patient.phone || null;
        this.alternatePhone = patient.alternatePhone || null;
        this.email = patient.email || null;
        this.addressLine1 = patient.addressLine1 || null;
        this.addressLine2 = patient.addressLine2 || null;
        this.city = patient.city || null;
        this.state = patient.state || null;
        this.postalCode = patient.postalCode || null;
        this.country = patient.country || null;
        this.aadhaarNumber = patient.aadhaarNumber || null;
        this.panNumber = patient.panNumber || null;
        this.passportNumber = patient.passportNumber || null;
        this.drivingLicense = patient.drivingLicense || null;
        this.bloodGroup = patient.bloodGroup || null;
        this.rhFactor = patient.rhFactor || null;
        this.allergies = patient.allergies || null;
        this.chronicConditions = patient.chronicConditions || [];
        this.currentMedications = patient.currentMedications || [];
        this.knownAllergies = patient.knownAllergies || [];
        this.insuranceProvider = patient.insuranceProvider || null;
        this.insuranceId = patient.insuranceId || null;
        this.insuranceGroup = patient.insuranceGroup || null;
        this.insuranceValidUntil = patient.insuranceValidUntil || null;
        this.religion = patient.religion || null;
        this.nationality = patient.nationality || null;
        this.language = patient.language || 'en';
        this.isVIP = patient.isVIP || false;
        this.isDeceased = patient.isDeceased || false;
        this.dateOfDeath = patient.dateOfDeath || null;
        this.causeOfDeath = patient.causeOfDeath || null;
        this.notes = patient.notes || null;
        this.isActive = patient.isActive;
        this.deletedAt = patient.deletedAt || null;
        this.createdAt = patient.createdAt;
        this.updatedAt = patient.updatedAt;
        this.tenantId = patient.tenantId;
        this.tenant = patient.tenant ? new tenant_info_dto_1.TenantInfoDto(patient.tenant) : undefined;
        this.emergencyContacts = patient.emergencyContacts?.map(ec => ({
            id: ec.id,
            name: ec.name,
            relationship: ec.relationship,
            phone: ec.phone,
            email: ec.email || null,
            address: ec.address || null,
            isPrimary: ec.isPrimary,
            notes: ec.notes || null,
            createdAt: ec.createdAt,
            updatedAt: ec.updatedAt
        })) || [];
        if (this.dob) {
            const birthDate = new Date(this.dob);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            this.age = age;
        }
    }
    id;
    medicalRecordNumber;
    registrationNumber;
    registrationType;
    referralSource;
    referringDoctor;
    referringContact;
    externalId;
    title;
    firstName;
    middleName;
    lastName;
    fullName;
    photoUrl;
    dob;
    age;
    gender;
    bloodType;
    bloodGroup;
    rhFactor;
    maritalStatus;
    occupation;
    phone;
    alternatePhone;
    email;
    isEmailVerified;
    isPhoneVerified;
    addressLine1;
    addressLine2;
    city;
    state;
    postalCode;
    country;
    aadhaarNumber;
    panNumber;
    passportNumber;
    drivingLicense;
    allergies;
    chronicConditions;
    currentMedications;
    knownAllergies;
    insuranceProvider;
    insuranceId;
    insuranceGroup;
    insurancePolicyNumber;
    insuranceType;
    tpaId;
    insuranceValidUntil;
    religion;
    nationality;
    language;
    verificationStatus;
    verificationNotes;
    verifiedAt;
    verifiedBy;
    isActive;
    isVerified;
    isDeceased;
    dateOfDeath;
    causeOfDeath;
    notes;
    deletedAt;
    createdAt;
    updatedAt;
    createdByUser;
    updatedByUser;
    tenantId;
    tenant;
    documents;
    emergencyContacts;
    specialNeeds;
    isVerified = false;
    verificationMethod = null;
    lastVerifiedAt = null;
    preferences = null;
    communicationPreferences = null;
    privacyPreferences = null;
    createdById = null;
    updatedById = null;
}
exports.PatientResponseDto = PatientResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier of the patient' }),
    __metadata("design:type", String)
], PatientResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Medical record number (MRN)' }),
    __metadata("design:type", String)
], PatientResponseDto.prototype, "medicalRecordNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Registration number' }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "registrationNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Registration type',
        enum: client_1.RegistrationType,
        enumName: 'RegistrationType'
    }),
    __metadata("design:type", typeof (_a = typeof client_1.RegistrationType !== "undefined" && client_1.RegistrationType) === "function" ? _a : Object)
], PatientResponseDto.prototype, "registrationType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Referral source information',
        example: 'Referred by Dr. Smith from City Hospital'
    }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "referralSource", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Referring doctor/hospital name',
        example: 'Dr. John Smith'
    }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "referringDoctor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Referring doctor/hospital contact',
        example: 'contact@hospital.com'
    }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "referringContact", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'External reference ID' }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "externalId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Title (Mr, Mrs, Dr, etc.)' }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'First name' }),
    __metadata("design:type", String)
], PatientResponseDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Middle name' }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "middleName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last name' }),
    __metadata("design:type", String)
], PatientResponseDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Full name (computed)' }),
    __metadata("design:type", String)
], PatientResponseDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'URL to patient photo' }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "photoUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Date of birth' }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "dob", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Age (computed from DOB)' }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "age", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.Gender, description: 'Gender' }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.BloodType, description: 'Blood type' }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "bloodType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Blood group (A, B, AB, O, etc.)' }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "bloodGroup", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'RH factor (+ or -)' }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "rhFactor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.MaritalStatus, description: 'Marital status' }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "maritalStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Occupation' }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "occupation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Primary phone number' }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Alternate phone number' }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "alternatePhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Email address',
        example: 'patient@example.com'
    }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether email is verified',
        default: false
    }),
    __metadata("design:type", Boolean)
], PatientResponseDto.prototype, "isEmailVerified", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether phone is verified',
        default: false
    }),
    __metadata("design:type", Boolean)
], PatientResponseDto.prototype, "isPhoneVerified", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Address line 1' }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "addressLine1", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Address line 2' }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "addressLine2", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'City' }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'State/Province' }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Postal/ZIP code' }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Country' }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Aadhaar number (India)' }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "aadhaarNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'PAN number (India)' }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "panNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Passport number' }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "passportNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Driving license number' }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "drivingLicense", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Object, description: 'Allergies information' }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "allergies", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], description: 'Chronic conditions' }),
    __metadata("design:type", Array)
], PatientResponseDto.prototype, "chronicConditions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], description: 'Current medications' }),
    __metadata("design:type", Array)
], PatientResponseDto.prototype, "currentMedications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], description: 'Known allergies' }),
    __metadata("design:type", Array)
], PatientResponseDto.prototype, "knownAllergies", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Insurance provider',
        example: 'United Healthcare'
    }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "insuranceProvider", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Insurance ID',
        example: 'UH123456789'
    }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "insuranceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Insurance group',
        example: 'GRP-12345'
    }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "insuranceGroup", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Insurance policy number',
        example: 'POL-987654'
    }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "insurancePolicyNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Insurance type',
        enum: client_1.InsuranceType,
        enumName: 'InsuranceType'
    }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "insuranceType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'TPA (Third Party Administrator) ID',
        example: 'TPA-12345'
    }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "tpaId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Insurance valid until date',
        example: '2025-12-31T23:59:59.999Z'
    }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "insuranceValidUntil", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Religion' }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "religion", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Nationality' }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "nationality", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Preferred language (ISO 639-1 code)' }),
    __metadata("design:type", String)
], PatientResponseDto.prototype, "language", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Verification status',
        enum: client_1.VerificationStatus,
        enumName: 'VerificationStatus'
    }),
    __metadata("design:type", typeof (_f = typeof client_1.VerificationStatus !== "undefined" && client_1.VerificationStatus) === "function" ? _f : Object)
], PatientResponseDto.prototype, "verificationStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Verification notes',
        example: 'ID verified with passport on 2023-01-15'
    }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "verificationNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date when patient was last verified',
        example: '2023-01-15T10:30:00.000Z'
    }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "verifiedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID of the user who verified the patient',
        example: '550e8400-e29b-41d4-a716-446655440000'
    }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "verifiedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Is patient active',
        default: true
    }),
    __metadata("design:type", Boolean)
], PatientResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Is patient verified',
        default: false
    }),
    __metadata("design:type", Boolean)
], PatientResponseDto.prototype, "isVerified", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Deceased status' }),
    __metadata("design:type", Boolean)
], PatientResponseDto.prototype, "isDeceased", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Date of death' }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "dateOfDeath", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Cause of death' }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "causeOfDeath", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional notes' }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Deletion timestamp (soft delete)' }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "deletedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date when patient was created',
        example: '2023-01-01T12:00:00.000Z'
    }),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], PatientResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date when patient was last updated',
        example: '2023-01-15T14:30:00.000Z'
    }),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], PatientResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User who created the patient record',
        type: 'object',
        example: {
            id: '550e8400-e29b-41d4-a716-446655440000',
            email: 'admin@example.com',
            firstName: 'John',
            lastName: 'Doe'
        }
    }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "createdByUser", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User who last updated the patient record',
        type: 'object',
        example: {
            id: '550e8400-e29b-41d4-a716-446655440001',
            email: 'nurse@example.com',
            firstName: 'Jane',
            lastName: 'Smith'
        }
    }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "updatedByUser", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tenant ID' }),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tenant ID',
        example: '550e8400-e29b-41d4-a716-446655440000'
    }),
    __metadata("design:type", String)
], PatientResponseDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tenant information',
        type: tenant_info_dto_1.TenantInfoDto
    }),
    __metadata("design:type", typeof (_g = typeof tenant_info_dto_1.TenantInfoDto !== "undefined" && tenant_info_dto_1.TenantInfoDto) === "function" ? _g : Object)
], PatientResponseDto.prototype, "tenant", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Patient documents',
        type: 'array',
        items: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                documentType: { type: 'string' },
                fileName: { type: 'string' },
                fileType: { type: 'string' },
                fileSize: { type: 'number' },
                fileUrl: { type: 'string' },
                uploadedAt: { type: 'string', format: 'date-time' }
            }
        }
    }),
    __metadata("design:type", Array)
], PatientResponseDto.prototype, "documents", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: 'array',
        items: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                relationship: { type: 'string', nullable: true },
                phone: { type: 'string' },
                email: { type: 'string', nullable: true },
                address: { type: 'string', nullable: true },
                isPrimary: { type: 'boolean' },
                notes: { type: 'string', nullable: true },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
            }
        },
        description: 'Emergency contacts'
    }),
    __metadata("design:type", Array)
], PatientResponseDto.prototype, "emergencyContacts", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], description: 'Special needs' }),
    __metadata("design:type", Array)
], PatientResponseDto.prototype, "specialNeeds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Verification status', default: false }),
    __metadata("design:type", Boolean)
], PatientResponseDto.prototype, "isVerified", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Verification method used', nullable: true }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "verificationMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Last verification date', nullable: true }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "lastVerifiedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Object, description: 'Patient preferences', nullable: true }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "preferences", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Object, description: 'Communication preferences', nullable: true }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "communicationPreferences", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Object, description: 'Privacy preferences', nullable: true }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "privacyPreferences", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID of the user who created this record', nullable: true }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "createdById", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID of the user who last updated this record', nullable: true }),
    __metadata("design:type", Object)
], PatientResponseDto.prototype, "updatedById", void 0);
//# sourceMappingURL=patient-response.dto.js.map