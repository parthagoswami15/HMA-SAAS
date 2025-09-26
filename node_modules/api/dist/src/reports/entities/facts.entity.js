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
exports.FactLabs = exports.FactVisits = exports.FactBilling = void 0;
const typeorm_1 = require("typeorm");
const dimensions_entity_1 = require("./dimensions.entity");
let FactBilling = class FactBilling {
    id;
    createdAt;
    updatedAt;
    tenantId;
    date;
    dateId;
    facility;
    facilityId;
    provider;
    providerId;
    service;
    serviceId;
    payer;
    payerId;
    grossAmount;
    discountAmount;
    netAmount;
    taxAmount;
    paidAmount;
    outstandingAmount;
    quantity;
    invoiceId;
    appointmentId;
    admissionId;
    labOrderId;
    invoiceNumber;
    dueDate;
    paymentDate;
    paymentStatus;
    paymentMethod;
    isRefunded;
    refundAmount;
    notes;
};
exports.FactBilling = FactBilling;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], FactBilling.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], FactBilling.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], FactBilling.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], FactBilling.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => dimensions_entity_1.DimDate),
    (0, typeorm_1.JoinColumn)({ name: 'date_id' }),
    __metadata("design:type", dimensions_entity_1.DimDate)
], FactBilling.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], FactBilling.prototype, "dateId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => dimensions_entity_1.DimFacility),
    (0, typeorm_1.JoinColumn)({ name: 'facility_id' }),
    __metadata("design:type", dimensions_entity_1.DimFacility)
], FactBilling.prototype, "facility", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], FactBilling.prototype, "facilityId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => dimensions_entity_1.DimProvider, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'provider_id' }),
    __metadata("design:type", dimensions_entity_1.DimProvider)
], FactBilling.prototype, "provider", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], FactBilling.prototype, "providerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => dimensions_entity_1.DimService),
    (0, typeorm_1.JoinColumn)({ name: 'service_id' }),
    __metadata("design:type", dimensions_entity_1.DimService)
], FactBilling.prototype, "service", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], FactBilling.prototype, "serviceId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => dimensions_entity_1.DimPayer, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'payer_id' }),
    __metadata("design:type", dimensions_entity_1.DimPayer)
], FactBilling.prototype, "payer", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], FactBilling.prototype, "payerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], FactBilling.prototype, "grossAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], FactBilling.prototype, "discountAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], FactBilling.prototype, "netAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], FactBilling.prototype, "taxAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], FactBilling.prototype, "paidAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], FactBilling.prototype, "outstandingAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], FactBilling.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], FactBilling.prototype, "invoiceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], FactBilling.prototype, "appointmentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], FactBilling.prototype, "admissionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], FactBilling.prototype, "labOrderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], FactBilling.prototype, "invoiceNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], FactBilling.prototype, "dueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], FactBilling.prototype, "paymentDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], FactBilling.prototype, "paymentStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], FactBilling.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], FactBilling.prototype, "isRefunded", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], FactBilling.prototype, "refundAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], FactBilling.prototype, "notes", void 0);
exports.FactBilling = FactBilling = __decorate([
    (0, typeorm_1.Entity)('fact_billing')
], FactBilling);
let FactVisits = class FactVisits {
    id;
    createdAt;
    updatedAt;
    tenantId;
    date;
    dateId;
    facility;
    facilityId;
    provider;
    providerId;
    service;
    serviceId;
    patientCount;
    newPatients;
    followUpPatients;
    emergencyCases;
    scheduledAppointments;
    walkInAppointments;
    cancelledAppointments;
    noShowAppointments;
    averageWaitTime;
    averageConsultationTime;
    totalConsultationMinutes;
    patientSatisfactionScore;
    visitType;
    referralSource;
    patientId;
    medicalRecordNumber;
    patientAgeGroup;
    patientGender;
};
exports.FactVisits = FactVisits;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], FactVisits.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], FactVisits.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], FactVisits.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], FactVisits.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => dimensions_entity_1.DimDate),
    (0, typeorm_1.JoinColumn)({ name: 'date_id' }),
    __metadata("design:type", dimensions_entity_1.DimDate)
], FactVisits.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], FactVisits.prototype, "dateId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => dimensions_entity_1.DimFacility),
    (0, typeorm_1.JoinColumn)({ name: 'facility_id' }),
    __metadata("design:type", dimensions_entity_1.DimFacility)
], FactVisits.prototype, "facility", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], FactVisits.prototype, "facilityId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => dimensions_entity_1.DimProvider, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'provider_id' }),
    __metadata("design:type", dimensions_entity_1.DimProvider)
], FactVisits.prototype, "provider", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], FactVisits.prototype, "providerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => dimensions_entity_1.DimService, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'service_id' }),
    __metadata("design:type", dimensions_entity_1.DimService)
], FactVisits.prototype, "service", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], FactVisits.prototype, "serviceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], FactVisits.prototype, "patientCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], FactVisits.prototype, "newPatients", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], FactVisits.prototype, "followUpPatients", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], FactVisits.prototype, "emergencyCases", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], FactVisits.prototype, "scheduledAppointments", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], FactVisits.prototype, "walkInAppointments", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], FactVisits.prototype, "cancelledAppointments", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], FactVisits.prototype, "noShowAppointments", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], FactVisits.prototype, "averageWaitTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], FactVisits.prototype, "averageConsultationTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], FactVisits.prototype, "totalConsultationMinutes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], FactVisits.prototype, "patientSatisfactionScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], FactVisits.prototype, "visitType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], FactVisits.prototype, "referralSource", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], FactVisits.prototype, "patientId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], FactVisits.prototype, "medicalRecordNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], FactVisits.prototype, "patientAgeGroup", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], FactVisits.prototype, "patientGender", void 0);
exports.FactVisits = FactVisits = __decorate([
    (0, typeorm_1.Entity)('fact_visits')
], FactVisits);
let FactLabs = class FactLabs {
    id;
    createdAt;
    updatedAt;
    tenantId;
    date;
    dateId;
    facility;
    facilityId;
    orderingProvider;
    orderingProviderId;
    performingProvider;
    performingProviderId;
    service;
    serviceId;
    payer;
    payerId;
    testCount;
    grossAmount;
    discountAmount;
    netAmount;
    paidAmount;
    outstandingAmount;
    urgentTests;
    routineTests;
    statTests;
    completedTests;
    pendingTests;
    averageTAT;
    withinTATPercentage;
    testStatus;
    priority;
    testCategory;
    sampleType;
    testMethod;
    labOrderId;
    patientId;
    labOrderNumber;
    accessionNumber;
    collectedAt;
    reportedAt;
    isAbnormalResult;
    isCriticalResult;
};
exports.FactLabs = FactLabs;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], FactLabs.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], FactLabs.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], FactLabs.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], FactLabs.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => dimensions_entity_1.DimDate),
    (0, typeorm_1.JoinColumn)({ name: 'date_id' }),
    __metadata("design:type", dimensions_entity_1.DimDate)
], FactLabs.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], FactLabs.prototype, "dateId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => dimensions_entity_1.DimFacility),
    (0, typeorm_1.JoinColumn)({ name: 'facility_id' }),
    __metadata("design:type", dimensions_entity_1.DimFacility)
], FactLabs.prototype, "facility", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], FactLabs.prototype, "facilityId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => dimensions_entity_1.DimProvider, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'ordering_provider_id' }),
    __metadata("design:type", dimensions_entity_1.DimProvider)
], FactLabs.prototype, "orderingProvider", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], FactLabs.prototype, "orderingProviderId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => dimensions_entity_1.DimProvider, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'performing_provider_id' }),
    __metadata("design:type", dimensions_entity_1.DimProvider)
], FactLabs.prototype, "performingProvider", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], FactLabs.prototype, "performingProviderId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => dimensions_entity_1.DimService),
    (0, typeorm_1.JoinColumn)({ name: 'service_id' }),
    __metadata("design:type", dimensions_entity_1.DimService)
], FactLabs.prototype, "service", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], FactLabs.prototype, "serviceId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => dimensions_entity_1.DimPayer, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'payer_id' }),
    __metadata("design:type", dimensions_entity_1.DimPayer)
], FactLabs.prototype, "payer", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], FactLabs.prototype, "payerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], FactLabs.prototype, "testCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], FactLabs.prototype, "grossAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], FactLabs.prototype, "discountAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], FactLabs.prototype, "netAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], FactLabs.prototype, "paidAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], FactLabs.prototype, "outstandingAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], FactLabs.prototype, "urgentTests", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], FactLabs.prototype, "routineTests", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], FactLabs.prototype, "statTests", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], FactLabs.prototype, "completedTests", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], FactLabs.prototype, "pendingTests", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], FactLabs.prototype, "averageTAT", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], FactLabs.prototype, "withinTATPercentage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], FactLabs.prototype, "testStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], FactLabs.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], FactLabs.prototype, "testCategory", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], FactLabs.prototype, "sampleType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], FactLabs.prototype, "testMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], FactLabs.prototype, "labOrderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], FactLabs.prototype, "patientId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], FactLabs.prototype, "labOrderNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], FactLabs.prototype, "accessionNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], FactLabs.prototype, "collectedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], FactLabs.prototype, "reportedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], FactLabs.prototype, "isAbnormalResult", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], FactLabs.prototype, "isCriticalResult", void 0);
exports.FactLabs = FactLabs = __decorate([
    (0, typeorm_1.Entity)('fact_labs')
], FactLabs);
//# sourceMappingURL=facts.entity.js.map