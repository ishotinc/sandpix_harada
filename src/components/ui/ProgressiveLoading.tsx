'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Clock, Sparkles } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  description: string;
  duration: number; // seconds
}

const GENERATION_STEPS: Step[] = [
  {
    id: 1,
    title: 'Analyzing Requirements',
    description: 'Analyzing user input data and swipe results',
    duration: 3
  },
  {
    id: 2,
    title: 'Creating Design Concept',
    description: 'Determining design direction from swipe results',
    duration: 4
  },
  {
    id: 3,
    title: 'Structuring Content',
    description: 'Planning section composition based on purpose',
    duration: 4
  },
  {
    id: 4,
    title: 'Creating Copy',
    description: 'Generating catchphrases and descriptions',
    duration: 5
  },
  {
    id: 5,
    title: 'Building Design & Layout',
    description: 'Constructing CSS and HTML structure',
    duration: 6
  },
  {
    id: 6,
    title: 'Quality Check & Optimization',
    description: 'Implementing responsive design and final adjustments',
    duration: 3
  }
];

export function ProgressiveLoading() {
  const [currentStep, setCurrentStep] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  const totalDuration = GENERATION_STEPS.reduce((sum, step) => sum + step.duration, 0);
  const currentStepInfo = GENERATION_STEPS[currentStep];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(prev => {
        const newTime = prev + 0.1;
        
        // Calculate which step we should be on
        let accumulatedTime = 0;
        let targetStep = 0;
        
        for (let i = 0; i < GENERATION_STEPS.length; i++) {
          accumulatedTime += GENERATION_STEPS[i].duration;
          if (newTime < accumulatedTime) {
            targetStep = i;
            break;
          }
          targetStep = GENERATION_STEPS.length - 1;
        }
        
        if (targetStep !== currentStep) {
          setCurrentStep(targetStep);
        }
        
        return Math.min(newTime, totalDuration);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentStep, totalDuration]);

  const progressPercentage = Math.min((elapsedTime / totalDuration) * 100, 100);

  return (
    <div className="flex items-center justify-center min-h-[600px] py-8">
      <div className="text-center max-w-lg w-full px-6">
        {/* Main Icon */}
        <div className="relative mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white animate-pulse" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Current Step */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {currentStepInfo?.title || 'Generating Landing Page...'}
          </h3>
          <p className="text-gray-600 text-sm">
            {currentStepInfo?.description || 'Please wait a moment'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Progress: {Math.round(progressPercentage)}%</span>
            <span>About {Math.max(0, Math.ceil(totalDuration - elapsedTime))} seconds remaining</span>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-3">
          {GENERATION_STEPS.map((step, index) => (
            <div 
              key={step.id}
              className={`flex items-center text-left p-3 rounded-lg transition-all duration-300 ${
                index < currentStep 
                  ? 'bg-green-50 border border-green-200' 
                  : index === currentStep 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <div className="flex-shrink-0 mr-3">
                {index < currentStep ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : index === currentStep ? (
                  <div className="w-5 h-5 border-2 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
                ) : (
                  <Clock className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${
                  index < currentStep 
                    ? 'text-green-700' 
                    : index === currentStep 
                      ? 'text-blue-700' 
                      : 'text-gray-500'
                }`}>
                  {step.title}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-xs text-gray-500">
          <p>Generating a high-quality landing page...</p>
        </div>
      </div>
    </div>
  );
}