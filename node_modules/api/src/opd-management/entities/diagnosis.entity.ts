import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { Icd10Code } from './icd10-code.entity';
import { Encounter } from './encounter.entity';
import { Patient } from '../../patient/entities/patient.entity';
import { Staff } from '../../staff-management/entities/staff.entity';

export enum DiagnosisStatus {
  ACTIVE = 'active',
  RESOLVED = 'resolved',
  RULED_OUT = 'ruled_out',
  CHRONIC = 'chronic',
  RECURRED = 'recurred',
}

export enum DiagnosisType {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  ADMISSION = 'admission',
  DISCHARGE = 'discharge',
  CHRONIC = 'chronic',
  PROCEDURAL = 'procedural',
}

@Entity('diagnoses')
export class Diagnosis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  patientId: string;

  @Column({ type: 'varchar', length: 10 })
  icd10Code: string;

  @Column({ type: 'uuid', nullable: true })
  encounterId: string | null;

  @Column({ type: 'uuid', nullable: true })
  recordedById: string | null;

  @Column({ type: 'enum', enum: DiagnosisStatus, default: DiagnosisStatus.ACTIVE })
  status: DiagnosisStatus;

  @Column({ type: 'enum', enum: DiagnosisType, default: DiagnosisType.SECONDARY })
  type: DiagnosisType;

  @Column({ type: 'boolean', default: false })
  isPrimary: boolean;

  @Column({ type: 'date', nullable: true })
  onsetDate: Date | null;

  @Column({ type: 'date', nullable: true })
  resolvedDate: Date | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any> | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  updatedById: string | null;

  // Relations
  @ManyToOne(() => Icd10Code, { eager: true })
  @JoinColumn({ name: 'icd10Code', referencedColumnName: 'code' })
  icd10: Icd10Code;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @ManyToOne(() => Encounter, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'encounterId' })
  encounter: Encounter | null;

  @ManyToOne(() => Staff, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'recordedById' })
  recordedBy: Staff | null;

  @ManyToOne(() => Staff, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'updatedById' })
  updatedBy: Staff | null;

  // Helper methods
  isActive(): boolean {
    return this.status === DiagnosisStatus.ACTIVE || this.status === DiagnosisStatus.CHRONIC;
  }

  resolve(resolvedDate: Date = new Date()): void {
    this.status = DiagnosisStatus.RESOLVED;
    this.resolvedDate = resolvedDate;
  }

  reactivate(): void {
    if (this.status === DiagnosisStatus.RESOLVED || this.status === DiagnosisStatus.RULED_OUT) {
      this.status = DiagnosisStatus.RECURRED;
      this.resolvedDate = null;
    }
  }
}
