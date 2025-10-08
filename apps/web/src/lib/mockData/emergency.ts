// Mock data for Emergency Management & Disaster Response

import {
  EmergencyCase,
  TriageLevel,
  EmergencyStatus
} from '../../types/emergency';

// Note: EmergencyAlert, BedAvailability, EmergencyContact, EmergencyStats, EmergencyProtocol
// are not defined in the types file. These mock exports are kept for backward compatibility
// but should be migrated to proper types.

interface EmergencyAlert {
  id: string;
  type: string;
  title: string;
  description: string;
  severity: string;
  location: string;
  reportedTime: string;
  estimatedPatients: number;
  status: string;
  assignedTeam: string[];
  notes: string;
}

interface BedAvailability {
  id: string;
  bedNumber: string;
  ward: string;
  bedType: string;
  status: string;
  patientName: string | null;
  admissionTime: string | null;
  estimatedDischarge: string | null;
}

interface EmergencyContact {
  id: string;
  name: string;
  department: string;
  phone: string;
  email: string;
  role: string;
  available24x7: boolean;
  responseTime: string;
}

interface EmergencyStats {
  totalCases: number;
  criticalCases: number;
  urgentCases: number;
  lessUrgentCases: number;
  nonUrgentCases: number;
  averageWaitTime: number;
  bedOccupancyRate: number;
  averageStayDuration: number;
  dischargeRate: number;
  mortalityRate: number;
  casesByCategory: Array<{ category: string; count: number; percentage: number }>;
  dailyVolume: Array<{ date: string; cases: number }>;
  responseTimeMetrics: {
    averageTriageTime: number;
    averagePhysicianTime: number;
    averageDischargeTime: number;
  };
}

interface EmergencyProtocol {
  id: string;
  name: string;
  category: string;
  description: string;
  steps: string[];
  medications: string[];
  equipment: string[];
  responseTime: string;
  lastUpdated: string;
  version: string;
}

// Simplified emergency case type for mock data
interface SimplifiedEmergencyCase {
  id: string;
  caseNumber: string;
  patientId: string;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    phone: string;
    email?: string;
  };
  triageLevel: TriageLevel;
  chiefComplaint: string;
  vitalSigns: {
    temperature: number;
    bloodPressure: string;
    heartRate: number;
    respiratoryRate: number;
    oxygenSaturation: number;
    painLevel: number;
    consciousness: 'alert' | 'drowsy' | 'stuporous' | 'unconscious';
    recordedAt: Date;
    recordedBy: string;
  };
  arrivalTime: Date;
  assignedTo?: string;
  bedNumber?: string;
  status: EmergencyStatus;
  priority?: number;
  notes?: string;
}

export const mockEmergencyCases: SimplifiedEmergencyCase[] = [
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
    triageLevel: 'immediate',
    chiefComplaint: 'Chest pain and shortness of breath',
    vitalSigns: {
      temperature: 98.6,
      bloodPressure: '180/110',
      heartRate: 120,
      respiratoryRate: 24,
      oxygenSaturation: 88,
      painLevel: 8,
      consciousness: 'alert',
      recordedAt: new Date('2024-01-15T14:30:00'),
      recordedBy: 'Triage Nurse'
    },
    arrivalTime: new Date('2024-01-15T14:30:00'),
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
    triageLevel: 'urgent',
    chiefComplaint: 'Severe abdominal pain',
    vitalSigns: {
      temperature: 101.2,
      bloodPressure: '140/90',
      heartRate: 95,
      respiratoryRate: 18,
      oxygenSaturation: 96,
      painLevel: 7,
      consciousness: 'alert',
      recordedAt: new Date('2024-01-15T15:15:00'),
      recordedBy: 'Triage Nurse'
    },
    arrivalTime: new Date('2024-01-15T15:15:00'),
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
    triageLevel: 'less_urgent',
    chiefComplaint: 'Minor laceration on forearm',
    vitalSigns: {
      temperature: 98.4,
      bloodPressure: '120/80',
      heartRate: 72,
      respiratoryRate: 16,
      oxygenSaturation: 98,
      painLevel: 3,
      consciousness: 'alert',
      recordedAt: new Date('2024-01-15T16:00:00'),
      recordedBy: 'Triage Nurse'
    },
    arrivalTime: new Date('2024-01-15T16:00:00'),
    assignedTo: 'Nurse Jennifer Adams',
    bedNumber: 'ER-08',
    status: 'discharged',
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

// Mock ICU Beds
export const mockICUBeds = [
  { id: '1', bedNumber: 'ICU-01', status: 'occupied', patientName: 'John Doe' },
  { id: '2', bedNumber: 'ICU-02', status: 'available', patientName: null },
  { id: '3', bedNumber: 'ICU-03', status: 'occupied', patientName: 'Jane Smith' },
  { id: '4', bedNumber: 'ICU-04', status: 'maintenance', patientName: null },
];

// Mock Triage Queue
export const mockTriageQueue = [
  { id: '1', patientName: 'Alice Johnson', priority: 'critical', waitTime: 5 },
  { id: '2', patientName: 'Bob Williams', priority: 'urgent', waitTime: 15 },
  { id: '3', patientName: 'Carol Brown', priority: 'standard', waitTime: 30 },
];

// Mock Critical Care Equipment
export const mockCriticalCareEquipment = [
  { id: '1', name: 'Ventilator', status: 'available', location: 'ICU-01' },
  { id: '2', name: 'Defibrillator', status: 'in_use', location: 'ER-03' },
  { id: '3', name: 'ECG Machine', status: 'available', location: 'ER-05' },
  { id: '4', name: 'Infusion Pump', status: 'maintenance', location: 'Storage' },
];

