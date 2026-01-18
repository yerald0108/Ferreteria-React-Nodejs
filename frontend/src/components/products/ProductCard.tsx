// src/components/products/ProductCard.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../utils/formatters';
import { ROUTES } from '../../utils/constants';
import type { Product } from '../../types/product.types';

interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'list';
}

/**
 * Tarjeta de producto con diseño moderno y animaciones
 * Soporta vista de grid y lista
 */
const ProductCard = ({ product, layout = 'grid' }: ProductCardProps) => {
  const { addToCart, openCart, isInCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const inCart = isInCart(product.id);
  const hasDiscount = product.compare_price && product.compare_price > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.compare_price! - product.price) / product.compare_price!) * 100)
    : 0;

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  /**
   * Agregar al carrito con animación
   */
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;

    setIsAdding(true);
    
    const success = addToCart(product, 1);
    
    if (success) {
      setTimeout(() => {
        setIsAdding(false);
        openCart();
      }, 600);
    } else {
      setIsAdding(false);
    }
  };

  /**
   * Toggle wishlist
   */
  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
    // TODO: Integrar con API de wishlist
  };

  if (layout === 'list') {
    return (
      <Link
        to={ROUTES.PRODUCT_DETAIL.replace(':slug', product.slug)}
        className="flex gap-4 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group"
      >
        {/* Imagen */}
        <div className="relative w-48 h-48 flex-shrink-0 bg-gray-100">
          {!imageError && product.thumbnail ? (
            <img
              src={product.thumbnail}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {hasDiscount && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                -{discountPercentage}%
              </span>
            )}
            {product.is_featured && (
              <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                ⭐ Destacado
              </span>
            )}
            {isOutOfStock && (
              <span className="bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                Agotado
              </span>
            )}
          </div>
        </div>

        {/* Contenido */}
        <div className="flex-1 p-4 flex flex-col">
          {/* Header */}
          <div className="flex-1">
            {product.brand && (
              <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide mb-1">
                {product.brand}
              </p>
            )}
            
            <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 mb-2">
              {product.name}
            </h3>

            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {product.short_description || product.description}
            </p>

            {/* Rating y ventas - Vista Lista */}
            <div className="flex items-center gap-4 text-sm mb-3">
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(Number(product.rating_average) || 0)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                ))}
                </div>
              <span className="text-gray-600">
                {Number(product.rating_average || 0).toFixed(1)} ({product.rating_count})
              </span>
            </div>
  
  {product.sales_count > 0 && (
    <span className="text-gray-500">
      {product.sales_count} vendidos
    </span>
  )}
</div>

            {/* Stock */}
            {isLowStock && !isOutOfStock && (
              <div className="inline-flex items-center text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full mb-3">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                ¡Solo {product.stock} disponibles!
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(product.compare_price!)}
                  </span>
                )}
              </div>
              {hasDiscount && (
                <p className="text-xs text-green-600 font-medium">
                  Ahorras {formatPrice(product.compare_price! - product.price)}
                </p>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAdding}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all duration-300
                ${isOutOfStock
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : inCart
                  ? 'bg-green-500 text-white'
                  : 'bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg hover:-translate-y-0.5'
                }
                ${isAdding ? 'scale-95' : 'scale-100'}
              `}
            >
              {isOutOfStock ? 'Agotado' : inCart ? '✓ En carrito' : 'Agregar'}
            </button>
          </div>
        </div>
      </Link>
    );
  }

  // Grid Layout (Default)
  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <Link to={ROUTES.PRODUCT_DETAIL.replace(':slug', product.slug)} className="block">
        {/* Imagen */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          {!imageError && product.thumbnail ? (
            <img
              src={product.thumbnail}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Badges superiores */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {hasDiscount && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                -{discountPercentage}%
              </span>
            )}
            {product.is_featured && (
              <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                ⭐ Destacado
              </span>
            )}
          </div>

          {/* Botón wishlist */}
          <button
            onClick={handleToggleWishlist}
            className={`
              absolute top-2 right-2 z-10 p-2 rounded-full backdrop-blur-sm
              transition-all duration-300 opacity-0 group-hover:opacity-100
              ${isWishlisted 
                ? 'bg-red-500 text-white scale-110' 
                : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
              }
            `}
            aria-label="Agregar a favoritos"
          >
            <svg className="w-5 h-5" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* Quick view button */}
          <button
            className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 px-4 py-2 bg-white rounded-full shadow-lg font-medium text-sm transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 hover:bg-orange-500 hover:text-white"
            onClick={(e) => {
              e.preventDefault();
              // TODO: Implementar quick view modal
            }}
          >
            Vista rápida
          </button>

          {/* Overlay de agotado */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <span className="bg-gray-900 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                Agotado
              </span>
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="p-4">
          {/* Marca */}
          {product.brand && (
            <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide mb-1">
              {product.brand}
            </p>
          )}

          {/* Nombre */}
          <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 min-h-[2.5rem] mb-2">
            {product.name}
          </h3>


          {/* Rating y ventas */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(Number(product.rating_average) || 0)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-500">
              {Number(product.rating_average || 0).toFixed(1)} ({product.rating_count})
            </span>
          </div>

          {/* Stock */}
          {isLowStock && !isOutOfStock && (
            <div className="flex items-center text-xs font-medium text-orange-600 mb-3">
              <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              ¡Solo {product.stock}!
            </div>
          )}

          {/* Precio */}
          <div className="mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.compare_price!)}
                </span>
              )}
            </div>
            {hasDiscount && (
              <p className="text-xs text-green-600 font-medium mt-0.5">
                Ahorras {formatPrice(product.compare_price! - product.price)}
              </p>
            )}
          </div>
        </div>
      </Link>

      {/* Botón agregar al carrito */}
      <div className="px-4 pb-4">
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAdding}
          className={`
            w-full py-2.5 rounded-lg font-medium transition-all duration-300
            flex items-center justify-center gap-2
            ${isOutOfStock
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : inCart
              ? 'bg-green-500 text-white'
              : 'bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg hover:-translate-y-0.5'
            }
            ${isAdding ? 'scale-95' : 'scale-100'}
          `}
        >
          {isAdding ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Agregando...
            </>
          ) : isOutOfStock ? (
            'Agotado'
          ) : inCart ? (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              En el carrito
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Agregar al carrito
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;