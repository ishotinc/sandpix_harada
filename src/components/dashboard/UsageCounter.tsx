import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase/client';
import { PLAN_LIMITS } from '../../lib/constants/plans';
import { useProfile } from '../../hooks/useProfile';

interface UsageData {
  current: number;
  limit: number;
  remaining: number;
  planType: 'free' | 'plus';
  resetTime?: string;
}

export function UsageCounter({ refreshTrigger }: { refreshTrigger?: number }) {
  const { profile, isLoading, refetch } = useProfile();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  useEffect(() => {
    if (refreshTrigger) {
      refetch();
    }
  }, [refreshTrigger, refetch]);

  const checkAdminStatus = async () => {
    try {
      if (!supabase) return;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check is_admin from users table
      const { data: userData } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      setIsAdmin(userData?.is_admin || false);
    } catch (error) {
      console.error('Failed to check admin status:', error);
    } finally {
      setCheckingAdmin(false);
    }
  };

  if (isLoading || checkingAdmin) {
    return (
      <div className="bg-white p-4 rounded-lg shadow animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-2 bg-gray-200 rounded"></div>
      </div>
    );
  }

  // Display unlimited for admin users
  if (isAdmin) {
    return (
      <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg">
        <span className="font-medium">Unlimited (Admin)</span>
      </div>
    );
  }

  if (!profile) return null;

  const planType = profile.plan_type || 'free';
  const planName = planType === 'plus' ? 'Plus' : 'Free';
  const limits = PLAN_LIMITS[planType];
  const currentCount = profile.daily_generation_count || 0;
  const remaining = Math.max(0, limits.dailyGenerations - currentCount);
  
  const usage: UsageData = {
    current: currentCount,
    limit: limits.dailyGenerations,
    remaining: remaining,
    planType: planType,
    resetTime: profile.daily_generation_reset_at
  };

  const percentage = (usage.current / usage.limit) * 100;
  const isNearLimit = usage.remaining <= 3 && usage.remaining > 0;
  const isAtLimit = usage.remaining === 0;
  
  // Calculate time until reset
  const getTimeUntilReset = (resetTime?: string | null) => {
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
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Daily Generations</span>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            planType === 'plus' 
              ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800' 
              : 'bg-gray-100 text-gray-700'
          }`}>
            {planName}
          </span>
        </div>
        <span className="text-sm font-medium">
          {usage.current} / {usage.limit}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${
            isAtLimit ? 'bg-red-600' : isNearLimit ? 'bg-orange-500' : 'bg-blue-600'
          }`}
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
      {planType === 'plus' && profile.daily_project_count !== undefined && (
        <p className="text-xs text-gray-500 mt-2">
          Projects today: {profile.daily_project_count} / {PLAN_LIMITS.plus.maxProjects}
        </p>
      )}
    </div>
  );
}