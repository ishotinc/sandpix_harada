"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/ToastProvider";

interface ProjectFormData {
  service_name: string;
  service_description: string;
  redirect_url: string;
  main_copy: string;
  cta_text: string;
  service_achievements: string;
  language?: "en" | "ja";
  purpose?: "product" | "brand" | "service" | "lead" | "event";
}

interface BasicInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => void;
  initialData?: Partial<ProjectFormData>;
}

export function BasicInfoModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: BasicInfoModalProps) {
  const [formData, setFormData] = useState({
    service_name: initialData?.service_name || "",
    service_description: initialData?.service_description || "",
    redirect_url: initialData?.redirect_url || "",
    cta_text: initialData?.cta_text || "Get Started",
    language: (initialData?.language || "en") as "en" | "ja",
    purpose: (initialData?.purpose || "product") as
      | "product"
      | "brand"
      | "service"
      | "lead"
      | "event",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { showToast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.service_name.trim()) {
      newErrors.service_name = "Service name is required";
    }

    if (!formData.service_description.trim()) {
      newErrors.service_description = "Service description is required";
    }

    if (formData.redirect_url && !formData.redirect_url.startsWith("http")) {
      newErrors.redirect_url =
        "Please enter a valid URL starting with http:// or https://";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast("error", "Please fix the errors and try again");
      return;
    }

    onSubmit(formData);
  };

  const handleChange = (field: string, value: string) => {
    // Debug: Log language changes
    if (field === "language") {
      console.log("🌐 Language selected:", value);
      console.log("🔍 Previous language:", formData.language);
      console.log("📋 Current form data:", formData);
      console.log("⏰ Timestamp:", new Date().toLocaleTimeString());
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Project Information"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language *
            </label>
            <select
              value={formData.language}
              onChange={(e) => handleChange("language", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="en">English</option>
              <option value="ja">日本語</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Purpose *
            </label>
            <select
              value={formData.purpose}
              onChange={(e) => handleChange("purpose", e.target.value)}
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
            Service/Product Name *
          </label>
          <Input
            value={formData.service_name}
            onChange={(e) => handleChange("service_name", e.target.value)}
            placeholder="e.g., AI Writing Assistant"
            error={errors.service_name}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service Description *
          </label>
          <textarea
            value={formData.service_description}
            onChange={(e) =>
              handleChange("service_description", e.target.value)
            }
            placeholder="Describe what your service/product does and its key benefits..."
            rows={4}
            className={`
              w-full px-3 py-2 border rounded-lg resize-none
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              ${
                errors.service_description
                  ? "border-red-500"
                  : "border-gray-300"
              }
            `}
          />
          {errors.service_description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.service_description}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Call-to-Action Button Text
          </label>
          <Input
            value={formData.cta_text}
            onChange={(e) => handleChange("cta_text", e.target.value)}
            placeholder="e.g., Get Started, Learn More, Sign Up"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Redirect URL (Optional)
          </label>
          <Input
            value={formData.redirect_url}
            onChange={(e) => handleChange("redirect_url", e.target.value)}
            placeholder="https://your-website.com"
            error={errors.redirect_url}
          />
          <p className="mt-1 text-sm text-gray-500">
            Where should the CTA button redirect users?
          </p>
        </div>

        <div className="flex items-center justify-end space-x-4 pt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="gradient">
            Generate Landing Page
          </Button>
        </div>
      </form>
    </Modal>
  );
}
