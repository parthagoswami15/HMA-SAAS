import { BaseEntity, Address, ContactInfo, Gender, BloodGroup, MaritalStatus, Status } from './common';

// Patient related interfaces
export interface Patient extends BaseEntity {
  // Basic Information
  patientId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  age: number;
  gender: Gender;
  bloodGroup?: BloodGroup;
  maritalStatus?: MaritalStatus;
  
  // Contact Information
  contactInfo: ContactInfo;
  address: Address;
  
  // Identity Documents (Optional - Aadhaar optional policy)
  aadhaarNumber?: string;
  otherIdNumber?: string;
  otherIdType?: 'pan' | 'passport' | 'driving_license' | 'voter_id';
  
  // Medical Information
  allergies: string[];
  chronicDiseases: string[];
  currentMedications: string[];
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  
  // Insurance Information
  insuranceInfo?: InsuranceInfo;
  
  // System fields
  status: Status;
  registrationDate: Date;
  lastVisitDate?: Date;
  totalVisits: number;
  
  // Additional metadata
  occupation?: string;
  religion?: string;
  language?: string;
  notes?: string;
}

export interface InsuranceInfo {
  insuranceType: 'government' | 'private' | 'corporate';
  insuranceProvider: string;
  policyNumber: string;
  policyHolderName: string;
  relationshipToPatient: string;
  validFrom: Date;
  validTo: Date;
  coverageAmount: number;
  isActive: boolean;
}

// Patient Visit/Encounter
export interface PatientVisit extends BaseEntity {
  visitId: string;
  patientId: string;
  visitType: 'opd' | 'ipd' | 'emergency' | 'teleconsultation';
  visitDate: Date;
  chiefComplaint: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  
  // Doctor/Department Information
  doctorId?: string;
  doctorName?: string;
  departmentId: string;
  departmentName: string;
  
  // Clinical Information
  vitals?: VitalSigns;
  diagnosis: string[];
  treatmentPlan: string;
  prescriptions: Prescription[];
  orders: MedicalOrder[];
  
  // Follow-up
  followUpDate?: Date;
  followUpInstructions?: string;
  
  // Billing
  totalAmount?: number;
  paidAmount?: number;
  pendingAmount?: number;
  
  // Additional notes
  notes?: string;
}

export interface VitalSigns {
  temperature?: number; // in Celsius
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number; // BPM
  respiratoryRate?: number;
  oxygenSaturation?: number; // %
  height?: number; // in cm
  weight?: number; // in kg
  bmi?: number;
  painScale?: number; // 1-10
  recordedAt: Date;
  recordedBy: string;
}

export interface Prescription {
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  quantity: number;
  isGeneric?: boolean;
  isDispensed?: boolean;
  dispensedDate?: Date;
}

export interface MedicalOrder {
  orderType: 'lab' | 'radiology' | 'procedure' | 'consultation';
  orderName: string;
  orderCode?: string;
  priority: 'routine' | 'urgent' | 'stat';
  status: 'ordered' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  orderedDate: Date;
  scheduledDate?: Date;
  completedDate?: Date;
  notes?: string;
}

// Medical History
export interface MedicalHistory extends BaseEntity {
  patientId: string;
  historyType: 'medical' | 'surgical' | 'family' | 'social' | 'allergy';
  title: string;
  description: string;
  date?: Date;
  isActive: boolean;
  severity?: 'mild' | 'moderate' | 'severe';
}

// Patient Documents
export interface PatientDocument extends BaseEntity {
  patientId: string;
  documentType: 'id_proof' | 'medical_report' | 'lab_result' | 'radiology' | 'prescription' | 'insurance' | 'consent' | 'other';
  title: string;
  description?: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: Date;
  isActive: boolean;
}

// Patient Appointment
export interface PatientAppointment extends BaseEntity {
  appointmentId: string;
  patientId: string;
  doctorId: string;
  departmentId: string;
  appointmentDate: Date;
  appointmentTime: string;
  duration: number; // in minutes
  appointmentType: 'consultation' | 'follow_up' | 'procedure' | 'emergency';
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled';
  chiefComplaint?: string;
  notes?: string;
  
  // Reminder settings
  reminderSent?: boolean;
  reminderSentAt?: Date;
  
  // Cancellation/Rescheduling
  cancelledAt?: Date;
  cancelledBy?: string;
  cancellationReason?: string;
  rescheduledFrom?: Date;
  rescheduledReason?: string;
}

// Search and Filter types
export interface PatientSearchParams {
  query?: string;
  patientId?: string;
  phoneNumber?: string;
  aadhaarNumber?: string;
  dateOfBirth?: Date;
  bloodGroup?: BloodGroup;
  gender?: Gender;
  age?: {
    min?: number;
    max?: number;
  };
  registrationDate?: {
    from?: Date;
    to?: Date;
  };
  lastVisitDate?: {
    from?: Date;
    to?: Date;
  };
  status?: Status;
  hasInsurance?: boolean;
  department?: string;
  doctor?: string;
}

export interface PatientListItem {
  id: string;
  patientId: string;
  fullName: string;
  age: number;
  gender: Gender;
  phoneNumber: string;
  lastVisitDate?: Date;
  totalVisits: number;
  status: Status;
  hasInsurance: boolean;
  emergencyFlag?: boolean;
}

// Patient statistics
export interface PatientStats {
  totalPatients: number;
  newPatientsToday: number;
  newPatientsThisMonth: number;
  activePatients: number;
  averageAge: number;
  genderDistribution: {
    male: number;
    female: number;
    other: number;
  };
  bloodGroupDistribution: Record<BloodGroup, number>;
  insuranceDistribution: {
    insured: number;
    uninsured: number;
  };
  visitTrends: {
    date: string;
    count: number;
  }[];
}