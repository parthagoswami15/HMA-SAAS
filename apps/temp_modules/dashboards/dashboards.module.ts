import { Module } from '@nestjs/common';
import { DashboardsController } from './dashboards.controller';
import { DashboardsService } from './dashboards.service';

@Module({
  providers: [DashboardsService],
  controllers: [DashboardsController],
})
export class DashboardsModule {}


