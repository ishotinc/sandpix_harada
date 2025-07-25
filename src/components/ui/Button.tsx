'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react'; // Assuming lucide-react is available

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gradient' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
}

// Define the custom colors for Tailwind's JIT mode using arbitrary values
// #0071E3 is the primary blue
// #005bb5 is a slightly darker shade for hover effect
const variants = {
  // Primary button: uses the new blue for background and hover
  primary: 'bg-[#0071E3] hover:bg-[#005bb5] text-white shadow-lg hover:shadow-xl',
  // Secondary button: remains gray as per original
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
  // Gradient button: remains as is, assuming 'brand-gradient' is defined elsewhere (e.g., in global CSS)
  gradient: 'brand-gradient text-white shadow-lg hover:shadow-xl relative overflow-hidden',
  // Outline button: uses the new blue for border and text, and for hover background
  outline: 'border-2 border-[#0071E3] text-[#0071E3] hover:bg-[#0071E3] hover:text-white',
  // Ghost button: remains as is
  ghost: 'hover:bg-gray-100 text-gray-700',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export default function Button({ // Export as default for easier use in Canvas
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-lg
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-[#0071E3] focus:ring-offset-2 // Focus ring color updated to new blue
        disabled:opacity-50 disabled:cursor-not-allowed
        hover:scale-[1.02] active:scale-[0.98]
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {/* Loader icon, assuming Loader2 from lucide-react is available */}
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
