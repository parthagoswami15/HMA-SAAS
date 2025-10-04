import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Patient } from '../../patients/entities/patient.entity';
import { Staff } from '../../staff/entities/staff.entity';
import { Admission } from './admission.entity';

export enum DischargeStatus {
  INITIATED = 'INITIATED',
  BILLING_PENDING = 'BILLING_PENDING',
  BILLING_COMPLETED = 'BILLING_COMPLETED',
  MEDICATION_PENDING = 'MEDICATION_PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum DischargeType {
  ROUTINE = 'ROUTINE',
  REFERRAL = 'REFERRAL',
  LAMA = 'LAMA', // Left Against Medical Advice
  DAMA = 'DAMA', // Discharged Against Medical Advice
  ABSCONDED = 'ABSCONDED',
  DECEASED = 'DECEASED'
}

@Entity('discharges')
export class Discharge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  admissionId: string;

  @OneToOne(() => Admission, admission => admission.discharge, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'admissionId' })
  admission: Admission;

  @Column({ type: 'uuid' })
  patientId: string;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column({ type: 'uuid' })
  dischargedById: string;

  @ManyToOne(() => Staff)
  @JoinColumn({ name: 'dischargedById' })
  dischargedBy: Staff;

  @Column({ type: 'enum', enum: DischargeType })
  dischargeType: DischargeType;

  @Column({ type: 'enum', enum: DischargeStatus, default: DischargeStatus.INITIATED })
  status: DischargeStatus;

  @Column({ type: 'timestamp' })
  dischargeDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  actualDischargeDate: Date;

  @Column({ type: 'text', nullable: true })
  diagnosisAtDischarge: string;

  @Column({ type: 'text', nullable: true })
  proceduresPerformed: string;

  @Column({ type: 'text', nullable: true })
  hospitalCourse: string;

  @Column({ type: 'text', nullable: true })
  conditionAtDischarge: string;

  @Column({ type: 'text', nullable: true })
  followUpPlan: string;

  @Column({ type: 'text', nullable: true })
  patientEducation: string;

  @Column({ type: 'jsonb', nullable: true })
  dischargeMedications: Array<{
    medicationId: string;
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }>;

  @Column({ type: 'jsonb', nullable: true })
  followUpAppointments: Array<{
    date: Date;
    department: string;
    doctorId: string;
    notes: string;
  }>;

  @Column({ type: 'boolean', default: false })
  isBillSettled: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalBillAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  amountPaid: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  pendingAmount: number;

  @Column({ type: 'text', nullable: true })
  billingNotes: string;

  @Column({ type: 'text', nullable: true })
  cancellationReason: string;

  @Column({ type: 'uuid', nullable: true })
  cancelledById: string;

  @ManyToOne(() => Staff, { nullable: true })
  @JoinColumn({ name: 'cancelledById' })
  cancelledBy: Staff;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt: Date;

  @Column({ type: 'boolean', default: false })
  isDeathCase: boolean;

  @Column({ type: 'jsonb', nullable: true })
  deathDetails: {
    timeOfDeath: Date;
    causeOfDeath: string;
    deathCertificateNumber: string;
    reportedBy: string;
    reportedById: string;
    notes: string;
  };

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // Audit trail
  @Column({ type: 'jsonb', nullable: true })
  auditLog: Array<{
    timestamp: Date;
    action: string;
    performedById: string;
    performedBy: string;
    changes: Record<string, any>;
  }>;
}
