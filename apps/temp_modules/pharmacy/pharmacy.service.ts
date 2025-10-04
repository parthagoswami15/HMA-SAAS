import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ItemType, SaleStatus, ReturnStatus, InventoryReason } from '@prisma/client';
import { CreateItemDto, UpdateItemDto, CreateBatchDto, UpdateBatchDto, CreateVendorDto, UpdateVendorDto, CreateGrnDto, UpdateGrnDto, CreateFormularyDto, UpdateFormularyDto, CreateFormularyItemDto, UpdateFormularyItemDto, CreateReorderRuleDto, UpdateReorderRuleDto, CreateRxFillDto, UpdateRxFillDto, CreateSaleDto, UpdateSaleDto, CreateReturnDto, UpdateReturnDto, CreateInventoryTxDto, UpdateInventoryTxDto } from './dto/pharmacy.dto';

@Injectable()
export class PharmacyService {
  private readonly logger = new Logger(PharmacyService.name);

  constructor(private prisma: PrismaService) {}

  // Item Management
  async createItem(tenantId: string, data: CreateItemDto) {
    return this.prisma.item.create({
      data: {
        ...data,
        tenantId,
      },
    });
  }

  async getItems(tenantId: string) {
    return this.prisma.item.findMany({
      where: { tenantId },
      include: { batches: true },
    });
  }

  async getItemById(tenantId: string, id: string) {
    const item = await this.prisma.item.findUnique({
      where: { id, tenantId },
      include: { batches: true },
    });
    if (!item) throw new NotFoundException('Item not found');
    return item;
  }

  async updateItem(tenantId: string, id: string, data: UpdateItemDto) {
    return this.prisma.item.update({
      where: { id, tenantId },
      data,
    });
  }

  async deleteItem(tenantId: string, id: string) {
    return this.prisma.item.delete({
      where: { id, tenantId },
    });
  }

  // Batch Management
  async createBatch(tenantId: string, data: CreateBatchDto) {
    return this.prisma.batch.create({
      data: {
        ...data,
        expDt: new Date(data.expDt),
        mfgDt: data.mfgDt ? new Date(data.mfgDt) : null,
        tenantId,
      },
    });
  }

  async getBatches(tenantId: string) {
    return this.prisma.batch.findMany({
      where: { tenantId },
      include: { item: true, vendor: true },
    });
  }

  async updateBatch(tenantId: string, id: string, data: UpdateBatchDto) {
    return this.prisma.batch.update({
      where: { id, tenantId },
      data: {
        ...data,
        expDt: data.expDt ? new Date(data.expDt) : undefined,
        mfgDt: data.mfgDt ? new Date(data.mfgDt) : undefined,
      },
    });
  }

  async deleteBatch(tenantId: string, id: string) {
    return this.prisma.batch.delete({
      where: { id, tenantId },
    });
  }

  // Vendor Management
  async createVendor(tenantId: string, data: CreateVendorDto) {
    return this.prisma.vendor.create({
      data: { ...data, tenantId },
    });
  }

  async getVendors(tenantId: string) {
    return this.prisma.vendor.findMany({
      where: { tenantId },
    });
  }

  async updateVendor(tenantId: string, id: string, data: UpdateVendorDto) {
    return this.prisma.vendor.update({
      where: { id, tenantId },
      data,
    });
  }

  async deleteVendor(tenantId: string, id: string) {
    return this.prisma.vendor.delete({
      where: { id, tenantId },
    });
  }

  // GRN Management
  async createGrn(tenantId: string, data: CreateGrnDto) {
    return this.prisma.grn.create({
      data: {
        ...data,
        receivedDt: data.receivedDt ? new Date(data.receivedDt) : new Date(),
        tenantId,
      },
    });
  }

  async getGrns(tenantId: string) {
    return this.prisma.grn.findMany({
      where: { tenantId },
      include: { vendor: true },
    });
  }

  async updateGrn(tenantId: string, id: string, data: UpdateGrnDto) {
    return this.prisma.grn.update({
      where: { id, tenantId },
      data: {
        ...data,
        receivedDt: data.receivedDt ? new Date(data.receivedDt) : undefined,
      },
    });
  }

