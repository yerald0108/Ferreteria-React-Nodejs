// src/hooks/useAuth.ts
import { useAuthStore } from '../stores/authStore';
import { useEffect } from 'react';

/**
 * Hook personalizado para autenticación
 * Wrapper conveniente sobre useAuthStore
 */
export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    loadUser,
    clearError,
  } = useAuthStore();

  // Cargar usuario al montar el componente
  useEffect(() => {
    if (token && !user) {
      loadUser();
    }
  }, [token, user, loadUser]);

  return {
    // Estado
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    
    // Helpers computados
    isAdmin: user?.role === 'admin',
    isVerified: user?.email_verified || false,
    fullName: user ? `${user.first_name} ${user.last_name}` : '',
    initials: user 
      ? `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase()
      : '',
    
    // Acciones
    login,
    register,
    logout,
    updateProfile,
    loadUser,
    clearError,
  };
};