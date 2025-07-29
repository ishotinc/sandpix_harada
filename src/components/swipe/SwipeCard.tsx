'use client';

import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { SwipeImage } from '@/types/project';
import { Heart, X } from 'lucide-react';

interface SwipeCardProps {
  image: SwipeImage;
  onSwipe: (liked: boolean) => void;
  isAnimating: boolean;
  isPreloaded?: boolean;
}

export function SwipeCard({ image, onSwipe, isAnimating, isPreloaded = false }: SwipeCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Transform values based on drag position - smoother transitions
  const rotate = useTransform(x, [-150, 0, 150], [-20, 0, 20]); // Reduced rotation for smoother feel
  const opacity = useTransform(x, [-150, -50, 0, 50, 150], [0.7, 0.9, 1, 0.9, 0.7]); // Smoother opacity curve
  
  // Indicator opacities - faster response
  const likeOpacity = useTransform(x, [0, 60], [0, 1]); // Show LIKE indicator sooner
  const passOpacity = useTransform(x, [-60, 0], [1, 0]); // Show PASS indicator sooner
  
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 80; // Reduced threshold for faster swipe detection
    
    if (Math.abs(info.offset.x) > threshold) {
      onSwipe(info.offset.x > 0);
    }
  };

  return (
    <div className="relative">
      <motion.div
        className={`
          relative bg-white rounded-2xl shadow-xl overflow-hidden cursor-grab active:cursor-grabbing
          select-none
          ${isAnimating ? 'pointer-events-none' : ''}
        `}
        style={{
          x,
          y,
          rotate,
          opacity,
        }}
        drag={!isAnimating}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.1} // Reduced elastic for less bounce
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        whileHover={{ scale: isAnimating ? 1 : 1.01 }} // Reduced hover scale
        whileDrag={{ scale: 1.02 }} // Reduced drag scale
        transition={{
          type: 'tween',
          duration: 0.1,
          ease: 'easeOut'
        }}
      >
        {/* Image */}
        <div className="aspect-[4/3] overflow-hidden relative">
          <img
            src={image.path}
            alt={image.title}
            className="w-full h-full object-cover"
            draggable={false}
            loading="eager"
          />
          {/* Preload indicator (optional visual feedback) */}
          {!isPreloaded && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse" />
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="text-base font-bold text-gray-900 text-center">
            {image.title}
          </h3>
        </div>

        {/* Swipe Indicators */}
        <motion.div
          className="absolute top-4 left-4 px-3 py-1 rounded-full font-bold text-sm bg-green-500 text-white"
          style={{ opacity: likeOpacity }}
        >
          <Heart className="w-4 h-4 inline mr-1" />
          LIKE
        </motion.div>
        <motion.div
          className="absolute top-4 right-4 px-3 py-1 rounded-full font-bold text-sm bg-red-500 text-white"
          style={{ opacity: passOpacity }}
        >
          <X className="w-4 h-4 inline mr-1" />
          PASS
        </motion.div>
      </motion.div>
    </div>
  );
}