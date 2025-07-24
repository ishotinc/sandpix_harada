export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: number;
  currency: string;
  interval?: 'month' | 'year';
  planType?: 'free' | 'plus';
}

// In Vite, use import.meta.env for environment variables
// Variables must be prefixed with VITE_ to be exposed to the client
const plusPriceId = import.meta.env.VITE_STRIPE_PLUS_PRICE_ID || 'price_placeholder_plus';
const plusProductId = import.meta.env.VITE_STRIPE_PLUS_PRODUCT_ID || 'prod_placeholder_plus';

export const STRIPE_CONFIG = {
  plusPlan: {
    priceId: plusPriceId,
    productId: plusProductId,
    price: 20,
    currency: 'usd',
    interval: 'month' as const
  }
};

export const stripeProducts: StripeProduct[] = [
  {
    id: plusProductId,
    priceId: plusPriceId,
    name: 'SandPix Plus Plan',
    description: '5 projects, 50 generations/day, no footer logo',
    mode: 'subscription',
    price: 20,
    currency: 'usd',
    interval: 'month',
    planType: 'plus',
  },
];

export function getProductById(id: string): StripeProduct | undefined {
  return stripeProducts.find(product => product.id === id);
}

export function getProductByPriceId(priceId: string): StripeProduct | undefined {
  return stripeProducts.find(product => product.priceId === priceId);
}

export function getPlusPlanProduct(): StripeProduct {
  return stripeProducts.find(product => product.planType === 'plus')!;
}