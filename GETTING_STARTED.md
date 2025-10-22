# Getting Started with Home Gate

## Prerequisites

Make sure you have installed:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Git

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd home-gate
   ```

2. **Start the application**
   ```bash
   make dev
   ```
   
   Or if you prefer background mode:
   ```bash
   make up
   ```

3. **Access the application**
   - Open your browser: http://localhost:3000
   - phoenixd API: http://localhost:9740

That's it! You're now running:
- ✅ Next.js 15 frontend with hot reload
- ✅ phoenixd Lightning Network node

## What Just Happened?

When you ran `make dev`, Docker:
1. Built the Next.js frontend container
2. Downloaded and started phoenixd
3. Set up networking between services
4. Mounted volumes for live code updates

## Making Changes

### Frontend Development

1. Edit any file in `front-end/src/`
2. Changes automatically appear in your browser (hot reload)
3. View logs in your terminal (if using `make dev`)

Example:
```bash
# Edit the homepage
vim front-end/src/app/page.tsx

# Save and refresh browser - changes appear instantly!
```

### Adding npm Packages

```bash
# Inside the container
docker compose exec frontend npm install <package-name>

# Or use the shortcut
make install
# Then enter the package name when prompted
```

## Common Commands

```bash
make dev        # Start with logs (recommended for development)
make up         # Start in background
make down       # Stop all services
make restart    # Restart services
make logs       # View all logs
make frontend   # View frontend logs only
make phoenixd   # View phoenixd logs only
make shell      # Open terminal in frontend container
make help       # See all commands
```

## Stopping the Application

```bash
make down
```

## Troubleshooting

### Port Already in Use

If you see "port 3000 already in use":

```bash
# Stop any process using port 3000
lsof -ti:3000 | xargs kill

# Or change the port in docker-compose.yml
```

### Need to Rebuild?

If something isn't working:

```bash
make clean    # Remove everything
make build    # Rebuild from scratch
```

### View Logs

```bash
make logs     # All services
make frontend # Just frontend
make phoenixd # Just phoenixd
```

## Next Steps

Now that you're up and running:

1. 📖 Read the [Frontend Documentation](./front-end/README.md)
2. 🐳 Learn more about [Docker Setup](./DOCKER.md)
3. 💻 Check the [Development Guide](./.cursor/docs/DEVELOPMENT.md)
4. 🏗️ Understand the [Monorepo Structure](./.cursor/docs/MONOREPO_STRUCTURE.md)

## Development Workflow

```bash
# Morning: Start your day
make dev

# Work on features
# Edit files in front-end/src/
# Changes appear automatically

# View logs if needed
make logs

# Evening: Stop everything
make down
```

## Adding shadcn/ui Components

```bash
# Get a shell in the frontend container
make shell

# Add components
npx shadcn@latest add button card form input

# Exit shell
exit
```

## Environment Variables

If you need custom configuration:

```bash
# Copy the example
cp .env.example .env

# Edit with your values
vim .env

# Restart services to apply
make restart
```

## Data Persistence

### phoenixd Data

The `./phoenixd` directory contains all Lightning Network data:
- Wallet information
- Channel data
- Configuration

⚠️ **Important**: This directory is git-ignored. Back it up separately!

### Frontend Build

Hot reload works automatically. No manual rebuilding needed during development.

## Production Deployment

For production, see:
- [Docker Guide](./DOCKER.md) - Production configuration section
- [Deployment docs](./.cursor/docs/) - Coming soon

## Getting Help

- Check [DOCKER.md](./DOCKER.md) for detailed Docker info
- See [README.md](./README.md) for project overview
- View [.cursor/docs/](./.cursor/docs/) for all documentation

## Quick Reference Card

```
┌─────────────────────────────────────────────┐
│  HOME GATE - QUICK REFERENCE                │
├─────────────────────────────────────────────┤
│  Start:     make dev                        │
│  Stop:      make down                       │
│  Logs:      make logs                       │
│  Restart:   make restart                    │
│  Shell:     make shell                      │
│  Help:      make help                       │
├─────────────────────────────────────────────┤
│  Frontend:  http://localhost:3000           │
│  phoenixd:  http://localhost:9740           │
└─────────────────────────────────────────────┘
```

Happy coding! 🚀

