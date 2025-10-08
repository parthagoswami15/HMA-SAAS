// Mock data for Inventory Management

import {
  InventoryItem,
  Supplier,
  PurchaseOrder,
  InventoryStats,
  ItemCategory
} from '../../types/inventory';

// Simplified types for mock data compatibility
interface SimplifiedInventoryItem {
  id: string;
  itemCode: string;
  name: string;
  category: string;
  description: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  unitPrice: number;
  unitOfMeasure: string;
  supplier: {
    id: string;
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
  };
  location: string;
  expiryDate: string | null;
  batchNumber: string;
  status: string;
  lastUpdated: string;
}

interface StockMovement {
  id: string;
  itemId: string;
  item: SimplifiedInventoryItem;
  movementType: 'in' | 'out' | 'adjustment' | 'transfer';
  quantity: number;
  reason: string;
  date: string;
  performedBy: string;
  referenceNumber: string;
  notes: string;
}

export const mockInventoryItems: SimplifiedInventoryItem[] = [
  {
    id: '1',
    itemCode: 'MED-001',
    name: 'Paracetamol 500mg Tablets',
    category: 'medicines',
    description: 'Pain reliever and fever reducer',
    currentStock: 2500,
    minimumStock: 500,
    maximumStock: 5000,
    unitPrice: 2.5,
    unitOfMeasure: 'tablets',
    supplier: {
      id: '1',
      name: 'PharmaCorp Ltd',
      contactPerson: 'John Smith',
      email: 'john@pharmacorp.com',
      phone: '+91-9876543210'
    },
    location: 'Pharmacy - Rack A1',
    expiryDate: '2025-12-31',
    batchNumber: 'PCM2024001',
    status: 'in_stock',
    lastUpdated: '2024-01-15T10:30:00'
  },
  {
    id: '2',
    itemCode: 'SUR-001',
    name: 'Disposable Syringes 5ml',
    category: 'surgical',
    description: 'Sterile disposable syringes for injections',
    currentStock: 150,
    minimumStock: 200,
    maximumStock: 1000,
    unitPrice: 12.5,
    unitOfMeasure: 'pieces',
    supplier: {
      id: '2',
      name: 'MediSupply Inc',
      contactPerson: 'Sarah Johnson',
      email: 'sarah@medisupply.com',
      phone: '+91-9876543211'
    },
    location: 'Surgery - Cabinet B2',
    expiryDate: '2026-08-15',
    batchNumber: 'SYR2024001',
    status: 'low_stock',
    lastUpdated: '2024-01-14T15:45:00'
  },
  {
    id: '3',
    itemCode: 'LAB-001',
    name: 'Blood Collection Tubes',
    category: 'laboratory_reagents',
    description: 'Vacuum blood collection tubes with EDTA',
    currentStock: 0,
    minimumStock: 100,
    maximumStock: 500,
    unitPrice: 8.75,
    unitOfMeasure: 'pieces',
    supplier: {
      id: '3',
      name: 'LabTech Solutions',
      contactPerson: 'Michael Chen',
      email: 'michael@labtech.com',
      phone: '+91-9876543212'
    },
    location: 'Laboratory - Storage C1',
    expiryDate: '2025-06-30',
    batchNumber: 'BCT2024001',
    status: 'out_of_stock',
    lastUpdated: '2024-01-13T09:20:00'
  },
  {
    id: '4',
    itemCode: 'EQP-001',
    name: 'Digital Thermometer',
    category: 'medical_devices',
    description: 'Digital infrared non-contact thermometer',
    currentStock: 25,
    minimumStock: 10,
    maximumStock: 50,
    unitPrice: 1200,
    unitOfMeasure: 'pieces',
    supplier: {
      id: '4',
      name: 'HealthTech Devices',
      contactPerson: 'Lisa Wang',
      email: 'lisa@healthtech.com',
      phone: '+91-9876543213'
    },
    location: 'Equipment - Room D1',
    expiryDate: null,
    batchNumber: 'DT2024001',
    status: 'in_stock',
    lastUpdated: '2024-01-15T08:15:00'
  }
];

