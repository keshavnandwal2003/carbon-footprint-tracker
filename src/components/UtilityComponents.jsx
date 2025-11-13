import React from "react";
import { Leaf } from "lucide-react";

// --- Utility Components ---
export function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}

// --- NEW: Utility component to render simple markdown-like text
export function SimpleMarkdownDisplay({ text }) {
  if (!text) return null;
  return text.split("\n").map((line, index) => {
    if (line.trim() === "") return <br key={index} />;
    let isBullet = false;
    if (line.trim().startsWith("* ")) {
      isBullet = true;
      line = line.trim().substring(2);
    }
    const parts = line.split(/\*\*(.*?)\*\*|\*(.*?)\*/g); // Split by **bold** or *italic*
    const renderedLine = (
      <React.Fragment>
        {parts.map((part, i) => {
          if (!part) return null;
          if (i % 3 === 1) return <strong key={i}>{part}</strong>;
          if (i % 3 === 2) return <em key={i}>{part}</em>;
          return part;
        })}
      </React.Fragment>
    );
    if (isBullet) {
      return (
        <li key={index} className="text-gray-700 ml-4 mb-1 list-disc">
          {renderedLine}
        </li>
      );
    }
    return (
      <p key={index} className="text-gray-700 mb-2">
        {renderedLine}
      </p>
    );
  });
}

export function PageLoader() {
  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gray-100">
      <Leaf className="w-16 h-16 text-green-600 animate-pulse" />
    </div>
  );
}

// --- NEW: Footer Component ---
export function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-400 py-12">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center items-center gap-3 mb-4">
          <div className="p-2 bg-green-600 rounded-lg">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">CarbonTrack</span>
        </div>
        <p className="text-sm mb-4">
          Tracking and reducing our impact, one step at a time.
        </p>
        <div className="flex justify-center gap-6 mt-4 text-sm">
          <a href="#" className="hover:text-white transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Contact Us
          </a>
        </div>
        <p className="text-xs text-gray-500 mt-8">
          &copy; {new Date().getFullYear()} CarbonTrack. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
