/**
 * Inventory API Service
 * Handles all inventory-related API operations
 */

import apiClient from './api-client';
import { 
  InventoryItem, 
  ItemCategory, 
  ItemStatus, 
  PurchaseOrder, 
  OrderStatus,
  Equipment,
  EquipmentStatus,
  StockTransaction
} from '../types/inventory';

export interface CreateInventoryItemDto {
  itemName: string;
  itemCode: string;
  category: ItemCategory;
  description?: string;
  unitOfMeasure: string;
  unitPrice: number;
  reorderLevel: number;
  reorderQuantity: number;
  supplierId?: string;
  storageLocation?: string;
  expiryDate?: string;
}

export interface UpdateInventoryItemDto {
  itemName?: string;
  itemCode?: string;
  category?: ItemCategory;
  description?: string;
  unitOfMeasure?: string;
  unitPrice?: number;
  reorderLevel?: number;
  reorderQuantity?: number;
  supplierId?: string;
  storageLocation?: string;
  status?: ItemStatus;
}

export interface InventoryFilters {
  category?: ItemCategory;
  status?: ItemStatus;
  supplierId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreatePurchaseOrderDto {
  supplierId: string;
  orderDate: string;
  expectedDeliveryDate?: string;
  items: Array<{
    itemId: string;
    quantity: number;
    unitPrice: number;
  }>;
  notes?: string;
}

export interface UpdatePurchaseOrderDto {
  status?: OrderStatus;
  expectedDeliveryDate?: string;
  deliveryDate?: string;
  notes?: string;
}

export interface PurchaseOrderFilters {
  supplierId?: string;
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateEquipmentDto {
  equipmentName: string;
  category: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  purchasePrice: number;
  warrantyExpiryDate?: string;
  location?: string;
  department?: string;
}

export interface UpdateEquipmentDto {
  equipmentName?: string;
  category?: string;
  location?: string;
  department?: string;
  status?: EquipmentStatus;
  notes?: string;
}

export interface EquipmentFilters {
  category?: string;
  status?: EquipmentStatus;
  department?: string;
  search?: string;
  page?: number;
  limit?: number;
}

class InventoryService {
  private baseUrl = '/inventory';
  private equipmentUrl = '/equipment';
  private purchaseOrdersUrl = '/purchase-orders';

  // ============ Inventory Items ============
  
  /**
   * Get all inventory items with optional filters
   */
  async getInventoryItems(filters?: InventoryFilters) {
    const params = new URLSearchParams();
    
    if (filters?.category) params.append('category', filters.category);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.supplierId) params.append('supplierId', filters.supplierId);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;
    
    return apiClient.get<{ data: InventoryItem[]; total: number; page: number; limit: number }>(url);
  }

  /**
   * Get a single inventory item by ID
   */
  async getInventoryItemById(id: string) {
    return apiClient.get<InventoryItem>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create a new inventory item
   */
  async createInventoryItem(data: CreateInventoryItemDto) {
    return apiClient.post<InventoryItem>(this.baseUrl, data);
  }

  /**
   * Update an existing inventory item
   */
  async updateInventoryItem(id: string, data: UpdateInventoryItemDto) {
    return apiClient.put<InventoryItem>(`${this.baseUrl}/${id}`, data);
  }

  /**
   * Delete an inventory item
   */
  async deleteInventoryItem(id: string) {
    return apiClient.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * Adjust stock quantity
   */
  async adjustStock(id: string, quantity: number, reason: string) {
    return apiClient.post<InventoryItem>(`${this.baseUrl}/${id}/adjust-stock`, { 
      quantity, 
      reason 
    });
  }

  /**
   * Get stock transactions
   */
  async getStockTransactions(itemId?: string) {
    const url = itemId ? `${this.baseUrl}/transactions?itemId=${itemId}` : `${this.baseUrl}/transactions`;
    return apiClient.get<{ data: StockTransaction[] }>(url);
  }

  /**
   * Get inventory statistics
   */
  async getInventoryStats() {
    return apiClient.get<any>(`${this.baseUrl}/stats`);
  }

  /**
   * Get low stock alerts
   */
  async getLowStockAlerts() {
    return apiClient.get<{ data: InventoryItem[] }>(`${this.baseUrl}/alerts/low-stock`);
  }

  // ============ Purchase Orders ============

  /**
   * Get all purchase orders with optional filters
   */
  async getPurchaseOrders(filters?: PurchaseOrderFilters) {
    const params = new URLSearchParams();
    
    if (filters?.supplierId) params.append('supplierId', filters.supplierId);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const url = queryString ? `${this.purchaseOrdersUrl}?${queryString}` : this.purchaseOrdersUrl;
    
    return apiClient.get<{ data: PurchaseOrder[]; total: number; page: number; limit: number }>(url);
  }

  /**
   * Get a single purchase order by ID
   */
  async getPurchaseOrderById(id: string) {
    return apiClient.get<PurchaseOrder>(`${this.purchaseOrdersUrl}/${id}`);
  }

  /**
   * Create a new purchase order
   */
  async createPurchaseOrder(data: CreatePurchaseOrderDto) {
    return apiClient.post<PurchaseOrder>(this.purchaseOrdersUrl, data);
  }

  /**
   * Update an existing purchase order
   */
  async updatePurchaseOrder(id: string, data: UpdatePurchaseOrderDto) {
    return apiClient.put<PurchaseOrder>(`${this.purchaseOrdersUrl}/${id}`, data);
  }

  /**
   * Delete a purchase order
   */
  async deletePurchaseOrder(id: string) {
    return apiClient.delete<void>(`${this.purchaseOrdersUrl}/${id}`);
  }

  /**
   * Receive purchase order
   */
  async receivePurchaseOrder(id: string, receivedItems: Array<{ itemId: string; receivedQuantity: number }>) {
    return apiClient.post<PurchaseOrder>(`${this.purchaseOrdersUrl}/${id}/receive`, { 
      receivedItems 
    });
  }

  // ============ Equipment ============

  /**
   * Get all equipment with optional filters
   */
  async getEquipment(filters?: EquipmentFilters) {
    const params = new URLSearchParams();
    
    if (filters?.category) params.append('category', filters.category);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.department) params.append('department', filters.department);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const url = queryString ? `${this.equipmentUrl}?${queryString}` : this.equipmentUrl;
    
    return apiClient.get<{ data: Equipment[]; total: number; page: number; limit: number }>(url);
  }

  /**
   * Get a single equipment by ID
   */
  async getEquipmentById(id: string) {
    return apiClient.get<Equipment>(`${this.equipmentUrl}/${id}`);
  }

  /**
   * Create new equipment
   */
  async createEquipment(data: CreateEquipmentDto) {
    return apiClient.post<Equipment>(this.equipmentUrl, data);
  }

  /**
   * Update existing equipment
   */
  async updateEquipment(id: string, data: UpdateEquipmentDto) {
    return apiClient.put<Equipment>(`${this.equipmentUrl}/${id}`, data);
  }

  /**
   * Delete equipment
   */
  async deleteEquipment(id: string) {
    return apiClient.delete<void>(`${this.equipmentUrl}/${id}`);
  }

  /**
   * Schedule equipment maintenance
   */
  async scheduleMaintenanceFor(id: string, maintenanceData: any) {
    return apiClient.post<any>(`${this.equipmentUrl}/${id}/maintenance`, maintenanceData);
  }
}

const inventoryService = new InventoryService();
export default inventoryService;
