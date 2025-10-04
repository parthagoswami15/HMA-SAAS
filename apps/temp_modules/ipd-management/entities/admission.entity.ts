import { Entity, Column, ManyToOne, JoinColumn, OneToMany, OneToOne, Index } from 'typeorm';
import { Patient } from '../../patients/entities/patient.entity';
import { Staff } from '../../staff/entities/staff.entity';
import { Bed } from './bed.entity';
import { Discharge } from './discharge.entity';
import { AdmissionType } from '../enums/admission-type.enum';
import { AdmissionStatus } from '../enums/admission-status.enum';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('admissions')
@Index(['patientId', 'status'])
@Index(['bedId', 'status'])
@Index(['admittingDoctorId', 'admissionDate'])
export class Admission extends BaseEntity {

  @Column({ type: 'uuid' })
  patientId: string;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column({ type: 'uuid' })
  admittingDoctorId: string;

  @ManyToOne(() => Staff)
  @JoinColumn({ name: 'admittingDoctorId' })
  admittingDoctor: Staff;

  @Column({ type: 'uuid' })
  bedId: string;

  @ManyToOne(() => Bed, { eager: true })
  @JoinColumn({ name: 'bedId' })
  bed: Bed;

  @Column({ type: 'enum', enum: AdmissionType })
  admissionType: AdmissionType;

  @Column({ type: 'enum', enum: AdmissionStatus, default: AdmissionStatus.ADMITTED })
  status: AdmissionStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  admissionDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  dischargeDate: Date;

  @Column({ type: 'text', nullable: true })
  admissionNotes: string;

  @Column({ type: 'text', nullable: true })
  diagnosis: string;

  @Column({ type: 'jsonb', nullable: true })
  insuranceInfo: any;

  @Column({ type: 'boolean', default: false })
  isSelfDischarge: boolean;

  @Column({ type: 'text', nullable: true })
  selfDischargeReason: string;

  @OneToOne(() => Discharge, discharge => discharge.admission, { cascade: true })
  discharge: Discharge;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
