import express, { Application } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import invoiceRoutes from './routes/invoice';
import webhookRoutes from './routes/webhook';
import { wsService } from './services/websocket';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 8881;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'home-gate-backend',
    websocket: {
      enabled: true,
      clients: wsService.getClientsCount()
    }
  });
});

// Routes
app.use('/api/invoice', invoiceRoutes);
app.use('/api/webhook', webhookRoutes);

// Create HTTP server
const server = createServer(app);

// Initialize WebSocket server
wsService.initialize(server);

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 Invoice API: http://localhost:${PORT}/api/invoice`);
  console.log(`📍 Webhook API: http://localhost:${PORT}/api/webhook`);
  console.log(`🔌 WebSocket: ws://localhost:${PORT}/ws`);
});

