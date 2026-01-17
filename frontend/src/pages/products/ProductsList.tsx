// src/pages/products/ProductsList.tsx (VERSIÓN SIMPLIFICADA CON HOOK)
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  ProductGrid, 
  ProductFilters, 
  ProductSort, 
  ProductSearch 
} from '../../components/products';
import { Pagination, Breadcrumbs } from '../../components/common';
import { useProducts } from '../../hooks/useProducts';

/**
 * Página de listado de productos (versión simplificada con hook)
 */
const ProductsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Hook personalizado que maneja toda la lógica
  const {
    products,
    isLoading,
    error,
    categories,
    brands,
    priceRange,
    filters,
    updateFilters,
    page,
    setPage,
    totalProducts,
    totalPages,
    searchQuery,
    updateSearch,
    updateSort,
    clearFilters,
    activeFiltersCount,
    refetch,
  } = useProducts();

  /**
   * Sincronizar con URL params
   */
  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', page.toString());
    if (searchQuery) params.set('search', searchQuery);
    setSearchParams(params, { replace: true });
  }, [page, searchQuery, setSearchParams]);

  /**
   * Inicializar desde URL params
   */
  useEffect(() => {
    const pageParam = searchParams.get('page');
    const searchParam = searchParams.get('search');
    
    if (pageParam) setPage(parseInt(pageParam));
    if (searchParam) updateSearch(searchParam);
  }, []); // Solo al montar

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Productos' }]} className="mb-6" />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Todos los Productos
          </h1>
          <p className="text-gray-600 mb-6">
            Encuentra las mejores herramientas y materiales para tu hogar
          </p>

          {/* Búsqueda */}
          <div className="max-w-2xl">
            <ProductSearch 
              onSearch={updateSearch}
              placeholder="Buscar herramientas, pinturas, materiales..."
            />
          </div>
        </div>

        {/* Filtros activos (chips) */}
        {activeFiltersCount > 0 && (
          <ActiveFiltersBar
            searchQuery={searchQuery}
            filters={filters}
            priceRange={priceRange}
            onRemoveSearch={() => updateSearch('')}
            onRemoveCategory={(cat) => updateFilters({
              categories: filters.categories.filter(c => c !== cat)
            })}
            onRemoveBrand={(brand) => updateFilters({
              brands: filters.brands.filter(b => b !== brand)
            })}
            onRemovePrice={() => updateFilters({
              minPrice: priceRange.min,
              maxPrice: priceRange.max,
            })}
            onRemoveRating={() => updateFilters({ minRating: 0 })}
            onRemoveStock={() => updateFilters({ inStock: false })}
            onClearAll={clearFilters}
          />
        )}

        {/* Layout principal */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block lg:col-span-1">
            <ProductFilters
              categories={categories}
              brands={brands}
              priceRange={priceRange}
              onFilterChange={updateFilters}
              isLoading={isLoading}
            />
          </aside>

          {/* Contenido principal */}
          <main className="lg:col-span-3">
            {/* Header de resultados */}
            <ResultsHeader
              isLoading={isLoading}
              productsCount={products.length}
              totalProducts={totalProducts}
              activeFiltersCount={activeFiltersCount}
              onShowFilters={() => setShowMobileFilters(true)}
              onSortChange={updateSort}
            />

            {/* Error state */}
            {error && <ErrorState error={error} onRetry={refetch} />}

            {/* Grid de productos */}
            {!error && (
              <>
                <ProductGrid 
                  products={products}
                  isLoading={isLoading}
                  emptyMessage={
                    searchQuery 
                      ? `No se encontraron productos para "${searchQuery}"`
                      : 'No se encontraron productos con los filtros seleccionados'
                  }
                />

                {/* Paginación */}
                {!isLoading && totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={setPage}
                    />
                  </div>
                )}
              </>
            )}

            {/* Info adicional */}
            {!isLoading && products.length > 0 && <HelpInfo />}
          </main>
        </div>
      </div>

      {/* Drawer de filtros mobile */}
      <MobileFiltersDrawer
        show={showMobileFilters}
        categories={categories}
        brands={brands}
        priceRange={priceRange}
        onFilterChange={updateFilters}
        onClose={() => setShowMobileFilters(false)}
      />
    </div>
  );
};