  async deleteGrn(tenantId: string, id: string) {
    return this.prisma.grn.delete({
      where: { id, tenantId },
    });
  }

  // Formulary Management
  async createFormulary(tenantId: string, data: CreateFormularyDto) {
    return this.prisma.formulary.create({
      data: { ...data, tenantId },
    });
  }

  async getFormularies(tenantId: string) {
    return this.prisma.formulary.findMany({
      where: { tenantId },
      include: { items: { include: { item: true } } },
    });
  }

  async updateFormulary(tenantId: string, id: string, data: UpdateFormularyDto) {
    return this.prisma.formulary.update({
      where: { id, tenantId },
      data,
    });
  }

  async deleteFormulary(tenantId: string, id: string) {
    return this.prisma.formulary.delete({
      where: { id, tenantId },
    });
  }

  // FormularyItem Management
  async addItemToFormulary(tenantId: string, data: CreateFormularyItemDto) {
    return this.prisma.formularyItem.create({
      data: { ...data, tenantId },
    });
  }

  async updateFormularyItem(tenantId: string, id: string, data: UpdateFormularyItemDto) {
    return this.prisma.formularyItem.update({
      where: { id, tenantId },
      data,
    });
  }

  async removeFromFormulary(tenantId: string, id: string) {
    return this.prisma.formularyItem.delete({
      where: { id, tenantId },
    });
  }

  // ReorderRule Management
  async createReorderRule(tenantId: string, data: CreateReorderRuleDto) {
    return this.prisma.reorderRule.create({
      data: { ...data, tenantId },
    });
  }

  async getReorderRules(tenantId: string) {
    return this.prisma.reorderRule.findMany({
      where: { tenantId },
      include: { item: true },
    });
  }

  async updateReorderRule(tenantId: string, id: string, data: UpdateReorderRuleDto) {
    return this.prisma.reorderRule.update({
      where: { id, tenantId },
      data,
    });
  }

  async deleteReorderRule(tenantId: string, id: string) {
    return this.prisma.reorderRule.delete({
      where: { id, tenantId },
    });
  }

  // RxFill Management
  async createRxFill(tenantId: string, data: CreateRxFillDto) {
    return this.prisma.rxFill.create({
      data: {
        ...data,
        dispensedAt: data.dispensedAt ? new Date(data.dispensedAt) : null,
        tenantId,
      },
    });
  }

  async getRxFills(tenantId: string) {
    return this.prisma.rxFill.findMany({
      where: { tenantId },
      include: { item: true, batch: true },
    });
  }

  async updateRxFill(tenantId: string, id: string, data: UpdateRxFillDto) {
    return this.prisma.rxFill.update({
      where: { id, tenantId },
      data: {
        ...data,
        dispensedAt: data.dispensedAt ? new Date(data.dispensedAt) : undefined,
      },
    });
  }

  async deleteRxFill(tenantId: string, id: string) {
    return this.prisma.rxFill.delete({
      where: { id, tenantId },
    });
  }

  // Sale Management
  async createSale(tenantId: string, data: CreateSaleDto) {
    return this.prisma.$transaction(async (tx) => {
      const sale = await tx.sale.create({
        data: {
          ...data,
          tenantId,
        },
        include: { items: true },
      });

      // Update inventory
      for (const item of data.items) {
        await tx.inventoryTx.create({
          data: {
            itemId: item.itemId,
            batchId: item.batchId,
            qty: -item.qty,
            reason: InventoryReason.SALE,
            refDoc: sale.id,
            tenantId,
          },
        });
      }

      return sale;
    });
  }

  async getSales(tenantId: string) {
    return this.prisma.sale.findMany({
      where: { tenantId },
      include: { patient: true, items: { include: { item: true } } },
    });
  }

  async updateSale(tenantId: string, id: string, data: UpdateSaleDto) {
    return this.prisma.sale.update({
      where: { id, tenantId },
      data,
    });
  }

  async deleteSale(tenantId: string, id: string) {
    return this.prisma.sale.delete({
      where: { id, tenantId },
    });
  }

