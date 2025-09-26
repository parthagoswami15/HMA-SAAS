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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdmissionResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const patient_response_dto_1 = require("../../patients/dto/patient-response.dto");
const staff_response_dto_1 = require("../../staff/dto/staff-response.dto");
const bed_response_dto_1 = require("./bed-response.dto");
const ward_response_dto_1 = require("./ward-response.dto");
class AdmissionResponseDto {
    id;
    admissionNumber;
    admissionType;
    status;
    admissionDate;
    dischargeDate;
    diagnosis;
    icdCode;
    isEmergency;
    estimatedStayDays;
    actualStayDays;
    notes;
    patient;
    doctor;
    bed;
    ward;
    createdAt;
    updatedAt;
    details;
    insuranceInfo;
    followUpDetails;
    transferDetails;
    customFields;
    constructor(admission) {
        this.id = admission.id;
        this.admissionNumber = admission.admissionNumber;
        this.admissionType = admission.admissionType;
        this.status = admission.status;
        this.admissionDate = admission.admissionDate;
        this.dischargeDate = admission.dischargeDate;
        this.diagnosis = admission.diagnosis;
        this.icdCode = admission.icdCode;
        this.isEmergency = admission.isEmergency;
        this.estimatedStayDays = admission.estimatedStayDays;
        this.actualStayDays = admission.actualStayDays;
        this.notes = admission.notes;
        this.details = admission.details;
        this.insuranceInfo = admission.insuranceInfo;
        this.followUpDetails = admission.followUpDetails;
        this.transferDetails = admission.transferDetails;
        this.customFields = admission.customFields;
        this.createdAt = admission.createdAt;
        this.updatedAt = admission.updatedAt;
        if (this.dischargeDate && this.admissionDate) {
            const diffTime = Math.abs(this.dischargeDate.getTime() - this.admissionDate.getTime());
            this.actualStayDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }
    }
    static fromAdmissions(admissions) {
        return admissions.map(admission => new AdmissionResponseDto(admission));
    }
}
exports.AdmissionResponseDto = AdmissionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier for the admission', example: '123e4567-e89b-12d3-a456-426614174000' }),
    __metadata("design:type", String)
], AdmissionResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Admission number/identifier', example: 'ADM-2023-00123' }),
    __metadata("design:type", String)
], AdmissionResponseDto.prototype, "admissionNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Type of admission', enum: ['ELECTIVE', 'EMERGENCY', 'URGENT', 'ROUTINE', 'OTHER'] }),
    __metadata("design:type", String)
], AdmissionResponseDto.prototype, "admissionType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current status of the admission', enum: ['ADMITTED', 'DISCHARGED', 'TRANSFERRED', 'LAMA', 'DAMA'] }),
    __metadata("design:type", String)
], AdmissionResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date and time of admission', example: '2023-06-15T10:30:00Z' }),
    __metadata("design:type", Date)
], AdmissionResponseDto.prototype, "admissionDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date and time of discharge', required: false, example: '2023-06-20T14:30:00Z' }),
    __metadata("design:type", Date)
], AdmissionResponseDto.prototype, "dischargeDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Primary diagnosis or reason for admission', example: 'Community-acquired pneumonia' }),
    __metadata("design:type", String)
], AdmissionResponseDto.prototype, "diagnosis", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ICD code for the diagnosis', required: false, example: 'J18.9' }),
    __metadata("design:type", String)
], AdmissionResponseDto.prototype, "icdCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether this is an emergency admission', default: false }),
    __metadata("design:type", Boolean)
], AdmissionResponseDto.prototype, "isEmergency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Estimated length of stay in days', required: false, example: 5 }),
    __metadata("design:type", Number)
], AdmissionResponseDto.prototype, "estimatedStayDays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Actual length of stay in days', required: false, example: 6 }),
    __metadata("design:type", Number)
], AdmissionResponseDto.prototype, "actualStayDays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Additional notes about the admission', required: false }),
    __metadata("design:type", String)
], AdmissionResponseDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Patient information', type: patient_response_dto_1.PatientResponseDto }),
    __metadata("design:type", patient_response_dto_1.PatientResponseDto)
], AdmissionResponseDto.prototype, "patient", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Admitting doctor information', type: staff_response_dto_1.StaffResponseDto }),
    __metadata("design:type", typeof (_a = typeof staff_response_dto_1.StaffResponseDto !== "undefined" && staff_response_dto_1.StaffResponseDto) === "function" ? _a : Object)
], AdmissionResponseDto.prototype, "doctor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Assigned bed information', type: bed_response_dto_1.BedResponseDto }),
    __metadata("design:type", bed_response_dto_1.BedResponseDto)
], AdmissionResponseDto.prototype, "bed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Ward information', type: ward_response_dto_1.WardResponseDto }),
    __metadata("design:type", ward_response_dto_1.WardResponseDto)
], AdmissionResponseDto.prototype, "ward", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date when the record was created', example: '2023-06-15T10:30:00Z' }),
    __metadata("design:type", Date)
], AdmissionResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date when the record was last updated', example: '2023-06-15T10:30:00Z' }),
    __metadata("design:type", Date)
], AdmissionResponseDto.prototype, "updatedAt", void 0);
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
    __metadata("design:type", Object)
], AdmissionResponseDto.prototype, "details", void 0);
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
    __metadata("design:type", Object)
], AdmissionResponseDto.prototype, "insuranceInfo", void 0);
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
    __metadata("design:type", Object)
], AdmissionResponseDto.prototype, "followUpDetails", void 0);
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
    __metadata("design:type", Object)
], AdmissionResponseDto.prototype, "transferDetails", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Custom fields for additional admission information',
        required: false,
        example: {
            caseManager: 'Nurse Johnson',
            socialWorker: 'Sarah Williams',
            specialRequirements: 'Requires interpreter for medical discussions'
        }
    }),
    __metadata("design:type", Object)
], AdmissionResponseDto.prototype, "customFields", void 0);
//# sourceMappingURL=admission-response.dto.js.map