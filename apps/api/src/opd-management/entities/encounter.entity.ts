import { ApiProperty } from '@nestjs/swagger';

export class SOAPNote {
  @ApiProperty({ description: 'Subjective information from the patient' })
  subjective: string;

  @ApiProperty({ description: 'Objective findings from examination' })
  objective: string;

  @ApiProperty({ description: 'Assessment and diagnosis' })
  assessment: string;

  @ApiProperty({ description: 'Plan for treatment and follow-up' })
  plan: string;
}

export class Diagnosis {
  @ApiProperty({ description: 'ICD-10 code' })
  code: string;

  @ApiProperty({ description: 'Description of the diagnosis' })
  description: string;

  @ApiProperty({ description: 'Whether this is the primary diagnosis', default: false })
  isPrimary: boolean;

  @ApiProperty({ description: 'Additional notes about the diagnosis', required: false })
  notes?: string;
}

export class Vitals {
  @ApiProperty({ description: 'Blood pressure (systolic/diastolic)', example: '120/80', required: false })
  bloodPressure?: string;

  @ApiProperty({ description: 'Heart rate (bpm)', example: 72, required: false })
  heartRate?: number;

  @ApiProperty({ description: 'Temperature in Celsius', example: 36.8, required: false })
  temperature?: number;

  @ApiProperty({ description: 'Respiratory rate (breaths per minute)', example: 16, required: false })
  respiratoryRate?: number;

  @ApiProperty({ description: 'Oxygen saturation percentage', example: 98, required: false })
  oxygenSaturation?: number;

  @ApiProperty({ description: 'Weight in kg', example: 70.5, required: false })
  weight?: number;

  @ApiProperty({ description: 'Height in cm', example: 170, required: false })
  height?: number;

  @ApiProperty({ description: 'BMI (Body Mass Index)', example: 24.2, required: false })
  bmi?: number;

  @ApiProperty({ description: 'Pain level (0-10)', example: 2, required: false })
  painLevel?: number;
}

export class Encounter {
  @ApiProperty({ description: 'Unique identifier for the encounter' })
  id: string;

  @ApiProperty({ description: 'Visit ID this encounter belongs to' })
  visitId: string;

  @ApiProperty({ description: 'Provider (staff) ID who is handling this encounter' })
  providerId: string;

  @ApiProperty({ description: 'Start date and time of the encounter', type: Date })
  startTime: Date;

  @ApiProperty({ description: 'End date and time of the encounter', type: Date, required: false })
  endTime?: Date;

  @ApiProperty({ description: 'Type of encounter (initial, follow-up, procedure, etc.)' })
  encounterType: string;

  @ApiProperty({ type: SOAPNote, description: 'SOAP note for this encounter' })
  soapNote: SOAPNote;

  @ApiProperty({ type: [Diagnosis], description: 'List of diagnoses for this encounter' })
  diagnoses: Diagnosis[];

  @ApiProperty({ type: Vitals, description: 'Vital signs recorded during this encounter', required: false })
  vitals?: Vitals;

  @ApiProperty({ description: 'Additional notes about the encounter', required: false })
  notes?: string;

  @ApiProperty({ description: 'Date and time when the record was created', type: Date })
  createdAt: Date;

  @ApiProperty({ description: 'Date and time when the record was last updated', type: Date })
  updatedAt: Date;
}
