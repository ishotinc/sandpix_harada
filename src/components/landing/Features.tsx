'use client';

import { Smartphone, Zap, Palette, Code, Share2, BarChart3, Sparkles, Eye } from 'lucide-react';

const features = [
  {
    icon: Smartphone,
    title: 'Swipe-Based Design',
    description: 'Discover your style by swiping through curated design examples. Our AI learns your preferences to create the perfect landing page.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
  },
  {
    icon: Zap,
    title: 'AI-Powered Generation',
    description: 'Advanced AI creates stunning, conversion-optimized landing pages in seconds based on your swipe preferences and content.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-100',
  },
  {
    icon: Palette,
    title: 'Beautiful Templates',
    description: 'Choose from professionally designed templates that adapt to your brand and content automatically.',
    color: 'text-pink-500',
    bgColor: 'bg-pink-100',
  },
  {
    icon: Code,
    title: 'No Coding Required',
    description: 'Create professional landing pages without any technical knowledge. Just describe your service and let AI do the rest.',
    color: 'text-green-500',
    bgColor: 'bg-green-100',
  },
  {
    icon: Share2,
    title: 'Instant Publishing',
    description: 'Publish your landing page with a single click and get a shareable URL immediately. No hosting setup required.',
    color: 'text-orange-500',
    bgColor: 'bg-orange-100',
  },
  {
    icon: BarChart3,
    title: 'Analytics Ready',
    description: 'Built-in analytics tracking to measure your landing page performance and optimize for better conversions.',
    color: 'text-red-500',
    bgColor: 'bg-red-100',
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Powerful Features
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Everything You Need to Create
            <span className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {' '}Perfect Landing Pages
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            From design discovery to publishing, we've got every step covered with cutting-edge AI technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 text-gray-600">
            <Eye className="w-5 h-5" />
            <span>And much more to discover...</span>
          </div>
        </div>
      </div>
    </section>
  );
}