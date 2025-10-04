# syntax=docker/dockerfile:1
FROM node:18-alpine AS base

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

WORKDIR /app

# Install deps using root workspace
COPY package*.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
RUN npm ci --only=production

# Build API
COPY . .
RUN npm --workspace api exec prisma generate \
 && npm --workspace api run build

FROM node:18-alpine AS runner

# Install dumb-init
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

WORKDIR /app
ENV NODE_ENV=production

# Copy built application
COPY --from=base /app/package*.json ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/apps/api/dist ./apps/api/dist
COPY --from=base /app/apps/api/prisma ./apps/api/prisma

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


