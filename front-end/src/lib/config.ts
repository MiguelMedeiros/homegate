// Backend API configuration
export const API_CONFIG = {
  baseUrl: typeof window === 'undefined' 
    ? process.env.BACKEND_URL || 'http://backend:4000' // Server-side (Docker)
    : process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000', // Client-side
  wsUrl: typeof window === 'undefined'
    ? 'ws://backend:4000/ws' // Server-side (Docker)
    : process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:4000/ws', // Client-side
};

export const API_ENDPOINTS = {
  invoice: `${API_CONFIG.baseUrl}/api/invoice`,
  webhook: `${API_CONFIG.baseUrl}/api/webhook`,
  health: `${API_CONFIG.baseUrl}/health`,
};

