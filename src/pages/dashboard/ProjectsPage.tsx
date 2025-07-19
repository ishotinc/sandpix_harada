'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { Plus, Eye, Edit, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/ToastProvider';
import { Project } from '../../types/project';
import { Link } from 'react-router-dom';
import { apiEndpoints, getAuthHeaders } from '../../lib/api/client';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(apiEndpoints.projects, {
        headers,
      });
      const data = await response.json();
      
      if (response.ok) {
        setProjects(data.projects);
      } else {
        showToast('error', data.error || 'Failed to fetch projects');
      }
    } catch (error) {
      showToast('error', 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${apiEndpoints.projects}/${projectId}`, {
        method: 'DELETE',
        headers,
      });

      if (response.ok) {
        setProjects(projects.filter(p => p.id !== projectId));
        showToast('success', 'Project deleted successfully');
      } else {
        const data = await response.json();
        showToast('error', data.error || 'Failed to delete project');
      }
    } catch (error) {
      showToast('error', 'Failed to delete project');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
            <p className="text-gray-600 mt-2">
              Manage your landing pages and create new ones
            </p>
          </div>
          <Link to="/projects/generate">
            <Button variant="gradient" size="lg">
              <Plus className="w-5 h-5 mr-2" />
              New Generate
            </Button>
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="w-5 h-5 mr-2" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No projects yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first landing page to get started
            </p>
            <Link to="/projects/generate">
              <Button variant="gradient">
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Project
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {project.service_name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {project.is_published ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Draft
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {project.service_description || 'No description'}
                  </p>

                  <div className="text-xs text-gray-500 mb-4">
                    Created: {new Date(project.created_at).toLocaleDateString()}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Link to={`/projects/${project.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    
                    <Link to={`/p/${project.id}`} target="_blank">
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        {project.is_published ? 'View' : 'Preview'}
                      </Button>
                    </Link>

                    <button
                      onClick={() => handleDelete(project.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}