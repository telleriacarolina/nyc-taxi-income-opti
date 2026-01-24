# 🐳 Docker Setup for NYC Taxi Income Optimizer

This project includes Docker configurations for both development and production environments.

## 📋 Prerequisites

- Docker Desktop installed and running
- Docker Compose V2 (included with Docker Desktop)

## ⚠️ Important: Running Docker in Dev Container

**Note:** If you're working inside a dev container (like this project), Docker commands need to be run from your **host machine**, not inside the dev container, unless you've configured Docker-in-Docker or Docker socket mounting.

### Option 1: Run from Host Machine (Recommended)
Open a terminal on your host machine and navigate to the project directory:
```bash
cd /path/to/spark-template
npm run docker:dev
```

### Option 2: Enable Docker in Dev Container
Add to `.devcontainer/devcontainer.json`:
```json
{
  "features": {
    "ghcr.io/devcontainers/features/docker-in-docker:2": {
      "version": "latest"
    }
  }
}
```
Then rebuild your dev container.

## 🚀 Quick Start

### Development Mode (with hot-reload)

```bash
# Start the development server
docker-compose up dev

# Or run in detached mode
docker-compose up -d dev
```

Access the app at: http://localhost:5173

### Production Mode

```bash
# Build and start the production container
docker-compose up -d prod
```

Access the app at: http://localhost:8080

## 📦 Available Commands

### Using Docker Compose

```bash
# Start development environment
docker compose up dev

# Start production environment
docker compose up prod

# Stop all containers
docker compose down

# Rebuild containers
docker compose build

# View logs
docker compose logs -f

# Remove all containers and volumes
docker compose down -v
```

**Note:** Modern Docker uses `docker compose` (with space) instead of the old `docker-compose` (with hyphen).

### Using Docker directly

```bash
# Build production image
docker build -t nyc-taxi-optimizer .

# Build development image
docker build -f Dockerfile.dev -t nyc-taxi-optimizer:dev .

# Run production container
docker run -d -p 8080:80 --name taxi-optimizer nyc-taxi-optimizer

# Run development container
docker run -d -p 5173:5173 -v $(pwd):/app --name taxi-optimizer-dev nyc-taxi-optimizer:dev
```

## 📁 Docker Files

- **Dockerfile** - Multi-stage production build with nginx
- **Dockerfile.dev** - Development environment with hot-reload
- **docker-compose.yml** - Orchestration for both dev and prod environments
- **.dockerignore** - Files to exclude from Docker builds

## 🏗️ Architecture

### Production Build (Multi-stage)
1. **Builder stage**: Compiles TypeScript and builds with Vite
2. **Production stage**: Serves static files with nginx

### Development Build
- Node.js 20 Alpine
- Hot module replacement (HMR)
- Volume mounting for live code changes

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
NODE_ENV=development
VITE_APP_NAME=NYC Taxi Income Optimizer
# Add other environment variables as needed
```

### Port Mapping

- **Development**: 5173 (Vite default)
- **Production**: 8080 → 80 (nginx)

## 🩺 Health Checks

The production container includes health checks:
- Interval: 30 seconds
- Timeout: 3 seconds
- Retries: 3

## 🐛 Troubleshooting

### Port already in use
```bash
# Find process using the port
lsof -i :5173  # or :8080

# Stop the specific container
docker-compose stop dev  # or prod
```

### Container won't start
```bash
# Check logs
docker-compose logs dev

# Rebuild from scratch
docker-compose build --no-cache dev
```

### Volume permission issues
```bash
# On Linux, you may need to adjust permissions
sudo chown -R $USER:$USER .
```

## 📊 Performance Tips

1. **Use .dockerignore**: Already configured to exclude unnecessary files
2. **Layer caching**: Package files copied before source code for better caching
3. **Multi-stage builds**: Keeps production image small (~50MB)
4. **Health checks**: Automatic container health monitoring

## 🔒 Security

The production nginx configuration includes:
- Security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- Gzip compression
- Static asset caching
- SPA routing support

## 📈 Production Deployment

For cloud deployment (AWS, Azure, GCP):

```bash
# Build for specific platform
docker build --platform linux/amd64 -t nyc-taxi-optimizer .

# Tag for registry
docker tag nyc-taxi-optimizer your-registry/nyc-taxi-optimizer:latest

# Push to registry
docker push your-registry/nyc-taxi-optimizer:latest
```

## 🛠️ NPM Scripts

Use the npm scripts added to package.json:

```bash
npm run docker:dev          # Start dev container
npm run docker:prod         # Start prod container
npm run docker:build        # Build prod image
npm run docker:stop         # Stop all containers
npm run docker:clean        # Remove containers and images
```