export const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'PharmaCorp Ltd',
    contactPerson: 'John Smith',
    email: 'john@pharmacorp.com',
    phone: '+91-9876543210',
    address: '123 Pharma Street, Mumbai, Maharashtra 400001',
    website: 'https://pharmacorp.com',
    category: 'medicines',
    paymentTerms: '30 days',
    rating: 4.5,
    isActive: true,
    registrationDate: '2020-03-15',
    taxId: 'GST123456789',
    bankDetails: [{
      accountName: 'PharmaCorp Ltd',
      accountNumber: '1234567890',
      bankName: 'HDFC Bank',
      ifscCode: 'HDFC0000123'
    }]
  },
  {
    id: '2',
    name: 'MediSupply Inc',
    contactPerson: 'Sarah Johnson',
    email: 'sarah@medisupply.com',
    phone: '+91-9876543211',
    address: '456 Medical Avenue, Delhi, Delhi 110001',
    website: 'https://medisupply.com',
    category: 'surgical_supplies',
    paymentTerms: '45 days',
    rating: 4.2,
    isActive: true,
    registrationDate: '2019-08-20',
    taxId: 'GST987654321',
    bankDetails: [{
      accountName: 'MediSupply Inc',
      accountNumber: '0987654321',
      bankName: 'ICICI Bank',
      ifscCode: 'ICIC0000456'
    }]
  }
];

export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: '1',
    orderNumber: 'PO-2024-001',
    supplierId: '1',
    supplier: mockSuppliers[0],
    orderDate: '2024-01-10',
    expectedDelivery: '2024-01-20',
    status: 'approved',
    totalAmount: 125000,
    items: [
      {
        itemId: '1',
        itemCode: 'MED-001',
        quantity: 5000,
        unitPrice: 2.5,
        totalPrice: 12500
      },
      {
        itemId: 'MED-002',
        itemCode: 'MED-002',
        quantity: 2500,
        unitPrice: 4.5,
        totalPrice: 11250
      }
    ],
    notes: 'Urgent order for pharmacy stock',
    approvedBy: 'Pharmacy Manager',
    approvedDate: '2024-01-11'
  },
  {
    id: '2',
    orderNumber: 'PO-2024-002',
    supplierId: '2',
    supplier: mockSuppliers[1],
    orderDate: '2024-01-12',
    expectedDelivery: '2024-01-25',
    status: 'received',
    totalAmount: 45000,
    items: [
      {
        itemId: '2',
        itemCode: 'SUR-001',
        quantity: 1000,
        unitPrice: 12.5,
        totalPrice: 12500
      },
      {
        itemId: 'SUR-002',
        itemCode: 'SUR-002',
        quantity: 500,
        unitPrice: 25,
        totalPrice: 12500
      }
    ],
    notes: 'Monthly surgical supplies order',
    approvedBy: 'Surgery Head',
    approvedDate: '2024-01-13',
    receivedDate: '2024-01-24'
  }
];

export const mockStockMovements: StockMovement[] = [
  {
    id: '1',
    itemId: '1',
    item: mockInventoryItems[0],
    movementType: 'in',
    quantity: 1000,
    reason: 'Purchase Order PO-2024-001',
    date: '2024-01-15T10:30:00',
    performedBy: 'Pharmacy Staff',
    referenceNumber: 'PO-2024-001',
    notes: 'Stock received from supplier'
  },
  {
    id: '2',
    itemId: '2',
    item: mockInventoryItems[1],
    movementType: 'out',
    quantity: 50,
    reason: 'Surgery Department Request',
    date: '2024-01-14T14:20:00',
    performedBy: 'Surgery Nurse',
    referenceNumber: 'REQ-2024-005',
    notes: 'Used for emergency surgeries'
  },
  {
    id: '3',
    itemId: '1',
    item: mockInventoryItems[0],
    movementType: 'out',
    quantity: 100,
    reason: 'Patient Dispensing',
    date: '2024-01-13T16:45:00',
    performedBy: 'Pharmacist',
    referenceNumber: 'DISP-2024-012',
    notes: 'Dispensed to patients'
  }
];

