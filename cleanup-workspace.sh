#!/bin/bash

echo "================================================"
echo "🧹 Workspace Cleanup & Optimization"
echo "================================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Counter
CLEANED=0

echo -e "${BLUE}→ Cleaning build artifacts...${NC}"
rm -rf dist
rm -rf .scannerwork
rm -rf node_modules/.vite
rm -rf node_modules/.cache
rm -rf .tailwindcss
((CLEANED+=5))
echo -e "${GREEN}✓ Removed build artifacts${NC}"

echo ""
echo -e "${BLUE}→ Cleaning duplicate/example files...${NC}"

# Remove example HTML files if they exist
if [ -f "design-system-test.html" ]; then
    rm design-system-test.html
    echo "  - Removed design-system-test.html"
    ((CLEANED++))
fi

if [ -f "red-burgundy-test.html" ]; then
    rm red-burgundy-test.html
    echo "  - Removed red-burgundy-test.html"
    ((CLEANED++))
fi

# Remove helper scripts that are no longer needed
if [ -f "check-sonar.sh" ]; then
    rm check-sonar.sh
    echo "  - Removed check-sonar.sh (functionality in package.json)"
    ((CLEANED++))
fi

if [ -f "create-sonar-project.sh" ]; then
    rm create-sonar-project.sh
    echo "  - Removed create-sonar-project.sh (project already created)"
    ((CLEANED++))
fi

echo -e "${GREEN}✓ Cleaned example/helper files${NC}"

echo ""
echo -e "${BLUE}→ Consolidating documentation...${NC}"

# Keep only essential docs, remove redundant ones
if [ -f "docs/SONARQUBE_NEXT_STEPS.md" ]; then
    # Content is covered by SONARQUBE_QUICKSTART.md
    rm docs/SONARQUBE_NEXT_STEPS.md
    echo "  - Removed SONARQUBE_NEXT_STEPS.md (redundant)"
    ((CLEANED++))
fi

if [ -f "docs/SONARQUBE_STATUS.md" ]; then
    # Status files become outdated quickly
    rm docs/SONARQUBE_STATUS.md
    echo "  - Removed SONARQUBE_STATUS.md (outdated)"
    ((CLEANED++))
fi

if [ -f "docs/TICKET_001_COMPLETE.md" ]; then
    # Completed ticket documentation
    rm docs/TICKET_001_COMPLETE.md
    echo "  - Removed TICKET_001_COMPLETE.md (archived work)"
    ((CLEANED++))
fi

echo -e "${GREEN}✓ Consolidated documentation${NC}"

echo ""
echo -e "${BLUE}→ Cleaning temporary/cache files...${NC}"

# Remove log files
find . -name "*.log" -type f -not -path "./node_modules/*" -delete 2>/dev/null
echo "  - Removed log files"

# Remove DS_Store files (Mac)
find . -name ".DS_Store" -type f -delete 2>/dev/null

# Remove temp files
rm -rf /tmp/sonar* 2>/dev/null

((CLEANED+=3))
echo -e "${GREEN}✓ Cleaned temporary files${NC}"

echo ""
echo -e "${BLUE}→ Optimizing coverage reports...${NC}"

# Keep only essential coverage files
if [ -d "coverage" ]; then
    # Keep lcov.info and index.html, remove large detailed reports
    find coverage -name "*.js" -type f -delete 2>/dev/null
    find coverage -name "*.css" -type f ! -name "base.css" -delete 2>/dev/null
    echo "  - Optimized coverage directory"
    ((CLEANED++))
fi

echo -e "${GREEN}✓ Optimized coverage${NC}"

echo ""
echo -e "${GREEN}========================================"
echo "✓ Cleanup Complete!"
echo "========================================${NC}"
echo ""
echo -e "${BLUE}Summary:${NC}"
echo "  - Cleaned $CLEANED items"
echo "  - Removed build artifacts"
echo "  - Consolidated documentation"
echo "  - Removed example files"
echo "  - Cleaned temporary files"
echo ""
echo -e "${YELLOW}Preserved:${NC}"
echo "  - Source code (src/)"
echo "  - Essential configs"
echo "  - Core documentation"
echo "  - Test files"
echo "  - Package files"
echo ""
echo "Run 'git status' to review changes"
