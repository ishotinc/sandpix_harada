'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SwipeCard } from './SwipeCard';
import { SwipeImage } from '@/types/project';
import { Heart, X, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface SwipeResult {
  image: SwipeImage;
  liked: boolean;
}

interface SwipeContainerProps {
  images: SwipeImage[];
  onComplete: (results: SwipeResult[]) => void;
}

export function SwipeContainer({ images, onComplete }: SwipeContainerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeResults, setSwipeResults] = useState<SwipeResult[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());

  const currentImage = images[currentIndex];
  const progress = ((currentIndex) / images.length) * 100;

  // Preload images function
  const preloadImage = (imagePath: string) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(imagePath);
      img.onerror = reject;
      img.src = imagePath;
    });
  };

  // Preload next few images
  useEffect(() => {
    const preloadNextImages = async () => {
      const imagesToPreload = [];
      
      // Preload current + next 3 images
      for (let i = currentIndex; i < Math.min(currentIndex + 4, images.length); i++) {
        const imagePath = images[i]?.path;
        if (imagePath && !preloadedImages.has(imagePath)) {
          imagesToPreload.push(imagePath);
        }
      }
      
      // Load images in parallel
      const loadPromises = imagesToPreload.map(async (imagePath) => {
        try {
          await preloadImage(imagePath);
          setPreloadedImages(prev => new Set([...prev, imagePath]));
        } catch (error) {
          console.warn(`Failed to preload image: ${imagePath}`);
        }
      });
      
      await Promise.allSettled(loadPromises);
    };

    preloadNextImages();
  }, [currentIndex, images, preloadedImages]);

  const handleSwipe = (liked: boolean) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    const result: SwipeResult = {
      image: currentImage,
      liked,
    };
    
    const newResults = [...swipeResults, result];
    setSwipeResults(newResults);

    setTimeout(() => {
      if (currentIndex + 1 >= images.length) {
        onComplete(newResults);
      } else {
        setCurrentIndex(currentIndex + 1);
        setIsAnimating(false);
      }
    }, 150); // Reduced from 400ms to 150ms for faster response
  };

  const handleUndo = () => {
    if (currentIndex > 0 && !isAnimating) {
      setCurrentIndex(currentIndex - 1);
      setSwipeResults(swipeResults.slice(0, -1));
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Instructions */}
      <div className="text-center mb-4">
        <p className="text-gray-600 text-sm">
          Swipe right on designs you like - they'll influence your landing page style
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>{currentIndex} of {images.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Swipe Card */}
      <div className="relative mb-6 h-[320px]">
        <AnimatePresence mode="wait">
          {currentImage && (
            <motion.div
              key={currentImage.id}
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ 
                x: swipeResults[swipeResults.length - 1]?.liked ? 400 : -400,
                opacity: 0,
                transition: { duration: 0.15, ease: 'easeOut' }
              }}
              transition={{ 
                duration: 0.15, 
                ease: 'easeOut'
              }}
              className="absolute inset-0"
            >
              <SwipeCard
                image={currentImage}
                onSwipe={handleSwipe}
                isAnimating={isAnimating}
                isPreloaded={preloadedImages.has(currentImage.path)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center space-x-4 mb-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => handleSwipe(false)}
          disabled={isAnimating}
          className="w-16 h-16 rounded-full p-0 border-red-200 hover:border-red-300 hover:bg-red-50"
        >
          <X className="w-6 h-6 text-red-500" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleUndo}
          disabled={currentIndex === 0 || isAnimating}
          className="px-4"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Undo
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={() => handleSwipe(true)}
          disabled={isAnimating}
          className="w-16 h-16 rounded-full p-0 border-green-200 hover:border-green-300 hover:bg-green-50"
        >
          <Heart className="w-6 h-6 text-green-500" />
        </Button>
      </div>

      {/* Instructions */}
      <div className="text-center text-sm text-gray-500">
        <p>Tap the buttons or swipe the card to make your choice</p>
      </div>
    </div>
  );
}