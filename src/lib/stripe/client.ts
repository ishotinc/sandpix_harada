import { supabase } from '@/lib/supabase/client';

export interface CheckoutSessionRequest {
  price_id: string;
  success_url: string;
  cancel_url: string;
  mode: 'payment' | 'subscription';
}

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export async function createCheckoutSession(priceIdOrRequest: string | CheckoutSessionRequest): Promise<string | CheckoutSessionResponse> {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.access_token) {
    throw new Error('User not authenticated');
  }

  let request: CheckoutSessionRequest;
  let returnFullResponse = false;

  if (typeof priceIdOrRequest === 'string') {
    // Simple API for just price ID
    request = {
      price_id: priceIdOrRequest,
      success_url: `${window.location.origin}/success`,
      cancel_url: `${window.location.origin}/pricing`,
      mode: 'subscription'
    };
  } else {
    // Full API with custom request
    request = priceIdOrRequest;
    returnFullResponse = true;
  }

  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create checkout session');
  }

  const data = await response.json();
  return returnFullResponse ? data : data.url;
}

export async function getUserSubscription() {
  const { data, error } = await supabase
    .from('stripe_user_subscriptions')
    .select('*')
    .maybeSingle();

  if (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }

  return data;
}

export async function getUserOrders() {
  const { data, error } = await supabase
    .from('stripe_user_orders')
    .select('*')
    .order('order_date', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }

  return data || [];
}