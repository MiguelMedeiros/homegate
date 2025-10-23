# WebSocket Implementation Guide

Real-time payment notifications using WebSocket connection between frontend and backend.

## 🏗️ Architecture

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Frontend  │         │   Backend   │         │  phoenixd   │
│   (Next.js) │         │  (Express)  │         │ (Lightning) │
└──────┬──────┘         └──────┬──────┘         └──────┬──────┘
       │                       │                        │
       │ 1. POST /api/invoice  │                        │
       │─────────────────────►│                        │
       │                       │ 2. Create invoice      │
       │                       │──────────────────────►│
       │                       │◄──────────────────────│
       │◄─────────────────────│                        │
       │   {invoice, externalId}                       │
       │                       │                        │
       │ 3. WS Connect         │                        │
       │   + Identify          │                        │
       │─────────────────────►│                        │
       │   externalId          │                        │
       │                       │                        │
       │                       │ 4. Webhook             │
       │                       │◄──────────────────────│
       │                       │   (payment received)   │
       │                       │                        │
       │ 5. Payment notification│                       │
       │◄─────────────────────│                        │
       │   {type: 'payment'}   │                        │
       │                       │                        │
       │ 6. Show success ✓     │                        │
       │                       │                        │
```

## 🔧 Backend Implementation

### WebSocket Service (`back-end/src/services/websocket.ts`)

Manages WebSocket connections and client identification:

```typescript
// Key features:
- Client identification by externalId
- Heartbeat mechanism (30s ping/pong)
- Auto-cleanup of dead connections
- Send to specific client by externalId
- Broadcast to all clients
```

**Client Map Structure:**
```typescript
Map<externalId, WebSocketClient>
// Example: Map<"payment-1234567890-abc123", WebSocket>
```

### Webhook Route (`back-end/src/routes/webhook.ts`)

Receives payment notifications from phoenixd and forwards to WebSocket clients:

```typescript
POST /api/webhook
Body: {
  externalId: "payment-xxx",
  paymentHash: "abc123...",
  amountSat: 50000
}
```

### Integration (`back-end/src/index.ts`)

```typescript
// WebSocket runs on same port as HTTP (4000)
const server = createServer(app);
wsService.initialize(server);
server.listen(4000);

// Result:
// HTTP: http://localhost:4000
// WebSocket: ws://localhost:4000/ws
```

## 🎨 Frontend Implementation

### Payment WebSocket Hook (`front-end/src/hooks/usePaymentWebSocket.ts`)

Custom React hook for managing payment WebSocket connection:

```typescript
const { isConnected, error } = usePaymentWebSocket({
  externalId: 'payment-xxx',      // Unique payment ID
  onPaymentReceived: () => {},    // Callback when payment is detected
  enabled: true                   // Control when to connect
});
```

**Features:**
- Auto-connect when enabled
- Auto-reconnect with exponential backoff (5 attempts max)
- Client identification on connect
- Payment notification handler
- Clean disconnect on unmount

### Usage in Payment Page (`front-end/src/app/signup/basic/page.tsx`)

```typescript
// 1. Create invoice
const response = await fetch('/api/invoice', {
  body: JSON.stringify({
    externalId: sessionId.current,
    amountSat: 50000
  })
});

// 2. Connect to WebSocket (after invoice is created)
const { isConnected } = usePaymentWebSocket({
  externalId: sessionId.current,
  onPaymentReceived: handlePaymentSuccess,
  enabled: !!invoice && !showSuccess
});

// 3. WebSocket receives payment notification
// 4. handlePaymentSuccess() is called
// 5. UI shows success state
```

## 🔄 Message Flow

### Client → Server Messages

**1. Identify (on connect):**
```json
{
  "type": "identify",
  "externalId": "payment-1234567890-abc123"
}
```

### Server → Client Messages

**1. Connected:**
```json
{
  "type": "connected",
  "message": "Connected to WebSocket server",
  "timestamp": "2025-10-23T12:34:56.789Z"
}
```

**2. Identified:**
```json
{
  "type": "identified",
  "externalId": "payment-1234567890-abc123",
  "timestamp": "2025-10-23T12:34:56.789Z"
}
```

**3. Payment Notification:**
```json
{
  "type": "payment",
  "status": "paid",
  "paymentHash": "abc123...",
  "amountSat": 50000,
  "externalId": "payment-1234567890-abc123",
  "message": "Payment received successfully!",
  "timestamp": "2025-10-23T12:34:56.789Z"
}
```

## 📝 Step-by-Step Flow

### 1. User Opens Payment Page

```javascript
// Generate unique session ID
const sessionId = `payment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
// Example: "payment-1729684496123-x7k2mq9"
```

### 2. Create Invoice

```javascript
POST http://localhost:4000/api/invoice
{
  "amountSat": 50000,
  "description": "Homeserver Signup - Basic Plan",
  "externalId": "payment-1729684496123-x7k2mq9"
}

Response:
{
  "success": true,
  "invoice": "lnbc500...",
  "paymentHash": "abc123...",
  "externalId": "payment-1729684496123-x7k2mq9"
}
```

### 3. Connect WebSocket

```javascript
// Frontend connects to WebSocket
ws = new WebSocket('ws://localhost:4000/ws');

// On open, identify with externalId
ws.send(JSON.stringify({
  type: 'identify',
  externalId: 'payment-1729684496123-x7k2mq9'
}));

// Backend stores: Map.set('payment-1729684496123-x7k2mq9', ws)
```

