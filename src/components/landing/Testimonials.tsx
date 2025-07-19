'use client';

import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Marketing Director',
    company: 'TechStart Inc.',
    image: 'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=150',
    content: 'Sandpix revolutionized how we create landing pages. What used to take weeks now takes minutes, and the results are stunning. Our conversion rates have increased by 40%.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Founder',
    company: 'GrowthLabs',
    image: 'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=150',
    content: 'The AI understands design better than most humans. I swiped through designs for 2 minutes and got a landing page that perfectly matched my vision. Incredible!',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Product Manager',
    company: 'InnovateCorp',
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=150',
    content: 'As someone with no design background, Sandpix made me look like a professional. The swipe interface is intuitive, and the results are always impressive.',
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            What Our Users Say
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            Join thousands of satisfied customers who've transformed their business with AI-powered landing pages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Quote className="w-4 h-4 text-blue-600" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">10,000+</div>
              <div className="text-gray-600">Landing Pages Created</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">98%</div>
              <div className="text-gray-600">Customer Satisfaction</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">40%</div>
              <div className="text-gray-600">Average Conversion Increase</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">5 Min</div>
              <div className="text-gray-600">Average Creation Time</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}