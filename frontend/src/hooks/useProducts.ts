// src/hooks/useProducts.ts
import { useState, useEffect, useCallback } from 'react';
import { productsApi } from '../api/products.api';
import { categoriesApi } from '../api/categories.api';
import type { Product, Category, BrandCount, PriceRange } from '../types/product.types';
import type { SearchParams } from '../types/api.types';

interface UseProductsOptions {
  initialPage?: number;
  initialLimit?: number;
  initialSortBy?: string;
  initialOrder?: 'ASC' | 'DESC';
  autoFetch?: boolean;
}

interface ProductFilters {
  categories: string[];
  brands: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStock: boolean;
}

/**
 * Hook personalizado para manejar productos, filtros y paginación
 * 
 * @example
 * const {
 *   products,
 *   isLoading,
 *   filters,
 *   setFilters,
 *   page,
 *   setPage,
 *   totalPages,
 *   fetchProducts
 * } = useProducts();
 */
export const useProducts = (options: UseProductsOptions = {}) => {
  const {
    initialPage = 1,
    initialLimit = 12,
    initialSortBy = 'createdAt',
    initialOrder = 'DESC',
    autoFetch = true,
  } = options;

  // Estados principales
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Datos para filtros
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<BrandCount[]>([]);
  const [priceRange, setPriceRange] = useState<PriceRange>({ min: 0, max: 1000 });

  // Paginación
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(initialLimit);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Ordenamiento
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [order, setOrder] = useState<'ASC' | 'DESC'>(initialOrder);

  // Búsqueda
  const [searchQuery, setSearchQuery] = useState('');

  // Filtros
  const [filters, setFilters] = useState<ProductFilters>({
    categories: [],
    brands: [],
    minPrice: 0,
    maxPrice: 1000,
    minRating: 0,
    inStock: false,
  });

  /**
   * Cargar datos iniciales (categorías, marcas, rango de precios)
   */
  const fetchInitialData = useCallback(async () => {
    try {
      const [categoriesRes, brandsRes, priceRangeRes] = await Promise.all([
        categoriesApi.getCategories(),
        productsApi.getBrands(),
        productsApi.getPriceRange(),
      ]);

      setCategories(categoriesRes);
      setBrands(brandsRes);
      setPriceRange(priceRangeRes);
      
      // Inicializar filtros de precio con el rango real
      setFilters(prev => ({
        ...prev,
        minPrice: priceRangeRes.min,
        maxPrice: priceRangeRes.max,
      }));
    } catch (err) {
      console.error('Error cargando datos iniciales:', err);
    }
  }, []);

  /**
   * Cargar productos
   */
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Construir params para la API
      const params: SearchParams = {
        page,
        limit,
        sortBy,
        order,
      };

      // Agregar búsqueda
      if (searchQuery) {
        params.search = searchQuery;
      }

      // Agregar filtros
      if (filters.categories.length > 0) {
        params.categories = filters.categories.join(',');
      }
      if (filters.brands.length > 0) {
        params.brands = filters.brands.join(',');
      }
      if (filters.minPrice > priceRange.min || filters.maxPrice < priceRange.max) {
        params.minPrice = filters.minPrice;
        params.maxPrice = filters.maxPrice;
      }
      if (filters.minRating > 0) {
        params.minRating = filters.minRating;
      }
      if (filters.inStock) {
        params.inStock = true;
      }

      const response = await productsApi.getProducts(params);

      setProducts(response.data || []);
      setTotalProducts(response.total || 0);
      setTotalPages(response.totalPages || 1);

    } catch (err: any) {
      console.error('Error cargando productos:', err);
      setError(err.message || 'Error al cargar productos');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, sortBy, order, searchQuery, filters, priceRange]);

  /**
   * Cargar datos iniciales al montar
   */
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  /**
   * Cargar productos cuando cambian dependencias
   */
  useEffect(() => {
    if (autoFetch) {
      fetchProducts();
    }
  }, [fetchProducts, autoFetch]);

  /**
   * Actualizar filtros y resetear a página 1
   */
  const updateFilters = useCallback((newFilters: Partial<ProductFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1);
  }, []);

  /**
   * Actualizar ordenamiento y resetear a página 1
   */
  const updateSort = useCallback((newSortBy: string, newOrder: 'ASC' | 'DESC') => {
    setSortBy(newSortBy);
    setOrder(newOrder);
    setPage(1);
  }, []);

  /**
   * Actualizar búsqueda y resetear a página 1
   */
  const updateSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1);
  }, []);

  /**
   * Limpiar todos los filtros
   */
  const clearFilters = useCallback(() => {
    setFilters({
      categories: [],
      brands: [],
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      minRating: 0,
      inStock: false,
    });
    setSearchQuery('');
    setPage(1);
  }, [priceRange]);

  /**
   * Contar filtros activos
   */
  const activeFiltersCount = 
    filters.categories.length +
    filters.brands.length +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.inStock ? 1 : 0) +
    (searchQuery ? 1 : 0) +
    (filters.minPrice !== priceRange.min || filters.maxPrice !== priceRange.max ? 1 : 0);

  return {
    // Datos
    products,
    categories,
    brands,
    priceRange,
    
    // Estados
    isLoading,
    error,
    
    // Paginación
    page,
    setPage,
    totalProducts,
    totalPages,
    limit,
    
    // Ordenamiento
    sortBy,
    order,
    updateSort,
    
    // Búsqueda
    searchQuery,
    updateSearch,
    
    // Filtros
    filters,
    setFilters,
    updateFilters,
    clearFilters,
    activeFiltersCount,
    
    // Acciones
    fetchProducts,
    refetch: fetchProducts,
  };
};

/**
 * EJEMPLO DE USO:
 * 
 * const ProductsList = () => {
 *   const {
 *     products,
 *     isLoading,
 *     categories,
 *     brands,
 *     priceRange,
 *     filters,
 *     updateFilters,
 *     page,
 *     setPage,
 *     totalPages,
 *     updateSort,
 *     updateSearch,
 *     clearFilters,
 *     activeFiltersCount,
 *   } = useProducts();
 * 
 *   return (
 *     <div>
 *       <ProductSearch onSearch={updateSearch} />
 *       <ProductFilters 
 *         categories={categories}
 *         brands={brands}
 *         priceRange={priceRange}
 *         onFilterChange={updateFilters}
 *       />
 *       <ProductSort onSortChange={updateSort} />
 *       <ProductGrid products={products} isLoading={isLoading} />
 *       <Pagination 
 *         currentPage={page}
 *         totalPages={totalPages}
 *         onPageChange={setPage}
 *       />
 *     </div>
 *   );
 * };
 */