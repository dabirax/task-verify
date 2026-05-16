import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole, AuthState } from '../types';
import { api } from '../services/api';

interface AuthStore extends AuthState {
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: { email: string; password: string; full_name: string; phone: string; role: string }) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const { user, token } = await api.login(credentials);
          localStorage.setItem('servid_token', token);
          set({ user, isAuthenticated: true });
        } catch (error) {
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      register: async (data) => {
        set({ isLoading: true });
        try {
          // Map guest to buyer for the backend, as guest isn't supported yet
          const backendData = { ...data };
          if (backendData.role === 'guest') {
            backendData.role = 'buyer';
          }
          
          const { user, token } = await api.register(backendData);
          
          // Override the role back to guest on the frontend for presentation
          if (data.role === 'guest') {
            user.role = 'guest';
          }

          localStorage.setItem('servid_token', token);
          set({ user, isAuthenticated: true });
        } catch (error) {
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      logout: () => {
        localStorage.removeItem('servid_token');
        set({ user: null, isAuthenticated: false });
      },
      setUser: (user) => set({ user, isAuthenticated: !!user }),
    }),
    {
      name: 'servid-auth',
    }
  )
);
