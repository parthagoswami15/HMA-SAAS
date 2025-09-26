import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@app/common/entities/base.entity';
import { Visit } from './visit.entity';
import { Patient } from '../../../patient/entities/patient.entity';
import { Staff } from '../../../staff-management/entities/staff.entity';

@Entity('vitals')
export class Vitals extends BaseEntity {
  // id is inherited from BaseEntity

  @Column({ type: 'uuid' })
  visitId: string;

  @Column({ type: 'uuid' })
  patientId: string;

  @Column({ type: 'uuid', nullable: true })
  recordedById: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  recordedAt: Date;

  // Vital Signs
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  temperature: number; // in °C

  @Column({ type: 'int', nullable: true })
  heartRate: number; // bpm

  @Column({ type: 'varchar', length: 20, nullable: true })
  bloodPressure: string; // e.g., "120/80"

  @Column({ type: 'int', nullable: true })
  respiratoryRate: number; // breaths per minute

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  oxygenSaturation: number; // SpO2 %

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  height: number; // in cm

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  weight: number; // in kg

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  bmi: number; // BMI value

  @Column({ type: 'int', nullable: true })
  painScore: number; // 0-10 scale

  @Column({ type: 'jsonb', nullable: true })
  additionalMetrics: Record<string, any>; // For any facility-specific metrics

  @Column({ type: 'text', nullable: true })
  notes: string;

  // Relations
  @ManyToOne(() => Visit, (visit) => visit.vitals, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'visitId' })
  visit: Visit;

  @ManyToOne(() => Patient, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @ManyToOne(() => Staff, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'recordedById' })
  recordedBy: Staff;

  // Calculated fields
  calculateBMI(): void {
    if (this.height && this.weight) {
      const heightInMeters = this.height / 100; // convert cm to m
      this.bmi = this.weight / (heightInMeters * heightInMeters);
    }
  }

  // Helper method to get blood pressure components
  getBloodPressure() {
    if (!this.bloodPressure) return { systolic: null, diastolic: null };
    const [systolic, diastolic] = this.bloodPressure.split('/').map(Number);
    return { systolic, diastolic };
  }
}
