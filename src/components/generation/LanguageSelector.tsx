import React from 'react';

interface LanguageSelectorProps {
  value: 'ja' | 'en';
  onChange: (value: 'ja' | 'en') => void;
}

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  const languages = [
    { id: 'en' as const, label: 'English', flag: '🇺🇸' },
    { id: 'ja' as const, label: '日本語', flag: '🇯🇵' }
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Language / 言語
      </label>
      <div className="grid grid-cols-2 gap-3">
        {languages.map((lang) => (
          <button
            key={lang.id}
            type="button"
            onClick={() => onChange(lang.id)}
            className={`
              relative flex items-center justify-center px-4 py-3 rounded-lg
              font-medium transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              ${
                value === lang.id
                  ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }
            `}
          >
            <span className="text-2xl mr-2">{lang.flag}</span>
            <span>{lang.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}