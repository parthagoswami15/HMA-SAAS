import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller()
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Get('/health')
  health() {
    return { status: 'ok' };
  }

  @Get('/ready')
  async ready() {
    try {
      await this.prisma.$queryRawUnsafe('SELECT 1');
      return { status: 'ready' };
    } catch (e) {
      return { status: 'not-ready', error: (e as Error).message };
    }
  }
}


