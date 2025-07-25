import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { LP_PURPOSES, PurposeType } from '@/lib/constants/purposes';

interface PurposeSelectorProps {
  value: PurposeType;
  onChange: (value: PurposeType) => void;
  language: 'ja' | 'en';
}

export function PurposeSelector({ value, onChange, language }: PurposeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const purposes = Object.values(LP_PURPOSES);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedPurpose = LP_PURPOSES[value];

  return (
    <div ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {language === 'ja' ? 'LPの目的' : 'LP Purpose'}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-full cursor-pointer rounded-lg bg-white py-3 pl-4 pr-10 text-left shadow-md 
                     border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     hover:border-gray-400 transition-colors"
        >
          <span className="block truncate font-medium">
            {selectedPurpose.label[language]}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronDown
              className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </span>
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg border border-gray-200">
            {purposes.map((purpose) => (
              <button
                key={purpose.id}
                type="button"
                onClick={() => {
                  onChange(purpose.id as PurposeType);
                  setIsOpen(false);
                }}
                className={`relative w-full cursor-pointer select-none py-3 pl-4 pr-4 text-left
                  ${
                    value === purpose.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-900 hover:bg-gray-50'
                  }
                  transition-colors`}
              >
                <span className="block font-medium">{purpose.label[language]}</span>
                <span className="block text-sm text-gray-500 mt-1">
                  {purpose.description[language]}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}