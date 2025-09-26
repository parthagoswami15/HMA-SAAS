import { OpdService } from './opd.service';
declare class CreateEncounterDto {
    patientId: string;
    doctorId: string;
    type: string;
    diagnosis?: string;
    notes?: string;
}
export declare class OpdController {
    private svc;
    constructor(svc: OpdService);
    create(tenantId: string, dto: CreateEncounterDto): any;
    list(tenantId: string): any;
    update(tenantId: string, id: string, dto: Partial<CreateEncounterDto>): Promise<any>;
}
export {};
