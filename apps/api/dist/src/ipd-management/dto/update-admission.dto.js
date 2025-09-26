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
exports.UpdateAdmissionDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const create_admission_dto_1 = require("./create-admission.dto");
const enums_1 = require("../enums");
class UpdateAdmissionDto extends (0, swagger_1.PartialType)(create_admission_dto_1.CreateAdmissionDto) {
    status;
    dischargeDate;
    dischargeNotes;
    dischargedById;
    updatedDiagnosis;
    icdCodes;
    isTransferred;
    transferDetails;
    insuranceAuthorization;
    followUpDetails;
    actualStayDays;
    patientInstructions;
    updatedConsentForms;
    customFields;
}
exports.UpdateAdmissionDto = UpdateAdmissionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: enums_1.AdmissionStatus,
        description: 'Updated status of the admission',
        required: false,
        example: enums_1.AdmissionStatus.DISCHARGED
    }),
    (0, class_validator_1.IsEnum)(enums_1.AdmissionStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateAdmissionDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date and time of discharge',
        required: false,
        example: '2023-06-20T14:30:00Z'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateAdmissionDto.prototype, "dischargeDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Discharge summary or notes',
        required: false,
        example: 'Patient discharged in stable condition with follow-up scheduled in 2 weeks.'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateAdmissionDto.prototype, "dischargeNotes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of the staff who discharged the patient',
        required: false,
        example: '123e4567-e89b-12d3-a456-426614174001'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateAdmissionDto.prototype, "dischargedById", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated diagnosis or additional diagnoses',
        required: false,
        example: 'Community-acquired pneumonia, resolved. Secondary diagnosis: Type 2 Diabetes, controlled.'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateAdmissionDto.prototype, "updatedDiagnosis", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated ICD codes',
        required: false,
        example: ['J18.9', 'E11.9']
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateAdmissionDto.prototype, "icdCodes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the patient has been transferred to another facility',
        required: false,
        default: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateAdmissionDto.prototype, "isTransferred", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Transfer details if patient was transferred',
        required: false,
        example: {
            facilityName: 'City General Hospital',
            facilityType: 'Tertiary Care Center',
            reason: 'Higher level of care required',
            transferredAt: '2023-06-18T15:45:00Z',
            transferredById: '123e4567-e89b-12d3-a456-426614174002',
            notes: 'Patient stable for transfer, all records and medications sent with patient.'
        }
    }),
    (0, class_validator_1.IsJSON)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateAdmissionDto.prototype, "transferDetails", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated insurance authorization information',
        required: false,
        example: {
            preAuthorizationNumber: 'AUTH987654',
            approvedDays: 5,
            notes: 'Approved for 5 days, may require extension'
        }
    }),
    (0, class_validator_1.IsJSON)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateAdmissionDto.prototype, "insuranceAuthorization", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Follow-up appointment details',
        required: false,
        example: {
            scheduledDate: '2023-07-05T10:00:00Z',
            doctorId: '123e4567-e89b-12d3-a456-426614174003',
            department: 'Cardiology',
            notes: 'Follow-up for post-pneumonia evaluation',
            isScheduled: true
        }
    }),
    (0, class_validator_1.IsJSON)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateAdmissionDto.prototype, "followUpDetails", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated length of stay in days',
        required: false,
        example: 6
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateAdmissionDto.prototype, "actualStayDays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional notes or instructions for the patient',
        required: false,
        example: 'Patient instructed to complete full course of antibiotics and return if symptoms worsen.'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateAdmissionDto.prototype, "patientInstructions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated consent forms',
        required: false,
        type: [Object],
        example: [
            {
                formId: 'consent_surgery',
                formName: 'Surgical Consent Form',
                signed: true,
                signedAt: '2023-06-16T11:30:00Z',
                signedById: '123e4567-e89b-12d3-a456-426614174004',
                notes: 'Consent obtained after detailed explanation of risks and benefits.'
            }
        ]
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.Type)(() => Object),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateAdmissionDto.prototype, "updatedConsentForms", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Custom fields for additional admission information',
        required: false,
        example: {
            caseManager: 'Nurse Johnson',
            socialWorker: 'Sarah Williams',
            specialRequirements: 'Requires interpreter for medical discussions',
            patientPreferences: 'Prefers female healthcare providers when possible'
        }
    }),
    (0, class_validator_1.IsJSON)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateAdmissionDto.prototype, "customFields", void 0);
//# sourceMappingURL=update-admission.dto.js.map