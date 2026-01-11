// src/api/categories.api.ts

import apiClient from './index';
import type { Category, Product } from '../types/product.types';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '../types/api.types';

/**
 * Servicios de categorías
 */
export const categoriesApi = {
  /**
   * Obtener todas las categorías
   */
  getCategories: async (includeSubcategories = true): Promise<Category[]> => {
    const { data } = await apiClient.get<ApiResponse<Category[]>>('/categories', {
      params: { includeSubcategories }
    });
    if (!data.data) throw new Error('No se pudieron obtener categorías');
    return data.data;
  },

  /**
   * Obtener árbol de categorías (jerárquico)
   */
  getCategoryTree: async (): Promise<Category[]> => {
    const { data } = await apiClient.get<ApiResponse<Category[]>>('/categories/tree');
    if (!data.data) throw new Error('No se pudo obtener árbol de categorías');
    return data.data;
  },

  /**
   * Obtener una categoría por ID o slug
   */
  getCategoryById: async (id: string | number): Promise<Category> => {
    const { data } = await apiClient.get<ApiResponse<Category>>(`/categories/${id}`);
    if (!data.data) throw new Error('Categoría no encontrada');
    return data.data;
  },

  /**
   * Obtener productos de una categoría
   */
  getCategoryProducts: async (
    id: string | number, 
    params?: PaginationParams
  ): Promise<PaginatedResponse<Product>> => {
    const { data } = await apiClient.get<PaginatedResponse<Product>>(
      `/categories/${id}/products`,
      { params }
    );
    return data;
  },
};