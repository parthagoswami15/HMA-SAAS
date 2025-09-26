import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { DimDate, DimFacility, DimProvider, DimService, DimPayer } from './dimensions.entity';

// Fact: Billing (Financial transactions)
@Entity('fact_billing')
export class FactBilling {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'uuid' })
  @Index()
  tenantId: string;

  // Dimensions
  @ManyToOne(() => DimDate)
  @JoinColumn({ name: 'date_id' })
  date: DimDate;

  @Column({ type: 'uuid' })
  @Index()
  dateId: string;

  @ManyToOne(() => DimFacility)
  @JoinColumn({ name: 'facility_id' })
  facility: DimFacility;

  @Column({ type: 'uuid' })
  @Index()
  facilityId: string;

  @ManyToOne(() => DimProvider, { nullable: true })
  @JoinColumn({ name: 'provider_id' })
  provider?: DimProvider;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  providerId?: string;

  @ManyToOne(() => DimService)
  @JoinColumn({ name: 'service_id' })
  service: DimService;

  @Column({ type: 'uuid' })
  @Index()
  serviceId: string;

  @ManyToOne(() => DimPayer, { nullable: true })
  @JoinColumn({ name: 'payer_id' })
  payer?: DimPayer;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  payerId?: string;

  // Measures
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  grossAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  discountAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  netAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  taxAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  paidAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  outstandingAmount: number;

  @Column({ type: 'int' })
  quantity: number;

  // References to source documents
  @Column({ type: 'uuid', nullable: true })
  @Index()
  invoiceId?: string;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  appointmentId?: string;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  admissionId?: string;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  labOrderId?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @Index()
  invoiceNumber?: string;

  @Column({ type: 'date', nullable: true })
  @Index()
  dueDate?: Date;

  @Column({ type: 'date', nullable: true })
  @Index()
  paymentDate?: Date;

  @Column({ type: 'varchar', length: 50 })
  paymentStatus: 'PAID' | 'PARTIAL' | 'PENDING' | 'OVERDUE' | 'CANCELLED';

  @Column({ type: 'varchar', length: 50, nullable: true })
  paymentMethod?: 'CASH' | 'CARD' | 'UPI' | 'CHEQUE' | 'INSURANCE' | 'BANK_TRANSFER';

  @Column({ type: 'boolean', default: false })
  isRefunded: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  refundAmount: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  notes?: string;
}

// Fact: Visits (Patient encounters)
@Entity('fact_visits')
export class FactVisits {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'uuid' })
  @Index()
  tenantId: string;

  // Dimensions
  @ManyToOne(() => DimDate)
  @JoinColumn({ name: 'date_id' })
  date: DimDate;

  @Column({ type: 'uuid' })
  @Index()
  dateId: string;

  @ManyToOne(() => DimFacility)
  @JoinColumn({ name: 'facility_id' })
  facility: DimFacility;

  @Column({ type: 'uuid' })
  @Index()
  facilityId: string;

  @ManyToOne(() => DimProvider, { nullable: true })
  @JoinColumn({ name: 'provider_id' })
  provider?: DimProvider;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  providerId?: string;

  @ManyToOne(() => DimService, { nullable: true })
  @JoinColumn({ name: 'service_id' })
  service?: DimService;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  serviceId?: string;

  // Measures
  @Column({ type: 'int' })
  patientCount: number;

  @Column({ type: 'int' })
  newPatients: number;

  @Column({ type: 'int' })
  followUpPatients: number;

  @Column({ type: 'int' })
  emergencyCases: number;

  @Column({ type: 'int' })
  scheduledAppointments: number;

  @Column({ type: 'int' })
  walkInAppointments: number;

  @Column({ type: 'int' })
  cancelledAppointments: number;

  @Column({ type: 'int' })
  noShowAppointments: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  averageWaitTime: number; // in minutes

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  averageConsultationTime: number; // in minutes

  @Column({ type: 'int' })
  totalConsultationMinutes: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  patientSatisfactionScore: number; // 1-5 scale

  @Column({ type: 'varchar', length: 100 })
  visitType: 'OPD' | 'IPD' | 'EMERGENCY' | 'FOLLOW_UP' | 'PREVENTIVE' | 'DIAGNOSTIC';

  @Column({ type: 'varchar', length: 50 })
  referralSource: 'DOCTOR' | 'HOSPITAL' | 'INTERNET' | 'WALK_IN' | 'OTHER';

  // References
  @Column({ type: 'uuid', nullable: true })
  @Index()
  patientId?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @Index()
  medicalRecordNumber?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  patientAgeGroup?: '0-18' | '19-35' | '36-50' | '51-65' | '65+';

  @Column({ type: 'varchar', length: 20, nullable: true })
  patientGender?: 'MALE' | 'FEMALE' | 'OTHER';
}

