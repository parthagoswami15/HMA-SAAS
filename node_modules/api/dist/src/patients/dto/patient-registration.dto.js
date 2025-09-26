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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientRegistrationDto = exports.EmergencyContactDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const patient_enums_1 = require("../../common/enums/patient.enums");
class EmergencyContactDto {
    id;
    name;
    relationship;
    phone;
    email;
    address;
    isPrimary;
    patientId;
    createdAt;
    updatedAt;
}
exports.EmergencyContactDto = EmergencyContactDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of the emergency contact' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EmergencyContactDto.prototype, "id", void 0);
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
    (0, swagger_1.ApiProperty)({ description: 'Contact phone number' }),
    (0, class_validator_1.IsPhoneNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EmergencyContactDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Contact email address' }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EmergencyContactDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Contact address' }),
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
    (0, swagger_1.ApiPropertyOptional)({ description: 'Patient ID this contact belongs to' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EmergencyContactDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Creation timestamp' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], EmergencyContactDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Last update timestamp' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], EmergencyContactDto.prototype, "updatedAt", void 0);
class PatientRegistrationDto {
    title;
    tenantId;
    registrationNumber;
    firstName;
    middleName;
    lastName;
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
    insuranceType;
    tpaId;
    registrationType = patient_enums_1.RegistrationType.WALK_IN;
    referralSource;
    referralDoctor;
    referralHospital;
    religion;
    nationality;
    language = 'en';
    isVIP = false;
    photoUrl;
    photoName;
    emergencyContacts;
    autoVerify = false;
}
exports.PatientRegistrationDto = PatientRegistrationDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Title (Mr, Mrs, Dr, etc.)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PatientRegistrationDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tenant ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PatientRegistrationDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Registration number' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PatientRegistrationDto.prototype, "registrationNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'First name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PatientRegistrationDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Middle name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PatientRegistrationDto.prototype, "middleName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PatientRegistrationDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Date of birth (YYYY-MM-DD)' }),
    (0, class_validator_1.IsISO8601)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PatientRegistrationDto.prototype, "dob", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: patient_enums_1.Gender, description: 'Gender' }),
    (0, class_validator_1.IsEnum)(patient_enums_1.Gender),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PatientRegistrationDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: patient_enums_1.BloodType, description: 'Blood type' }),
    (0, class_validator_1.IsEnum)(patient_enums_1.BloodType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PatientRegistrationDto.prototype, "bloodType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: patient_enums_1.MaritalStatus, description: 'Marital status' }),
    (0, class_validator_1.IsEnum)(patient_enums_1.MaritalStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PatientRegistrationDto.prototype, "maritalStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Occupation' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PatientRegistrationDto.prototype, "occupation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Primary phone number' }),
    (0, class_validator_1.IsPhoneNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PatientRegistrationDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Alternate phone number' }),
    (0, class_validator_1.IsPhoneNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PatientRegistrationDto.prototype, "alternatePhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Email address' }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PatientRegistrationDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Address line 1' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PatientRegistrationDto.prototype, "addressLine1", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Address line 2' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PatientRegistrationDto.prototype, "addressLine2", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'City' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PatientRegistrationDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'State/Province' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PatientRegistrationDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Postal/ZIP code' }),
    (0, class_validator_1.IsPostalCode)('any'),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PatientRegistrationDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Country' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PatientRegistrationDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Aadhaar number' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PatientRegistrationDto.prototype, "aadhaarNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'PAN number' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PatientRegistrationDto.prototype, "panNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Passport number' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PatientRegistrationDto.prototype, "passportNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Driving license number' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PatientRegistrationDto.prototype, "drivingLicense", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Blood group (e.g., A+, O-)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PatientRegistrationDto.prototype, "bloodGroup", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'RH factor (+ or -)' }),
    (0, class_validator_1.IsIn)(['+', '-']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PatientRegistrationDto.prototype, "rhFactor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Structured allergies data',
        type: 'object',
        additionalProperties: true
    }),
    IsObject(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], PatientRegistrationDto.prototype, "allergies", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Array of chronic conditions',
        type: [String]
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], PatientRegistrationDto.prototype, "chronicConditions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Array of current medications',
        type: [String]
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], PatientRegistrationDto.prototype, "currentMedications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Array of known allergies',
        type: [String]
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], PatientRegistrationDto.prototype, "knownAllergies", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Insurance provider name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PatientRegistrationDto.prototype, "insuranceProvider", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Insurance policy/ID number' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PatientRegistrationDto.prototype, "insuranceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Insurance group number' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PatientRegistrationDto.prototype, "insuranceGroup", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Insurance validity end date (YYYY-MM-DD)',
        example: '2024-12-31'
    }),
    (0, class_validator_1.IsISO8601)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PatientRegistrationDto.prototype, "insuranceValidUntil", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: patient_enums_1.InsuranceType,
        description: 'Type of insurance/payment'
    }),
    (0, class_validator_1.IsEnum)(patient_enums_1.InsuranceType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PatientRegistrationDto.prototype, "insuranceType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Third Party Administrator ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PatientRegistrationDto.prototype, "tpaId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: patient_enums_1.RegistrationType,
        description: 'Type of registration',
        default: patient_enums_1.RegistrationType.WALK_IN
    }),
    (0, class_validator_1.IsEnum)(patient_enums_1.RegistrationType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PatientRegistrationDto.prototype, "registrationType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Source of referral' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PatientRegistrationDto.prototype, "referralSource", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Referring doctor\'s name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PatientRegistrationDto.prototype, "referralDoctor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Referring hospital/clinic name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PatientRegistrationDto.prototype, "referralHospital", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Religion' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PatientRegistrationDto.prototype, "religion", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Nationality' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PatientRegistrationDto.prototype, "nationality", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Preferred language (ISO 639-1 code)',
        default: 'en'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PatientRegistrationDto.prototype, "language", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'VIP status', default: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], PatientRegistrationDto.prototype, "isVIP", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Photo URL or base64 image data' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PatientRegistrationDto.prototype, "photoUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Photo file name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PatientRegistrationDto.prototype, "photoName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [EmergencyContactDto],
        description: 'List of emergency contacts'
    }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => EmergencyContactDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], PatientRegistrationDto.prototype, "emergencyContacts", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether to verify email/phone automatically',
        default: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], PatientRegistrationDto.prototype, "autoVerify", void 0);
//# sourceMappingURL=patient-registration.dto.js.map