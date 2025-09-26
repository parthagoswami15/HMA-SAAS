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
exports.CreateAdmissionDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../enums");
class CreateAdmissionDto {
    patientId;
    admittingDoctorId;
    bedId;
    admissionType;
    admissionDate;
    diagnosis;
    icdCode;
    notes;
    details;
    estimatedStayDays;
    isEmergency = false;
    insuranceInfo;
    emergencyContacts;
    consentForms;
    initialAssessment;
    customFields;
}
exports.CreateAdmissionDto = CreateAdmissionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of the patient being admitted', example: '123e4567-e89b-12d3-a456-426614174000' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAdmissionDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of the admitting doctor', example: '123e4567-e89b-12d3-a456-426614174001' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAdmissionDto.prototype, "admittingDoctorId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of the bed assigned', example: '123e4567-e89b-12d3-a456-426614174002' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAdmissionDto.prototype, "bedId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: enums_1.AdmissionType, description: 'Type of admission' }),
    (0, class_validator_1.IsEnum)(enums_1.AdmissionType),
    __metadata("design:type", String)
], CreateAdmissionDto.prototype, "admissionType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Admission date and time', example: '2023-06-15T10:30:00Z' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], CreateAdmissionDto.prototype, "admissionDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Primary diagnosis or reason for admission', example: 'Community-acquired pneumonia' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAdmissionDto.prototype, "diagnosis", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ICD code for the diagnosis', required: false, example: 'J18.9' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAdmissionDto.prototype, "icdCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Additional notes about the admission', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAdmissionDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional details about the admission',
        required: false,
        example: {
            symptoms: ['Fever', 'Cough', 'Shortness of breath'],
            severity: 'Moderate',
            comorbidities: ['Hypertension', 'Type 2 Diabetes']
        }
    }),
    (0, class_validator_1.IsJSON)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateAdmissionDto.prototype, "details", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Estimated length of stay in days', required: false, example: 5 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateAdmissionDto.prototype, "estimatedStayDays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether this is an emergency admission', required: false, default: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateAdmissionDto.prototype, "isEmergency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Insurance information',
        required: false,
        example: {
            provider: 'ABC Insurance',
            policyNumber: 'POL12345678',
            groupNumber: 'GRP987654',
            isVerified: true
        }
    }),
    (0, class_validator_1.IsJSON)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateAdmissionDto.prototype, "insuranceInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of next of kin or emergency contacts',
        required: false,
        type: [Object],
        example: [
            {
                name: 'John Doe',
                relationship: 'Spouse',
                phone: '+1234567890',
                isPrimary: true
            }
        ]
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => Object),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateAdmissionDto.prototype, "emergencyContacts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Consent forms signed by the patient',
        required: false,
        example: [
            {
                formId: 'consent_treatment',
                formName: 'Consent for Treatment',
                signed: true,
                signedAt: '2023-06-15T10:15:00Z',
                signedById: '123e4567-e89b-12d3-a456-426614174003'
            }
        ]
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => Object),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateAdmissionDto.prototype, "consentForms", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Initial assessment details',
        required: false,
        example: {
            vitalSigns: {
                bloodPressure: '120/80',
                heartRate: 72,
                temperature: 98.6,
                respiratoryRate: 16,
                oxygenSaturation: 98,
                height: 170,
                weight: 70,
                bmi: 24.2
            },
            allergies: ['Penicillin', 'Sulfa drugs'],
            currentMedications: [
                { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' },
                { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' }
            ]
        }
    }),
    (0, class_validator_1.IsJSON)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateAdmissionDto.prototype, "initialAssessment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Custom fields for additional admission information',
        required: false,
        example: {
            referringDoctor: 'Dr. Smith',
            referralNotes: 'Patient referred for further evaluation and management',
            admissionSource: 'Emergency Department'
        }
    }),
    (0, class_validator_1.IsJSON)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateAdmissionDto.prototype, "customFields", void 0);
//# sourceMappingURL=create-admission.dto.js.map