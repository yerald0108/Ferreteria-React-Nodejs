// src/components/cart/EmptyCart.tsx
import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

interface EmptyCartProps {
  inDrawer?: boolean;
}

/**
 * Componente de estado vacío para el carrito
 * Muestra mensaje amigable y sugerencias de acción
 */
const EmptyCart = ({ inDrawer = false }: EmptyCartProps) => {
  return (
    <div className={`flex flex-col items-center justify-center ${inDrawer ? 'py-12' : 'py-20'}`}>
      {/* Ilustración del carrito vacío */}
      <div className="relative mb-6">
        <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center">
          <svg 
            className="w-16 h-16 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
            />
          </svg>
        </div>
        
        {/* Animación sutil */}
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-100 rounded-full animate-ping opacity-75"></div>
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-200 rounded-full flex items-center justify-center">
          <span className="text-xs font-bold text-orange-600">0</span>
        </div>
      </div>

      {/* Mensaje principal */}
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        Tu carrito está vacío
      </h3>
      
      <p className="text-gray-500 text-center max-w-sm mb-8">
        Agrega productos a tu carrito para continuar con tu compra
      </p>

      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md px-4">
        <Link
          to={ROUTES.PRODUCTS}
          className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors shadow-sm hover:shadow-md"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Ver Productos
        </Link>

        <Link
          to={ROUTES.HOME}
          className="flex-1 inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Ir al Inicio
        </Link>
      </div>

      {/* Sugerencias adicionales */}
      {!inDrawer && (
        <div className="mt-12 w-full max-w-2xl">
          <h4 className="text-sm font-semibold text-gray-700 mb-4 text-center">
            ¿No sabes qué comprar? Te sugerimos:
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-4">
            <Link
              to="/category/herramientas-manuales"
              className="flex flex-col items-center p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-orange-200 transition-colors">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600 transition-colors">
                Herramientas
              </span>
            </Link>

            <Link
              to="/category/pinturas"
              className="flex flex-col items-center p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-orange-200 transition-colors">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600 transition-colors">
                Pinturas
              </span>
            </Link>

            <Link
              to={ROUTES.PRODUCTS}
              className="flex flex-col items-center p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-orange-200 transition-colors">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600 transition-colors">
                Destacados
              </span>
            </Link>
          </div>
        </div>
      )}

      {/* Información adicional */}
      {!inDrawer && (
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl w-full mx-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-semibold text-blue-900 mb-1">
                ¿Sabías que?
              </h4>
              <p className="text-sm text-blue-800">
                Puedes guardar productos en tu carrito para comprarlos más tarde. 
                Los items se mantendrán guardados incluso si cierras el navegador.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmptyCart;