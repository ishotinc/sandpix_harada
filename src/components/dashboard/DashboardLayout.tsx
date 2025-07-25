'use client';

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/ToastProvider';
import { SubscriptionStatus } from '@/components/stripe/SubscriptionStatus';
import { 
  Sparkles, 
  LogOut, 
  User
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const checkUser = useCallback(async () => {
    try {
      // Check if Supabase is configured
      if (!supabase) {
        showToast('error', 'Authentication service is not configured. Please contact support.');
        setLoading(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }
      setUser(user);
    } catch {
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate, showToast]);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  const handleSignOut = async () => {
    try {
      if (!supabase) {
        showToast('error', 'Authentication service is not configured');
        return;
      }
      await supabase.auth.signOut();
      showToast('success', 'Signed out successfully');
      navigate('/');
    } catch {
      showToast('error', 'Failed to sign out');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/projects" className="flex items-center space-x-2">
              <div className="w-8 h-8 text-gradient rounded-lg flex items-center justify-center bg-gray-100">
                <Sparkles className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xl font-bold text-gradient">Sandpix</span>
            </Link>

            {/* Right side - Profile and Sign Out */}
            <div className="flex items-center space-x-4">
              <SubscriptionStatus />
              <Link 
                to="/profile" 
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Profile"
              >
                <User className="w-5 h-5" />
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}