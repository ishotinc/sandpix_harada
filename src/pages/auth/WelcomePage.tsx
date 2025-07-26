'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WelcomePage() {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get user info from localStorage
    const name = localStorage.getItem('newUserName');
    const email = localStorage.getItem('newUserEmail');
    
    if (name) setUserName(name);
    if (email) setUserEmail(email);
    
    // Clean up localStorage after use
    setTimeout(() => {
      localStorage.removeItem('newUserName');
      localStorage.removeItem('newUserEmail');
    }, 100);
  }, []);

  const handleGetStarted = () => {
    navigate('/projects');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-10 h-10 brand-gradient rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-900">Sandpix</span>
        </Link>

        {/* Welcome Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="animate-fade-in text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to Sandpix{userName ? `, ${userName}` : ''}!
            </h1>

            <p className="text-lg text-gray-600 mb-6">
              Your account has been successfully created and you're ready to start building amazing landing pages.
            </p>

            {userEmail && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  📧 A welcome email has been sent to <strong>{userEmail}</strong>
                </p>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">What's next?</h2>
              <div className="space-y-3 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs font-bold text-blue-600">1</span>
                  </div>
                  <p className="text-sm text-gray-700">Create your first landing page project</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs font-bold text-blue-600">2</span>
                  </div>
                  <p className="text-sm text-gray-700">Choose your design preferences through our swipe feature</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs font-bold text-blue-600">3</span>
                  </div>
                  <p className="text-sm text-gray-700">Generate and publish your professional landing page</p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleGetStarted}
              variant="gradient"
              className="w-full py-3"
            >
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <p className="text-xs text-gray-500 mt-4">
              You can always access your projects from the dashboard
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}