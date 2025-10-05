'use client';
import Layout from '../components/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import React, { useState } from 'react';

interface InventoryItem {
  id: string;
  itemCode: string;
  name: string;
  description: string;
  category: 'MEDICATION' | 'MEDICAL_DEVICE' | 'SURGICAL_SUPPLIES' | 'CONSUMABLES' | 'EQUIPMENT' | 'LABORATORY' | 'OTHER';
  subcategory: string;
  manufacturer: string;
  supplier: string;
  unitOfMeasure: string;
  currentStock: number;
  minStockLevel: number;
  maxStockLevel: number;
  reorderPoint: number;
  reorderQuantity: number;
  unitCost: number;
  totalValue: number;
  location: string;
  storageConditions: string;
  expiryDate?: string;
  batchNumber?: string;
  status: 'ACTIVE' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'EXPIRED' | 'DISCONTINUED';
  lastRestocked: string;
  lastUsed: string;
  usageRate: number; // per day
  leadTime: number; // days
  isControlled: boolean;
  requiresPrescription: boolean;
  notes: string;
}

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplier: string;
  orderDate: string;
  expectedDate: string;
  deliveryDate?: string;
  status: 'PENDING' | 'APPROVED' | 'ORDERED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  items: PurchaseOrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  createdBy: string;
  approvedBy?: string;
  notes: string;
}

interface PurchaseOrderItem {
  itemId: string;
  itemName: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

interface StockMovement {
  id: string;
  itemId: string;
  itemName: string;
  type: 'RECEIPT' | 'ISSUE' | 'TRANSFER' | 'ADJUSTMENT' | 'EXPIRED' | 'DAMAGED';
  quantity: number;
  previousStock: number;
  newStock: number;
  reference: string;
  location: string;
  department?: string;
  userId: string;
  userName: string;
  timestamp: string;
  notes: string;
}

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  paymentTerms: string;
  deliveryTime: number;
  rating: number;
  isActive: boolean;
  categories: string[];
}

