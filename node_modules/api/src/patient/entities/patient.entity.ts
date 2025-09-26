import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '@app/common/entities/base.entity';
import { Visit } from '@app/opd-management/entities/visit.entity';

@Entity('patients')
export class Patient extends BaseEntity {

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

  @Column({ type: 'jsonb', nullable: true })
  medicalHistory?: Array<{
    condition: string;
    diagnosisDate: Date;
    status: 'ACTIVE' | 'INACTIVE' | 'RESOLVED';
    notes?: string;
  }>;

  @Column({ type: 'jsonb', nullable: true })
  allergies?: Array<{
    name: string;
    severity: 'MILD' | 'MODERATE' | 'SEVERE';
    reaction: string;
  }>;

  @Column({ type: 'jsonb', nullable: true })
  medications?: Array<{
    name: string;
    dosage: string;
    frequency: string;
    startDate: Date;
    endDate?: Date;
    prescribedBy: string;
    notes?: string;
  }>;

  @Column({ type: 'jsonb', nullable: true })
  emergencyContacts?: Array<{
    name: string;
    relationship: string;
    phoneNumber: string;
    email?: string;
    address?: string;
    isPrimary: boolean;
  }>;

  @Column({ type: 'jsonb', nullable: true })
  documents?: Array<{
    type: string;
    url: string;
    name: string;
    uploadedAt: Date;
  }>;

  @Column({ type: 'boolean', default: true })
  isActive: boolean = true;

  @OneToMany(() => Visit, (visit) => visit.patient)
  visits!: Visit[];
}
