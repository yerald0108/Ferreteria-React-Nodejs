// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

/**
 * Hook para debounce (retrasar ejecución)
 * Útil para búsquedas en tiempo real
 * 
 * @param value - Valor a hacer debounce
 * @param delay - Tiempo de espera en ms (default: 500ms)
 * @returns Valor con debounce aplicado
 * 
 * @example
 * const [search, setSearch] = useState('');
 * const debouncedSearch = useDebounce(search, 500);
 * 
 * useEffect(() => {
 *   // Esta búsqueda solo se ejecutará después de 500ms de que el usuario deje de escribir
 *   if (debouncedSearch) {
 *     searchProducts(debouncedSearch);
 *   }
 * }, [debouncedSearch]);
 */
export const useDebounce = <T,>(value: T, delay = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Establecer un timeout para actualizar el valor después del delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpiar el timeout si el valor cambia antes del delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};