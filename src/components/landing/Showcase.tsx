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

export function Showcase() {
  const [showcaseItems, setShowcaseItems] = useState<ShowcaseItem[]>([]);

  useEffect(() => {
    const loadShowcaseItems = async () => {
      try {
        const response = await fetch('/swipe-config.json');
        const config = await response.json();
        
        // Curated landing page examples from swipe images
        const items: ShowcaseItem[] = [
          {
            id: 1,
            title: "Energetic & Friendly Landing",
            description: "Warm, welcoming design with vibrant energy and approachable messaging",
            path: config.images[0]?.path || "/images/swipe-1.jpg",
            category: "Friendly",
            tags: {
              warm: 9, cool: 2, mono: 1, vivid: 4,
              friendly: 10, professional: 3, creative: 6, minimal: 7,
              energetic: 5, trustworthy: 8, luxurious: 2, approachable: 10
            }
          },
          {
            id: 2,
            title: "Traditional & Trustworthy",
            description: "Classic corporate design that builds trust and professional credibility",
            path: config.images[1]?.path || "/images/swipe-2.jpg",
            category: "Professional",
            tags: {
              warm: 2, cool: 1, mono: 8, vivid: 0,
              friendly: 1, professional: 10, creative: 2, minimal: 9,
              energetic: 0, trustworthy: 10, luxurious: 10, approachable: 1
            }
          },
          {
            id: 3,
            title: "Colorful & Innovative",
            description: "Bold, creative design with vibrant colors and innovative layouts",
            path: config.images[2]?.path || "/images/swipe-3.jpg",
            category: "Creative",
            tags: {
              warm: 9, cool: 9, mono: 0, vivid: 10,
              friendly: 0, professional: 10, creative: 3, minimal: 8,
              energetic: 0, trustworthy: 10, luxurious: 8, approachable: 2
            }
          },
          {
            id: 5,
            title: "Pop & Bright Design",
            description: "Playful, energetic design with bright colors and cheerful atmosphere",
            path: config.images[4]?.path || "/images/swipe-5.jpg",
            category: "Energetic",
            tags: {
              warm: 10, cool: 2, mono: 3, vivid: 7,
              friendly: 10, professional: 7, creative: 9, minimal: 5,
              energetic: 7, trustworthy: 9, luxurious: 1, approachable: 10
            }
          },
          {
            id: 6,
            title: "Facebook-style Blue Theme",
            description: "Clean, trustworthy blue design inspired by social media platforms",
            path: config.images[5]?.path || "/images/swipe-6.jpg",
            category: "Trust",
            tags: {
              warm: 0, cool: 10, mono: 2, vivid: 6,
              friendly: 2, professional: 10, creative: 7, minimal: 6,
              energetic: 4, trustworthy: 10, luxurious: 3, approachable: 5
            }
          },
          {
            id: 8,
            title: "Game-style Vivid Colors",
            description: "Dynamic gaming-inspired design with bold colors and engaging elements",
            path: config.images[7]?.path || "/images/swipe-8.jpg",
            category: "Gaming",
            tags: {
              warm: 2, cool: 3, mono: 9, vivid: 8,
              friendly: 7, professional: 8, creative: 8, minimal: 6,
              energetic: 8, trustworthy: 8, luxurious: 2, approachable: 9
            }
          },
          {
            id: 9,
            title: "Notion-style Simple Design",
            description: "Clean, minimal design inspired by modern productivity tools",
            path: config.images[8]?.path || "/images/swipe-9.jpg",
            category: "Minimal",
            tags: {
              warm: 3, cool: 2, mono: 10, vivid: 10,
              friendly: 5, professional: 6, creative: 10, minimal: 3,
              energetic: 10, trustworthy: 6, luxurious: 1, approachable: 7
            }
          },
          {
            id: 11,
            title: "Four Seasons Spa Style",
            description: "Elegant, sophisticated design with luxury spa-inspired aesthetics",
            path: config.images[10]?.path || "/images/swipe-11.jpg",
            category: "Luxury",
            tags: {
              warm: 8, cool: 2, mono: 9, vivid: 4,
              friendly: 7, professional: 5, creative: 4, minimal: 2,
              energetic: 10, trustworthy: 8, luxurious: 1, approachable: 9
            }
          }
        ];
        
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
          <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Real Examples Created with Sandpix
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
                  alt={item.title}
                  className="w-full h-48 sm:h-56 lg:h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Category Badge */}
                <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
                  <span className="px-2 sm:px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-xs sm:text-sm font-medium rounded-full">
                    {item.category}
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
                
                {/* Score Tags */}
                <div className="space-y-2 sm:space-y-3">
                  {/* Top 3 Scores */}
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {Object.entries(item.tags)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 3)
                      .map(([key, value]) => {
                        const colorClass = value >= 8 ? 'bg-green-100 text-green-800' : 
                                          value >= 6 ? 'bg-blue-100 text-blue-800' : 
                                          'bg-gray-100 text-gray-800';
                        const displayName = {
                          warm: 'Warm', cool: 'Cool', mono: 'Mono', vivid: 'Vivid',
                          friendly: 'Friendly', professional: 'Professional', creative: 'Creative', minimal: 'Minimal',
                          energetic: 'Energetic', trustworthy: 'Trustworthy', luxurious: 'Luxurious', approachable: 'Approachable'
                        }[key] || key;
                        
                        return (
                          <span key={key} className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${colorClass}`}>
                            {displayName} {value}
                          </span>
                        );
                      })}
                  </div>
                  
                  {/* Style Preview */}
                  <div className="text-[10px] sm:text-xs text-gray-500 bg-gray-50 p-1.5 sm:p-2 rounded">
                    AI-generated design style
                  </div>
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