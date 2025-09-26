import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Bed } from './bed.entity';

@Entity('wards')
export class Ward {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 10 })
  code: string;

  @Column({ type: 'integer' })
  floor: number;

  @Column({ type: 'varchar', length: 20, default: 'GENERAL' })
  type: string; // GENERAL, ICU, CCU, PEDIATRICS, etc.

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => Bed, bed => bed.ward)
  beds: Bed[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
