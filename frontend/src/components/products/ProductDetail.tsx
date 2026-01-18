// frontend/src/pages/products/ProductDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productsApi } from '../../api/products.api';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { formatPrice } from '../../utils/formatters';
import { ROUTES } from '../../utils/constants';
import { Breadcrumbs, LoadingSpinner, Button } from '../../components/common';
import ProductImageGallery from '../../components/products/ProductImageGallery';
import ProductReviews from '../../components/products/ProductReviews';
import type { Product } from '../../types/product.types';

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart, isInCart, openCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState<'description' | 'specs' | 'reviews'>('description');
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Cargar producto
  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;

      setIsLoading(true);
      setError(null);

      try {
        const [productData, relatedData] = await Promise.all([
          productsApi.getProductById(slug),
          productsApi.getRelated(0, 4).catch(() => []), // Temporal hasta tener el ID
        ]);

        setProduct(productData);
        
        // Cargar productos relacionados con el ID real
        if (productData.id) {
          const related = await productsApi.getRelated(productData.id, 4);
          setRelatedProducts(related);
        }
      } catch (err: any) {
        setError(err.message || 'Error al cargar el producto');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  // Scroll to top al cambiar de producto
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  /**
   * Agregar al carrito
   */
  const handleAddToCart = () => {
    if (!product) return;

    setIsAddingToCart(true);
    
    setTimeout(() => {
      const success = addToCart(product, quantity);
      setIsAddingToCart(false);
      
      if (success) {
        openCart();
      }
    }, 300);
  };

  /**
   * Comprar ahora (agregar y redirigir al checkout)
   */
  const handleBuyNow = () => {
    if (!product) return;

    const success = addToCart(product, quantity);
    if (success) {
      navigate(ROUTES.CHECKOUT);
    }
  };

  // Loading state
  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  // Error state
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Producto no encontrado</h2>
          <p className="text-gray-600 mb-6">{error || 'El producto que buscas no existe'}</p>
          <Link to={ROUTES.PRODUCTS}>
            <Button>Volver a productos</Button>
          </Link>
        </div>
      </div>
    );
  }

  const inCart = isInCart(product.id);
  const hasDiscount = product.compare_price && product.compare_price > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.compare_price! - product.price) / product.compare_price!) * 100)
    : 0;
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const maxQuantity = Math.min(product.stock, 10);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Productos', path: ROUTES.PRODUCTS },
            { label: product.category, path: `/category/${product.category}` },
            { label: product.name },
          ]}
          className="mb-6"
        />

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Galería de imágenes */}
          <div className="bg-white rounded-lg p-6 sticky top-4 self-start">
            <ProductImageGallery
              images={product.images}
              productName={product.name}
              thumbnail={product.thumbnail}
            />

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <svg className="w-8 h-8 text-green-600 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-xs font-medium text-gray-700">Compra Segura</p>
              </div>
              <div className="text-center">
                <svg className="w-8 h-8 text-blue-600 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                </svg>
                <p className="text-xs font-medium text-gray-700">Envío Gratis</p>
              </div>
              <div className="text-center">
                <svg className="w-8 h-8 text-orange-600 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <p className="text-xs font-medium text-gray-700">Entrega Rápida</p>
              </div>
            </div>
          </div>

          {/* Información del producto */}
          <div className="bg-white rounded-lg p-6">
            {/* Marca */}
            {product.brand && (
              <p className="text-sm font-semibold text-orange-600 uppercase tracking-wide mb-2">
                {product.brand}
              </p>
            )}

            {/* Título */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            {/* Rating y ventas */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
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
                <span className="text-sm font-medium text-gray-700">
                  {Number(product.rating_average || 0).toFixed(1)} ({product.rating_count} reseñas)
                </span>
              </div>

              {product.sales_count > 0 && (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                  </svg>
                  {product.sales_count} vendidos
                </div>
              )}
            </div>

            {/* Precio */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      {formatPrice(product.compare_price!)}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 text-sm font-bold rounded-full">
                      -{discountPercentage}% OFF
                    </span>
                  </>
                )}
              </div>

              {hasDiscount && (
                <p className="text-sm text-green-600 font-medium">
                  ¡Ahorras {formatPrice(product.compare_price! - product.price)}!
                </p>
              )}
            </div>

            {/* Short description */}
            {product.short_description && (
              <p className="text-gray-700 mb-6 leading-relaxed">
                {product.short_description}
              </p>
            )}

            {/* Stock status */}
            <div className="mb-6">
              {isOutOfStock ? (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-lg">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">Agotado</span>
                </div>
              ) : isLowStock ? (
                <div className="flex items-center gap-2 text-orange-600 bg-orange-50 px-4 py-3 rounded-lg">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">¡Solo quedan {product.stock} disponibles!</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-3 rounded-lg">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">En stock ({product.stock} disponibles)</span>
                </div>
              )}
            </div>

            {/* Selector de cantidad */}
            {!isOutOfStock && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cantidad
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-3 hover:bg-gray-100 transition-colors"
                      disabled={quantity <= 1}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>

                    <input
                      type="number"
                      min="1"
                      max={maxQuantity}
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val) && val >= 1 && val <= maxQuantity) {
                          setQuantity(val);
                        }
                      }}
                      className="w-16 text-center text-lg font-semibold border-x-2 border-gray-300 py-2 focus:outline-none"
                    />

                    <button
                      onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                      className="px-4 py-3 hover:bg-gray-100 transition-colors"
                      disabled={quantity >= maxQuantity}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>

                  <span className="text-sm text-gray-600">
                    Máximo: {maxQuantity}
                  </span>
                </div>
              </div>
            )}

            {/* Botones de acción */}
            <div className="space-y-3 mb-6">
              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAddingToCart}
                fullWidth
                size="lg"
                isLoading={isAddingToCart}
                className={inCart ? 'bg-green-500 hover:bg-green-600' : ''}
              >
                {isOutOfStock ? (
                  'Agotado'
                ) : inCart ? (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    En el carrito
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Agregar al carrito
                  </>
                )}
              </Button>

              {!isOutOfStock && (
                <Button
                  onClick={handleBuyNow}
                  variant="secondary"
                  fullWidth
                  size="lg"
                >
                  Comprar ahora
                </Button>
              )}
            </div>

            {/* Info adicional */}
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900">SKU: {product.sku}</p>
                  <p className="text-gray-600">Categoría: {product.category}</p>
                </div>
              </div>

              {product.tags && product.tags.length > 0 && (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs de información */}
        <div className="bg-white rounded-lg mb-12">
          {/* Tab headers */}
          <div className="border-b border-gray-200">
            <div className="flex gap-8 px-6">
              <button
                onClick={() => setSelectedTab('description')}
                className={`py-4 border-b-2 font-medium transition-colors ${
                  selectedTab === 'description'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Descripción
              </button>
              <button
                onClick={() => setSelectedTab('specs')}
                className={`py-4 border-b-2 font-medium transition-colors ${
                  selectedTab === 'specs'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Especificaciones
              </button>
              <button
                onClick={() => setSelectedTab('reviews')}
                className={`py-4 border-b-2 font-medium transition-colors ${
                  selectedTab === 'reviews'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Reseñas ({product.rating_count})
              </button>
            </div>
          </div>

          {/* Tab content */}
          <div className="p-6">
            {selectedTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {selectedTab === 'specs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.features && Object.keys(product.features).length > 0 ? (
                  Object.entries(product.features).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700 capitalize">
                        {key.replace(/_/g, ' ')}:
                      </span>
                      <span className="text-gray-900">{String(value)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 col-span-2">No hay especificaciones disponibles</p>
                )}
              </div>
            )}

            {selectedTab === 'reviews' && (
              <ProductReviews
                reviews={product.reviews || []}
                productId={product.id}
                averageRating={Number(product.rating_average || 0)}
                totalReviews={product.rating_count}
              />
            )}
          </div>
        </div>

        {/* Productos relacionados */}
        {relatedProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Productos relacionados
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={ROUTES.PRODUCT_DETAIL.replace(':slug', relatedProduct.slug)}
                  className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                    {relatedProduct.thumbnail ? (
                      <img
                        src={relatedProduct.thumbnail}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 mb-2">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-lg font-bold text-gray-900">
                      {formatPrice(relatedProduct.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>