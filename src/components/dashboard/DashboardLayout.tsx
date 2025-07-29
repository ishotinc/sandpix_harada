'use client';

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/ToastProvider';
import { UniversalLoading } from '@/components/ui/UniversalLoading';
import { SidebarNavigation } from './SidebarNavigation';

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

  if (loading) {
    return (
      <UniversalLoading 
        minimal={true}
      />
    );
  }

  return (
    <SidebarNavigation>
      {children}
    </SidebarNavigation>
  );
}