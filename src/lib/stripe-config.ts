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

export const STRIPE_CONFIG = {
  plusPlan: {
    priceId: process.env.NEXT_PUBLIC_STRIPE_PLUS_PRICE_ID!,
    productId: process.env.NEXT_PUBLIC_STRIPE_PLUS_PRODUCT_ID!,
    price: 2980,
    currency: 'jpy',
    interval: 'month' as const
  }
};

export const stripeProducts: StripeProduct[] = [
  {
    id: process.env.NEXT_PUBLIC_STRIPE_PLUS_PRODUCT_ID || 'prod_placeholder_plus',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PLUS_PRICE_ID || 'price_placeholder_plus',
    name: 'SandPix Plus Plan',
    description: '5 projects, 50 generations/day, no footer logo',
    mode: 'subscription',
    price: 2980,
    currency: 'jpy',
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