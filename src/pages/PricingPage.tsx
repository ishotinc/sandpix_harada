'use client';

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { createCheckoutSession } from '@/lib/stripe/client';
import { STRIPE_CONFIG } from '@/lib/stripe-config';
import { useToast } from '@/components/ui/ToastProvider';
import { supabase } from '@/lib/supabase/client';

export default function PricingPage() {
  const [planType, setPlanType] = useState<'individual' | 'team'>('individual');
  const [loading, setLoading] = useState<string | null>(null);
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      try {
        if (!supabase) {
          console.log('Supabase not configured, continuing without auth');
          return;
        }
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error checking user:', error);
      }
    };
    checkUser();
  }, []);

  const handlePlanSelection = async (plan: string) => {
    if (plan === 'free') {
      if (user) {
        navigate('/projects');
      } else {
        navigate('/register');
      }
      return;
    }

    if (plan === 'plus') {
      if (!user) {
        navigate('/register?plan=plus');
        return;
      }

      setLoading('plus');
      try {
        const sessionUrl = await createCheckoutSession(STRIPE_CONFIG.plusPlan.priceId);
        if (sessionUrl) {
          window.location.href = sessionUrl;
        }
      } catch (error) {
        showToast('error', 'Failed to start checkout process');
      } finally {
        setLoading(null);
      }
    }

    if (plan === 'max') {
      window.open('https://forms.gle/tzhE2NFkAsZj1cPQ6', '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo to="/" variant="default" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-semibold text-center text-gray-900 mb-12">
          Plans that grow with you
        </h1>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setPlanType('individual')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                planType === 'individual'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Individual
            </button>
            <button
              onClick={() => setPlanType('team')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                planType === 'team'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Team & Enterprise
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            {/* Icon */}
            <div className="w-12 h-12 mb-6">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 4v40M24 4c0 8-6 12-6 20M24 4c0 8 6 12 6 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="24" cy="8" r="3" fill="currentColor"/>
              </svg>
            </div>

            {/* Plan Details */}
            <h3 className="text-xl font-semibold mb-2">Free</h3>
            <p className="text-gray-600 mb-6">Try SandPix</p>
            
            <div className="mb-8">
              <span className="text-4xl font-semibold">$0</span>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => handlePlanSelection('free')}
              className="w-full py-3 px-4 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors mb-8"
            >
              Stay on Free plan
            </button>

            {/* Features */}
            <div className="space-y-3">
              <div className="flex items-start">
                <Check className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">Create landing pages on web</span>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">Generate up to 10 pages daily</span>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">Save up to 2 projects</span>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">Basic templates</span>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">Export to HTML</span>
              </div>
            </div>
          </div>

          {/* Plus Plan */}
          <div className="bg-white rounded-2xl border-2 border-gray-900 p-8 relative">
            {/* Icon */}
            <div className="w-12 h-12 mb-6">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 4v40M24 4c0 8-6 12-6 20M24 4c0 8 6 12 6 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="24" cy="8" r="3" fill="currentColor"/>
                <circle cx="18" cy="24" r="3" fill="currentColor"/>
                <circle cx="30" cy="24" r="3" fill="currentColor"/>
              </svg>
            </div>

            {/* Plan Details */}
            <h3 className="text-xl font-semibold mb-2">Plus</h3>
            <p className="text-gray-600 mb-6">For everyday productivity</p>
            
            <div className="mb-8">
              <span className="text-4xl font-semibold">$20</span>
              <span className="text-gray-600">/ month billed monthly</span>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => handlePlanSelection('plus')}
              disabled={loading === 'plus'}
              className="w-full py-3 px-4 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors mb-8 disabled:opacity-50"
            >
              {loading === 'plus' ? 'Processing...' : 'Get Plus plan'}
            </button>

            {/* Features */}
            <div className="space-y-3 mb-6">
              <p className="text-sm font-medium text-gray-900">Everything in Free, plus:</p>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">More usage (50 pages daily)</span>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">Save up to 5 projects</span>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">Remove SandPix branding</span>
              </div>
            </div>
          </div>

          {/* Max Plan */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            {/* Icon */}
            <div className="w-12 h-12 mb-6">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 44V4M24 4c0 8-8 12-8 20s8 12 8 20M24 4c0 8 8 12 8 20s-8 12-8 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="24" cy="8" r="3" fill="currentColor"/>
                <circle cx="16" cy="24" r="3" fill="currentColor"/>
                <circle cx="32" cy="24" r="3" fill="currentColor"/>
                <circle cx="24" cy="40" r="3" fill="currentColor"/>
              </svg>
            </div>

            {/* Plan Details */}
            <h3 className="text-xl font-semibold mb-2">Max</h3>
            <p className="text-gray-600 mb-6">5-20x more usage than Plus</p>
            
            <div className="mb-8">
              <span className="text-4xl font-semibold">From $100</span>
              <span className="text-gray-600">/ month billed monthly</span>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => handlePlanSelection('max')}
              className="w-full py-3 px-4 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors mb-8"
            >
              Get Max plan
            </button>

            {/* Features */}
            <div className="space-y-3 mb-6">
              <p className="text-sm font-medium text-gray-900">Everything in Plus, plus:</p>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">Choose 5x or 20x more usage than Plus</span>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">Unlimited projects</span>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">Early access to new features</span>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">Priority access at high traffic times</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-gray-600">
          <p>Need help choosing? <a href="https://forms.gle/tzhE2NFkAsZj1cPQ6" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Contact our sales team</a></p>
        </div>
      </div>
    </div>
  );
}