import { BaseEntity, Status } from './common';
import { Patient } from './patient';
import { Staff } from './staff';

export interface EmergencyCase extends BaseEntity {
  caseId: string;
  caseNumber: string;
  patientId: string;
  patient: Patient;
  arrivalTime: Date;
  triageLevel: TriageLevel;
  chiefComplaint: string;
  vitalSigns: EmergencyVitalSigns;
  assignedDoctor?: Staff;
  assignedNurse?: Staff;
  status: EmergencyStatus;
  disposition: Disposition;
  dischargTime?: Date;
  totalStayDuration?: number;
  treatmentNotes: string;
  medications: EmergencyMedication[];
  procedures: EmergencyProcedure[];
  consultations: EmergencyConsultation[];
}

export interface EmergencyVitalSigns {
  temperature: number;
  bloodPressure: string;
  heartRate: number;
  respiratoryRate: number;
  oxygenSaturation: number;
  painLevel: number;
  consciousness: ConsciousnessLevel;
  recordedAt: Date;
  recordedBy: string;
}

export interface ICUBed extends BaseEntity {
  bedId: string;
  bedNumber: string;
  ward: string;
  location: string;
  bedType: BedType;
  isOccupied: boolean;
  patientId?: string;
  patient?: Patient;
  admissionDate?: Date;
  equipment: ICUEquipment[];
  status: BedStatus;
  isolationRequired: boolean;
  isolationType?: string;
  lastCleaningDate: Date;
  maintenanceStatus: MaintenanceStatus;
}

export interface ICUEquipment {
  equipmentId: string;
  equipmentName: string;
  equipmentType: EquipmentType;
  isOperational: boolean;
  lastMaintenanceDate: Date;
  nextMaintenanceDate: Date;
}

export interface CriticalCareMonitoring extends BaseEntity {
  monitoringId: string;
  patientId: string;
  patient: Patient;
  bedId: string;
  startDate: Date;
  endDate?: Date;
  vitalSigns: CriticalVitalSigns[];
  medications: ICUMedication[];
  procedures: ICUProcedure[];
  assessments: NursingAssessment[];
  ventilatorSettings?: VentilatorSettings;
  fluidBalance: FluidBalance[];
  status: MonitoringStatus;
}

export interface CriticalVitalSigns {
  recordedAt: Date;
  temperature: number;
  bloodPressure: string;
  heartRate: number;
  respiratoryRate: number;
  oxygenSaturation: number;
  centralVenousPressure?: number;
  intracranialPressure?: number;
  cardiacOutput?: number;
  glasgowComaScale?: number;
  recordedBy: string;
}

export type TriageLevel = 'immediate' | 'urgent' | 'less_urgent' | 'non_urgent';
export type EmergencyStatus = 'waiting' | 'in_treatment' | 'observation' | 'discharged' | 'admitted' | 'transferred';
export type Disposition = 'discharge_home' | 'admit_ward' | 'admit_icu' | 'transfer' | 'deceased' | 'left_ama';
export type ConsciousnessLevel = 'alert' | 'drowsy' | 'stuporous' | 'unconscious';
export type BedType = 'general_icu' | 'cardiac_icu' | 'neuro_icu' | 'pediatric_icu' | 'isolation';
export type BedStatus = 'available' | 'occupied' | 'cleaning' | 'maintenance' | 'blocked';
export type EquipmentType = 'ventilator' | 'monitor' | 'infusion_pump' | 'dialysis' | 'defibrillator';
export type MaintenanceStatus = 'good' | 'needs_maintenance' | 'under_maintenance' | 'out_of_order';
export type MonitoringStatus = 'active' | 'completed' | 'transferred' | 'discharged';

export interface EmergencyMedication {
  medicationId: string;
  medicationName: string;
  dosage: string;
  route: string;
  administeredAt: Date;
  administeredBy: string;
}

export interface EmergencyProcedure {
  procedureId: string;
  procedureName: string;
  performedAt: Date;
  performedBy: string;
  notes: string;
}

export interface EmergencyConsultation {
  consultationId: string;
  department: string;
  consultant: Staff;
  requestedAt: Date;
  consultedAt?: Date;
  recommendations: string;
}

export interface ICUMedication {
  medicationId: string;
  medicationName: string;
  dosage: string;
  route: string;
  frequency: string;
  startDate: Date;
  endDate?: Date;
  administeredBy: string;
  notes?: string;
}

export interface ICUProcedure {
  procedureId: string;
  procedureName: string;
  performedAt: Date;
  performedBy: string;
  assistants: string[];
  indications: string;
  complications?: string;
  outcome: string;
}

export interface NursingAssessment {
  assessmentId: string;
  assessmentDate: Date;
  assessedBy: string;
  neurological: string;
  cardiovascular: string;
  respiratory: string;
  gastrointestinal: string;
  genitourinary: string;
  skin: string;
  pain: number;
  mobility: string;
  nutrition: string;
  notes: string;
}

export interface VentilatorSettings {
  mode: string;
  tidalVolume: number;
  respiratoryRate: number;
  peep: number;
  fio2: number;
  pressureSupport?: number;
  lastUpdated: Date;
  updatedBy: string;
}

export interface FluidBalance {
  date: Date;
  fluidIntake: number;
  fluidOutput: number;
  balance: number;
  recordedBy: string;
  notes?: string;
}