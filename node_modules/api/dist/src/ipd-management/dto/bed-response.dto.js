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
exports.BedResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const bed_status_enum_1 = require("../enums/bed-status.enum");
const bed_class_enum_1 = require("../enums/bed-class.enum");
class BedResponseDto {
    id;
    bedNumber;
    name;
    status;
    bedClass;
    features;
    dailyRate;
    isOccupied;
    wardId;
    wardName;
    notes;
    lastCleanedAt;
    maintenanceScheduledAt;
    customFields;
    createdAt;
    updatedAt;
    constructor(bed) {
        this.id = bed.id;
        this.bedNumber = bed.bedNumber;
        this.name = bed.name;
        this.status = bed.status;
        this.bedClass = bed.bedClass;
        this.features = bed.features;
        this.dailyRate = bed.dailyRate;
        this.isOccupied = bed.isOccupied;
        this.wardId = bed.wardId;
        this.wardName = bed.ward?.name || '';
        this.notes = bed.notes;
        this.lastCleanedAt = bed.lastCleanedAt;
        this.maintenanceScheduledAt = bed.maintenanceScheduledAt;
        this.customFields = bed.customFields;
        this.createdAt = bed.createdAt;
        this.updatedAt = bed.updatedAt;
    }
    static fromBeds(beds) {
        return beds.map(bed => new BedResponseDto(bed));
    }
}
exports.BedResponseDto = BedResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier for the bed', example: '123e4567-e89b-12d3-a456-426614174000' }),
    __metadata("design:type", String)
], BedResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Bed number/identifier', example: 'B-101' }),
    __metadata("design:type", String)
], BedResponseDto.prototype, "bedNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Name of the bed', example: 'Bed 1' }),
    __metadata("design:type", String)
], BedResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current status of the bed',
        enum: bed_status_enum_1.BedStatus,
        example: bed_status_enum_1.BedStatus.AVAILABLE
    }),
    __metadata("design:type", String)
], BedResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Class/type of the bed',
        enum: bed_class_enum_1.BedClass,
        example: bed_class_enum_1.BedClass.GENERAL
    }),
    __metadata("design:type", String)
], BedResponseDto.prototype, "bedClass", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Features and equipment available with the bed',
        required: false,
        example: ['Oxygen', 'Suction', 'Monitor']
    }),
    __metadata("design:type", Array)
], BedResponseDto.prototype, "features", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Daily tariff for the bed',
        required: false,
        example: 150.50
    }),
    __metadata("design:type", Number)
], BedResponseDto.prototype, "dailyRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the bed is currently occupied',
        default: false
    }),
    __metadata("design:type", Boolean)
], BedResponseDto.prototype, "isOccupied", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of the ward this bed belongs to',
        example: '123e4567-e89b-12d3-a456-426614174001'
    }),
    __metadata("design:type", String)
], BedResponseDto.prototype, "wardId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of the ward this bed belongs to',
        example: 'General Ward A'
    }),
    __metadata("design:type", String)
], BedResponseDto.prototype, "wardName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional notes about the bed',
        required: false,
        example: 'Near nursing station, has window view'
    }),
    __metadata("design:type", String)
], BedResponseDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date when the bed was last cleaned',
        required: false,
        example: '2023-06-15T08:30:00Z'
    }),
    __metadata("design:type", Date)
], BedResponseDto.prototype, "lastCleanedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date when the bed is scheduled for maintenance',
        required: false,
        example: '2023-12-01T00:00:00Z'
    }),
    __metadata("design:type", Date)
], BedResponseDto.prototype, "maintenanceScheduledAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Custom fields for additional bed information',
        required: false,
        example: {
            isWheelchairAccessible: true,
            hasTv: false,
            view: 'Garden view'
        }
    }),
    __metadata("design:type", Object)
], BedResponseDto.prototype, "customFields", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date when the record was created', example: '2023-01-15T10:30:00Z' }),
    __metadata("design:type", Date)
], BedResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date when the record was last updated', example: '2023-06-15T10:30:00Z' }),
    __metadata("design:type", Date)
], BedResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=bed-response.dto.js.map