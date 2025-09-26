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
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPDService = void 0;
const common_1 = require("@nestjs/common");
const visit_service_1 = require("./services/visit.service");
const encounter_service_1 = require("./services/encounter.service");
const prescription_service_1 = require("./services/prescription.service");
const queue_service_1 = require("./services/queue.service");
const order_service_1 = require("./services/order.service");
const document_service_1 = require("./services/document.service");
const billing_service_1 = require("./services/billing.service");
const icd10_service_1 = require("./services/icd10.service");
const diagnosis_service_1 = require("./services/diagnosis.service");
const vitals_service_1 = require("./services/vitals.service");
let OPDService = class OPDService {
    visitService;
    encounterService;
    prescriptionService;
    queueService;
    orderService;
    documentService;
    billingService;
    icd10Service;
    diagnosisService;
    vitalsService;
    constructor(visitService, encounterService, prescriptionService, queueService, orderService, documentService, billingService, icd10Service, diagnosisService, vitalsService) {
        this.visitService = visitService;
        this.encounterService = encounterService;
        this.prescriptionService = prescriptionService;
        this.queueService = queueService;
        this.orderService = orderService;
        this.documentService = documentService;
        this.billingService = billingService;
        this.icd10Service = icd10Service;
        this.diagnosisService = diagnosisService;
        this.vitalsService = vitalsService;
    }
    async createVisit(createVisitDto) {
        return this.visitService.create(createVisitDto);
    }
    async getVisitById(id) {
        return this.visitService.findById(id);
    }
    async updateVisit(id, updateVisitDto) {
        return this.visitService.update(id, updateVisitDto);
    }
    async deleteVisit(id) {
        return this.visitService.delete(id);
    }
    async createEncounter(createEncounterDto) {
        return this.encounterService.create(createEncounterDto);
    }
    async getEncounterById(id) {
        return this.encounterService.findById(id);
    }
    async updateEncounter(id, updateEncounterDto) {
        return this.encounterService.update(id, updateEncounterDto);
    }
    async completeEncounter(id) {
        return this.encounterService.completeEncounter(id);
    }
    async createPrescription(createPrescriptionDto) {
        return this.prescriptionService.create(createPrescriptionDto);
    }
    async getPrescriptionsByPatient(patientId) {
        return this.prescriptionService.findByPatient(patientId);
    }
    async getActivePrescriptions(patientId) {
        return this.prescriptionService.findActiveByPatient(patientId);
    }
    async generateToken(generateTokenDto) {
        return this.queueService.generateToken(generateTokenDto);
    }
    async getCurrentToken(doctorId) {
        return this.queueService.getCurrentToken(doctorId);
    }
    async callNextToken(doctorId) {
        return this.queueService.callNextToken(doctorId);
    }
    async createOrder(createOrderDto) {
        return this.orderService.create(createOrderDto);
    }
    async getOrdersByEncounter(encounterId) {
        return this.orderService.findByEncounter(encounterId);
    }
    async uploadDocument(uploadDocumentDto, file) {
        return this.documentService.upload(uploadDocumentDto, file);
    }
    async getPatientDocuments(patientId) {
        return this.documentService.findByPatient(patientId);
    }
    async generateBill(encounterId) {
        return this.billingService.generateBill(encounterId);
    }
    async processPayment(billId, paymentDetails) {
        return this.billingService.processPayment(billId, paymentDetails);
    }
    async searchIcd10Codes(query) {
        return this.icd10Service.search(query);
    }
    async createDiagnosis(createDiagnosisDto) {
        return this.diagnosisService.create(createDiagnosisDto);
    }
    async getPatientDiagnoses(patientId) {
        return this.diagnosisService.findByPatient(patientId);
    }
    async recordVitals(recordVitalsDto) {
        return this.vitalsService.record(recordVitalsDto);
    }
    async getPatientVitals(patientId) {
        return this.vitalsService.findByPatient(patientId);
    }
    async getVisits(options, filters) {
        const query = this.visitRepository.createQueryBuilder('visit');
        if (filters?.status)
            query.andWhere('visit.status = :status', { status: filters.status });
        if (filters?.patientId)
            query.andWhere('visit.patientId = :patientId', { patientId: filters.patientId });
        if (filters?.providerId)
            query.andWhere('visit.providerId = :providerId', { providerId: filters.providerId });
        query.orderBy('visit.scheduledAt', 'DESC');
        return paginate(query, options);
    }
    async getVisitById(id) {
        const visit = await this.visitRepository.findOne({
            where: { id },
            relations: ['patient', 'provider', 'encounters', 'prescriptions', 'orders']
        });
        if (!visit)
            throw new NotFoundException(`Visit with ID ${id} not found`);
        return visit;
    }
    async updateVisit(id, updateVisitDto) {
        const visit = await this.getVisitById(id);
        Object.assign(visit, updateVisitDto);
        return this.visitRepository.save(visit);
    }
    async createEncounter(createEncounterDto) {
        const encounter = this.encounterRepository.create(createEncounterDto);
        return this.encounterRepository.save(encounter);
    }
    async getEncounterById(id) {
        const encounter = await this.encounterRepository.findOne({
            where: { id },
            relations: ['visit', 'provider']
        });
        if (!encounter)
            throw new NotFoundException(`Encounter with ID ${id} not found`);
        return encounter;
    }
    async addToQueue(createQueueTokenDto) {
        const lastToken = await this.queueTokenRepository.findOne({
            where: { departmentId: createQueueTokenDto.departmentId },
            order: { tokenNumber: 'DESC' },
        });
        const tokenNumber = lastToken ? lastToken.tokenNumber + 1 : 1;
        const displayNumber = `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${tokenNumber.toString().padStart(3, '0')}`;
        const queueToken = this.queueTokenRepository.create({
            ...createQueueTokenDto,
            tokenNumber,
            displayNumber,
            status: TokenStatus.WAITING,
            issuedAt: new Date(),
        });
        return this.queueTokenRepository.save(queueToken);
    }
    async getQueue(departmentId) {
        const where = {
            status: In([TokenStatus.WAITING, TokenStatus.CALLED, TokenStatus.IN_PROGRESS])
        };
        if (departmentId)
            where.departmentId = departmentId;
        return this.queueTokenRepository.find({
            where,
            order: {
                priority: 'DESC',
                issuedAt: 'ASC'
            },
            relations: ['visit', 'visit.patient'],
        });
    }
    async callNextPatient(id, updateData) {
        const token = await this.queueTokenRepository.findOne({ where: { id } });
        if (!token)
            throw new NotFoundException('Token not found');
        Object.assign(token, {
            ...updateData,
            status: TokenStatus.CALLED,
            calledAt: new Date(),
        });
        return this.queueTokenRepository.save(token);
    }
};
exports.OPDService = OPDService;
exports.OPDService = OPDService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => visit_service_1.VisitService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => encounter_service_1.EncounterService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => prescription_service_1.PrescriptionService))),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => queue_service_1.QueueService))),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => order_service_1.OrderService))),
    __param(5, (0, common_1.Inject)((0, common_1.forwardRef)(() => document_service_1.DocumentService))),
    __param(6, (0, common_1.Inject)((0, common_1.forwardRef)(() => billing_service_1.BillingService))),
    __param(7, (0, common_1.Inject)((0, common_1.forwardRef)(() => icd10_service_1.Icd10Service))),
    __param(8, (0, common_1.Inject)((0, common_1.forwardRef)(() => diagnosis_service_1.DiagnosisService))),
    __param(9, (0, common_1.Inject)((0, common_1.forwardRef)(() => vitals_service_1.VitalsService))),
    __metadata("design:paramtypes", [typeof (_a = typeof visit_service_1.VisitService !== "undefined" && visit_service_1.VisitService) === "function" ? _a : Object, typeof (_b = typeof encounter_service_1.EncounterService !== "undefined" && encounter_service_1.EncounterService) === "function" ? _b : Object, typeof (_c = typeof prescription_service_1.PrescriptionService !== "undefined" && prescription_service_1.PrescriptionService) === "function" ? _c : Object, typeof (_d = typeof queue_service_1.QueueService !== "undefined" && queue_service_1.QueueService) === "function" ? _d : Object, typeof (_e = typeof order_service_1.OrderService !== "undefined" && order_service_1.OrderService) === "function" ? _e : Object, typeof (_f = typeof document_service_1.DocumentService !== "undefined" && document_service_1.DocumentService) === "function" ? _f : Object, typeof (_g = typeof billing_service_1.BillingService !== "undefined" && billing_service_1.BillingService) === "function" ? _g : Object, icd10_service_1.Icd10Service,
        diagnosis_service_1.DiagnosisService,
        vitals_service_1.VitalsService])
], OPDService);
//# sourceMappingURL=opd.service.js.map