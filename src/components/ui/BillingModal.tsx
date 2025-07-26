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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Publish Landing Page</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-yellow-800">
              <strong>Free Plan:</strong> Published pages will include a Sandpix logo footer.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Crown className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-blue-900">Upgrade to Plus Plan</h3>
            </div>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-center">
                <Check className="w-4 h-4 mr-2 text-blue-600" />
                Remove Sandpix branding
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 mr-2 text-blue-600" />
                Save up to 5 projects (currently unlimited for free users)
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 mr-2 text-blue-600" />
                50 daily generations
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 mr-2 text-blue-600" />
                Priority support
              </li>
            </ul>
            <p className="text-lg font-bold text-blue-900 mt-3">$20/month</p>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={onConfirm}
            className="flex-1"
          >
            Publish with Logo
          </Button>
          <Button
            variant="gradient"
            onClick={onUpgrade}
            className="flex-1"
          >
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to Plus
          </Button>
        </div>
      </div>
    </div>
  );
}