// src/router/PrivateRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { ROUTES } from '../utils/constants';

interface PrivateRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireVerified?: boolean;
}

/**
 * Componente para proteger rutas que requieren autenticación
 * 
 * @example
 * <Route path="/profile" element={
 *   <PrivateRoute>
 *     <ProfilePage />
 *   </PrivateRoute>
 * } />
 * 
 * @example Con validación de admin
 * <Route path="/admin" element={
 *   <PrivateRoute requireAdmin>
 *     <AdminPage />
 *   </PrivateRoute>
 * } />
 */
const PrivateRoute = ({ 
  children, 
  requireAdmin = false,
  requireVerified = false 
}: PrivateRouteProps) => {
  const { isAuthenticated, isLoading, isAdmin, isVerified } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras se carga el usuario
  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // Si requiere admin y no es admin, redirigir al home
  if (requireAdmin && !isAdmin) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  // Si requiere verificación y no está verificado, mostrar mensaje
  if (requireVerified && !isVerified) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <svg 
            className="w-12 h-12 text-yellow-500 mx-auto mb-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Email no verificado
          </h2>
          <p className="text-gray-600 mb-4">
            Por favor verifica tu email para acceder a esta sección.
          </p>
          <p className="text-sm text-gray-500">
            Revisa tu bandeja de entrada y spam.
          </p>
        </div>
      </div>
    );
  }

  // Si todo está bien, renderizar el componente hijo
  return <>{children}</>;
};

export default PrivateRoute;