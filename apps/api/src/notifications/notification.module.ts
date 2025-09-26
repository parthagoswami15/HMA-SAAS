import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationService } from './notification.service';

@Global()
@Module({
  imports: [
    ConfigModule,
    EventEmitterModule.forRoot(),
  ],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
