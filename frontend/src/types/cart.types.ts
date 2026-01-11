// src/types/cart.types.ts

import type { Product } from './product.types';

export type CartStatus = 'active' | 'completed' | 'abandoned';

export interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  price: number;
  discount: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  Product?: Product;
}

export interface Cart {
  id: number;
  user_id?: number;
  session_id?: string;
  status: CartStatus;
  expires_at?: string;
  createdAt?: string;
  updatedAt?: string;
  items?: CartItem[];
}

export interface CartSummary {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
}

export interface AddToCartPayload {
  product_id: number;
  quantity: number;
  notes?: string;
}

export interface UpdateCartItemPayload {
  quantity: number;
  notes?: string;
}