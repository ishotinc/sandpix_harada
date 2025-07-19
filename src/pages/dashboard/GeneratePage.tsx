'use client';

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { SwipeContainer } from '../../components/swipe/SwipeContainer';
import { BasicInfoModal } from '../../components/swipe/BasicInfoModal';
import { GeneratePreview } from '../../components/generate/GeneratePreview';
import { SwipeImage, SwipeScores } from '../../types/project';
import { calculateSwipeScores } from '../../utils/scoring';
import { useToast } from '../../components/ui/ToastProvider';
import { apiEndpoints, getAuthHeaders } from '../../lib/api/client';
import { Project } from '../../types/project';

interface SwipeResult {
  image: SwipeImage;
  liked: boolean;
}

export default function GeneratePage() {
  const [swipeConfig, setSwipeConfig] = useState<{ images: SwipeImage[] } | null>(null);
  const [currentStep, setCurrentStep] = useState<'swipe' | 'info' | 'preview'>('swipe');
  const [swipeResults, setSwipeResults] = useState<SwipeResult[]>([]);
  const [projectData, setProjectData] = useState<any>(null);
  const [generatedHtml, setGeneratedHtml] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { id: regenerateId } = useParams<{ id: string }>();

  useEffect(() => {
    loadSwipeConfig();
    if (regenerateId) {
      // Load project for regeneration
      loadProjectForRegeneration();
    } else {
      checkForDraft();
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
        // Find the most recent draft
        const draft = data.projects
          .filter((p: Project) => !p.is_published)
          .sort((a: Project, b: Project) => 
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          )[0];
        
        if (draft && draft.generated_html) {
          const shouldLoad = confirm('You have an unsaved draft. Would you like to continue editing it?');
          if (shouldLoad) {
            setProjectId(draft.id);
            setProjectData({
              service_name: draft.service_name,
              purpose: draft.purpose,
              service_description: draft.service_description,
              redirect_url: draft.redirect_url,
              main_copy: draft.main_copy,
              cta_text: draft.cta_text,
              service_achievements: draft.service_achievements,
              custom_head: draft.custom_head,
              custom_body: draft.custom_body,
            });
            setGeneratedHtml(draft.generated_html);
            setCurrentStep('preview');
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

  const handleInfoSubmit = async (data: any) => {
    setProjectData(data);
    setCurrentStep('preview');
    await generateLandingPage(data);
  };

  const generateLandingPage = async (data: any) => {
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
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/projects-generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectData: data,
          swipeScores,
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        setGeneratedHtml(result.html);
        showToast('success', 'Landing page generated successfully!');
        
        // Auto-save the generated landing page
        await autoSaveProject(data, result.html);
      } else {
        showToast('error', result.error || 'Failed to generate landing page');
      }
    } catch (error) {
      showToast('error', 'Failed to generate landing page');
    } finally {
      setLoading(false);
    }
  };

  const autoSaveProject = async (data: any, html: string) => {
    try {
      const headers = await getAuthHeaders();
      const projectPayload = {
        ...data,
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

    try {
      const headers = await getAuthHeaders();
      const projectPayload = {
        ...projectData,
        generated_html: generatedHtml,
        is_published: true, // Mark as published when manually saved
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
          navigate(`/projects/${projectId}`);
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
          navigate(`/projects/${result.project.id}`);
        } else if (result.requiresUpgrade) {
          showToast('error', 'Project limit reached. Please upgrade to save more projects.');
        } else {
          showToast('error', result.error || 'Failed to save project');
        }
      }
    } catch (error) {
      showToast('error', 'Failed to save project');
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

        {currentStep === 'preview' && (
          <GeneratePreview
            html={generatedHtml}
            loading={loading}
            onSave={handleSaveProject}
            onRegenerate={() => generateLandingPage(projectData)}
          />
        )}
      </div>
    </DashboardLayout>
  );
}