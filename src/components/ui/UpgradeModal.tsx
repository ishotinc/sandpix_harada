'use client';

import { X, Crown, Check, Save, Globe } from 'lucide-react';
import { Button } from './Button';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void; // For billing modal only
  onUpgrade: () => void;
  type: 'billing' | 'project-save';
}

export function UpgradeModal({ isOpen, onClose, onConfirm, onUpgrade, type }: UpgradeModalProps) {
  if (!isOpen) return null;

  const isBilling = type === 'billing';
  const isProjectSave = type === 'project-save';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-lg sm:rounded-2xl p-4 sm:p-6 max-w-md w-full mx-2 sm:mx-4 shadow-xl my-4 sm:my-8 max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900 pr-4">
            {isBilling ? 'Publish Landing Page' : 'Save Your Landing Page'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4 sm:mb-6">
          {isBilling ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
              <div className="flex items-center mb-2">
                <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2 flex-shrink-0" />
                <h3 className="font-semibold text-blue-900 text-sm sm:text-base">Publishing Options</h3>
              </div>
              <p className="text-xs sm:text-sm text-blue-700">
                Choose how you want to publish your landing page
              </p>
            </div>
          ) : (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
              <div className="flex items-center mb-2">
                <Save className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 mr-2 flex-shrink-0" />
                <h3 className="font-semibold text-orange-900 text-sm sm:text-base">Project Limit Reached</h3>
              </div>
              <p className="text-xs sm:text-sm text-orange-700">
                このランディングページを保存するにはアップグレードが必要です。
              </p>
            </div>
          )}
        </div>

        <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
          {isBilling && (
            <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Free Plan</h3>
                <span className="text-xs sm:text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                  Current
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                Publish with SandPix branding
              </p>
              <ul className="space-y-1">
                <li className="flex items-center text-xs sm:text-sm text-gray-600">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                  Free hosting
                </li>
                <li className="flex items-center text-xs sm:text-sm text-gray-600">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                  SandPix branding in footer
                </li>
              </ul>
            </div>
          )}

          <div className="border-2 border-blue-200 rounded-lg p-3 sm:p-4 bg-blue-50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base flex items-center">
                <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 mr-2" />
                Plus Plan
              </h3>
              <span className="text-xs sm:text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full font-medium">
                Recommended
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
              {isBilling ? 'Publish without branding' : 'Unlimited projects and more features'}
            </p>
            <ul className="space-y-1 mb-3 sm:mb-4">
              <li className="flex items-center text-xs sm:text-sm text-gray-600">
                <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                {isProjectSave ? 'Unlimited projects' : 'No branding'}
              </li>
              <li className="flex items-center text-xs sm:text-sm text-gray-600">
                <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                {isProjectSave ? '1日のgenerate制限50に増加' : 'Premium support'}
              </li>
              {isProjectSave && (
                <li className="flex items-center text-xs sm:text-sm text-gray-600">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                  ロゴ消去
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <Button
            onClick={onUpgrade}
            variant="gradient"
            className="w-full text-sm sm:text-base py-2 sm:py-3"
          >
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to Plus
          </Button>
          
          {isBilling && onConfirm && (
            <Button
              onClick={onConfirm}
              variant="outline"
              className="w-full text-sm sm:text-base py-2 sm:py-3"
            >
              Publish with Free Plan
            </Button>
          )}
          
          <Button
            onClick={onClose}
            variant="ghost"
            className="w-full text-sm sm:text-base py-1 sm:py-2"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}