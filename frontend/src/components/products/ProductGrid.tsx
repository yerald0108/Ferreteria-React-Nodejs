// src/components/products/ProductGrid.tsx
import { useState } from 'react';
import ProductCard from './ProductCard';
import type { Product } from '../../types/product.types';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  emptyMessage?: string;
}

/**
 * Grid responsivo de productos con skeleton loaders
 */
const ProductGrid = ({ 
  products, 
  isLoading = false,
  emptyMessage = 'No se encontraron productos'
}: ProductGridProps) => {
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');

  if (isLoading) {
    return (
      <div>
        {/* Controles de vista */}
        <div className="flex justify-between items-center mb-6">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Skeleton Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {emptyMessage}
        </h3>
        <p className="text-gray-500 mb-6">
          Intenta ajustar tus filtros o buscar algo diferente
        </p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Limpiar filtros
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Controles superiores */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        {/* Contador */}
        <p className="text-sm text-gray-600">
          Mostrando <span className="font-semibold text-gray-900">{products.length}</span> productos
        </p>

        {/* Toggle de vista */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 mr-2">Vista:</span>
          <div className="inline-flex rounded-lg border border-gray-300 p-1 bg-white">
            <button
              onClick={() => setLayout('grid')}
              className={`
                px-3 py-1.5 rounded-md transition-all duration-200
                ${layout === 'grid'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
              aria-label="Vista en cuadrícula"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setLayout('list')}
              className={`
                px-3 py-1.5 rounded-md transition-all duration-200
                ${layout === 'list'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
              aria-label="Vista en lista"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Grid de productos */}
      <div className={
        layout === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          : 'flex flex-col gap-4'
      }>
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product}
            layout={layout}
          />
        ))}
      </div>

      {/* Indicador de más resultados */}
      {products.length >= 12 && (
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500">
            <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            Desplázate para ver más productos
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Skeleton loader para ProductCard
 */
const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
      {/* Imagen skeleton */}
      <div className="aspect-square bg-gray-200" />
      
      {/* Contenido skeleton */}
      <div className="p-4 space-y-3">
        {/* Marca */}
        <div className="h-3 w-16 bg-gray-200 rounded" />
        
        {/* Título */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
        
        {/* Rating */}
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-3.5 h-3.5 bg-gray-200 rounded" />
          ))}
        </div>
        
        {/* Precio */}
        <div className="h-6 w-24 bg-gray-200 rounded" />
      </div>
      
      {/* Botón skeleton */}
      <div className="px-4 pb-4">
        <div className="h-10 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
};

export default ProductGrid;