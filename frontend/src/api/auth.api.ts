// src/api/auth.api.ts

import apiClient from './index';
import type { 
  AuthResponse, 
  LoginCredentials, 
  RegisterData, 
  UpdateProfileData,
  User
} from '../types/user.types';
import type { ApiResponse } from '../types/api.types';

/**
 * Servicios de autenticación
 */
export const authApi = {
  /**
   * Iniciar sesión
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return data;
  },

  /**
   * Registrar usuario
   */
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', userData);
    return data;
  },

  /**
   * Obtener perfil del usuario actual
   */
  getProfile: async (): Promise<User> => {
    const { data } = await apiClient.get<ApiResponse<User>>('/auth/me');
    if (!data.data) throw new Error('No se pudo obtener el perfil');
    return data.data;
  },

  /**
   * Actualizar perfil
   */
  updateProfile: async (updates: UpdateProfileData): Promise<User> => {
    const { data } = await apiClient.put<ApiResponse<User>>('/auth/profile', updates);
    if (!data.data) throw new Error('No se pudo actualizar el perfil');
    return data.data;
  },

  /**
   * Verificar email
   */
  verifyEmail: async (token: string): Promise<void> => {
    await apiClient.get(`/auth/verify/${token}`);
  },

  /**
   * Solicitar recuperación de contraseña
   */
  forgotPassword: async (email: string): Promise<void> => {
    await apiClient.post('/auth/forgot-password', { email });
  },

  /**
   * Resetear contraseña
   */
  resetPassword: async (token: string, password: string): Promise<void> => {
    await apiClient.post(`/auth/reset-password/${token}`, { password });
  },

  /**
   * Cerrar sesión (limpiar token localmente)
   */
  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};