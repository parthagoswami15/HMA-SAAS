import { ApiProperty } from '@nestjs/swagger';

export enum PrescriptionStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED'
}

export enum PrescriptionType {
  MEDICATION = 'MEDICATION',
  LAB_TEST = 'LAB_TEST',
  IMAGING = 'IMAGING',
  PROCEDURE = 'PROCEDURE',
  DIET = 'DIET',
  OTHER = 'OTHER'
}

export enum FrequencyUnit {
  HOUR = 'HOUR',
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  AS_NEEDED = 'AS_NEEDED'
}

export enum DurationUnit {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  YEAR = 'YEAR',
  INDEFINITE = 'INDEFINITE'
}

export class DosageInstruction {
  @ApiProperty({ description: 'Dose quantity (e.g., 1, 2.5)' })
  dose: number;

  @ApiProperty({ description: 'Dose unit (e.g., mg, ml, tablet)' })
  unit: string;

  @ApiProperty({ enum: FrequencyUnit, description: 'Frequency unit for administration' })
  frequency: FrequencyUnit;

  @ApiProperty({ description: 'Number of times per frequency unit (e.g., 3 times per day)' })
  frequencyCount: number;
  @ApiProperty({ description: 'Route of administration (e.g., oral, IV, topical)' })
  route: string;

  @ApiProperty({ description: 'Specific timing instructions (e.g., before meals, at bedtime)' })
  timing?: string;

  @ApiProperty({ description: 'Additional instructions for administration' })
  instructions?: string;
}

export class PrescriptionItem {
  @ApiProperty({ description: 'Unique identifier for the prescription item' })
  id: string;

  @ApiProperty({ description: 'ID of the medication, test, or procedure' })
  itemId: string;

  @ApiProperty({ description: 'Name of the medication, test, or procedure' })
  itemName: string;

  @ApiProperty({ enum: PrescriptionType, description: 'Type of prescription item' })
  itemType: PrescriptionType;

  @ApiProperty({ enum: PrescriptionStatus, default: PrescriptionStatus.ACTIVE })
  status: PrescriptionStatus;

  @ApiProperty({ type: DosageInstruction, description: 'Dosage instructions' })
  dosage: DosageInstruction;

  @ApiProperty({ description: 'Duration value (e.g., 7 for 7 days)' })
  durationValue: number;

  @ApiProperty({ enum: DurationUnit, description: 'Duration unit' })
  durationUnit: DurationUnit;

  @ApiProperty({ description: 'Total quantity to dispense', required: false })
  quantity?: number;

  @ApiProperty({ description: 'Unit of the quantity (e.g., tablets, ml, mg)', required: false })
  quantityUnit?: string;

  @ApiProperty({ description: 'Date when the prescription was issued', type: Date })
  datePrescribed: Date;

  @ApiProperty({ description: 'Date when the prescription becomes active', type: Date, required: false })
  startDate?: Date;

  @ApiProperty({ description: 'Date when the prescription expires', type: Date, required: false })
  endDate?: Date;

  @ApiProperty({ description: 'Additional notes about the prescription', required: false })
  notes?: string;

  @ApiProperty({ description: 'Whether to use generic substitution if available', default: true })
  allowGeneric: boolean;

  @ApiProperty({ description: 'Whether this is a refill of a previous prescription', default: false })
  isRefill: boolean;

  @ApiProperty({ description: 'Number of refills allowed', default: 0 })
  refillsAllowed: number;

  @ApiProperty({ description: 'Number of refills already used', default: 0 })
  refillsUsed: number;

  @ApiProperty({ description: 'Date and time when the record was created', type: Date })
  createdAt: Date;

  @ApiProperty({ description: 'Date and time when the record was last updated', type: Date })
  updatedAt: Date;
}

export class Prescription {
  @ApiProperty({ description: 'Unique identifier for the prescription' })
  id: string;

  @ApiProperty({ description: 'Visit ID this prescription is associated with' })
  visitId: string;

  @ApiProperty({ description: 'Patient ID this prescription is for' })
  patientId: string;

  @ApiProperty({ description: 'Provider (staff) ID who prescribed this' })
  providerId: string;

  @ApiProperty({ description: 'Facility ID where the prescription was issued' })
  facilityId: string;

  @ApiProperty({ type: [PrescriptionItem], description: 'List of prescribed items' })
  items: PrescriptionItem[];

  @ApiProperty({ enum: PrescriptionStatus, default: PrescriptionStatus.ACTIVE })
  status: PrescriptionStatus;

  @ApiProperty({ description: 'Date when the prescription was issued', type: Date })
  datePrescribed: Date;

  @ApiProperty({ description: 'Additional notes about the prescription', required: false })
  notes?: string;

  @ApiProperty({ description: 'Date and time when the record was created', type: Date })
  createdAt: Date;

  @ApiProperty({ description: 'Date and time when the record was last updated', type: Date })
  updatedAt: Date;
}
