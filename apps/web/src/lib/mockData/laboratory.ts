import {
  LabTest,
  TestParameter,
  LabOrder,
  LabResult,
  Sample,
  LabEquipment,
  QualityControl,
  LabStats
} from '../../types/laboratory';

// Test Parameters Mock Data
export const mockTestParameters: TestParameter[] = [
  {
    id: 'param_001',
    parameterName: 'Hemoglobin',
    unit: 'g/dL',
    normalRange: '12.0-16.0',
    criticalLow: 7.0,
    criticalHigh: 20.0
  },
  {
    id: 'param_002',
    parameterName: 'White Blood Cell Count',
    unit: '/μL',
    normalRange: '4000-11000',
    criticalLow: 2000,
    criticalHigh: 30000
  },
  {
    id: 'param_003',
    parameterName: 'Platelet Count',
    unit: '/μL',
    normalRange: '150000-450000',
    criticalLow: 50000,
    criticalHigh: 1000000
  },
  {
    id: 'param_004',
    parameterName: 'Glucose',
    unit: 'mg/dL',
    normalRange: '70-100',
    criticalLow: 40,
    criticalHigh: 400
  },
  {
    id: 'param_005',
    parameterName: 'Creatinine',
    unit: 'mg/dL',
    normalRange: '0.6-1.2',
    criticalLow: 0.2,
    criticalHigh: 10.0
  }
];

// Lab Tests Mock Data
export const mockLabTests: LabTest[] = [
  {
    id: 'test_001',
    testCode: 'CBC001',
    testName: 'Complete Blood Count',
    category: 'hematology',
    testType: 'routine',
    description: 'Complete evaluation of blood components including RBC, WBC, and platelets',
    price: 450,
    turnaroundTime: '2-4 hours',
    sampleType: 'blood',
    sampleVolume: '5ml EDTA tube',
    status: 'active',
    parameters: mockTestParameters.slice(0, 3),
    methodology: 'Automated Cell Counter',
    department: 'Hematology',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'test_002',
    testCode: 'BMP001',
    testName: 'Basic Metabolic Panel',
    category: 'biochemistry',
    testType: 'routine',
    description: 'Basic metabolic markers including glucose, electrolytes, and kidney function',
    price: 650,
    turnaroundTime: '1-2 hours',
    sampleType: 'serum',
    sampleVolume: '3ml SST tube',
    status: 'active',
    parameters: mockTestParameters.slice(3, 5),
    methodology: 'Automated Chemistry Analyzer',
    department: 'Clinical Chemistry',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-21')
  },
  {
    id: 'test_003',
    testCode: 'CULT001',
    testName: 'Blood Culture',
    category: 'microbiology',
    testType: 'urgent',
    description: 'Culture for bacterial and fungal organisms in blood',
    price: 850,
    turnaroundTime: '24-72 hours',
    sampleType: 'blood',
    sampleVolume: '2x10ml blood culture bottles',
    status: 'active',
    methodology: 'Automated Culture System',
    department: 'Microbiology',
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-22')
  },
  {
    id: 'test_004',
    testCode: 'TSH001',
    testName: 'Thyroid Stimulating Hormone',
    category: 'immunology',
    testType: 'routine',
    description: 'Thyroid function screening test',
    price: 380,
    turnaroundTime: '4-6 hours',
    sampleType: 'serum',
    sampleVolume: '2ml SST tube',
    status: 'active',
    methodology: 'Chemiluminescent Immunoassay',
    department: 'Immunology',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-23')
  },
  {
    id: 'test_005',
    testCode: 'HIST001',
    testName: 'Histopathology Examination',
    category: 'pathology',
    testType: 'routine',
    description: 'Microscopic examination of tissue specimens',
    price: 1200,
    turnaroundTime: '3-5 days',
    sampleType: 'tissue',
    sampleVolume: 'Tissue specimen in formalin',
    status: 'active',
    methodology: 'Light Microscopy',
    department: 'Pathology',
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-24')
  },
  {
    id: 'test_006',
    testCode: 'PCR001',
    testName: 'COVID-19 RT-PCR',
    category: 'molecular',
    testType: 'stat',
    description: 'Real-time PCR for SARS-CoV-2 detection',
    price: 950,
    turnaroundTime: '4-6 hours',
    sampleType: 'swab',
    sampleVolume: 'Nasopharyngeal swab in VTM',
    status: 'active',
    methodology: 'Real-time PCR',
    department: 'Molecular Diagnostics',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-25')
  },
  {
    id: 'test_007',
    testCode: 'KARY001',
    testName: 'Karyotype Analysis',
    category: 'genetics',
    testType: 'research',
    description: 'Chromosomal analysis for genetic abnormalities',
    price: 2500,
    turnaroundTime: '7-10 days',
    sampleType: 'blood',
    sampleVolume: '5ml Heparin tube',
    status: 'active',
    methodology: 'Cytogenetic Analysis',
    department: 'Genetics',
    createdAt: new Date('2024-01-21'),
    updatedAt: new Date('2024-01-26')
  },
  {
    id: 'test_008',
    testCode: 'UA001',
    testName: 'Complete Urine Analysis',
    category: 'biochemistry',
    testType: 'routine',
    description: 'Physical, chemical, and microscopic examination of urine',
    price: 200,
    turnaroundTime: '1-2 hours',
    sampleType: 'urine',
    sampleVolume: '50ml clean catch midstream',
    status: 'active',
    methodology: 'Automated Urinalysis',
    department: 'Clinical Chemistry',
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-27')
  }
];

