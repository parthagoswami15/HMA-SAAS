import { Entity, PrimaryColumn, Column, Index, OneToMany } from 'typeorm';
import { Diagnosis } from './diagnosis.entity';

@Entity('icd10_codes')
export class Icd10Code {
  @PrimaryColumn({ type: 'varchar', length: 10 })
  code: string;

  @Column({ type: 'varchar', length: 500 })
  description: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  @Index()
  chapterCode: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  chapterDescription: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  @Index()
  blockCode: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  blockDescription: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  category: string;

  @Column({ type: 'boolean', default: false })
  isHeader: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  sexRestriction: 'male' | 'female' | null;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  minAge: number | null;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  maxAge: number | null;

  @Column({ type: 'boolean', default: false })
  hasSubCodes: boolean;

  @Column({ type: 'boolean', default: false })
  isLeaf: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  // Relations
  @OneToMany(() => Diagnosis, diagnosis => diagnosis.icd10Code)
  diagnoses: Diagnosis[];

  // Helper methods
  getFullDescription(): string {
    return `${this.code} - ${this.description}`;
  }

  isAgeValid(age: number): boolean {
    if (this.minAge !== null && age < this.minAge) return false;
    if (this.maxAge !== null && age > this.maxAge) return false;
    return true;
  }

  isSexValid(sex: 'male' | 'female' | null): boolean {
    if (!this.sexRestriction) return true;
    return this.sexRestriction === sex;
  }
}
