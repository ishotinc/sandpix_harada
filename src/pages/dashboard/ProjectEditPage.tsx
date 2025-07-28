'use client';

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/ToastProvider';
import { Project } from '../../types/project';
import { Save, RefreshCw, Eye, Code, ExternalLink, Globe, ArrowLeft, Copy, Check } from 'lucide-react';
import { apiEndpoints, getAuthHeaders } from '../../lib/api/client';
import { BillingModal } from '../../components/ui/BillingModal';

export default function ProjectEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);
  const [showBillingModal, setShowBillingModal] = useState(false);
  
  const [formData, setFormData] = useState({
    service_name: '',
    purpose: 'service' as 'product' | 'brand' | 'service' | 'lead' | 'event',
    language: 'en' as 'en' | 'ja',
    service_description: '',
    redirect_url: '',
    cta_text: 'Get Started',
    main_copy: '',
    service_achievements: '',
    custom_head: '',
    custom_body: '',
    is_published: false,
    is_public: true,
  });

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${apiEndpoints.projects}/${id}`, {
        headers,
      });
      const data = await response.json();
      
      if (response.ok) {
        setProject(data.project);
        setFormData({
          service_name: data.project.service_name || '',
          purpose: data.project.purpose || 'service',
          language: data.project.language || 'en',
          service_description: data.project.service_description || '',
          redirect_url: data.project.redirect_url || '',
          cta_text: data.project.cta_text || 'Get Started',
          main_copy: data.project.main_copy || '',
          service_achievements: data.project.service_achievements || '',
          custom_head: data.project.custom_head || '',
          custom_body: data.project.custom_body || '',
          is_published: data.project.is_published || false,
          is_public: data.project.is_public !== false,
        });
      } else {
        showToast('error', data.error || 'Failed to fetch project');
        navigate('/projects');
      }
    } catch (error) {
      showToast('error', 'Failed to fetch project');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${apiEndpoints.projects}/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        setProject(data.project);
        showToast('success', 'Project saved successfully!');
      } else {
        showToast('error', data.error || 'Failed to save project');
      }
    } catch (error) {
      showToast('error', 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerate = async () => {
    // Save current changes before regenerating to ensure language/purpose are updated
    setSaving(true);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${apiEndpoints.projects}/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showToast('success', 'Changes saved. Redirecting to regenerate...');
        // Navigate to generate page with project ID for regeneration
        navigate(`/projects/generate/${id}`);
      } else {
        const data = await response.json();
        showToast('error', data.error || 'Failed to save changes before regenerating');
      }
    } catch (error) {
      showToast('error', 'Failed to save changes before regenerating');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    if (field === 'is_published' && value === true) {
      // Show billing modal when trying to publish
      setShowBillingModal(true);
      return;
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePublishWithLogo = async () => {
    setFormData(prev => ({ ...prev, is_published: true }));
    setShowBillingModal(false);
    await handleSave();
  };

  const handleUpgradeClick = () => {
    setShowBillingModal(false);
    navigate('/pricing');
  };

  const copyPublicUrl = async () => {
    console.log('copyPublicUrl called');
    console.log('project?.is_published:', project?.is_published);
    console.log('formData.is_published:', formData.is_published);
    
    if (!project?.is_published && !formData.is_published) {
      console.log('Project not published, showing error');
      showToast('error', 'Project must be published to copy URL');
      return;
    }

    try {
      const url = `${window.location.origin}/p/${project.id}`;
      console.log('Attempting to copy URL:', url);
      console.log('navigator.clipboard available:', !!navigator.clipboard);
      console.log('isSecureContext:', window.isSecureContext);
      
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        console.log('URL copied using navigator.clipboard');
      } else {
        // Fallback for insecure contexts or older browsers
        console.log('Using fallback copy method');
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        console.log('Fallback copy success:', success);
        if (!success) {
          throw new Error('Fallback copy failed');
        }
      }
      
      console.log('Setting copied to true');
      setCopied(true);
      showToast('success', 'URL copied to clipboard!');
      setTimeout(() => {
        console.log('Setting copied to false');
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
      showToast('error', 'Failed to copy URL to clipboard');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Project not found</h2>
        <Button onClick={() => navigate('/projects')}>
          Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{project.service_name}</h1>
              <p className="text-gray-600 mt-2">Edit your landing page project</p>
            </div>
          
            <div className="flex items-center space-x-4">
              {/* Publish Toggle */}
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700">Publish</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => handleChange('is_published', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Copy and External Link Icons (only when published) */}
              {(formData.is_published || project?.is_published) && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      copyPublicUrl();
                    }}
                    className="text-gray-600 hover:text-black transition-colors"
                    title="Copy URL to clipboard"
                  >
                    {copied ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                  <a
                    href={`/p/${project.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-black transition-colors"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              )}
            
              <Button
                variant="outline"
                onClick={handleRegenerate}
                loading={saving}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>

              <Button
                variant="gradient"
                onClick={handleSave}
                loading={saving}
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                <Input
                  label="Service Name"
                  value={formData.service_name}
                  onChange={(e) => handleChange('service_name', e.target.value)}
                  placeholder="Your service or product name"
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <select
                      value={formData.language}
                      onChange={(e) => handleChange('language', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="en">English</option>
                      <option value="ja">日本語</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Purpose
                    </label>
                    <select
                      value={formData.purpose}
                      onChange={(e) => handleChange('purpose', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="product">Product</option>
                      <option value="brand">Brand</option>
                      <option value="service">Service</option>
                      <option value="lead">Lead</option>
                      <option value="event">Event</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Description
                  </label>
                  <textarea
                    value={formData.service_description}
                    onChange={(e) => handleChange('service_description', e.target.value)}
                    placeholder="Describe what your service/product does..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <Input
                  label="CTA Button Text"
                  value={formData.cta_text}
                  onChange={(e) => handleChange('cta_text', e.target.value)}
                  placeholder="e.g., Get Started, Learn More"
                />

                <Input
                  label="Redirect URL"
                  value={formData.redirect_url}
                  onChange={(e) => handleChange('redirect_url', e.target.value)}
                  placeholder="https://your-website.com"
                />
              </div>
            </div>

          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-0">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
              
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
            </div>

            <div className="h-[600px] mb-0">
              {viewMode === 'preview' ? (
                project.generated_html ? (
                  <iframe
                    srcDoc={project.generated_html}
                    className="w-full h-full border-0"
                    title="Landing Page Preview"
                    sandbox="allow-scripts allow-same-origin"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No preview available</p>
                      <p className="text-sm text-gray-500 mt-2">Generate your landing page to see preview</p>
                    </div>
                  </div>
                )
              ) : (
                <div className="h-full overflow-auto">
                  <pre className="p-4 text-sm bg-gray-50 h-full overflow-auto">
                    <code>{project.generated_html || 'No code available'}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>

        <BillingModal
          isOpen={showBillingModal}
          onClose={() => setShowBillingModal(false)}
          onConfirm={handlePublishWithLogo}
          onUpgrade={handleUpgradeClick}
        />
      </div>
    </DashboardLayout>
  );
}