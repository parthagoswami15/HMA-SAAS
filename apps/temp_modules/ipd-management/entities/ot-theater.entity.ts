import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Surgery } from './surgery.entity';
import { Ward } from './ward.entity';

@Entity('ot_theaters')
export class OTTheater {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 10 })
  code: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 20, default: 'GENERAL' })
  type: string; // GENERAL, CARDIAC, NEURO, ORTHO, etc.

  @Column({ type: 'integer' })
  floor: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isInMaintenance: boolean;

  @Column({ type: 'jsonb', nullable: true })
  equipment: {
    name: string;
    model: string;
    lastMaintenanceDate: Date;
    nextMaintenanceDate: Date;
    status: 'OPERATIONAL' | 'MAINTENANCE_REQUIRED' | 'OUT_OF_SERVICE';
  }[];

  @Column({ type: 'jsonb', nullable: true })
  schedule: {
    dayOfWeek: number; // 0-6 (Sunday-Saturday)
    startTime: string; // '09:00'
    endTime: string;   // '17:00'
  }[];

  @Column({ type: 'uuid', nullable: true })
  wardId: string;

  @ManyToOne(() => Ward, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'wardId' })
  ward: Ward;

  @OneToMany(() => Surgery, surgery => surgery.theater)
  surgeries: Surgery[];

  @Column({ type: 'jsonb', nullable: true })
  auditLog: Array<{
    timestamp: Date;
    action: string;
    performedById: string;
    performedBy: string;
    changes: Record<string, any>;
  }>;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // Helper methods
  isAvailable(startTime: Date, endTime: Date): boolean {
    if (this.isInMaintenance || !this.isActive) {
      return false;
    }

    // Check if within scheduled hours
    const dayOfWeek = startTime.getDay();
    const timeStr = startTime.toTimeString().substring(0, 5);
    
    const schedule = this.schedule?.find(s => s.dayOfWeek === dayOfWeek);
    if (!schedule) {
      return false; // No schedule for this day
    }

    if (timeStr < schedule.startTime || timeStr > schedule.endTime) {
      return false; // Outside scheduled hours
    }

    // Check for overlapping surgeries
    // This would be implemented with a query to check for existing surgeries
    // in the given time range
    return true;
  }
}
