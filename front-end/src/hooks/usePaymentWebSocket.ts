import { useEffect, useRef, useCallback, useState } from 'react';
import { API_CONFIG } from '@/lib/config';

interface PaymentNotification {
  type: string;
  status?: string;
  paymentHash?: string;
  amountSat?: number;
  externalId?: string;
  message?: string;
  timestamp?: string;
}

interface UsePaymentWebSocketOptions {
  externalId: string;
  onPaymentReceived: () => void;
  enabled?: boolean;
}

export function usePaymentWebSocket({
  externalId,
  onPaymentReceived,
  enabled = true
}: UsePaymentWebSocketOptions) {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const connectRef = useRef<(() => void) | null>(null);

  const connect = useCallback(() => {
    if (!enabled || !externalId) return;
    
    // Clear any existing reconnect timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    try {
      console.log(`🔌 Connecting to WebSocket: ${API_CONFIG.wsUrl}`);
      const ws = new WebSocket(API_CONFIG.wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('✅ WebSocket connected');
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;

        // Identify client with externalId
        ws.send(JSON.stringify({
          type: 'identify',
          externalId
        }));
      };

      ws.onmessage = (event) => {
        try {
          const data: PaymentNotification = JSON.parse(event.data);
          console.log('📨 WebSocket message:', data);

          // Handle identification confirmation
          if (data.type === 'identified') {
            console.log(`✅ Identified as: ${data.externalId}`);
          }

          // Handle payment notification
          if (data.type === 'payment' && data.status === 'paid') {
            console.log('💰 Payment received!', data);
            onPaymentReceived();
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      ws.onerror = (event) => {
        console.error('❌ WebSocket error:', event);
        setError('WebSocket connection error');
      };

      ws.onclose = (event) => {
        console.log('🔌 WebSocket disconnected:', event.code, event.reason);
        setIsConnected(false);
        wsRef.current = null;

        // Auto-reconnect with exponential backoff
        if (enabled && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 10000);
          
          console.log(`🔄 Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts})...`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connectRef.current?.();
          }, delay);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          setError('Failed to connect after multiple attempts');
        }
      };

    } catch (err) {
      console.error('Error creating WebSocket connection:', err);
      setError('Failed to create WebSocket connection');
    }
  }, [externalId, onPaymentReceived, enabled]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close(1000, 'Manual disconnect');
      wsRef.current = null;
    }

    setIsConnected(false);
  }, []);

  // Update ref to always point to latest connect function
  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  // Connect on mount - wrapped in useEffect to avoid cascading renders
  useEffect(() => {
    if (!enabled || !externalId) return;

    // Use ref to call connect to avoid warning
    const connectFn = connectRef.current;
    if (connectFn) {
      connectFn();
    }

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [externalId, enabled, disconnect]);

  return {
    isConnected,
    error,
    disconnect
  };
}

