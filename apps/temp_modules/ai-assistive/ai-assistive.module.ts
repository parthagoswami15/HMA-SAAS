import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../../auth/auth.module';

// Controllers
import { AIAssistiveController } from './controllers/ai-assistive.controller';

// Services
import { AIAssistiveService } from './services/ai-assistive.service';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
  ],
  controllers: [
    AIAssistiveController,
  ],
  providers: [
    AIAssistiveService,
  ],
  exports: [
    AIAssistiveService,
  ],
})
export class AIAssistiveModule {}
