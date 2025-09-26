import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '@app/common/entities/base.entity';
import { Visit } from '@app/opd-management/entities/visit.entity';

export enum StaffRole {
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  ADMIN = 'ADMIN',
  RECEPTIONIST = 'RECEPTIONIST',
  PHARMACIST = 'PHARMACIST',
  LAB_TECHNICIAN = 'LAB_TECHNICIAN',
  ACCOUNTANT = 'ACCOUNTANT',
  OTHER = 'OTHER',
}

@Entity('staff')
export class Staff extends BaseEntity {

  // id is inherited from BaseEntity

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  phoneNumber!: string;

  @Column({ type: 'date' })
  dateOfBirth!: Date;

  @Column()
  gender!: string;

  @Column({ type: 'jsonb' })
  address!: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };

  @Column({ type: 'enum', enum: StaffRole, default: StaffRole.OTHER })
  role!: StaffRole;

  @Column()
  department!: string;

  @Column({ nullable: true })
  specialization?: string;

  @Column()
  qualification!: string;

  @Column({ type: 'date' })
  joiningDate!: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  salary?: number;

  @Column({ type: 'jsonb', nullable: true })
  emergencyContact?: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  documents?: Array<{
    type: string;
    url: string;
    name: string;
    uploadedAt: Date;
  }>;

  @Column({ type: 'boolean', default: false })
  isAdmin: boolean = false;

  @OneToMany(() => Visit, (visit) => visit.doctor, { cascade: true })
  visits!: Visit[];
}
