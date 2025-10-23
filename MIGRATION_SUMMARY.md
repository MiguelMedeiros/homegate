# Backend Migration Summary

This document describes the migration of the invoice API from Next.js API routes to a standalone Express.js backend.

## What Changed?

### ✅ Created New Backend Service

Created a new Express.js backend in `/back-end` with the following structure:

```
back-end/
├── src/
│   ├── index.ts                      # Express app entry point
│   ├── routes/
│   │   └── invoice.ts                # Invoice routes
│   └── controllers/
│       └── invoiceController.ts      # Invoice logic (from Next.js)
├── package.json                       # Dependencies
├── tsconfig.json                      # TypeScript config
├── Dockerfile                         # Docker image
├── .dockerignore                      # Docker ignore file
├── .gitignore                         # Git ignore file
├── .env.example                       # Environment variables example
├── install.sh                         # Installation script
└── README.md                          # Backend documentation
```

### 📝 Backend Features

- **Port**: 4000
- **TypeScript**: Full TypeScript support
- **Hot Reload**: Using `ts-node-dev` for development
- **CORS**: Enabled for frontend communication
- **Endpoints**:
  - `POST /api/invoice` - Create Lightning invoice
  - `GET /api/invoice?paymentHash=xxx` - Check invoice status
  - `GET /health` - Health check

### 🔄 Updated Frontend

Modified the frontend to call the new backend API:

1. Created `src/lib/config.ts` - Centralized API configuration
2. Updated `src/app/signup/basic/page.tsx` - Use backend API instead of Next.js API route
3. Environment variables for backend URL configuration

### 🐳 Updated Docker Compose

Added backend service to `docker-compose.yml`:

```yaml
backend:
  container_name: backend
  build:
    context: ./back-end
    dockerfile: Dockerfile
  ports:
    - "4000:4000"
  depends_on:
    - phoenixd
  environment:
    - PORT=4000
    - PHOENIXD_HOST=http://phoenixd:9740
    - PHOENIXD_TOKEN=${PHOENIXD_TOKEN}
```

### 🛠️ Updated Makefile

Added new commands for backend:

- `make backend` - View backend logs
- `make shell-be` - Open shell in backend container

### 📚 Updated Documentation

- Updated `README.md` with backend information
- Created `SETUP.md` for quick setup instructions
- Created backend `README.md` with API documentation

## Migration Path

### What Was Moved

The invoice creation logic was moved from:
- **From**: `/front-end/src/app/api/invoice/route.ts` (Next.js API route)
- **To**: `/back-end/src/controllers/invoiceController.ts` (Express controller)

### What Changed in the Logic

Almost nothing! The core logic remains the same:
- Same parameters (amountSat, description, externalId, expirySeconds)
- Same phoenixd API integration
- Same response format

The only changes are:
- Adapted from Next.js `NextRequest/NextResponse` to Express `Request/Response`
- Removed `webhookUrl` parameter (was not being used)

### What Stays in Frontend

The Next.js API route (`/front-end/src/app/api/invoice/route.ts`) is still there but should be removed in the future. The frontend now calls the backend directly.

## Environment Variables

### Before (All in frontend)
```env
PHOENIXD_HOST=http://phoenixd:9740
PHOENIXD_TOKEN=your-token
```

### After (Split between services)

**Backend** (`.env` or docker-compose):
```env
PORT=4000
PHOENIXD_HOST=http://phoenixd:9740
PHOENIXD_TOKEN=your-token
```

**Frontend** (`.env.local` or docker-compose):
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000  # Client-side
BACKEND_URL=http://backend:4000                 # Server-side (Docker)
```

## How to Use

### With Docker (Recommended)

```bash
# 1. Configure environment
cp .env.example .env
# Edit .env and add PHOENIXD_TOKEN

# 2. Build and start
make build
make dev

# Access:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:4000
# - phoenixd: http://localhost:9740
```

### Local Development

```bash
# 1. Start backend
cd back-end
npm install
npm run dev  # Port 4000

# 2. Start frontend (in another terminal)
cd front-end
npm run dev  # Port 3000

# 3. phoenixd must be running separately
```

## Testing

### Test Backend Health
```bash
curl http://localhost:4000/health
```

### Test Invoice Creation
```bash
curl -X POST http://localhost:4000/api/invoice \
  -H "Content-Type: application/json" \
  -d '{
    "amountSat": 1000,
    "description": "Test invoice",
    "externalId": "test-123"
  }'
```

## Benefits

1. **Separation of Concerns**: API logic separated from frontend
2. **Scalability**: Backend can be scaled independently
3. **Flexibility**: Backend can serve multiple clients (web, mobile, etc.)
4. **Clarity**: Clear API boundaries and documentation
5. **Development**: Independent development and deployment of frontend/backend

## Next Steps

- [ ] Remove old Next.js API route (`/front-end/src/app/api/invoice/route.ts`)
- [ ] Add more backend endpoints as needed
- [ ] Add authentication/authorization
- [ ] Add request validation middleware
- [ ] Add logging middleware
- [ ] Add rate limiting
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Add tests for backend

## Rollback Plan

If you need to rollback to the old setup:

1. Change frontend to use `/api/invoice` instead of backend URL
2. Stop backend service: `docker compose stop backend`
3. The Next.js API route is still there and functional

---

**Date**: October 23, 2025  
**Author**: Migration completed via Cursor AI assistant

