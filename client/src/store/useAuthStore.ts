import { create } from 'zustand';
import api from '../lib/axios';

interface User {
    _id: string;
    username: string;
    email: string;
    subscriptionPlan: string;
    avatar?: string;
    token: string;
}

interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    register: (userData: any) => Promise<void>;
    login: (credentials: any) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    isLoading: false,
    error: null,

    register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await api.post('/auth/register', userData);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            set({ user: data, isLoading: false });
        } catch (error: any) {
            set({
                isLoading: false,
                error: error.response?.data?.message || 'Registration failed',
            });
            throw error;
        }
    },

    login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await api.post('/auth/login', credentials);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            set({ user: data, isLoading: false });
        } catch (error: any) {
            set({
                isLoading: false,
                error: error.response?.data?.message || 'Login failed',
            });
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null });
    },

    checkAuth: async () => {
        set({ isLoading: true });
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                set({ user: null, isLoading: false });
                return;
            }
            const { data } = await api.get('/auth/me');
            // Merge with existing user data to keep token
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const updatedUser = { ...currentUser, ...data };

            localStorage.setItem('user', JSON.stringify(updatedUser));
            set({ user: updatedUser, isLoading: false });

        } catch (error) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            set({ user: null, isLoading: false });
        }
    }
}));
