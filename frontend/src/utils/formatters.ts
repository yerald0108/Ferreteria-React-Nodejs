// src/utils/formatters.ts

/**
 * Utilidades para formatear datos
 */

/**
 * Formatear precio en pesos cubanos (CUP)
 */
export const formatPrice = (price: number | string): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numPrice)) return '$0.00';
  
  return new Intl.NumberFormat('es-CU', {
    style: 'currency',
    currency: 'CUP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numPrice);
};

/**
 * Formatear número con separadores de miles
 */
export const formatNumber = (num: number | string): string => {
  const numValue = typeof num === 'string' ? parseFloat(num) : num;
  
  if (isNaN(numValue)) return '0';
  
  return new Intl.NumberFormat('es-CU').format(numValue);
};

/**
 * Formatear fecha
 */
export const formatDate = (date: string | Date, options?: Intl.DateTimeFormatOptions): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };
  
  return new Intl.DateTimeFormat('es-CU', defaultOptions).format(dateObj);
};

/**
 * Formatear fecha corta (DD/MM/YYYY)
 */
export const formatShortDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('es-CU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(dateObj);
};

/**
 * Formatear fecha relativa (hace 2 días, hace 1 hora, etc.)
 */
export const formatRelativeDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffSec < 60) return 'hace un momento';
  if (diffMin < 60) return `hace ${diffMin} minuto${diffMin > 1 ? 's' : ''}`;
  if (diffHour < 24) return `hace ${diffHour} hora${diffHour > 1 ? 's' : ''}`;
  if (diffDay < 7) return `hace ${diffDay} día${diffDay > 1 ? 's' : ''}`;
  
  return formatShortDate(dateObj);
};

/**
 * Formatear teléfono cubano
 */
export const formatPhone = (phone: string): string => {
  // Remover caracteres no numéricos
  const cleaned = phone.replace(/\D/g, '');
  
  // Si tiene código de país +53
  if (cleaned.length === 10 && cleaned.startsWith('53')) {
    return `+53 ${cleaned.substring(2, 3)} ${cleaned.substring(3, 7)} ${cleaned.substring(7)}`;
  }
  
  // Si es número de 8 dígitos
  if (cleaned.length === 8) {
    return `${cleaned.substring(0, 1)} ${cleaned.substring(1, 5)} ${cleaned.substring(5)}`;
  }
  
  return phone;
};

/**
 * Truncar texto
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Formatear porcentaje de descuento
 */
export const formatDiscount = (discount: number): string => {
  return `-${Math.round(discount)}%`;
};

/**
 * Generar iniciales de nombre
 */
export const getInitials = (firstName: string, lastName?: string): string => {
  const first = firstName.charAt(0).toUpperCase();
  const last = lastName ? lastName.charAt(0).toUpperCase() : '';
  return first + last;
};

/**
 * Capitalizar primera letra
 */
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Formatear slug (URL amigable)
 */
export const formatSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

/**
 * Pluralizar palabra según cantidad
 */
export const pluralize = (count: number, singular: string, plural: string): string => {
  return count === 1 ? singular : plural;
};