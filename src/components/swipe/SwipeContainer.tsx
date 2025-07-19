'use client';

import { useState, useEffect } from 'react';
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

  const currentImage = images[currentIndex];
  const progress = ((currentIndex) / images.length) * 100;

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
    }, 300);
  };

  const handleUndo = () => {
    if (currentIndex > 0 && !isAnimating) {
      setCurrentIndex(currentIndex - 1);
      setSwipeResults(swipeResults.slice(0, -1));
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Discover Your Style
        </h1>
        <p className="text-gray-600">
          Swipe right if you like the design, left if you don't
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>{currentIndex + 1} of {images.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Swipe Card */}
      <div className="relative mb-8">
        <SwipeCard
          image={currentImage}
          onSwipe={handleSwipe}
          isAnimating={isAnimating}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center space-x-4 mb-6">
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