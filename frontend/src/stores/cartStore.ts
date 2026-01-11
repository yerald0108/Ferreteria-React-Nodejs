// src/stores/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../types/product.types';
import { STORAGE_KEYS } from '../utils/constants';

export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

interface CartState {
  // Estado
  items: CartItem[];
  isOpen: boolean;

  // Getters computados
  itemCount: number;
  subtotal: number;
  total: number;

  // Acciones
  addItem: (product: Product, quantity?: number, notes?: string) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  updateNotes: (productId: number, notes: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

/**
 * Store del carrito con Zustand
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      items: [],
      isOpen: false,
      itemCount: 0,
      subtotal: 0,
      total: 0,

      /**
       * Agregar producto al carrito
       */
      addItem: (product: Product, quantity = 1, notes?: string) => {
        const { items } = get();
        const existingItem = items.find(item => item.product.id === product.id);

        let newItems: CartItem[];

        if (existingItem) {
          // Si ya existe, aumentar cantidad
          newItems = items.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity, notes: notes || item.notes }
              : item
          );
        } else {
          // Si no existe, agregar nuevo
          newItems = [...items, { product, quantity, notes }];
        }

        const { itemCount, subtotal, total } = calculateCartTotals(newItems);

        set({
          items: newItems,
          itemCount,
          subtotal,
          total,
        });
      },

      /**
       * Remover producto del carrito
       */
      removeItem: (productId: number) => {
        const { items } = get();
        const newItems = items.filter(item => item.product.id !== productId);
        
        const { itemCount, subtotal, total } = calculateCartTotals(newItems);

        set({
          items: newItems,
          itemCount,
          subtotal,
          total,
        });
      },

      /**
       * Actualizar cantidad de un producto
       */
      updateQuantity: (productId: number, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        const { items } = get();
        const newItems = items.map(item =>
          item.product.id === productId
            ? { ...item, quantity }
            : item
        );

        const { itemCount, subtotal, total } = calculateCartTotals(newItems);

        set({
          items: newItems,
          itemCount,
          subtotal,
          total,
        });
      },

      /**
       * Actualizar notas de un producto
       */
      updateNotes: (productId: number, notes: string) => {
        const { items } = get();
        const newItems = items.map(item =>
          item.product.id === productId
            ? { ...item, notes }
            : item
        );

        set({ items: newItems });
      },

      /**
       * Vaciar carrito
       */
      clearCart: () => {
        set({
          items: [],
          itemCount: 0,
          subtotal: 0,
          total: 0,
        });
      },

      /**
       * Abrir drawer del carrito
       */
      openCart: () => {
        set({ isOpen: true });
      },

      /**
       * Cerrar drawer del carrito
       */
      closeCart: () => {
        set({ isOpen: false });
      },

      /**
       * Toggle drawer del carrito
       */
      toggleCart: () => {
        set(state => ({ isOpen: !state.isOpen }));
      },
    }),
    {
      name: STORAGE_KEYS.CART,
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);

/**
 * Calcular totales del carrito
 */
function calculateCartTotals(items: CartItem[]) {
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  
  const subtotal = items.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);
  
  // Por ahora el total es igual al subtotal
  // Aquí podrías agregar descuentos, impuestos, envío, etc.
  const total = subtotal;
  
  return { itemCount, subtotal, total };
}