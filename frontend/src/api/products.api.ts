// src/api/products.api.ts

import apiClient from './index';
import type { Product, PriceRange, BrandCount } from '../types/product.types';
import type { PaginatedResponse, SearchParams, ApiResponse } from '../types/api.types';

/**
 * Servicios de productos
 */
export const productsApi = {
  /**
   * Obtener todos los productos con filtros y paginación
   */
  getProducts: async (params?: SearchParams): Promise<PaginatedResponse<Product>> => {
    const { data } = await apiClient.get<PaginatedResponse<Product>>('/products', { params });
    return data;
  },

  /**
   * Obtener un producto por ID o slug
   */
  getProductById: async (id: string | number): Promise<Product> => {
    const { data } = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
    if (!data.data) throw new Error('Producto no encontrado');
    return data.data;
  },

  /**
   * Obtener productos destacados
   */
  getFeatured: async (limit = 8): Promise<Product[]> => {
    const { data } = await apiClient.get<ApiResponse<Product[]>>('/products/featured', {
      params: { limit }
    });
    if (!data.data) throw new Error('No se pudieron obtener productos destacados');
    return data.data;
  },

  /**
   * Obtener productos más vendidos
   */
  getBestSellers: async (limit = 10, category?: string): Promise<Product[]> => {
    const { data } = await apiClient.get<ApiResponse<Product[]>>('/products/best-sellers', {
      params: { limit, category }
    });
    if (!data.data) throw new Error('No se pudieron obtener productos más vendidos');
    return data.data;
  },

  /**
   * Obtener productos relacionados
   */
  getRelated: async (productId: number, limit = 4): Promise<Product[]> => {
    const { data } = await apiClient.get<ApiResponse<Product[]>>(`/products/${productId}/related`, {
      params: { limit }
    });
    if (!data.data) throw new Error('No se pudieron obtener productos relacionados');
    return data.data;
  },

  /**
   * Obtener todas las marcas disponibles
   */
  getBrands: async (): Promise<BrandCount[]> => {
    const { data } = await apiClient.get<ApiResponse<BrandCount[]>>('/products/brands');
    if (!data.data) throw new Error('No se pudieron obtener marcas');
    return data.data;
  },

  /**
   * Obtener rango de precios
   */
  getPriceRange: async (category?: string): Promise<PriceRange> => {
    const { data } = await apiClient.get<ApiResponse<PriceRange>>('/products/price-range', {
      params: { category }
    });
    if (!data.data) throw new Error('No se pudo obtener rango de precios');
    return data.data;
  },

  /**
   * Buscar productos
   */
  search: async (query: string, params?: SearchParams): Promise<PaginatedResponse<Product>> => {
    const searchParams = { ...params, search: query };
    const response = await productsApi.getProducts(searchParams);
    
    // Asegurar que data sea un array
    if (!Array.isArray(response.data)) {
      console.warn('API response.data is not an array:', response);
      return {
        ...response,
        data: [],
        count: 0,
        total: 0,
      };
    }
    
    return response;
  },
};