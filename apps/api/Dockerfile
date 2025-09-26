# syntax=docker/dockerfile:1
FROM node:20-alpine AS base
WORKDIR /app

# Install deps using root workspace
COPY package*.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
RUN npm ci

# Build API
COPY . .
RUN npm --workspace api exec prisma generate \
 && npm --workspace api run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=base /app/package*.json ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/apps/api/dist ./apps/api/dist
COPY --from=base /app/apps/api/prisma ./apps/api/prisma

ENV PORT=4000
EXPOSE 4000

# Run migrations then start
CMD sh -c "npm --workspace api exec prisma migrate deploy && node apps/api/dist/main.js"


