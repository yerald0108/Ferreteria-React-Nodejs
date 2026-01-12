// src/pages/auth/Register.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { registerSchema, type RegisterFormData } from '../../schemas/auth.schema';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { ROUTES } from '../../utils/constants';

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // React Hook Form con Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  });

  // Observar el campo password para mostrar requisitos en tiempo real
  const password = watch('password');

  /**
   * Validar fortaleza de contraseña
   */
  const passwordStrength = {
    hasMinLength: password?.length >= 6,
    hasNumber: /\d/.test(password || ''),
    hasLetter: /[a-zA-Z]/.test(password || ''),
  };

  /**
   * Manejar envío del formulario
   */
  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Remover confirmPassword antes de enviar al backend
      const { confirmPassword, ...registerData } = data;
      
      await registerUser(registerData);
      
      setSuccessMessage('¡Registro exitoso! Redirigiendo...');
      
      // Redirigir después de 1.5 segundos
      setTimeout(() => {
        navigate(ROUTES.HOME);
      }, 1500);
    } catch (error: any) {
      setErrorMessage(error.message || 'Error al registrarse. Intenta nuevamente.');
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
            Crear Cuenta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link to={ROUTES.LOGIN} className="font-medium text-orange-600 hover:text-orange-500">
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        {/* Formulario */}
        <div className="mt-8 bg-white py-8 px-6 shadow-lg rounded-lg">
          {/* Mensajes */}
          {errorMessage && (
            <div className="mb-6">
              <Alert 
                type="error" 
                message={errorMessage}
                onClose={() => setErrorMessage('')}
              />
            </div>
          )}

          {successMessage && (
            <div className="mb-6">
              <Alert type="success" message={successMessage} />
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Nombre y Apellido */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Nombre"
                type="text"
                placeholder="Juan"
                error={errors.first_name?.message}
                required
                autoComplete="given-name"
                {...register('first_name')}
              />

              <Input
                label="Apellido"
                type="text"
                placeholder="Pérez"
                error={errors.last_name?.message}
                required
                autoComplete="family-name"
                {...register('last_name')}
              />
            </div>

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

            {/* Teléfono */}
            <Input
              label="Teléfono"
              type="tel"
              placeholder="52345678"
              error={errors.phone?.message}
              helperText="8 dígitos (sin +53)"
              required
              autoComplete="tel"
              maxLength={8}
              {...register('phone')}
            />

            {/* Contraseña */}
            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              required
              autoComplete="new-password"
              {...register('password')}
            />

            {/* Indicador de fortaleza de contraseña */}
            {password && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-700">Requisitos de contraseña:</p>
                <div className="space-y-1">
                  <div className="flex items-center text-xs">
                    {passwordStrength.hasMinLength ? (
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-gray-300 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className={passwordStrength.hasMinLength ? 'text-green-600' : 'text-gray-500'}>
                      Al menos 6 caracteres
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Confirmar Contraseña */}
            <Input
              label="Confirmar Contraseña"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              required
              autoComplete="new-password"
              {...register('confirmPassword')}
            />

            {/* Botón Submit */}
            <Button
              type="submit"
              fullWidth
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              Crear Cuenta
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600">
          Al registrarte, aceptas nuestros{' '}
          <Link to="/terminos" className="text-orange-600 hover:text-orange-500">
            Términos y Condiciones
          </Link>
          {' y '}
          <Link to="/privacidad" className="text-orange-600 hover:text-orange-500">
            Política de Privacidad
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;