'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Clock, Sparkles } from 'lucide-react';

interface GenerationStep {
  id: string;
  message: string;
  duration: number; // seconds
  completed: boolean;
}

interface GenerationProgressProps {
  isGenerating: boolean;
  onComplete?: () => void;
  totalDuration?: number; // total seconds, default 60
}

const GENERATION_STEPS: Omit<GenerationStep, 'completed'>[] = [
  { id: 'config', message: 'Retrieving configuration settings...', duration: 8 },
  { id: 'content', message: 'Creating content structure...', duration: 12 },
  { id: 'design', message: 'Analyzing design composition...', duration: 15 },
  { id: 'styling', message: 'Applying visual design...', duration: 15 },
  { id: 'coding', message: 'Generating HTML & CSS code...', duration: 10 }
];

const GENERATION_TIPS = [
  'Enter detailed service information in project editing to create a landing page that better matches your vision. Try adding pricing, achievements, and reviews.',
  'Information set in your profile settings page will be integrated into the generated pages.',
  'The more you generate, the better our system learns your preferred landing page design for each project.'
];

export function GenerationProgress({ 
  isGenerating, 
  onComplete,
  totalDuration = 60 
}: GenerationProgressProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [steps, setSteps] = useState<GenerationStep[]>(
    GENERATION_STEPS.map(step => ({ ...step, completed: false }))
  );
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    if (!isGenerating) {
      // Reset state when generation stops
      setCurrentStep(0);
      setProgress(0);
      setElapsedTime(0);
      setCurrentTipIndex(0);
      setSteps(GENERATION_STEPS.map(step => ({ ...step, completed: false })));
      return;
    }

    // Start progress simulation
    const startTime = Date.now();
    
    const updateProgress = () => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      setElapsedTime(elapsed);

      // Calculate progress percentage (0-100)
      const progressPercent = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(progressPercent);

      // Determine current step based on elapsed time
      let accumulatedTime = 0;
      let newCurrentStep = 0;
      const newSteps = [...steps];

      for (let i = 0; i < GENERATION_STEPS.length; i++) {
        accumulatedTime += GENERATION_STEPS[i].duration;
        
        if (elapsed < accumulatedTime) {
          newCurrentStep = i;
          break;
        } else {
          newSteps[i].completed = true;
          newCurrentStep = i + 1;
        }
      }

      setCurrentStep(newCurrentStep);
      setSteps(newSteps);

      // Complete when time is up
      if (elapsed >= totalDuration) {
        // Mark all steps as completed
        const completedSteps = GENERATION_STEPS.map(step => ({ ...step, completed: true }));
        setSteps(completedSteps);
        setProgress(100);
        if (onComplete) {
          onComplete();
        }
      }
    };

    // Update every 100ms for smooth animation
    const interval = setInterval(updateProgress, 100);

    return () => clearInterval(interval);
  }, [isGenerating, totalDuration, onComplete]);

  // Tips rotation every 10 seconds
  useEffect(() => {
    if (!isGenerating) return;
    
    const tipInterval = setInterval(() => {
      setCurrentTipIndex(prev => (prev + 1) % GENERATION_TIPS.length);
    }, 10000); // 10 seconds

    return () => clearInterval(tipInterval);
  }, [isGenerating]);

  if (!isGenerating) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-lg sm:rounded-2xl shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-center mb-4 sm:mb-6">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 animate-pulse" />
            <div className="absolute inset-0 animate-spin">
              <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-blue-200 border-t-blue-600 rounded-full"></div>
            </div>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              Generating Your Landing Page
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Please wait while we create your custom design...
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4 sm:mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs sm:text-sm font-medium text-gray-700">Progress</span>
          <span className="text-xs sm:text-sm font-medium text-blue-600">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 sm:h-2.5 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500">
            {elapsedTime}s elapsed
          </span>
          <span className="text-xs text-gray-500">
            ~{totalDuration}s total
          </span>
        </div>
      </div>

      {/* Process Steps */}
      <div className="space-y-2 sm:space-y-3">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg transition-all duration-300 ${
              index === currentStep && !step.completed
                ? 'bg-blue-50 border border-blue-200'
                : step.completed
                ? 'bg-green-50 border border-green-200'
                : 'bg-gray-50 border border-gray-200'
            }`}
          >
            <div className="flex-shrink-0">
              {step.completed ? (
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              ) : index === currentStep ? (
                <div className="relative">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 animate-pulse" />
                </div>
              ) : (
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-gray-300" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className={`text-xs sm:text-sm font-medium transition-colors ${
                step.completed 
                  ? 'text-green-700' 
                  : index === currentStep 
                  ? 'text-blue-700' 
                  : 'text-gray-500'
              }`}>
                {step.message}
              </p>
            </div>

            {index === currentStep && !step.completed && (
              <div className="flex-shrink-0">
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tips Section */}
      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">💡</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-medium text-blue-800 mb-1">
              Tip #{currentTipIndex + 1}
            </p>
            <p className="text-xs sm:text-sm text-blue-700 leading-relaxed">
              {GENERATION_TIPS[currentTipIndex]}
            </p>
          </div>
        </div>
      </div>

      {/* Warning Message */}
      <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <div className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 mt-0.5 flex-shrink-0">
            ⏳
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-medium text-yellow-800">
              Please don't refresh or close this page
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              Generation is in progress and may take up to {totalDuration} seconds to complete.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}