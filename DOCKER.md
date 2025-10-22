# Docker Setup Guide

This guide explains how to run the Home Gate project using Docker Compose.

## Services

The docker-compose setup includes two services:

### 1. phoenixd
- **Image**: `acinq/phoenixd:latest`
- **Port**: 9740
- **Volume**: `./phoenixd` → `/phoenix/.phoenix`
- **Purpose**: Lightning Network node for payment processing

### 2. frontend
- **Build**: Custom Next.js 15 application
- **Port**: 3000
- **Purpose**: Web application for homeserver signup

## Prerequisites

- Docker Desktop installed
- Docker Compose v2+

## Quick Start

### Start all services

```bash
docker compose up
```

Or run in detached mode:

```bash
docker compose up -d
```

### Access the application

- **Frontend**: http://localhost:3000
- **phoenixd**: http://localhost:9740

### View logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f frontend
docker compose logs -f phoenixd
```

### Stop services

```bash
docker compose down
```

### Rebuild after changes

```bash
docker compose up --build
```

## Development Workflow

### Frontend Development

The frontend service uses volume mounting for hot-reload during development:

```bash
# Start services
docker compose up

# Make changes to files in front-end/
# Changes are automatically reflected in the container
```

### Install new dependencies

```bash
# Option 1: Inside container
docker compose exec frontend npm install <package-name>

# Option 2: Locally then rebuild
cd front-end
npm install <package-name>
docker compose up --build frontend
```

## Service Details

### phoenixd Configuration

The phoenixd service stores its data in `./phoenixd` directory:

```
./phoenixd/
├── phoenix.conf       # Configuration file
├── phoenix.log        # Logs
└── [other data files] # Wallet and channel data
```

**Important**: The `phoenixd` directory is git-ignored to protect sensitive data.

### Frontend Configuration

The frontend runs in development mode with:
- Hot module replacement (HMR)
- Source maps for debugging
- Volume mounting for live code updates

## Common Commands

### Restart a specific service

```bash
docker compose restart frontend
```

### Stop and remove all containers

```bash
docker compose down
```

### Remove volumes (clean slate)

```bash
docker compose down -v
```

### View running containers

```bash
docker compose ps
```

### Execute commands in container

```bash
# Frontend shell
docker compose exec frontend sh

# Run npm commands
docker compose exec frontend npm run build
```

## Troubleshooting

### Port already in use

If port 3000 or 9740 is already in use:

1. Stop the conflicting process, or
2. Change the port in `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"  # Map to different host port
```

### Frontend not updating

1. Ensure volumes are properly mounted
2. Try rebuilding:
```bash
docker compose up --build frontend
```

### Node modules issues

If you encounter node_modules conflicts:

```bash
# Remove volumes and rebuild
docker compose down -v
docker compose up --build
```

### phoenixd connection issues

Check phoenixd logs:
```bash
docker compose logs phoenixd
```

Ensure the phoenixd directory has proper permissions:
```bash
chmod -R 755 ./phoenixd
```

## Production Build

For production deployment, create a separate `docker-compose.prod.yml`:

```yaml
name: home-gate-prod

services:
  frontend:
    container_name: frontend-prod
    build:
      context: ./front-end
      dockerfile: Dockerfile.prod
    ports:
      - "80:3000"
    environment:
      - NODE_ENV=production
    restart: always
```

Then run:
```bash
docker compose -f docker-compose.prod.yml up -d
```

## Environment Variables

Create a `.env` file in the root for environment-specific configuration:

```env
# Frontend
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:9740

# phoenixd
PHOENIX_PORT=9740
```

Update `docker-compose.yml` to use env file:

```yaml
services:
  frontend:
    env_file:
      - .env
```

## Security Notes

⚠️ **Important**:
- Never commit the `phoenixd/` directory (contains wallet data)
- Use `.env` files for sensitive configuration
- In production, use proper secrets management

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Docker Documentation](https://nextjs.org/docs/deployment#docker-image)
- [phoenixd Documentation](https://phoenix.acinq.co/)