// Lab Orders Mock Data
export const mockLabOrders: LabOrder[] = [
  {
    id: 'order_001',
    orderNumber: 'ORD-2024-001001',
    patientId: 'pat_001',
    patient: {
      firstName: 'John',
      lastName: 'Smith',
      patientId: 'PAT001234',
      dateOfBirth: '1985-06-15',
      gender: 'Male',
      phone: '+1-555-0123',
      email: 'john.smith@email.com'
    },
    orderingDoctor: {
      firstName: 'Dr. Sarah',
      lastName: 'Johnson',
      employeeId: 'DOC001',
      department: {
        name: 'Internal Medicine',
        code: 'IM'
      }
    },
    tests: [
      {
        id: 'ot_001',
        testId: 'test_001',
        testName: 'Complete Blood Count',
        status: 'completed'
      },
      {
        id: 'ot_002',
        testId: 'test_002',
        testName: 'Basic Metabolic Panel',
        status: 'completed'
      }
    ],
    orderDate: new Date('2024-01-25T08:30:00'),
    priority: 'routine',
    status: 'completed',
    totalCost: 1100,
    instructions: 'Fasting required for 12 hours before collection',
    clinicalHistory: 'Patient presents with fatigue and weakness',
    diagnosis: 'Rule out anemia and metabolic disorders'
  },
  {
    id: 'order_002',
    orderNumber: 'ORD-2024-001002',
    patientId: 'pat_002',
    patient: {
      firstName: 'Mary',
      lastName: 'Williams',
      patientId: 'PAT001235',
      dateOfBirth: '1978-03-22',
      gender: 'Female',
      phone: '+1-555-0124',
      email: 'mary.williams@email.com'
    },
    orderingDoctor: {
      firstName: 'Dr. Michael',
      lastName: 'Brown',
      employeeId: 'DOC002',
      department: {
        name: 'Emergency Medicine',
        code: 'EM'
      }
    },
    tests: [
      {
        id: 'ot_003',
        testId: 'test_003',
        testName: 'Blood Culture',
        status: 'in_progress'
      }
    ],
    orderDate: new Date('2024-01-26T14:15:00'),
    priority: 'urgent',
    status: 'in_progress',
    totalCost: 850,
    instructions: 'Collect before antibiotic administration',
    clinicalHistory: 'Fever and signs of sepsis',
    diagnosis: 'Suspected bacteremia'
  },
  {
    id: 'order_003',
    orderNumber: 'ORD-2024-001003',
    patientId: 'pat_003',
    patient: {
      firstName: 'Robert',
      lastName: 'Davis',
      patientId: 'PAT001236',
      dateOfBirth: '1992-11-08',
      gender: 'Male',
      phone: '+1-555-0125'
    },
    orderingDoctor: {
      firstName: 'Dr. Lisa',
      lastName: 'Garcia',
      employeeId: 'DOC003',
      department: {
        name: 'Family Medicine',
        code: 'FM'
      }
    },
    tests: [
      {
        id: 'ot_004',
        testId: 'test_004',
        testName: 'Thyroid Stimulating Hormone',
        status: 'pending'
      },
      {
        id: 'ot_005',
        testId: 'test_008',
        testName: 'Complete Urine Analysis',
        status: 'pending'
      }
    ],
    orderDate: new Date('2024-01-27T10:45:00'),
    priority: 'routine',
    status: 'pending',
    totalCost: 580,
    instructions: 'First morning urine specimen preferred',
    clinicalHistory: 'Routine health screening',
    diagnosis: 'Annual physical examination'
  },
  {
    id: 'order_004',
    orderNumber: 'ORD-2024-001004',
    patientId: 'pat_004',
    patient: {
      firstName: 'Jennifer',
      lastName: 'Miller',
      patientId: 'PAT001237',
      dateOfBirth: '1987-09-14',
      gender: 'Female',
      phone: '+1-555-0126',
      email: 'jennifer.miller@email.com'
    },
    orderingDoctor: {
      firstName: 'Dr. David',
      lastName: 'Wilson',
      employeeId: 'DOC004',
      department: {
        name: 'Infectious Disease',
        code: 'ID'
      }
    },
    tests: [
      {
        id: 'ot_006',
        testId: 'test_006',
        testName: 'COVID-19 RT-PCR',
        status: 'completed'
      }
    ],
    orderDate: new Date('2024-01-27T16:20:00'),
    priority: 'stat',
    status: 'completed',
    totalCost: 950,
    instructions: 'STAT processing required - patient symptomatic',
    clinicalHistory: 'Fever, cough, and shortness of breath',
    diagnosis: 'Suspected COVID-19 infection'
  }
];

