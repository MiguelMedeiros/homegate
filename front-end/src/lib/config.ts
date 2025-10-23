// Backend API configuration
export const API_CONFIG = {
  baseUrl: typeof window === 'undefined' 
    ? process.env.BACKEND_URL || 'http://homegate-api.miguelmedeiros.dev' // Server-side (Docker)
    : process.env.NEXT_PUBLIC_BACKEND_URL || 'http://homegate-api.miguelmedeiros.dev', // Client-side
  wsUrl: typeof window === 'undefined'
    ? 'ws://homegate-api.miguelmedeiros.dev/ws' // Server-side (Docker)
    : process.env.NEXT_PUBLIC_WS_URL || 'ws://homegate-api.miguelmedeiros.dev/ws', // Client-side
};

export const API_ENDPOINTS = {
  invoice: `${API_CONFIG.baseUrl}/api/invoice`,
  webhook: `${API_CONFIG.baseUrl}/api/webhook`,
  health: `${API_CONFIG.baseUrl}/health`,
};

