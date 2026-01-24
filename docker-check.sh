#!/bin/bash

# Docker Helper Script for Dev Container Environment
# This script provides instructions and checks for running Docker

set -e

echo "🐳 Docker Setup Check for NYC Taxi Income Optimizer"
echo "=================================================="
echo ""

# Check if we're in a container
if [ -f /.dockerenv ] || grep -qa docker /proc/1/cgroup 2>/dev/null; then
    echo "⚠️  You are currently inside a dev container."
    echo ""
    echo "Docker commands need to be run from your HOST machine, not inside the dev container."
    echo ""
    echo "📝 To run Docker commands:"
    echo ""
    echo "1. Open a NEW terminal on your HOST machine (outside the dev container)"
    echo "2. Navigate to your project directory:"
    echo "   cd $(pwd | sed 's|/workspaces/|/path/to/your/local/|')"
    echo ""
    echo "3. Run Docker commands:"
    echo "   npm run docker:dev      # Start development server"
    echo "   npm run docker:prod     # Start production server"
    echo ""
    echo "OR"
    echo ""
    echo "4. Run docker compose directly:"
    echo "   docker compose up dev"
    echo "   docker compose up -d prod"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🔧 Alternative: Enable Docker-in-Docker"
    echo ""
    echo "If you want to run Docker from inside the dev container,"
    echo "you need to configure Docker-in-Docker:"
    echo ""
    echo "1. Create .devcontainer/devcontainer.json with:"
    echo '   {
     "features": {
       "ghcr.io/devcontainers/features/docker-in-docker:2": {}
     }
   }'
    echo ""
    echo "2. Rebuild the dev container"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    exit 1
else
    # We're on the host, check Docker installation
    echo "✅ Running on host machine"
    echo ""
    
    if ! command -v docker &> /dev/null; then
        echo "❌ Docker is not installed or not in PATH"
        echo ""
        echo "Please install Docker Desktop from:"
        echo "https://www.docker.com/products/docker-desktop"
        exit 1
    fi
    
    echo "✅ Docker found: $(docker --version)"
    
    if docker compose version &> /dev/null; then
        echo "✅ Docker Compose V2: $(docker compose version)"
    elif command -v docker-compose &> /dev/null; then
        echo "⚠️  Using old docker-compose: $(docker-compose --version)"
        echo "   Consider upgrading to Docker Compose V2"
    else
        echo "❌ Docker Compose not found"
        exit 1
    fi
    
    # Check if Docker daemon is running
    if ! docker info &> /dev/null; then
        echo ""
        echo "❌ Docker daemon is not running"
        echo "   Please start Docker Desktop"
        exit 1
    fi
    
    echo "✅ Docker daemon is running"
    echo ""
    echo "🚀 You're all set! Run these commands:"
    echo ""
    echo "   npm run docker:dev       # Development with hot-reload"
    echo "   npm run docker:prod      # Production build"
    echo "   npm run docker:stop      # Stop containers"
    echo "   npm run docker:logs      # View logs"
    echo ""
fi
