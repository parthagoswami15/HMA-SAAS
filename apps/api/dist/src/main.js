"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const audit_service_1 = require("./audit/audit.service");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
const request_logger_middleware_1 = require("./common/middleware/request-logger.middleware");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const logger = new common_1.Logger('Bootstrap');
    app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const auditService = app.get(audit_service_1.AuditService);
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter(auditService));
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor(auditService));
    app.use(new request_logger_middleware_1.RequestLoggerMiddleware().use);
    const config = new swagger_1.DocumentBuilder()
        .setTitle('HMS SaaS API')
        .setDescription('Healthcare Management System SaaS API - Complete healthcare solution with patient management, lab results, pharmacy, billing, and more.')
        .setVersion('1.0.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
    }, 'JWT-auth')
        .addTag('Authentication', 'User authentication and authorization')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
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
    document.security = [
        { 'JWT-auth': [] },
        { 'refresh-token': [] },
        { 'api-key': [] },
    ];
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
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
    app.getHttpAdapter().get('/', (req, res) => {
        res.redirect('/api/docs');
    });
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
    const logger = new common_1.Logger('Bootstrap');
    logger.error('Failed to start application', error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map