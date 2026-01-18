// frontend/src/pages/cart/CartPage.tsx
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { ROUTES } from '../../utils/constants';
import { Breadcrumbs } from '../../components/common';
import { CartItem, CartSummary, EmptyCart } from '../../components/cart';

const CartPage = () => {
  const { items, isEmpty, itemCount, clearCart } = useCart();
  const navigate = useNavigate();

  /**
   * Continuar comprando
   */
  const handleContinueShopping = () => {
    navigate(ROUTES.PRODUCTS);
  };

  /**
   * Ir al checkout
   */
  const handleCheckout = () => {
    navigate(ROUTES.CHECKOUT);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Inicio', path: ROUTES.HOME },
            { label: 'Carrito de Compras' },
          ]}
          className="mb-6"
        />

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Carrito de Compras
            </h1>
            {!isEmpty && (
              <p className="text-gray-600">
                {itemCount} {itemCount === 1 ? 'producto' : 'productos'} en tu carrito
              </p>
            )}
          </div>

          {!isEmpty && (
            <button
              onClick={() => {
                if (window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
                  clearCart();
                }
              }}
              className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Vaciar carrito
            </button>
          )}
        </div>

        {/* Contenido */}
        {isEmpty ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de productos */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm">
                {/* Header de la tabla (desktop) */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 rounded-t-lg border-b border-gray-200 text-sm font-semibold text-gray-700">
                  <div className="col-span-6">Producto</div>
                  <div className="col-span-2 text-center">Precio</div>
                  <div className="col-span-2 text-center">Cantidad</div>
                  <div className="col-span-2 text-right">Subtotal</div>
                </div>

                {/* Items del carrito */}
                <div className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <div key={item.product.id} className="px-6 py-4">
                      <CartItem item={item} />
                    </div>
                  ))}
                </div>

                {/* Footer con botón continuar comprando */}
                <div className="px-6 py-4 bg-gray-50 rounded-b-lg border-t border-gray-200">
                  <button
                    onClick={handleContinueShopping}
                    className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium text-sm"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Continuar comprando
                  </button>
                </div>
              </div>

              {/* Tarjetas informativas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {/* Envío gratis */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-900 text-sm mb-1">
                        Envío Gratis
                      </h3>
                      <p className="text-xs text-green-700">
                        En compras mayores a $50
                      </p>
                    </div>
                  </div>
                </div>

                {/* Devoluciones */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900 text-sm mb-1">
                        Devoluciones
                      </h3>
                      <p className="text-xs text-blue-700">
                        30 días para devolver
                      </p>
                    </div>
                  </div>
                </div>

                {/* Pago seguro */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-purple-900 text-sm mb-1">
                        Pago Seguro
                      </h3>
                      <p className="text-xs text-purple-700">
                        Protección 100% garantizada
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Resumen del carrito (sticky sidebar) */}
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <CartSummary showCheckoutButton={true} />

                {/* Información adicional */}
                <div className="bg-white rounded-lg p-4 mt-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 text-orange-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Información de entrega
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Entrega en 2-5 días hábiles
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Seguimiento en tiempo real
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Atención personalizada
                    </li>
                  </ul>
                </div>

                {/* Métodos de pago */}
                <div className="bg-white rounded-lg p-4 mt-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Métodos de pago
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-gray-50 rounded p-2 flex items-center justify-center border border-gray-200">
                      <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 6h18v12H3V6zm2 2v8h14V8H5zm2 2h10v2H7v-2z"/>
                      </svg>
                    </div>
                    <div className="bg-gray-50 rounded p-2 flex items-center justify-center border border-gray-200">
                      <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                      </svg>
                    </div>
                    <div className="bg-gray-50 rounded p-2 flex items-center justify-center border border-gray-200">
                      <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Cupón de descuento */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 mt-4 border-2 border-dashed border-orange-300">
                  <h3 className="font-semibold text-orange-900 mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    ¿Tienes un cupón?
                  </h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Código de cupón"
                      className="flex-1 px-3 py-2 border border-orange-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium">
                      Aplicar
                    </button>
                  </div>
                </div>

                {/* Confianza */}
                <div className="bg-white rounded-lg p-4 mt-4 border border-gray-200">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Compra 100% segura y protegida</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;