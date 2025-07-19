'use client';

import { useEffect, useState } from 'react';
import { X, CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';

interface ToastProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  onClose: () => void;
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const styles = {
  success: 'bg-green-500 text-white',
  error: 'bg-red-500 text-white',
  info: 'bg-blue-500 text-white',
  warning: 'bg-yellow-500 text-gray-900',
};

export function Toast({ type, message, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const Icon = icons[type];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`
        transform transition-all duration-300 ease-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${styles[type]}
        flex items-center gap-3 p-4 rounded-lg shadow-lg max-w-md
        border-l-4 border-white/20
      `}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="flex-1 text-sm font-medium">{message}</span>
      <button
        onClick={handleClose}
        className="p-1 hover:bg-white/10 rounded-full transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}