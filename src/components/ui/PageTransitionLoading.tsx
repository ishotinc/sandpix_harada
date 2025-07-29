'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, Sparkles, Settings, FileText } from 'lucide-react';

interface PageTransitionLoadingProps {
  title?: string;
  subtitle?: string;
}

const TRANSITION_MESSAGES = [
  {
    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    message: "Project saved successfully!",
    duration: 1000
  },
  {
    icon: <ArrowRight className="w-5 h-5 text-blue-500" />,
    message: "Redirecting to project editor...",
    duration: 1000
  },
  {
    icon: <Settings className="w-5 h-5 text-purple-500 animate-spin" />,
    message: "Loading project settings...",
    duration: 1500
  },
  {
    icon: <FileText className="w-5 h-5 text-orange-500" />,
    message: "Preparing editing interface...",
    duration: 1000
  }
];

export function PageTransitionLoading({ 
  title = "Loading...", 
  subtitle = "Please wait a moment" 
}: PageTransitionLoadingProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;

    // Progress animation
    progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 2, 100));
    }, 50);

    // Message cycling
    const cycleMessages = () => {
      if (currentMessageIndex < TRANSITION_MESSAGES.length - 1) {
        timeoutId = setTimeout(() => {
          setCurrentMessageIndex(prev => prev + 1);
        }, TRANSITION_MESSAGES[currentMessageIndex].duration);
      }
    };

    cycleMessages();

    return () => {
      clearTimeout(timeoutId);
      clearInterval(progressInterval);
    };
  }, [currentMessageIndex]);

  const currentMessage = TRANSITION_MESSAGES[currentMessageIndex];

  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center max-w-md w-full px-6">
        {/* Main Icon with Animation */}
        <div className="relative mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Sparkles className="w-10 h-10 text-white animate-pulse" />
          </div>
          
          {/* Floating dots around the main icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 border border-blue-200 rounded-full animate-spin opacity-30"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 border border-purple-200 rounded-full animate-spin opacity-20" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
          </div>
          
          {/* Pulsing effect */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 animate-ping"></div>
        </div>

        {/* Title and Subtitle */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600">{subtitle}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-500">
            {progress}% complete
          </div>
        </div>

        {/* Current Status Message */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-center space-x-3">
            {currentMessage.icon}
            <span className="text-gray-700 font-medium">
              {currentMessage.message}
            </span>
          </div>
        </div>

        {/* Steps Indicator */}
        <div className="flex justify-center space-x-2">
          {TRANSITION_MESSAGES.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index <= currentMessageIndex 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Encouraging message */}
        <div className="mt-6 text-xs text-gray-500">
          <p>✨ Setting up your perfect editing environment...</p>
        </div>
      </div>
    </div>
  );
}