'use client';

import { useState, useEffect } from 'react';
import { getUserSubscription } from '@/lib/stripe/client';
import { getProductByPriceId } from '@/stripe-config';
import { Crown, Calendar, CreditCard } from 'lucide-react';

interface SubscriptionData {
  subscription_status: string;
  price_id: string | null;
  current_period_end: number | null;
  payment_method_brand: string | null;
  payment_method_last4: string | null;
}

export function SubscriptionStatus() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const data = await getUserSubscription();
      setSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </div>
    );
  }

  if (!subscription || !subscription.price_id) {
    return (
      <div className="flex items-center gap-2 text-gray-600">
        <Crown className="w-4 h-4" />
        <span>Free Plan</span>
      </div>
    );
  }

  const product = getProductByPriceId(subscription.price_id);
  const isActive = subscription.subscription_status === 'active';

  return (
    <div className="flex items-center gap-2">
      <Crown className={`w-4 h-4 ${isActive ? 'text-yellow-500' : 'text-gray-400'}`} />
      <span className={`font-medium ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
        {product?.name || 'Unknown Plan'}
      </span>
      {subscription.current_period_end && (
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <Calendar className="w-3 h-3" />
          <span>
            Until {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
          </span>
        </div>
      )}
      {subscription.payment_method_brand && subscription.payment_method_last4 && (
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <CreditCard className="w-3 h-3" />
          <span>
            {subscription.payment_method_brand.toUpperCase()} ****{subscription.payment_method_last4}
          </span>
        </div>
      )}
    </div>
  );
}