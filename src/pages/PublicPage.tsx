'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UniversalLoading } from '@/components/ui/UniversalLoading';

export default function PublicPage() {
  const { id } = useParams<{ id: string }>();
  const [html, setHtml] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      const { supabase } = await import('@/lib/supabase/client');
      if (!supabase) {
        setError('Service not available');
        return;
      }
      
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('generated_html, is_published, is_public')
        .eq('id', id)
        .single();
      
      if (projectError || !project) {
        setError('Page not found');
      } else if (!project.is_public && !project.is_published) {
        setError('This page is not publicly available');
      } else if (project.generated_html) {
        setHtml(project.generated_html);
      } else {
        setError('Page content not available');
      }
    } catch (error) {
      setError('Failed to load page');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <UniversalLoading 
        minimal={true}
      />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}