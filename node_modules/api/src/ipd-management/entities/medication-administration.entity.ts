import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Patient } from '../../patients/entities/patient.entity';
import { Staff } from '../../staff/entities/staff.entity';
import { Admission } from './admission.entity';

export enum MedicationStatus {
  PENDING = 'PENDING',
  ADMINISTERED = 'ADMINISTERED',
  REFUSED = 'REFUSED',
  MISSED = 'MISSED',
  HOLD = 'HOLD',
  CANCELLED = 'CANCELLED'
}

@Entity('medication_administrations')
export class MedicationAdministration {
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

  @Column({ type: 'uuid' })
  medicationOrderId: string; // Reference to the medication order

  @Column({ type: 'varchar', length: 255 })
  medicationName: string;

  @Column({ type: 'varchar', length: 50 })
  dosage: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  route: string; // e.g., ORAL, IV, IM, SC

  @Column({ type: 'varchar', length: 50, nullable: true })
  frequency: string;

  @Column({ type: 'timestamp' })
  scheduledTime: Date;

  @Column({ type: 'enum', enum: MedicationStatus, default: MedicationStatus.PENDING })
  status: MedicationStatus;

  @Column({ type: 'timestamp', nullable: true })
  administeredAt: Date;

  @Column({ type: 'uuid', nullable: true })
  administeredById: string;

  @ManyToOne(() => Staff, { nullable: true })
  @JoinColumn({ name: 'administeredById' })
  administeredBy: Staff;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'jsonb', nullable: true })
  vitalSigns: {
    bloodPressure?: string;
    pulse?: number;
    temperature?: number;
    respiration?: number;
    // Add other relevant vitals
  };

  @Column({ type: 'boolean', default: false })
  isPRN: boolean; // As needed medication

  @Column({ type: 'varchar', length: 100, nullable: true })
  prnReason: string;

  @Column({ type: 'boolean', default: false })
  isStat: boolean; // Immediate/emergency medication

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // For audit trail
  @Column({ type: 'jsonb', nullable: true })
  auditLog: Array<{
    timestamp: Date;
    action: string;
    performedById: string;
    performedBy: string;
    changes: Record<string, any>;
  }>;
}
