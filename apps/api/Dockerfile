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

# Copy Prisma schema BEFORE installing dependencies (needed for postinstall script)
COPY apps/api/prisma ./apps/api/prisma/

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

# Run migrations then start with proper signal handling
CMD ["dumb-init", "sh", "-c", "npm --workspace api exec prisma migrate deploy && node apps/api/dist/main.js"]