  // Return Management
  async createReturn(tenantId: string, data: CreateReturnDto) {
    return this.prisma.$transaction(async (tx) => {
      const return_ = await tx.return.create({
        data: {
          ...data,
          tenantId,
        },
        include: { items: true },
      });

      // Update inventory
      for (const item of data.items) {
        await tx.inventoryTx.create({
          data: {
            itemId: item.itemId,
            batchId: item.batchId,
            qty: item.qty,
            reason: InventoryReason.RETURN,
            refDoc: return_.id,
            tenantId,
          },
        });
      }

      return return_;
    });
  }

  async getReturns(tenantId: string) {
    return this.prisma.return.findMany({
      where: { tenantId },
      include: { sale: true, items: { include: { item: true } } },
    });
  }

  async updateReturn(tenantId: string, id: string, data: UpdateReturnDto) {
    return this.prisma.return.update({
      where: { id, tenantId },
      data,
    });
  }

  async deleteReturn(tenantId: string, id: string) {
    return this.prisma.return.delete({
      where: { id, tenantId },
    });
  }

  // InventoryTx Management
  async createInventoryTx(tenantId: string, data: CreateInventoryTxDto) {
    return this.prisma.inventoryTx.create({
      data: { ...data, tenantId },
    });
  }

  async getInventoryTx(tenantId: string) {
    return this.prisma.inventoryTx.findMany({
      where: { tenantId },
      include: { item: true, batch: true },
    });
  }

  // Workflows and Business Logic

  // Procurement Workflow
  async processProcurement(tenantId: string, grnData: CreateGrnDto, batches: CreateBatchDto[]) {
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

        // Update item quantity
        const item = await tx.item.findUnique({
          where: { id: batch.itemId, tenantId },
        });

        if (item) {
          await tx.item.update({
            where: { id: batch.itemId },
            data: { updatedAt: new Date() },
          });
        }

        // Create inventory transaction
        await tx.inventoryTx.create({
          data: {
            itemId: batch.itemId,
            batchId: batch.batchNo, // Assuming batchNo is used as id for now
            qty: batch.qtyOnHand || 0,
            reason: InventoryReason.PURCHASE,
            refDoc: grn.id,
            tenantId,
          },
        });
      }

      return grn;
    });
  }

  // Stock Control
  async getStockAlerts(tenantId: string) {
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

  // Dispensing Workflow
  async dispensePrescription(tenantId: string, prescriptionId: string, items: Array<{ itemId: string, qty: number, batchId?: string }>) {
    return this.prisma.$transaction(async (tx) => {
      for (const item of items) {
        // Check stock
        const batch = await tx.batch.findUnique({
          where: { id: item.batchId, tenantId },
        });

        if (!batch || batch.qtyOnHand < item.qty) {
          throw new BadRequestException(`Insufficient stock for item ${item.itemId}`);
        }

        // Create RxFill
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

        // Update batch quantity
        await tx.batch.update({
          where: { id: item.batchId },
          data: { qtyOnHand: { decrement: item.qty } },
        });

        // Create inventory transaction
        await tx.inventoryTx.create({
          data: {
            itemId: item.itemId,
            batchId: item.batchId,
            qty: -item.qty,
            reason: InventoryReason.SALE,
            refDoc: prescriptionId,
            tenantId,
          },
        });
      }
    });
  }

  // IPD Issues and Returns
  async issueToIpd(tenantId: string, patientId: string, items: Array<{ itemId: string, qty: number, batchId?: string }>) {
    return this.prisma.$transaction(async (tx) => {
      for (const item of items) {
        // Check stock
        const batch = await tx.batch.findUnique({
          where: { id: item.batchId, tenantId },
        });

        if (!batch || batch.qtyOnHand < item.qty) {
          throw new BadRequestException(`Insufficient stock for item ${item.itemId}`);
        }

        // Create inventory transaction
        await tx.inventoryTx.create({
          data: {
            itemId: item.itemId,
            batchId: item.batchId,
            qty: -item.qty,
            reason: InventoryReason.ADJUSTMENT,
            refDoc: patientId,
            tenantId,
          },
        });

        // Update batch quantity
        await tx.batch.update({
          where: { id: item.batchId },
          data: { qtyOnHand: { decrement: item.qty } },
        });
      }
    });
  }
}


