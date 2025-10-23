# Home Gate - Monorepo

A monorepo for the Home Gate project - your gateway to sign up and join the Pubky homeserver network.

## 🚀 Quick Start

```bash
# Start with Docker (recommended)
make dev              # Development mode with logs
# or
make up               # Background mode

# Access: http://localhost:3000
```

That's it! Both the frontend and phoenixd will be running.

> 📚 **New to the project?** Check out [GETTING_STARTED.md](./GETTING_STARTED.md) for a complete walkthrough!

## Project Structure

```
home-gate/
├── .cursor/
│   └── docs/          # Project planning & development docs
├── front-end/         # Next.js 15 web application
│   ├── src/          # Application source code
│   ├── public/       # Static assets
│   └── README.md     # Frontend documentation
├── back-end/          # Express.js API server
│   ├── src/          # Backend source code
│   └── README.md     # Backend documentation
└── phoenixd/          # Phoenix Lightning node data (git-ignored)
```

## Packages

### 🎨 Front-end
Next.js 15 web application with shadcn/ui for the homeserver signup gateway.

**Tech Stack:**
- Next.js 16.0.0 with App Router
- React 19.2.0
- TypeScript 5 (strict mode)
- Tailwind CSS v4
- shadcn/ui components

**Get Started:**
```bash
cd front-end
npm install
npm run dev
```

See [front-end/README.md](./front-end/README.md) for detailed documentation.

### ⚙️ Back-end
Express.js REST API server for handling Lightning invoices and payments.

**Tech Stack:**
- Express.js 4
- TypeScript 5
- Phoenix daemon integration
- CORS enabled

**Get Started:**
```bash
cd back-end
npm install
npm run dev
```

See [back-end/README.md](./back-end/README.md) for detailed documentation.

## Development

### Prerequisites
- Node.js 18+ (for local development)
- npm, yarn, or pnpm (for local development)
- Docker & Docker Compose (for containerized development)

### Option 1: Docker (Recommended) 🐳

The easiest way to run the entire stack:

```bash
# Quick start with Makefile
make dev              # Start with logs (recommended for development)
make up               # Start in background

# Or use Docker Compose directly
docker compose up     # Start with logs
docker compose up -d  # Start in background
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- phoenixd API: http://localhost:9740

**Other useful commands:**
```bash
make logs      # View logs
make down      # Stop services
make restart   # Restart services
make help      # See all available commands
```

See [DOCKER.md](./DOCKER.md) for complete Docker documentation.

### Option 2: Local Development

1. **Clone the repository**
```bash
git clone <repository-url>
cd home-gate
```

2. **Set up the frontend**
```bash
cd front-end
npm install
npm run dev
```

3. **Open your browser**
- Frontend: http://localhost:3000

## Monorepo Structure

This is set up as a monorepo to accommodate multiple packages:
- **front-end**: Next.js web application
- **back-end**: Express.js API server
- **phoenixd**: Lightning Network node (managed by Docker)

## Docker Services

The project includes Docker Compose configuration with the following services:

### 🌐 Frontend Service
- **Port**: 3000
- **Container**: Next.js 15 application
- **Features**: Hot reload, volume mounting for live development
- **Image**: Custom build from `front-end/Dockerfile`

### ⚙️ Backend Service
- **Port**: 4000
- **Container**: Express.js API server
- **Features**: Hot reload with ts-node-dev, REST API endpoints
- **Image**: Custom build from `back-end/Dockerfile`
- **Endpoints**: `/api/invoice`, `/health`

### ⚡ phoenixd Service
- **Port**: 9740
- **Container**: Lightning Network node
- **Features**: Data persistence, automatic restart
- **Image**: `acinq/phoenixd:latest`
- **Volume**: `./phoenixd` (automatically created, git-ignored)

### Quick Commands

| Command | Description |
|---------|-------------|
| `make dev` | Start services with logs (best for development) |
| `make up` | Start services in background |
| `make down` | Stop all services |
| `make logs` | View all logs |
| `make frontend` | View frontend logs only |
| `make backend` | View backend logs only |
| `make phoenixd` | View phoenixd logs only |
| `make restart` | Restart all services |
| `make build` | Rebuild services |
| `make clean` | Stop and remove everything |
| `make shell` | Open shell in frontend container |
| `make shell-be` | Open shell in backend container |
| `make help` | Show all available commands |

> 💡 **Tip**: Use `make dev` for active development to see logs in real-time.

## Documentation

### Getting Started
- [Getting Started Guide](./GETTING_STARTED.md) - Complete walkthrough for new developers
- [Docker Guide](./DOCKER.md) - Docker Compose setup and commands
- [Frontend Documentation](./front-end/README.md) - Frontend package details

### Project Planning & Architecture
- [Project Summary](./.cursor/docs/PROJECT_SUMMARY.md) - Complete project overview
- [Monorepo Structure](./.cursor/docs/MONOREPO_STRUCTURE.md) - Monorepo organization guide
- [Development Guide](./.cursor/docs/DEVELOPMENT.md) - Development practices & tips
- [Quick Start](./.cursor/docs/QUICKSTART.md) - Get started quickly

> 📁 All planning and architecture docs are in [`.cursor/docs/`](./.cursor/docs/)

## Contributing

[Add contributing guidelines here]

## License

[Add license here]

