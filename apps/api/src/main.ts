import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// Deployment trigger - DB URL updated
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  // Health check endpoint
  app
    .getHttpAdapter()
    .get('/health', (_req: unknown, res: any) => {
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        message: 'HMS SaaS API is running - Minimal Working Version',
      });
    });

  // Root endpoint
  app
    .getHttpAdapter()
    .get('/', (_req: unknown, res: any) => {
      res.json({
        name: 'HMS SaaS API - Minimal Working Version',
        version: '1.0.0',
        status: 'running',
        timestamp: new Date().toISOString(),
        endpoints: {
          health: '/health',
        },
      });
    });

  const port = process.env.PORT || 3001;
  const host = process.env.HOST || 'localhost';
  await app.listen(port);

  logger.log(`🚀 HMS SaaS API is running on: http://${host}:${port}`);
  logger.log(`❤️ Health Check: http://${host}:${port}/health`);
  logger.log(`🏥 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.log(`📊 Database: Connected via Prisma`);
}

bootstrap().catch((error) => {
  const logger = new Logger('Bootstrap');
  logger.error('Failed to start application', error);
  process.exit(1);
});
