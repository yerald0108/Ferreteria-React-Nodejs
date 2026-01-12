// src/hooks/useCart.ts
import { useCartStore } from '../stores/cartStore';
import type { Product } from '../types/product.types';
import { formatPrice } from '../utils/formatters';

/**
 * Hook personalizado para el carrito
 */
export const useCart = () => {
  const {
    items,
    isOpen,
    itemCount,
    subtotal,
    total,
    addItem,
    removeItem,
    updateQuantity,
    updateNotes,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
  } = useCartStore();

  /**
   * Verificar si un producto está en el carrito
   */
  const isInCart = (productId: number): boolean => {
    return items.some(item => item.product.id === productId);
  };

  /**
   * Obtener la cantidad de un producto en el carrito
   */
  const getItemQuantity = (productId: number): number => {
    const item = items.find(item => item.product.id === productId);
    return item?.quantity || 0;
  };

  /**
   * Obtener un item del carrito por ID de producto
   */
  const getItem = (productId: number) => {
    return items.find(item => item.product.id === productId);
  };

  /**
   * Agregar producto con validación de stock
   */
  const addToCart = (product: Product, quantity = 1, notes?: string): boolean => {
    // Validar stock disponible
    const currentQuantity = getItemQuantity(product.id);
    const newQuantity = currentQuantity + quantity;

    if (newQuantity > product.stock) {
      console.warn('Stock insuficiente');
      return false;
    }

    addItem(product, quantity, notes);
    return true;
  };

  /**
   * Incrementar cantidad
   */
  const incrementQuantity = (productId: number): boolean => {
    const item = getItem(productId);
    if (!item) return false;

    const newQuantity = item.quantity + 1;
    
    // Validar stock
    if (newQuantity > item.product.stock) {
      console.warn('Stock insuficiente');
      return false;
    }

    updateQuantity(productId, newQuantity);
    return true;
  };

  /**
   * Decrementar cantidad
   */
  const decrementQuantity = (productId: number): boolean => {
    const item = getItem(productId);
    if (!item) return false;

    const newQuantity = item.quantity - 1;
    
    if (newQuantity <= 0) {
      removeItem(productId);
      return true;
    }

    updateQuantity(productId, newQuantity);
    return true;
  };

  return {
    // Estado
    items,
    isOpen,
    itemCount,
    subtotal,
    total,
    isEmpty: items.length === 0,
    
    // Helpers formateados
    subtotalFormatted: formatPrice(subtotal),
    totalFormatted: formatPrice(total),
    
    // Métodos de consulta
    isInCart,
    getItemQuantity,
    getItem,
    
    // Acciones
    addToCart,
    removeItem,
    updateQuantity,
    updateNotes,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    
    // Control del drawer
    openCart,
    closeCart,
    toggleCart,
  };
};