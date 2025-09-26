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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientRegistrationController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const current_user_decorator_1 = require("../../auth/current-user.decorator");
const patient_registration_dto_1 = require("../dto/patient-registration.dto");
const patients_service_1 = require("../patients.service");
const patient_response_dto_1 = require("../dto/patient-response.dto");
const file_upload_dto_1 = require("../../common/dto/file-upload.dto");
let PatientRegistrationController = class PatientRegistrationController {
    patientsService;
    constructor(patientsService) {
        this.patientsService = patientsService;
    }
    async registerWalkInPatient(user, data) {
        return this.patientsService.registerPatient(user.tenantId, { ...data, registrationType: 'WALK_IN' }, user.id);
    }
    async registerOnlinePatient(tenantSlug, data) {
        const tenant = await this.patientsService.getTenantBySlug(tenantSlug);
        if (!tenant) {
            throw new NotFoundException('Hospital/Clinic not found');
        }
        return this.patientsService.registerPatient(tenant.id, {
            ...data,
            registrationType: 'ONLINE',
            autoVerify: false
        });
    }
    async registerReferredPatient(user, data) {
        return this.patientsService.registerPatient(user.tenantId, {
            ...data,
            registrationType: 'REFERRAL',
            autoVerify: true
        }, user.id);
    }
    async uploadDocument(user, patientId, file, documentType) {
        return this.patientsService.uploadPatientDocument({
            patientId,
            file,
            documentType,
            uploadedBy: user.id,
            tenantId: user.tenantId
        });
    }
    async checkPatientExists(email, phone, aadhaar) {
        const result = await this.patientsService.checkPatientExists({
            email,
            phone,
            aadhaarNumber: aadhaar
        });
        return {
            exists: !!result,
            patient: result ? new patient_response_dto_1.PatientResponseDto(result) : null
        };
    }
};
exports.PatientRegistrationController = PatientRegistrationController;
__decorate([
    (0, common_1.Post)('walk-in'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new walk-in patient' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CREATED, type: patient_response_dto_1.PatientResponseDto }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CONFLICT, description: 'Patient with this email/phone already exists' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, patient_registration_dto_1.PatientRegistrationDto]),
    __metadata("design:returntype", Promise)
], PatientRegistrationController.prototype, "registerWalkInPatient", null);
__decorate([
    (0, common_1.Post)('online'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new patient via online portal' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CREATED, type: patient_response_dto_1.PatientResponseDto }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CONFLICT, description: 'Patient with this email/phone already exists' }),
    __param(0, (0, common_1.Query)('tenant')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, patient_registration_dto_1.PatientRegistrationDto]),
    __metadata("design:returntype", Promise)
], PatientRegistrationController.prototype, "registerOnlinePatient", null);
__decorate([
    (0, common_1.Post)('referral'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Register a patient via referral' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CREATED, type: patient_response_dto_1.PatientResponseDto }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CONFLICT, description: 'Patient with this email/phone already exists' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, patient_registration_dto_1.PatientRegistrationDto]),
    __metadata("design:returntype", Promise)
], PatientRegistrationController.prototype, "registerReferredPatient", null);
__decorate([
    (0, common_1.Post)('upload-document/:patientId'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        description: 'Patient document upload',
        type: file_upload_dto_1.FileUploadDto,
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Upload a document for a patient' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CREATED, description: 'Document uploaded successfully' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('patientId')),
    __param(2, (0, common_1.UploadedFile)(new common_1.ParseFilePipe({
        validators: [
            new common_1.MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
            new common_1.FileTypeValidator({ fileType: /(jpg|jpeg|png|pdf)$/ }),
        ],
    }))),
    __param(3, (0, common_1.Query)('documentType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, typeof (_b = typeof Express !== "undefined" && (_a = Express.Multer) !== void 0 && _a.File) === "function" ? _b : Object, String]),
    __metadata("design:returntype", Promise)
], PatientRegistrationController.prototype, "uploadDocument", null);
__decorate([
    (0, common_1.Get)('check-availability'),
    (0, swagger_1.ApiOperation)({ summary: 'Check if patient with given details already exists' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        schema: {
            type: 'object',
            properties: {
                exists: { type: 'boolean' },
                patient: { $ref: '#/components/schemas/PatientResponseDto' }
            }
        }
    }),
    __param(0, (0, common_1.Query)('email')),
    __param(1, (0, common_1.Query)('phone')),
    __param(2, (0, common_1.Query)('aadhaar')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], PatientRegistrationController.prototype, "checkPatientExists", null);
exports.PatientRegistrationController = PatientRegistrationController = __decorate([
    (0, swagger_1.ApiTags)('Patient Registration'),
    (0, common_1.Controller)('patient-registration'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    __metadata("design:paramtypes", [patients_service_1.PatientsService])
], PatientRegistrationController);
//# sourceMappingURL=patient-registration.controller.js.map