import { BaseEntity } from './common';
import { Patient } from './patient';
import { Staff } from './staff';

// Telemedicine Types
export interface TeleconsultationSession extends BaseEntity {
  sessionId: string;
  patientId: string;
  patient: Patient;
  doctorId: string;
  doctor: Staff;
  scheduledTime: Date;
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  platform: Platform;
  meetingLink: string;
  status: SessionStatus;
  notes?: string;
}

export interface RemoteMonitoringData extends BaseEntity {
  dataId: string;
  patientId: string;
  deviceType: DeviceType;
  measurements: Measurement[];
  recordedAt: Date;
  status: DataStatus;
}

export interface Measurement {
  parameter: string;
  value: number;
  unit: string;
  timestamp: Date;
  isAbnormal?: boolean;
}

export interface TelehealthStats {
  totalSessions: number;
  completedSessions: number;
  cancelledSessions: number;
  averageDuration: number;
  patientSatisfaction: number;
}

export type Platform = 'zoom' | 'teams' | 'google_meet' | 'custom';
export type SessionStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
export type DeviceType = 'blood_pressure' | 'glucose_meter' | 'pulse_oximeter' | 'weight_scale' | 'ecg';
export type DataStatus = 'normal' | 'abnormal' | 'critical';
