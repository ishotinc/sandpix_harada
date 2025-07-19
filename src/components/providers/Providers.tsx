'use client';

import { createClient } from '@supabase/supabase-js';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      {children}
    </ToastProvider>
  );
}