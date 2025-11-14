import { create } from "zustand";
import axios from "axios";

const API_URL = "https://carbon-footprint-tracker-api.vercel.app/api/v1";

export const useAuthStore = create((set) => ({
    token: null,
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isSuccess: false,
    message: "",

    // --- LOGIN ---
    login: async (email, password) => {
        set({ isLoading: true });
        try {
            const response = await axios.post(`${API_URL}/users/login`, { email, password });
            const { success, message, user, token } = response.data;

            set({
                token,
                user,
                isAuthenticated: true,
                isLoading: false,
                isSuccess: success,
                message,
            });
        } catch (error) {
            const errMsg = error.response?.data?.message || error.message || "Login failed";
            set({ isLoading: false, isSuccess: false, message: errMsg });
            throw new Error(errMsg);
        }
    },

    // --- REGISTER ---
    register: async (email, password, fullName) => {
        set({ isLoading: true });
        try {
            const response = await axios.post(`${API_URL}/users/register`, {
                email,
                password,
                full_name: fullName,
            });
            const { success, message, user, token } = response.data;

            set({
                token,
                user,
                isAuthenticated: true,
                isLoading: false,
                isSuccess: success,
                message,
            });
        } catch (error) {
            const errMsg = error.response?.data?.message || error.message || "Registration failed";
            set({ isLoading: false, isSuccess: false, message: errMsg });
            throw new Error(errMsg);
        }
    },

    // --- LOGOUT ---
    logout: () => {
        set({ token: null, user: null, isAuthenticated: false, isSuccess: false, message: "" });
    },

    // --- CHECK AUTH ---
    checkAuth: async () => {
        // Since we no longer persist token, this just resets the state
        set({ token: null, user: null, isAuthenticated: false, isLoading: false, isSuccess: false });
    },
}));
