'use client';

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Check, Sparkles, Crown, Zap, Star, ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { createCheckoutSession } from '@/lib/stripe/client';
import { STRIPE_CONFIG } from '@/lib/stripe-config';
import { useToast } from '@/components/ui/ToastProvider';
import { supabase } from '@/lib/supabase/client';

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  usePageTitle({
    title: 'Pricing',
    description: 'Choose the perfect plan for your landing page needs. Start free or upgrade to Plus for advanced features and unlimited projects.'
  });

  useEffect(() => {
    const checkUser = async () => {
      try {
        if (!supabase) {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Logo to="/" variant="default" />
            <Link 
              to="/projects"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-400 rounded-full blur-xl"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-purple-400 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-pink-400 rounded-full blur-xl"></div>
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          {/* Title Section */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-800">Simple, transparent pricing</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
              Plans that
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"> scale </span>
              with you
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Create stunning landing pages in minutes. Choose the perfect plan for your needs.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
            {/* Free Plan */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative bg-white rounded-2xl p-6 sm:p-8 h-full border border-gray-100 shadow-xl">
                {/* Icon */}
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl mb-6">
                  <Star className="w-6 h-6 text-gray-600" />
                </div>

                {/* Plan Details */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                  <p className="text-gray-600 mb-6">Perfect for getting started</p>
                  
                  <div className="flex items-baseline mb-2">
                    <span className="text-4xl sm:text-5xl font-bold text-gray-900">¥0</span>
                    <span className="text-gray-500 ml-2">forever</span>
                  </div>
                  <p className="text-sm text-gray-500">No credit card required</p>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handlePlanSelection('free')}
                  className="w-full py-3 sm:py-4 px-6 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 mb-8"
                >
                  Get Started Free
                </button>

                {/* Features */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">What's included:</h4>
                  {[
                    'Create landing pages on web',
                    'Generate up to 10 pages daily',
                    'Save up to 2 projects',
                    'Basic templates & designs',
                    'Export to HTML',
                    'SandPix branding'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Plus Plan - Featured */}
            <div className="relative group lg:scale-105">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-white rounded-2xl p-6 sm:p-8 h-full shadow-2xl">
                {/* Popular Badge */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </div>
                </div>

                {/* Icon */}
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mb-6 mt-4">
                  <Crown className="w-6 h-6 text-white" />
                </div>

                {/* Plan Details */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Plus</h3>
                  <p className="text-gray-600 mb-6">For serious creators</p>
                  
                  <div className="flex items-baseline mb-2">
                    <span className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">¥{STRIPE_CONFIG.plusPlan.price}</span>
                    <span className="text-gray-500 ml-2">/month</span>
                  </div>
                  <p className="text-sm text-gray-500">Billed monthly, cancel anytime</p>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handlePlanSelection('plus')}
                  disabled={loading === 'plus'}
                  className="w-full py-3 sm:py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl mb-8 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading === 'plus' ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    'Upgrade to Plus'
                  )}
                </button>

                {/* Features */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Everything in Free, plus:</h4>
                  {[
                    '50 generations per day (5x more)',
                    'Unlimited projects',
                    'Remove SandPix branding',
                    'Priority support',
                    'Advanced templates',
                    'Custom domains (coming soon)'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Max Plan */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-200 to-pink-200 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative bg-white rounded-2xl p-6 sm:p-8 h-full border border-gray-100 shadow-xl">
                {/* Icon */}
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mb-6">
                  <Zap className="w-6 h-6 text-white" />
                </div>

                {/* Plan Details */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Max</h3>
                  <p className="text-gray-600 mb-6">For power users & teams</p>
                  
                  <div className="flex items-baseline mb-2">
                    <span className="text-3xl sm:text-4xl font-bold text-gray-900">From ¥10,000</span>
                    <span className="text-gray-500 ml-2">/month</span>
                  </div>
                  <p className="text-sm text-gray-500">Custom pricing available</p>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handlePlanSelection('max')}
                  className="w-full py-3 sm:py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl mb-8"
                >
                  Contact Sales
                </button>

                {/* Features */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Everything in Plus, plus:</h4>
                  {[
                    '250-1000 generations per day',
                    'Team collaboration tools',
                    'API access',
                    'Custom integrations',
                    'Dedicated account manager',
                    'SLA guarantee'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 sm:mt-20 text-center">
            <div className="inline-flex items-center space-x-6 sm:space-x-8 text-gray-400">
              <div className="flex items-center">
                <Check className="w-5 h-5 mr-2" />
                <span className="text-sm">No setup fees</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 mr-2" />
                <span className="text-sm">Cancel anytime</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 mr-2" />
                <span className="text-sm">30-day money back</span>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16 sm:mt-24 max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6 sm:space-y-8">
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-3">Can I change plans anytime?</h3>
                <p className="text-gray-600">Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-3">What happens to my projects if I downgrade?</h3>
                <p className="text-gray-600">Your existing projects remain safe. You'll just have access limits based on your new plan.</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-3">Do you offer refunds?</h3>
                <p className="text-gray-600">Yes, we offer a 30-day money-back guarantee for all paid plans. No questions asked.</p>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 sm:mt-20 text-center">
            <p className="text-gray-600 mb-6">
              Still have questions? 
              <a href="https://forms.gle/tzhE2NFkAsZj1cPQ6" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-medium ml-2 underline">
                Contact our team
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}