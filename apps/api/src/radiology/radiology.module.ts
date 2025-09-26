import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

// Controllers
import { ImagingOrdersController } from './controllers/imaging-orders.controller';
import { StudiesController } from './controllers/studies.controller';
import { RadReportsController } from './controllers/rad-reports.controller';
import { ModalitiesController } from './controllers/modalities.controller';
import { PACSController } from './controllers/pacs.controller';

// Services
import { ImagingOrdersService } from './services/imaging-orders.service';
import { StudiesService } from './services/studies.service';
import { RadReportsService } from './services/rad-reports.service';
import { ModalitiesService } from './services/modalities.service';
import { PACSService } from './services/pacs.service';
import { ModalityWorklistService } from './services/modality-worklist.service';
import { RadiationDoseService } from './services/radiation-dose.service';
import { ContrastAllergyService } from './services/contrast-allergy.service';
import { ReportTemplatesService } from './services/report-templates.service';
import { ImagingScheduleService } from './services/imaging-schedule.service';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
  ],
  controllers: [
    ImagingOrdersController,
    StudiesController,
    RadReportsController,
    ModalitiesController,
    PACSController,
  ],
  providers: [
    // Services
    ImagingOrdersService,
    StudiesService,
    RadReportsService,
    ModalitiesService,
    PACSService,
    ModalityWorklistService,
    RadiationDoseService,
    ContrastAllergyService,
    ReportTemplatesService,
    ImagingScheduleService,
  ],
  exports: [
    ImagingOrdersService,
    StudiesService,
    RadReportsService,
    ModalitiesService,
    PACSService,
    ModalityWorklistService,
    RadiationDoseService,
    ContrastAllergyService,
    ReportTemplatesService,
    ImagingScheduleService,
  ],
})
export class RadiologyModule {}
