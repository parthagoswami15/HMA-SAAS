import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

// Report Configuration
@Entity('report_config')
export class ReportConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'uuid' })
  @Index()
  tenantId: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 200 })
  description: string;

  @Column({ type: 'varchar', length: 50 })
  category: 'FINANCIAL' | 'CLINICAL' | 'OPERATIONAL' | 'PATIENT' | 'CUSTOM';

  @Column({ type: 'varchar', length: 50 })
  type: 'TABULAR' | 'CHART' | 'DASHBOARD' | 'KPI' | 'TREND';

  @Column({ type: 'jsonb' })
  configuration: {
    dataSource: 'BILLING' | 'VISITS' | 'LABS' | 'PATIENTS' | 'STAFF' | 'INVENTORY';
    dimensions: string[];
    measures: string[];
    filters: Record<string, any>;
    groupBy: string[];
    orderBy: Record<string, 'ASC' | 'DESC'>;
    aggregations: Record<string, 'SUM' | 'AVG' | 'COUNT' | 'MIN' | 'MAX'>;
    chartType?: 'BAR' | 'LINE' | 'PIE' | 'AREA' | 'SCATTER' | 'GAUGE';
    chartConfig?: Record<string, any>;
  };

  @Column({ type: 'jsonb', nullable: true })
  parameters?: Record<string, any>;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isPublic: boolean;

  @Column({ type: 'varchar', length: 50 })
  accessLevel: 'PRIVATE' | 'DEPARTMENT' | 'TENANT' | 'PUBLIC';

  @Column({ type: 'uuid', nullable: true })
  @Index()
  createdBy?: string;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  updatedBy?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  tags?: string;

  @Column({ type: 'int', default: 0 })
  usageCount: number;

  @Column({ type: 'date', nullable: true })
  lastUsedAt?: Date;

  // Relations
  @OneToMany(() => ReportSchedule, schedule => schedule.report)
  schedules: ReportSchedule[];

  @OneToMany(() => SavedReport, savedReport => savedReport.report)
  savedReports: SavedReport[];
}

// Report Schedule for Email
@Entity('report_schedule')
export class ReportSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'uuid' })
  @Index()
  tenantId: string;

  @ManyToOne(() => ReportConfig)
  @JoinColumn({ name: 'report_id' })
  report: ReportConfig;

  @Column({ type: 'uuid' })
  @Index()
  reportId: string;

  @Column({ type: 'varchar', length: 50 })
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'MANUAL';

  @Column({ type: 'varchar', length: 20, nullable: true })
  dayOfWeek?: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

  @Column({ type: 'int', nullable: true })
  dayOfMonth?: number;

  @Column({ type: 'time' })
  scheduledTime: string;

  @Column({ type: 'varchar', length: 20 })
  format: 'PDF' | 'CSV' | 'XLSX' | 'EMAIL';

  @Column({ type: 'jsonb' })
  recipients: {
    emails: string[];
    roles?: string[];
    departments?: string[];
  };

  @Column({ type: 'jsonb', nullable: true })
  filters?: Record<string, any>;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'date', nullable: true })
  nextRunAt?: Date;

  @Column({ type: 'date', nullable: true })
  lastRunAt?: Date;

  @Column({ type: 'varchar', length: 500, nullable: true })
  lastError?: string;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  createdBy?: string;
}

// Saved Report Instance
@Entity('saved_report')
export class SavedReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'uuid' })
  @Index()
  tenantId: string;

  @ManyToOne(() => ReportConfig)
  @JoinColumn({ name: 'report_id' })
  report: ReportConfig;

  @Column({ type: 'uuid' })
  @Index()
  reportId: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  description?: string;

  @Column({ type: 'jsonb' })
  configuration: Record<string, any>;

  @Column({ type: 'jsonb' })
  data: Record<string, any>;

  @Column({ type: 'varchar', length: 50 })
  status: 'GENERATED' | 'PROCESSING' | 'ERROR' | 'EXPIRED';

  @Column({ type: 'date', nullable: true })
  expiresAt?: Date;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  generatedBy?: string;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  userId?: string; // Who saved this report

  @Column({ type: 'varchar', length: 50, nullable: true })
  exportFormat?: 'PDF' | 'CSV' | 'XLSX';

  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @Column({ type: 'date', nullable: true })
  lastViewedAt?: Date;
}

// Dashboard Configuration
@Entity('dashboard_config')
export class DashboardConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'uuid' })
  @Index()
  tenantId: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 200 })
  description: string;

  @Column({ type: 'jsonb' })
  layout: {
    widgets: {
      id: string;
      type: 'CHART' | 'KPI' | 'TABLE' | 'TEXT';
      reportId: string;
      position: { x: number; y: number; w: number; h: number };
      config: Record<string, any>;
    }[];
    columns: number;
    rowHeight: number;
  };

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isDefault: boolean;

  @Column({ type: 'varchar', length: 50 })
  accessLevel: 'PRIVATE' | 'DEPARTMENT' | 'TENANT' | 'PUBLIC';

  @Column({ type: 'uuid', nullable: true })
  @Index()
  createdBy?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  tags?: string;

  @Column({ type: 'int', default: 0 })
  usageCount: number;

  @Column({ type: 'date', nullable: true })
  lastUsedAt?: Date;

  // Relations
  @OneToMany(() => DashboardAccess, access => access.dashboard)
  accessRecords: DashboardAccess[];
}

// Dashboard Access Control
@Entity('dashboard_access')
export class DashboardAccess {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'uuid' })
  @Index()
  tenantId: string;

  @ManyToOne(() => DashboardConfig)
  @JoinColumn({ name: 'dashboard_id' })
  dashboard: DashboardConfig;

  @Column({ type: 'uuid' })
  @Index()
  dashboardId: string;

  @Column({ type: 'uuid' })
  @Index()
  userId: string;

  @Column({ type: 'varchar', length: 50 })
  permission: 'VIEW' | 'EDIT' | 'DELETE' | 'SHARE';

  @Column({ type: 'varchar', length: 100, nullable: true })
  department?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  role?: string;
}
