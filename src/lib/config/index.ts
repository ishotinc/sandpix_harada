export const APP_CONFIG = {
  // API configuration
  api: {
    timeout: 30000,
    retries: 3,
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  },

  // UI configuration
  ui: {
    animationDuration: 400,
    swipeThreshold: 100,
    toastDuration: 3000,
    debounceDelay: 300,
  },

  // Business limits
  limits: {
    projectNameLength: 100,
    descriptionLength: 500,
    customHeadLength: 1000,
    customBodyLength: 1000,
    urlLength: 2000,
  },

  // Feature flags
  features: {
    enableAnalytics: false,
    enableErrorReporting: false,
    enablePerformanceMonitoring: false,
  },

  // Scoring configuration
  scoring: {
    thresholds: {
      significant: 50,
      strong: 60,
      dominant: 80,
    },
    scoreTypes: [
      'warm_score', 'cool_score', 'mono_score', 'vivid_score',
      'friendly_score', 'professional_score', 'creative_score',
      'minimal_score', 'energetic_score', 'trustworthy_score',
      'luxurious_score', 'approachable_score'
    ] as const,
  },
} as const;

export type ScoreType = typeof APP_CONFIG.scoring.scoreTypes[number];