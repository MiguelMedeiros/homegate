# Backend Architecture

## Overview

Express.js REST API server for handling Lightning Network invoice operations via phoenixd.

## Architecture Diagram

```
┌─────────────────┐
│   Frontend      │
│   (Next.js)     │
│   Port: 3000    │
└────────┬────────┘
         │ HTTP Requests
         │ (CORS enabled)
         ▼
┌─────────────────┐
│    Backend      │
│   (Express)     │◄──── You are here!
│   Port: 4000    │
└────────┬────────┘
         │ HTTP Requests
         │ (Basic Auth)
         ▼
┌─────────────────┐
│    phoenixd     │
│  (Lightning)    │
│   Port: 9740    │
└─────────────────┘
```

## Directory Structure

```
back-end/
├── src/
│   ├── index.ts                  # Express app initialization
│   │                             # - CORS configuration
│   │                             # - Route registration
│   │                             # - Server startup
│   │
│   ├── routes/
│   │   └── invoice.ts            # Route definitions
│   │                             # - POST /api/invoice
│   │                             # - GET /api/invoice
│   │
│   └── controllers/
│       └── invoiceController.ts  # Business logic
│                                 # - createInvoice()
│                                 # - getInvoiceStatus()
│
├── dist/                         # Compiled JavaScript (gitignored)
├── node_modules/                 # Dependencies (gitignored)
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript configuration
├── Dockerfile                    # Docker image definition
└── .env                          # Environment variables (gitignored)
```

## Request Flow

### Creating an Invoice

```
1. Client Request
   └─► POST http://localhost:4000/api/invoice
       Body: {
         "amountSat": 50000,
         "description": "Homeserver Signup",
         "externalId": "user-123",
         "expirySeconds": 3600
       }

2. Express Router (routes/invoice.ts)
   └─► Forwards to createInvoice controller

3. Invoice Controller (controllers/invoiceController.ts)
   ├─► Validates request parameters
   ├─► Creates URLSearchParams for phoenixd
   └─► Calls phoenixd API

4. phoenixd API
   └─► POST http://phoenixd:9740/createinvoice
       Headers: Basic Auth
       Body: Form data (amountSat, description, etc.)

5. Response Flow
   phoenixd ──► Controller ──► Router ──► Client
   {
     "success": true,
     "invoice": "lnbc...",
     "amountSat": 50000,
     "paymentHash": "abc123...",
     "externalId": "user-123",
     "description": "Homeserver Signup"
   }
```

## API Endpoints

### POST /api/invoice
Create a new Lightning invoice.

**Request:**
```json
{
  "amountSat": 50000,           // Amount in satoshis (optional, default: 50000)
  "description": "Payment",      // Invoice description (optional)
  "externalId": "order-123",     // Your unique ID (required)
  "expirySeconds": 3600          // Expiry time (optional, default: 3600)
}
```

**Response:**
```json
{
  "success": true,
  "invoice": "lnbc500...",       // Bolt11 invoice string
  "amountSat": 50000,
  "paymentHash": "abc123...",    // Payment hash for tracking
  "externalId": "order-123",
  "description": "Payment"
}
```

**Errors:**
- 400: Missing externalId
- 500: phoenixd token not configured
- 500: phoenixd API error

### GET /api/invoice?paymentHash=xxx
Check invoice payment status.

**Query Parameters:**
- `paymentHash`: Payment hash from invoice creation (required)

**Response:**
```json
{
  "success": true,
  "status": "pending",           // pending, paid, expired
  "paymentHash": "abc123..."
}
```

**Note:** Status checking is not fully implemented yet (TODO).

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "service": "home-gate-backend"
}
```

## Configuration

### Environment Variables

```bash
# Server configuration
PORT=4000                              # API server port

# phoenixd connection (Docker)
PHOENIXD_HOST=http://phoenixd:9740     # phoenixd container
PHOENIXD_TOKEN=your-token-here         # Basic auth token

