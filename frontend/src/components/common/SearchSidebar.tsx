// frontend/src/components/common/SearchSidebar.tsx
import { useState, useRef, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce';
import { productsApi } from '../../api/products.api';
import { ROUTES } from '../../utils/constants';
import { formatPrice } from '../../utils/formatters';
import type { Product } from '../../types/product.types';

interface SearchSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchSidebar = ({ isOpen, onClose }: SearchSidebarProps) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cargar búsquedas recientes
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Auto-focus cuando se abre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Buscar productos
  useEffect(() => {
    const searchProducts = async () => {
      if (debouncedQuery.trim().length < 2) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await productsApi.search(debouncedQuery, { limit: 8 });
        
        // Validar que response.data sea un array
        const products = Array.isArray(response.data) ? response.data : [];
        setResults(products);
      } catch (error) {
        console.error('Error searching:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    searchProducts();
  }, [debouncedQuery]);

  // Navegación con teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault();
        const product = results[selectedIndex];
        if (product) {
          saveRecentSearch(query);
          window.location.href = ROUTES.PRODUCT_DETAIL.replace(':slug', product.slug);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, results, query, onClose]);

  const saveRecentSearch = (search: string) => {
    const updated = [search, ...recentSearches.filter(s => s !== search)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const handleSearchClick = (searchTerm: string) => {
    setQuery(searchTerm);
    saveRecentSearch(searchTerm);
    onClose();
    window.location.href = `${ROUTES.PRODUCTS}?search=${encodeURIComponent(searchTerm)}`;
  };

  const handleProductClick = (product: Product) => {
    saveRecentSearch(query);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-out flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Buscar Productos
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Cerrar búsqueda"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Input de búsqueda */}
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar herramientas, pinturas, materiales..."
              className="w-full pl-12 pr-12 py-4 rounded-xl border-0 shadow-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-white/30 text-lg"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Keyboard hint */}
          <p className="text-white/80 text-xs mt-3 flex items-center gap-1">
            <kbd className="px-2 py-0.5 bg-white/20 rounded text-xs">ESC</kbd>
            para cerrar
            <span className="mx-2">•</span>
            <kbd className="px-2 py-0.5 bg-white/20 rounded text-xs">↑↓</kbd>
            navegar
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Loading */}
          {isLoading && (
            <div className="p-8 text-center">
              <div className="inline-flex items-center gap-3">
                <svg className="animate-spin h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="text-gray-600">Buscando...</span>
              </div>
            </div>
          )}

          {/* Resultados */}
          {!isLoading && query.length >= 2 && results.length > 0 && (
            <div>
              <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-700">
                  {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div>
                {results.map((product, index) => (
                  <Link
                    key={product.id}
                    to={ROUTES.PRODUCT_DETAIL.replace(':slug', product.slug)}
                    onClick={() => handleProductClick(product)}
                    className={`flex items-center gap-4 p-4 border-b border-gray-100 transition-all duration-200 ${
                      selectedIndex === index
                        ? 'bg-orange-50 border-l-4 border-l-orange-500'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {/* Imagen */}
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {product.thumbnail ? (
                        <img
                          src={product.thumbnail}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 line-clamp-2 mb-1">
                        {product.name}
                      </h4>
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {product.brand && `${product.brand} • `}
                        {product.category}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-lg font-bold text-orange-600">
                          {formatPrice(product.price)}
                        </span>
                        {product.stock > 0 ? (
                          <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
                            En stock
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">
                            Agotado
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Arrow */}
                    <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>

              {/* Ver todos */}
              <Link
                to={`${ROUTES.PRODUCTS}?search=${encodeURIComponent(query)}`}
                onClick={() => {
                  saveRecentSearch(query);
                  onClose();
                }}
                className="block p-4 text-center text-orange-600 hover:bg-orange-50 font-medium transition-colors border-t border-gray-200"
              >
                Ver todos los resultados →
              </Link>
            </div>
          )}

          {/* Sin resultados */}
          {!isLoading && query.length >= 2 && results.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No se encontraron resultados
              </h3>
              <p className="text-gray-600 text-sm">
                Intenta con otros términos de búsqueda
              </p>
            </div>
          )}

          {/* Búsquedas recientes */}
          {!query && recentSearches.length > 0 && (
            <div className="py-4">
              <div className="px-6 py-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Búsquedas recientes
                </h3>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-orange-600 hover:text-orange-700 font-medium"
                >
                  Limpiar
                </button>
              </div>
              <div>
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearchClick(search)}
                    className="w-full flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors text-left group"
                  >
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="flex-1 text-gray-700 group-hover:text-gray-900">
                      {search}
                    </span>
                    <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sugerencias populares */}
          {!query && (
            <div className="py-4 border-t border-gray-200">
              <div className="px-6 py-2">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  Búsquedas populares
                </h3>
              </div>
              <div className="px-6 flex flex-wrap gap-2">
                {['Martillo', 'Taladro', 'Pintura', 'Destornillador', 'Sierra', 'Llave inglesa'].map((term, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearchClick(term)}
                    className="px-4 py-2 bg-gray-100 hover:bg-orange-100 text-gray-700 hover:text-orange-700 rounded-full text-sm font-medium transition-all duration-200 hover:shadow-md"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchSidebar;