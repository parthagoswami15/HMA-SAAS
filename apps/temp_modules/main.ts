import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('HMS SaaS API')
    .setDescription('Healthcare Management System SaaS API - Complete healthcare solution with patient management, lab results, pharmacy, billing, and more.')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Authentication', 'User authentication and authorization')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Add security requirements to all endpoints
  if (!document.components) {
    document.components = {};
  }
  
  document.components.securitySchemes = {
    'JWT-auth': {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
    'refresh-token': {
      type: 'apiKey',
      in: 'cookie',
      name: 'refresh_token',
    },
    'api-key': {
      type: 'apiKey',
      in: 'header',
      name: 'X-API-Key',
    },
  };

  // Set global security requirements
  document.security = [
    { 'JWT-auth': [] },
    { 'refresh-token': [] },
    { 'api-key': [] },
  ];

  // Serve Swagger UI at /api/docs
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'method',
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
    customSiteTitle: 'HMS API Documentation',
    customCss: `
      .topbar { background-color: #1a237e !important; }
      .swagger-ui .info .title { color: #1a237e; }
      .swagger-ui .btn.authorize { background-color: #1a237e; border-color: #1a237e; }
    `,
  });

  // Redirect root to API documentation
  app.getHttpAdapter().get('/', (req, res) => {
    res.redirect('/api/docs');
  });

  // Health check endpoint
  app.getHttpAdapter().get('/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    });
  });

  const port = process.env.PORT || 3001;
  const host = process.env.HOST || 'localhost';
  await app.listen(port);

  logger.log(`🚀 HMS SaaS API is running on: http://${host}:${port}`);
  logger.log(`📚 API Documentation: http://${host}:${port}/api/docs`);
  logger.log(`❤️ Health Check: http://${host}:${port}/health`);
  logger.log(`🏥 Environment: ${process.env.NODE_ENV || 'development'}`);
}

bootstrap().catch((error) => {
  const logger = new Logger('Bootstrap');
  logger.error('Failed to start application', error);
  process.exit(1);
});
