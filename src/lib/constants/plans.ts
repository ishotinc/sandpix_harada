export const PLAN_LIMITS = {
  free: {
    maxProjects: 2,
    dailyGenerations: 10,
    displayName: 'Free Plan'
  },
  plus: {
    maxProjects: 5,
    dailyGenerations: 50,
    displayName: 'Plus Plan',
    priceMonthly: 20 // USD
  }
} as const;

export type PlanType = keyof typeof PLAN_LIMITS;