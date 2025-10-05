// Mock data for Emergency Management & Disaster Response

import {
  EmergencyCase,
  TriageCategory,
  EmergencyAlert,
  BedAvailability,
  EmergencyContact,
  EmergencyStats,
  EmergencyProtocol
} from '../../types/emergency';

export const mockEmergencyCases: EmergencyCase[] = [
  {
    id: '1',
    caseNumber: 'EMR-2024-001',
    patientId: '1',
    patient: {
      id: '1',
      firstName: 'John',
      lastName: 'Smith',
      dateOfBirth: '1980-05-15',
      phone: '+91-9876543210',
      email: 'john.smith@email.com'
    },
    triageCategory: 'critical',
    chiefComplaint: 'Chest pain and shortness of breath',
    vitalSigns: {
      bloodPressure: '180/110',
      heartRate: 120,
      temperature: 98.6,
      respiratoryRate: 24,
      oxygenSaturation: 88
    },
    arrivalTime: '2024-01-15T14:30:00',
    assignedTo: 'Dr. Sarah Johnson',
    bedNumber: 'ER-01',
    status: 'in_treatment',
    priority: 1,
    notes: 'Patient showing signs of acute coronary syndrome. ECG ordered.'
  },
  {
    id: '2',
    caseNumber: 'EMR-2024-002',
    patientId: '2',
    patient: {
      id: '2',
      firstName: 'Maria',
      lastName: 'Garcia',
      dateOfBirth: '1975-08-22',
      phone: '+91-9876543211',
      email: 'maria.garcia@email.com'
    },
    triageCategory: 'urgent',
    chiefComplaint: 'Severe abdominal pain',
    vitalSigns: {
      bloodPressure: '140/90',
      heartRate: 95,
      temperature: 101.2,
      respiratoryRate: 18,
      oxygenSaturation: 96
    },
    arrivalTime: '2024-01-15T15:15:00',
    assignedTo: 'Dr. Michael Chen',
    bedNumber: 'ER-03',
    status: 'waiting',
    priority: 2,
    notes: 'Right lower quadrant tenderness. Possible appendicitis.'
  },
  {
    id: '3',
    caseNumber: 'EMR-2024-003',
    patientId: '3',
    patient: {
      id: '3',
      firstName: 'David',
      lastName: 'Wilson',
      dateOfBirth: '1990-12-03',
      phone: '+91-9876543212',
      email: 'david.wilson@email.com'
    },
    triageCategory: 'less_urgent',
    chiefComplaint: 'Minor laceration on forearm',
    vitalSigns: {
      bloodPressure: '120/80',
      heartRate: 72,
      temperature: 98.4,
      respiratoryRate: 16,
      oxygenSaturation: 98
    },
    arrivalTime: '2024-01-15T16:00:00',
    assignedTo: 'Nurse Jennifer Adams',
    bedNumber: 'ER-08',
    status: 'completed',
    priority: 4,
    notes: 'Clean laceration, sutured and dressed. Tetanus shot given.'
  }
];

export const mockEmergencyAlerts: EmergencyAlert[] = [
  {
    id: '1',
    type: 'mass_casualty',
    title: 'Multi-Vehicle Accident',
    description: 'Multiple casualties incoming from highway accident. ETA 10 minutes.',
    severity: 'critical',
    location: 'Highway 101, Mile Marker 45',
    reportedTime: '2024-01-15T13:45:00',
    estimatedPatients: 8,
    status: 'active',
    assignedTeam: ['Trauma Team Alpha', 'Emergency Response Unit'],
    notes: 'Prepare for multiple trauma cases. Blood bank notified.'
  },
  {
    id: '2',
    type: 'fire',
    title: 'Building Fire Emergency',
    description: 'Fire at residential building with potential smoke inhalation victims.',
    severity: 'high',
    location: '123 Main Street, Apartment Complex',
    reportedTime: '2024-01-15T11:30:00',
    estimatedPatients: 12,
    status: 'resolved',
    assignedTeam: ['Respiratory Team', 'Burn Unit'],
    notes: '12 patients treated for smoke inhalation. 3 admitted for observation.'
  }
];

