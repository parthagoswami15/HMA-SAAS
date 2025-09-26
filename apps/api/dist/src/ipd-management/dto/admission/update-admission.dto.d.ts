import { CreateAdmissionDto } from './create-admission.dto';
import { AdmissionStatus } from '../../../enums/admission-status.enum';
declare const UpdateAdmissionDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateAdmissionDto>>;
export declare class UpdateAdmissionDto extends UpdateAdmissionDto_base {
    bedId?: string;
    status?: AdmissionStatus;
    dischargeDate?: Date;
    dischargeNotes?: string;
    isSelfDischarge?: boolean;
    selfDischargeReason?: string;
}
export {};
