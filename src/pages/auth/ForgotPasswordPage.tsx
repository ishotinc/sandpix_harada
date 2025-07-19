'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase/client';
import { useToast } from '../../components/ui/ToastProvider';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Mail, ArrowLeft, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  const { showToast } = useToast();

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Check if Supabase is configured
    if (!supabase) {
      setError('Authentication service is not configured. Please contact support.');
      showToast('error', 'Authentication service is not configured. Please contact support.');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError(error.message);
        showToast('error', error.message);
        return;
      }

      setEmailSent(true);
      showToast('success', 'Password reset email sent! Please check your inbox.');
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      showToast('error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-10 h-10 brand-gradient rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Sandpix</span>
          </Link>

          {/* Auth Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="animate-fade-in text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Check Your Email
              </h1>

              <p className="text-gray-600 mb-2">
                We've sent a password reset link to:
              </p>
              
              <p className="text-lg font-medium text-gray-900 mb-6">
                {email}
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  Click the link in your email to reset your password. 
                  The link will expire in 1 hour for security reasons.
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Didn't receive the email? Check your spam folder or
                </p>
                
                <Button
                  onClick={() => {
                    setEmailSent(false);
                    setEmail('');
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Try Again
                </Button>

                <div className="pt-4 border-t border-gray-200">
                  <Link to="/login" className="text-blue-600 hover:text-blue-700 text-sm">
                    <ArrowLeft className="w-4 h-4 inline mr-1" />
                    Back to Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-10 h-10 brand-gradient rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-900">Sandpix</span>
        </Link>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Reset Your Password
              </h1>
              <p className="text-gray-600">
                Enter your email address and we'll send you a reset link
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className="pl-10"
                  error={error}
                />
              </div>

              <Button
                type="submit"
                variant="gradient"
                className="w-full"
                loading={isLoading}
              >
                Send Reset Link
              </Button>
            </form>

            <div className="text-center mt-6">
              <Link to="/login" className="text-blue-600 hover:text-blue-700 text-sm">
                <ArrowLeft className="w-4 h-4 inline mr-1" />
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}