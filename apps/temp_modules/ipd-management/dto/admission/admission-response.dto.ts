import { Exclude, Expose, Type } from 'class-transformer';
import { Admission } from '../../entities/admission.entity';
import { BedResponseDto } from '../../bed-ward/dto/bed-response.dto';
import { PatientResponseDto } from '../../../patients/dto/patient-response.dto';
import { StaffResponseDto } from '../../../staff/dto/staff-response.dto';

export class AdmissionResponseDto {
  @Expose()
  id: string;

  @Expose()
  admissionNumber: string;

  @Expose()
  @Type(() => PatientResponseDto)
  patient: PatientResponseDto;

  @Expose()
  @Type(() => StaffResponseDto)
  admittingDoctor: StaffResponseDto;

  @Expose()
  @Type(() => BedResponseDto)
  bed: BedResponseDto;

  @Expose()
  admissionType: string;

  @Expose()
  status: string;

  @Expose()
  admissionDate: Date;

  @Expose()
  dischargeDate?: Date;

  @Expose()
  diagnosis?: string;

  @Expose()
  admissionNotes?: string;

  @Expose()
  dischargeNotes?: string;

  @Expose()
  isSelfDischarge: boolean;

  @Expose()
  selfDischargeReason?: string;

  @Expose()
  insuranceInfo?: Record<string, any>;

  @Expose()
  documents?: Array<{
    type: string;
    url: string;
    notes?: string;
  }>;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(partial: Partial<Admission>) {
    Object.assign(this, {
      id: partial.id,
      admissionNumber: partial.admissionNumber,
      patient: partial.patient ? new PatientResponseDto(partial.patient) : undefined,
      admittingDoctor: partial.admittingDoctor ? new StaffResponseDto(partial.admittingDoctor) : undefined,
      bed: partial.bed ? new BedResponseDto(partial.bed) : undefined,
      admissionType: partial.admissionType,
      status: partial.status,
      admissionDate: partial.admissionDate,
      dischargeDate: partial.dischargeDate,
      diagnosis: partial.diagnosis,
      admissionNotes: partial.admissionNotes,
      dischargeNotes: partial.dischargeNotes,
      isSelfDischarge: partial.isSelfDischarge,
      selfDischargeReason: partial.selfDischargeReason,
      insuranceInfo: partial.insuranceInfo,
      documents: partial.documents,
      createdAt: partial.createdAt,
      updatedAt: partial.updatedAt,
    });
  }
}
