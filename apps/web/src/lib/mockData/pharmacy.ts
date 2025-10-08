// Mock data for Pharmacy Management

export const mockMedications = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    genericName: 'Acetaminophen',
    category: 'Analgesic',
    manufacturer: 'PharmaCorp',
    batchNumber: 'PCM2024001',
    expiryDate: '2025-12-31',
    currentStock: 2500,
    minimumStock: 500,
    unitPrice: 2.5,
    status: 'in_stock',
    location: 'Rack A1'
  },
  {
    id: '2',
    name: 'Amoxicillin 250mg',
    genericName: 'Amoxicillin',
    category: 'Antibiotic',
    manufacturer: 'MediPharma',
    batchNumber: 'AMX2024001',
    expiryDate: '2025-08-15',
    currentStock: 150,
    minimumStock: 200,
    unitPrice: 4.5,
    status: 'low_stock',
    location: 'Rack B2'
  },
  {
    id: '3',
    name: 'Insulin Regular',
    genericName: 'Human Insulin',
    category: 'Antidiabetic',
    manufacturer: 'DiabetesCare',
    batchNumber: 'INS2024001',
    expiryDate: '2025-03-20',
    currentStock: 0,
    minimumStock: 50,
    unitPrice: 125.0,
    status: 'out_of_stock',
    location: 'Refrigerator Unit 1'
  }
];

export const mockPrescriptions = [
  {
    id: '1',
    prescriptionId: 'RX-2024-001',
    patientName: 'John Doe',
    doctorName: 'Dr. Sarah Johnson',
    date: '2024-01-15',
    medications: [
      {
        name: 'Paracetamol 500mg',
        dosage: '1 tablet',
        frequency: 'twice daily',
        duration: '5 days',
        quantity: 10
      }
    ],
    status: 'dispensed',
    totalAmount: 25.0
  },
  {
    id: '2',
    prescriptionId: 'RX-2024-002',
    patientName: 'Jane Smith',
    doctorName: 'Dr. Michael Chen',
    date: '2024-01-14',
    medications: [
      {
        name: 'Amoxicillin 250mg',
        dosage: '1 capsule',
        frequency: 'three times daily',
        duration: '7 days',
        quantity: 21
      }
    ],
    status: 'pending',
    totalAmount: 94.5
  }
];

// Aliases expected by some pages
export const mockPharmacyPrescriptions = mockPrescriptions;
export const mockPharmacyInventory = mockMedications;
export const mockDispensations = mockPrescriptions;
export const mockDrugInteractions = [
  { id: 'd1', drugA: 'Warfarin', drugB: 'Aspirin', severity: 'high', notes: 'Increased bleeding risk' },
  { id: 'd2', drugA: 'Metformin', drugB: 'Alcohol', severity: 'medium', notes: 'Risk of lactic acidosis' }
];

export const mockPharmacyStats = {
  totalMedications: 850,
  inStockItems: 720,
  lowStockItems: 95,
  outOfStockItems: 35,
  totalPrescriptions: 156,
  dispensedPrescriptions: 142,
  pendingPrescriptions: 14,
  monthlyRevenue: 325000,
  medicationsByCategory: [
    { category: 'Analgesic', count: 120, percentage: 14.1 },
    { category: 'Antibiotic', count: 95, percentage: 11.2 },
    { category: 'Antidiabetic', count: 80, percentage: 9.4 },
    { category: 'Cardiovascular', count: 150, percentage: 17.6 },
    { category: 'Others', count: 405, percentage: 47.6 }
  ],
  expiringMedications: [
    { name: 'Aspirin 325mg', expiryDate: '2024-02-15', quantity: 150 },
    { name: 'Cough Syrup', expiryDate: '2024-03-10', quantity: 25 },
    { name: 'Vitamin C Tablets', expiryDate: '2024-03-20', quantity: 200 }
  ]
};

// Missing export stub
export const mockPharmacySuppliers: any[] = [];