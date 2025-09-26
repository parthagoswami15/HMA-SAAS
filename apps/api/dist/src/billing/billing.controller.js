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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingController = void 0;
const common_1 = require("@nestjs/common");
const billing_service_1 = require("./billing.service");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const client_1 = require("@prisma/client");
const billing_dto_1 = require("./billing.dto");
let BillingController = class BillingController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    async createChargeItem(tenantId, dto) {
        return this.svc.createChargeItem(tenantId, dto);
    }
    async getChargeItems(tenantId) {
        return this.svc.getChargeItems(tenantId);
    }
    async getChargeItem(tenantId, id) {
        return this.svc.getChargeItemById(tenantId, id);
    }
    async updateChargeItem(tenantId, id, dto) {
        return this.svc.updateChargeItem(tenantId, id, dto);
    }
    async deleteChargeItem(tenantId, id) {
        return this.svc.deleteChargeItem(tenantId, id);
    }
    async createPriceList(tenantId, dto) {
        return this.svc.createPriceList(tenantId, dto);
    }
    async getPriceLists(tenantId) {
        return this.svc.getPriceLists(tenantId);
    }
    async updatePriceList(tenantId, id, dto) {
        return this.svc.updatePriceList(tenantId, id, dto);
    }
    async deletePriceList(tenantId, id) {
        return this.svc.deletePriceList(tenantId, id);
    }
    async addItemToPriceList(tenantId, dto) {
        return this.svc.addItemToPriceList(tenantId, dto);
    }
    async updatePriceListItem(tenantId, id, dto) {
        return this.svc.updatePriceListItem(tenantId, id, dto);
    }
    async removeFromPriceList(tenantId, id) {
        return this.svc.removeFromPriceList(tenantId, id);
    }
    async createPackage(tenantId, dto) {
        return this.svc.createPackage(tenantId, dto);
    }
    async getPackages(tenantId) {
        return this.svc.getPackages(tenantId);
    }
    async updatePackage(tenantId, id, dto) {
        return this.svc.updatePackage(tenantId, id, dto);
    }
    async deletePackage(tenantId, id) {
        return this.svc.deletePackage(tenantId, id);
    }
    async createInvoice(tenantId, dto) {
        return this.svc.createInvoice(tenantId, dto);
    }
    async getInvoices(tenantId, patientId) {
        return this.svc.getInvoices(tenantId, patientId);
    }
    async updateInvoice(tenantId, id, dto) {
        return this.svc.updateInvoice(tenantId, id, dto);
    }
    async deleteInvoice(tenantId, id) {
        return this.svc.deleteInvoice(tenantId, id);
    }
    async createPayment(tenantId, dto) {
        return this.svc.createPayment(tenantId, dto);
    }
    async getPayments(tenantId) {
        return this.svc.getPayments(tenantId);
    }
    async updatePayment(tenantId, id, dto) {
        return this.svc.updatePayment(tenantId, id, dto);
    }
    async deletePayment(tenantId, id) {
        return this.svc.deletePayment(tenantId, id);
    }
    async createAdjustment(tenantId, dto) {
        return this.svc.createAdjustment(tenantId, dto);
    }
    async getAdjustments(tenantId) {
        return this.svc.getAdjustments(tenantId);
    }
    async updateAdjustment(tenantId, id, dto) {
        return this.svc.updateAdjustment(tenantId, id, dto);
    }
    async deleteAdjustment(tenantId, id) {
        return this.svc.deleteAdjustment(tenantId, id);
    }
    async createPayer(tenantId, dto) {
        return this.svc.createPayer(tenantId, dto);
    }
    async getPayers(tenantId) {
        return this.svc.getPayers(tenantId);
    }
    async updatePayer(tenantId, id, dto) {
        return this.svc.updatePayer(tenantId, id, dto);
    }
    async deletePayer(tenantId, id) {
        return this.svc.deletePayer(tenantId, id);
    }
    async createLedgerEntry(tenantId, dto) {
        return this.svc.createLedgerEntry(tenantId, dto);
    }
    async getLedgerEntries(tenantId, entityId) {
        return this.svc.getLedgerEntries(tenantId, entityId);
    }
    async updateLedgerEntry(tenantId, id, dto) {
        return this.svc.updateLedgerEntry(tenantId, id, dto);
    }
    async deleteLedgerEntry(tenantId, id) {
        return this.svc.deleteLedgerEntry(tenantId, id);
    }
    async postCharge(tenantId, dto) {
        return this.svc.postCharge(tenantId, dto);
    }
    async generateInvoice(tenantId, { patientId, consolidated }) {
        return this.svc.generateInvoice(tenantId, patientId, consolidated);
    }
    async processPayment(tenantId, dto) {
        return this.svc.processPayment(tenantId, dto);
    }
    async applyDiscount(tenantId, dto) {
        return this.svc.applyDiscount(tenantId, dto);
    }
    async getPatientStatement(tenantId, patientId) {
        return this.svc.getPatientStatement(tenantId, patientId);
    }
    async getCorporateStatement(tenantId, payerId) {
        return this.svc.getCorporateStatement(tenantId, payerId);
    }
    async getBillingConfig(tenantId) {
        return this.svc.getBillingConfig(tenantId);
    }
    async generateInterimBill(tenantId, { admissionId }) {
        return this.svc.generateInterimBill(tenantId, admissionId);
    }
    async reverseInvoice(tenantId, invoiceId) {
        return this.svc.reverseInvoice(tenantId, invoiceId);
    }
};
exports.BillingController = BillingController;
__decorate([
    (0, common_1.Post)('charge-items'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, billing_dto_1.CreateChargeItemDto]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "createChargeItem", null);
__decorate([
    (0, common_1.Get)('charge-items'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "getChargeItems", null);
__decorate([
    (0, common_1.Get)('charge-items/:id'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "getChargeItem", null);
__decorate([
    (0, common_1.Put)('charge-items/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, billing_dto_1.UpdateChargeItemDto]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "updateChargeItem", null);
__decorate([
    (0, common_1.Delete)('charge-items/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "deleteChargeItem", null);
__decorate([
    (0, common_1.Post)('price-lists'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, billing_dto_1.CreatePriceListDto]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "createPriceList", null);
__decorate([
    (0, common_1.Get)('price-lists'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "getPriceLists", null);
__decorate([
    (0, common_1.Put)('price-lists/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, billing_dto_1.UpdatePriceListDto]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "updatePriceList", null);
__decorate([
    (0, common_1.Delete)('price-lists/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "deletePriceList", null);
__decorate([
    (0, common_1.Post)('price-list-items'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, billing_dto_1.CreatePriceListItemDto]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "addItemToPriceList", null);
__decorate([
    (0, common_1.Put)('price-list-items/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, billing_dto_1.UpdatePriceListItemDto]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "updatePriceListItem", null);
__decorate([
    (0, common_1.Delete)('price-list-items/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "removeFromPriceList", null);
__decorate([
    (0, common_1.Post)('packages'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, billing_dto_1.CreatePackageDto]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "createPackage", null);
__decorate([
    (0, common_1.Get)('packages'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "getPackages", null);
__decorate([
    (0, common_1.Put)('packages/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, billing_dto_1.UpdatePackageDto]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "updatePackage", null);
__decorate([
    (0, common_1.Delete)('packages/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "deletePackage", null);
__decorate([
    (0, common_1.Post)('invoices'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, billing_dto_1.CreateInvoiceDto]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "createInvoice", null);
__decorate([
    (0, common_1.Get)('invoices'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Query)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "getInvoices", null);
__decorate([
    (0, common_1.Put)('invoices/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, billing_dto_1.UpdateInvoiceDto]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "updateInvoice", null);
__decorate([
    (0, common_1.Delete)('invoices/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "deleteInvoice", null);
__decorate([
    (0, common_1.Post)('payments'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, billing_dto_1.CreatePaymentDto]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "createPayment", null);
__decorate([
    (0, common_1.Get)('payments'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "getPayments", null);
__decorate([
    (0, common_1.Put)('payments/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, billing_dto_1.UpdatePaymentDto]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "updatePayment", null);
__decorate([
    (0, common_1.Delete)('payments/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "deletePayment", null);
__decorate([
    (0, common_1.Post)('adjustments'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, billing_dto_1.CreateAdjustmentDto]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "createAdjustment", null);
__decorate([
    (0, common_1.Get)('adjustments'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "getAdjustments", null);
__decorate([
    (0, common_1.Put)('adjustments/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, billing_dto_1.UpdateAdjustmentDto]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "updateAdjustment", null);
__decorate([
    (0, common_1.Delete)('adjustments/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "deleteAdjustment", null);
__decorate([
    (0, common_1.Post)('payers'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, billing_dto_1.CreatePayerDto]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "createPayer", null);
__decorate([
    (0, common_1.Get)('payers'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "getPayers", null);
__decorate([
    (0, common_1.Put)('payers/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, billing_dto_1.UpdatePayerDto]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "updatePayer", null);
__decorate([
    (0, common_1.Delete)('payers/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "deletePayer", null);
__decorate([
    (0, common_1.Post)('ledger'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, billing_dto_1.CreateLedgerDto]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "createLedgerEntry", null);
__decorate([
    (0, common_1.Get)('ledger'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Query)('entityId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "getLedgerEntries", null);
__decorate([
    (0, common_1.Put)('ledger/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, billing_dto_1.UpdateLedgerDto]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "updateLedgerEntry", null);
__decorate([
    (0, common_1.Delete)('ledger/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "deleteLedgerEntry", null);
__decorate([
    (0, common_1.Post)('accruals'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "postCharge", null);
__decorate([
    (0, common_1.Post)('generate-invoice'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "generateInvoice", null);
__decorate([
    (0, common_1.Post)('process-payment'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "processPayment", null);
__decorate([
    (0, common_1.Post)('apply-discount'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "applyDiscount", null);
__decorate([
    (0, common_1.Get)('patient-statement/:patientId'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "getPatientStatement", null);
__decorate([
    (0, common_1.Get)('corporate-statement/:payerId'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('payerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "getCorporateStatement", null);
__decorate([
    (0, common_1.Get)('config'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "getBillingConfig", null);
__decorate([
    (0, common_1.Post)('interim-bill'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "generateInterimBill", null);
__decorate([
    (0, common_1.Post)('reverse-invoice/:invoiceId'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('invoiceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "reverseInvoice", null);
exports.BillingController = BillingController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, common_1.Controller)('billing'),
    __metadata("design:paramtypes", [billing_service_1.BillingService])
], BillingController);
//# sourceMappingURL=billing.controller.js.map