// Lab Results Mock Data
export const mockLabResults: LabResult[] = [
  {
    id: 'result_001',
    testId: 'test_001',
    orderId: 'order_001',
    patientId: 'pat_001',
    parameters: [
      {
        id: 'pr_001',
        parameterName: 'Hemoglobin',
        value: 11.2,
        unit: 'g/dL',
        referenceRange: '12.0-16.0',
        flag: 'low',
        comments: 'Below normal range, suggest iron studies'
      },
      {
        id: 'pr_002',
        parameterName: 'White Blood Cell Count',
        value: 7500,
        unit: '/μL',
        referenceRange: '4000-11000',
        flag: 'normal'
      },
      {
        id: 'pr_003',
        parameterName: 'Platelet Count',
        value: 285000,
        unit: '/μL',
        referenceRange: '150000-450000',
        flag: 'normal'
      }
    ],
    overallInterpretation: 'Mild anemia detected. Normal white cell and platelet counts.',
    reportedBy: 'Dr. Patricia Lee, MD',
    reportDate: new Date('2024-01-25T12:15:00'),
    verifiedBy: 'Dr. James Chen, MD',
    verificationDate: new Date('2024-01-25T12:30:00'),
    status: 'completed'
  },
  {
    id: 'result_002',
    testId: 'test_002',
    orderId: 'order_001',
    patientId: 'pat_001',
    parameters: [
      {
        id: 'pr_004',
        parameterName: 'Glucose',
        value: 110,
        unit: 'mg/dL',
        referenceRange: '70-100',
        flag: 'high',
        comments: 'Slightly elevated, recommend glucose tolerance test'
      },
      {
        id: 'pr_005',
        parameterName: 'Creatinine',
        value: 0.9,
        unit: 'mg/dL',
        referenceRange: '0.6-1.2',
        flag: 'normal'
      }
    ],
    overallInterpretation: 'Mildly elevated glucose levels. Normal kidney function.',
    reportedBy: 'Dr. Maria Rodriguez, MD',
    reportDate: new Date('2024-01-25T11:45:00'),
    verifiedBy: 'Dr. James Chen, MD',
    verificationDate: new Date('2024-01-25T12:00:00'),
    status: 'completed'
  }
];

