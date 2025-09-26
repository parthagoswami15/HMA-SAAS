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
exports.CreateWardDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class CreateWardDto {
    name;
    code;
    description;
    floor;
    type;
    contactNumber;
    email;
    inChargeId;
    isActive = true;
    bedTypes;
    specialties;
    notes;
    customFields;
    initialBeds;
}
exports.CreateWardDto = CreateWardDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Name of the ward', example: 'General Ward A' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateWardDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Code/identifier for the ward', example: 'GW-A' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateWardDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Description of the ward',
        required: false,
        example: 'General medical ward for adult patients'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateWardDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Floor number where the ward is located',
        example: 2
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateWardDto.prototype, "floor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of ward',
        example: 'GENERAL',
        enum: ['GENERAL', 'ICU', 'CCU', 'PEDIATRICS', 'MATERNITY', 'SURGICAL', 'ONCOLOGY', 'PSYCHIATRIC', 'ISOLATION', 'OTHER']
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateWardDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Contact number for the ward',
        required: false,
        example: '+1234567890'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsPhoneNumber)(),
    __metadata("design:type", String)
], CreateWardDto.prototype, "contactNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email contact for the ward',
        required: false,
        example: 'ward.a@hospital.com'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateWardDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of the staff member in charge',
        required: false,
        example: '123e4567-e89b-12d3-a456-426614174001'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateWardDto.prototype, "inChargeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the ward is currently active',
        default: true
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], CreateWardDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of bed types available in this ward',
        required: false,
        example: ['GENERAL', 'PRIVATE', 'DELUXE'],
        type: [String]
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateWardDto.prototype, "bedTypes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Specialties or services available in this ward',
        required: false,
        example: ['Cardiology', 'Pulmonology', 'General Medicine'],
        type: [String]
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateWardDto.prototype, "specialties", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional notes about the ward',
        required: false,
        example: 'Visiting hours: 2 PM - 6 PM. Only 2 visitors per patient allowed.'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateWardDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Custom fields for additional ward information',
        required: false,
        example: {
            hasPrivateBathroom: true,
            hasAC: true,
            visitingHours: {
                weekdays: '2 PM - 6 PM',
                weekends: '11 AM - 7 PM'
            }
        }
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateWardDto.prototype, "customFields", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Initial beds to be added to this ward',
        required: false,
        type: 'array',
        items: {
            type: 'object',
            properties: {
                bedNumber: { type: 'string', example: 'B-101' },
                name: { type: 'string', example: 'Bed 1' },
                bedClass: {
                    type: 'string',
                    enum: ['GENERAL', 'PRIVATE', 'DELUXE', 'ICU', 'ISOLATION', 'HDU', 'PEDIATRIC', 'MATERNITY', 'OTHER'],
                    example: 'GENERAL'
                },
                features: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['Oxygen', 'Suction', 'Monitor']
                },
                dailyRate: { type: 'number', example: 150.50 },
                notes: { type: 'string', example: 'Near nursing station' }
            }
        }
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => Object),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateWardDto.prototype, "initialBeds", void 0);
//# sourceMappingURL=create-ward.dto.js.map