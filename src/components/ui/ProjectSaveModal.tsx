'use client';

import { X, Crown, Check, Save } from 'lucide-react';
import { Button } from './Button';

interface ProjectSaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export function ProjectSaveModal({ isOpen, onClose, onUpgrade }: ProjectSaveModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-lg sm:rounded-2xl p-4 sm:p-6 max-w-md w-full mx-2 sm:mx-4 shadow-xl my-4 sm:my-8 max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900 pr-4">Save Your Landing Page</h2>
          <button
            onClick={onClose}
            className="p-1 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4 sm:mb-6">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
            <div className="flex items-center mb-2">
              <Save className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 mr-2" />
              <p className="text-sm sm:text-base font-semibold text-orange-800">
                Project limit reached
              </p>
            </div>
            <p className="text-xs sm:text-sm text-orange-700">
              このランディングページを保存するにはアップグレードが必要です。
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-center mb-2 sm:mb-3">
              <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2" />
              <h3 className="text-sm sm:text-base font-semibold text-blue-900">Upgrade to Plus Plan</h3>
            </div>
            <p className="text-xs sm:text-sm text-blue-800 mb-3 font-medium">
              ✨ アップグレードして、このランディングページを保存し、プレミアム機能をご利用ください：
            </p>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-blue-800">
              <li className="flex items-center">
                <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-blue-600 flex-shrink-0" />
                <span><strong>プロジェクトを無制限保存</strong>（現在制限中）</span>
              </li>
              <li className="flex items-center">
                <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-blue-600 flex-shrink-0" />
                <span><strong>1日50回の生成</strong>（無料版は10回）</span>
              </li>
              <li className="flex items-center">
                <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-blue-600 flex-shrink-0" />
                <span><strong>SandPixロゴを削除</strong></span>
              </li>
              <li className="flex items-center">
                <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-blue-600 flex-shrink-0" />
                <span><strong>優先サポート</strong>と新機能への早期アクセス</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 order-2 sm:order-1"
          >
            無料プランを継続
          </Button>
          <Button
            variant="gradient"
            onClick={onUpgrade}
            className="flex-1 order-1 sm:order-2"
          >
            <Crown className="w-4 h-4 mr-2" />
            Plusにアップグレード
          </Button>
        </div>

        <div className="mt-3 sm:mt-4 text-center">
          <p className="text-xs text-gray-500">
            💳 月額 $20 • いつでもキャンセル可能 • 7日間無料トライアル
          </p>
        </div>
      </div>
    </div>
  );
}