const InventoryPage = () => {
  const [currentTab, setCurrentTab] = useState<'inventory' | 'orders' | 'movements' | 'suppliers' | 'analytics' | 'alerts'>('inventory');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [locationFilter, setLocationFilter] = useState('ALL');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showNewItemModal, setShowNewItemModal] = useState(false);

  const mockInventoryItems: InventoryItem[] = [
    {
      id: '1',
      itemCode: 'MED-001',
      name: 'Amoxicillin 500mg',
      description: 'Antibiotic medication for bacterial infections',
      category: 'MEDICATION',
      subcategory: 'Antibiotics',
      manufacturer: 'Pfizer Inc.',
      supplier: 'MedSupply Corp',
      unitOfMeasure: 'Tablets',
      currentStock: 150,
      minStockLevel: 50,
      maxStockLevel: 500,
      reorderPoint: 75,
      reorderQuantity: 200,
      unitCost: 2.50,
      totalValue: 375.00,
      location: 'Pharmacy - A1',
      storageConditions: 'Room temperature, dry place',
      expiryDate: '2025-06-30',
      batchNumber: 'AMX-2024-001',
      status: 'ACTIVE',
      lastRestocked: '2024-11-15T09:00:00',
      lastUsed: '2024-12-04T14:30:00',
      usageRate: 5.2,
      leadTime: 7,
      isControlled: false,
      requiresPrescription: true,
      notes: 'Monitor expiry dates closely'
    },
    {
      id: '2',
      itemCode: 'DEV-002',
      name: 'Digital Thermometer',
      description: 'Non-contact infrared digital thermometer',
      category: 'MEDICAL_DEVICE',
      subcategory: 'Diagnostic Equipment',
      manufacturer: 'MedTech Solutions',
      supplier: 'Healthcare Supplies Ltd',
      unitOfMeasure: 'Units',
      currentStock: 12,
      minStockLevel: 5,
      maxStockLevel: 25,
      reorderPoint: 8,
      reorderQuantity: 10,
      unitCost: 45.00,
      totalValue: 540.00,
      location: 'Equipment Room - B2',
      storageConditions: 'Room temperature',
      status: 'ACTIVE',
      lastRestocked: '2024-10-20T11:00:00',
      lastUsed: '2024-12-05T08:15:00',
      usageRate: 0.3,
      leadTime: 14,
      isControlled: false,
      requiresPrescription: false,
      notes: 'Calibration required every 6 months'
    },
    {
      id: '3',
      itemCode: 'SUR-003',
      name: 'Surgical Gloves - Size L',
      description: 'Sterile latex surgical gloves, powder-free',
      category: 'SURGICAL_SUPPLIES',
      subcategory: 'Personal Protective Equipment',
      manufacturer: 'SafeGuard Medical',
      supplier: 'SurgiSupply Inc',
      unitOfMeasure: 'Pairs',
      currentStock: 25,
      minStockLevel: 100,
      maxStockLevel: 1000,
      reorderPoint: 150,
      reorderQuantity: 500,
      unitCost: 0.75,
      totalValue: 18.75,
      location: 'OR Storage - C1',
      storageConditions: 'Cool, dry environment',
      expiryDate: '2026-03-15',
      batchNumber: 'SG-L-2024-042',
      status: 'LOW_STOCK',
      lastRestocked: '2024-09-10T14:00:00',
      lastUsed: '2024-12-05T16:45:00',
      usageRate: 15.8,
      leadTime: 5,
      isControlled: false,
      requiresPrescription: false,
      notes: 'Critical item - maintain adequate stock'
    },
    {
      id: '4',
      itemCode: 'CON-004',
      name: 'Disposable Syringes 10ml',
      description: 'Sterile disposable syringes with needles',
      category: 'CONSUMABLES',
      subcategory: 'Injection Equipment',
      manufacturer: 'Needle Tech',
      supplier: 'Medical Consumables Co',
      unitOfMeasure: 'Units',
      currentStock: 0,
      minStockLevel: 200,
      maxStockLevel: 2000,
      reorderPoint: 300,
      reorderQuantity: 1000,
      unitCost: 0.35,
      totalValue: 0.00,
      location: 'Nursing Station - D1',
      storageConditions: 'Room temperature, sterile environment',
      expiryDate: '2025-12-31',
      batchNumber: 'NT-10ML-2024-156',
      status: 'OUT_OF_STOCK',
      lastRestocked: '2024-11-01T10:30:00',
      lastUsed: '2024-12-05T17:20:00',
      usageRate: 8.5,
      leadTime: 3,
      isControlled: false,
      requiresPrescription: false,
      notes: 'URGENT: Out of stock - emergency order placed'
    },
    {
      id: '5',
      itemCode: 'LAB-005',
      name: 'Blood Collection Tubes',
      description: 'EDTA blood collection tubes for hematology',
      category: 'LABORATORY',
      subcategory: 'Sample Collection',
      manufacturer: 'LabTech Industries',
      supplier: 'Lab Supply Express',
      unitOfMeasure: 'Tubes',
      currentStock: 345,
      minStockLevel: 100,
      maxStockLevel: 1000,
      reorderPoint: 200,
      reorderQuantity: 500,
      unitCost: 0.85,
      totalValue: 293.25,
      location: 'Laboratory - E1',
      storageConditions: 'Room temperature',
      expiryDate: '2025-08-20',
      batchNumber: 'LT-EDTA-2024-089',
      status: 'ACTIVE',
      lastRestocked: '2024-11-28T13:15:00',
      lastUsed: '2024-12-05T11:30:00',
      usageRate: 12.3,
      leadTime: 10,
      isControlled: false,
      requiresPrescription: false,
      notes: 'Regular usage item'
    },
    {
      id: '6',
      itemCode: 'MED-006',
      name: 'Morphine 10mg/ml',
      description: 'Injectable morphine for pain management',
      category: 'MEDICATION',
      subcategory: 'Controlled Substances',
      manufacturer: 'PharmaCore',
      supplier: 'Controlled Med Supply',
      unitOfMeasure: 'Vials',
      currentStock: 28,
      minStockLevel: 10,
      maxStockLevel: 50,
      reorderPoint: 15,
      reorderQuantity: 25,
      unitCost: 12.50,
      totalValue: 350.00,
      location: 'Secure Storage - F1',
      storageConditions: 'Controlled temperature, secure cabinet',
      expiryDate: '2025-04-10',
      batchNumber: 'PC-MOR-2024-023',
      status: 'ACTIVE',
      lastRestocked: '2024-11-05T09:45:00',
      lastUsed: '2024-12-03T22:10:00',
      usageRate: 1.8,
      leadTime: 21,
      isControlled: true,
      requiresPrescription: true,
      notes: 'Controlled substance - strict tracking required'
    }
  ];

  const mockPurchaseOrders: PurchaseOrder[] = [
    {
      id: '1',
      orderNumber: 'PO-2024-001',
      supplier: 'MedSupply Corp',
      orderDate: '2024-12-01T10:00:00',
      expectedDate: '2024-12-08T00:00:00',
      status: 'ORDERED',
      items: [
        {
          itemId: '1',
          itemName: 'Amoxicillin 500mg',
          quantity: 200,
          unitCost: 2.50,
          totalCost: 500.00
        }
      ],
      subtotal: 500.00,
      tax: 50.00,
      shipping: 25.00,
      total: 575.00,
      createdBy: 'John Smith',
      approvedBy: 'Dr. Sarah Mitchell',
      notes: 'Regular restocking order'
    },
    {
      id: '2',
      orderNumber: 'PO-2024-002',
      supplier: 'Medical Consumables Co',
      orderDate: '2024-12-05T15:30:00',
      expectedDate: '2024-12-08T00:00:00',
      status: 'PENDING',
      items: [
        {
          itemId: '4',
          itemName: 'Disposable Syringes 10ml',
          quantity: 1000,
          unitCost: 0.35,
          totalCost: 350.00
        }
      ],
      subtotal: 350.00,
      tax: 35.00,
      shipping: 15.00,
      total: 400.00,
      createdBy: 'Lisa Rodriguez',
      notes: 'URGENT: Emergency stock replenishment'
    }
  ];

  const mockStockMovements: StockMovement[] = [
    {
      id: '1',
      itemId: '3',
      itemName: 'Surgical Gloves - Size L',
      type: 'ISSUE',
      quantity: -50,
      previousStock: 75,
      newStock: 25,
      reference: 'OR-REQ-001',
      location: 'OR Storage - C1',
      department: 'Operating Room',
      userId: 'N001',
      userName: 'Nurse Jane',
      timestamp: '2024-12-05T16:45:00',
      notes: 'Emergency surgery supplies'
    },
    {
      id: '2',
      itemId: '5',
      itemName: 'Blood Collection Tubes',
      type: 'RECEIPT',
      quantity: 500,
      previousStock: 345,
      newStock: 845,
      reference: 'PO-2024-003',
      location: 'Laboratory - E1',
      userId: 'L001',
      userName: 'Lab Tech Mike',
      timestamp: '2024-11-28T13:15:00',
      notes: 'Regular restocking from purchase order'
    }
  ];

  const filteredItems = mockInventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchesLocation = locationFilter === 'ALL' || item.location.includes(locationFilter);
    
    return matchesSearch && matchesCategory && matchesStatus && matchesLocation;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      'ACTIVE': '#10b981',
      'LOW_STOCK': '#f59e0b',
      'OUT_OF_STOCK': '#ef4444',
      'EXPIRED': '#dc2626',
      'DISCONTINUED': '#6b7280'
    };
    return colors[status as keyof typeof colors] || '#6b7280';
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      'MEDICATION': '💊',
      'MEDICAL_DEVICE': '🩺',
      'SURGICAL_SUPPLIES': '🔧',
      'CONSUMABLES': '📦',
      'EQUIPMENT': '⚕️',
      'LABORATORY': '🧪',
      'OTHER': '📋'
    };
    return icons[category as keyof typeof icons] || '📋';
  };

  const ItemModal = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '2rem',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
            Item Details
          </h2>
          <button
            onClick={() => setShowItemModal(false)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            ×
          </button>
        </div>

        {selectedItem && (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {/* Basic Info */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>{getCategoryIcon(selectedItem.category)}</span>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                    {selectedItem.name}
                  </h3>
                  <p style={{ color: '#6b7280', margin: 0 }}>
                    {selectedItem.itemCode} • {selectedItem.description}
                  </p>
                </div>
                <span style={{
                  marginLeft: 'auto',
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: 'white',
                  backgroundColor: getStatusColor(selectedItem.status)
                }}>
                  {selectedItem.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Stock Information */}
            <div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                Stock Information
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <span style={{ fontWeight: '600' }}>Current Stock:</span>
                  <span style={{ 
                    marginLeft: '0.5rem',
                    fontSize: '1.125rem',
                    fontWeight: 'bold',
                    color: selectedItem.currentStock <= selectedItem.reorderPoint ? '#ef4444' : '#10b981'
                  }}>
                    {selectedItem.currentStock} {selectedItem.unitOfMeasure}
                  </span>
                </div>
                <div><span style={{ fontWeight: '600' }}>Min Level:</span> {selectedItem.minStockLevel} {selectedItem.unitOfMeasure}</div>
                <div><span style={{ fontWeight: '600' }}>Max Level:</span> {selectedItem.maxStockLevel} {selectedItem.unitOfMeasure}</div>
                <div><span style={{ fontWeight: '600' }}>Reorder Point:</span> {selectedItem.reorderPoint} {selectedItem.unitOfMeasure}</div>
                <div><span style={{ fontWeight: '600' }}>Unit Cost:</span> ${selectedItem.unitCost.toFixed(2)}</div>
                <div><span style={{ fontWeight: '600' }}>Total Value:</span> ${selectedItem.totalValue.toFixed(2)}</div>
              </div>
            </div>

            {/* Location & Storage */}
            <div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                Location & Storage
              </h4>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <div><span style={{ fontWeight: '600' }}>Location:</span> {selectedItem.location}</div>
                <div><span style={{ fontWeight: '600' }}>Storage Conditions:</span> {selectedItem.storageConditions}</div>
                {selectedItem.expiryDate && (
                  <div><span style={{ fontWeight: '600' }}>Expiry Date:</span> {new Date(selectedItem.expiryDate).toLocaleDateString()}</div>
                )}
                {selectedItem.batchNumber && (
                  <div><span style={{ fontWeight: '600' }}>Batch Number:</span> {selectedItem.batchNumber}</div>
                )}
              </div>
            </div>

            {/* Supplier & Manufacturing */}
            <div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                Supplier & Manufacturing
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                <div><span style={{ fontWeight: '600' }}>Manufacturer:</span> {selectedItem.manufacturer}</div>
                <div><span style={{ fontWeight: '600' }}>Supplier:</span> {selectedItem.supplier}</div>
                <div><span style={{ fontWeight: '600' }}>Lead Time:</span> {selectedItem.leadTime} days</div>
                <div><span style={{ fontWeight: '600' }}>Usage Rate:</span> {selectedItem.usageRate}/day</div>
              </div>
            </div>

            {/* Usage Information */}
            <div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                Usage Information
              </h4>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <div><span style={{ fontWeight: '600' }}>Last Restocked:</span> {new Date(selectedItem.lastRestocked).toLocaleString()}</div>
                <div><span style={{ fontWeight: '600' }}>Last Used:</span> {new Date(selectedItem.lastUsed).toLocaleString()}</div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {selectedItem.isControlled && (
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#fef2f2',
                      color: '#dc2626',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      CONTROLLED
                    </span>
                  )}
                  {selectedItem.requiresPrescription && (
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#fef3c7',
                      color: '#92400e',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      PRESCRIPTION REQUIRED
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Notes */}
            {selectedItem.notes && (
              <div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                  Notes
                </h4>
                <p style={{
                  padding: '1rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  margin: 0
                }}>
                  {selectedItem.notes}
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
              <Button variant="primary">
                📝 Edit Item
              </Button>
              <Button variant="outline">
                📦 Create Order
              </Button>
              <Button variant="secondary" onClick={() => setShowItemModal(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Layout>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2rem' 
        }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
              Inventory Management
            </h1>
            <p style={{ color: '#6b7280', fontSize: '1rem' }}>
              Manage medical supplies, equipment, and medication inventory
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="primary" onClick={() => setShowNewItemModal(true)}>
              ➕ Add Item
            </Button>
            <Button variant="outline">
              📊 Reports
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <Card>
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ fontSize: '2rem', color: '#10b981', marginBottom: '0.5rem' }}>📦</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                {mockInventoryItems.length}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Items</div>
            </div>
          </Card>
          <Card>
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ fontSize: '2rem', color: '#f59e0b', marginBottom: '0.5rem' }}>⚠️</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                {mockInventoryItems.filter(item => item.status === 'LOW_STOCK').length}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Low Stock</div>
            </div>
          </Card>
          <Card>
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ fontSize: '2rem', color: '#ef4444', marginBottom: '0.5rem' }}>🚫</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                {mockInventoryItems.filter(item => item.status === 'OUT_OF_STOCK').length}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Out of Stock</div>
            </div>
          </Card>
          <Card>
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ fontSize: '2rem', color: '#3b82f6', marginBottom: '0.5rem' }}>💰</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                ${mockInventoryItems.reduce((sum, item) => sum + item.totalValue, 0).toLocaleString()}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Value</div>
            </div>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>
            {[
              { key: 'inventory', label: '📦 Inventory', desc: 'Stock Items' },
              { key: 'orders', label: '📋 Orders', desc: 'Purchase Orders' },
              { key: 'movements', label: '📈 Movements', desc: 'Stock Activity' },
              { key: 'suppliers', label: '🏪 Suppliers', desc: 'Vendor Management' },
              { key: 'analytics', label: '📊 Analytics', desc: 'Inventory Reports' },
              { key: 'alerts', label: '🚨 Alerts', desc: 'Stock Alerts' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setCurrentTab(tab.key as string)}
                style={{
                  padding: '1rem 1.5rem',
                  border: 'none',
                  background: 'none',
                  fontSize: '1rem',
                  fontWeight: '500',
                  color: currentTab === tab.key ? '#667eea' : '#6b7280',
                  borderBottom: currentTab === tab.key ? '2px solid #667eea' : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div>{tab.label}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                  {tab.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Inventory Tab */}
        {currentTab === 'inventory' && (
          <>
            {/* Search and Filters */}
            <Card style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '250px' }}>
                  <Input
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  style={{
                    padding: '0.75rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    backgroundColor: 'white',
                    minWidth: '150px'
                  }}
                >
                  <option value="ALL">All Categories</option>
                  <option value="MEDICATION">Medication</option>
                  <option value="MEDICAL_DEVICE">Medical Device</option>
                  <option value="SURGICAL_SUPPLIES">Surgical Supplies</option>
                  <option value="CONSUMABLES">Consumables</option>
                  <option value="EQUIPMENT">Equipment</option>
                  <option value="LABORATORY">Laboratory</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    padding: '0.75rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    backgroundColor: 'white',
                    minWidth: '120px'
                  }}
                >
                  <option value="ALL">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="LOW_STOCK">Low Stock</option>
                  <option value="OUT_OF_STOCK">Out of Stock</option>
                  <option value="EXPIRED">Expired</option>
                </select>

                <Button variant="outline">
                  🔄 Refresh
                </Button>
              </div>
            </Card>

            {/* Items List */}
            <div style={{ display: 'grid', gap: '1rem' }}>
              {filteredItems.map(item => (
                <Card key={item.id} style={{
                  cursor: 'pointer',
                  border: item.status === 'LOW_STOCK' ? '2px solid #f59e0b' : 
                         item.status === 'OUT_OF_STOCK' ? '2px solid #ef4444' : '1px solid #e5e7eb'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, display: 'flex', gap: '1rem' }}>
                      <span style={{ fontSize: '2rem', marginTop: '0.25rem' }}>
                        {getCategoryIcon(item.category)}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                            {item.name}
                          </h3>
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: 'white',
                            backgroundColor: getStatusColor(item.status)
                          }}>
                            {item.status.replace('_', ' ')}
                          </span>
                          {item.isControlled && (
                            <span style={{
                              padding: '0.125rem 0.5rem',
                              borderRadius: '4px',
                              fontSize: '0.625rem',
                              fontWeight: '600',
                              color: '#dc2626',
                              backgroundColor: '#fef2f2',
                              border: '1px solid #fecaca'
                            }}>
                              CONTROLLED
                            </span>
                          )}
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <div style={{ color: '#6b7280' }}>
                            <span style={{ fontWeight: '600' }}>Code:</span> {item.itemCode}
                          </div>
                          <div style={{ color: '#6b7280' }}>
                            <span style={{ fontWeight: '600' }}>Stock:</span>
                            <span style={{ 
                              marginLeft: '0.25rem',
                              fontWeight: 'bold',
                              color: item.currentStock <= item.reorderPoint ? '#ef4444' : '#10b981'
                            }}>
                              {item.currentStock}
                            </span> {item.unitOfMeasure}
                          </div>
                          <div style={{ color: '#6b7280' }}>
                            <span style={{ fontWeight: '600' }}>Value:</span> ${item.totalValue.toFixed(2)}
                          </div>
                          <div style={{ color: '#6b7280' }}>
                            <span style={{ fontWeight: '600' }}>Location:</span> {item.location}
                          </div>
                        </div>
                        
                        <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                          {item.description}
                        </p>

                        {item.expiryDate && (
                          <div style={{ 
                            marginTop: '0.5rem',
                            fontSize: '0.75rem',
                            color: new Date(item.expiryDate) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) ? '#ef4444' : '#6b7280'
                          }}>
                            Expires: {new Date(item.expiryDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedItem(item);
                          setShowItemModal(true);
                        }}
                      >
                        View Details
                      </Button>
                      {(item.status === 'LOW_STOCK' || item.status === 'OUT_OF_STOCK') && (
                        <Button size="sm" variant="primary">
                          🛒 Reorder
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Other tabs placeholder */}
        {['orders', 'movements', 'suppliers', 'analytics', 'alerts'].includes(currentTab) && (
          <Card>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                {currentTab === 'orders' && '📋'}
                {currentTab === 'movements' && '📈'}
                {currentTab === 'suppliers' && '🏪'}
                {currentTab === 'analytics' && '📊'}
                {currentTab === 'alerts' && '🚨'}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                {currentTab === 'orders' && 'Purchase Orders Management'}
                {currentTab === 'movements' && 'Stock Movement History'}
                {currentTab === 'suppliers' && 'Supplier Management'}
                {currentTab === 'analytics' && 'Inventory Analytics & Reports'}
                {currentTab === 'alerts' && 'Stock Alerts & Notifications'}
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                {currentTab === 'orders' && 'Create, track, and manage purchase orders for inventory restocking and new item procurement.'}
                {currentTab === 'movements' && 'View detailed history of all stock movements including receipts, issues, transfers, and adjustments.'}
                {currentTab === 'suppliers' && 'Manage supplier information, contracts, performance metrics, and vendor relationships.'}
                {currentTab === 'analytics' && 'Analyze inventory turnover, usage patterns, cost trends, and optimize stock levels.'}
                {currentTab === 'alerts' && 'Configure and monitor automated alerts for low stock, expiry dates, and reorder points.'}
              </p>
              <Button variant="primary">
                {currentTab === 'orders' && '📋 View Orders'}
                {currentTab === 'movements' && '📈 View Movement History'}
                {currentTab === 'suppliers' && '🏪 Manage Suppliers'}
                {currentTab === 'analytics' && '📊 View Reports'}
                {currentTab === 'alerts' && '🚨 Configure Alerts'}
              </Button>
            </div>
          </Card>
        )}

        {/* Item Detail Modal */}
        {showItemModal && <ItemModal />}
      </div>
    </Layout>
  );
};

export default InventoryPage;