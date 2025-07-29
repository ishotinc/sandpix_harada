import { X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { PLAN_LIMITS } from '@/lib/constants/plans';

interface UpgradeBannerProps {
  projectCount?: number;
  planType: 'free' | 'plus';
  reason?: 'project_limit' | 'generation_limit';
  onDismiss?: () => void;
}

export function UpgradeBanner({ 
  projectCount, 
  planType, 
  reason = 'project_limit',
  onDismiss 
}: UpgradeBannerProps) {
  const navigate = useNavigate();
  
  // Don't show banner for plus users
  if (planType === 'plus') {
    return null;
  }

  // For project limit, check if limit is reached
  if (reason === 'project_limit' && projectCount !== undefined) {
    const planLimit = PLAN_LIMITS[planType].maxProjects;
    if (projectCount < planLimit) {
      return null;
    }
  }

  const handleUpgradeClick = () => {
    navigate('/pricing');
  };

  const getMessage = () => {
    if (reason === 'generation_limit') {
      return {
        title: 'Daily generation limit reached',
        description: `You've reached your daily limit of ${PLAN_LIMITS.free.dailyGenerations} generations. Upgrade to Plus for ${PLAN_LIMITS.plus.dailyGenerations} daily generations!`
      };
    }
    
    return {
      title: 'Project limit reached',
      description: `You've created ${projectCount} out of ${PLAN_LIMITS.free.maxProjects} projects on your ${PLAN_LIMITS[planType].displayName}. Upgrade to Plus for unlimited projects!`
    };
  };

  const { title, description } = getMessage();

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="space-y-1 flex-1">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              aria-label="Dismiss"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        <div className="flex justify-center sm:justify-end">
          <Button 
            variant="gradient" 
            onClick={handleUpgradeClick}
            size="sm"
            className="w-full sm:w-auto"
          >
            Upgrade to Plus
          </Button>
        </div>
      </div>
    </div>
  );
}