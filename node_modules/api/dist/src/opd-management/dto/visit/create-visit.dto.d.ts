import { VisitType } from '../../enums/visit.enum';
export declare class CreateVisitDto {
    patientId: string;
    type?: VisitType;
    scheduledAt?: Date;
    chiefComplaint?: string;
    referredById?: string;
    referralNotes?: string;
    notes?: string;
    metadata?: Record<string, any>;
}
