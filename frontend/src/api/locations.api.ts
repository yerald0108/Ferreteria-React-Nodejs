// src/api/locations.api.ts

import apiClient from './index';
import type { ApiResponse } from '../types/api.types';

export interface Province {
  province: string;
  municipalities: string[];
}

export interface ValidationResult {
  valid: boolean;
  province: string;
  municipality: string;
  error?: string;
}

/**
 * Servicios de ubicaciones (provincias y municipios de Cuba)
 */
export const locationsApi = {
  /**
   * Obtener todas las provincias
   */
  getProvinces: async (): Promise<string[]> => {
    const { data } = await apiClient.get<ApiResponse<string[]>>('/locations/provinces');
    if (!data.data) throw new Error('No se pudieron obtener provincias');
    return data.data;
  },

  /**
   * Obtener municipios de una provincia
   */
  getMunicipalities: async (province: string): Promise<string[]> => {
    const { data } = await apiClient.get<ApiResponse<string[]>>(
      `/locations/municipalities/${encodeURIComponent(province)}`
    );
    if (!data.data) throw new Error('No se pudieron obtener municipios');
    return data.data;
  },

  /**
   * Obtener todas las divisiones (provincias con municipios)
   */
  getAllDivisions: async (): Promise<Province[]> => {
    const { data } = await apiClient.get<ApiResponse<Province[]>>('/locations/all');
    if (!data.data) throw new Error('No se pudieron obtener divisiones');
    return data.data;
  },

  /**
   * Obtener divisiones en formato simple (objeto)
   */
  getDivisionsSimple: async (): Promise<Record<string, string[]>> => {
    const { data } = await apiClient.get<ApiResponse<Record<string, string[]>>>(
      '/locations/divisions-simple'
    );
    if (!data.data) throw new Error('No se pudieron obtener divisiones');
    return data.data;
  },

  /**
   * Validar provincia y municipio
   */
  validateLocation: async (province: string, city: string): Promise<ValidationResult> => {
    const { data } = await apiClient.post<ApiResponse<ValidationResult>>(
      '/locations/validate',
      { province, city }
    );
    if (!data.data) throw new Error('No se pudo validar ubicación');
    return data.data;
  },

  /**
   * Buscar municipios por término
   */
  searchMunicipalities: async (query: string): Promise<Array<{ municipality: string; province: string }>> => {
    const { data } = await apiClient.get<ApiResponse<Array<{ municipality: string; province: string }>>>(
      '/locations/search',
      { params: { q: query } }
    );
    if (!data.data) throw new Error('No se pudieron buscar municipios');
    return data.data;
  },
};