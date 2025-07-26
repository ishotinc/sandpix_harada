import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { STRIPE_CONFIG } from '@/lib/stripe-config';
import { PLAN_LIMITS } from '@/lib/constants/plans';
import { createCheckoutSession, getUserSubscription } from '@/lib/stripe/client';
import { useToast } from '@/components/ui/ToastProvider';
import { supabase } from '@/lib/supabase/client';

interface UserData {
  planType: 'free' | 'plus';
  subscriptionStatus?: string;
}

export default function BillingPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingPortal, setLoadingPortal] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      if (!supabase) return;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user profile with plan information
      const { data: profile } = await supabase
        .from('profiles')
        .select('plan_type')
        .eq('id', user.id)
        .single();

      // Get subscription status
      const subscription = await getUserSubscription();

      setUserData({
        planType: profile?.plan_type || 'free',
        subscriptionStatus: subscription?.status
      });
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const sessionUrl = await createCheckoutSession(STRIPE_CONFIG.plusPlan.priceId);
      if (sessionUrl) {
        window.location.href = sessionUrl;
      } else {
        showToast('error', 'Failed to create checkout session');
      }
    } catch (error) {
      showToast('error', 'Failed to start checkout process');
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setLoadingPortal(true);
    try {
      // Create portal session via backend
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        showToast('error', 'Please sign in to manage your subscription');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-portal`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        showToast('error', 'Failed to access billing portal');
      }
    } catch (error) {
      showToast('error', 'Failed to access billing portal');
    } finally {
      setLoadingPortal(false);
    }
  };

  if (!userData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-4">
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </button>
        </div>
        <h1 className="text-2xl font-bold mb-8">Billing & Subscription</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Free Plan */}
          <div className={`border rounded-lg p-6 ${userData.planType === 'free' ? 'border-blue-500' : 'border-gray-200'}`}>
            <h2 className="text-xl font-semibold mb-4">Free Plan</h2>
            <p className="text-3xl font-bold mb-4">¥0<span className="text-sm font-normal">/month</span></p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Maximum {PLAN_LIMITS.free.maxProjects} projects
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                {PLAN_LIMITS.free.dailyGenerations} generations per day
              </li>
              <li className="flex items-center">
                <span className="text-gray-400 mr-2">•</span>
                SandPix branding in footer
              </li>
            </ul>
            {userData.planType === 'free' && (
              <div className="bg-gray-100 text-gray-600 text-center py-2 rounded">
                Current Plan
              </div>
            )}
          </div>

          {/* Plus Plan */}
          <div className={`border rounded-lg p-6 ${userData.planType === 'plus' ? 'border-blue-500' : 'border-gray-200'}`}>
            <h2 className="text-xl font-semibold mb-4">Plus Plan</h2>
            <p className="text-3xl font-bold mb-4">¥{STRIPE_CONFIG.plusPlan.price}<span className="text-sm font-normal">/month</span></p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Maximum {PLAN_LIMITS.plus.maxProjects} projects
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                {PLAN_LIMITS.plus.dailyGenerations} generations per day
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                No branding in published pages
              </li>
            </ul>
            {userData.planType === 'free' ? (
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Upgrade to Plus'}
              </button>
            ) : (
              <button
                onClick={handleManageSubscription}
                disabled={loadingPortal}
                className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 disabled:opacity-50"
              >
                {loadingPortal ? 'Loading...' : 'Manage Subscription'}
              </button>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Billing Information</h3>
          <p className="text-sm text-gray-600">
            {userData.planType === 'plus' 
              ? 'You can manage your subscription, update payment methods, and download invoices by clicking "Manage Subscription".'
              : 'Upgrade to Plus plan to unlock more projects, increased generation limits, and remove branding from your published pages.'}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}