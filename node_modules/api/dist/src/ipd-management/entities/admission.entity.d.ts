import { Patient } from '../../patients/entities/patient.entity';
import { Staff } from '../../staff/entities/staff.entity';
import { Bed } from './bed.entity';
import { Discharge } from './discharge.entity';
import { AdmissionType } from '../enums/admission-type.enum';
import { AdmissionStatus } from '../enums/admission-status.enum';
import { BaseEntity } from '../../common/entities/base.entity';
export declare class Admission extends BaseEntity {
    patientId: string;
    patient: Patient;
    admittingDoctorId: string;
    admittingDoctor: Staff;
    bedId: string;
    bed: Bed;
    admissionType: AdmissionType;
    status: AdmissionStatus;
    admissionDate: Date;
    dischargeDate: Date;
    admissionNotes: string;
    diagnosis: string;
    insuranceInfo: any;
    isSelfDischarge: boolean;
    selfDischargeReason: string;
    discharge: Discharge;
    createdAt: Date;
    updatedAt: Date;
}
