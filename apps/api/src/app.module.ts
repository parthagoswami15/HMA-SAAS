import { Module, MiddlewareConsumer, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ScheduleModule } from '@nestjs/schedule';
import { join } from 'path';
import Joi from 'joi';
import { throttlerConfig } from './config/throttler.config';
import { TenantsModule } from './tenants/tenants.module';

// Modules
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PatientsModule } from './patients/patients.module';
import { LabModule } from './lab/lab.module';
import { PharmacyModule } from './pharmacy/pharmacy.module';
import { BillingModule } from './billing/billing.module';
import { PaymentsModule } from './payments/payments.module';
import { ChambersModule } from './chambers/chambers.module';
import { EmergencyModule } from './emergency/emergency.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AuditModule } from './audit/audit.module';
import { ExportModule } from './export/export.module';
import { TestDataModule } from './testing/test-data.module';
import { OPDModule } from './opd-management/opd.module';
import { IPDModule } from './ipd-management/ipd.module';
import { SupabaseModule } from './supabase/supabase.module';
import { InsuranceModule } from './insurance/insurance.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { ReportsModule } from './reports/reports.module';
import { ComplianceModule } from './compliance/compliance.module';
import { TelemedicineModule } from './telemedicine/telemedicine.module';
import { SecurityModule } from './security/security.module';
import { PatientPortalModule } from './patient-portal/patient-portal.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { RadiologyModule } from './radiology/radiology.module';
import { AdminTenantModule } from './admin-tenant/admin-tenant.module';
import { DevOpsSreModule } from './devops-sre/devops-sre.module';
import { AIAssistiveModule } from './ai-assistive/ai-assistive.module';

// Guards
import { RolesGuard } from './common/guards/roles.guard';
import { TenantThrottleGuard } from './auth/tenant-throttle.guard';
import { SupabaseAuthGuard } from './auth/guards/supabase-auth.guard';

// Interceptors
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(3000),

        // Supabase
        SUPABASE_URL: Joi.string().required(),
        SUPABASE_ANON_KEY: Joi.string().required(),
        SUPABASE_SERVICE_ROLE_KEY: Joi.string().required(),

        // JWT (for Supabase compatibility)
        JWT_SECRET: Joi.string().required(),
        JWT_ACCESS_SECRET: Joi.string().required(),
        JWT_ACCESS_EXPIRATION: Joi.string().default('15m'),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_REFRESH_EXPIRATION: Joi.string().default('7d'),

        // App URL for redirects
        APP_URL: Joi.string().default('http://localhost:3000'),
      }),
    }),

    // Rate limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ...throttlerConfig,
        // In production, use Redis for distributed rate limiting
        // store: new ThrottlerStorageRedisService(),
      }),
    }),

    // Schedule module for cron jobs
    ScheduleModule.forRoot(),

    // Supabase module
    SupabaseModule,

    // Passport Module for Supabase authentication
    PassportModule.register({ defaultStrategy: 'supabase-jwt' }),

    // Serve static files
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
    
    // Core modules
    PrismaModule,
    SupabaseModule,
    AuthModule,
    TenantsModule,
    OPDModule,
    IPDModule,
    PatientsModule,
    LabModule,
    PharmacyModule,
    BillingModule,
    PaymentsModule,
    InsuranceModule,
    AppointmentsModule,
    ChambersModule,
    EmergencyModule,
    NotificationsModule,
    AuditModule,
    ReportsModule,
    ComplianceModule,
    TelemedicineModule,
    SecurityModule,
    PatientPortalModule,
    IntegrationsModule,
    RadiologyModule,
    AdminTenantModule,
    DevOpsSreModule,
    AIAssistiveModule,
  ],
  providers: [
    // Global guards
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // Supabase JWT guard for all routes
    {
      provide: APP_GUARD,
      useClass: SupabaseAuthGuard,
    },
    // Tenant-specific rate limiting
    {
      provide: APP_GUARD,
      useClass: TenantThrottleGuard,
    },
    // Global interceptor for standardizing responses
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
