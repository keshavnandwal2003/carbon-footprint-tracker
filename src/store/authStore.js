import { create } from "zustand";
import axios from "axios";

const API_URL = "https://carbon-footprint-tracker-api.vercel.app/api/v1";

export const useAuthStore = create((set) => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    isAuthenticated: localStorage.getItem('token') ? true : false,
    isLoading: false,
    isSuccess: false,
    message: "",

    // --- LOGIN ---
    login: async (email, password) => {
        set({ isLoading: true });
        try {
            const response = await axios.post(`${API_URL}/users/login`, { email, password });
            const { success, message, user, token } = response.data;

            // Store in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

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

            // Store in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

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
        // Clear from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Reset state
        set({ token: null, user: null, isAuthenticated: false, isSuccess: false, message: "" });
    },

    // --- CHECK AUTH ---
    checkAuth: async () => {
        if (!localStorage.getItem('token')) {
            set({ token: null, user: null, isAuthenticated: false, isLoading: false, isSuccess: false });
        } else {
            const user = JSON.parse(localStorage.getItem('user'));
            set({
                token: localStorage.getItem('token'),
                user,
                isAuthenticated: true,
                isLoading: false,
                isSuccess: true,
                message: "Authenticated",
            });
        }
    },
}));
