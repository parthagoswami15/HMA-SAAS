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
exports.OPDController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const opd_service_1 = require("./opd.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_role_enum_1 = require("../users/enums/user-role.enum");
let OPDController = class OPDController {
    opdService;
    constructor(opdService) {
        this.opdService = opdService;
    }
    async createVisit(createVisitDto) {
        return this.opdService.createVisit(createVisitDto);
    }
    async getVisitById(id) {
        return this.opdService.getVisitById(id);
    }
    async updateVisit(id, updateVisitDto) {
        return this.opdService.updateVisit(id, updateVisitDto);
    }
    async deleteVisit(id) {
        return this.opdService.deleteVisit(id);
    }
    async createEncounter(createEncounterDto) {
        return this.opdService.createEncounter(createEncounterDto);
    }
    async getEncounterById(id) {
        return this.opdService.getEncounterById(id);
    }
    async updateEncounter(id, updateEncounterDto) {
        return this.opdService.updateEncounter(id, updateEncounterDto);
    }
    async completeEncounter(id) {
        return this.opdService.completeEncounter(id);
    }
    async createPrescription(createPrescriptionDto) {
        return this.opdService.createPrescription(createPrescriptionDto);
    }
    async getPatientPrescriptions(patientId) {
        return this.opdService.getPrescriptionsByPatient(patientId);
    }
    async getActivePrescriptions(patientId) {
        return this.opdService.getActivePrescriptions(patientId);
    }
    async generateToken(generateTokenDto) {
        return this.opdService.generateToken(generateTokenDto);
    }
    async getCurrentToken(doctorId) {
        return this.opdService.getCurrentToken(doctorId);
    }
    async callNextToken(doctorId) {
        return this.opdService.callNextToken(doctorId);
    }
    async createOrder(createOrderDto) {
        return this.opdService.createOrder(createOrderDto);
    }
    async getEncounterOrders(encounterId) {
        return this.opdService.getOrdersByEncounter(encounterId);
    }
    async uploadDocument(file, uploadDocumentDto) {
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        return this.opdService.uploadDocument(uploadDocumentDto, file);
    }
    async getPatientDocuments(patientId) {
        return this.opdService.getPatientDocuments(patientId);
    }
    async generateBill(encounterId) {
        return this.opdService.generateBill(encounterId);
    }
    async processPayment(billId, paymentDetails) {
        return this.opdService.processPayment(billId, paymentDetails);
    }
    async searchIcd10Codes(query) {
        if (!query || query.length < 3) {
            throw new common_1.BadRequestException('Query must be at least 3 characters long');
        }
        return this.opdService.searchIcd10Codes(query);
    }
    async createDiagnosis(createDiagnosisDto) {
        return this.opdService.createDiagnosis(createDiagnosisDto);
    }
    async getPatientDiagnoses(patientId) {
        return this.opdService.getPatientDiagnoses(patientId);
    }
    async recordVitals(recordVitalsDto) {
        return this.opdService.recordVitals(recordVitalsDto);
    }
    async getPatientVitals(patientId) {
        return this.opdService.getPatientVitals(patientId);
    }
};
exports.OPDController = OPDController;
__decorate([
    (0, common_1.Post)('visits'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new visit' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Visit created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.RECEPTIONIST),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OPDController.prototype, "createVisit", null);
__decorate([
    (0, common_1.Get)('visits/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get visit by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Visit found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Visit not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OPDController.prototype, "getVisitById", null);
__decorate([
    (0, common_1.Put)('visits/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a visit' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Visit updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Visit not found' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.RECEPTIONIST),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OPDController.prototype, "updateVisit", null);
__decorate([
    (0, common_1.Delete)('visits/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a visit' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Visit deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Visit not found' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.RECEPTIONIST),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OPDController.prototype, "deleteVisit", null);
__decorate([
    (0, common_1.Post)('encounters'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new encounter' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Encounter created successfully' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OPDController.prototype, "createEncounter", null);
__decorate([
    (0, common_1.Get)('encounters/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get encounter by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Encounter found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OPDController.prototype, "getEncounterById", null);
__decorate([
    (0, common_1.Put)('encounters/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an encounter' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Encounter updated successfully' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OPDController.prototype, "updateEncounter", null);
__decorate([
    (0, common_1.Post)('encounters/:id/complete'),
    (0, swagger_1.ApiOperation)({ summary: 'Complete an encounter' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Encounter completed successfully' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OPDController.prototype, "completeEncounter", null);
__decorate([
    (0, common_1.Post)('prescriptions'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new prescription' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Prescription created successfully' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OPDController.prototype, "createPrescription", null);
__decorate([
    (0, common_1.Get)('patients/:patientId/prescriptions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all prescriptions for a patient' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Prescriptions retrieved successfully' }),
    __param(0, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OPDController.prototype, "getPatientPrescriptions", null);
__decorate([
    (0, common_1.Get)('patients/:patientId/prescriptions/active'),
    (0, swagger_1.ApiOperation)({ summary: 'Get active prescriptions for a patient' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Active prescriptions retrieved' }),
    __param(0, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OPDController.prototype, "getActivePrescriptions", null);
__decorate([
    (0, common_1.Post)('queue/token'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate a new queue token' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Token generated successfully' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.RECEPTIONIST),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OPDController.prototype, "generateToken", null);
__decorate([
    (0, common_1.Get)('queue/current'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current token' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Current token retrieved' }),
    __param(0, (0, common_1.Query)('doctorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OPDController.prototype, "getCurrentToken", null);
__decorate([
    (0, common_1.Post)('queue/next'),
    (0, swagger_1.ApiOperation)({ summary: 'Call next token' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Next token called' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR),
    __param(0, (0, common_1.Body)('doctorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OPDController.prototype, "callNextToken", null);
__decorate([
    (0, common_1.Post)('orders'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new order' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Order created successfully' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OPDController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Get)('encounters/:encounterId/orders'),
    (0, swagger_1.ApiOperation)({ summary: 'Get orders for an encounter' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Orders retrieved successfully' }),
    __param(0, (0, common_1.Param)('encounterId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OPDController.prototype, "getEncounterOrders", null);
__decorate([
    (0, common_1.Post)('documents'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload a document' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
                patientId: { type: 'string' },
                documentType: { type: 'string' },
                notes: { type: 'string', required: false },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof Express !== "undefined" && (_a = Express.Multer) !== void 0 && _a.File) === "function" ? _b : Object, Object]),
    __metadata("design:returntype", Promise)
], OPDController.prototype, "uploadDocument", null);
__decorate([
    (0, common_1.Get)('patients/:patientId/documents'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all documents for a patient' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Documents retrieved successfully' }),
    __param(0, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OPDController.prototype, "getPatientDocuments", null);
__decorate([
    (0, common_1.Post)('bills/generate'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate a bill for an encounter' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Bill generated successfully' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.BILLING),
    __param(0, (0, common_1.Body)('encounterId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OPDController.prototype, "generateBill", null);
__decorate([
    (0, common_1.Post)('bills/:billId/pay'),
    (0, swagger_1.ApiOperation)({ summary: 'Process a payment for a bill' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Payment processed successfully' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.BILLING),
    __param(0, (0, common_1.Param)('billId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OPDController.prototype, "processPayment", null);
__decorate([
    (0, common_1.Get)('icd10'),
    (0, swagger_1.ApiOperation)({ summary: 'Search ICD-10 codes' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'ICD-10 codes retrieved' }),
    (0, swagger_1.ApiQuery)({ name: 'query', required: true, type: String }),
    __param(0, (0, common_1.Query)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OPDController.prototype, "searchIcd10Codes", null);
__decorate([
    (0, common_1.Post)('diagnoses'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new diagnosis' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Diagnosis created successfully' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OPDController.prototype, "createDiagnosis", null);
__decorate([
    (0, common_1.Get)('patients/:patientId/diagnoses'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all diagnoses for a patient' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Diagnoses retrieved successfully' }),
    __param(0, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OPDController.prototype, "getPatientDiagnoses", null);
__decorate([
    (0, common_1.Post)('vitals'),
    (0, swagger_1.ApiOperation)({ summary: 'Record patient vitals' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Vitals recorded successfully' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.DOCTOR),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OPDController.prototype, "recordVitals", null);
__decorate([
    (0, common_1.Get)('patients/:patientId/vitals'),
    (0, swagger_1.ApiOperation)({ summary: 'Get vitals history for a patient' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vitals history retrieved' }),
    __param(0, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OPDController.prototype, "getPatientVitals", null);
exports.OPDController = OPDController = __decorate([
    (0, common_1.Controller)('opd'),
    (0, swagger_1.ApiTags)('OPD Management'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.RECEPTIONIST),
    __metadata("design:paramtypes", [opd_service_1.OPDService])
], OPDController);
//# sourceMappingURL=opd.controller.js.map