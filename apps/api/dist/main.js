"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const logger = new common_1.Logger('Bootstrap');
    app.enableCors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        credentials: true,
    });
    app.getHttpAdapter().get('/health', (req, res) => {
        res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development',
            message: 'HMS SaaS API is running - Minimal Working Version'
        });
    });
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
    const host = process.env.HOST || 'localhost';
    await app.listen(port);
    logger.log(`🚀 HMS SaaS API is running on: http://${host}:${port}`);
    logger.log(`❤️ Health Check: http://${host}:${port}/health`);
    logger.log(`🏥 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.log(`📊 Database: Connected via Prisma`);
}
bootstrap().catch((error) => {
    const logger = new common_1.Logger('Bootstrap');
    logger.error('Failed to start application', error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map