import { BaseEntity } from '@app/common/entities/base.entity';
import { Patient } from '../../../patient/entities/patient.entity';
import { Staff } from '../../../staff-management/entities/staff.entity';
import { VisitStatus, VisitType } from '../enums';
import { Vitals } from './vitals.entity';
export declare class Visit extends BaseEntity {
    id: string;
    patient: Patient;
    patientId: string;
    doctor: Staff;
    doctorId: string;
    type: VisitType;
    status: VisitStatus;
    registeredAt: Date;
    scheduledAt?: Date;
    startedAt?: Date;
    completedAt?: Date;
    chiefComplaint?: string;
    registeredBy?: Staff;
    registeredById?: string;
    notes?: string;
    metadata?: Record<string, any>;
    vitals: Vitals[];
}
