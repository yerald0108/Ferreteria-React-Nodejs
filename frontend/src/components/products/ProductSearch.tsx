// src/components/products/ProductSearch.tsx
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce';
import { productsApi } from '../../api/products.api';
import { ROUTES } from '../../utils/constants';
import { formatPrice } from '../../utils/formatters';
import type { Product } from '../../types/product.types';

interface ProductSearchProps {
  placeholder?: string;
  autoFocus?: boolean;
  onSearch?: (query: string) => void;
}

/**
 * Componente de búsqueda con autocompletado y sugerencias
 */
const ProductSearch = ({ 
  placeholder = 'Buscar productos...', 
  autoFocus = false,
  onSearch 
}: ProductSearchProps) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularSearches] = useState([
    'Martillo',
    'Taladro',
    'Pintura',
    'Destornillador',
    'Llave inglesa',
  ]);

  const debouncedQuery = useDebounce(query, 300);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Cargar búsquedas recientes del localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Buscar productos cuando cambia el query
  useEffect(() => {
    const searchProducts = async () => {
      if (debouncedQuery.trim().length < 2) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await productsApi.search(debouncedQuery, { limit: 5 });
        setResults(response.data || []);
      } catch (error) {
        console.error('Error searching products:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    searchProducts();
  }, [debouncedQuery]);

  /**
   * Manejar envío del formulario
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      saveRecentSearch(query.trim());
      setIsOpen(false);
      if (onSearch) {
        onSearch(query.trim());
      } else {
        navigate(`${ROUTES.PRODUCTS}?search=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  /**
   * Guardar búsqueda reciente
   */
  const saveRecentSearch = (search: string) => {
    const updated = [search, ...recentSearches.filter(s => s !== search)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  /**
   * Limpiar búsquedas recientes
   */
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  /**
   * Manejar click en sugerencia
   */
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    saveRecentSearch(suggestion);
    setIsOpen(false);
    if (onSearch) {
      onSearch(suggestion);
    } else {
      navigate(`${ROUTES.PRODUCTS}?search=${encodeURIComponent(suggestion)}`);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      {/* Input de búsqueda */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
          />
          
          {/* Icono de búsqueda */}
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>

          {/* Botón limpiar */}
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setResults([]);
                inputRef.current?.focus();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Limpiar búsqueda"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </form>

      {/* Dropdown de resultados */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 max-h-[500px] overflow-y-auto z-50">
          {/* Loading state */}
          {isLoading && (
            <div className="p-8 text-center">
              <svg className="animate-spin h-8 w-8 text-orange-500 mx-auto" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-sm text-gray-500 mt-2">Buscando...</p>
            </div>
          )}

          {/* Resultados de productos */}
          {!isLoading && results.length > 0 && (
            <div>
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Productos ({results.length})
                </p>
              </div>
              <div className="divide-y divide-gray-100">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    to={ROUTES.PRODUCT_DETAIL.replace(':slug', product.slug)}
                    onClick={() => {
                      saveRecentSearch(query);
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors group"
                  >
                    {/* Imagen */}
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {product.thumbnail ? (
                        <img 
                          src={product.thumbnail} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                        {product.name}
                      </h4>
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {product.brand && `${product.brand} • `}
                        {product.category}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold text-orange-600">
                          {formatPrice(product.price)}
                        </span>
                        {product.stock > 0 ? (
                          <span className="text-xs text-green-600">En stock</span>
                        ) : (
                          <span className="text-xs text-red-600">Agotado</span>
                        )}
                      </div>
                    </div>

                    {/* Arrow */}
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>

              {/* Ver todos los resultados */}
              <Link
                to={`${ROUTES.PRODUCTS}?search=${encodeURIComponent(query)}`}
                onClick={() => {
                  saveRecentSearch(query);
                  setIsOpen(false);
                }}
                className="block p-3 text-center text-sm font-medium text-orange-600 hover:bg-orange-50 border-t border-gray-200 transition-colors"
              >
                Ver todos los resultados para "{query}"
              </Link>
            </div>
          )}

          {/* Sin resultados */}
          {!isLoading && query.length >= 2 && results.length === 0 && (
            <div className="p-8 text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium text-gray-900 mb-1">
                No se encontraron resultados
              </p>
              <p className="text-sm text-gray-500">
                Intenta con otros términos de búsqueda
              </p>
            </div>
          )}

          {/* Búsquedas recientes */}
          {!query && recentSearches.length > 0 && (
            <div>
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Búsquedas recientes
                </p>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-orange-600 hover:text-orange-700 font-medium"
                >
                  Limpiar
                </button>
              </div>
              <div className="divide-y divide-gray-100">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(search)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left group"
                  >
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-orange-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="flex-1 text-sm text-gray-700 group-hover:text-gray-900">
                      {search}
                    </span>
                    <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Búsquedas populares */}
          {!query && (
            <div>
              <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Búsquedas populares
                </p>
              </div>
              <div className="p-3 flex flex-wrap gap-2">
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(search)}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-orange-100 text-sm text-gray-700 hover:text-orange-700 rounded-full transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Atajo de teclado */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              Presiona <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">Enter</kbd> para buscar
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSearch;