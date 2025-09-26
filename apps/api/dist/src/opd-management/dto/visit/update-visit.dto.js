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
exports.UpdateVisitDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_visit_dto_1 = require("./create-visit.dto");
const swagger_2 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const visit_enum_1 = require("../../enums/visit.enum");
class UpdateVisitDto extends (0, swagger_1.PartialType)(create_visit_dto_1.CreateVisitDto) {
    status;
    startedAt;
    completedAt;
    completedById;
    followUpNotes;
    followUpDate;
}
exports.UpdateVisitDto = UpdateVisitDto;
__decorate([
    (0, swagger_2.ApiProperty)({
        description: 'Status of the visit',
        enum: visit_enum_1.VisitStatus,
        required: false
    }),
    (0, class_validator_1.IsEnum)(visit_enum_1.VisitStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateVisitDto.prototype, "status", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({
        description: 'Date and time when the visit started',
        required: false
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateVisitDto.prototype, "startedAt", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({
        description: 'Date and time when the visit was completed',
        required: false
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateVisitDto.prototype, "completedAt", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({
        description: 'ID of the staff who completed the visit',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateVisitDto.prototype, "completedById", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({
        description: 'Additional notes or follow-up instructions',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateVisitDto.prototype, "followUpNotes", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({
        description: 'Follow-up date and time',
        required: false
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateVisitDto.prototype, "followUpDate", void 0);
//# sourceMappingURL=update-visit.dto.js.map