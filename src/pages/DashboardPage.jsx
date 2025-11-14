import React, { useState } from "react";
import { Leaf, Globe, Sparkles, LogOut, Goal, Calculator } from "lucide-react";
import { useAuthStore } from "../store/authStore.js";
import { Footer } from "../components/UtilityComponents.jsx";
import {
  CalculatorForm,
  ResultDisplay,
  GeneralSuggestions,
  HistoryTracker,
  GoalsPage,
  GlobalExplorerPage,
  AIToolsPage,
} from "../components/DashboardComponents.jsx";

// --- 4g. Main Dashboard Page (HEAVILY UPDATED with Tabs) ---
export function DashboardPage() {
  const [currentCalculation, setCurrentCalculation] = useState(null);
  const [newCalculation, setNewCalculation] = useState(null);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  // --- NEW: State for tab navigation ---
  const [page, setPage] = useState("calculator"); // 'calculator', 'goals', 'explorer', 'aiTools'

  const handleCalculation = (newCalc) => {
    setCurrentCalculation(newCalc);
    setNewCalculation(newCalc); // Trigger history update
  };

  const handleSelectHistory = (historyItem) => {
    setCurrentCalculation(historyItem);
  };

  const NavButton = ({ tabName, icon, label }) => {
    const isActive = page === tabName;
    return (
      <button
        onClick={() => setPage(tabName)}
        className={`flex-1 md:flex-none py-3 px-4 md:px-6 text-sm md:text-base font-medium flex items-center justify-center gap-2 ${
          isActive
            ? "border-b-4 border-green-600 text-green-700 bg-green-50"
            : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
        } transition-all duration-200 rounded-t-lg`}
      >
        {React.createElement(icon, { className: "w-5 h-5" })}
        <span className="hidden md:inline">{label}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header Bar */}
      <header className="bg-white p-4 shadow-md sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-600 rounded-lg">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-800">
              CarbonTrack
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden md:block">
              {console.log(user)}
              Logged in as <strong>{user?.full_name}</strong>
            </span>
            <button
              onClick={logout}
              className="py-2 px-4 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
        </div>
      </header>

      {/* --- NEW: Tab Navigation --- */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto flex">
          <NavButton
            tabName="calculator"
            icon={Calculator}
            label="My Footprint"
          />
          <NavButton tabName="goals" icon={Goal} label="My Goals" />
          <NavButton tabName="explorer" icon={Globe} label="Global Explorer" />
          <NavButton tabName="aiTools" icon={Sparkles} label="AI Tools" />
        </div>
      </nav>

      {/* Main Content Area (renders page based on state) */}
      <main className="container mx-auto p-4 md:p-8 grow ">
        {page === "calculator" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <CalculatorForm onCalculation={handleCalculation} />
              <HistoryTracker
                newCalculation={newCalculation}
                onSelectHistory={handleSelectHistory}
              />
            </div>
            <div className="lg:col-span-1 space-y-6">
              <div className="sticky top-24 space-y-6">
                <ResultDisplay calculation={currentCalculation} />
                {/* --- NEW: General Suggestions Added --- */}
                <GeneralSuggestions />
              </div>
            </div>
          </div>
        )}

        {page === "goals" && <GoalsPage />}
        {page === "explorer" && <GlobalExplorerPage />}
        {page === "aiTools" && <AIToolsPage />}
      </main>

      {/* NEW: Footer Added */}
      <Footer />
    </div>
  );
}
