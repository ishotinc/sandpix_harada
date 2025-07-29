'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

export function DemoVideo() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Auto-play the video when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // If autoplay fails, show controls
        setIsPlaying(false);
        setShowControls(true);
      });
    }
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-black text-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-thin mb-6 tracking-tight">
            See SandPix in Action
          </h2>
          <p className="text-xl sm:text-2xl text-gray-300 max-w-4xl mx-auto font-light leading-relaxed">
            The fastest way to create landing pages. 
            <br className="hidden sm:block" />
            Swipe through designs, customize instantly, publish immediately.
          </p>
        </div>

        {/* Video Container - SandPix Brand Design */}
        <div className="max-w-2xl mx-auto">
          <div 
            className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-pink-500/30 p-[2px] group shadow-2xl"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
          >
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl overflow-hidden relative">
              {/* Fixed aspect ratio container for vertical videos (9:16 or similar) */}
              <div className="aspect-[9/16] sm:aspect-[3/4] md:aspect-[9/16] w-full max-w-sm sm:max-w-md mx-auto">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                >
                  <source src="/videos/demo-video.webm" type="video/webm" />
                  Your browser does not support the video tag.
                </video>
              </div>
              
              {/* Custom Controls Overlay - SandPix Style */}
              <div className={`absolute inset-0 bg-gradient-to-t from-black/40 to-transparent transition-opacity duration-300 ${
                showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <button
                    onClick={togglePlay}
                    className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg"
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 text-white" />
                    ) : (
                      <Play className="w-4 h-4 text-white ml-0.5" />
                    )}
                  </button>
                  
                  <div className="text-white text-xs font-medium bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                    SandPix Demo
                  </div>
                </div>
              </div>
              
              {/* Play Button for Initial State - SandPix Style */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={togglePlay}
                    className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:scale-110 shadow-2xl"
                  >
                    <Play className="w-6 h-6 text-white ml-1" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}