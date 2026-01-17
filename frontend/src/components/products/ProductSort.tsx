// src/components/products/ProductSort.tsx
import { useState, useRef, useEffect } from 'react';

export interface SortOption {
  label: string;
  value: string;
  sortBy: string;
  order: 'ASC' | 'DESC';
}

const SORT_OPTIONS: SortOption[] = [
  { label: 'Más relevantes', value: 'relevant', sortBy: 'createdAt', order: 'DESC' },
  { label: 'Precio: menor a mayor', value: 'price-asc', sortBy: 'price', order: 'ASC' },
  { label: 'Precio: mayor a menor', value: 'price-desc', sortBy: 'price', order: 'DESC' },
  { label: 'Mejor calificados', value: 'rating', sortBy: 'rating_average', order: 'DESC' },
  { label: 'Más vendidos', value: 'sales', sortBy: 'sales_count', order: 'DESC' },
  { label: 'Más nuevos', value: 'newest', sortBy: 'createdAt', order: 'DESC' },
  { label: 'Nombre: A-Z', value: 'name-asc', sortBy: 'name', order: 'ASC' },
  { label: 'Nombre: Z-A', value: 'name-desc', sortBy: 'name', order: 'DESC' },
];

interface ProductSortProps {
  onSortChange: (sortBy: string, order: 'ASC' | 'DESC') => void;
  defaultValue?: string;
}

/**
 * Dropdown de ordenamiento de productos con animaciones
 */
const ProductSort = ({ onSortChange, defaultValue = 'relevant' }: ProductSortProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<SortOption>(
    SORT_OPTIONS.find(opt => opt.value === defaultValue) || SORT_OPTIONS[0]
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cerrar con ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  /**
   * Manejar selección de opción
   */
  const handleSelect = (option: SortOption) => {
    setSelected(option);
    onSortChange(option.sortBy, option.order);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors min-w-[200px] justify-between"
        aria-label="Ordenar productos"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
          <span className="text-sm font-medium text-gray-700">
            {selected.label}
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      <div
        className={`
          absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50
          origin-top-right transition-all duration-200
          ${isOpen 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
          }
        `}
      >
        <div className="py-2">
          {SORT_OPTIONS.map((option, index) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option)}
              className={`
                w-full px-4 py-2.5 text-left text-sm transition-colors
                flex items-center justify-between group
                ${selected.value === option.value
                  ? 'bg-orange-50 text-orange-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
                }
                ${index !== 0 ? 'border-t border-gray-100' : ''}
              `}
            >
              <span className="flex items-center gap-2">
                {/* Icono según tipo de ordenamiento */}
                {option.sortBy === 'price' && (
                  <svg className={`w-4 h-4 ${selected.value === option.value ? 'text-orange-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {option.sortBy === 'rating_average' && (
                  <svg className={`w-4 h-4 ${selected.value === option.value ? 'text-orange-600 fill-current' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                )}
                {option.sortBy === 'sales_count' && (
                  <svg className={`w-4 h-4 ${selected.value === option.value ? 'text-orange-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                )}
                {option.sortBy === 'createdAt' && (
                  <svg className={`w-4 h-4 ${selected.value === option.value ? 'text-orange-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {option.sortBy === 'name' && (
                  <svg className={`w-4 h-4 ${selected.value === option.value ? 'text-orange-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                  </svg>
                )}
                
                {option.label}
              </span>

              {/* Check icon */}
              {selected.value === option.value && (
                <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>

        {/* Footer informativo */}
        <div className="border-t border-gray-200 px-4 py-3 bg-gray-50 rounded-b-lg">
          <p className="text-xs text-gray-500 flex items-start gap-1.5">
            <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            El orden se aplica a los productos filtrados
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductSort;