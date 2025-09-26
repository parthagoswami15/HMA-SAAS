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
exports.UpdateWardDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_ward_dto_1 = require("./create-ward.dto");
const class_validator_1 = require("class-validator");
const swagger_2 = require("@nestjs/swagger");
class UpdateWardDto extends (0, swagger_1.PartialType)(create_ward_dto_1.CreateWardDto) {
    name;
    code;
    updateBeds = false;
    beds;
    bedsToRemove;
    updateReason;
    updatedById;
}
exports.UpdateWardDto = UpdateWardDto;
__decorate([
    (0, swagger_2.ApiProperty)({
        description: 'Name of the ward',
        required: false,
        example: 'General Ward A - Updated'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateWardDto.prototype, "name", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({
        description: 'Code/identifier for the ward',
        required: false,
        example: 'GW-A-UPDATED'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateWardDto.prototype, "code", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({
        description: 'Whether to update the beds in this ward',
        required: false,
        default: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], UpdateWardDto.prototype, "updateBeds", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({
        description: 'Beds to be added or updated in this ward',
        required: false,
        type: 'array',
        items: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    description: 'Required for updating existing beds',
                    example: '123e4567-e89b-12d3-a456-426614174000'
                },
                bedNumber: { type: 'string', example: 'B-101' },
                name: { type: 'string', example: 'Bed 1' },
                bedClass: {
                    type: 'string',
                    enum: ['GENERAL', 'PRIVATE', 'DELUXE', 'ICU', 'ISOLATION', 'HDU', 'PEDIATRIC', 'MATERNITY', 'OTHER'],
                    example: 'GENERAL'
                },
                status: {
                    type: 'string',
                    enum: ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'CLEANING', 'QUARANTINE'],
                    example: 'AVAILABLE'
                },
                features: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['Oxygen', 'Suction', 'Monitor']
                },
                dailyRate: { type: 'number', example: 150.50 },
                notes: { type: 'string', example: 'Near nursing station' },
                isActive: { type: 'boolean', example: true },
                action: {
                    type: 'string',
                    enum: ['create', 'update', 'delete'],
                    description: 'Action to perform on the bed (create/update/delete)'
                }
            }
        }
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.Type)(() => Object),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateWardDto.prototype, "beds", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({
        description: 'IDs of beds to be removed from this ward',
        required: false,
        type: [String],
        example: ['123e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174002']
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateWardDto.prototype, "bedsToRemove", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({
        description: 'Reason for the update',
        required: false,
        example: 'Ward renovation and bed reallocation'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateWardDto.prototype, "updateReason", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({
        description: 'ID of the staff member performing the update',
        required: false,
        example: '123e4567-e89b-12d3-a456-426614174003'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateWardDto.prototype, "updatedById", void 0);
//# sourceMappingURL=update-ward.dto.js.map