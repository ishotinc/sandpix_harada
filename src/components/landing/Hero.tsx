'use client';

import { ArrowRight, Sparkles, Zap, Eye } from 'lucide-react';
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
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
            Create{' '}
            <span className="text-gradient bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Stunning
            </span>{' '}
            Landing Pages in Minutes
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto animate-slide-up">
            Swipe through designs, let AI create your perfect landing page, and publish instantly. 
            No coding required, just beautiful results.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-slide-up">
            <Link to="/register">
              <Button variant="gradient" size="lg" className="px-8 py-4 text-lg">
                Start Creating Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <a href="#demo">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                <Eye className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </a>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-gray-500 animate-fade-in">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span>10,000+ Landing Pages Created</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <span>5-Star AI Technology</span>
            </div>
          </div>
        </div>

        {/* Hero Image/Demo */}
        <div className="mt-16 lg:mt-24 animate-fade-in">
          <div className="relative max-w-6xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl -z-10"></div>
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 lg:p-8">
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Interactive Demo Coming Soon
                  </h3>
                  <p className="text-gray-500">
                    See how easy it is to create beautiful landing pages
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}