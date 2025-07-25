'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Save, RefreshCw, Eye, Globe, Copy, ExternalLink, FileText } from 'lucide-react';
import { UpgradeBanner } from '@/components/dashboard/UpgradeBanner';
import { useProfile } from '@/hooks/useProfile';

interface GeneratePreviewProps {
  html: string;
  loading: boolean;
  onSave: () => void;
  onRegenerate: () => void;
  projectId?: string;
  isPublished?: boolean;
  onPublish?: () => void;
  showGenerationLimitBanner?: boolean;
}

export function GeneratePreview({ html, loading, onSave, onRegenerate, projectId, isPublished = false, onPublish, showGenerationLimitBanner = false }: GeneratePreviewProps) {
  const [copySuccess, setCopySuccess] = useState('');
  const [showBanner, setShowBanner] = useState(showGenerationLimitBanner);
  const { profile } = useProfile();
  
  const publicUrl = projectId ? `${window.location.origin}/p/${projectId}` : '';
  
  useEffect(() => {
    if (showGenerationLimitBanner) {
      setShowBanner(true);
    }
  }, [showGenerationLimitBanner]);
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      setCopySuccess('Failed to copy!');
      setTimeout(() => setCopySuccess(''), 2000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {profile && showBanner && profile.plan_type === 'free' && (
        <UpgradeBanner 
          planType={profile.plan_type}
          reason="generation_limit"
          onDismiss={() => setShowBanner(false)}
        />
      )}
      
      <div className="mb-6 space-y-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Preview Your Landing Page</h1>
          <p className="text-sm md:text-base text-gray-600 mt-2">
            Review your generated landing page and save it when you're satisfied
          </p>
          {projectId && (
            <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                  isPublished
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {isPublished ? (
                  <Globe className="w-4 h-4 mr-1.5" />
                ) : (
                  <FileText className="w-4 h-4 mr-1.5" />
                )}
                {isPublished ? 'Published' : 'Draft'}
              </span>
              {isPublished && publicUrl && (
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-lg min-w-0 flex-1 sm:flex-initial overflow-hidden">
                  <span className="text-sm text-gray-600 truncate flex-1">
                    {publicUrl}
                  </span>
                  <button
                    onClick={copyToClipboard}
                    className="text-gray-500 hover:text-gray-700 transition-colors flex-shrink-0"
                    title="Copy URL"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <a
                    href={publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-700 transition-colors flex-shrink-0"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  {copySuccess && (
                    <span className="text-xs text-green-600 ml-2 flex-shrink-0">{copySuccess}</span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button
            variant="outline"
            onClick={onRegenerate}
            loading={loading}
            disabled={loading}
            className="w-full sm:w-auto sm:flex-1 lg:flex-initial"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Regenerate
          </Button>

          <Button
            variant="gradient"
            onClick={onSave}
            disabled={loading || !html}
            className="w-full sm:w-auto sm:flex-1 lg:flex-initial"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Project
          </Button>

          {projectId && !isPublished && onPublish && (
            <Button
              variant="gradient"
              onClick={onPublish}
              disabled={loading}
              className="w-full sm:w-auto sm:flex-1 lg:flex-initial"
            >
              <Globe className="w-4 h-4 mr-2" />
              Publish
            </Button>
          )}
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
            <iframe
              srcDoc={html}
              className="w-full h-full border-0"
              title="Landing Page Preview"
              sandbox="allow-scripts allow-same-origin"
            />
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