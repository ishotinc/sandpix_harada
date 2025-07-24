import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase/client';
import { PLAN_LIMITS } from '../../lib/constants/plans';

interface UsageData {
  current: number;
  limit: number;
  remaining: number;
  planType: 'free' | 'plus';
  resetTime?: string;
}

export function UsageCounter({ refreshTrigger }: { refreshTrigger?: number }) {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchUsage();
  }, [refreshTrigger]);

  const fetchUsage = async () => {
    try {
      if (!supabase) return;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user profile with plan information
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin, plan_type, daily_generation_count, daily_generation_reset_at')
        .eq('id', user.id)
        .single();

      setIsAdmin(profile?.is_admin || false);

      // Skip usage check for admin users
      if (profile?.is_admin) {
        setLoading(false);
        return;
      }

      const planType = profile?.plan_type || 'free';
      const limits = PLAN_LIMITS[planType];
      const currentCount = profile?.daily_generation_count || 0;
      const remaining = Math.max(0, limits.dailyGenerations - currentCount);
      
      setUsage({
        current: currentCount,
        limit: limits.dailyGenerations,
        remaining: remaining,
        planType: planType,
        resetTime: profile?.daily_generation_reset_at
      });
    } catch (error) {
      console.error('Failed to fetch usage:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;

  // Display unlimited for admin users
  if (isAdmin) {
    return (
      <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg">
        <span className="font-medium">Unlimited (Admin)</span>
      </div>
    );
  }

  if (!usage) return null;

  const percentage = (usage.current / usage.limit) * 100;
  const isNearLimit = usage.remaining <= 3 && usage.remaining > 0;
  const isAtLimit = usage.remaining === 0;
  
  // Calculate time until reset
  const getTimeUntilReset = (resetTime?: string) => {
    if (!resetTime) return '24 hours';
    const reset = new Date(resetTime);
    const now = new Date();
    const nextReset = new Date(reset.getTime() + 24 * 60 * 60 * 1000);
    const diff = nextReset.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600">Daily Generations</span>
        <span className="text-sm font-medium">
          {usage.current} / {usage.limit}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {isNearLimit && (
        <p className="text-xs text-orange-600 mt-2">
          Only {usage.remaining} generations left today
        </p>
      )}
      {isAtLimit && (
        <p className="text-xs text-red-600 mt-2">
          Daily limit reached. Resets in {getTimeUntilReset(usage.resetTime)}
        </p>
      )}
    </div>
  );
}