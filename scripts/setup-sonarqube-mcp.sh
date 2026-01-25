#!/bin/bash

# SonarQube MCP Server Setup Script
# This script clones and configures the SonarQube MCP Server for the project

set -e

echo "========================================"
echo "SonarQube MCP Server Setup"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if in correct directory
if [ "$(pwd)" != "/workspaces/spark-template" ]; then
    echo -e "${RED}✗ Error: Must be run from /workspaces/spark-template${NC}"
    echo "Run: cd /workspaces/spark-template && npm run sonar:setup"
    exit 1
fi

# Check if already cloned
if [ -d "/workspaces/sonarqube-mcp-server" ]; then
    echo -e "${YELLOW}✓ SonarQube MCP Server already cloned${NC}"
    cd /workspaces/sonarqube-mcp-server
    echo -e "${BLUE}→ Pulling latest changes...${NC}"
    git pull
else
    echo -e "${BLUE}→ Cloning SonarQube MCP Server...${NC}"
    cd /workspaces
    git clone https://github.com/telleriacarolina/sonarqube-mcp-server.git
    cd sonarqube-mcp-server
fi

# Check if it's a Node.js project
if [ ! -f "package.json" ]; then
    echo -e "${YELLOW}⚠ Warning: No package.json found in repository${NC}"
    echo -e "${YELLOW}This may not be a Node.js project${NC}"
    echo -e "${YELLOW}Skipping npm installation steps${NC}"
    echo ""
    echo -e "${BLUE}→ Installing sonarqube-scanner in project...${NC}"
    cd /workspaces/spark-template
    npm install --save-dev sonarqube-scanner
    echo ""
    echo -e "${GREEN}✓ Setup complete (scanner only)${NC}"
    echo "You can use 'npm run sonar:scan' to analyze your project"
    exit 0
fi

# Install dependencies
echo ""
echo -e "${BLUE}→ Installing dependencies...${NC}"
npm install

# Build the project
echo ""
echo -e "${BLUE}→ Building the project...${NC}"
if npm run build 2>/dev/null; then
    echo -e "${GREEN}✓ Build successful${NC}"
else
    echo -e "${YELLOW}⚠ Build failed or no build script${NC}"
fi

# Link globally
echo ""
echo -e "${BLUE}→ Linking globally...${NC}"
npm link

# Return to project and link
echo ""
echo -e "${BLUE}→ Linking to project...${NC}"
cd /workspaces/spark-template
npm link sonarqube-mcp-server

# Install sonarqube-scanner if not already installed
echo ""
echo -e "${BLUE}→ Checking for sonarqube-scanner...${NC}"
if ! grep -q "sonarqube-scanner" package.json; then
    echo -e "${BLUE}→ Installing sonarqube-scanner...${NC}"
    npm install --save-dev sonarqube-scanner
else
    echo -e "${YELLOW}✓ sonarqube-scanner already installed${NC}"
fi

echo ""
echo -e "${GREEN}========================================"
echo "✓ Setup Complete!"
echo "========================================${NC}"
echo ""
echo "Next steps:"
echo "1. Configure SonarQube credentials in .env.local"
echo "2. Create sonar-project.properties"
echo "3. Run: npm run sonar:scan"
echo ""
echo "See docs/SONARQUBE_QUICKSTART.md for details"
