import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Providers } from "./components/providers/Providers";

// Landing Page Components
import { Header } from "./components/landing/Header";
import { Hero } from "./components/landing/Hero";
import { Features } from "./components/landing/Features";
import { HowItWorks } from "./components/landing/HowItWorks";
import { CTA } from "./components/landing/CTA";
import { Footer } from "./components/landing/Footer";

// Auth Components
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";

// Dashboard Components
import ProjectsPage from "./pages/dashboard/ProjectsPage";
import GeneratePage from "./pages/dashboard/GeneratePage";
import ProfilePage from "./pages/dashboard/ProfilePage";
import ProjectEditPage from "./pages/dashboard/ProjectEditPage";
import BillingPage from "./pages/dashboard/BillingPage";

// Public Page
import PublicPage from "./pages/PublicPage";

// Stripe Pages
import PricingPage from "./pages/PricingPage";
import SuccessPage from "./pages/SuccessPage";

// Landing Page Component
function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Providers>
      <Router>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth Routes */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Dashboard Routes */}
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/generate" element={<GeneratePage />} />
          <Route path="/projects/generate/:id" element={<GeneratePage />} />
          <Route path="/projects/:id" element={<ProjectEditPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/billing" element={<BillingPage />} />

          {/* Public Page */}
          <Route path="/p/:id" element={<PublicPage />} />

          {/* Stripe Pages */}
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/success" element={<SuccessPage />} />

          {/* Redirect unknown routes to landing page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </Providers>
  );
}

export default App;
