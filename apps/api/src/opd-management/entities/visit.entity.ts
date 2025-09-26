import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@app/common/entities/base.entity';
import { Patient } from '../../../patient/entities/patient.entity';
import { Staff } from '../../../staff-management/entities/staff.entity';
import { VisitStatus, VisitType } from '../enums';
import { Vitals } from './vitals.entity';

@Entity('visits')
export class Visit extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Unique identifier for the visit' })
  id: string;

  @ManyToOne(() => Patient, (patient) => patient.visits)
  @ApiProperty({ description: 'Patient this visit belongs to' })
  patient: Patient;

  @Column({ type: 'uuid' })
  patientId: string;

  @ManyToOne(() => Staff, (staff) => staff.visits)
  @ApiProperty({ description: 'Doctor assigned to this visit' })
  doctor: Staff;

  @Column({ type: 'uuid' })
  doctorId: string;

  @Column({
    type: 'enum',
    enum: VisitType,
    default: VisitType.OPD
  })
  @ApiProperty({ enum: VisitType, default: VisitType.OPD })
  type: VisitType;

  @Column({
    type: 'enum',
    enum: VisitStatus,
    default: VisitStatus.REGISTERED
  })
  @ApiProperty({ enum: VisitStatus, default: VisitStatus.REGISTERED })
  status: VisitStatus;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({ description: 'Date and time when the visit was registered', type: Date })
  registeredAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  @ApiProperty({ description: 'Scheduled date and time for the visit', type: Date, required: false })
  scheduledAt?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  @ApiProperty({ description: 'Date and time when the visit started', type: Date, required: false })
  startedAt?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  @ApiProperty({ description: 'Date and time when the visit was completed', type: Date, required: false })
  completedAt?: Date;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Reason for the visit', required: false })
  chiefComplaint?: string;

  @ManyToOne(() => Staff)
  @ApiProperty({ description: 'Staff who registered the visit', required: false })
  registeredBy?: Staff;

  @Column({ type: 'uuid', nullable: true })
  registeredById?: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Additional notes about the visit', required: false })
  notes?: string;

  @Column({ type: 'jsonb', nullable: true })
  @ApiProperty({ description: 'Metadata for the visit', type: Object, required: false })
  metadata?: Record<string, any>;

  @OneToMany(() => Vitals, (vitals) => vitals.visit, { cascade: true })
  vitals: Vitals[];

  // BaseEntity already includes createdAt, updatedAt, deletedAt
}
