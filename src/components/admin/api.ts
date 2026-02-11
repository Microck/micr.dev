// API base URL - use production URL for deployed site, relative for local dev
export const API_BASE = import.meta.env.PROD
  ? 'https://micr.dev'
  : '';
