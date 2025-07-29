"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../components/dashboard/DashboardLayout";
import { Plus, Eye, Edit, Trash2, ExternalLink } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { useToast } from "../../components/ui/ToastProvider";
import { Project } from "../../types/project";
import { Link } from "react-router-dom";
import { apiEndpoints, getAuthHeaders } from "../../lib/api/client";
import { useProfile } from "../../hooks/useProfile";
import { UpgradeBanner } from "../../components/dashboard/UpgradeBanner";
import { UniversalLoading } from "../../components/ui/UniversalLoading";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBanner, setShowBanner] = useState(true);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { profile, isLoading: profileLoading, refetch: refetchProfile } = useProfile();

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
        showToast("error", data.error || "Failed to fetch projects");
      }
    } catch (error) {
      showToast("error", "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${apiEndpoints.projects}/${projectId}`, {
        method: "DELETE",
        headers,
      });

      if (response.ok) {
        setProjects(projects.filter((p) => p.id !== projectId));
        showToast("success", "Project deleted successfully");
        // Refresh profile to update project count
        refetchProfile();
      } else {
        const data = await response.json();
        showToast("error", data.error || "Failed to delete project");
      }
    } catch (error) {
      showToast("error", "Failed to delete project");
    }
  };


  if (loading || profileLoading) {
    return (
      <UniversalLoading 
        minimal={true}
      />
    );
  }


  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {profile && showBanner && (
          <UpgradeBanner 
            projectCount={projects.length} 
            planType={profile.plan_type}
            onDismiss={() => setShowBanner(false)}
          />
        )}
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Projects</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
              Manage your landing pages and create new ones
            </p>
          </div>
          <Link to="/projects/generate" className="w-full sm:w-auto">
            <Button variant="gradient" size="lg" className="w-full sm:w-auto">
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="text-sm sm:text-base">New Generate</span>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 sm:mb-4 space-y-2 sm:space-y-0">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate pr-2">
                      {project.service_name}
                    </h3>
                    <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
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

                  <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                    {project.service_description || "No description"}
                  </p>

                  <div className="text-xs text-gray-500 mb-3 sm:mb-4">
                    Created: {new Date(project.created_at).toLocaleDateString()}
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <Link to={`/projects/${project.id}`} className="flex-1 sm:flex-initial">
                      <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Edit
                      </Button>
                    </Link>

                    <Link to={`/p/${project.id}`} target="_blank" className="flex-1 sm:flex-initial">
                      <Button variant="ghost" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
                        <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        {project.is_published ? "View" : "Preview"}
                      </Button>
                    </Link>

                    <button
                      onClick={() => handleDelete(project.id)}
                      className="self-center sm:self-auto p-2 text-gray-400 hover:text-red-600 transition-colors"
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
