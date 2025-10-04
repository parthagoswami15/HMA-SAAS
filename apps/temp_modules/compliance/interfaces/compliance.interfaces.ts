export interface AadhaarRecord {
  id: string;
  patientId: string;
  aadhaarNumber: string;
  maskedAadhaar: string;
  hashedAadhaar: string;
  consentGiven: boolean;
  consentDetails?: string;
  consentDate: Date;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BirthRegistration {
  id: string;
  patientId: string;
  hospitalId: string;
  registrationNumber: string;
  birthDetails: any;
  parentDetails: any;
  witnesses?: any;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvalComments?: string;
  approvedBy?: string;
  approvedAt?: Date;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeathRegistration {
  id: string;
  patientId: string;
  hospitalId: string;
  registrationNumber: string;
  deathDetails: any;
  deceasedDetails: any;
  informantDetails: any;
  witnesses?: any;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvalComments?: string;
  approvedBy?: string;
  approvedAt?: Date;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  medications: any;
  diagnosis?: string;
  isEmergency: boolean;
  validTill?: Date;
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED';
  cancellationReason?: string;
  cancelledAt?: Date;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrescriptionMedication {
  id: string;
  prescriptionId: string;
  drugName: string;
  genericName?: string;
  strength: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  instructions?: string;
  isScheduledDrug: boolean;
  scheduleCategory?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NarcoticsRegister {
  id: string;
  prescriptionId: string;
  drugName: string;
  batchNumber: string;
  dispensedBy: string;
  witnessName: string;
  witnessSignature: string;
  patientSignature: string;
  remarks?: string;
  dispensedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId?: string;
  userId: string;
  oldValues?: any;
  newValues?: any;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  createdAt: Date;
}

export interface PcPndtAccessRequest {
  id: string;
  userId: string;
  patientId: string;
  procedureType: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'DENIED';
  denialReason?: string;
  requestedAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
  deniedBy?: string;
  deniedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PcPndtAccessLog {
  id: string;
  requestId: string;
  userId: string;
  patientId: string;
  procedureType: string;
  accessedAt: Date;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface UserCertification {
  id: string;
  userId: string;
  certificationType: string;
  certificateNumber: string;
  issuedBy: string;
  issuedDate: Date;
  validTill: Date;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  createdAt: Date;
  updatedAt: Date;
}

export interface DataCenter {
  id: string;
  name: string;
  location: string;
  isInIndia: boolean;
  complianceLevel: string;
  isActive: boolean;
  capacity: number;
  currentLoad: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DataEncryption {
  id: string;
  entityType: string;
  entityId: string;
  encryptionType: string;
  keyId: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}

export interface AccessControl {
  id: string;
  entityType: string;
  entityId: string;
  userId: string;
  permission: string;
  grantedBy: string;
  grantedAt: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ComplianceReport {
  id: string;
  reportType: string;
  period: string;
  generatedBy: string;
  data: any;
  status: 'GENERATED' | 'APPROVED' | 'ARCHIVED';
  generatedAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
