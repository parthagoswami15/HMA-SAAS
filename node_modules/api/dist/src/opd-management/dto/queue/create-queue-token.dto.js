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
exports.CreateQueueTokenDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const visit_enum_1 = require("../../../enums/visit.enum");
class CreateQueueTokenDto {
    visitId;
    departmentId;
    priority;
    estimatedWaitTime;
    notes;
}
exports.CreateQueueTokenDto = CreateQueueTokenDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Visit ID this token is associated with' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateQueueTokenDto.prototype, "visitId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Department/Service point ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateQueueTokenDto.prototype, "departmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: visit_enum_1.QueuePriority,
        description: 'Priority of the token',
        default: visit_enum_1.QueuePriority.NORMAL
    }),
    (0, class_validator_1.IsEnum)(visit_enum_1.QueuePriority),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_a = typeof visit_enum_1.QueuePriority !== "undefined" && visit_enum_1.QueuePriority) === "function" ? _a : Object)
], CreateQueueTokenDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estimated wait time in minutes',
        required: false
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateQueueTokenDto.prototype, "estimatedWaitTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional notes about the token',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateQueueTokenDto.prototype, "notes", void 0);
//# sourceMappingURL=create-queue-token.dto.js.map