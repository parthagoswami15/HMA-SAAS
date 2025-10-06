import { BaseEntity } from './common';
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

export type TriageLevel = 'immediate' | 'urgent' | 'less_urgent' | 'non_urgent';
export type EmergencyStatus = 'waiting' | 'in_treatment' | 'observation' | 'discharged' | 'admitted' | 'transferred';
export type Disposition = 'discharge_home' | 'admit_ward' | 'admit_icu' | 'transfer' | 'deceased' | 'left_ama';
export type ConsciousnessLevel = 'alert' | 'drowsy' | 'stuporous' | 'unconscious';

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