export const mockInventoryStats: InventoryStats = {
  totalItems: 1250,
  totalValue: 3750000,
  lowStockItems: 25,
  outOfStockItems: 8,
  expiringItems: 15,
  totalSuppliers: 45,
  activeOrders: 12,
  monthlyConsumption: [
    { month: 'Oct', consumption: 145000, value: 120000 },
    { month: 'Nov', consumption: 160000, value: 135000 },
    { month: 'Dec', consumption: 180000, value: 155000 },
    { month: 'Jan', consumption: 195000, value: 170000 }
  ],
  itemsByCategory: {
    medicines: 450,
    surgical_supplies: 320,
    laboratory_reagents: 280,
    medical_devices: 150,
    diagnostic_supplies: 100,
    patient_care_supplies: 80,
    office_stationery: 50,
    cleaning_supplies: 40,
    kitchen_supplies: 30,
    linen: 20,
    furniture: 10,
    equipment_parts: 5
  },
  stockStatus: [
    { status: 'in_stock', count: 1050, percentage: 84.0 },
    { status: 'low_stock', count: 150, percentage: 12.0 },
    { status: 'out_of_stock', count: 50, percentage: 4.0 }
  ],
  monthlyMovements: [
    { month: 'Oct', inward: 145000, outward: 120000 },
    { month: 'Nov', inward: 160000, outward: 135000 },
    { month: 'Dec', inward: 180000, outward: 155000 },
    { month: 'Jan', inward: 195000, outward: 170000 }
  ],
  topConsumingItems: [
    { itemName: 'Paracetamol 500mg', quantity: 1500, value: 3750 },
    { itemName: 'Disposable Syringes', quantity: 800, value: 10000 },
    { itemName: 'Surgical Gloves', quantity: 600, value: 15000 },
    { itemName: 'Blood Collection Tubes', quantity: 400, value: 3500 },
    { itemName: 'Gauze Bandages', quantity: 350, value: 2625 }
  ],
  orderTrends: {
    totalOrders: 145,
    completedOrders: 128,
    pendingOrders: 12,
    cancelledOrders: 5,
    averageOrderValue: 85000,
    averageDeliveryTime: 8 // days
  }
};

// Mock Equipment
export const mockEquipment = [
  { id: '1', name: 'X-Ray Machine', status: 'operational', location: 'Radiology' },
  { id: '2', name: 'MRI Scanner', status: 'operational', location: 'Imaging' },
  { id: '3', name: 'Ultrasound', status: 'maintenance', location: 'OB/GYN' },
  { id: '4', name: 'ECG Machine', status: 'operational', location: 'Cardiology' },
];

// Mock Inventory Alerts
export const mockInventoryAlerts = [
  { id: '1', type: 'low_stock', itemName: 'Paracetamol 500mg', currentStock: 50, threshold: 100, severity: 'warning' },
  { id: '2', type: 'expiring_soon', itemName: 'Insulin Vials', expiryDate: '2024-02-15', daysUntilExpiry: 15, severity: 'critical' },
  { id: '3', type: 'out_of_stock', itemName: 'Surgical Masks', currentStock: 0, severity: 'critical' },
  { id: '4', type: 'low_stock', itemName: 'Disposable Syringes', currentStock: 75, threshold: 200, severity: 'warning' },
];

// Mock Stock Transactions (stub for missing export)
export const mockStockTransactions = mockStockMovements;

// Mock Requisitions (stub for missing export)
export const mockRequisitions: any[] = [];

// Mock Maintenance Records (stub for missing export)
export const mockMaintenanceRecords: any[] = [];