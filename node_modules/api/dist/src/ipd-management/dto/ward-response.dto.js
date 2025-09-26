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
exports.WardResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class WardResponseDto {
    id;
    name;
    code;
    description;
    floor;
    type;
    totalBeds;
    occupiedBeds;
    availableBeds;
    contactNumber;
    email;
    inChargeName;
    inChargeId;
    isActive;
    bedTypes;
    specialties;
    notes;
    customFields;
    createdAt;
    updatedAt;
    constructor(ward) {
        this.id = ward.id;
        this.name = ward.name;
        this.code = ward.code;
        this.description = ward.description;
        this.floor = ward.floor;
        this.type = ward.type;
        this.contactNumber = ward.contactNumber;
        this.email = ward.email;
        this.inChargeName = ward.inChargeName;
        this.inChargeId = ward.inChargeId;
        this.isActive = ward.isActive;
        this.bedTypes = ward.bedTypes;
        this.specialties = ward.specialties;
        this.notes = ward.notes;
        this.customFields = ward.customFields;
        this.createdAt = ward.createdAt;
        this.updatedAt = ward.updatedAt;
        if (ward.beds) {
            this.totalBeds = ward.beds.length;
            this.occupiedBeds = ward.beds.filter(bed => bed.isOccupied).length;
            this.availableBeds = this.totalBeds - this.occupiedBeds;
        }
        else {
            this.totalBeds = 0;
            this.occupiedBeds = 0;
            this.availableBeds = 0;
        }
    }
    static fromWards(wards) {
        return wards.map(ward => new WardResponseDto(ward));
    }
}
exports.WardResponseDto = WardResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier for the ward', example: '123e4567-e89b-12d3-a456-426614174000' }),
    __metadata("design:type", String)
], WardResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Name of the ward', example: 'General Ward A' }),
    __metadata("design:type", String)
], WardResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Code/identifier for the ward', example: 'GW-A' }),
    __metadata("design:type", String)
], WardResponseDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Description of the ward',
        required: false,
        example: 'General medical ward for adult patients'
    }),
    __metadata("design:type", String)
], WardResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Floor number where the ward is located',
        example: 2
    }),
    __metadata("design:type", Number)
], WardResponseDto.prototype, "floor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of ward',
        example: 'GENERAL',
        enum: ['GENERAL', 'ICU', 'CCU', 'PEDIATRICS', 'MATERNITY', 'SURGICAL', 'ONCOLOGY', 'PSYCHIATRIC', 'ISOLATION', 'OTHER']
    }),
    __metadata("design:type", String)
], WardResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of beds in the ward',
        example: 20
    }),
    __metadata("design:type", Number)
], WardResponseDto.prototype, "totalBeds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of occupied beds',
        example: 15
    }),
    __metadata("design:type", Number)
], WardResponseDto.prototype, "occupiedBeds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of available beds',
        example: 5
    }),
    __metadata("design:type", Number)
], WardResponseDto.prototype, "availableBeds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Contact number for the ward',
        required: false,
        example: '+1234567890'
    }),
    __metadata("design:type", String)
], WardResponseDto.prototype, "contactNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email contact for the ward',
        required: false,
        example: 'ward.a@hospital.com'
    }),
    __metadata("design:type", String)
], WardResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of the ward in charge',
        required: false,
        example: 'Dr. Sarah Johnson'
    }),
    __metadata("design:type", String)
], WardResponseDto.prototype, "inChargeName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of the staff member in charge',
        required: false,
        example: '123e4567-e89b-12d3-a456-426614174001'
    }),
    __metadata("design:type", String)
], WardResponseDto.prototype, "inChargeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the ward is currently active',
        default: true
    }),
    __metadata("design:type", Boolean)
], WardResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of bed types available in this ward',
        required: false,
        example: ['GENERAL', 'PRIVATE', 'DELUXE']
    }),
    __metadata("design:type", Array)
], WardResponseDto.prototype, "bedTypes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Specialties or services available in this ward',
        required: false,
        example: ['Cardiology', 'Pulmonology', 'General Medicine']
    }),
    __metadata("design:type", Array)
], WardResponseDto.prototype, "specialties", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional notes about the ward',
        required: false,
        example: 'Visiting hours: 2 PM - 6 PM. Only 2 visitors per patient allowed.'
    }),
    __metadata("design:type", String)
], WardResponseDto.prototype, "notes", void 0);
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
    __metadata("design:type", Object)
], WardResponseDto.prototype, "customFields", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date when the record was created', example: '2023-01-15T10:30:00Z' }),
    __metadata("design:type", Date)
], WardResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date when the record was last updated', example: '2023-06-15T10:30:00Z' }),
    __metadata("design:type", Date)
], WardResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=ward-response.dto.js.map