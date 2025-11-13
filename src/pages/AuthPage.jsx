import React, { useState } from "react";
import { Leaf } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // ✅ ensures toasts are styled

import { useAuthStore } from "../store/authStore.js";
import { LoadingSpinner } from "../components/UtilityComponents.jsx";

export function AuthPage({ mode, onNavigate }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  // ✅ Destructure all store values at once
  const { login, register, isLoading } = useAuthStore();

  const isLogin = mode === "login";
  const title = isLogin ? "Welcome Back" : "Create Your Account";
  const buttonText = isLogin ? "Log In" : "Sign Up";
  const switchText = isLogin
    ? "Don't have an account?"
    : "Already have an account?";
  const switchActionText = isLogin ? "Sign Up" : "Log In";
  const switchTarget = isLogin ? "register" : "login";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (isLogin) {
        await login(email, password);
        toast.success("Logged in successfully! 🎉");
      } else {
        await register(email, password, fullName);
        toast.success("Account created successfully! 🌿");
      }
      // Navigation handled by parent App
    } catch (err) {
      const msg = err?.message || "Something went wrong!";
      toast.error(msg);
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        {/* Back to home button */}
        <button
          onClick={() => onNavigate("landing")}
          className="text-sm text-gray-600 hover:text-green-600 mb-4"
        >
          &larr; Back to Home
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-green-600 rounded-xl">
            <Leaf className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {title}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full name (only on register) */}
          {!isLogin && (
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="John Doe"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="example@gmail.com"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              placeholder="********"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Error message */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-60 transition-colors"
          >
            {isLoading ? <LoadingSpinner /> : buttonText}
          </button>
        </form>

        {/* Switch between login/register */}
        <p className="mt-6 text-center text-sm text-gray-600">
          {switchText}{" "}
          <button
            onClick={() => onNavigate(switchTarget)}
            className="font-medium text-green-600 hover:text-green-500"
          >
            {switchActionText}
          </button>
        </p>
      </div>
    </div>
  );
}