# phoenixd connection (Local)
PHOENIXD_HOST=http://localhost:9740    # Local phoenixd
PHOENIXD_TOKEN=your-token-here
```

### TypeScript Configuration

Key settings in `tsconfig.json`:
```json
{
  "target": "ES2020",           // Modern JavaScript
  "module": "commonjs",         // Node.js compatibility
  "strict": true,               // Strict type checking
  "esModuleInterop": true       // Import compatibility
}
```

## Development

### Hot Reload

Uses `ts-node-dev` for automatic reloading:
```bash
npm run dev    # Watches for file changes
```

Files are watched in `src/` directory. On change:
1. TypeScript recompiles
2. Server restarts automatically
3. New code is live

### Adding New Endpoints

1. **Create controller** in `src/controllers/`:
   ```typescript
   export async function myHandler(req: Request, res: Response) {
     // Your logic here
   }
   ```

2. **Create route** in `src/routes/`:
   ```typescript
   import { myHandler } from '../controllers/myController';
   router.post('/my-endpoint', myHandler);
   ```

3. **Register route** in `src/index.ts`:
   ```typescript
   import myRoutes from './routes/myRoutes';
   app.use('/api/my-resource', myRoutes);
   ```

## Security

### Current Implementation

- **CORS**: Enabled for all origins (development mode)
- **Authentication**: phoenixd uses Basic Auth with token
- **Validation**: Basic parameter validation

### TODO for Production

- [ ] Restrict CORS to specific origins
- [ ] Add API key authentication
- [ ] Add request rate limiting
- [ ] Add input sanitization
- [ ] Add request logging
- [ ] Add error tracking (Sentry, etc.)
- [ ] Add HTTPS/TLS
- [ ] Add request size limits

## Deployment

### Docker

The Dockerfile is optimized for development:
```dockerfile
CMD ["npm", "run", "dev"]    # Hot reload in container
```

For production, change to:
```dockerfile
RUN npm run build
CMD ["npm", "start"]         # Run compiled code
```

### Environment

Required environment variables:
- `PORT` (default: 4000)
- `PHOENIXD_HOST` (required)
- `PHOENIXD_TOKEN` (required)

## Testing

### Manual Testing

```bash
# Health check
curl http://localhost:4000/health

# Create invoice
curl -X POST http://localhost:4000/api/invoice \
  -H "Content-Type: application/json" \
  -d '{"amountSat":1000,"description":"Test","externalId":"test-123"}'

# Check status
curl http://localhost:4000/api/invoice?paymentHash=abc123
```

### TODO: Automated Tests

- [ ] Unit tests for controllers
- [ ] Integration tests for routes
- [ ] E2E tests with phoenixd
- [ ] Load testing

## Troubleshooting

### Cannot connect to phoenixd

**Docker:**
```bash
# Check if phoenixd container is running
docker ps | grep phoenixd

# Test connectivity from backend
docker exec backend ping phoenixd
```

**Local:**
```bash
# Check if phoenixd is running
curl http://localhost:9740/getinfo
```

### Port already in use

```bash
# Find process using port 4000
lsof -i :4000

# Kill process (replace PID)
kill -9 <PID>

# Or use a different port in .env
PORT=4001
```

### TypeScript errors

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check TypeScript version
npm list typescript
```

## Performance

### Current Setup

- Single process (Node.js default)
- No clustering
- No caching
- Synchronous phoenixd calls

### Optimization Ideas

- [ ] Add Redis for invoice caching
- [ ] Add clustering for multiple CPU cores
- [ ] Add connection pooling
- [ ] Add response compression
- [ ] Add request queuing
- [ ] Add phoenixd connection pooling

## Monitoring

### Logs

Development logs go to console:
```bash
make backend    # View logs in Docker
npm run dev     # View logs locally
```

### TODO: Production Monitoring

- [ ] Structured logging (Winston, Pino)
- [ ] Log aggregation (ELK, Datadog)
- [ ] Metrics (Prometheus)
- [ ] Tracing (Jaeger, OpenTelemetry)
- [ ] Uptime monitoring
- [ ] Alert system

## Future Enhancements

### Short Term
- [ ] Implement invoice status checking
- [ ] Add webhook support for payment notifications
- [ ] Add request validation middleware
- [ ] Add error handling middleware
- [ ] Add API documentation (Swagger)

### Long Term
- [ ] Add user authentication
- [ ] Add invoice history/database
- [ ] Add payment tracking
- [ ] Add refund support
- [ ] Add multi-currency support
- [ ] Add invoice templates
- [ ] Add batch invoice creation

## Contributing

When adding new features:

1. Follow TypeScript strict mode
2. Add proper error handling
3. Validate all inputs
4. Update this documentation
5. Add tests (when implemented)
6. Update API documentation

---

**Last Updated**: October 23, 2025  
**Version**: 1.0.0
