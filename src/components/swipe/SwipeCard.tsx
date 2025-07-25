'use client';

import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { SwipeImage } from '@/types/project';
import { Heart, X } from 'lucide-react';

interface SwipeCardProps {
  image: SwipeImage;
  onSwipe: (liked: boolean) => void;
  isAnimating: boolean;
}

export function SwipeCard({ image, onSwipe, isAnimating }: SwipeCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Transform values based on drag position
  const rotate = useTransform(x, [-200, 0, 200], [-30, 0, 30]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 0.8, 1, 0.8, 0.5]);
  
  // Indicator opacities
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const passOpacity = useTransform(x, [-100, 0], [1, 0]);
  
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    
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
        dragElastic={1}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        whileHover={{ scale: isAnimating ? 1 : 1.02 }}
        whileDrag={{ scale: 1.05 }}
        transition={{
          scale: { duration: 0.2, ease: 'easeOut' },
        }}
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