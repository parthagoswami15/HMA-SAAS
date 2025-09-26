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
var PharmacyService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PharmacyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let PharmacyService = PharmacyService_1 = class PharmacyService {
    prisma;
    logger = new common_1.Logger(PharmacyService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createItem(tenantId, data) {
        return this.prisma.item.create({
            data: {
                ...data,
                tenantId,
            },
        });
    }
    async getItems(tenantId) {
        return this.prisma.item.findMany({
            where: { tenantId },
            include: { batches: true },
        });
    }
    async getItemById(tenantId, id) {
        const item = await this.prisma.item.findUnique({
            where: { id, tenantId },
            include: { batches: true },
        });
        if (!item)
            throw new common_1.NotFoundException('Item not found');
        return item;
    }
    async updateItem(tenantId, id, data) {
        return this.prisma.item.update({
            where: { id, tenantId },
            data,
        });
    }
    async deleteItem(tenantId, id) {
        return this.prisma.item.delete({
            where: { id, tenantId },
        });
    }
    async createBatch(tenantId, data) {
        return this.prisma.batch.create({
            data: {
                ...data,
                expDt: new Date(data.expDt),
                mfgDt: data.mfgDt ? new Date(data.mfgDt) : null,
                tenantId,
            },
        });
    }
    async getBatches(tenantId) {
        return this.prisma.batch.findMany({
            where: { tenantId },
            include: { item: true, vendor: true },
        });
    }
    async updateBatch(tenantId, id, data) {
        return this.prisma.batch.update({
            where: { id, tenantId },
            data: {
                ...data,
                expDt: data.expDt ? new Date(data.expDt) : undefined,
                mfgDt: data.mfgDt ? new Date(data.mfgDt) : undefined,
            },
        });
    }
    async deleteBatch(tenantId, id) {
        return this.prisma.batch.delete({
            where: { id, tenantId },
        });
    }
    async createVendor(tenantId, data) {
        return this.prisma.vendor.create({
            data: { ...data, tenantId },
        });
    }
    async getVendors(tenantId) {
        return this.prisma.vendor.findMany({
            where: { tenantId },
        });
    }
    async updateVendor(tenantId, id, data) {
        return this.prisma.vendor.update({
            where: { id, tenantId },
            data,
        });
    }
    async deleteVendor(tenantId, id) {
        return this.prisma.vendor.delete({
            where: { id, tenantId },
        });
    }
    async createGrn(tenantId, data) {
        return this.prisma.grn.create({
            data: {
                ...data,
                receivedDt: data.receivedDt ? new Date(data.receivedDt) : new Date(),
                tenantId,
            },
        });
    }
    async getGrns(tenantId) {
        return this.prisma.grn.findMany({
            where: { tenantId },
            include: { vendor: true },
        });
    }
    async updateGrn(tenantId, id, data) {
        return this.prisma.grn.update({
            where: { id, tenantId },
            data: {
                ...data,
                receivedDt: data.receivedDt ? new Date(data.receivedDt) : undefined,
            },
        });
    }
    async deleteGrn(tenantId, id) {
        return this.prisma.grn.delete({
            where: { id, tenantId },
        });
    }
    async createFormulary(tenantId, data) {
        return this.prisma.formulary.create({
            data: { ...data, tenantId },
        });
    }
    async getFormularies(tenantId) {
        return this.prisma.formulary.findMany({
            where: { tenantId },
            include: { items: { include: { item: true } } },
        });
    }
    async updateFormulary(tenantId, id, data) {
        return this.prisma.formulary.update({
            where: { id, tenantId },
            data,
        });
    }
    async deleteFormulary(tenantId, id) {
        return this.prisma.formulary.delete({
            where: { id, tenantId },
        });
    }
    async addItemToFormulary(tenantId, data) {
        return this.prisma.formularyItem.create({
            data: { ...data, tenantId },
        });
    }
    async updateFormularyItem(tenantId, id, data) {
        return this.prisma.formularyItem.update({
            where: { id, tenantId },
            data,
        });
    }
    async removeFromFormulary(tenantId, id) {
        return this.prisma.formularyItem.delete({
            where: { id, tenantId },
        });
    }
    async createReorderRule(tenantId, data) {
        return this.prisma.reorderRule.create({
            data: { ...data, tenantId },
        });
    }
    async getReorderRules(tenantId) {
        return this.prisma.reorderRule.findMany({
            where: { tenantId },
            include: { item: true },
        });
    }
    async updateReorderRule(tenantId, id, data) {
        return this.prisma.reorderRule.update({
            where: { id, tenantId },
            data,
        });
    }
    async deleteReorderRule(tenantId, id) {
        return this.prisma.reorderRule.delete({
            where: { id, tenantId },
        });
    }
    async createRxFill(tenantId, data) {
        return this.prisma.rxFill.create({
            data: {
                ...data,
                dispensedAt: data.dispensedAt ? new Date(data.dispensedAt) : null,
                tenantId,
            },
        });
    }
    async getRxFills(tenantId) {
        return this.prisma.rxFill.findMany({
            where: { tenantId },
            include: { item: true, batch: true },
        });
    }
    async updateRxFill(tenantId, id, data) {
        return this.prisma.rxFill.update({
            where: { id, tenantId },
            data: {
                ...data,
                dispensedAt: data.dispensedAt ? new Date(data.dispensedAt) : undefined,
            },
        });
    }
    async deleteRxFill(tenantId, id) {
        return this.prisma.rxFill.delete({
            where: { id, tenantId },
        });
    }
    async createSale(tenantId, data) {
        return this.prisma.$transaction(async (tx) => {
            const sale = await tx.sale.create({
                data: {
                    ...data,
                    tenantId,
                },
                include: { items: true },
            });
            for (const item of data.items) {
                await tx.inventoryTx.create({
                    data: {
                        itemId: item.itemId,
                        batchId: item.batchId,
                        qty: -item.qty,
                        reason: client_1.InventoryReason.SALE,
                        refDoc: sale.id,
                        tenantId,
                    },
                });
            }
            return sale;
        });
    }
    async getSales(tenantId) {
        return this.prisma.sale.findMany({
            where: { tenantId },
            include: { patient: true, items: { include: { item: true } } },
        });
    }
    async updateSale(tenantId, id, data) {
        return this.prisma.sale.update({
            where: { id, tenantId },
            data,
        });
    }
    async deleteSale(tenantId, id) {
        return this.prisma.sale.delete({
            where: { id, tenantId },
        });
    }
    async createReturn(tenantId, data) {
        return this.prisma.$transaction(async (tx) => {
            const return_ = await tx.return.create({
                data: {
                    ...data,
                    tenantId,
                },
                include: { items: true },
            });
            for (const item of data.items) {
                await tx.inventoryTx.create({
                    data: {
                        itemId: item.itemId,
                        batchId: item.batchId,
                        qty: item.qty,
                        reason: client_1.InventoryReason.RETURN,
                        refDoc: return_.id,
                        tenantId,
                    },
                });
            }
            return return_;
        });
    }
    async getReturns(tenantId) {
        return this.prisma.return.findMany({
            where: { tenantId },
            include: { sale: true, items: { include: { item: true } } },
        });
    }
    async updateReturn(tenantId, id, data) {
        return this.prisma.return.update({
            where: { id, tenantId },
            data,
        });
    }
    async deleteReturn(tenantId, id) {
        return this.prisma.return.delete({
            where: { id, tenantId },
        });
    }
    async createInventoryTx(tenantId, data) {
        return this.prisma.inventoryTx.create({
            data: { ...data, tenantId },
        });
    }
    async getInventoryTx(tenantId) {
        return this.prisma.inventoryTx.findMany({
            where: { tenantId },
            include: { item: true, batch: true },
        });
    }
    async processProcurement(tenantId, grnData, batches) {
        return this.prisma.$transaction(async (tx) => {
            const grn = await tx.grn.create({
                data: { ...grnData, tenantId },
            });
            for (const batch of batches) {
                await tx.batch.create({
                    data: {
                        ...batch,
                        grnId: grn.id,
                        expDt: new Date(batch.expDt),
                        mfgDt: batch.mfgDt ? new Date(batch.mfgDt) : null,
                        tenantId,
                    },
                });
                const item = await tx.item.findUnique({
                    where: { id: batch.itemId, tenantId },
                });
                if (item) {
                    await tx.item.update({
                        where: { id: batch.itemId },
                        data: { updatedAt: new Date() },
                    });
                }
                await tx.inventoryTx.create({
                    data: {
                        itemId: batch.itemId,
                        batchId: batch.batchNo,
                        qty: batch.qtyOnHand || 0,
                        reason: client_1.InventoryReason.PURCHASE,
                        refDoc: grn.id,
                        tenantId,
                    },
                });
            }
            return grn;
        });
    }
    async getStockAlerts(tenantId) {
        const items = await this.prisma.item.findMany({
            where: { tenantId },
            include: { batches: true },
        });
        const alerts = items.map(item => {
            const totalQty = item.batches.reduce((sum, batch) => sum + batch.qtyOnHand, 0);
            const expiringSoon = item.batches.filter(batch => {
                const daysUntilExpiry = Math.ceil((batch.expDt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                return daysUntilExpiry <= 30;
            });
            return {
                itemId: item.id,
                itemName: item.name,
                totalQty,
                expiringSoon: expiringSoon.length,
                isLowStock: totalQty < 10,
            };
        });
        return alerts;
    }
    async dispensePrescription(tenantId, prescriptionId, items) {
        return this.prisma.$transaction(async (tx) => {
            for (const item of items) {
                const batch = await tx.batch.findUnique({
                    where: { id: item.batchId, tenantId },
                });
                if (!batch || batch.qtyOnHand < item.qty) {
                    throw new common_1.BadRequestException(`Insufficient stock for item ${item.itemId}`);
                }
                await tx.rxFill.create({
                    data: {
                        prescriptionId,
                        itemId: item.itemId,
                        qty: item.qty,
                        batchId: item.batchId,
                        rate: batch.mrp,
                        tenantId,
                    },
                });
                await tx.batch.update({
                    where: { id: item.batchId },
                    data: { qtyOnHand: { decrement: item.qty } },
                });
                await tx.inventoryTx.create({
                    data: {
                        itemId: item.itemId,
                        batchId: item.batchId,
                        qty: -item.qty,
                        reason: client_1.InventoryReason.SALE,
                        refDoc: prescriptionId,
                        tenantId,
                    },
                });
            }
        });
    }
    async issueToIpd(tenantId, patientId, items) {
        return this.prisma.$transaction(async (tx) => {
            for (const item of items) {
                const batch = await tx.batch.findUnique({
                    where: { id: item.batchId, tenantId },
                });
                if (!batch || batch.qtyOnHand < item.qty) {
                    throw new common_1.BadRequestException(`Insufficient stock for item ${item.itemId}`);
                }
                await tx.inventoryTx.create({
                    data: {
                        itemId: item.itemId,
                        batchId: item.batchId,
                        qty: -item.qty,
                        reason: client_1.InventoryReason.ADJUSTMENT,
                        refDoc: patientId,
                        tenantId,
                    },
                });
                await tx.batch.update({
                    where: { id: item.batchId },
                    data: { qtyOnHand: { decrement: item.qty } },
                });
            }
        });
    }
};
exports.PharmacyService = PharmacyService;
exports.PharmacyService = PharmacyService = PharmacyService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PharmacyService);
//# sourceMappingURL=pharmacy.service.js.map