// Samples Mock Data
export const mockSamples: Sample[] = [
  {
    id: 'sample_001',
    sampleId: 'SMP-2024-001001',
    patientName: 'John Smith',
    patientId: 'PAT001234',
    sampleType: 'blood',
    collectionDate: new Date('2024-01-25T08:00:00'),
    collectedBy: 'Sarah Nurse',
    volume: 10,
    unit: 'ml',
    containerType: 'EDTA Purple Top Tube',
    status: 'processed',
    storageConditions: 'Room Temperature',
    notes: 'Good quality sample, no hemolysis detected',
    tests: ['CBC001', 'BMP001']
  },
  {
    id: 'sample_002',
    sampleId: 'SMP-2024-001002',
    patientName: 'Mary Williams',
    patientId: 'PAT001235',
    sampleType: 'blood',
    collectionDate: new Date('2024-01-26T14:00:00'),
    collectedBy: 'Mike Technician',
    volume: 20,
    unit: 'ml',
    containerType: 'Blood Culture Bottles',
    status: 'received',
    storageConditions: '37°C Incubator',
    notes: 'Aerobic and anaerobic culture bottles collected',
    tests: ['CULT001']
  },
  {
    id: 'sample_003',
    sampleId: 'SMP-2024-001003',
    patientName: 'Robert Davis',
    patientId: 'PAT001236',
    sampleType: 'urine',
    collectionDate: new Date('2024-01-27T08:30:00'),
    collectedBy: 'Patient Self-Collection',
    volume: 50,
    unit: 'ml',
    containerType: 'Sterile Urine Container',
    status: 'collected',
    storageConditions: 'Refrigerated',
    notes: 'First morning specimen, clear appearance',
    tests: ['UA001']
  },
  {
    id: 'sample_004',
    sampleId: 'SMP-2024-001004',
    patientName: 'Jennifer Miller',
    patientId: 'PAT001237',
    sampleType: 'swab',
    collectionDate: new Date('2024-01-27T16:00:00'),
    collectedBy: 'Testing Nurse',
    volume: 1,
    unit: 'swab',
    containerType: 'Viral Transport Medium',
    status: 'processed',
    storageConditions: '-80°C Freezer',
    notes: 'Nasopharyngeal swab for COVID-19 testing',
    tests: ['PCR001']
  },
  {
    id: 'sample_005',
    sampleId: 'SMP-2024-001005',
    patientName: 'Emma Thompson',
    patientId: 'PAT001238',
    sampleType: 'tissue',
    collectionDate: new Date('2024-01-26T10:15:00'),
    collectedBy: 'Dr. Surgery Resident',
    volume: 5,
    unit: 'cm³',
    containerType: 'Formalin Container',
    status: 'received',
    storageConditions: '10% Formalin',
    notes: 'Surgical biopsy specimen, well-preserved',
    tests: ['HIST001']
  },
  {
    id: 'sample_006',
    sampleId: 'SMP-2024-001006',
    patientName: 'Michael Johnson',
    patientId: 'PAT001239',
    sampleType: 'serum',
    collectionDate: new Date('2024-01-27T09:20:00'),
    collectedBy: 'Lab Assistant',
    volume: 5,
    unit: 'ml',
    containerType: 'SST Tube',
    status: 'expired',
    storageConditions: 'Refrigerated',
    notes: 'Sample expired due to processing delay',
    tests: ['TSH001']
  }
];

