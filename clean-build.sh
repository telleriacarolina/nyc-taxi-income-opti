#!/bin/bash

echo "🧹 Cleaning build artifacts and caches..."

# Remove dist
rm -rf dist
echo "✓ Removed dist/"

# Remove Vite cache
rm -rf node_modules/.vite
echo "✓ Removed node_modules/.vite/"

# Remove Tailwind cache
rm -rf .tailwindcss
rm -rf node_modules/.cache
echo "✓ Removed Tailwind cache"

# Remove SonarQube scanner work
rm -rf .scannerwork
echo "✓ Removed .scannerwork/"

echo ""
echo "✅ Clean complete! Now run: npm run build"
