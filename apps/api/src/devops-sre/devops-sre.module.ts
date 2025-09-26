import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../../auth/auth.module';

// Controllers
import { DevOpsSreController } from './controllers/devops-sre.controller';

// Services
import { DevOpsSreService } from './services/devops-sre.service';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
  ],
  controllers: [
    DevOpsSreController,
  ],
  providers: [
    DevOpsSreService,
  ],
  exports: [
    DevOpsSreService,
  ],
})
export class DevOpsSreModule {}
