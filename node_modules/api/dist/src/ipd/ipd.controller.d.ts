import { IpdService } from './ipd.service';
declare class CreateRoomDto {
    code: string;
    type: string;
}
declare class AdmitDto {
    patientId: string;
    roomId: string;
    diagnosis?: string;
    notes?: string;
}
export declare class IpdController {
    private svc;
    constructor(svc: IpdService);
    createRoom(tenantId: string, dto: CreateRoomDto): any;
    listRooms(tenantId: string): any;
    admit(tenantId: string, dto: AdmitDto): Promise<any>;
    list(tenantId: string): any;
    discharge(tenantId: string, id: string): Promise<any>;
}
export {};
