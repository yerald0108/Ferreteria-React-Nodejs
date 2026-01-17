// src/components/cart/CartSummary.tsx
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../utils/formatters';
import { ROUTES } from '../../utils/constants';

interface CartSummaryProps {
  showCheckoutButton?: boolean;
  inDrawer?: boolean;
}

/**
 * Componente de resumen del carrito
 * Muestra subtotal, descuentos, envío y total
 */
const CartSummary = ({ 
  showCheckoutButton = true, 
  inDrawer = false 
}: CartSummaryProps) => {
  const { items, subtotal, total, itemCount } = useCart();

  // Calcular descuento total
  const totalDiscount = items.reduce((acc, item) => {
    const discount = item.product.compare_price && item.product.compare_price > item.product.price
      ? (item.product.compare_price - item.product.price) * item.quantity
      : 0;
    return acc + discount;
  }, 0);

  // Envío (por ahora gratis, puede calcularse dinámicamente)
  const shipping = 0;
  const freeShippingThreshold = 50;
  const needsForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  // Impuestos (opcional)
  const tax = 0;

  return (
    <div className={`${inDrawer ? 'border-t border-gray-200 pt-4' : 'bg-gray-50 rounded-lg p-6 sticky top-4'}`}>
      {/* Título */}
      {!inDrawer && (
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Resumen de compra
        </h3>
      )}

      {/* Líneas del resumen */}
      <div className="space-y-3 mb-4">
        {/* Productos */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 flex items-center">
            <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Productos ({itemCount})
          </span>
          <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
        </div>

        {/* Descuentos */}
        {totalDiscount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center">
              <svg className="w-4 h-4 mr-1.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Descuentos
            </span>
            <span className="font-semibold text-green-600">-{formatPrice(totalDiscount)}</span>
          </div>
        )}

        {/* Envío */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 flex items-center">
            <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
            Envío
          </span>
          {shipping === 0 ? (
            <span className="font-semibold text-green-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Gratis
            </span>
          ) : (
            <span className="font-semibold text-gray-900">{formatPrice(shipping)}</span>
          )}
        </div>

        {/* Mensaje de envío gratis */}
        {needsForFreeShipping > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs">
            <div className="flex items-start">
              <svg className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-semibold text-blue-900 mb-0.5">
                  ¡Casi lo logras! 🎉
                </p>
                <p className="text-blue-700">
                  Agrega <span className="font-bold">{formatPrice(needsForFreeShipping)}</span> más para envío gratis
                </p>
                <div className="mt-2 bg-blue-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full transition-all duration-500"
                    style={{ width: `${(subtotal / freeShippingThreshold) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Impuestos (si aplica) */}
        {tax > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center">
              <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Impuestos
            </span>
            <span className="font-semibold text-gray-900">{formatPrice(tax)}</span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="border-t border-gray-300 pt-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">Total</span>
          <div className="text-right">
            <div className="text-2xl font-bold text-orange-600">{formatPrice(total)}</div>
            {totalDiscount > 0 && (
              <div className="text-sm text-gray-500">
                Ahorras {formatPrice(totalDiscount)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      {showCheckoutButton && (
        <div className="space-y-3">
          <Link
            to={ROUTES.CHECKOUT}
            className="w-full flex items-center justify-center px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Proceder al pago
          </Link>

          <Link
            to={ROUTES.PRODUCTS}
            className="w-full flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Seguir comprando
          </Link>
        </div>
      )}

      {/* Información de seguridad */}
      {!inDrawer && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="space-y-3 text-xs text-gray-600">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Compra 100% segura</span>
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
              </svg>
              <span>Entrega rápida y confiable</span>
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-purple-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
              </svg>
              <span>Factura electrónica disponible</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartSummary;