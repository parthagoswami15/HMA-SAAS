import { DashboardsService } from './dashboards.service';
export declare class DashboardsController {
    private svc;
    constructor(svc: DashboardsService);
    overview(tenantId: string): Promise<{
        patients: any;
        invoices: any;
        labOrders: any;
    }>;
}
