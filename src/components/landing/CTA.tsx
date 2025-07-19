'use client';

import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';

export function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Ready to Get Started?
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Create Your First Landing Page Today
          </h2>

          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are already building stunning landing pages with our AI-powered platform. Start free, no credit card required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register">
              <Button variant="secondary" size="lg" className="px-8 py-4 text-lg bg-white text-blue-600 hover:bg-gray-100">
                Start Creating Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <a href="#demo">
              <Button variant="ghost" size="lg" className="px-8 py-4 text-lg text-white border-white hover:bg-white/10">
                Watch Demo
              </Button>
            </a>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-blue-100">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>2 free landing pages</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Instant setup</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}