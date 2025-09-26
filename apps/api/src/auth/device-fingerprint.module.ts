import { Module } from '@nestjs/common';
import { DeviceFingerprintService } from './services/device-fingerprint.service';

@Module({
  providers: [DeviceFingerprintService],
  exports: [DeviceFingerprintService],
})
export class DeviceFingerprintModule {}
