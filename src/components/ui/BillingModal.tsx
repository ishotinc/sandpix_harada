'use client';

import { useState } from 'react';
import { X, Crown, Check } from 'lucide-react';
import { Button } from './Button';

interface BillingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onUpgrade: () => void;
}

export function BillingModal({ isOpen, onClose, onConfirm, onUpgrade }: BillingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-lg sm:rounded-2xl p-4 sm:p-6 max-w-md w-full mx-2 sm:mx-4 shadow-xl my-4 sm:my-8 max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900 pr-4">Publish Landing Page</h2>
          <button
            onClick={onClose}
            className="p-1 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4 sm:mb-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
            <p className="text-xs sm:text-sm text-yellow-800">
              <strong>Warning:</strong> Updating to publish will add the Sandpix logo to your landing page.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-center mb-2 sm:mb-3">
              <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2" />
              <h3 className="text-sm sm:text-base font-semibold text-blue-900">Upgrade to Plus Plan</h3>
            </div>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-blue-800">
              <li className="flex items-center">
                <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-blue-600 flex-shrink-0" />
                <span>Remove Sandpix branding</span>
              </li>
              <li className="flex items-center">
                <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-blue-600 flex-shrink-0" />
                <span>Save up to 5 projects (currently unlimited for free users)</span>
              </li>
              <li className="flex items-center">
                <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-blue-600 flex-shrink-0" />
                <span>50 daily generations</span>
              </li>
              <li className="flex items-center">
                <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-blue-600 flex-shrink-0" />
                <span>Priority support</span>
              </li>
            </ul>
            <p className="text-base sm:text-lg font-bold text-blue-900 mt-2 sm:mt-3">$20/month</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <Button
            variant="outline"
            onClick={onConfirm}
            className="flex-1 text-sm sm:text-base py-2 sm:py-3"
          >
            Publish with Logo
          </Button>
          <Button
            variant="gradient"
            onClick={onUpgrade}
            className="flex-1 text-sm sm:text-base py-2 sm:py-3"
          >
            <Crown className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Upgrade to Plus
          </Button>
        </div>
      </div>
    </div>
  );
}