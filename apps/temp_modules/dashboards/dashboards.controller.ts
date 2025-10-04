import { Controller, Get, Headers } from '@nestjs/common';
import { DashboardsService } from './dashboards.service';

@Controller('dashboards')
export class DashboardsController {
  constructor(private svc: DashboardsService) {}

  @Get('overview')
  overview(@Headers('x-tenant-id') tenantId: string) {
    return this.svc.overview(tenantId);
  }
}


