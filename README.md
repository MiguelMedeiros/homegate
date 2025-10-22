# Home Gate - Monorepo

A monorepo for the Home Gate project - your gateway to sign up and join the Pubky homeserver network.

## Project Structure

```
home-gate/
├── .cursor/
│   └── docs/          # Project planning & development docs
├── front-end/         # Next.js 15 web application
│   ├── src/          # Application source code
│   ├── public/       # Static assets
│   └── README.md     # Frontend documentation
└── [future packages]  # Additional packages will go here
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

## Development

### Prerequisites
- Node.js 18+ (for local development)
- npm, yarn, or pnpm (for local development)
- Docker & Docker Compose (for containerized development)

### Option 1: Docker (Recommended)

```bash
# Start all services (frontend + phoenixd)
docker compose up

# Access the application
# Frontend: http://localhost:3000
# phoenixd: http://localhost:9740
```

See [DOCKER.md](./DOCKER.md) for detailed Docker documentation.

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
- **front-end**: Web application
- **[future]**: Backend services, shared libraries, etc.

## Documentation

### Setup & Deployment
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

