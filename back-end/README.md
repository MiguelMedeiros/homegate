# Home Gate Backend

Express.js backend service for Home Gate application.

## Features

- 💰 Invoice creation via Phoenix daemon
- 🔌 Real-time WebSocket notifications
- 📬 Webhook endpoint for payment events
- 🔄 Auto-reconnect with exponential backoff
- 💓 Heartbeat mechanism for connection health
- 🎯 Client identification by externalId
- 📡 RESTful API endpoints
- 🔒 TypeScript with strict mode
- 🐳 Docker ready

## API Endpoints

### POST /api/invoice
Create a new Lightning Network invoice.

**Request Body:**
```json
{
  "amountSat": 50000,
  "description": "Homeserver Signup - Basic Plan",
  "externalId": "user-123",
  "expirySeconds": 3600
}
```

**Response:**
```json
{
  "success": true,
  "invoice": "lnbc...",
  "amountSat": 50000,
  "paymentHash": "abc123...",
  "externalId": "user-123",
  "description": "Homeserver Signup - Basic Plan"
}
```

### GET /api/invoice?paymentHash=xxx
Check invoice payment status.

**Response:**
```json
{
  "success": true,
  "status": "pending",
  "paymentHash": "abc123..."
}
```

### POST /api/webhook
Receive payment notifications from phoenixd.

**Request Body:**
```json
{
  "externalId": "payment-xxx",
  "paymentHash": "abc123...",
  "amountSat": 50000
}
```

**Response:**
```json
{
  "success": true,
  "message": "Notification sent to client payment-xxx"
}
```

### GET /health
Health check endpoint with WebSocket status.

**Response:**
```json
{
  "status": "ok",
  "service": "home-gate-backend",
  "websocket": {
    "enabled": true,
    "clients": 3
  }
}
```

### WebSocket: /ws
Real-time payment notifications.

**Connect:**
```
ws://localhost:4000/ws
```

**Identify:**
```json
{
  "type": "identify",
  "externalId": "payment-xxx"
}
```

**Payment Notification:**
```json
{
  "type": "payment",
  "status": "paid",
  "paymentHash": "abc123...",
  "amountSat": 50000,
  "externalId": "payment-xxx"
}
```

## Development

### Quick Setup

```bash
# Run setup script
./setup.sh

# Or manually:
cp .env.local .env
# Edit .env and add your PHOENIXD_TOKEN

# Install dependencies
npm install

# Run in development mode
npm run dev
```

### Manual Commands

```bash
# Run in development mode (with hot reload)
npm run dev

# Build TypeScript
npm run build

# Run production build
npm start
```

## Environment Variables

The backend reads configuration from a `.env` file in this directory.

### Setup

1. Create your `.env` file:
   ```bash
   ./setup.sh
   # or
   cp .env.local .env
   ```

2. Edit `.env` and configure:
   - `PORT` - Server port (default: 4000)
   - `PHOENIXD_HOST` - Phoenix daemon host
     - Docker: `http://phoenixd:9740`
     - Local: `http://localhost:9740`
   - `PHOENIXD_TOKEN` - Phoenix daemon authentication token
     - Find in: `../phoenixd/phoenix.conf` (look for `http-password`)

3. Example `.env`:
   ```bash
   PORT=4000
   PHOENIXD_HOST=http://phoenixd:9740
   PHOENIXD_TOKEN=your-actual-token-here
   ```

See [CONFIGURATION.md](./CONFIGURATION.md) for detailed setup instructions.

