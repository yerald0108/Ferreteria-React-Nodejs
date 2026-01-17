// src/components/cart/CartItem.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import type { CartItem as CartItemType } from '../../stores/cartStore';
import { formatPrice } from '../../utils/formatters';
import { ROUTES } from '../../utils/constants';

interface CartItemProps {
  item: CartItemType;
  compact?: boolean;
}

/**
 * Componente individual de producto en el carrito
 * Muestra imagen, nombre, precio, cantidad y controles
 */
const CartItem = ({ item, compact = false }: CartItemProps) => {
  const { updateQuantity, removeItem, updateNotes } = useCart();
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(item.notes || '');
  const [isRemoving, setIsRemoving] = useState(false);

  const { product, quantity } = item;

  // Calcular subtotal
  const subtotal = product.price * quantity;
  const hasDiscount = product.compare_price && product.compare_price > product.price;
  const discount = hasDiscount ? (product.compare_price! - product.price) * quantity : 0;

  // Verificar stock
  const isLowStock = product.stock <= 5;
  const isOutOfStock = product.stock === 0;
  const maxQuantity = Math.min(product.stock, 99);

  /**
   * Incrementar cantidad
   */
  const handleIncrement = () => {
    if (quantity < maxQuantity) {
      updateQuantity(product.id, quantity + 1);
    }
  };

  /**
   * Decrementar cantidad
   */
  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    }
  };

  /**
   * Cambiar cantidad directamente
   */
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= maxQuantity) {
      updateQuantity(product.id, value);
    }
  };

  /**
   * Eliminar producto del carrito con animación
   */
  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      removeItem(product.id);
    }, 300);
  };

  /**
   * Guardar notas
   */
  const handleSaveNotes = () => {
    updateNotes(product.id, notes);
    setIsEditingNotes(false);
  };

  return (
    <div
      className={`
        flex gap-4 py-4 border-b border-gray-200 last:border-b-0
        transition-all duration-300
        ${isRemoving ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
        ${compact ? 'items-start' : 'items-center'}
      `}
    >
      {/* Imagen del producto */}
      <Link
        to={ROUTES.PRODUCT_DETAIL.replace(':slug', product.slug)}
        className="flex-shrink-0 relative group"
      >
        <div className={`${compact ? 'w-16 h-16' : 'w-20 h-20'} bg-gray-100 rounded-lg overflow-hidden`}>
          {product.thumbnail ? (
            <img
              src={product.thumbnail}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Badge de descuento */}
        {hasDiscount && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-sm">
            -{Math.round(((product.compare_price! - product.price) / product.compare_price!) * 100)}%
          </div>
        )}
      </Link>

      {/* Información del producto */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Link
              to={ROUTES.PRODUCT_DETAIL.replace(':slug', product.slug)}
              className="font-medium text-gray-900 hover:text-orange-600 transition-colors line-clamp-2"
            >
              {product.name}
            </Link>

            {/* SKU y marca */}
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
              {product.brand && <span>{product.brand}</span>}
              {product.brand && product.sku && <span>•</span>}
              {product.sku && <span>SKU: {product.sku}</span>}
            </div>

            {/* Estado de stock */}
            {isOutOfStock ? (
              <div className="mt-2 inline-flex items-center text-xs font-medium text-red-600">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                Agotado
              </div>
            ) : isLowStock ? (
              <div className="mt-2 inline-flex items-center text-xs font-medium text-orange-600">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                ¡Solo quedan {product.stock}!
              </div>
            ) : (
              <div className="mt-2 text-xs text-green-600 font-medium">
                ✓ En stock ({product.stock} disponibles)
              </div>
            )}
          </div>

          {/* Precio */}
          <div className="text-right flex-shrink-0">
            <div className="font-bold text-lg text-gray-900">
              {formatPrice(product.price)}
            </div>
            {hasDiscount && (
              <div className="text-sm text-gray-400 line-through">
                {formatPrice(product.compare_price!)}
              </div>
            )}
          </div>
        </div>

        {/* Controles de cantidad y acciones */}
        <div className="flex items-center justify-between mt-3 gap-4">
          {/* Selector de cantidad */}
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={handleDecrement}
                disabled={quantity <= 1 || isOutOfStock}
                className="px-3 py-1.5 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Disminuir cantidad"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>

              <input
                type="number"
                min="1"
                max={maxQuantity}
                value={quantity}
                onChange={handleQuantityChange}
                disabled={isOutOfStock}
                className="w-12 text-center border-x border-gray-300 py-1.5 focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                aria-label="Cantidad"
              />

              <button
                onClick={handleIncrement}
                disabled={quantity >= maxQuantity || isOutOfStock}
                className="px-3 py-1.5 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Aumentar cantidad"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            {/* Subtotal */}
            {!compact && (
              <div className="text-sm">
                <span className="text-gray-500">Subtotal: </span>
                <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
                {discount > 0 && (
                  <span className="text-green-600 ml-1">(-{formatPrice(discount)})</span>
                )}
              </div>
            )}
          </div>

          {/* Botón eliminar */}
          <button
            onClick={handleRemove}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
            aria-label="Eliminar del carrito"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        {/* Notas del producto */}
        {!compact && (
          <div className="mt-3">
            {isEditingNotes ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej: Color rojo, tamaño grande..."
                  className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  autoFocus
                />
                <button
                  onClick={handleSaveNotes}
                  className="text-sm px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Guardar
                </button>
                <button
                  onClick={() => {
                    setNotes(item.notes || '');
                    setIsEditingNotes(false);
                  }}
                  className="text-sm px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingNotes(true)}
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1 group"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {item.notes ? (
                  <span className="group-hover:text-orange-600 transition-colors">
                    Nota: {item.notes}
                  </span>
                ) : (
                  <span className="group-hover:text-orange-600 transition-colors">
                    Agregar nota
                  </span>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartItem;