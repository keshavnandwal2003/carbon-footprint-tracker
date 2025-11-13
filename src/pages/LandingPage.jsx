import React from "react";
import {
  Leaf,
  Sparkles,
  Calculator,
  History,
  ArrowRight,
  UserPlus,
} from "lucide-react";
import { Footer } from "../components/UtilityComponents.jsx";
import lushGreen from "../assets/lush-green.jpg";
import forestPath from "../assets/forest-path.jpg";

// --- 4a. Landing Page (NEW) ---
export function LandingPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="p-4 shadow-sm">
        <div className="container mx-auto flex justify-between items-center w-[90%]">
          <div className="flex items-center gap-3">
            {/* NEW ATTRACTIVE LOGO: Icon with background */}
            <div className="p-2 bg-green-600 rounded-lg">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-800">
              CarbonTrack
            </span>
          </div>
          <nav className="flex gap-2">
            <button
              onClick={() => onNavigate("login")}
              className="py-2 px-4 rounded-lg text-green-600 font-medium hover:bg-green-50 transition-colors"
            >
              Log In
            </button>
            <button
              onClick={() => onNavigate("register")}
              className="py-2 px-4 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Sign Up
            </button>
          </nav>
        </div>
      </header>

      {/* --- RESTORED: Original Hero Section --- */}
      <main className="flex-grow flex items-center container mx-auto px-4 py-16 w-[80%]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-800 leading-tight mb-6">
              Track Your
              <br />
              <span className="text-green-600">Carbon Footprint</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg mx-auto md:mx-0">
              Understand your environmental impact. Our tools help you
              calculate, track, and reduce your carbon footprint with AI-powered
              insights.
            </p>
            <button
              onClick={() => onNavigate("register")}
              className="py-3 px-8 rounded-lg bg-green-600 text-white font-semibold text-lg hover:bg-green-700 transition-all duration-300 shadow-lg flex items-center gap-2 mx-auto md:mx-0 w-fit"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* --- UPDATED: Image/SVG --- */}
          <div className="p-8 relative top-0 left-0">
            {/* <div className="floating-bg" />
            <p className="absolute top-[50%] left-[50%] z-40 text-4xl">CO2</p> */}
            <svg
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <path
                fill="#86EFAC"
                d="M49.1,-62.4C63.8,-53,76.1,-37.9,79.5,-21.2C82.9,-4.5,77.4,13.8,68.8,30C60.2,46.2,48.5,60.2,33.8,68.4C19.1,76.6,1.4,79,-16.9,74.7C-35.3,70.3,-54.3,59.2,-64.8,44.1C-75.3,29,-77.3,10,-73.4,-6.9C-69.5,-23.7,-59.8,-38.5,-47.8,-49.2C-35.8,-59.9,-21.5,-66.5,-6.1,-64.9C9.3,-63.3,18.6,-61.6,28.5,-60.1C38.4,-58.6,49.1,-62.4,49.1,-62.4Z"
                transform="translate(100 100)"
              />
              <text
                x="60"
                y="125"
                fontFamily="Arial"
                fontSize="24"
                fill="#059669"
                fontWeight="bold"
              >
                CO₂
              </text>
              <g
                className="animate-spin-slow"
                style={{ transformOrigin: "100px 100px" }}
              >
                <Leaf
                  className="w-20 h-20 text-green-700"
                  transform="translate(85 75)"
                />
              </g>
            </svg>
          </div>
        </div>
      </main>
      {/* --- End of Restored Section --- */}

      {/* Features Section */}
      <section className="bg-white py-20 ">
        <div className="w-[90%] mx-auto">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <Calculator className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  1. Calculate
                </h3>
                <p className="text-gray-600">
                  Use our detailed form to input your monthly energy use, weekly
                  travel, diet, and waste.
                </p>
              </div>
              <div className="text-center p-6 mx-auto w-[80%]">
                <History className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  2. Track
                </h3>
                <p className="text-gray-600">
                  Watch your footprint over time with our history chart. See
                  your progress in one simple view.
                </p>
              </div>
              <div className="text-center p-6">
                <Sparkles className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  3. Reduce
                </h3>
                <p className="text-gray-600">
                  Get personalized, AI-powered tips to help you reduce your
                  impact in the areas that matter most.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- NEW: "What is a Carbon Footprint?" Section --- */}
      <section className="bg-gray-50 py-20 w-[80%] mx-auto">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Understanding Your Impact
          </h2>

          {/* Row 1: What is it? */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                What is a Carbon Footprint?
              </h3>
              <p className="text-gray-600 mb-4">
                A carbon footprint is the total amount of greenhouse gases
                (including carbon dioxide and methane) that are generated by our
                actions.
              </p>
              <p className="text-gray-600">
                It includes emissions from things like the energy we use in our
                homes, the transportation we take, the food we eat, and the
                products we buy. Tracking it is the first step to reducing it.
              </p>
            </div>
            {/* --- UPDATED: Replaced placeholder with image inspired by upload --- */}
            <img
              src={lushGreen}
              alt="Lone green tree in a field"
              className="rounded-xl shadow-lg w-full h-auto object-cover opacity-[0.75]"
              onError={(e) => {
                e.currentTarget.src =
                  "https://placehold.co/600x400/cccccc/ffffff?text=Image+Not+Available";
              }}
            />
          </div>

          {/* Row 2: How to reduce it? (Reversed) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center ">
            {/* --- UPDATED: Replaced placeholder with image inspired by upload --- */}
            <img
              src={forestPath}
              alt="People hiking on a forest path"
              className="rounded-xl shadow-lg w-full h-auto object-cover md:order-1 "
              onError={(e) => {
                e.currentTarget.src =
                  "https://placehold.co/600x400/cccccc/ffffff?text=Image+Not+Available";
              }}
            />
            <div className="md:order-1">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                How Can You Reduce It?
              </h3>
              <p className="text-gray-600 mb-4">
                Reducing your carbon footprint doesn't require drastic changes.
                Small, consistent actions can make a huge difference.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>
                  <strong>Be Mindful of Energy:</strong> Switch to LEDs, unplug
                  devices, and be conscious of heating and cooling.
                </li>
                <li>
                  <strong>Rethink Transport:</strong> Walk, bike, or use public
                  transit when possible.
                </li>
                <li>
                  <strong>Eat Sustainably:</strong> Reduce food waste and
                  incorporate more plant-based meals.
                </li>
                <li>
                  <strong>Track Your Impact:</strong> Use tools like CarbonTrack
                  to see where you can improve!
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* --- End of New Section --- */}

      {/* NEW: Footer Added */}
      <Footer />
    </div>
  );
}
