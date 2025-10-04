import { Module, forwardRef } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuditModule } from '../audit/audit.module';
import { FileStorageModule } from '../file-storage/file-storage.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { PatientRegistrationController } from './controllers/patient-registration.controller';
import { PatientDocumentsController } from './controllers/patient-documents.controller';
import { PatientAuditInterceptor } from './interceptors/patient-audit.interceptor';
import { SupabaseModule } from '../supabase/supabase.module';
import { PatientRepository } from './repositories/patient.repository';

@Module({
  imports: [
    SupabaseModule,
    AuditModule,
    EventEmitterModule.forRoot(),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dest: configService.get<string>('UPLOAD_PATH', './uploads'),
        limits: {
          fileSize: 10 * 1024 * 1024, // 10MB
        },
        fileFilter: (req, file, cb) => {
          const allowedMimeTypes = [
            'image/jpeg',
            'image/png',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          ];
          
          if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
          } else {
            cb(new Error('Invalid file type'), false);
          }
        },
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => NotificationsModule),
    FileStorageModule,
  ],
  providers: [
    PatientsService,
    PatientRepository,
    {
      provide: APP_INTERCEPTOR,
      useClass: PatientAuditInterceptor,
    },
  ],
  controllers: [
    PatientsController,
    PatientRegistrationController,
    PatientDocumentsController,
  ],
  exports: [PatientsService, PatientRepository],
})
export class PatientsModule {}
