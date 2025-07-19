'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastProvider';
import { createCheckoutSession } from '@/lib/stripe/client';
import { StripeProduct } from '@/stripe-config';
import { ShoppingCart, Loader2 } from 'lucide-react';

interface ProductCardProps {
  product: StripeProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handlePurchase = async () => {
    setLoading(true);
    
    try {
      const { url } = await createCheckoutSession({
        price_id: product.priceId,
        success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/pricing`,
        mode: product.mode,
      });

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      showToast('error', error instanceof Error ? error.message : 'Failed to start checkout');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(price);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-gray-600 text-sm mb-4">
            {product.description}
          </p>
        )}
        <div className="text-3xl font-bold text-gray-900">
          {formatPrice(product.price, product.currency)}
        </div>
        {product.mode === 'subscription' && (
          <div className="text-sm text-gray-500 mt-1">
            per month
          </div>
        )}
      </div>

      <Button
        onClick={handlePurchase}
        disabled={loading}
        variant="gradient"
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <ShoppingCart className="w-4 h-4 mr-2" />
            {product.mode === 'subscription' ? 'Subscribe' : 'Purchase'}
          </>
        )}
      </Button>
    </div>
  );
}