// Lab Equipment Mock Data
export const mockLabEquipment: LabEquipment[] = [
  {
    id: 'equip_001',
    equipmentName: 'Automated Hematology Analyzer',
    manufacturer: 'Sysmex Corporation',
    model: 'XN-3000',
    serialNumber: 'SN-2023-001',
    location: 'Hematology Lab - Station A',
    status: 'operational',
    installationDate: new Date('2023-03-15'),
    lastMaintenanceDate: new Date('2024-01-15'),
    nextMaintenanceDate: new Date('2024-04-15'),
    warrantyExpiry: new Date('2026-03-15'),
    purchasePrice: 250000,
    specifications: 'CBC, Diff, Reticulocyte count, 60 samples/hour',
    calibrationDue: new Date('2024-02-15')
  },
  {
    id: 'equip_002',
    equipmentName: 'Chemistry Analyzer',
    manufacturer: 'Roche Diagnostics',
    model: 'cobas c 502',
    serialNumber: 'SN-2023-002',
    location: 'Clinical Chemistry Lab',
    status: 'operational',
    installationDate: new Date('2023-01-20'),
    lastMaintenanceDate: new Date('2024-01-10'),
    nextMaintenanceDate: new Date('2024-04-10'),
    warrantyExpiry: new Date('2026-01-20'),
    purchasePrice: 180000,
    specifications: 'Clinical chemistry, immunoassay, 300 tests/hour'
  },
  {
    id: 'equip_003',
    equipmentName: 'Blood Culture System',
    manufacturer: 'BD Biosciences',
    model: 'BACTEC FX',
    serialNumber: 'SN-2023-003',
    location: 'Microbiology Lab',
    status: 'maintenance',
    installationDate: new Date('2023-05-10'),
    lastMaintenanceDate: new Date('2024-01-20'),
    nextMaintenanceDate: new Date('2024-01-28'),
    warrantyExpiry: new Date('2026-05-10'),
    purchasePrice: 95000,
    specifications: 'Automated blood culture detection, 240 bottles capacity'
  },
  {
    id: 'equip_004',
    equipmentName: 'PCR Thermal Cycler',
    manufacturer: 'Applied Biosystems',
    model: 'QuantStudio 5',
    serialNumber: 'SN-2023-004',
    location: 'Molecular Diagnostics Lab',
    status: 'operational',
    installationDate: new Date('2023-08-12'),
    lastMaintenanceDate: new Date('2024-01-12'),
    nextMaintenanceDate: new Date('2024-07-12'),
    warrantyExpiry: new Date('2026-08-12'),
    purchasePrice: 75000,
    specifications: 'Real-time PCR, 96-well format, 5 fluorescence channels'
  },
  {
    id: 'equip_005',
    equipmentName: 'Microscope Digital System',
    manufacturer: 'Leica Microsystems',
    model: 'DM2500 LED',
    serialNumber: 'SN-2023-005',
    location: 'Pathology Lab',
    status: 'calibration',
    installationDate: new Date('2023-02-28'),
    lastMaintenanceDate: new Date('2024-01-05'),
    nextMaintenanceDate: new Date('2024-07-05'),
    warrantyExpiry: new Date('2026-02-28'),
    purchasePrice: 45000,
    specifications: 'LED illumination, digital imaging, 1000x magnification'
  },
  {
    id: 'equip_006',
    equipmentName: 'Centrifuge System',
    manufacturer: 'Eppendorf',
    model: '5810 R',
    serialNumber: 'SN-2023-006',
    location: 'Sample Processing Area',
    status: 'out_of_service',
    installationDate: new Date('2023-06-05'),
    lastMaintenanceDate: new Date('2023-12-15'),
    nextMaintenanceDate: new Date('2024-02-01'),
    warrantyExpiry: new Date('2026-06-05'),
    purchasePrice: 12000,
    specifications: 'Refrigerated centrifuge, 15000 RPM, swing-out rotor'
  }
];

