import { LabService } from './lab.service';
declare class CreateTestDto {
    name: string;
    code: string;
    description?: string;
    priceCents?: number;
    currency?: string;
}
declare class OrderTestDto {
    patientId: string;
    testId: string;
}
export declare class LabController {
    private svc;
    constructor(svc: LabService);
    createTest(tenantId: string, dto: CreateTestDto): Promise<any>;
    listTests(tenantId: string): Promise<any>;
    order(tenantId: string, dto: OrderTestDto): Promise<any>;
    listOrders(tenantId: string): Promise<any>;
}
export {};
