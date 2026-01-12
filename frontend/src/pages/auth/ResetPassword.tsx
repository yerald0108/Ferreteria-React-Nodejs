// src/pages/auth/ResetPassword.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { resetPasswordSchema, type ResetPasswordFormData } from '../../schemas/auth.schema';
import { authApi } from '../../api/auth.api';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { ROUTES } from '../../utils/constants';

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onBlur',
  });

  // Observar el campo password para validaciones visuales
  const password = watch('password');

  // Verificar si el token es válido al cargar la página
  useEffect(() => {
    if (!token) {
      setIsValidToken(false);
      setErrorMessage('Token inválido o expirado');
      return;
    }

    // Aquí podrías hacer una validación del token con el backend
    // Por ahora asumimos que es válido
    setIsValidToken(true);
  }, [token]);

  /**
   * Validar fortaleza de contraseña
   */
  const passwordStrength = {
    hasMinLength: password?.length >= 6,
    hasNumber: /\d/.test(password || ''),
    hasLetter: /[a-zA-Z]/.test(password || ''),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password || ''),
  };

  const strengthScore = Object.values(passwordStrength).filter(Boolean).length;
  const strengthColor = {
    0: 'bg-gray-200',
    1: 'bg-red-500',
    2: 'bg-orange-500',
    3: 'bg-yellow-500',
    4: 'bg-green-500',
  }[strengthScore];

  const strengthText = {
    0: '',
    1: 'Muy débil',
    2: 'Débil',
    3: 'Aceptable',
    4: 'Fuerte',
  }[strengthScore];

  /**
   * Manejar envío del formulario
   */
  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setErrorMessage('Token no válido');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await authApi.resetPassword(token, data.password);
      
      setSuccessMessage('¡Contraseña actualizada exitosamente!');
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 2000);
    } catch (error: any) {
      if (error.status === 400) {
        setErrorMessage('El token ha expirado o es inválido. Solicita uno nuevo.');
      } else {
        setErrorMessage(error.message || 'Error al resetear contraseña. Intenta nuevamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Si el token es inválido, mostrar error
  if (isValidToken === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="bg-red-100 text-red-600 p-4 rounded-full inline-block mb-4">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Token Inválido
            </h2>
            <p className="text-gray-600 mb-6">
              Este enlace ha expirado o no es válido.
            </p>
            <div className="space-y-3">
              <Link to={ROUTES.FORGOT_PASSWORD}>
                <Button fullWidth>
                  Solicitar nuevo enlace
                </Button>
              </Link>
              <Link to={ROUTES.LOGIN}>
                <Button variant="outline" fullWidth>
                  Volver al inicio de sesión
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Formulario de reset
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to={ROUTES.HOME} className="inline-block">
            <div className="bg-orange-500 text-white p-3 rounded-lg inline-block mb-4">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">
            Nueva Contraseña
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Ingresa tu nueva contraseña
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

          {successMessage ? (
            <div className="space-y-6">
              <Alert type="success" message={successMessage} />
              
              <div className="text-center space-y-4">
                <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                
                <p className="text-sm text-gray-600">
                  Redirigiendo al inicio de sesión...
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Nueva Contraseña */}
              <Input
                label="Nueva Contraseña"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                required
                autoComplete="new-password"
                autoFocus
                {...register('password')}
              />

              {/* Indicador de fortaleza de contraseña */}
              {password && (
                <div className="space-y-3">
                  {/* Barra de fortaleza */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Fortaleza:</span>
                      <span className={`font-semibold ${
                        strengthScore === 4 ? 'text-green-600' :
                        strengthScore === 3 ? 'text-yellow-600' :
                        strengthScore === 2 ? 'text-orange-600' :
                        'text-red-600'
                      }`}>
                        {strengthText}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${strengthColor} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${(strengthScore / 4) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Requisitos */}
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-700">Requisitos:</p>
                    
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

                    <div className="flex items-center text-xs">
                      {passwordStrength.hasNumber ? (
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-gray-300 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span className={passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-500'}>
                        Al menos un número
                      </span>
                    </div>

                    <div className="flex items-center text-xs">
                      {passwordStrength.hasLetter ? (
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-gray-300 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span className={passwordStrength.hasLetter ? 'text-green-600' : 'text-gray-500'}>
                        Al menos una letra
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
                Actualizar Contraseña
              </Button>

              {/* Volver al login */}
              <div className="text-center">
                <Link
                  to={ROUTES.LOGIN}
                  className="text-sm font-medium text-orange-600 hover:text-orange-500"
                >
                  Volver al inicio de sesión
                </Link>
              </div>
            </form>
          )}
        </div>

        {/* Footer con info de seguridad */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-blue-800 mb-1">Consejo de Seguridad</p>
              <p className="text-xs text-blue-700">
                Usa una contraseña única que no hayas usado en otros sitios. 
                Combina letras, números y caracteres especiales para mayor seguridad.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;