### 4. User Pays Invoice

```bash
# User scans QR code with Lightning wallet
# Makes payment to invoice
# phoenixd detects payment
```

### 5. phoenixd Sends Webhook

```javascript
POST http://localhost:4000/api/webhook
{
  "externalId": "payment-1729684496123-x7k2mq9",
  "paymentHash": "abc123...",
  "amountSat": 50000
}
```

### 6. Backend Forwards to WebSocket

```javascript
// Backend finds client by externalId
const client = clients.get('payment-1729684496123-x7k2mq9');

// Send payment notification
client.send(JSON.stringify({
  type: 'payment',
  status: 'paid',
  paymentHash: 'abc123...',
  amountSat: 50000,
  externalId: 'payment-1729684496123-x7k2mq9'
}));
```

### 7. Frontend Receives Notification

```javascript
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.type === 'payment' && data.status === 'paid') {
    onPaymentReceived(); // Show success UI
  }
};
```

## 🔒 Security Considerations

### Current Implementation
- ✅ CORS enabled for frontend access
- ✅ Client identification required
- ✅ Heartbeat for connection health
- ⚠️ No authentication on WebSocket connection

### Recommended for Production
- [ ] Add JWT token authentication for WebSocket
- [ ] Rate limiting on webhook endpoint
- [ ] Validate webhook source (phoenixd signature)
- [ ] Use WSS (secure WebSocket) in production
- [ ] Add request validation middleware
- [ ] Log all webhook events
- [ ] Add monitoring and alerts

## 🧪 Testing

### Test Backend WebSocket

```bash
# Install wscat
npm install -g wscat

# Connect to WebSocket
wscat -c ws://localhost:4000/ws

# Identify as client
> {"type":"identify","externalId":"test-123"}

# Backend should respond with identified message
< {"type":"identified","externalId":"test-123","timestamp":"..."}
```

### Test Webhook → WebSocket Flow

```bash
# Terminal 1: Connect as client
wscat -c ws://localhost:4000/ws
> {"type":"identify","externalId":"test-payment-123"}

# Terminal 2: Send webhook
curl -X POST http://localhost:4000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "externalId": "test-payment-123",
    "paymentHash": "abc123",
    "amountSat": 50000
  }'

# Terminal 1 should receive payment notification
< {"type":"payment","status":"paid",...}
```

### Test Frontend Integration

```bash
# Start backend
cd back-end
npm run dev

# Start frontend
cd front-end
npm run dev

# Open browser
open http://localhost:3000/signup/basic

# Check browser console for:
# ✅ "🔌 Connecting to WebSocket: ws://localhost:4000/ws"
# ✅ "✅ WebSocket connected"
# ✅ "✅ Identified as: payment-xxx"

# Pay the invoice and watch for:
# ✅ "💰 Payment received!"
```

## 📊 Monitoring

### Check Connected Clients

```bash
curl http://localhost:4000/health

Response:
{
  "status": "ok",
  "service": "home-gate-backend",
  "websocket": {
    "enabled": true,
    "clients": 3
  }
}
```

### Backend Logs

```bash
# When client connects:
📡 New WebSocket connection
✅ Client identified: payment-xxx (1 total clients)

# When payment received:
📬 Webhook received: { externalId: 'payment-xxx', ... }
📤 Message sent to client payment-xxx
✅ Payment notification sent to client payment-xxx

# When client disconnects:
❌ Client disconnected: payment-xxx (0 total clients)
```

## 🐛 Troubleshooting

### Client Not Receiving Payment Notification

1. **Check client is connected:**
   ```bash
   curl http://localhost:4000/health
   # Check websocket.clients count > 0
   ```

2. **Check externalId matches:**
   - Frontend sends: `payment-1729684496123-x7k2mq9`
   - Webhook receives same: `payment-1729684496123-x7k2mq9`

3. **Check backend logs:**
   ```bash
   make backend
   # Look for "Client identified" and "Message sent to client"
   ```

### WebSocket Connection Fails

1. **Check backend is running:**
   ```bash
   curl http://localhost:4000/health
   ```

2. **Check WebSocket URL:**
   - Should be: `ws://localhost:4000/ws` (not `http://`)
   - In Docker: `ws://backend:4000/ws`

3. **Check browser console for errors**

### Webhook Not Working

1. **Test webhook manually:**
   ```bash
   curl -X POST http://localhost:4000/api/webhook \
     -H "Content-Type: application/json" \
     -d '{"externalId":"test","paymentHash":"abc"}'
   ```

2. **Configure phoenixd webhook:**
   ```bash
   # In phoenixd config, set:
   webhook-url=http://backend:4000/api/webhook
   ```

## 🚀 Deployment

### Environment Variables

```bash
# Backend
PORT=4000
PHOENIXD_HOST=http://phoenixd:9740
PHOENIXD_TOKEN=your-token

# Frontend
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
NEXT_PUBLIC_WS_URL=ws://localhost:4000/ws

# Production (with SSL)
NEXT_PUBLIC_BACKEND_URL=https://api.yourdomain.com
NEXT_PUBLIC_WS_URL=wss://api.yourdomain.com/ws
```

### Docker Compose

Already configured! WebSocket runs on same port as HTTP server.

```yaml
backend:
  ports:
    - "4000:4000"  # Both HTTP and WebSocket
  env_file:
    - ./back-end/.env
```

---

**Date:** October 23, 2025  
**Version:** 2.0 (New Backend Implementation)

