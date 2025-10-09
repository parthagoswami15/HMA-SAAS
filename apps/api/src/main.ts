import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// Deployment trigger - DB URL updated
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Enable CORS
  const corsOriginsEnv = process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:3001';
  const parsedOrigins = corsOriginsEnv
    .split(',')
    .map((o) => o.trim())
    .filter((o) => o.length > 0);

  app.enableCors({
    origin: (origin, callback) => {
      console.log('CORS Origin:', origin);
      console.log('Parsed Origins:', parsedOrigins);
      
      // Allow requests with no origin (mobile apps, etc.)
      if (!origin) return callback(null, true);
      
      // Check if origin is in allowed list
      if (parsedOrigins.includes(origin)) {
        console.log('Origin allowed from list:', origin);
        return callback(null, true);
      }
      
      // Allow all Vercel domains
      if (origin.endsWith('.vercel.app') || origin.endsWith('.vercel.com')) {
        console.log('Origin allowed as Vercel domain:', origin);
        return callback(null, true);
      }
      
      // For development - allow localhost with any port
      if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
        console.log('Origin allowed as localhost:', origin);
        return callback(null, true);
      }
      
      // Reject other origins
      console.log('Origin rejected:', origin);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  });

  // Health check endpoint
  app.getHttpAdapter().get('/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      message: 'HMS SaaS API is running - Minimal Working Version'
    });
  });

  // Root endpoint
  app.getHttpAdapter().get('/', (req, res) => {
    res.json({
      name: 'HMS SaaS API - Minimal Working Version',
      version: '1.0.0',
      status: 'running',
      timestamp: new Date().toISOString(),
      endpoints: {
        health: '/health'
      }
    });
  });

  const port = process.env.PORT || 3001;
  const host = process.env.HOST || '0.0.0.0';
  await app.listen(port, host);

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