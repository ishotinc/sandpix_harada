'use client';

import { useState, useEffect } from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/ToastProvider';
import { UniversalLoading } from '../../components/ui/UniversalLoading';
import { Profile } from '../../types/profile';
import { User, Building, Award, Mail, ArrowLeft } from 'lucide-react';
import { apiEndpoints, getAuthHeaders } from '../../lib/api/client';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  usePageTitle({
    title: 'Profile',
    description: 'Manage your account settings, personal information, and preferences.'
  });

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    personal_name: '',
    personal_bio: '',
    achievements: '',
    company_name: '',
    company_achievements: '',
    contact_info: '',
  });
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(apiEndpoints.profile, {
        headers,
      });
      const data = await response.json();
      
      if (response.ok) {
        setProfile(data.profile);
        setFormData({
          personal_name: data.profile.personal_name || '',
          personal_bio: data.profile.personal_bio || '',
          achievements: data.profile.achievements || '',
          company_name: data.profile.company_name || '',
          company_achievements: data.profile.company_achievements || '',
          contact_info: data.profile.contact_info || '',
        });
      } else {
        showToast('error', data.error || 'Failed to fetch profile');
      }
    } catch (error) {
      showToast('error', 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(apiEndpoints.profile, {
        method: 'PUT',
        headers,
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        setProfile(data.profile);
        showToast('success', 'Profile updated successfully!');
      } else {
        showToast('error', data.error || 'Failed to update profile');
      }
    } catch (error) {
      showToast('error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <UniversalLoading 
        minimal={true}
      />
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">
            This information will be used to personalize your landing pages
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <User className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                value={formData.personal_name}
                onChange={(e) => handleChange('personal_name', e.target.value)}
                placeholder="Your full name"
              />
              
              <Input
                label="Contact Information"
                value={formData.contact_info}
                onChange={(e) => handleChange('contact_info', e.target.value)}
                placeholder="Email, phone, or other contact info"
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Personal Bio
              </label>
              <textarea
                value={formData.personal_bio}
                onChange={(e) => handleChange('personal_bio', e.target.value)}
                placeholder="Tell us about yourself, your background, and expertise..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Personal Achievements
              </label>
              <textarea
                value={formData.achievements}
                onChange={(e) => handleChange('achievements', e.target.value)}
                placeholder="Awards, certifications, notable accomplishments..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Company Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Building className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Company Information</h2>
            </div>
            
            <div className="mb-6">
              <Input
                label="Company Name"
                value={formData.company_name}
                onChange={(e) => handleChange('company_name', e.target.value)}
                placeholder="Your company or organization name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Achievements
              </label>
              <textarea
                value={formData.company_achievements}
                onChange={(e) => handleChange('company_achievements', e.target.value)}
                placeholder="Founding year, employee count, client count, awards, milestones..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="gradient"
              loading={saving}
              className="px-8"
            >
              Save
            </Button>
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">How is this information used?</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Personal information appears in "About" sections of your landing pages</li>
            <li>• Company details are used for credibility and trust-building elements</li>
            <li>• Achievements help create social proof and authority</li>
            <li>• All information is optional and can be updated anytime</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}