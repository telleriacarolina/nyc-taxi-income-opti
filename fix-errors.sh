#!/bin/bash

echo "🔧 Fixing TLC Driver Hub errors..."
echo ""

echo "1️⃣  Cleaning build artifacts..."
rm -rf dist/
rm -rf .vite/
rm -rf node_modules/.vite/
rm -rf node_modules/.tmp/

echo "2️⃣  Clearing Vite cache..."
npx vite optimize --force

echo "3️⃣  Checking for syntax errors..."
npx tsc --noEmit

echo ""
echo "✅ Error fix complete!"
echo "   Please restart your development server with: npm run dev"
