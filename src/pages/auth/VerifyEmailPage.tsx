'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase/client';
import { useToast } from '../../components/ui/ToastProvider';
import { Button } from '../../components/ui/Button';
import { Mail, CheckCircle, RefreshCw, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function VerifyEmailPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [userEmail, setUserEmail] = useState('');

  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    // Get user email from localStorage or session
    const email = localStorage.getItem('pendingEmail');
    if (email) {
      setUserEmail(email);
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleResendEmail = async () => {
    if (!userEmail) {
      showToast('error', 'Email address not found. Please try signing up again.');
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: userEmail,
      });

      if (error) {
        showToast('error', error.message);
        return;
      }

      showToast('success', 'Verification email sent! Please check your inbox.');
      setCountdown(60); // 60 second cooldown
    } catch (error) {
      showToast('error', 'Failed to resend email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
              We've sent a verification link to:
            </p>
            
            <p className="text-lg font-medium text-gray-900 mb-6">
              {userEmail || 'your email address'}
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-left">
                  <p className="text-sm font-medium text-blue-900 mb-1">
                    What happens next?
                  </p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Click the verification link in your email</li>
                    <li>• You'll be automatically signed in</li>
                    <li>• Start creating your first landing page</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Didn't receive the email? Check your spam folder or
              </p>
              
              <Button
                onClick={handleResendEmail}
                variant="outline"
                loading={isLoading}
                disabled={countdown > 0}
                className="w-full"
              >
                {countdown > 0 ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Resend in {countdown}s
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Resend Verification Email
                  </>
                )}
              </Button>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Wrong email address?{' '}
                  <Link to="/register" className="text-blue-600 hover:text-blue-700">
                    Sign up again
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}