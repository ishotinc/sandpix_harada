'use client';

import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LogoProps {
  to?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gradient' | 'simple';
  className?: string;
}

export function Logo({ 
  to = "/", 
  size = 'md', 
  variant = 'default',
  className = "" 
}: LogoProps) {
  const sizeClasses = {
    sm: {
      icon: 'w-6 h-6',
      iconInner: 'w-4 h-4',
      text: 'text-lg'
    },
    md: {
      icon: 'w-8 h-8',
      iconInner: 'w-5 h-5',
      text: 'text-xl'
    },
    lg: {
      icon: 'w-10 h-10',
      iconInner: 'w-6 h-6',
      text: 'text-2xl'
    }
  };

  const variantClasses = {
    default: {
      iconBg: 'text-gradient rounded-lg flex items-center justify-center bg-gray-100',
      iconColor: 'text-blue-600',
      textColor: 'text-gradient'
    },
    gradient: {
      iconBg: 'bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center',
      iconColor: 'text-white',
      textColor: 'text-gray-900'
    },
    simple: {
      iconBg: 'rounded-lg flex items-center justify-center',
      iconColor: 'text-blue-600',
      textColor: 'text-gray-900'
    }
  };

  const sizes = sizeClasses[size];
  const styles = variantClasses[variant];

  const logoContent = (
    <>
      <div className={`${sizes.icon} ${styles.iconBg}`}>
        <Sparkles className={`${sizes.iconInner} ${styles.iconColor}`} />
      </div>
      <span className={`${sizes.text} font-bold ${styles.textColor}`}>SandPix</span>
    </>
  );

  return (
    <Link to={to} className={`flex items-center space-x-2 ${className}`}>
      {logoContent}
    </Link>
  );
}