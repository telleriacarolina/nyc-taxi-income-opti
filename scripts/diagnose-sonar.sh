#!/bin/bash

# Diagnostic and Fix Script for SonarQube Setup Issues

set -e

echo "========================================"
echo "SonarQube Setup Diagnostic & Fix"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check current directory
echo -e "${BLUE}Current directory:${NC} $(pwd)"
if [ "$(pwd)" != "/workspaces/spark-template" ]; then
    echo -e "${YELLOW}⚠ Warning: Not in project directory${NC}"
    echo "Run: cd /workspaces/spark-template"
    exit 1
fi

# Check node_modules
echo ""
echo -e "${BLUE}→ Checking node_modules...${NC}"
if [ ! -d "node_modules" ]; then
    echo -e "${RED}✗ node_modules missing${NC}"
    echo -e "${BLUE}→ Running npm install...${NC}"
    npm install
else
    echo -e "${GREEN}✓ node_modules exists${NC}"
fi

# Check @github/spark
echo ""
echo -e "${BLUE}→ Checking @github/spark package...${NC}"
if [ ! -d "node_modules/@github/spark" ]; then
    echo -e "${RED}✗ @github/spark missing${NC}"
    echo -e "${BLUE}→ Installing dependencies...${NC}"
    npm install
else
    echo -e "${GREEN}✓ @github/spark installed${NC}"
fi

# Check sonarqube-mcp-server
echo ""
echo -e "${BLUE}→ Checking sonarqube-mcp-server repository...${NC}"
if [ ! -d "/workspaces/sonarqube-mcp-server" ]; then
    echo -e "${YELLOW}⚠ Repository not found${NC}"
    echo -e "${BLUE}→ Cloning repository...${NC}"
    cd /workspaces
    git clone https://github.com/telleriacarolina/sonarqube-mcp-server.git
    cd /workspaces/spark-template
else
    echo -e "${GREEN}✓ Repository exists${NC}"
    
    # Check if it has package.json
    if [ ! -f "/workspaces/sonarqube-mcp-server/package.json" ]; then
        echo -e "${RED}✗ No package.json found in repository${NC}"
        echo -e "${YELLOW}Note: This repository may not be a Node.js project${NC}"
        echo -e "${YELLOW}Skipping npm installation for MCP server${NC}"
    else
        echo -e "${GREEN}✓ package.json found${NC}"
        
        # Install dependencies if needed
        if [ ! -d "/workspaces/sonarqube-mcp-server/node_modules" ]; then
            echo -e "${BLUE}→ Installing MCP server dependencies...${NC}"
            cd /workspaces/sonarqube-mcp-server
            npm install
            cd /workspaces/spark-template
        else
            echo -e "${GREEN}✓ MCP server dependencies installed${NC}"
        fi
    fi
fi

# Check .env.local
echo ""
echo -e "${BLUE}→ Checking credentials configuration...${NC}"
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠ .env.local not found${NC}"
    if [ -f ".env.local.example" ]; then
        echo -e "${BLUE}→ Creating .env.local from template...${NC}"
        cp .env.local.example .env.local
        echo -e "${YELLOW}⚠ Please edit .env.local with your SonarQube credentials${NC}"
    else
        echo -e "${RED}✗ .env.local.example not found${NC}"
    fi
else
    echo -e "${GREEN}✓ .env.local exists${NC}"
    
    # Check if it's configured
    if grep -q "your_token_here" .env.local 2>/dev/null; then
        echo -e "${YELLOW}⚠ .env.local needs configuration${NC}"
        echo "   Please edit .env.local with your actual credentials"
    else
        echo -e "${GREEN}✓ .env.local appears configured${NC}"
    fi
fi

# Summary
echo ""
echo -e "${GREEN}========================================"
echo "Diagnostic Complete"
echo "========================================${NC}"
echo ""
echo "Next steps:"
echo "1. Ensure .env.local has your SonarQube credentials"
echo "2. Run: npm run build (to verify build works)"
echo "3. Run: npm run sonar:scan (to scan the project)"
echo ""
echo "Note: If sonarqube-mcp-server has no package.json,"
echo "it may be a different type of project. You can still"
echo "use sonarqube-scanner directly without the MCP server."
