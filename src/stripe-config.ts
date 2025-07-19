export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: number;
  currency: string;
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_HiQFVpPEtqdcv3',
    priceId: 'price_1H8zOwDkvi9rLhiuXjO1lZdj',
    name: 'テスト',
    description: '',
    mode: 'payment',
    price: 0,
    currency: 'jpy',
  },
];

export function getProductById(id: string): StripeProduct | undefined {
  return stripeProducts.find(product => product.id === id);
}

export function getProductByPriceId(priceId: string): StripeProduct | undefined {
  return stripeProducts.find(product => product.priceId === priceId);
}