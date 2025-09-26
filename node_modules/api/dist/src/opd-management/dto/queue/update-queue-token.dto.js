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
exports.UpdateQueueTokenDto = exports.TokenStatus = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var TokenStatus;
(function (TokenStatus) {
    TokenStatus["WAITING"] = "WAITING";
    TokenStatus["CALLED"] = "CALLED";
    TokenStatus["IN_PROGRESS"] = "IN_PROGRESS";
    TokenStatus["COMPLETED"] = "COMPLETED";
    TokenStatus["CANCELLED"] = "CANCELLED";
    TokenStatus["NO_SHOW"] = "NO_SHOW";
})(TokenStatus || (exports.TokenStatus = TokenStatus = {}));
class UpdateQueueTokenDto {
    status;
    estimatedWaitTime;
    calledAt;
    servedAt;
    completedAt;
    servedById;
    notes;
    cancellationReason;
}
exports.UpdateQueueTokenDto = UpdateQueueTokenDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: TokenStatus,
        description: 'Status of the token'
    }),
    (0, class_validator_1.IsEnum)(TokenStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateQueueTokenDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Estimated wait time in minutes',
        minimum: 0
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateQueueTokenDto.prototype, "estimatedWaitTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date and time when the token was called',
        type: Date
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateQueueTokenDto.prototype, "calledAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date and time when the token was served',
        type: Date
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateQueueTokenDto.prototype, "servedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date and time when the token was completed',
        type: Date
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateQueueTokenDto.prototype, "completedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Staff ID who called/served the token'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateQueueTokenDto.prototype, "servedById", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional notes about the token'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateQueueTokenDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reason for cancellation if applicable'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateQueueTokenDto.prototype, "cancellationReason", void 0);
//# sourceMappingURL=update-queue-token.dto.js.map