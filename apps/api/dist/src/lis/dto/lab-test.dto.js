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
exports.LabTestResponseDto = exports.UpdateLabTestDto = exports.CreateLabTestDto = exports.ReferenceRangeDto = exports.TestStatus = exports.ContainerType = exports.SampleType = exports.TestPriority = exports.TestCategory = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var TestCategory;
(function (TestCategory) {
    TestCategory["HEMATOLOGY"] = "HEMATOLOGY";
    TestCategory["CHEMISTRY"] = "CHEMISTRY";
    TestCategory["MICROBIOLOGY"] = "MICROBIOLOGY";
    TestCategory["IMMUNOLOGY"] = "IMMUNOLOGY";
    TestCategory["SEROLOGY"] = "SEROLOGY";
    TestCategory["TOXICOLOGY"] = "TOXICOLOGY";
    TestCategory["URINALYSIS"] = "URINALYSIS";
    TestCategory["COAGULATION"] = "COAGULATION";
    TestCategory["ENDOCRINOLOGY"] = "ENDOCRINOLOGY";
    TestCategory["GENETICS"] = "GENETICS";
})(TestCategory || (exports.TestCategory = TestCategory = {}));
var TestPriority;
(function (TestPriority) {
    TestPriority["STAT"] = "STAT";
    TestPriority["URGENT"] = "URGENT";
    TestPriority["ROUTINE"] = "ROUTINE";
})(TestPriority || (exports.TestPriority = TestPriority = {}));
var SampleType;
(function (SampleType) {
    SampleType["BLOOD"] = "BLOOD";
    SampleType["URINE"] = "URINE";
    SampleType["SPUTUM"] = "SPUTUM";
    SampleType["STOOL"] = "STOOL";
    SampleType["CSF"] = "CSF";
    SampleType["TISSUE"] = "TISSUE";
    SampleType["SWAB"] = "SWAB";
    SampleType["FLUID"] = "FLUID";
})(SampleType || (exports.SampleType = SampleType = {}));
var ContainerType;
(function (ContainerType) {
    ContainerType["RED_TOP"] = "RED_TOP";
    ContainerType["PURPLE_TOP"] = "PURPLE_TOP";
    ContainerType["BLUE_TOP"] = "BLUE_TOP";
    ContainerType["GREEN_TOP"] = "GREEN_TOP";
    ContainerType["GREY_TOP"] = "GREY_TOP";
    ContainerType["YELLOW_TOP"] = "YELLOW_TOP";
    ContainerType["VACUTAINER"] = "VACUTAINER";
    ContainerType["TUBE"] = "TUBE";
    ContainerType["BOTTLE"] = "BOTTLE";
})(ContainerType || (exports.ContainerType = ContainerType = {}));
var TestStatus;
(function (TestStatus) {
    TestStatus["ACTIVE"] = "ACTIVE";
    TestStatus["INACTIVE"] = "INACTIVE";
    TestStatus["DEPRECATED"] = "DEPRECATED";
})(TestStatus || (exports.TestStatus = TestStatus = {}));
class ReferenceRangeDto {
    ageGroup;
    gender;
    low;
    high;
    unit;
    condition;
}
exports.ReferenceRangeDto = ReferenceRangeDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReferenceRangeDto.prototype, "ageGroup", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReferenceRangeDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ReferenceRangeDto.prototype, "low", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ReferenceRangeDto.prototype, "high", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReferenceRangeDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReferenceRangeDto.prototype, "condition", void 0);
class CreateLabTestDto {
    name;
    code;
    description;
    category;
    department;
    section;
    price;
    tatHours;
    isActive;
    requiresValidation;
    method;
    unit;
    sampleTypes;
    containerTypes;
    referenceRanges;
    analyzerSettings;
    qcSettings;
}
exports.CreateLabTestDto = CreateLabTestDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLabTestDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLabTestDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLabTestDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: TestCategory }),
    (0, class_validator_1.IsEnum)(TestCategory),
    __metadata("design:type", String)
], CreateLabTestDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLabTestDto.prototype, "department", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLabTestDto.prototype, "section", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateLabTestDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateLabTestDto.prototype, "tatHours", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateLabTestDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateLabTestDto.prototype, "requiresValidation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLabTestDto.prototype, "method", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLabTestDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateLabTestDto.prototype, "sampleTypes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateLabTestDto.prototype, "containerTypes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateLabTestDto.prototype, "referenceRanges", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateLabTestDto.prototype, "analyzerSettings", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateLabTestDto.prototype, "qcSettings", void 0);
class UpdateLabTestDto extends CreateLabTestDto {
    status;
}
exports.UpdateLabTestDto = UpdateLabTestDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: TestStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(TestStatus),
    __metadata("design:type", String)
], UpdateLabTestDto.prototype, "status", void 0);
class LabTestResponseDto {
    id;
    name;
    code;
    description;
    category;
    department;
    section;
    price;
    tatHours;
    isActive;
    requiresValidation;
    method;
    unit;
    sampleTypes;
    containerTypes;
    referenceRanges;
    analyzerSettings;
    qcSettings;
    createdAt;
    updatedAt;
}
exports.LabTestResponseDto = LabTestResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LabTestResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LabTestResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LabTestResponseDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LabTestResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: TestCategory }),
    __metadata("design:type", String)
], LabTestResponseDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], LabTestResponseDto.prototype, "department", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], LabTestResponseDto.prototype, "section", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], LabTestResponseDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], LabTestResponseDto.prototype, "tatHours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], LabTestResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Boolean)
], LabTestResponseDto.prototype, "requiresValidation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], LabTestResponseDto.prototype, "method", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], LabTestResponseDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Array)
], LabTestResponseDto.prototype, "sampleTypes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Array)
], LabTestResponseDto.prototype, "containerTypes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Array)
], LabTestResponseDto.prototype, "referenceRanges", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], LabTestResponseDto.prototype, "analyzerSettings", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], LabTestResponseDto.prototype, "qcSettings", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], LabTestResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], LabTestResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=lab-test.dto.js.map