// src/types/api.types.ts

/**
 * Respuesta estándar del API
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Array<{ msg: string; param: string }>;
}

/**
 * Respuesta paginada
 */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  count: number;
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Parámetros de paginación
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
}

/**
 * Filtros de búsqueda
 */
export interface SearchParams extends PaginationParams {
  search?: string;
  category?: string;
  categories?: string;
  brand?: string;
  brands?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  featured?: boolean;
  tags?: string;
}

/**
 * Error del API
 */
export interface ApiError {
  message: string;
  status?: number;
  errors?: Array<{ msg: string; param: string }>;
}