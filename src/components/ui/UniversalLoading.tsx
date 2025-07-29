'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Zap, Rocket, Star, Heart, Coffee, Palette, Code } from 'lucide-react';

interface UniversalLoadingProps {
  title?: string;
  subtitle?: string;
  showTips?: boolean;
  minimal?: boolean; // For page transitions
}

const LOADING_ICONS = [Sparkles, Zap, Rocket, Star, Heart, Coffee, Palette, Code];

const LOADING_TIPS = [
  "💡 プロ tip: ランディングページの見出しは8文字以内が効果的です",
  "🎨 デザインのコツ: コントラストを意識して視認性を高めましょう",
  "📱 モバイルファーストで設計すると成果が向上します",
  "⚡ 読み込み速度は3秒以内を目指しましょう",
  "🎯 CTAボタンは目立つ色で配置するのがポイントです",
  "📈 A/Bテストで継続的に改善していきましょう",
  "🌟 ユーザーの感情に訴えかける写真を使いましょう",
  "🔥 シンプルで分かりやすいメッセージが効果的です"
];

const CREATIVE_MESSAGES = [
  "✨ あなたの創造力を形にしています...",
  "🚀 素晴らしいアイデアを実現中...",
  "💫 魔法をかけています...",
  "🎨 美しいデザインを準備中...",
  "⚡ パワーアップしています...",
  "🌟 特別な体験を作成中...",
  "🎯 完璧を目指して調整中...",
  "💎 価値のあるものを構築中..."
];

export function UniversalLoading({ 
  title = "Loading...", 
  subtitle = "Please wait a moment",
  showTips = true,
  minimal = false
}: UniversalLoadingProps) {
  const [currentIconIndex, setCurrentIconIndex] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState('');

  // Icon rotation
  useEffect(() => {
    const iconInterval = setInterval(() => {
      setCurrentIconIndex(prev => (prev + 1) % LOADING_ICONS.length);
    }, 800);

    return () => clearInterval(iconInterval);
  }, []);

  // Progress animation
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        return Math.min(newProgress, 85); // Cap at 85% to avoid completion
      });
    }, 400);

    return () => clearInterval(progressInterval);
  }, []);

  // Tips rotation (if enabled)
  useEffect(() => {
    if (!showTips) return;
    
    const tipInterval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % LOADING_TIPS.length);
    }, 4000);

    return () => clearInterval(tipInterval);
  }, [showTips]);

  // Creative messages rotation
  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % CREATIVE_MESSAGES.length);
    }, 2500);

    return () => clearInterval(messageInterval);
  }, []);

  // Animated dots
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(dotsInterval);
  }, []);

  const CurrentIcon = LOADING_ICONS[currentIconIndex];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center z-50">
      <div className="text-center max-w-lg w-full px-6">
        {/* Main Loading Animation */}
        <div className="relative mb-8">
          {/* Primary Icon with Rotation */}
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
            <div className="relative w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg transform transition-transform duration-800 hover:scale-110">
              <CurrentIcon className="w-10 h-10 text-white animate-bounce" />
            </div>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-400 rounded-full animate-float opacity-70"></div>
          <div className="absolute -top-2 -right-6 w-6 h-6 bg-pink-400 rounded-full animate-float-delayed opacity-60"></div>
          <div className="absolute -bottom-4 left-2 w-5 h-5 bg-green-400 rounded-full animate-float opacity-50"></div>
          <div className="absolute -bottom-2 -right-4 w-7 h-7 bg-blue-400 rounded-full animate-float-delayed opacity-55"></div>
          
          {/* Orbital Rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 border-2 border-blue-200 rounded-full animate-spin opacity-30"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-40 border border-purple-200 rounded-full animate-spin opacity-20" style={{ animationDirection: 'reverse', animationDuration: '4s' }}></div>
          </div>
        </div>

        {/* Title and Subtitle - Hidden in minimal mode */}
        {!minimal && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600">{subtitle}{dots}</p>
          </div>
        )}

        {/* Creative Message - Hidden in minimal mode */}
        {!minimal && (
          <div className="mb-6">
            <p className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 animate-fade-in">
              {CREATIVE_MESSAGES[currentMessage]}
            </p>
          </div>
        )}

        {/* Progress Bar - Hidden in minimal mode */}
        {!minimal && (
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white opacity-30 animate-shimmer"></div>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {Math.round(progress)}% complete
            </div>
          </div>
        )}

        {/* Loading Tips (if enabled) - Hidden in minimal mode */}
        {showTips && !minimal && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">💡</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed animate-fade-in">
                {LOADING_TIPS[currentTip]}
              </p>
            </div>
          </div>
        )}

        {/* Fun Loading Elements - Hidden in minimal mode */}
        {!minimal && (
          <div className="flex justify-center space-x-2 mb-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        )}

        {/* Encouraging Message - Hidden in minimal mode */}
        {!minimal && (
          <div className="text-xs text-gray-500">
            <p>🎉 もうすぐ完成です...</p>
          </div>
        )}
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(90deg); }
          50% { transform: translateY(-5px) rotate(180deg); }
          75% { transform: translateY(-15px) rotate(270deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-15px) rotate(-90deg); }
          50% { transform: translateY(-8px) rotate(-180deg); }
          75% { transform: translateY(-12px) rotate(-270deg); }
        }
        
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 3s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}