'use client';

import { useState, useRef } from 'react';
import { SwipeImage } from '@/types/project';
import { Heart, X } from 'lucide-react';

interface SwipeCardProps {
  image: SwipeImage;
  onSwipe: (liked: boolean) => void;
  isAnimating: boolean;
}

export function SwipeCard({ image, onSwipe, isAnimating }: SwipeCardProps) {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isAnimating) return;
    setIsDragging(true);
    
    const startX = e.clientX;
    const startY = e.clientY;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      setDragOffset({ x: deltaX, y: deltaY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      
      if (Math.abs(dragOffset.x) > 100) {
        onSwipe(dragOffset.x > 0);
      }
      
      setDragOffset({ x: 0, y: 0 });
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isAnimating) return;
    setIsDragging(true);
    
    const startX = e.touches[0].clientX;
    const startY = e.touches[0].clientY;

    const handleTouchMove = (e: TouchEvent) => {
      const deltaX = e.touches[0].clientX - startX;
      const deltaY = e.touches[0].clientY - startY;
      setDragOffset({ x: deltaX, y: deltaY });
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      
      if (Math.abs(dragOffset.x) > 100) {
        onSwipe(dragOffset.x > 0);
      }
      
      setDragOffset({ x: 0, y: 0 });
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  const rotation = dragOffset.x * 0.1;
  const opacity = Math.max(0.7, 1 - Math.abs(dragOffset.x) * 0.002);

  return (
    <div className="relative">
      <div
        ref={cardRef}
        className={`
          relative bg-white rounded-2xl shadow-xl overflow-hidden cursor-grab active:cursor-grabbing
          transition-all duration-300 select-none
          ${isDragging ? 'scale-105' : 'hover:scale-102'}
          ${isAnimating ? 'pointer-events-none' : ''}
        `}
        style={{
          transform: `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) rotate(${rotation}deg)`,
          opacity,
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Image */}
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={image.path}
            alt={image.title}
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {image.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3">
            {image.description}
          </p>
          <p className="text-gray-500 text-xs">
            {image.visual_hints}
          </p>
        </div>

        {/* Swipe Indicators */}
        {isDragging && (
          <>
            <div
              className={`
                absolute top-4 left-4 px-3 py-1 rounded-full font-bold text-sm
                transition-opacity duration-200
                ${dragOffset.x > 50 
                  ? 'bg-green-500 text-white opacity-100' 
                  : 'bg-green-100 text-green-500 opacity-50'
                }
              `}
            >
              <Heart className="w-4 h-4 inline mr-1" />
              LIKE
            </div>
            <div
              className={`
                absolute top-4 right-4 px-3 py-1 rounded-full font-bold text-sm
                transition-opacity duration-200
                ${dragOffset.x < -50 
                  ? 'bg-red-500 text-white opacity-100' 
                  : 'bg-red-100 text-red-500 opacity-50'
                }
              `}
            >
              <X className="w-4 h-4 inline mr-1" />
              PASS
            </div>
          </>
        )}
      </div>
    </div>
  );
}