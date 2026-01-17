// src/components/products/ProductFilters.tsx
import { useState, useEffect } from 'react';
import type { Category, BrandCount, PriceRange } from '../../types/product.types';

interface FilterState {
  categories: string[];
  brands: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStock: boolean;
}

interface ProductFiltersProps {
  categories?: Category[];
  brands?: BrandCount[];
  priceRange?: PriceRange;
  onFilterChange: (filters: FilterState) => void;
  isLoading?: boolean;
  isMobile?: boolean;
  onClose?: () => void;
}

/**
 * Sidebar de filtros de productos con acordeones colapsables
 */
const ProductFilters = ({
  categories = [],
  brands = [],
  priceRange = { min: 0, max: 1000 },
  onFilterChange,
  isLoading = false,
  isMobile = false,
  onClose,
}: ProductFiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    minPrice: priceRange.min,
    maxPrice: priceRange.max,
    minRating: 0,
    inStock: false,
  });

  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    brands: true,
    price: true,
    rating: true,
    stock: true,
  });

  // Actualizar cuando cambia el filtro
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  /**
   * Toggle sección expandida
   */
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  /**
   * Toggle categoría
   */
  const toggleCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category],
    }));
  };

  /**
   * Toggle marca
   */
  const toggleBrand = (brand: string) => {
    setFilters(prev => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand],
    }));
  };

  /**
   * Actualizar precio
   */
  const updatePrice = (type: 'min' | 'max', value: number) => {
    setFilters(prev => ({
      ...prev,
      [type === 'min' ? 'minPrice' : 'maxPrice']: value,
    }));
  };

  /**
   * Limpiar todos los filtros
   */
  const clearAllFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      minRating: 0,
      inStock: false,
    });
  };

  /**
   * Contar filtros activos
   */
  const activeFiltersCount = 
    filters.categories.length +
    filters.brands.length +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.inStock ? 1 : 0) +
    (filters.minPrice !== priceRange.min || filters.maxPrice !== priceRange.max ? 1 : 0);

  return (
    <div className={`
      bg-white
      ${isMobile ? 'h-full overflow-y-auto' : 'rounded-lg border border-gray-200 sticky top-4'}
    `}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <h3 className="font-bold text-gray-900">
            Filtros
          </h3>
          {activeFiltersCount > 0 && (
            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              Limpiar
            </button>
          )}
          {isMobile && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded"
              aria-label="Cerrar filtros"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Contenido de filtros */}
      <div className="divide-y divide-gray-200">
        {/* Categorías */}
        {categories.length > 0 && (
          <FilterSection
            title="Categorías"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            }
            isExpanded={expandedSections.categories}
            onToggle={() => toggleSection('categories')}
            count={filters.categories.length}
          >
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category.name)}
                    onChange={() => toggleCategory(category.name)}
                    className="w-4 h-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500"
                  />
                  <span className="flex-1 text-sm text-gray-700 group-hover:text-gray-900">
                    {category.name}
                  </span>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {category.products_count}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Marcas */}
        {brands.length > 0 && (
          <FilterSection
            title="Marcas"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            }
            isExpanded={expandedSections.brands}
            onToggle={() => toggleSection('brands')}
            count={filters.brands.length}
          >
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {brands.map((brand) => (
                <label
                  key={brand.brand}
                  className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(brand.brand)}
                    onChange={() => toggleBrand(brand.brand)}
                    className="w-4 h-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500"
                  />
                  <span className="flex-1 text-sm text-gray-700 group-hover:text-gray-900">
                    {brand.brand}
                  </span>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {brand.count}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Rango de Precio */}
        <FilterSection
          title="Precio"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          isExpanded={expandedSections.price}
          onToggle={() => toggleSection('price')}
        >
          <div className="space-y-4">
            {/* Inputs de precio */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Mínimo</label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => updatePrice('min', Number(e.target.value))}
                  min={priceRange.min}
                  max={filters.maxPrice}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="$0"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Máximo</label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => updatePrice('max', Number(e.target.value))}
                  min={filters.minPrice}
                  max={priceRange.max}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="$1000"
                />
              </div>
            </div>

            {/* Range slider */}
            <div className="space-y-2">
              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                value={filters.maxPrice}
                onChange={(e) => updatePrice('max', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>${priceRange.min}</span>
                <span>${priceRange.max}</span>
              </div>
            </div>
          </div>
        </FilterSection>

        {/* Calificación */}
        <FilterSection
          title="Calificación"
          icon={
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          }
          isExpanded={expandedSections.rating}
          onToggle={() => toggleSection('rating')}
        >
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <label
                key={rating}
                className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer group"
              >
                <input
                  type="radio"
                  name="rating"
                  checked={filters.minRating === rating}
                  onChange={() => setFilters(prev => ({ ...prev, minRating: rating }))}
                  className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                />
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  ))}
                  <span className="text-sm text-gray-600 ml-1">y más</span>
                </div>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Disponibilidad */}
        <FilterSection
          title="Disponibilidad"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          isExpanded={expandedSections.stock}
          onToggle={() => toggleSection('stock')}
        >
          <label className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))}
              className="w-4 h-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500"
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900">
              Solo productos en stock
            </span>
          </label>
        </FilterSection>
      </div>

      {/* Footer para mobile */}
      {isMobile && (
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3">
          <button
            onClick={clearAllFilters}
            className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Limpiar
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
          >
            Aplicar filtros
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * Sección de filtro colapsable
 */
interface FilterSectionProps {
  title: string;
  icon: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  count?: number;
  children: React.ReactNode;
}

const FilterSection = ({
  title,
  icon,
  isExpanded,
  onToggle,
  count,
  children,
}: FilterSectionProps) => {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-gray-600">{icon}</span>
          <span className="font-medium text-gray-900">{title}</span>
          {count !== undefined && count > 0 && (
            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {count}
            </span>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        className={`
          overflow-hidden transition-all duration-300
          ${isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="px-4 pb-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;