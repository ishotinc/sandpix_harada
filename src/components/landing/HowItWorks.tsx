'use client';

import { Smartphone, Wand2, Eye, Rocket } from 'lucide-react';

const steps = [
  {
    step: 1,
    icon: Smartphone,
    title: 'Swipe Through Designs',
    description: 'Browse through carefully curated design examples. Like what you see? Swipe right. Don\'t like it? Swipe left. Our AI learns your preferences.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
  },
  {
    step: 2,
    icon: Wand2,
    title: 'AI Creates Your Page',
    description: 'Based on your swipe preferences and content, our advanced AI generates a stunning, conversion-optimized landing page tailored to your needs.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-100',
  },
  {
    step: 3,
    icon: Eye,
    title: 'Preview & Customize',
    description: 'Review your generated landing page and make any adjustments. Edit text, colors, and layout until it\'s perfect for your brand.',
    color: 'text-pink-500',
    bgColor: 'bg-pink-100',
  },
  {
    step: 4,
    icon: Rocket,
    title: 'Publish & Share',
    description: 'Launch your landing page with a single click. Get an instant shareable URL and start driving traffic to your beautiful new page.',
    color: 'text-green-500',
    bgColor: 'bg-green-100',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            How It Works
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            Create professional landing pages in just 4 simple steps. No design experience required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              {/* Step Number */}
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full text-lg font-bold text-gray-600 mb-6 group-hover:bg-gray-200 transition-colors">
                {step.step}
              </div>

              {/* Icon */}
              <div className={`w-16 h-16 ${step.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <step.icon className={`w-8 h-8 ${step.color}`} />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 left-full w-8 h-0.5 bg-gray-300 transform -translate-y-1/2" 
                     style={{ marginLeft: '2rem' }} />
              )}
            </div>
          ))}
        </div>

        {/* Visual Flow */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of users who have already created stunning landing pages with our AI-powered platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Free to start</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Instant results</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}