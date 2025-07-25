'use client';

import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section className="pt-20 pb-12 lg:pt-32 lg:pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-8 animate-bounce-in">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Landing Page Generator
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 animate-fade-in leading-tight">
            Create{' '}
            <span className="text-gradient bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Stunning
            </span>{' '}
            Landing Pages in Minutes
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto animate-slide-up px-4 sm:px-0">
            Swipe through designs, let AI create your perfect landing page, and publish instantly. 
            No coding required, just beautiful results.
          </p>

          {/* CTA Buttons */}
          <div className="flex justify-center mb-8 sm:mb-12 animate-slide-up px-4">
            <Link to="/register" className="w-full sm:w-auto">
              <Button variant="gradient" size="lg" className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg">
                Start Creating Free
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}