// Mock data for Radiology & Imaging Management

export const mockImagingAppointments = [
  {
    id: '1',
    appointmentId: 'RAD-2024-001',
    patient: {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1985-05-15',
      phone: '+91-9876543210',
      email: 'john.doe@email.com'
    },
    modality: 'mri',
    scheduledDate: '2024-01-18T10:00:00',
    status: 'scheduled',
    notes: 'Brain MRI for headache evaluation'
  },
  {
    id: '2',
    appointmentId: 'RAD-2024-002',
    patient: {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      dateOfBirth: '1990-08-22',
      phone: '+91-9876543211',
      email: 'jane.smith@email.com'
    },
    modality: 'xray',
    scheduledDate: '2024-01-17T14:30:00',
    status: 'in_progress',
    notes: 'Chest X-Ray for pneumonia screening'
  }
];

export const mockRadiologyReports = [
  {
    id: '1',
    reportId: 'RPT-2024-001',
    patient: {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1985-05-15',
      phone: '+91-9876543210',
      email: 'john.doe@email.com'
    },
    modality: 'ct',
    reportDate: '2024-01-16',
    status: 'finalized',
    findings: 'No acute abnormalities detected. Normal brain parenchyma.',
    impression: 'Normal CT brain study.'
  },
  {
    id: '2',
    reportId: 'RPT-2024-002',
    patient: {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      dateOfBirth: '1990-08-22',
      phone: '+91-9876543211',
      email: 'jane.smith@email.com'
    },
    modality: 'xray',
    reportDate: '2024-01-15',
    status: 'pending',
    findings: 'Bilateral lung fields appear clear.',
    impression: 'No evidence of pneumonia or other acute chest pathology.'
  }
];

export const mockImagingEquipment = [
  {
    id: '1',
    equipmentName: 'GE MRI Scanner 3T',
    manufacturer: 'General Electric',
    model: 'Discovery MR750',
    serialNumber: 'GE001MRI2024',
    equipmentType: 'MRI',
    status: 'operational',
    lastMaintenance: '2024-01-01',
    nextMaintenance: '2024-04-01'
  },
  {
    id: '2',
    equipmentName: 'Siemens CT Scanner',
    manufacturer: 'Siemens',
    model: 'SOMATOM Force',
    serialNumber: 'SIE002CT2024',
    equipmentType: 'CT',
    status: 'maintenance',
    lastMaintenance: '2024-01-10',
    nextMaintenance: '2024-01-20'
  },
  {
    id: '3',
    equipmentName: 'Philips X-Ray Machine',
    manufacturer: 'Philips',
    model: 'DigitalDiagnost C90',
    serialNumber: 'PHI003XR2024',
    equipmentType: 'X-Ray',
    status: 'operational',
    lastMaintenance: '2023-12-15',
    nextMaintenance: '2024-03-15'
  }
];

export const mockRadiologyStats = {
  scheduledAppointments: 45,
  completedReports: 142,
  operationalEquipment: 8,
  totalEquipment: 10,
  reportAccuracy: 98.5,
  averageTurnaroundTime: 24,
  equipmentUptime: 96.2,
  appointmentsByModality: [
    { modality: 'xray', count: 85 },
    { modality: 'ct', count: 45 },
    { modality: 'mri', count: 35 },
    { modality: 'ultrasound', count: 65 }
  ],
  monthlyAppointmentVolume: [
    { month: 'Oct', appointments: 180 },
    { month: 'Nov', appointments: 195 },
    { month: 'Dec', appointments: 210 },
    { month: 'Jan', appointments: 230 }
  ]
};