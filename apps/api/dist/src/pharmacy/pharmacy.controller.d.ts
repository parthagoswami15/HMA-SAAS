import { PharmacyService } from './pharmacy.service';
import { CreateItemDto, UpdateItemDto, CreateBatchDto, UpdateBatchDto, CreateVendorDto, UpdateVendorDto, CreateGrnDto, UpdateGrnDto, CreateFormularyDto, UpdateFormularyDto, CreateFormularyItemDto, UpdateFormularyItemDto, CreateReorderRuleDto, UpdateReorderRuleDto, CreateRxFillDto, UpdateRxFillDto, CreateSaleDto, UpdateSaleDto, CreateReturnDto, UpdateReturnDto, CreateInventoryTxDto } from './dto/pharmacy.dto';
export declare class PharmacyController {
    private svc;
    constructor(svc: PharmacyService);
    createItem(tenantId: string, dto: CreateItemDto): Promise<any>;
    getItems(tenantId: string): Promise<any>;
    getItem(tenantId: string, id: string): Promise<any>;
    updateItem(tenantId: string, id: string, dto: UpdateItemDto): Promise<any>;
    deleteItem(tenantId: string, id: string): Promise<any>;
    createBatch(tenantId: string, dto: CreateBatchDto): Promise<any>;
    getBatches(tenantId: string): Promise<any>;
    updateBatch(tenantId: string, id: string, dto: UpdateBatchDto): Promise<any>;
    deleteBatch(tenantId: string, id: string): Promise<any>;
    createVendor(tenantId: string, dto: CreateVendorDto): Promise<any>;
    getVendors(tenantId: string): Promise<any>;
    updateVendor(tenantId: string, id: string, dto: UpdateVendorDto): Promise<any>;
    deleteVendor(tenantId: string, id: string): Promise<any>;
    createGrn(tenantId: string, dto: CreateGrnDto): Promise<any>;
    getGrns(tenantId: string): Promise<any>;
    updateGrn(tenantId: string, id: string, dto: UpdateGrnDto): Promise<any>;
    deleteGrn(tenantId: string, id: string): Promise<any>;
    createFormulary(tenantId: string, dto: CreateFormularyDto): Promise<any>;
    getFormularies(tenantId: string): Promise<any>;
    updateFormulary(tenantId: string, id: string, dto: UpdateFormularyDto): Promise<any>;
    deleteFormulary(tenantId: string, id: string): Promise<any>;
    addItemToFormulary(tenantId: string, dto: CreateFormularyItemDto): Promise<any>;
    updateFormularyItem(tenantId: string, id: string, dto: UpdateFormularyItemDto): Promise<any>;
    removeFromFormulary(tenantId: string, id: string): Promise<any>;
    createReorderRule(tenantId: string, dto: CreateReorderRuleDto): Promise<any>;
    getReorderRules(tenantId: string): Promise<any>;
    updateReorderRule(tenantId: string, id: string, dto: UpdateReorderRuleDto): Promise<any>;
    deleteReorderRule(tenantId: string, id: string): Promise<any>;
    createRxFill(tenantId: string, dto: CreateRxFillDto): Promise<any>;
    getRxFills(tenantId: string): Promise<any>;
    updateRxFill(tenantId: string, id: string, dto: UpdateRxFillDto): Promise<any>;
    deleteRxFill(tenantId: string, id: string): Promise<any>;
    createSale(tenantId: string, dto: CreateSaleDto): Promise<any>;
    getSales(tenantId: string): Promise<any>;
    updateSale(tenantId: string, id: string, dto: UpdateSaleDto): Promise<any>;
    deleteSale(tenantId: string, id: string): Promise<any>;
    createReturn(tenantId: string, dto: CreateReturnDto): Promise<any>;
    getReturns(tenantId: string): Promise<any>;
    updateReturn(tenantId: string, id: string, dto: UpdateReturnDto): Promise<any>;
    deleteReturn(tenantId: string, id: string): Promise<any>;
    createInventoryTx(tenantId: string, dto: CreateInventoryTxDto): Promise<any>;
    getInventoryTx(tenantId: string): Promise<any>;
    processProcurement(tenantId: string, { grnData, batches }: {
        grnData: CreateGrnDto;
        batches: CreateBatchDto[];
    }): Promise<any>;
    getStockAlerts(tenantId: string): Promise<any>;
    dispensePrescription(tenantId: string, { prescriptionId, items }: {
        prescriptionId: string;
        items: Array<{
            itemId: string;
            qty: number;
            batchId?: string;
        }>;
    }): Promise<any>;
    issueToIpd(tenantId: string, { patientId, items }: {
        patientId: string;
        items: Array<{
            itemId: string;
            qty: number;
            batchId?: string;
        }>;
    }): Promise<any>;
}
