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
exports.SampleResponseDto = exports.CreateSampleDto = exports.SampleDto = exports.LabOrderResponseDto = exports.UpdateLabOrderDto = exports.CreateLabOrderDto = exports.SampleStatus = exports.OrderStatus = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const lab_test_dto_1 = require("./lab-test.dto");
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "PENDING";
    OrderStatus["ORDERED"] = "ORDERED";
    OrderStatus["COLLECTED"] = "COLLECTED";
    OrderStatus["ACCESSIONED"] = "ACCESSIONED";
    OrderStatus["IN_PROGRESS"] = "IN_PROGRESS";
    OrderStatus["COMPLETED"] = "COMPLETED";
    OrderStatus["VALIDATED"] = "VALIDATED";
    OrderStatus["PUBLISHED"] = "PUBLISHED";
    OrderStatus["CANCELLED"] = "CANCELLED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var SampleStatus;
(function (SampleStatus) {
    SampleStatus["PENDING"] = "PENDING";
    SampleStatus["COLLECTED"] = "COLLECTED";
    SampleStatus["RECEIVED"] = "RECEIVED";
    SampleStatus["PROCESSED"] = "PROCESSED";
    SampleStatus["STORED"] = "STORED";
    SampleStatus["DISPOSED"] = "DISPOSED";
})(SampleStatus || (exports.SampleStatus = SampleStatus = {}));
class CreateLabOrderDto {
    visitId;
    patientId;
    panelId;
    testIds;
    priority;
    orderingPhysician;
    clinicalNotes;
    requiredDateTime;
    isStat;
    diagnosis;
}
exports.CreateLabOrderDto = CreateLabOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLabOrderDto.prototype, "visitId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLabOrderDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLabOrderDto.prototype, "panelId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateLabOrderDto.prototype, "testIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: lab_test_dto_1.TestPriority }),
    (0, class_validator_1.IsEnum)(lab_test_dto_1.TestPriority),
    __metadata("design:type", String)
], CreateLabOrderDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLabOrderDto.prototype, "orderingPhysician", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLabOrderDto.prototype, "clinicalNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateLabOrderDto.prototype, "requiredDateTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateLabOrderDto.prototype, "isStat", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLabOrderDto.prototype, "diagnosis", void 0);
class UpdateLabOrderDto {
    priority;
    orderingPhysician;
    clinicalNotes;
    requiredDateTime;
    isStat;
    diagnosis;
}
exports.UpdateLabOrderDto = UpdateLabOrderDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: lab_test_dto_1.TestPriority }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(lab_test_dto_1.TestPriority),
    __metadata("design:type", String)
], UpdateLabOrderDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateLabOrderDto.prototype, "orderingPhysician", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateLabOrderDto.prototype, "clinicalNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], UpdateLabOrderDto.prototype, "requiredDateTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateLabOrderDto.prototype, "isStat", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateLabOrderDto.prototype, "diagnosis", void 0);
class LabOrderResponseDto {
    id;
    visitId;
    patientId;
    panelId;
    testIds;
    testNames;
    panelName;
    priority;
    status;
    orderingPhysician;
    clinicalNotes;
    requiredDateTime;
    isStat;
    diagnosis;
    barcode;
    createdAt;
    updatedAt;
    samples;
    results;
}
exports.LabOrderResponseDto = LabOrderResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LabOrderResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LabOrderResponseDto.prototype, "visitId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LabOrderResponseDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], LabOrderResponseDto.prototype, "panelId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], LabOrderResponseDto.prototype, "testIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Array)
], LabOrderResponseDto.prototype, "testNames", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], LabOrderResponseDto.prototype, "panelName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: lab_test_dto_1.TestPriority }),
    __metadata("design:type", String)
], LabOrderResponseDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: OrderStatus }),
    __metadata("design:type", String)
], LabOrderResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], LabOrderResponseDto.prototype, "orderingPhysician", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], LabOrderResponseDto.prototype, "clinicalNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], LabOrderResponseDto.prototype, "requiredDateTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], LabOrderResponseDto.prototype, "isStat", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], LabOrderResponseDto.prototype, "diagnosis", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], LabOrderResponseDto.prototype, "barcode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], LabOrderResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], LabOrderResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Array)
], LabOrderResponseDto.prototype, "samples", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Array)
], LabOrderResponseDto.prototype, "results", void 0);
class SampleDto {
    sampleType;
    containerType;
    volume;
    collectionNotes;
    collectedAt;
    stabilityExpiresAt;
}
exports.SampleDto = SampleDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SampleDto.prototype, "sampleType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SampleDto.prototype, "containerType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    IsNumber(),
    __metadata("design:type", Number)
], SampleDto.prototype, "volume", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SampleDto.prototype, "collectionNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], SampleDto.prototype, "collectedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], SampleDto.prototype, "stabilityExpiresAt", void 0);
class CreateSampleDto {
    orderId;
    sampleType;
    containerType;
    volume;
    collectionNotes;
    collectedAt;
    stabilityExpiresAt;
}
exports.CreateSampleDto = CreateSampleDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSampleDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSampleDto.prototype, "sampleType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSampleDto.prototype, "containerType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    IsNumber(),
    __metadata("design:type", Number)
], CreateSampleDto.prototype, "volume", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSampleDto.prototype, "collectionNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateSampleDto.prototype, "collectedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateSampleDto.prototype, "stabilityExpiresAt", void 0);
class SampleResponseDto {
    id;
    orderId;
    sampleType;
    containerType;
    volume;
    collectionNotes;
    collectedAt;
    stabilityExpiresAt;
    status;
    barcode;
    createdAt;
    updatedAt;
}
exports.SampleResponseDto = SampleResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SampleResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SampleResponseDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SampleResponseDto.prototype, "sampleType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SampleResponseDto.prototype, "containerType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], SampleResponseDto.prototype, "volume", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SampleResponseDto.prototype, "collectionNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], SampleResponseDto.prototype, "collectedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], SampleResponseDto.prototype, "stabilityExpiresAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: SampleStatus }),
    __metadata("design:type", String)
], SampleResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SampleResponseDto.prototype, "barcode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], SampleResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], SampleResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=lab-order.dto.js.map