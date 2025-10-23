import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';

interface WebSocketClient extends WebSocket {
  id?: string;
  isAlive?: boolean;
}

class WebSocketService {
  private wss: WebSocketServer | null = null;
  private clients: Map<string, WebSocketClient> = new Map();

  initialize(server: Server) {
    this.wss = new WebSocketServer({ 
      server,
      path: '/ws'
    });

    this.wss.on('connection', (ws: WebSocketClient, req) => {
      console.log('📡 New WebSocket connection');
      
      // Set client as alive for heartbeat
      ws.isAlive = true;

      // Handle pong responses for heartbeat
      ws.on('pong', () => {
        ws.isAlive = true;
      });

      // Handle client messages
      ws.on('message', (message: Buffer) => {
        try {
          const data = JSON.parse(message.toString());
          
          // Client identifies itself with externalId
          if (data.type === 'identify' && data.externalId) {
            ws.id = data.externalId;
            this.clients.set(data.externalId, ws);
            
            console.log(`✅ Client identified: ${data.externalId} (${this.clients.size} total clients)`);
            
            // Send confirmation
            ws.send(JSON.stringify({
              type: 'identified',
              externalId: data.externalId,
              timestamp: new Date().toISOString()
            }));
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      });

      // Handle client disconnect
      ws.on('close', () => {
        if (ws.id) {
          this.clients.delete(ws.id);
          console.log(`❌ Client disconnected: ${ws.id} (${this.clients.size} total clients)`);
        }
      });

      // Handle errors
      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        if (ws.id) {
          this.clients.delete(ws.id);
        }
      });

      // Send welcome message
      ws.send(JSON.stringify({
        type: 'connected',
        message: 'Connected to WebSocket server',
        timestamp: new Date().toISOString()
      }));
    });

    // Heartbeat to detect dead connections
    const heartbeatInterval = setInterval(() => {
      this.wss?.clients.forEach((ws: WebSocket) => {
        const client = ws as WebSocketClient;
        
        if (client.isAlive === false) {
          if (client.id) {
            this.clients.delete(client.id);
          }
          return client.terminate();
        }
        
        client.isAlive = false;
        client.ping();
      });
    }, 30000); // 30 seconds

    this.wss.on('close', () => {
      clearInterval(heartbeatInterval);
    });

    console.log('🔌 WebSocket server initialized on /ws');
  }

  // Send message to specific client by externalId
  sendToClient(externalId: string, message: any): boolean {
    const client = this.clients.get(externalId);
    
    if (!client) {
      console.warn(`Client ${externalId} not found`);
      return false;
    }

    if (client.readyState !== WebSocket.OPEN) {
      console.warn(`Client ${externalId} is not connected`);
      this.clients.delete(externalId);
      return false;
    }

    try {
      const payload = typeof message === 'string' 
        ? message 
        : JSON.stringify({
            ...message,
            timestamp: new Date().toISOString()
          });
      
      client.send(payload);
      console.log(`📤 Message sent to client ${externalId}`);
      return true;
    } catch (error) {
      console.error(`Error sending message to ${externalId}:`, error);
      this.clients.delete(externalId);
      return false;
    }
  }

  // Broadcast to all connected clients
  broadcast(message: any) {
    const payload = typeof message === 'string' 
      ? message 
      : JSON.stringify({
          ...message,
          timestamp: new Date().toISOString()
        });

    this.clients.forEach((client, externalId) => {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(payload);
        } catch (error) {
          console.error(`Error broadcasting to ${externalId}:`, error);
        }
      }
    });
  }

  // Get connected clients count
  getClientsCount(): number {
    return this.clients.size;
  }

  // Check if client is connected
  isClientConnected(externalId: string): boolean {
    const client = this.clients.get(externalId);
    return client !== undefined && client.readyState === WebSocket.OPEN;
  }
}

// Export singleton instance
export const wsService = new WebSocketService();

