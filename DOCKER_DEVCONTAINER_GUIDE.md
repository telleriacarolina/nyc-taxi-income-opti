# Running Docker from Dev Container

You're seeing the "docker-compose: not found" error because Docker isn't available inside your dev container. Here are your options:

## ✅ Solution 1: Run from Host Machine (Easiest)

1. Open a **new terminal on your HOST machine** (outside the dev container)
2. Navigate to your project directory
3. Run the Docker commands:

```bash
cd /path/to/your/project
npm run docker:dev
```

or directly:

```bash
docker compose up dev
```

## 🔧 Solution 2: Enable Docker-in-Docker

If you want to run Docker from inside the dev container:

1. Create `.devcontainer/devcontainer.json`:

```json
{
  "name": "NYC Taxi Optimizer",
  "build": {
    "dockerfile": "Dockerfile"
  },
  "features": {
    "ghcr.io/devcontainers/features/docker-in-docker:2": {
      "version": "latest",
      "enableNonRootDocker": true
    }
  },
  "forwardPorts": [5173, 8080],
  "postCreateCommand": "npm install"
}
```

2. Rebuild your dev container:
   - Open Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
   - Run: "Dev Containers: Rebuild Container"

3. After rebuild, Docker will be available inside the container

## 🔗 Solution 3: Mount Docker Socket (Alternative)

Add to `.devcontainer/devcontainer.json`:

```json
{
  "mounts": [
    "source=/var/run/docker.sock,target=/var/run/docker.sock,type=bind"
  ]
}
```

This shares the host's Docker daemon with the container.

## 📝 Quick Check

Run this to see your current environment:

```bash
npm run docker:check
```

This will tell you if you're in a container and what steps to take.

## 🎯 Recommended Workflow

For development, I recommend **Solution 1** - running Docker from your host machine. It's simpler and avoids nested container complexity.

Your Docker setup is complete and ready to use - you just need to run it from the right place! 🚀
