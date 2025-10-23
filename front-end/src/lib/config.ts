// Backend API configuration
export const API_CONFIG = {
  baseUrl: typeof window === 'undefined' 
    ? process.env.BACKEND_URL || 'https://api.homegate.live' // Server-side (Docker)
    : process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.homegate.live', // Client-side
  wsUrl: typeof window === 'undefined'
    ? 'wss://api.homegate.live/ws' // Server-side (Docker)
    : process.env.NEXT_PUBLIC_WS_URL || 'wss://api.homegate.live/ws', // Client-side
};

export const API_ENDPOINTS = {
  invoice: `${API_CONFIG.baseUrl}/api/invoice`,
  webhook: `${API_CONFIG.baseUrl}/api/webhook`,
  health: `${API_CONFIG.baseUrl}/health`,
};

