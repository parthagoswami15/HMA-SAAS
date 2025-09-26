import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

// Base entity with common fields
export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'uuid' })
  @Index()
  tenantId: string;
}

// Dimension: Date
@Entity('dim_date')
export class DimDate extends BaseEntity {
  @Column({ type: 'date' })
  @Index()
  date: Date;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'int' })
  month: number;

  @Column({ type: 'int' })
  day: number;

  @Column({ type: 'int' })
  quarter: number;

  @Column({ type: 'varchar', length: 20 })
  monthName: string;

  @Column({ type: 'varchar', length: 20 })
  dayOfWeek: string;

  @Column({ type: 'boolean' })
  isWeekend: boolean;

  @Column({ type: 'boolean' })
  isHoliday: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  holidayName?: string;

  @Column({ type: 'varchar', length: 20 })
  fiscalYear: string;

  @Column({ type: 'int' })
  fiscalQuarter: number;

  @Column({ type: 'int' })
  weekOfYear: number;
}

// Dimension: Facility (Tenant)
@Entity('dim_facility')
export class DimFacility extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ type: 'varchar', length: 20 })
  type: 'HOSPITAL' | 'CLINIC' | 'LAB' | 'PHARMACY' | 'OTHER';

  @Column({ type: 'varchar', length: 200, nullable: true })
  address?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  city?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  state?: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  pincode?: string;

  @Column({ type: 'int', default: 0 })
  totalBeds: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  licenseNumber?: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}

// Dimension: Provider (Doctor/Staff)
@Entity('dim_provider')
export class DimProvider extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 100 })
  employeeId: string;

  @Column({ type: 'varchar', length: 50 })
  specialization: string;

  @Column({ type: 'varchar', length: 100 })
  department: string;

  @Column({ type: 'varchar', length: 20 })
  type: 'DOCTOR' | 'NURSE' | 'TECHNICIAN' | 'ADMINISTRATIVE' | 'SUPPORT_STAFF';

  @Column({ type: 'varchar', length: 20, nullable: true })
  licenseNumber?: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;
}

// Dimension: Service
@Entity('dim_service')
export class DimService extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ type: 'varchar', length: 50 })
  category: 'OPD' | 'IPD' | 'LAB' | 'PHARMACY' | 'SURGERY' | 'DIAGNOSTIC' | 'OTHER';

  @Column({ type: 'varchar', length: 200, nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  basePrice: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  gstRate?: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isTaxable: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  cptCode?: string; // Current Procedural Terminology

  @Column({ type: 'varchar', length: 50, nullable: true })
  icdCode?: string; // International Classification of Diseases
}

// Dimension: Payer
@Entity('dim_payer')
export class DimPayer extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ type: 'varchar', length: 50 })
  type: 'INSURANCE' | 'CORPORATE' | 'GOVERNMENT' | 'CASH' | 'OTHER';

  @Column({ type: 'varchar', length: 100, nullable: true })
  policyNumber?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  tpaName?: string; // Third Party Administrator

  @Column({ type: 'date', nullable: true })
  policyStartDate?: Date;

  @Column({ type: 'date', nullable: true })
  policyEndDate?: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  coveragePercentage: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
