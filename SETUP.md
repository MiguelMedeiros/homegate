# Setup Guide

Quick setup guide for the Home Gate project.

## Docker Setup (Recommended) 🐳

The easiest way to get everything running:

### 1. Configure Environment Variables

Copy the example environment file and add your Phoenix token:

```bash
cp .env.example .env
# Edit .env and add your PHOENIXD_TOKEN
```

### 2. Start All Services

```bash
make build    # Build all services
make dev      # Start with logs (recommended)
# or
make up       # Start in background
```

That's it! The following services will be running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **phoenixd**: http://localhost:9740

## Local Development Setup

If you prefer to run services locally without Docker:

### 1. Backend Setup

```bash
cd back-end
npm install
cp .env.example .env
# Edit .env and configure PHOENIXD_HOST and PHOENIXD_TOKEN
npm run dev    # Runs on http://localhost:4000
```

### 2. Frontend Setup

```bash
cd front-end
npm install
# Create .env.local if needed with NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
npm run dev    # Runs on http://localhost:3000
```

### 3. phoenixd (Lightning Node)

You'll need phoenixd running separately. See phoenixd documentation for installation.

## Environment Variables

### Backend (.env)
```env
PORT=4000
PHOENIXD_HOST=http://localhost:9740  # or http://phoenixd:9740 in Docker
PHOENIXD_TOKEN=your-token-here
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000  # Client-side
BACKEND_URL=http://backend:4000                 # Server-side (Docker)
```

## Testing the Setup

### Check Backend Health
```bash
curl http://localhost:4000/health
```

Expected response:
```json
{"status":"ok","service":"home-gate-backend"}
```

### Check Frontend
Open http://localhost:3000 in your browser.

## Common Issues

### Backend can't connect to phoenixd
- Make sure phoenixd is running
- Check PHOENIXD_HOST is correct
- Verify PHOENIXD_TOKEN is set

### Frontend can't connect to backend
- Verify backend is running on port 4000
- Check NEXT_PUBLIC_BACKEND_URL environment variable
- Check browser console for CORS errors

## Useful Commands

```bash
# Docker commands
make help        # Show all available commands
make logs        # View all logs
make backend     # View backend logs only
make frontend    # View frontend logs only
make restart     # Restart all services
make down        # Stop all services

# Backend commands (in back-end directory)
npm run dev      # Development mode
npm run build    # Build TypeScript
npm start        # Run production build

# Frontend commands (in front-end directory)
npm run dev      # Development mode
npm run build    # Production build
npm start        # Run production server
```

## Next Steps

- Read [README.md](./README.md) for complete project overview
- Check [GETTING_STARTED.md](./GETTING_STARTED.md) for detailed walkthrough
- See [back-end/README.md](./back-end/README.md) for backend API documentation

