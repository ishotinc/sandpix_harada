'use client';

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { SwipeContainer } from '../../components/swipe/SwipeContainer';
import { BasicInfoModal } from '../../components/swipe/BasicInfoModal';
import { GeneratePreview } from '../../components/generate/GeneratePreview';
import { GenerationProgress } from '../../components/ui/GenerationProgress';
import { PageTransitionLoading } from '../../components/ui/PageTransitionLoading';
import { UsageCounter } from '../../components/dashboard/UsageCounter';
import { SwipeImage, SwipeScores } from '../../types/project';
import { calculateSwipeScores } from '../../utils/scoring';
import { useToast } from '../../components/ui/ToastProvider';
import { apiEndpoints, getAuthHeaders } from '../../lib/api/client';
import { Project } from '../../types/project';
import { PurposeType } from '../../lib/constants/purposes';
import { ProjectGenerationData, SwipeResult } from '../../types/generation';
import { ArrowLeft } from 'lucide-react';

export default function GeneratePage() {
  const [swipeConfig, setSwipeConfig] = useState<{ images: SwipeImage[] } | null>(null);
  const [currentStep, setCurrentStep] = useState<'swipe' | 'info' | 'preview'>('swipe');
  const [swipeResults, setSwipeResults] = useState<SwipeResult[]>([]);
  const [projectData, setProjectData] = useState<ProjectGenerationData | null>(null);
  const [generatedHtml, setGeneratedHtml] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [language, setLanguage] = useState<'ja' | 'en'>('en');
  const [purpose, setPurpose] = useState<PurposeType>('product');
  const [usageRefreshTrigger, setUsageRefreshTrigger] = useState(0);
  const [hitGenerationLimit, setHitGenerationLimit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { id: regenerateId } = useParams<{ id: string }>();

  useEffect(() => {
    loadSwipeConfig();
    if (regenerateId) {
      // Load project for regeneration
      loadProjectForRegeneration();
    } else {
      // Check if draft checking is disabled
      const draftCheckDisabled = localStorage.getItem('disableDraftCheck') === 'true';
      if (!draftCheckDisabled) {
        checkForDraft();
      }
    }
  }, [regenerateId]);

  const loadProjectForRegeneration = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${apiEndpoints.projects}/${regenerateId}`, {
        headers,
      });
      const data = await response.json();
      
      if (response.ok && data.project) {
        setProjectId(data.project.id);
        setProjectData({
          service_name: data.project.service_name,
          purpose: data.project.purpose,
          service_description: data.project.service_description,
          redirect_url: data.project.redirect_url,
          main_copy: data.project.main_copy,
          cta_text: data.project.cta_text,
          service_achievements: data.project.service_achievements,
          custom_head: data.project.custom_head,
          custom_body: data.project.custom_body,
        });
        // Set language and purpose from saved project
        if (data.project.language) {
          setLanguage(data.project.language);
        }
        if (data.project.purpose) {
          setPurpose(data.project.purpose);
        }
        setIsPublished(data.project.is_published);
        setIsRegenerating(true);
        // Skip to swipe step for regeneration
        setCurrentStep('swipe');
      } else {
        showToast('error', 'Failed to load project for regeneration');
        navigate('/projects');
      }
    } catch (error) {
      showToast('error', 'Failed to load project');
      navigate('/projects');
    }
  };

  const checkForDraft = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(apiEndpoints.projects, {
        headers,
      });
      const data = await response.json();
      
      if (response.ok && data.projects) {
        // Find the most recent draft that was updated in the last 30 minutes
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        const recentDraft = data.projects
          .filter((p: Project) => 
            !p.is_published && 
            p.generated_html && 
            new Date(p.updated_at) > thirtyMinutesAgo
          )
          .sort((a: Project, b: Project) => 
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          )[0];
        
        if (recentDraft) {
          // Check if we've already asked about this draft in this session
          const askedDrafts = sessionStorage.getItem('askedDrafts');
          const askedDraftIds = askedDrafts ? JSON.parse(askedDrafts) : [];
          
          if (!askedDraftIds.includes(recentDraft.id)) {
            const shouldLoad = confirm('You have an unsaved draft. Would you like to continue editing it?');
            
            // Remember that we asked about this draft
            askedDraftIds.push(recentDraft.id);
            sessionStorage.setItem('askedDrafts', JSON.stringify(askedDraftIds));
            
            if (shouldLoad) {
              setProjectId(recentDraft.id);
              setProjectData({
                service_name: recentDraft.service_name,
                purpose: recentDraft.purpose,
                service_description: recentDraft.service_description,
                redirect_url: recentDraft.redirect_url,
                main_copy: recentDraft.main_copy,
                cta_text: recentDraft.cta_text,
                service_achievements: recentDraft.service_achievements,
                custom_head: recentDraft.custom_head,
                custom_body: recentDraft.custom_body,
              });
              setGeneratedHtml(recentDraft.generated_html);
              setIsPublished(recentDraft.is_published);
              setCurrentStep('preview');
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to check for draft:', error);
    }
  };

  const loadSwipeConfig = async () => {
    try {
      const response = await fetch('/swipe-config.json');
      const config = await response.json();
      setSwipeConfig(config);
    } catch (error) {
      showToast('error', 'Failed to load swipe configuration');
    }
  };

  const handleSwipeComplete = (results: SwipeResult[]) => {
    setSwipeResults(results);
    if (isRegenerating && projectData) {
      // Skip info modal for regeneration, go straight to generation
      setCurrentStep('preview');
      generateLandingPage(projectData);
    } else {
      setCurrentStep('info');
    }
  };

  const handleInfoSubmit = async (data: ProjectGenerationData & { language: 'ja' | 'en'; purpose: PurposeType }) => {
    // Extract language and purpose from data
    const { language: formLanguage, purpose: formPurpose, ...projectInfo } = data;
    const finalLanguage = formLanguage || 'en';
    const finalPurpose = formPurpose || 'product';
    
    setLanguage(finalLanguage);
    setPurpose(finalPurpose);
    
    const projectDataWithPurpose: ProjectGenerationData = { 
      ...projectInfo, 
      purpose: finalPurpose,
      language: finalLanguage
    };
    setProjectData(projectDataWithPurpose);
    setCurrentStep('preview');
    await generateLandingPage(projectDataWithPurpose, finalLanguage, finalPurpose);
  };

  const generateLandingPage = async (data: ProjectGenerationData, overrideLanguage?: 'ja' | 'en', overridePurpose?: PurposeType) => {
    setLoading(true);
    try {
      const swipeScores = calculateSwipeScores(swipeResults);
      
      const { supabase } = await import('@/lib/supabase/client');
      if (!supabase) {
        showToast('error', 'Authentication service not available');
        return;
      }
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        showToast('error', 'Please sign in to generate landing pages');
        return;
      }
      
      const finalLanguage = overrideLanguage || language;
      const finalPurpose = overridePurpose || purpose;
      
      console.log('Sending request to generate landing page:', {
        projectData: data,
        swipeScores,
        language: finalLanguage,
        purpose: finalPurpose
      });
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/projects-generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectData: data,
          swipeScores,
          language: finalLanguage,
          purpose: finalPurpose,
        }),
      });

      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Response data:', result);
      
      if (response.ok) {
        setGeneratedHtml(result.html);
        showToast('success', 'Landing page generated successfully!');
        
        // Show usage info if available
        if (result.usage) {
          showToast('info', `${result.usage.remaining} generations remaining today`);
          // Check if user just hit their limit
          if (result.usage.remaining === 0) {
            setHitGenerationLimit(true);
          }
        }
        
        // Refresh usage counter
        setUsageRefreshTrigger(prev => prev + 1);
        
        // Auto-save the generated landing page
        await autoSaveProject(data, result.html, finalLanguage);
      } else if (response.status === 429 || response.status === 403) {
        // Handle rate limit error (429) or forbidden due to limit (403)
        showToast('error', result.message || 'Daily generation limit reached');
        setHitGenerationLimit(true);
        if (result.usage) {
          showToast('info', `Resets in ${result.usage.resetsIn}`);
        }
      } else {
        showToast('error', result.error || 'Failed to generate landing page');
      }
    } catch (error) {
      showToast('error', 'Failed to generate landing page');
    } finally {
      setLoading(false);
    }
  };

  const autoSaveProject = async (data: ProjectGenerationData, html: string, saveLanguage?: 'ja' | 'en') => {
    try {
      const headers = await getAuthHeaders();
      const projectPayload = {
        ...data,
        language: saveLanguage || language,
        generated_html: html,
        is_published: false, // Auto-saved as draft
      };

      if (projectId) {
        // Update existing project
        const response = await fetch(`${apiEndpoints.projects}/${projectId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(projectPayload),
        });

        if (response.ok) {
          showToast('info', 'Draft auto-saved');
        }
      } else {
        // Create new project
        const response = await fetch(apiEndpoints.projects, {
          method: 'POST',
          headers,
          body: JSON.stringify(projectPayload),
        });

        const result = await response.json();
        
        if (response.ok) {
          setProjectId(result.project.id);
          setIsPublished(false); // New projects are always drafts
          showToast('info', 'Draft created and auto-saved');
        } else if (result.requiresUpgrade) {
          showToast('warning', 'Project limit reached. Your landing page is generated but not saved.');
        }
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  const handleSaveProject = async () => {
    if (!projectData || !generatedHtml) return;

    setSaving(true);
    try {
      const headers = await getAuthHeaders();
      const projectPayload = {
        ...projectData,
        language,
        generated_html: generatedHtml,
        is_published: false, // Keep as draft when saving
      };

      if (projectId) {
        // Update existing project
        const response = await fetch(`${apiEndpoints.projects}/${projectId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(projectPayload),
        });

        if (response.ok) {
          showToast('success', 'Project saved successfully!');
          setIsTransitioning(true);
          // Small delay to show the transition loading
          setTimeout(() => {
            navigate(`/projects/${projectId}`);
          }, 500);
        } else {
          showToast('error', 'Failed to save project');
        }
      } else {
        // Create new project if auto-save failed
        const response = await fetch(apiEndpoints.projects, {
          method: 'POST',
          headers,
          body: JSON.stringify(projectPayload),
        });

        const result = await response.json();
        
        if (response.ok) {
          showToast('success', 'Project saved successfully!');
          setIsTransitioning(true);
          // Small delay to show the transition loading
          setTimeout(() => {
            navigate(`/projects/${result.project.id}`);
          }, 500);
        } else if (result.requiresUpgrade) {
          showToast('error', 'Project limit reached. Please upgrade to save more projects.');
        } else {
          showToast('error', result.error || 'Failed to save project');
        }
      }
    } catch (error) {
      showToast('error', 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const handlePublishProject = async () => {
    if (!projectId) {
      showToast('error', 'Please save the project first before publishing');
      return;
    }

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${apiEndpoints.projects}/${projectId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          is_published: true,
          is_public: true,
        }),
      });

      if (response.ok) {
        setIsPublished(true);
        showToast('success', 'Project published successfully! Your landing page is now publicly accessible.');
      } else {
        showToast('error', 'Failed to publish project');
      }
    } catch (error) {
      showToast('error', 'Failed to publish project');
    }
  };

  if (!swipeConfig) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <div className="mb-4">
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </button>
        </div>
        
        {/* Show usage counter at the top */}
        <div className="mb-6">
          <UsageCounter refreshTrigger={usageRefreshTrigger} />
        </div>
        
        {currentStep === 'swipe' && (
          <SwipeContainer
            images={swipeConfig.images}
            onComplete={handleSwipeComplete}
          />
        )}

        {currentStep === 'info' && (
          <BasicInfoModal
            isOpen={true}
            onClose={() => navigate('/projects')}
            onSubmit={handleInfoSubmit}
            initialData={projectData}
          />
        )}

        {currentStep === 'preview' && !loading && (
          <GeneratePreview
            html={generatedHtml}
            loading={loading}
            onSave={handleSaveProject}
            onRegenerate={() => generateLandingPage(projectData)}
            projectId={projectId || undefined}
            isPublished={isPublished}
            onPublish={handlePublishProject}
            showGenerationLimitBanner={hitGenerationLimit}
            saving={saving}
          />
        )}

        {currentStep === 'preview' && loading && (
          <GenerationProgress
            isGenerating={loading}
            onComplete={() => {
              // Progress complete callback - this will be called after 60 seconds
              // The actual generation might finish earlier via the API response
            }}
            totalDuration={60}
          />
        )}
        
        {/* Page Transition Loading */}
        {isTransitioning && (
          <PageTransitionLoading 
            title="Redirecting to Editor"
            subtitle="Setting up your project editing interface..."
          />
        )}
      </div>
    </DashboardLayout>
  );
}