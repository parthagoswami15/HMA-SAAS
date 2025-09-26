import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Ward } from './ward.entity';
import { Admission } from './admission.entity';

export enum BedStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  MAINTENANCE = 'MAINTENANCE',
  RESERVED = 'RESERVED'
}

export enum BedClass {
  GENERAL = 'GENERAL',
  DELUXE = 'DELUXE',
  PRIVATE = 'PRIVATE',
  ICU = 'ICU',
  ICCU = 'ICCU',
  PICU = 'PICU',
  NICU = 'NICU'
}

@Entity('beds')
export class Bed {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bedNumber: string;

  @Column({ type: 'uuid' })
  wardId: string;

  @ManyToOne(() => Ward, ward => ward.beds, { eager: true })
  @JoinColumn({ name: 'wardId' })
  ward: Ward;

  @Column({ type: 'enum', enum: BedClass, default: BedClass.GENERAL })
  class: BedClass;

  @Column({ type: 'enum', enum: BedStatus, default: BedStatus.AVAILABLE })
  status: BedStatus;

  @Column({ type: 'boolean', default: false })
  isIsolation: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  tariffPerDay: number;

  @Column({ type: 'jsonb', nullable: true })
  features: {
    hasOxygen: boolean;
    hasMonitor: boolean;
    hasVentilator: boolean;
    isWheelchairAccessible: boolean;
    // Add more features as needed
  };

  @Column({ type: 'text', nullable: true })
  notes: string;

  @OneToOne(() => Admission, admission => admission.bed, { nullable: true })
  currentAdmission: Admission;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
