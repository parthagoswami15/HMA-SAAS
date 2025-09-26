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
exports.UpdatePatientDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const create_patient_dto_1 = require("./create-patient.dto");
class UpdateEmergencyContactDto {
    name;
    relationship;
    phone;
    email;
    address;
    isPrimary;
    notes;
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Full name of emergency contact' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEmergencyContactDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Relationship to patient' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEmergencyContactDto.prototype, "relationship", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Phone number of emergency contact' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEmergencyContactDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Email of emergency contact' }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEmergencyContactDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Address of emergency contact' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEmergencyContactDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether this is the primary emergency contact' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateEmergencyContactDto.prototype, "isPrimary", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional notes' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEmergencyContactDto.prototype, "notes", void 0);
class UpdatePatientDto extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(create_patient_dto_1.CreatePatientDto, [
    'emergencyContacts'
])) {
    emergencyContacts;
    score;
    totalSpent;
    loyaltyPoints;
    creditBalance;
    discountPercentage;
    totalVisits;
    lastVerifiedAt;
    dateOfDeath;
    registeredAt;
    lastVisitAt;
}
exports.UpdatePatientDto = UpdatePatientDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'List of emergency contacts',
        type: [UpdateEmergencyContactDto]
    }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => UpdateEmergencyContactDto),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdatePatientDto.prototype, "emergencyContacts", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Patient score/risk level',
        example: 75,
        minimum: 0,
        maximum: 100
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdatePatientDto.prototype, "score", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Total amount spent by patient',
        example: 1250.75,
        minimum: 0
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdatePatientDto.prototype, "totalSpent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Patient loyalty points',
        example: 250,
        minimum: 0
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdatePatientDto.prototype, "loyaltyPoints", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Patient credit balance',
        example: 150.50,
        minimum: 0
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdatePatientDto.prototype, "creditBalance", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Patient discount percentage',
        example: 10,
        minimum: 0,
        maximum: 100
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdatePatientDto.prototype, "discountPercentage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Total number of visits',
        example: 5,
        minimum: 0
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdatePatientDto.prototype, "totalVisits", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date when the patient was last verified',
        example: '2023-06-01T00:00:00Z'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdatePatientDto.prototype, "lastVerifiedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date of death',
        example: '2023-01-15'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdatePatientDto.prototype, "dateOfDeath", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date when the patient was registered',
        example: '2023-01-01T00:00:00Z'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdatePatientDto.prototype, "registeredAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date of last visit',
        example: '2023-06-15T00:00:00Z'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdatePatientDto.prototype, "lastVisitAt", void 0);
//# sourceMappingURL=update-patient.dto.js.map