export const mockBedAvailability: BedAvailability[] = [
  {
    id: '1',
    bedNumber: 'ER-01',
    ward: 'Emergency',
    bedType: 'emergency',
    status: 'occupied',
    patientName: 'John Smith',
    admissionTime: '2024-01-15T14:30:00',
    estimatedDischarge: '2024-01-15T18:00:00'
  },
  {
    id: '2',
    bedNumber: 'ER-02',
    ward: 'Emergency',
    bedType: 'emergency',
    status: 'available',
    patientName: null,
    admissionTime: null,
    estimatedDischarge: null
  },
  {
    id: '3',
    bedNumber: 'ER-03',
    ward: 'Emergency',
    bedType: 'emergency',
    status: 'occupied',
    patientName: 'Maria Garcia',
    admissionTime: '2024-01-15T15:15:00',
    estimatedDischarge: '2024-01-15T20:00:00'
  },
  {
    id: '4',
    bedNumber: 'ICU-01',
    ward: 'ICU',
    bedType: 'icu',
    status: 'maintenance',
    patientName: null,
    admissionTime: null,
    estimatedDischarge: null
  },
  {
    id: '5',
    bedNumber: 'ICU-02',
    ward: 'ICU',
    bedType: 'icu',
    status: 'available',
    patientName: null,
    admissionTime: null,
    estimatedDischarge: null
  }
];

export const mockEmergencyContacts: EmergencyContact[] = [
  {
    id: '1',
    name: 'Fire Department',
    department: 'Fire & Rescue',
    phone: '101',
    email: 'dispatch@firedept.gov',
    role: 'primary',
    available24x7: true,
    responseTime: '5-8 minutes'
  },
  {
    id: '2',
    name: 'Police Department',
    department: 'Law Enforcement',
    phone: '100',
    email: 'emergency@police.gov',
    role: 'primary',
    available24x7: true,
    responseTime: '3-5 minutes'
  },
  {
    id: '3',
    name: 'Ambulance Service',
    department: 'Emergency Medical Services',
    phone: '108',
    email: 'dispatch@ambulance.gov',
    role: 'primary',
    available24x7: true,
    responseTime: '8-12 minutes'
  },
  {
    id: '4',
    name: 'Poison Control Center',
    department: 'Toxicology',
    phone: '1066',
    email: 'info@poisoncontrol.org',
    role: 'specialized',
    available24x7: true,
    responseTime: 'Immediate phone consultation'
  }
];

export const mockEmergencyStats: EmergencyStats = {
  totalCases: 156,
  criticalCases: 12,
  urgentCases: 34,
  lessUrgentCases: 78,
  nonUrgentCases: 32,
  averageWaitTime: 25, // minutes
  bedOccupancyRate: 78,
  averageStayDuration: 4.5, // hours
  dischargeRate: 92,
  mortalityRate: 2.1,
  casesByCategory: [
    { category: 'critical', count: 12, percentage: 7.7 },
    { category: 'urgent', count: 34, percentage: 21.8 },
    { category: 'less_urgent', count: 78, percentage: 50.0 },
    { category: 'non_urgent', count: 32, percentage: 20.5 }
  ],
  dailyVolume: [
    { date: '2024-01-08', cases: 23 },
    { date: '2024-01-09', cases: 18 },
    { date: '2024-01-10', cases: 31 },
    { date: '2024-01-11', cases: 26 },
    { date: '2024-01-12', cases: 22 },
    { date: '2024-01-13', cases: 19 },
    { date: '2024-01-14', cases: 17 }
  ],
  responseTimeMetrics: {
    averageTriageTime: 8, // minutes
    averagePhysicianTime: 15, // minutes
    averageDischargeTime: 45 // minutes
  }
};

