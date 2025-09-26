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
exports.QueueStats = exports.QueueToken = exports.TokenStatus = void 0;
const swagger_1 = require("@nestjs/swagger");
const visit_enum_1 = require("../enums/visit.enum");
var TokenStatus;
(function (TokenStatus) {
    TokenStatus["WAITING"] = "WAITING";
    TokenStatus["CALLED"] = "CALLED";
    TokenStatus["IN_PROGRESS"] = "IN_PROGRESS";
    TokenStatus["COMPLETED"] = "COMPLETED";
    TokenStatus["CANCELLED"] = "CANCELLED";
    TokenStatus["NO_SHOW"] = "NO_SHOW";
})(TokenStatus || (exports.TokenStatus = TokenStatus = {}));
class QueueToken {
    id;
    visitId;
    facilityId;
    departmentId;
    tokenNumber;
    displayNumber;
    priority;
    status;
    estimatedWaitTime;
    issuedAt;
    calledAt;
    servedAt;
    completedAt;
    servedById;
    notes;
    createdAt;
    updatedAt;
}
exports.QueueToken = QueueToken;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier for the queue token' }),
    __metadata("design:type", String)
], QueueToken.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Visit ID this token is associated with' }),
    __metadata("design:type", String)
], QueueToken.prototype, "visitId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Facility ID where the token is issued' }),
    __metadata("design:type", String)
], QueueToken.prototype, "facilityId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Department/Service point ID' }),
    __metadata("design:type", String)
], QueueToken.prototype, "departmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Token number (display number)' }),
    __metadata("design:type", String)
], QueueToken.prototype, "tokenNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Display name for the token (e.g., A001, B012)' }),
    __metadata("design:type", String)
], QueueToken.prototype, "displayNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: visit_enum_1.QueuePriority, default: visit_enum_1.QueuePriority.NORMAL }),
    __metadata("design:type", String)
], QueueToken.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: TokenStatus, default: TokenStatus.WAITING }),
    __metadata("design:type", String)
], QueueToken.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Estimated wait time in minutes', required: false }),
    __metadata("design:type", Number)
], QueueToken.prototype, "estimatedWaitTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date and time when the token was issued', type: Date }),
    __metadata("design:type", Date)
], QueueToken.prototype, "issuedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date and time when the token was called', type: Date, required: false }),
    __metadata("design:type", Date)
], QueueToken.prototype, "calledAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date and time when the token was served', type: Date, required: false }),
    __metadata("design:type", Date)
], QueueToken.prototype, "servedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date and time when the token was completed', type: Date, required: false }),
    __metadata("design:type", Date)
], QueueToken.prototype, "completedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff ID who called/served the token', required: false }),
    __metadata("design:type", String)
], QueueToken.prototype, "servedById", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Additional notes about the token', required: false }),
    __metadata("design:type", String)
], QueueToken.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date and time when the record was created', type: Date }),
    __metadata("design:type", Date)
], QueueToken.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date and time when the record was last updated', type: Date }),
    __metadata("design:type", Date)
], QueueToken.prototype, "updatedAt", void 0);
class QueueStats {
    total;
    waiting;
    inProgress;
    averageWaitTime;
    estimatedWaitTime;
}
exports.QueueStats = QueueStats;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of tokens in the queue' }),
    __metadata("design:type", Number)
], QueueStats.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of waiting tokens' }),
    __metadata("design:type", Number)
], QueueStats.prototype, "waiting", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of in-progress tokens' }),
    __metadata("design:type", Number)
], QueueStats.prototype, "inProgress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Average wait time in minutes' }),
    __metadata("design:type", Number)
], QueueStats.prototype, "averageWaitTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Estimated wait time for new tokens in minutes' }),
    __metadata("design:type", Number)
], QueueStats.prototype, "estimatedWaitTime", void 0);
//# sourceMappingURL=queue-token.entity.js.map