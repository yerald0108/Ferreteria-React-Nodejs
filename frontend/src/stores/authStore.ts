// src/stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/user.types';
import { authApi } from '../api/auth.api';
import { STORAGE_KEYS } from '../utils/constants';

interface AuthState {
  // Estado
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Acciones
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone: string;
  }) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: { first_name?: string; last_name?: string; phone?: string }) => Promise<void>;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

/**
 * Store de autenticación con Zustand
 * Persiste automáticamente en localStorage
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      /**
       * Login - Iniciar sesión
       */
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await authApi.login({ email, password });
          
          // Guardar token y usuario
          localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            error: error.message || 'Error al iniciar sesión',
            isLoading: false,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      /**
       * Register - Registrar usuario
       */
      register: async (userData) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await authApi.register(userData);
          
          // Guardar token y usuario
          localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            error: error.message || 'Error al registrarse',
            isLoading: false,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      /**
       * Logout - Cerrar sesión
       */
      logout: () => {
        authApi.logout();
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      /**
       * Update Profile - Actualizar perfil del usuario
       */
      updateProfile: async (updates) => {
        set({ isLoading: true, error: null });
        
        try {
          const updatedUser = await authApi.updateProfile(updates);
          
          set({
            user: updatedUser,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            error: error.message || 'Error al actualizar perfil',
            isLoading: false,
          });
          throw error;
        }
      },

      /**
       * Load User - Cargar usuario actual del token
       */
      loadUser: async () => {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        
        if (!token) {
          set({ isAuthenticated: false, user: null, token: null });
          return;
        }
        
        set({ isLoading: true });
        
        try {
          const user = await authApi.getProfile();
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          // Si el token es inválido, limpiar todo
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      /**
       * Clear Error - Limpiar error
       */
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage', // nombre en localStorage
      partialize: (state) => ({
        // Solo persistir estos campos
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);