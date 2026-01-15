export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/auth/login',
    SIGN_UP: '/auth/sign-up',
    SIGN_UP_SUCCESS: '/auth/sign-up-success',
    FORGOT_PASSWORD: '/forgot-password',
  },
  AGENTS: {
    ROOT: '/agents',
    DASHBOARD: '/agent',
    PRICING: '/agents/pricing',
    ONBOARD: '/agents/onboard',
    LISTINGS: {
       NEW: '/agent/listings/new',
    }
  },
  pROPERTIES: {
    SEARCH: '/search',
    LIST: '/list-property',
    SAVED: '/saved',
    CALCULATOR: '/buyability',
  },
  INSIGHTS: '/insights',
  LEGAL: {
    PRIVACY: '/privacy',
    TERMS: '/terms',
    COOKIES: '/cookies',
  },
  SUPPORT: {
    HELP: '/help',
    CONTACT: '/contact',
    FAQ: '/faq',
  }
} as const;
