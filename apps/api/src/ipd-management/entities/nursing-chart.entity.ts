import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Patient } from '../../patients/entities/patient.entity';
import { Staff } from '../../staff/entities/staff.entity';

export enum VitalSigns {
  TEMPERATURE = 'TEMPERATURE',
  PULSE = 'PULSE',
  RESPIRATION = 'RESPIRATION',
  BLOOD_PRESSURE = 'BLOOD_PRESSURE',
  OXYGEN_SATURATION = 'OXYGEN_SATURATION',
  PAIN_SCORE = 'PAIN_SCORE',
  GLUCOSE_LEVEL = 'GLUCOSE_LEVEL',
  GCS = 'GCS', // Glasgow Coma Scale
  HEIGHT = 'HEIGHT',
  WEIGHT = 'WEIGHT',
  BMI = 'BMI'
}

@Entity('nursing_charts')
export class NursingChart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  patientId: string;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column({ type: 'uuid' })
  recordedById: string;

  @ManyToOne(() => Staff)
  @JoinColumn({ name: 'recordedById' })
  recordedBy: Staff;

  @Column({ type: 'enum', enum: VitalSigns })
  vitalSign: VitalSigns;

  @Column({ type: 'varchar', length: 50 })
  value: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  unit: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'jsonb', nullable: true })
  additionalData: any;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  recordedAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // Soft delete
  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;
}