// Quality Control Mock Data
export const mockQualityControl: QualityControl[] = [
  {
    id: 'qc_001',
    testName: 'Hemoglobin Control',
    controlType: 'Normal Control',
    controlLotNumber: 'QC-HGB-2024-001',
    testDate: new Date('2024-01-27T06:00:00'),
    expectedValue: '13.5 g/dL',
    actualValue: '13.3 g/dL',
    acceptableRange: '12.8-14.2 g/dL',
    status: 'passed',
    performedBy: 'Lab Tech Alice',
    comments: 'Within acceptable limits',
    equipment: 'XN-3000'
  },
  {
    id: 'qc_002',
    testName: 'Glucose Control High',
    controlType: 'High Control',
    controlLotNumber: 'QC-GLU-2024-001',
    testDate: new Date('2024-01-27T06:15:00'),
    expectedValue: '300 mg/dL',
    actualValue: '285 mg/dL',
    acceptableRange: '270-330 mg/dL',
    status: 'failed',
    performedBy: 'Lab Tech Bob',
    comments: 'Below acceptable range, recalibration required',
    equipment: 'cobas c 502'
  },
  {
    id: 'qc_003',
    testName: 'Culture Media Sterility',
    controlType: 'Negative Control',
    controlLotNumber: 'QC-MED-2024-001',
    testDate: new Date('2024-01-26T08:00:00'),
    expectedValue: 'No Growth',
    actualValue: 'No Growth',
    acceptableRange: 'Sterile',
    status: 'passed',
    performedBy: 'Microbiologist Carol',
    comments: 'Media sterility confirmed',
    equipment: 'BACTEC FX'
  },
  {
    id: 'qc_004',
    testName: 'PCR Positive Control',
    controlType: 'Positive Control',
    controlLotNumber: 'QC-PCR-2024-001',
    testDate: new Date('2024-01-27T14:00:00'),
    expectedValue: 'Positive',
    actualValue: 'Positive',
    acceptableRange: 'Detectable',
    status: 'passed',
    performedBy: 'Molecular Tech Dave',
    comments: 'Control amplified as expected',
    equipment: 'QuantStudio 5'
  },
  {
    id: 'qc_005',
    testName: 'Microscope Resolution',
    controlType: 'Calibration Standard',
    controlLotNumber: 'QC-MIC-2024-001',
    testDate: new Date('2024-01-25T09:00:00'),
    expectedValue: '1000x Resolution',
    actualValue: '980x Resolution',
    acceptableRange: '950-1050x',
    status: 'in_review',
    performedBy: 'Pathologist Dr. Evans',
    comments: 'Slight deviation, monitoring required',
    equipment: 'DM2500 LED'
  }
];

// Lab Statistics Mock Data
export const mockLabStats: LabStats = {
  totalTests: 2847,
  pendingTests: 156,
  completedTests: 2691,
  testsByCategory: {
    hematology: 750,
    biochemistry: 920,
    microbiology: 485,
    immunology: 345,
    pathology: 215,
    molecular: 92,
    genetics: 40
  },
  equipmentOperational: 4,
  totalEquipment: 6,
  dailyTestVolume: [
    { date: '2024-01-21', tests: 145 },
    { date: '2024-01-22', tests: 168 },
    { date: '2024-01-23', tests: 152 },
    { date: '2024-01-24', tests: 189 },
    { date: '2024-01-25', tests: 175 },
    { date: '2024-01-26', tests: 162 },
    { date: '2024-01-27', tests: 195 }
  ],
  averageTurnaroundTime: [
    { category: 'Hematology', hours: 2.5 },
    { category: 'Biochemistry', hours: 1.8 },
    { category: 'Microbiology', hours: 36.2 },
    { category: 'Immunology', hours: 4.2 },
    { category: 'Pathology', hours: 72.5 },
    { category: 'Molecular', hours: 5.8 },
    { category: 'Genetics', hours: 168.0 }
  ],
  accuracy: 98.7,
  averageTAT: 14.2,
  rejectionRate: 2.3,
  equipmentUptime: 94.8
};

// Export all mock data as default
export default {
  mockTestParameters,
  mockLabTests,
  mockLabOrders,
  mockLabResults,
  mockSamples,
  mockLabEquipment,
  mockQualityControl,
  mockLabStats
};