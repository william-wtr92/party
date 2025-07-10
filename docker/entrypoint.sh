#!/bin/sh

export HOME=/tmp

cd /usr/src/app

echo "📦 Running db:generate..."
pnpm run db:generate

echo "📦 Running db:migrate..."
pnpm run db:migrate

echo "✅ Database migrations completed successfully."
cd /usr/src/app/apps/server
node dist/index.js