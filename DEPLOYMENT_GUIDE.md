# HMS SaaS Deployment Guide

## Overview
This guide covers the deployment of the HMS (Hospital Management System) SaaS platform, including both the NestJS API backend and Next.js frontend.

## Prerequisites

### System Requirements
- Node.js 18+ 
- PostgreSQL 14+
- Redis (for caching and sessions)
- Docker (optional, for containerized deployment)

### Environment Variables

#### API (.env)
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/hms_saas"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# Notifications
SENDGRID_API_KEY="your-sendgrid-api-key"
TWILIO_ACCOUNT_SID="your-twilio-account-sid"
TWILIO_AUTH_TOKEN="your-twilio-auth-token"
TWILIO_FROM_NUMBER="+1234567890"

# CORS
FRONTEND_URL="http://localhost:3000"

# Server
PORT=3001
NODE_ENV="production"

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

#### Web (.env.local)
```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_APP_NAME="HMS SaaS"
```

## Database Setup

### 1. Create Database
```sql
CREATE DATABASE hms_saas;
CREATE USER hms_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE hms_saas TO hms_user;
```

### 2. Run Migrations
```bash
cd apps/api
npx prisma migrate deploy
npx prisma generate
```

### 3. Seed Initial Data (Optional)
```bash
# Create a tenant and admin user
npm run seed
```

## API Deployment

### Development
```bash
cd apps/api
npm install
npm run build
npm run start:prod
```

### Production with PM2
```bash
npm install -g pm2
cd apps/api
npm install
npm run build

# Create ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'hms-api',
    script: 'dist/main.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
}
EOF

pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Docker Deployment
```dockerfile
# Dockerfile for API
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001
CMD ["npm", "run", "start:prod"]
```

## Frontend Deployment

### Development
```bash
cd apps/web
npm install
npm run build
npm start
```

### Production Build
```bash
cd apps/web
npm install
npm run build

# Static export (if using static hosting)
npm run export

# Or serve with Next.js server
npm start
```

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Docker Compose Deployment

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: hms_saas
      POSTGRES_USER: hms_user
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  api:
    build:
      context: ./apps/api
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: postgresql://hms_user:secure_password@postgres:5432/hms_saas
      JWT_SECRET: your-super-secret-jwt-key-here
      FRONTEND_URL: http://localhost:3000
    ports:
      - "3001:3001"
    depends_on:
      - postgres
      - redis

  web:
    build:
      context: ./apps/web
      dockerfile: Dockerfile
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001
    ports:
      - "3000:3000"
    depends_on:
      - api

volumes:
  postgres_data:
```

## SSL/HTTPS Setup

### Using Certbot (Let's Encrypt)
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Monitoring and Logging

### PM2 Monitoring
```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs hms-api

# Restart application
pm2 restart hms-api
```

### Health Checks
The API includes health check endpoints:
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed system status

### Log Management
```bash
# Rotate logs with PM2
pm2 install pm2-logrotate

# Configure log rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
pm2 set pm2-logrotate:compress true
```

## Security Considerations

### 1. Environment Variables
- Never commit `.env` files to version control
- Use strong, unique secrets for JWT and database passwords
- Rotate API keys regularly

### 2. Database Security
- Use connection pooling
- Enable SSL for database connections in production
- Regular backups and point-in-time recovery

### 3. API Security
- Rate limiting is enabled by default
- CORS is configured for your frontend domain
- Helmet middleware for security headers
- Input validation and sanitization

### 4. Network Security
- Use HTTPS in production
- Configure firewall rules
- Regular security updates

## Backup and Recovery

### Database Backup
```bash
# Create backup
pg_dump -h localhost -U hms_user -d hms_saas > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
psql -h localhost -U hms_user -d hms_saas < backup_file.sql
```

### Application Backup
```bash
# Use the built-in export functionality
curl -X POST http://localhost:3001/api/export/backup/create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"includeAuditLogs": true, "includeNotifications": true, "compress": true}'
```

## Scaling Considerations

### Horizontal Scaling
- Use load balancer (Nginx, HAProxy)
- Database read replicas
- Redis cluster for session storage
- CDN for static assets

### Performance Optimization
- Enable database query optimization
- Use Redis for caching
- Optimize bundle sizes
- Enable gzip compression

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Check DATABASE_URL format
   - Verify database is running
   - Check firewall rules

2. **CORS Errors**
   - Verify FRONTEND_URL in API environment
   - Check browser network tab for exact error

3. **JWT Token Issues**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Clear browser localStorage

4. **Build Failures**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify all environment variables are set

### Log Locations
- PM2 logs: `~/.pm2/logs/`
- Nginx logs: `/var/log/nginx/`
- Application logs: Console output or configured log files

## Support and Maintenance

### Regular Tasks
- Monitor system resources
- Review error logs
- Update dependencies
- Database maintenance
- Security patches

### Performance Monitoring
- Set up monitoring for API response times
- Monitor database query performance
- Track user activity and system usage
- Set up alerts for critical issues

## API Documentation
Once deployed, Swagger documentation is available at:
`http://your-domain.com/api/docs`

This includes comprehensive documentation for all endpoints, authentication requirements, and example requests/responses.