// Fact: Labs (Laboratory tests and results)
@Entity('fact_labs')
export class FactLabs {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'uuid' })
  @Index()
  tenantId: string;

  // Dimensions
  @ManyToOne(() => DimDate)
  @JoinColumn({ name: 'date_id' })
  date: DimDate;

  @Column({ type: 'uuid' })
  @Index()
  dateId: string;

  @ManyToOne(() => DimFacility)
  @JoinColumn({ name: 'facility_id' })
  facility: DimFacility;

  @Column({ type: 'uuid' })
  @Index()
  facilityId: string;

  @ManyToOne(() => DimProvider, { nullable: true })
  @JoinColumn({ name: 'ordering_provider_id' })
  orderingProvider?: DimProvider;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  orderingProviderId?: string;

  @ManyToOne(() => DimProvider, { nullable: true })
  @JoinColumn({ name: 'performing_provider_id' })
  performingProvider?: DimProvider;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  performingProviderId?: string;

  @ManyToOne(() => DimService)
  @JoinColumn({ name: 'service_id' })
  service: DimService;

  @Column({ type: 'uuid' })
  @Index()
  serviceId: string;

  @ManyToOne(() => DimPayer, { nullable: true })
  @JoinColumn({ name: 'payer_id' })
  payer?: DimPayer;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  payerId?: string;

  // Measures
  @Column({ type: 'int' })
  testCount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  grossAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  discountAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  netAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  paidAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  outstandingAmount: number;

  @Column({ type: 'int' })
  urgentTests: number;

  @Column({ type: 'int' })
  routineTests: number;

  @Column({ type: 'int' })
  statTests: number;

  @Column({ type: 'int' })
  completedTests: number;

  @Column({ type: 'int' })
  pendingTests: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  averageTAT: number; // Turnaround time in hours

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  withinTATPercentage: number; // % completed within TAT

  @Column({ type: 'varchar', length: 50 })
  testStatus: 'ORDERED' | 'COLLECTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'REJECTED';

  @Column({ type: 'varchar', length: 50 })
  priority: 'ROUTINE' | 'URGENT' | 'STAT' | 'ASAP';

  @Column({ type: 'varchar', length: 50 })
  testCategory: 'HEMATOLOGY' | 'BIOCHEMISTRY' | 'MICROBIOLOGY' | 'IMMUNOLOGY' | 'HISTOPATHOLOGY' | 'CYTOLOGY' | 'RADIOLOGY' | 'OTHER';

  @Column({ type: 'varchar', length: 100, nullable: true })
  sampleType?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  testMethod?: string;

  // References
  @Column({ type: 'uuid', nullable: true })
  @Index()
  labOrderId?: string;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  patientId?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @Index()
  labOrderNumber?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @Index()
  accessionNumber?: string;

  @Column({ type: 'date', nullable: true })
  @Index()
  collectedAt?: Date;

  @Column({ type: 'date', nullable: true })
  @Index()
  reportedAt?: Date;

  @Column({ type: 'boolean', default: false })
  isAbnormalResult: boolean;

  @Column({ type: 'boolean', default: false })
  isCriticalResult: boolean;
}
