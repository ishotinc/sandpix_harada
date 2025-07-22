import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase/client';

interface UsageData {
  current: number;
  limit: number;
  remaining: number;
}

export function UsageCounter() {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsage();
  }, []);

  const fetchUsage = async () => {
    try {
      if (!supabase) return;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get today's usage count
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { count, error } = await supabase
        .from('generation_usage')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('generated_at', today.toISOString())
        .eq('success', true);

      if (!error) {
        const currentCount = count || 0;
        setUsage({
          current: currentCount,
          limit: 5,
          remaining: Math.max(0, 5 - currentCount)
        });
      }
    } catch (error) {
      console.error('Failed to fetch usage:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !usage) return null;

  const percentage = (usage.current / usage.limit) * 100;
  const isNearLimit = usage.remaining <= 2;
  const isAtLimit = usage.remaining === 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Daily Generations
        </h3>
        <span className={`text-sm font-semibold ${
          isAtLimit ? 'text-red-600' : isNearLimit ? 'text-yellow-600' : 'text-green-600'
        }`}>
          {usage.current} / {usage.limit}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            isAtLimit ? 'bg-red-600' : isNearLimit ? 'bg-yellow-500' : 'bg-green-500'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      
      {isAtLimit && (
        <p className="text-xs text-red-600 mt-2">
          Daily limit reached. Resets at midnight UTC.
        </p>
      )}
      {isNearLimit && !isAtLimit && (
        <p className="text-xs text-yellow-600 mt-2">
          {usage.remaining} generation{usage.remaining !== 1 ? 's' : ''} remaining today.
        </p>
      )}
    </div>
  );
}