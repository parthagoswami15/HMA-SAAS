import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';

import { LabPanelsController } from './controllers/lab-panels.controller';
import { LabPanelsService } from './services/lab-panels.service';

// Services
import { LabTestsService } from './services/lab-tests.service';
import { LabOrdersService } from './services/lab-orders.service';
import { LabSampleStabilityService } from './services/lab-sample-stability.service';
import { LabSamplesService } from './services/lab-samples.service';
import { LabAnalyzersService } from './services/lab-analyzers.service';
import { LabResultsService } from './services/lab-results.service';
import { LabQcService } from './services/lab-qc.service';
import { LabReportsService } from './services/lab-reports.service';
import { LabSampleStabilityController } from './controllers/lab-sample-stability.controller';
import { LabReflexController } from './controllers/lab-reflex.controller';
import { LabDeltaCheckController } from './controllers/lab-delta-check.controller';
import { LabPanicAlertController } from './controllers/lab-panic-alert.controller';
import { LabTatController } from './controllers/lab-tat.controller';

// Guards
import { LabAuthGuard } from './guards/lab-auth.guard';

// Interfaces
import { AnalyzerInterface } from './interfaces/analyzer.interface';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [
    LabTestsController,
    LabOrdersController,
    LabSamplesController,
    LabAnalyzersController,
    LabResultsController,
    LabQcController,
    LabReportsController,
    LabPanelsController,
    LabReflexController,
    LabDeltaCheckController,
    LabPanicAlertController,
    LabTatController,
    LabSampleStabilityController,
  ],
  providers: [
    // Services
    LabTestsService,
    LabOrdersService,
    LabSamplesService,
    LabAnalyzersService,
    LabResultsService,
    LabQcService,
    LabReportsService,
    LabValidationService,
    LabReflexService,
    LabBarcodeService,
    LabTatService,
    LabDeltaCheckService,
    LabPanicAlertService,
    LabPanelsService,

    // Guards
    LabAuthGuard,

    // Interfaces
    AnalyzerInterface,
  ],
  exports: [
    LabTestsService,
    LabOrdersService,
    LabSamplesService,
    LabResultsService,
    LabValidationService,
    LabReflexService,
    LabBarcodeService,
    LabTatService,
    LabReportsService,
    LabDeltaCheckService,
    LabPanicAlertService,
    LabSampleStabilityService,
    LabPanelsService,
  ],
})
export class LisModule {}
