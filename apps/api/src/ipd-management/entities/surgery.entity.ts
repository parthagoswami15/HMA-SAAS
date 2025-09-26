import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Patient } from '../../patients/entities/patient.entity';
import { Staff } from '../../staff/entities/staff.entity';
import { Admission } from './admission.entity';

export enum SurgeryStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  POSTPONED = 'POSTPONED'
}

export enum SurgeryType {
  MAJOR = 'MAJOR',
  MINOR = 'MINOR',
  INTERVENTIONAL = 'INTERVENTIONAL',
  DIAGNOSTIC = 'DIAGNOSTIC'
}

@Entity('surgeries')
export class Surgery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  patientId: string;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column({ type: 'uuid' })
  admissionId: string;

  @ManyToOne(() => Admission)
  @JoinColumn({ name: 'admissionId' })
  admission: Admission;

  @Column({ type: 'varchar', length: 255 })
  procedureName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: SurgeryType })
  type: SurgeryType;

  @Column({ type: 'enum', enum: SurgeryStatus, default: SurgeryStatus.SCHEDULED })
  status: SurgeryStatus;

  @Column({ type: 'timestamp' })
  scheduledDate: Date;

  @Column({ type: 'integer', nullable: true }) // in minutes
  estimatedDuration: number;

  @Column({ type: 'uuid' })
  surgeonId: string;

  @ManyToOne(() => Staff)
  @JoinColumn({ name: 'surgeonId' })
  surgeon: Staff;

  @Column({ type: 'uuid', nullable: true })
  anesthetistId: string;

  @ManyToOne(() => Staff, { nullable: true })
  @JoinColumn({ name: 'anesthetistId' })
  anesthetist: Staff;

  @Column({ type: 'uuid', nullable: true })
  assistantSurgeonId: string;

  @ManyToOne(() => Staff, { nullable: true })
  @JoinColumn({ name: 'assistantSurgeonId' })
  assistantSurgeon: Staff;

  @Column({ type: 'varchar', length: 100, nullable: true })
  theaterRoom: string;

  @Column({ type: 'jsonb', nullable: true })
  preOpDiagnosis: any;

  @Column({ type: 'jsonb', nullable: true })
  postOpDiagnosis: any;

  @Column({ type: 'text', nullable: true })
  procedureNotes: string;

  @Column({ type: 'text', nullable: true })
  anesthesiaNotes: string;

  @Column({ type: 'jsonb', nullable: true })
  complications: string[];

  @Column({ type: 'jsonb', nullable: true })
  implants: Array<{
    name: string;
    model: string;
    serialNumber: string;
    manufacturer: string;
    lotNumber: string;
    expiryDate: Date;
  }>;

  @Column({ type: 'jsonb', nullable: true })
  consumables: Array<{
    itemId: string;
    name: string;
    quantity: number;
    unit: string;
    batchNumber?: string;
  }>;

  @Column({ type: 'timestamp', nullable: true })
  startTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  endTime: Date;

  @Column({ type: 'text', nullable: true })
  outcome: string;

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
