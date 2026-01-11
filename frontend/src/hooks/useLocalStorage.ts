// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

/**
 * Hook para sincronizar estado con localStorage
 * 
 * @param key - Clave en localStorage
 * @param initialValue - Valor inicial si no existe en localStorage
 * @returns [value, setValue, removeValue]
 * 
 * @example
 * const [theme, setTheme] = useLocalStorage('theme', 'light');
 */
export const useLocalStorage = <T,>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] => {
  // Estado para almacenar el valor
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Obtener del localStorage
      const item = window.localStorage.getItem(key);
      
      // Parsear JSON o devolver initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Función para actualizar el valor
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permitir que el valor sea una función (como useState)
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Guardar estado
      setStoredValue(valueToStore);
      
      // Guardar en localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Función para remover el valor
  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue];
};