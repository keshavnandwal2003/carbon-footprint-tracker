import React, { useState, useEffect } from "react";
import { useAuthStore } from "./store/authStore.js";
import { PageLoader } from "./components/UtilityComponents.jsx";
import { LandingPage } from "./pages/LandingPage.jsx";
import { AuthPage } from "./pages/AuthPage.jsx";
import { DashboardPage } from "./pages/DashboardPage.jsx";

// --- 4e. The Main App Component (Router) ---
export default function App() {
  const [page, setPage] = useState("landing"); // 'landing', 'login', 'register'

  // FIX: Select state values individually to prevent infinite loop
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleNavigate = (targetPage) => {
    setPage(targetPage);
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    switch (page) {
      case "login":
        return <AuthPage mode="login" onNavigate={handleNavigate} />;
      case "register":
        return <AuthPage mode="register" onNavigate={handleNavigate} />;
      case "landing":
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  }

  // User is authenticated
  return <DashboardPage />;
}
