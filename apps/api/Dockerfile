# syntax=docker/dockerfile:1
FROM node:20-alpine AS base

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

WORKDIR /app

# Copy root package.json for workspace setup
COPY package.json package-lock.json* ./

# Copy API package.json
COPY apps/api/package.json ./apps/api/package.json

# Create apps/web directory and a minimal package.json to satisfy workspace
RUN mkdir -p apps/web
RUN echo '{"name": "web", "version": "1.0.0", "private": true}' > apps/web/package.json

# Copy Prisma schema and config BEFORE installing dependencies (needed for postinstall script)
COPY apps/api/prisma ./apps/api/prisma/
COPY apps/api/prisma.config.ts ./apps/api/prisma.config.ts

# Install ALL dependencies including devDependencies (needed for build)
RUN npm ci

# Copy remaining API source code
COPY apps/api/src ./apps/api/src/
COPY apps/api/nest-cli.json ./apps/api/nest-cli.json
COPY apps/api/tsconfig*.json ./apps/api/

# Build API
WORKDIR /app/apps/api
RUN npm run build

FROM node:20-alpine AS runner

# Install dumb-init
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

WORKDIR /app
ENV NODE_ENV=production

# Copy package files and install production dependencies only
COPY --from=base /app/package*.json ./
COPY --from=base /app/apps/api/package.json ./apps/api/package.json

# Create minimal web package.json for workspace
RUN mkdir -p apps/web
RUN echo '{"name": "web", "version": "1.0.0", "private": true}' > apps/web/package.json

# Copy Prisma files first
COPY --from=base /app/apps/api/prisma ./apps/api/prisma
COPY --from=base /app/apps/api/prisma.config.ts ./apps/api/prisma.config.ts

# Install production dependencies
RUN npm ci --only=production
# Copy built application
COPY --from=base /app/apps/api/dist ./apps/api/dist

# Change ownership to nodejs user
RUN chown -R nestjs:nodejs /app
USER nestjs

# Use PORT environment variable from Render
ENV PORT=${PORT:-10000}
EXPOSE ${PORT:-10000}

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/health || exit 1

# Create startup script for better error handling
RUN echo '#!/bin/sh

echo "Starting HMS SaaS Backend..."
echo "Environment: $NODE_ENV"
echo "Port: $PORT"

# Change to API directory
cd /app/apps/api

# Try to run migrations with retry logic
echo "Running database migrations..."
for i in 1 2 3; do
  echo "Migration attempt $i/3"
  if npx prisma migrate deploy --schema=./prisma/schema.prisma; then
    echo "Migrations completed successfully"
    break
  else
    echo "Migration attempt $i failed"
    if [ $i -eq 3 ]; then
      echo "All migration attempts failed. Check your DATABASE_URL and database connectivity."
      echo "DATABASE_URL: ${DATABASE_URL:-"Not set"}"
      echo "Starting application anyway - some features may not work correctly."
      break
    fi
    echo "Retrying in 5 seconds..."
    sleep 5
  fi
done

# Return to app root and start the application
cd /app
echo "Starting Node.js application..."
node apps/api/dist/main.js
' > /app/start.sh && chmod +x /app/start.sh

# Run with proper signal handling
CMD ["dumb-init", "/app/start.sh"]


