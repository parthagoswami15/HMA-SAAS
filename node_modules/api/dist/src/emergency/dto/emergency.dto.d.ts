export declare class CreateEmergencyCaseDto {
    patientId: string;
    triageLevel: string;
    chiefComplaint: string;
    vitals?: any;
    assignedTo?: string;
    notes?: string;
}
export declare class UpdateEmergencyCaseDto {
    triageLevel?: string;
    chiefComplaint?: string;
    vitals?: any;
    assignedTo?: string;
    status?: string;
    dischargeTime?: Date;
    notes?: string;
}
