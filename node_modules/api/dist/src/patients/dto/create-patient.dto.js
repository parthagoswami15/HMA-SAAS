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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePatientDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class EmergencyContactDto {
    name;
    relationship;
    phone;
    email;
    address;
    isPrimary;
    notes;
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Full name of emergency contact' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EmergencyContactDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Relationship to patient' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EmergencyContactDto.prototype, "relationship", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Phone number of emergency contact' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EmergencyContactDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Email of emergency contact' }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EmergencyContactDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Address of emergency contact' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EmergencyContactDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether this is the primary emergency contact', default: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], EmergencyContactDto.prototype, "isPrimary", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional notes' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EmergencyContactDto.prototype, "notes", void 0);
class CreatePatientDto {
    title;
    firstName;
    middleName;
    lastName;
    photoUrl;
    dob;
    gender;
    bloodType;
    maritalStatus;
    occupation;
    phone;
    alternatePhone;
    email;
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
    emergencyContacts;
    bloodGroup;
    rhFactor;
    allergies;
    chronicConditions;
    currentMedications;
    knownAllergies;
    insuranceProvider;
    insuranceId;
    insuranceGroup;
    insuranceValidUntil;
    religion;
    nationality;
    language;
    isVIP;
    isDeceased;
    dateOfDeath;
    causeOfDeath;
    externalId;
    notes;
    hasGivenConsent;
    consentDate;
    marketingPreferences;
    tags;
    customFields;
    source;
    referralInfo;
    preferences;
    status;
    tenantId;
    createdById;
    updatedById;
    isVerified;
    verificationMethod;
    lastVerifiedAt;
    score;
    category;
    internalNotes;
    metadata;
    isActive;
    registeredAt;
    lastVisitAt;
    totalVisits;
    totalSpent;
    loyaltyPoints;
    creditBalance;
    discountPercentage;
    group;
    segment;
    sourceDetails;
    communicationPreferences;
    privacyPreferences;
    medicalAlerts;
    specialNeeds;
    preferredPharmacy;
    preferredLab;
    emergencyContactName;
    emergencyContactPhone;
}
exports.CreatePatientDto = CreatePatientDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Patient title (Mr, Mrs, Dr, etc.)',
        example: 'Mr',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Patient first name',
        minLength: 1,
        maxLength: 100,
        example: 'John'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(100),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Patient middle name',
        maxLength: 100,
        example: 'William'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "middleName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Patient last name',
        minLength: 1,
        maxLength: 100,
        example: 'Doe'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(100),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'URL to patient photo',
        example: 'https://example.com/photos/patient123.jpg'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "photoUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date of birth (ISO 8601 format)',
        example: '1990-01-01'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "dob", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: client_1.Gender,
        enumName: 'Gender',
        example: client_1.Gender.MALE
    }),
    (0, class_validator_1.IsEnum)(client_1.Gender),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_a = typeof client_1.Gender !== "undefined" && client_1.Gender) === "function" ? _a : Object)
], CreatePatientDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: client_1.BloodType,
        enumName: 'BloodType',
        example: client_1.BloodType.A_POSITIVE
    }),
    (0, class_validator_1.IsEnum)(client_1.BloodType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_b = typeof client_1.BloodType !== "undefined" && client_1.BloodType) === "function" ? _b : Object)
], CreatePatientDto.prototype, "bloodType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: client_1.MaritalStatus,
        enumName: 'MaritalStatus',
        example: client_1.MaritalStatus.SINGLE
    }),
    (0, class_validator_1.IsEnum)(client_1.MaritalStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_c = typeof client_1.MaritalStatus !== "undefined" && client_1.MaritalStatus) === "function" ? _c : Object)
], CreatePatientDto.prototype, "maritalStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Patient occupation',
        example: 'Software Engineer'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "occupation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Primary phone number',
        example: '+1234567890'
    }),
    (0, class_validator_1.IsPhoneNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Alternate phone number',
        example: '+1987654321'
    }),
    (0, class_validator_1.IsPhoneNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "alternatePhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Email address',
        example: 'john.doe@example.com'
    }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.MaxLength)(255),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Address line 1',
        example: '123 Main St'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "addressLine1", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Address line 2',
        example: 'Apt 4B'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "addressLine2", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'City',
        example: 'New York'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'State/Province',
        example: 'NY'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Postal/ZIP code',
        example: '10001'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Country',
        example: 'United States'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Aadhaar number (India)',
        example: '1234-5678-9012'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "aadhaarNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'PAN number (India)',
        example: 'ABCDE1234F'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "panNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Passport number',
        example: 'A12345678'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "passportNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Driving license number',
        example: 'DL12345678901234'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(30),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "drivingLicense", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'List of emergency contacts',
        type: [EmergencyContactDto]
    }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => EmergencyContactDto),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreatePatientDto.prototype, "emergencyContacts", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Blood group',
        example: 'A+'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(10),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "bloodGroup", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'RH factor',
        example: '+'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "rhFactor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Structured allergies data',
        example: { drugs: ['Penicillin'], food: ['Peanuts'] }
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreatePatientDto.prototype, "allergies", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Array of chronic conditions',
        example: ['Hypertension', 'Diabetes']
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreatePatientDto.prototype, "chronicConditions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Array of current medications',
        example: ['Metformin 500mg', 'Lisinopril 10mg']
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreatePatientDto.prototype, "currentMedications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Array of known allergies',
        example: ['Penicillin', 'Latex']
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreatePatientDto.prototype, "knownAllergies", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Insurance provider name',
        example: 'United Healthcare'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "insuranceProvider", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Insurance ID/policy number',
        example: 'UHG123456789'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "insuranceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Insurance group number',
        example: 'GRP123456'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "insuranceGroup", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Insurance validity end date',
        example: '2024-12-31'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "insuranceValidUntil", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Religion',
        example: 'Hindu'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "religion", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Nationality',
        example: 'Indian'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "nationality", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Preferred language (ISO 639-1)',
        example: 'en',
        default: 'en'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(10),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "language", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'VIP status',
        default: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreatePatientDto.prototype, "isVIP", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Deceased status',
        default: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreatePatientDto.prototype, "isDeceased", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date of death',
        example: '2023-01-15'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "dateOfDeath", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Cause of death',
        example: 'Cardiac Arrest'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "causeOfDeath", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'External reference ID',
        example: 'EXT123456'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "externalId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Notes about the patient',
        example: 'Patient prefers morning appointments'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether the patient has provided consent for data processing',
        default: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreatePatientDto.prototype, "hasGivenConsent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date when consent was given',
        example: '2023-01-01T00:00:00Z'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "consentDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Marketing preferences',
        example: { email: true, sms: false, phone: true }
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreatePatientDto.prototype, "marketingPreferences", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tags for categorizing patients',
        example: ['diabetic', 'elderly', 'high_risk']
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreatePatientDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Custom fields for additional patient data',
        example: { preferredDoctor: 'Dr. Smith', lastVisitDate: '2023-06-15' }
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreatePatientDto.prototype, "customFields", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Source of patient registration',
        example: 'web',
        enum: ['web', 'mobile', 'walk_in', 'referral', 'other']
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "source", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Referral source details',
        example: { referrerName: 'Dr. Johnson', referrerContact: 'dr.johnson@example.com' }
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreatePatientDto.prototype, "referralInfo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Patient preferences',
        example: { preferredCommunication: 'email', language: 'en', timezone: 'America/New_York' }
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreatePatientDto.prototype, "preferences", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Patient status',
        example: 'active',
        enum: ['active', 'inactive', 'archived', 'deceased']
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tenant ID for multi-tenancy',
        example: '550e8400-e29b-41d4-a716-446655440000'
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID of the user who created this patient record',
        example: '550e8400-e29b-41d4-a716-446655440000'
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "createdById", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID of the user who last updated this patient record',
        example: '550e8400-e29b-41d4-a716-446655440000'
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "updatedById", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether the patient has been verified',
        default: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreatePatientDto.prototype, "isVerified", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Verification method used',
        example: 'email',
        enum: ['email', 'phone', 'document', 'manual']
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "verificationMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date when the patient was last verified',
        example: '2023-06-01T00:00:00Z'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "lastVerifiedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Patient score/risk level',
        example: 75,
        minimum: 0,
        maximum: 100
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreatePatientDto.prototype, "score", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Patient category',
        example: 'premium',
        enum: ['standard', 'premium', 'vip']
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Internal notes about the patient',
        example: 'Handled by Dr. Smith, requires special attention'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "internalNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Metadata for the patient record',
        example: { lastSync: '2023-06-15T10:00:00Z', externalSystemId: 'EXT123456' }
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreatePatientDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Is the patient active?',
        default: true
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreatePatientDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date when the patient was registered',
        example: '2023-01-01T00:00:00Z'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "registeredAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date of last visit',
        example: '2023-06-15T00:00:00Z'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "lastVisitAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Total number of visits',
        example: 5,
        minimum: 0
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreatePatientDto.prototype, "totalVisits", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Total amount spent by patient',
        example: 1250.75,
        minimum: 0
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreatePatientDto.prototype, "totalSpent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Patient loyalty points',
        example: 250,
        minimum: 0
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreatePatientDto.prototype, "loyaltyPoints", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Patient credit balance',
        example: 150.50,
        minimum: 0
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreatePatientDto.prototype, "creditBalance", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Patient discount percentage',
        example: 10,
        minimum: 0,
        maximum: 100
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreatePatientDto.prototype, "discountPercentage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Patient group/category',
        example: 'premium',
        enum: ['standard', 'premium', 'vip', 'corporate']
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "group", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Patient segment for marketing',
        example: 'chronic_condition',
        enum: ['new', 'regular', 'chronic_condition', 'pediatric', 'senior', 'other']
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "segment", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Patient source details',
        example: { campaign: 'summer_checkup', referrer: 'google_ads' }
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreatePatientDto.prototype, "sourceDetails", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Patient communication preferences',
        example: { email: true, sms: true, push: false, call: true }
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreatePatientDto.prototype, "communicationPreferences", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Patient privacy preferences',
        example: { shareData: true, researchParticipation: false, thirdPartySharing: true }
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreatePatientDto.prototype, "privacyPreferences", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Patient medical alerts',
        example: ['Allergic to penicillin', 'Uses hearing aid']
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreatePatientDto.prototype, "medicalAlerts", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Patient special needs',
        example: ['Wheelchair access required', 'Sign language interpreter needed']
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreatePatientDto.prototype, "specialNeeds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Patient preferred pharmacy',
        example: 'CVS Pharmacy, 123 Main St, New York, NY 10001'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "preferredPharmacy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Patient preferred laboratory',
        example: 'Quest Diagnostics, 456 Oak Ave, New York, NY 10002'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "preferredLab", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Emergency contact name'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "emergencyContactName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Emergency contact phone'
    }),
    (0, class_validator_1.IsPhoneNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "emergencyContactPhone", void 0);
//# sourceMappingURL=create-patient.dto.js.map