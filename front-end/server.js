const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { WebSocketServer } = require('ws');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = process.env.PORT || 3000;
const wsPort = 3001; // Separate port for WebSocket

// Create Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// WebSocket server setup on separate port
let wss;
const clients = new Set();
let clientIdCounter = 0;

app.prepare().then(() => {
  // Create HTTP server for Next.js
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  // Start Next.js server
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });

  // Create separate WebSocket server
  const wsServer = createServer();
  
  wss = new WebSocketServer({ 
    server: wsServer,
    path: '/ws'
  });

  wss.on('connection', (ws) => {
    // Assign unique ID to client
    ws.id = `client_${++clientIdCounter}`;
    clients.add(ws);
    
    console.log(`WebSocket client connected: ${ws.id} (${clients.size} total clients)`);

    // Handle client disconnect
    ws.on('close', () => {
      clients.delete(ws);
      console.log(`WebSocket client disconnected: ${ws.id} (${clients.size} total clients)`);
    });

    // Handle client errors
    ws.on('error', (error) => {
      console.error(`WebSocket client error (${ws.id}):`, error);
      clients.delete(ws);
    });

    // Send welcome message
    ws.send(JSON.stringify({
      type: 'connection',
      message: 'Connected to WebSocket server',
      clientId: ws.id,
      timestamp: new Date().toISOString()
    }));
  });

  // Start WebSocket server
  wsServer.listen(wsPort, () => {
    console.log(`> WebSocket server available at ws://${hostname}:${wsPort}/ws`);
  });

  // Global function to send messages to specific clients
  global.sendToWebSocketClient = (clientId, message) => {
    const client = Array.from(clients).find(c => c.id === clientId);
    if (!client) {
      console.error(`Client with ID ${clientId} not found`);
      return false;
    }

    if (client.readyState !== 1) { // WebSocket.OPEN
      console.error(`Client ${clientId} is not in OPEN state`);
      clients.delete(client);
      return false;
    }

    const messageStr = typeof message === 'string' ? message : JSON.stringify({
      ...message,
      timestamp: new Date().toISOString()
    });

    try {
      client.send(messageStr);
      console.log(`Message sent to client ${clientId}:`, messageStr);
      return true;
    } catch (error) {
      console.error(`Error sending message to client ${clientId}:`, error);
      clients.delete(client);
      return false;
    }
  };
});