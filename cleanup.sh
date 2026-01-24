#!/bin/bash
# Cleanup script to remove duplicate and unnecessary files

echo "Starting cleanup..."

# Delete empty and garbage files
rm -f "0" "that touch map components" "changed in relevant commits"

# Delete duplicate files (keeping organized versions)
rm -f OPENFREEMAP.md  # Keep .github/OPENFREEMAP.md
rm -f REBUILD_REQUIRED.md  # Keep docs/docker/REBUILD_REQUIRED.md

# Create docs directory structure if needed
mkdir -p docs

# Move documentation files to docs folder
mv -f AI_INSIGHTS_DATABASE.md docs/ 2>/dev/null || true
mv -f DATABASE_AI_IMPLEMENTATION.md docs/ 2>/dev/null || true
mv -f LOCATION_PERMISSIONS.md docs/ 2>/dev/null || true
mv -f PYTHON_SETUP.md docs/ 2>/dev/null || true
mv -f SECURITY.md docs/ 2>/dev/null || true
mv -f "Code Reviewer.md" docs/code-reviewer.md 2>/dev/null || true

# Remove unused packages
rm -rf packages/spark-tools

# Remove packages directory if empty
rmdir packages 2>/dev/null || true

echo "Cleanup complete!"
echo ""
echo "Files removed:"
echo "  - Empty/garbage files: 0, 'that touch map components', 'changed in relevant commits'"
echo "  - Duplicate OPENFREEMAP.md (kept .github version)"
echo "  - Duplicate REBUILD_REQUIRED.md (kept docs/docker version)"
echo ""
echo "Files moved to docs/:"
echo "  - AI_INSIGHTS_DATABASE.md"
echo "  - DATABASE_AI_IMPLEMENTATION.md"
echo "  - LOCATION_PERMISSIONS.md"
echo "  - PYTHON_SETUP.md"
echo "  - SECURITY.md"
echo "  - Code Reviewer.md -> code-reviewer.md"
echo ""
echo "Packages removed:"
echo "  - packages/spark-tools (unused)"
