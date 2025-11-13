import { create } from 'zustand';
import axios from 'axios';

// ====================================================================
// --- 3. GLOBAL STATE (Zustand) ---
// ====================================================================

const API_URL = "https://carbon-footprint-tracker-api.vercel.app/api/v1";

export const useAuthStore = create((set) => ({
    token: null,
    user: null,
    isAuthenticated: false,
    isLoading: true, // Start as true to check auth,
    isSuccess: false,
    message: "",
    login: async (email, password) => {
        set({ isLoading: true });
        try {
            const { token, user, success, message } = await axios.post(`${API_URL}/users/login`, {
                email, password
            });
            set({ token, user, isAuthenticated: true, isLoading: false, isSuccess: success, message: message });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },
    register: async (email, password, fullName) => {
        set({ isLoading: true });
        try {
            const { token, user, success, message } = await axios.post(`${API_URL}/users/register`, {
                email, password, full_name: fullName
            });
            set({ token, user, isAuthenticated: true, isLoading: false, isSuccess: success, message: message });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },
    logout: () => {
        set({ token: null, user: null, isAuthenticated: false });
    },
    // Add a simple check function to run on init
    checkAuth: () => {
        // In a real app, this would check localStorage for a token
        // For this sim, we just set loading to false.
        set({ isLoading: false });
    },
}));