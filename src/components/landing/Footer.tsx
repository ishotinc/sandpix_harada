'use client';

import { Sparkles, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center space-y-6">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 text-gradient rounded-lg flex items-center justify-center bg-gray-100">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xl font-bold text-gradient">Sandpix</span>
          </div>
          
          {/* Description */}
          <p className="text-gray-400 text-center max-w-md">
            AI-powered landing page generator that creates stunning, 
            conversion-optimized pages in minutes.
          </p>

          {/* Support Link */}
          <div className="flex items-center">
            <a
              href="https://forms.gle/tzhE2NFkAsZj1cPQ6"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span>Contact Support</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 pt-6 w-full">
            <p className="text-gray-400 text-sm text-center">
              © {new Date().getFullYear()} Sandpix. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}