#!/bin/sh
set -e

echo "🚀 Starting HMS SaaS Backend Deployment..."
echo "Environment: $NODE_ENV"
echo "Port: $PORT"

# Run Prisma migrations
echo "📦 Running database migrations..."
cd /app/apps/api
npx prisma migrate deploy

# Check migration status
if [ $? -eq 0 ]; then
    echo "✅ Migrations completed successfully"
else
    echo "❌ Migration failed"
    exit 1
fi

# Start the application
echo "🎯 Starting application..."
cd /app
exec node apps/api/dist/main.js
