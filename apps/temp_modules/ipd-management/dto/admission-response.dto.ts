import { ApiProperty } from '@nestjs/swagger';
import { Admission } from '../entities/admission.entity';
import { PatientResponseDto } from '../../patients/dto/patient-response.dto';
import { StaffResponseDto } from '../../staff/dto/staff-response.dto';
import { BedResponseDto } from './bed-response.dto';
import { WardResponseDto } from './ward-response.dto';

export class AdmissionResponseDto {
  @ApiProperty({ description: 'Unique identifier for the admission', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'Admission number/identifier', example: 'ADM-2023-00123' })
  admissionNumber: string;

  @ApiProperty({ description: 'Type of admission', enum: ['ELECTIVE', 'EMERGENCY', 'URGENT', 'ROUTINE', 'OTHER'] })
  admissionType: string;

  @ApiProperty({ description: 'Current status of the admission', enum: ['ADMITTED', 'DISCHARGED', 'TRANSFERRED', 'LAMA', 'DAMA'] })
  status: string;

  @ApiProperty({ description: 'Date and time of admission', example: '2023-06-15T10:30:00Z' })
  admissionDate: Date;

  @ApiProperty({ description: 'Date and time of discharge', required: false, example: '2023-06-20T14:30:00Z' })
  dischargeDate?: Date;

  @ApiProperty({ description: 'Primary diagnosis or reason for admission', example: 'Community-acquired pneumonia' })
  diagnosis: string;

  @ApiProperty({ description: 'ICD code for the diagnosis', required: false, example: 'J18.9' })
  icdCode?: string;

  @ApiProperty({ description: 'Whether this is an emergency admission', default: false })
  isEmergency: boolean;

  @ApiProperty({ description: 'Estimated length of stay in days', required: false, example: 5 })
  estimatedStayDays?: number;

  @ApiProperty({ description: 'Actual length of stay in days', required: false, example: 6 })
  actualStayDays?: number;

  @ApiProperty({ description: 'Additional notes about the admission', required: false })
  notes?: string;

  @ApiProperty({ description: 'Patient information', type: PatientResponseDto })
  patient: PatientResponseDto;

  @ApiProperty({ description: 'Admitting doctor information', type: StaffResponseDto })
  doctor: StaffResponseDto;

  @ApiProperty({ description: 'Assigned bed information', type: BedResponseDto })
  bed: BedResponseDto;

  @ApiProperty({ description: 'Ward information', type: WardResponseDto })
  ward: WardResponseDto;

  @ApiProperty({ description: 'Date when the record was created', example: '2023-06-15T10:30:00Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Date when the record was last updated', example: '2023-06-15T10:30:00Z' })
  updatedAt: Date;

  @ApiProperty({ 
    description: 'Additional details about the admission',
    required: false,
    example: { 
      symptoms: ['Fever', 'Cough', 'Shortness of breath'],
      severity: 'Moderate',
      comorbidities: ['Hypertension', 'Type 2 Diabetes']
    }
  })
  details?: Record<string, any>;

  @ApiProperty({ 
    description: 'Insurance information',
    required: false,
    example: {
      provider: 'ABC Insurance',
      policyNumber: 'POL12345678',
      groupNumber: 'GRP987654',
      isVerified: true
    }
  })
  insuranceInfo?: Record<string, any>;

  @ApiProperty({ 
    description: 'Follow-up appointment details',
    required: false,
    example: {
      scheduledDate: '2023-07-05T10:00:00Z',
      doctorId: '123e4567-e89b-12d3-a456-426614174003',
      department: 'Cardiology',
      notes: 'Follow-up for post-pneumonia evaluation',
      isScheduled: true
    }
  })
  followUpDetails?: Record<string, any>;

  @ApiProperty({ 
    description: 'Transfer details if patient was transferred',
    required: false,
    example: {
      facilityName: 'City General Hospital',
      facilityType: 'Tertiary Care Center',
      reason: 'Higher level of care required',
      transferredAt: '2023-06-18T15:45:00Z',
      transferredById: '123e4567-e89b-12d3-a456-426614174002',
      notes: 'Patient stable for transfer, all records and medications sent with patient.'
    }
  })
  transferDetails?: Record<string, any>;

  @ApiProperty({ 
    description: 'Custom fields for additional admission information',
    required: false,
    example: {
      caseManager: 'Nurse Johnson',
      socialWorker: 'Sarah Williams',
      specialRequirements: 'Requires interpreter for medical discussions'
    }
  })
  customFields?: Record<string, any>;

  constructor(admission: Admission) {
    this.id = admission.id;
    this.admissionNumber = admission.admissionNumber;
    this.admissionType = admission.admissionType;
    this.status = admission.status;
    this.admissionDate = admission.admissionDate;
    this.dischargeDate = admission.dischargeDate;
    this.diagnosis = admission.diagnosis;
    this.icdCode = admission.icdCode;
    this.isEmergency = admission.isEmergency;
    this.estimatedStayDays = admission.estimatedStayDays;
    this.actualStayDays = admission.actualStayDays;
    this.notes = admission.notes;
    this.details = admission.details;
    this.insuranceInfo = admission.insuranceInfo;
    this.followUpDetails = admission.followUpDetails;
    this.transferDetails = admission.transferDetails;
    this.customFields = admission.customFields;
    this.createdAt = admission.createdAt;
    this.updatedAt = admission.updatedAt;

    // Calculate actual stay days if discharge date is available
    if (this.dischargeDate && this.admissionDate) {
      const diffTime = Math.abs(this.dischargeDate.getTime() - this.admissionDate.getTime());
      this.actualStayDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
  }

  // Static method to transform an array of admissions
  static fromAdmissions(admissions: Admission[]): AdmissionResponseDto[] {
    return admissions.map(admission => new AdmissionResponseDto(admission));
  }
}
