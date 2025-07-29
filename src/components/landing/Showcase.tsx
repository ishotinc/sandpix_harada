'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';

interface ShowcaseItem {
  id: number;
  title: string;
  description: string;
  path: string;
  category: string;
  tags: {
    warm: number;
    cool: number;
    mono: number;
    vivid: number;
    friendly: number;
    professional: number;
    creative: number;
    minimal: number;
    energetic: number;
    trustworthy: number;
    luxurious: number;
    approachable: number;
  };
}

// Helper function to determine category from highest scores
function getCategoryFromScores(scores: any): string {
  const scoreEntries = [
    ['Friendly', scores.friendly_score],
    ['Professional', scores.professional_score],
    ['Creative', scores.creative_score],
    ['Minimal', scores.minimal_score],
    ['Energetic', scores.energetic_score],
    ['Trustworthy', scores.trustworthy_score],
    ['Luxurious', scores.luxurious_score]
  ];
  
  const highestScore = scoreEntries.reduce((prev, current) => 
    current[1] > prev[1] ? current : prev
  );
  
  return highestScore[0] as string;
}

export function Showcase() {
  const [showcaseItems, setShowcaseItems] = useState<ShowcaseItem[]>([]);

  useEffect(() => {
    const loadShowcaseItems = async () => {
      try {
        const response = await fetch('/swipe-config.json');
        const config = await response.json();
        
        // Convert swipe-config.json data to showcase items
        const items: ShowcaseItem[] = config.images
          .filter((item: any) => item.id <= 9) // Show first 9 examples
          .map((item: any) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            path: item.path,
            category: getCategoryFromScores(item.scores),
            tags: {
              warm: item.scores.warm_score,
              cool: item.scores.cool_score,
              mono: item.scores.mono_score,
              vivid: item.scores.vivid_score,
              friendly: item.scores.friendly_score,
              professional: item.scores.professional_score,
              creative: item.scores.creative_score,
              minimal: item.scores.minimal_score,
              energetic: item.scores.energetic_score,
              trustworthy: item.scores.trustworthy_score,
              luxurious: item.scores.luxurious_score,
              approachable: item.scores.approachable_score
            }
          }));
        
        setShowcaseItems(items);
      } catch (error) {
        console.error('Failed to load showcase items:', error);
      }
    };

    loadShowcaseItems();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 px-4">
          <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Real Examples Created with SandPix
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            Landing Pages That{' '}
            <span className="text-gradient bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Convert
            </span>
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            See the variety of beautiful, high-converting landing pages you can create with our AI-powered platform in just minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto px-4">
          {showcaseItems.map((item, index) => (
            <div
              key={item.id}
              className="group bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={item.path}
                  alt={`${item.title} - SandPix AI Generated Landing Page`}
                  className="w-full h-48 sm:h-56 lg:h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Category Badge */}
                <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
                  <span className="px-2 sm:px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs sm:text-sm font-medium rounded-full shadow-lg">
                    {item.category}
                  </span>
                </div>
                
                {/* AI Generated Badge */}
                <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
                  <span className="px-2 py-1 bg-green-600 text-white text-xs font-medium rounded-full shadow-lg">
                    AI Generated
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                  {item.description}
                </p>
                
                {/* Style Preview */}
                <div className="text-[10px] sm:text-xs text-gray-500 bg-gradient-to-r from-gray-50 to-blue-50 p-1.5 sm:p-2 rounded border border-gray-100">
                  ✨ Generated with SandPix AI
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 sm:mt-16 px-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              Ready to Create Your Own?
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              Start building stunning landing pages with AI in minutes
            </p>
            <a
              href="/register"
              className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 text-sm sm:text-base"
            >
              Start Creating Free
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}