export const mockEmergencyProtocols: EmergencyProtocol[] = [
  {
    id: '1',
    name: 'Cardiac Arrest Protocol',
    category: 'cardiac',
    description: 'Standard protocol for cardiac arrest emergencies',
    steps: [
      'Immediate CPR initiation',
      'Defibrillation if shockable rhythm',
      'Advanced airway management',
      'IV access and medication administration',
      'Continuous monitoring and reassessment'
    ],
    medications: ['Epinephrine', 'Amiodarone', 'Atropine'],
    equipment: ['Defibrillator', 'Intubation kit', 'IV setup'],
    responseTime: '< 2 minutes',
    lastUpdated: '2024-01-01',
    version: '2.1'
  },
  {
    id: '2',
    name: 'Trauma Alert Protocol',
    category: 'trauma',
    description: 'Protocol for major trauma cases',
    steps: [
      'Primary survey (ABCDE)',
      'Trauma team activation',
      'Imaging studies as indicated',
      'Surgical consultation if needed',
      'ICU admission if required'
    ],
    medications: ['Morphine', 'Ketamine', 'Tranexamic acid'],
    equipment: ['Trauma cart', 'C-spine immobilization', 'Blood warmer'],
    responseTime: '< 5 minutes',
    lastUpdated: '2024-01-01',
    version: '1.8'
  },
  {
    id: '3',
    name: 'Stroke Protocol',
    category: 'neurological',
    description: 'Rapid response protocol for stroke patients',
    steps: [
      'NIH Stroke Scale assessment',
      'Immediate CT scan',
      'Lab work (glucose, PT/INR)',
      'Neurology consultation',
      'tPA consideration if applicable'
    ],
    medications: ['tPA', 'Aspirin', 'Heparin'],
    equipment: ['CT scanner', 'Blood glucose monitor', 'IV pump'],
    responseTime: '< 10 minutes',
    lastUpdated: '2024-01-01',
    version: '3.0'
  }
];

export const mockICUBeds = [
  {
    id: '1',
    bedNumber: 'ICU-01',
    status: 'occupied',
    patient: {
      id: '1',
      firstName: 'John',
      lastName: 'Smith',
      dateOfBirth: '1980-05-15',
      phone: '+91-9876543210',
      email: 'john.smith@email.com'
    },
    admissionDate: '2024-01-15T10:00:00',
    condition: 'critical',
    assignedNurse: 'Sarah Johnson',
    equipment: ['Ventilator', 'Cardiac Monitor', 'IV Pump']
  },
  {
    id: '2',
    bedNumber: 'ICU-02',
    status: 'available',
    patient: null,
    admissionDate: null,
    condition: null,
    assignedNurse: null,
    equipment: ['Cardiac Monitor', 'IV Pump']
  }
];

export const mockTriageQueue = [
  {
    id: '1',
    patientName: 'John Doe',
    arrivalTime: '2024-01-15T14:30:00',
    complaint: 'Chest pain',
    triageLevel: 1,
    waitTime: 5,
    status: 'waiting'
  },
  {
    id: '2',
    patientName: 'Jane Smith',
    arrivalTime: '2024-01-15T14:45:00',
    complaint: 'Abdominal pain',
    triageLevel: 2,
    waitTime: 15,
    status: 'in_progress'
  }
];

export const mockCriticalCareEquipment = [
  {
    id: '1',
    name: 'Ventilator Model X200',
    type: 'ventilator',
    status: 'operational',
    location: 'ICU-01',
    lastMaintenance: '2024-01-10',
    nextMaintenance: '2024-02-10'
  },
  {
    id: '2',
    name: 'Cardiac Monitor CM-500',
    type: 'monitor',
    status: 'operational',
    location: 'ICU-02',
    lastMaintenance: '2024-01-12',
    nextMaintenance: '2024-02-12'
  },
  {
    id: '3',
    name: 'Defibrillator DEF-300',
    type: 'defibrillator',
    status: 'maintenance',
    location: 'Equipment Room',
    lastMaintenance: '2024-01-05',
    nextMaintenance: '2024-01-16'
  }
];
