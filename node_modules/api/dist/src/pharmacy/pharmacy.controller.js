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
exports.PharmacyController = void 0;
const common_1 = require("@nestjs/common");
const pharmacy_service_1 = require("./pharmacy.service");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const client_1 = require("@prisma/client");
const pharmacy_dto_1 = require("./dto/pharmacy.dto");
let PharmacyController = class PharmacyController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    async createItem(tenantId, dto) {
        return this.svc.createItem(tenantId, dto);
    }
    async getItems(tenantId) {
        return this.svc.getItems(tenantId);
    }
    async getItem(tenantId, id) {
        return this.svc.getItemById(tenantId, id);
    }
    async updateItem(tenantId, id, dto) {
        return this.svc.updateItem(tenantId, id, dto);
    }
    async deleteItem(tenantId, id) {
        return this.svc.deleteItem(tenantId, id);
    }
    async createBatch(tenantId, dto) {
        return this.svc.createBatch(tenantId, dto);
    }
    async getBatches(tenantId) {
        return this.svc.getBatches(tenantId);
    }
    async updateBatch(tenantId, id, dto) {
        return this.svc.updateBatch(tenantId, id, dto);
    }
    async deleteBatch(tenantId, id) {
        return this.svc.deleteBatch(tenantId, id);
    }
    async createVendor(tenantId, dto) {
        return this.svc.createVendor(tenantId, dto);
    }
    async getVendors(tenantId) {
        return this.svc.getVendors(tenantId);
    }
    async updateVendor(tenantId, id, dto) {
        return this.svc.updateVendor(tenantId, id, dto);
    }
    async deleteVendor(tenantId, id) {
        return this.svc.deleteVendor(tenantId, id);
    }
    async createGrn(tenantId, dto) {
        return this.svc.createGrn(tenantId, dto);
    }
    async getGrns(tenantId) {
        return this.svc.getGrns(tenantId);
    }
    async updateGrn(tenantId, id, dto) {
        return this.svc.updateGrn(tenantId, id, dto);
    }
    async deleteGrn(tenantId, id) {
        return this.svc.deleteGrn(tenantId, id);
    }
    async createFormulary(tenantId, dto) {
        return this.svc.createFormulary(tenantId, dto);
    }
    async getFormularies(tenantId) {
        return this.svc.getFormularies(tenantId);
    }
    async updateFormulary(tenantId, id, dto) {
        return this.svc.updateFormulary(tenantId, id, dto);
    }
    async deleteFormulary(tenantId, id) {
        return this.svc.deleteFormulary(tenantId, id);
    }
    async addItemToFormulary(tenantId, dto) {
        return this.svc.addItemToFormulary(tenantId, dto);
    }
    async updateFormularyItem(tenantId, id, dto) {
        return this.svc.updateFormularyItem(tenantId, id, dto);
    }
    async removeFromFormulary(tenantId, id) {
        return this.svc.removeFromFormulary(tenantId, id);
    }
    async createReorderRule(tenantId, dto) {
        return this.svc.createReorderRule(tenantId, dto);
    }
    async getReorderRules(tenantId) {
        return this.svc.getReorderRules(tenantId);
    }
    async updateReorderRule(tenantId, id, dto) {
        return this.svc.updateReorderRule(tenantId, id, dto);
    }
    async deleteReorderRule(tenantId, id) {
        return this.svc.deleteReorderRule(tenantId, id);
    }
    async createRxFill(tenantId, dto) {
        return this.svc.createRxFill(tenantId, dto);
    }
    async getRxFills(tenantId) {
        return this.svc.getRxFills(tenantId);
    }
    async updateRxFill(tenantId, id, dto) {
        return this.svc.updateRxFill(tenantId, id, dto);
    }
    async deleteRxFill(tenantId, id) {
        return this.svc.deleteRxFill(tenantId, id);
    }
    async createSale(tenantId, dto) {
        return this.svc.createSale(tenantId, dto);
    }
    async getSales(tenantId) {
        return this.svc.getSales(tenantId);
    }
    async updateSale(tenantId, id, dto) {
        return this.svc.updateSale(tenantId, id, dto);
    }
    async deleteSale(tenantId, id) {
        return this.svc.deleteSale(tenantId, id);
    }
    async createReturn(tenantId, dto) {
        return this.svc.createReturn(tenantId, dto);
    }
    async getReturns(tenantId) {
        return this.svc.getReturns(tenantId);
    }
    async updateReturn(tenantId, id, dto) {
        return this.svc.updateReturn(tenantId, id, dto);
    }
    async deleteReturn(tenantId, id) {
        return this.svc.deleteReturn(tenantId, id);
    }
    async createInventoryTx(tenantId, dto) {
        return this.svc.createInventoryTx(tenantId, dto);
    }
    async getInventoryTx(tenantId) {
        return this.svc.getInventoryTx(tenantId);
    }
    async processProcurement(tenantId, { grnData, batches }) {
        return this.svc.processProcurement(tenantId, grnData, batches);
    }
    async getStockAlerts(tenantId) {
        return this.svc.getStockAlerts(tenantId);
    }
    async dispensePrescription(tenantId, { prescriptionId, items }) {
        return this.svc.dispensePrescription(tenantId, prescriptionId, items);
    }
    async issueToIpd(tenantId, { patientId, items }) {
        return this.svc.issueToIpd(tenantId, patientId, items);
    }
};
exports.PharmacyController = PharmacyController;
__decorate([
    (0, common_1.Post)('items'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.PHARMACIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pharmacy_dto_1.CreateItemDto]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "createItem", null);
__decorate([
    (0, common_1.Get)('items'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "getItems", null);
__decorate([
    (0, common_1.Get)('items/:id'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "getItem", null);
__decorate([
    (0, common_1.Put)('items/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.PHARMACIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, pharmacy_dto_1.UpdateItemDto]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "updateItem", null);
__decorate([
    (0, common_1.Delete)('items/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.PHARMACIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "deleteItem", null);
__decorate([
    (0, common_1.Post)('batches'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.PHARMACIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pharmacy_dto_1.CreateBatchDto]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "createBatch", null);
__decorate([
    (0, common_1.Get)('batches'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "getBatches", null);
__decorate([
    (0, common_1.Put)('batches/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.PHARMACIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, pharmacy_dto_1.UpdateBatchDto]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "updateBatch", null);
__decorate([
    (0, common_1.Delete)('batches/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.PHARMACIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "deleteBatch", null);
__decorate([
    (0, common_1.Post)('vendors'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.PHARMACIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pharmacy_dto_1.CreateVendorDto]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "createVendor", null);
__decorate([
    (0, common_1.Get)('vendors'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "getVendors", null);
__decorate([
    (0, common_1.Put)('vendors/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.PHARMACIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, pharmacy_dto_1.UpdateVendorDto]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "updateVendor", null);
__decorate([
    (0, common_1.Delete)('vendors/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.PHARMACIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "deleteVendor", null);
__decorate([
    (0, common_1.Post)('grns'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.PHARMACIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pharmacy_dto_1.CreateGrnDto]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "createGrn", null);
__decorate([
    (0, common_1.Get)('grns'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "getGrns", null);
__decorate([
    (0, common_1.Put)('grns/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.PHARMACIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, pharmacy_dto_1.UpdateGrnDto]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "updateGrn", null);
__decorate([
    (0, common_1.Delete)('grns/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.PHARMACIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "deleteGrn", null);
__decorate([
    (0, common_1.Post)('formularies'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.PHARMACIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pharmacy_dto_1.CreateFormularyDto]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "createFormulary", null);
__decorate([
    (0, common_1.Get)('formularies'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "getFormularies", null);
__decorate([
    (0, common_1.Put)('formularies/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.PHARMACIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, pharmacy_dto_1.UpdateFormularyDto]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "updateFormulary", null);
__decorate([
    (0, common_1.Delete)('formularies/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.PHARMACIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "deleteFormulary", null);
__decorate([
    (0, common_1.Post)('formulary-items'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.PHARMACIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pharmacy_dto_1.CreateFormularyItemDto]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "addItemToFormulary", null);
__decorate([
    (0, common_1.Put)('formulary-items/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.PHARMACIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, pharmacy_dto_1.UpdateFormularyItemDto]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "updateFormularyItem", null);
__decorate([
    (0, common_1.Delete)('formulary-items/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.PHARMACIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "removeFromFormulary", null);
__decorate([
    (0, common_1.Post)('reorder-rules'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.PHARMACIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pharmacy_dto_1.CreateReorderRuleDto]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "createReorderRule", null);
__decorate([
    (0, common_1.Get)('reorder-rules'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "getReorderRules", null);
__decorate([
    (0, common_1.Put)('reorder-rules/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.PHARMACIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, pharmacy_dto_1.UpdateReorderRuleDto]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "updateReorderRule", null);
__decorate([
    (0, common_1.Delete)('reorder-rules/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.PHARMACIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "deleteReorderRule", null);
__decorate([
    (0, common_1.Post)('rx-fills'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.PHARMACIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pharmacy_dto_1.CreateRxFillDto]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "createRxFill", null);
__decorate([
    (0, common_1.Get)('rx-fills'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "getRxFills", null);
__decorate([
    (0, common_1.Put)('rx-fills/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.PHARMACIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, pharmacy_dto_1.UpdateRxFillDto]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "updateRxFill", null);
__decorate([
    (0, common_1.Delete)('rx-fills/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.PHARMACIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "deleteRxFill", null);
__decorate([
    (0, common_1.Post)('sales'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.PHARMACIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pharmacy_dto_1.CreateSaleDto]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "createSale", null);
__decorate([
    (0, common_1.Get)('sales'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "getSales", null);
__decorate([
    (0, common_1.Put)('sales/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.PHARMACIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, pharmacy_dto_1.UpdateSaleDto]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "updateSale", null);
__decorate([
    (0, common_1.Delete)('sales/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.PHARMACIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "deleteSale", null);
__decorate([
    (0, common_1.Post)('returns'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.PHARMACIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pharmacy_dto_1.CreateReturnDto]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "createReturn", null);
__decorate([
    (0, common_1.Get)('returns'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "getReturns", null);
__decorate([
    (0, common_1.Put)('returns/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.PHARMACIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, pharmacy_dto_1.UpdateReturnDto]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "updateReturn", null);
__decorate([
    (0, common_1.Delete)('returns/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.PHARMACIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "deleteReturn", null);
__decorate([
    (0, common_1.Post)('inventory-tx'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.PHARMACIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pharmacy_dto_1.CreateInventoryTxDto]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "createInventoryTx", null);
__decorate([
    (0, common_1.Get)('inventory-tx'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "getInventoryTx", null);
__decorate([
    (0, common_1.Post)('procurement'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.PHARMACIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "processProcurement", null);
__decorate([
    (0, common_1.Get)('stock-alerts'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "getStockAlerts", null);
__decorate([
    (0, common_1.Post)('dispense'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.PHARMACIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "dispensePrescription", null);
__decorate([
    (0, common_1.Post)('issue-ipd'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.PHARMACIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "issueToIpd", null);
exports.PharmacyController = PharmacyController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, common_1.Controller)('pharmacy'),
    __metadata("design:paramtypes", [pharmacy_service_1.PharmacyService])
], PharmacyController);
//# sourceMappingURL=pharmacy.controller.js.map