/**
 * Componentes auxiliares
 */

// Barra de filtros activos
const ActiveFiltersBar = ({
  searchQuery,
  filters,
  priceRange,
  onRemoveSearch,
  onRemoveCategory,
  onRemoveBrand,
  onRemovePrice,
  onRemoveRating,
  onRemoveStock,
  onClearAll,
}: any) => (
  <div className="mb-6 flex items-center gap-2 flex-wrap">
    <span className="text-sm font-medium text-gray-700">Filtros activos:</span>
    
    {searchQuery && <FilterChip label={`Búsqueda: "${searchQuery}"`} onRemove={onRemoveSearch} />}
    {filters.categories.map((cat: string) => (
      <FilterChip key={cat} label={cat} onRemove={() => onRemoveCategory(cat)} />
    ))}
    {filters.brands.map((brand: string) => (
      <FilterChip key={brand} label={brand} onRemove={() => onRemoveBrand(brand)} />
    ))}
    {(filters.minPrice !== priceRange.min || filters.maxPrice !== priceRange.max) && (
      <FilterChip 
        label={`Precio: $${filters.minPrice} - $${filters.maxPrice}`} 
        onRemove={onRemovePrice} 
      />
    )}
    {filters.minRating > 0 && (
      <FilterChip label={`${filters.minRating}+ estrellas`} onRemove={onRemoveRating} />
    )}
    {filters.inStock && <FilterChip label="Solo en stock" onRemove={onRemoveStock} />}
    
    <button
      onClick={onClearAll}
      className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1 ml-2"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
      Limpiar todo
    </button>
  </div>
);

// Chip de filtro
const FilterChip = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
    <span>{label}</span>
    <button onClick={onRemove} className="hover:bg-orange-200 rounded-full p-0.5 transition-colors">
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
);

// Header de resultados
const ResultsHeader = ({
  isLoading,
  productsCount,
  totalProducts,
  activeFiltersCount,
  onShowFilters,
  onSortChange,
}: any) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 flex items-center justify-between gap-4 flex-wrap">
    <div className="flex items-center gap-4">
      <p className="text-sm text-gray-600">
        {isLoading ? (
          <span>Cargando...</span>
        ) : (
          <span>
            Mostrando <span className="font-semibold text-gray-900">{productsCount}</span> de{' '}
            <span className="font-semibold text-gray-900">{totalProducts}</span> productos
          </span>
        )}
      </p>

      <button
        onClick={onShowFilters}
        className="lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filtros
        {activeFiltersCount > 0 && (
          <span className="bg-white text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full">
            {activeFiltersCount}
          </span>
        )}
      </button>
    </div>

    <ProductSort onSortChange={onSortChange} />
  </div>
);

// Estado de error
const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center mb-6">
    <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <h3 className="text-lg font-semibold text-red-900 mb-2">Error al cargar productos</h3>
    <p className="text-red-700 mb-4">{error}</p>
    <button
      onClick={onRetry}
      className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
    >
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      Reintentar
    </button>
  </div>
);

// Info de ayuda
const HelpInfo = () => (
  <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
    <div className="flex items-start gap-3">
      <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
      <div>
        <h4 className="text-sm font-semibold text-blue-900 mb-1">
          ¿No encuentras lo que buscas?
        </h4>
        <p className="text-sm text-blue-800">
          Intenta ajustar los filtros o usa términos de búsqueda diferentes. 
          Si necesitas ayuda, <a href="/contact" className="font-medium underline hover:text-blue-900">contáctanos</a>.
        </p>
      </div>
    </div>
  </div>
);

// Drawer de filtros mobile
const MobileFiltersDrawer = ({ show, categories, brands, priceRange, onFilterChange, onClose }: any) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="absolute inset-y-0 left-0 w-full sm:w-96 bg-white shadow-2xl overflow-y-auto">
        <ProductFilters
          categories={categories}
          brands={brands}
          priceRange={priceRange}
          onFilterChange={onFilterChange}
          isMobile
          onClose={onClose}
        />
      </div>
    </div>
  );
};

export default ProductsList;