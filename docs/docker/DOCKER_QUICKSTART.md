# Quick Reference: Docker Commands

## 🚨 You are in a Dev Container

Docker needs to run from your **host machine**, not inside this dev container.

## ✅ Simple Steps

### 1. Open Your Host Terminal
- **Mac/Linux**: Open Terminal app
- **Windows**: Open PowerShell or Command Prompt
- Or use VS Code's local terminal (not the dev container terminal)

### 2. Go to Your Project
```bash
cd ~/nyc-taxi-income-opti
# or wherever you have the project on your local machine
```

### 3. Run Docker
```bash
# Development mode (hot-reload on http://localhost:5173)
docker compose up dev

# Production mode (on http://localhost:8080)
docker compose up -d prod

# Stop everything
docker compose down
```

## 🎯 NPM Scripts (from host machine)

```bash
npm run docker:dev          # Start dev server
npm run docker:prod         # Start prod server
npm run docker:stop         # Stop containers
npm run docker:logs         # View logs
npm run docker:clean        # Clean up everything
```

## 🛠️ Current Project Location

Your project is located at:
- **In dev container**: `/workspaces/spark-template`
- **On your host**: Probably `~/nyc-taxi-income-opti` or similar

Find it by looking at where you cloned the repository originally.

## 💡 Pro Tip

You can have BOTH running at the same time:
1. Dev container for editing code (VS Code)
2. Docker containers for testing (running from host)

They won't conflict because they use different ports!

---

**Questions?** Check [DOCKER.md](./DOCKER.md) for full documentation.
