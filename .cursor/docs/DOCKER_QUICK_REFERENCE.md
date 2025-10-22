# Docker Quick Reference

Quick command reference for working with Docker Compose in the Home Gate project.

## 🚀 Quick Start

```bash
# Start all services (detached)
docker compose up -d

# Start and view logs
docker compose up

# Using Makefile (easier)
make up    # Start detached
make dev   # Start with logs
```

## 📦 Services

| Service | Port | Purpose |
|---------|------|---------|
| frontend | 3000 | Next.js web application |
| phoenixd | 9740 | Lightning Network node |

## 🎯 Common Commands

### Start/Stop

```bash
# Start
docker compose up -d
make up

# Stop
docker compose down
make down

# Restart
docker compose restart
make restart
```

### Logs

```bash
# All services
docker compose logs -f
make logs

# Specific service
docker compose logs -f frontend
make frontend

docker compose logs -f phoenixd
make phoenixd
```

### Build

```bash
# Build/rebuild
docker compose up --build
make build

# Rebuild specific service
docker compose up --build frontend
```

### Clean Up

```bash
# Stop and remove containers
docker compose down

# Remove volumes too (clean slate)
docker compose down -v
make clean
```

## 🔧 Development

### Install Dependencies

```bash
# Inside container
docker compose exec frontend npm install <package>

# Using Makefile
make install
```

### Run Commands

```bash
# Run npm script
docker compose exec frontend npm run build

# Shell access
docker compose exec frontend sh
make shell
```

### View Container Status

```bash
# List running containers
docker compose ps

# Detailed info
docker compose ps -a
```

## 🐛 Troubleshooting

### Port in Use

```bash
# Check what's using the port
lsof -i :3000
lsof -i :9740

# Kill the process or change port in docker-compose.yml
```

### Rebuild from Scratch

```bash
# Stop, remove everything, and rebuild
docker compose down -v
docker compose up --build
```

### Node Modules Issues

```bash
# Remove volumes and reinstall
docker compose down -v
docker compose up --build
```

### View Full Logs

```bash
# All logs since start
docker compose logs

# Last 100 lines
docker compose logs --tail=100

# Follow specific service
docker compose logs -f frontend
```

## 📝 Environment Variables

```bash
# Copy example file
cp .env.example .env

# Edit as needed
vim .env

# Restart to apply changes
docker compose down
docker compose up -d
```

## 🔍 Inspect Services

```bash
# Service details
docker compose config

# Network info
docker network ls
docker network inspect home-gate_default

# Volume info
docker volume ls
```

## 💾 Data Persistence

### phoenixd Data

```
./phoenixd/           # All phoenix data
├── phoenix.conf      # Configuration
├── phoenix.log       # Logs
└── [wallet data]     # DO NOT commit to git
```

### Frontend Build

```bash
# View .next build output
docker compose exec frontend ls -la .next/
```

## ⚡ Makefile Commands

```bash
make help      # Show all available commands
make up        # Start all services
make down      # Stop all services
make dev       # Start with logs (foreground)
make logs      # View all logs
make build     # Rebuild services
make clean     # Complete cleanup
make frontend  # Frontend logs
make phoenixd  # phoenixd logs
make shell     # Shell access to frontend
make install   # Install npm packages
```

## 🔗 Useful Links

- [DOCKER.md](../../DOCKER.md) - Full Docker documentation
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [phoenixd Docs](https://phoenix.acinq.co/)

