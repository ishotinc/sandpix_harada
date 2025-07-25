'use client';

import { Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/stripe/ProductCard';
import { stripeProducts } from '@/stripe-config';
import { Link } from 'react-router-dom';

export function Pricing() {
  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            Start free and upgrade when you need more features. No hidden fees, no surprises.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-8">
          {stripeProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Plans Link */}
        <div className="text-center">
          <Link to="/pricing">
            <Button variant="outline" size="lg">
              <ExternalLink className="w-4 h-4 mr-2" />
              View All Plans
            </Button>
          </Link>
        </div>

        {/* FAQ */}
        <div className="mt-16 text-center">
          <p className="text-gray-500">
            Questions about pricing?{' '}
            <a href="/contact" className="text-blue-600 hover:text-blue-700">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}