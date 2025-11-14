import React, { useState } from "react";
import { Leaf } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthStore } from "../store/authStore.js";
import { LoadingSpinner } from "../components/UtilityComponents.jsx";

export function AuthPage({ mode, onNavigate }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { login, register, isLoading } = useAuthStore();

  const isLogin = mode === "login";
  const title = isLogin ? "Welcome Back 🌿" : "Join CarbonMate 🌱";
  const buttonText = isLogin ? "Log In" : "Sign Up";
  const switchText = isLogin
    ? "Don't have an account?"
    : "Already have an account?";
  const switchActionText = isLogin ? "Sign Up" : "Log In";
  const switchTarget = isLogin ? "register" : "login";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || (!isLogin && !fullName)) {
      toast.warn("Please fill out all fields ⚠️");
      return;
    }

    try {
      if (isLogin) {
        await login(email, password);
        toast.success("Logged in successfully! 🎉");
      } else {
        await register(email, password, fullName);
        toast.success("Account created successfully! 🌿");
      }

      // Clear form fields
      setFullName("");
      setEmail("");
      setPassword("");

      // Navigate after a short delay to show toast
      setTimeout(() => {
        onNavigate("dashboard");
      }, 1000);
    } catch (err) {
      // err is already thrown from store, so just display
      const msg = err.message || "Something went wrong!";
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-200 p-4">
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md border border-green-100">
        {/* Back Button */}
        <button
          onClick={() => onNavigate("landing")}
          className="text-sm text-gray-600 hover:text-green-600 mb-4 transition-colors"
        >
          &larr; Back to Home
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-green-600 rounded-2xl shadow-lg animate-bounce">
            <Leaf className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          {title}
        </h2>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
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
                disabled={isLoading}
                placeholder="John Doe"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              placeholder="example@gmail.com"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
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
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              placeholder="********"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
            />
          </div>

          {/* Error message */}
          {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-60 transition-all"
          >
            {isLoading ? <LoadingSpinner /> : buttonText}
          </button>
        </form>

        {/* Switch between login/register */}
        <p className="mt-6 text-center text-sm text-gray-600">
          {switchText}{" "}
          <button
            onClick={() => onNavigate(switchTarget)}
            className="font-medium text-green-600 hover:text-green-500 transition-colors"
          >
            {switchActionText}
          </button>
        </p>
      </div>
    </div>
  );
}
