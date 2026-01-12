// src/pages/auth/Login.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { loginSchema, type LoginFormData } from '../../schemas/auth.schema';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { ROUTES } from '../../utils/constants';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // React Hook Form con Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur', // Validar al salir del campo
  });

  // Obtener la ruta a donde debe redirigir después del login
  const from = (location.state as any)?.from?.pathname || ROUTES.HOME;

  /**
   * Manejar envío del formulario
   */
  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await login(data.email, data.password);
      
      // Redirigir a la página anterior o al home
      navigate(from, { replace: true });
    } catch (error: any) {
      setErrorMessage(error.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to={ROUTES.HOME} className="inline-block">
            <div className="bg-orange-500 text-white p-3 rounded-lg inline-block mb-4">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link to={ROUTES.REGISTER} className="font-medium text-orange-600 hover:text-orange-500">
              Regístrate aquí
            </Link>
          </p>
        </div>

        {/* Formulario */}
        <div className="mt-8 bg-white py-8 px-6 shadow-lg rounded-lg">
          {/* Mensaje de error global */}
          {errorMessage && (
            <div className="mb-6">
              <Alert 
                type="error" 
                message={errorMessage}
                onClose={() => setErrorMessage('')}
              />
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <Input
              label="Email"
              type="email"
              placeholder="tu@email.com"
              error={errors.email?.message}
              required
              autoComplete="email"
              {...register('email')}
            />

            {/* Contraseña */}
            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              required
              autoComplete="current-password"
              {...register('password')}
            />

            {/* Olvidé mi contraseña */}
            <div className="flex items-center justify-end">
              <Link
                to={ROUTES.FORGOT_PASSWORD}
                className="text-sm font-medium text-orange-600 hover:text-orange-500"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Botón Submit */}
            <Button
              type="submit"
              fullWidth
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              Iniciar Sesión
            </Button>
          </form>

          {/* Demo credentials (solo desarrollo) */}
          {import.meta.env.DEV && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs font-semibold text-blue-800 mb-2">
                🧪 Credenciales de prueba:
              </p>
              <div className="text-xs text-blue-700 space-y-1">
                <p><strong>Admin:</strong> admin@ferreteria.com / admin123</p>
                <p><strong>Cliente:</strong> cliente@ejemplo.com / password123</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600">
          Al iniciar sesión, aceptas nuestros{' '}
          <Link to="/terminos" className="text-orange-600 hover:text-orange-500">
            Términos y Condiciones
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;