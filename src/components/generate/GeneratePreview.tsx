'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Save, RefreshCw, Eye, Code } from 'lucide-react';

interface GeneratePreviewProps {
  html: string;
  loading: boolean;
  onSave: () => void;
  onRegenerate: () => void;
}

export function GeneratePreview({ html, loading, onSave, onRegenerate }: GeneratePreviewProps) {
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Preview Your Landing Page</h1>
          <p className="text-gray-600 mt-2">
            Review your generated landing page and save it when you're satisfied
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'preview'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Eye className="w-4 h-4 mr-1 inline" />
              Preview
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'code'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Code className="w-4 h-4 mr-1 inline" />
              Code
            </button>
          </div>

          <Button
            variant="outline"
            onClick={onRegenerate}
            loading={loading}
            disabled={loading}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Regenerate
          </Button>

          <Button
            variant="gradient"
            onClick={onSave}
            disabled={loading || !html}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Project
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Generating your landing page...</p>
              <p className="text-sm text-gray-500 mt-2">This may take up to 30 seconds</p>
            </div>
          </div>
        ) : html ? (
          <div className="h-[800px]">
            {viewMode === 'preview' ? (
              <iframe
                srcDoc={html}
                className="w-full h-full border-0"
                title="Landing Page Preview"
                sandbox="allow-scripts allow-same-origin"
              />
            ) : (
              <div className="h-full overflow-auto">
                <pre className="p-6 text-sm bg-gray-50 h-full overflow-auto">
                  <code>{html}</code>
                </pre>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600">No preview available</p>
              <p className="text-sm text-gray-500 mt-2">Click regenerate to create your landing page</p>
            </div>
          </div>
        )}
      </div>

      {html && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Next Steps:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Review the generated landing page</li>
            <li>• Click "Regenerate" if you want to try a different version</li>
            <li>• Click "Save Project" to save and continue editing</li>
            <li>• After saving, you can publish your landing page</li>
          </ul>
        </div>
      )}
    </div>
  );
}