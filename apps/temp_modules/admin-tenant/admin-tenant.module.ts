import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../../auth/auth.module';

// Controllers
import { AdminTenantController } from './controllers/admin-tenant.controller';

// Services
import { AdminTenantService } from './services/admin-tenant.service';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
  ],
  controllers: [
    AdminTenantController,
  ],
  providers: [
    AdminTenantService,
  ],
  exports: [
    AdminTenantService,
  ],
})
export class AdminTenantModule {}
