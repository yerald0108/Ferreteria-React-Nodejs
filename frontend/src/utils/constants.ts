// src/utils/constants.ts

/**
 * Constantes de la aplicación
 */

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  CART: 'cart',
  GUEST_CART: 'guest_cart',
  THEME: 'theme',
} as const;

// Rutas de navegación
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:token',
  
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:slug',
  CATEGORY: '/category/:slug',
  SEARCH: '/search',
  
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_SUCCESS: '/order/success/:orderNumber',
  
  PROFILE: '/profile',
  ORDERS: '/profile/orders',
  ORDER_DETAIL: '/profile/orders/:orderNumber',
  ADDRESSES: '/profile/addresses',
  SETTINGS: '/profile/settings',
  
  ADMIN: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_USERS: '/admin/users',
} as const;

// Estados de orden
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  READY: 'ready',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const;

// Estados de orden en español
export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  processing: 'En preparación',
  ready: 'Lista para entrega',
  shipped: 'Enviada',
  delivered: 'Entregada',
  cancelled: 'Cancelada',
  refunded: 'Reembolsada',
};

// Métodos de pago
export const PAYMENT_METHODS = {
  CASH: 'cash',
  TRANSFER: 'transfer',
  CARD: 'card',
  YAPPY: 'yappy',
  NEQUI: 'nequi',
  OTHER: 'other',
} as const;

// Métodos de pago en español
export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: 'Efectivo',
  transfer: 'Transferencia',
  card: 'Tarjeta',
  yappy: 'Yappy',
  nequi: 'Nequi',
  other: 'Otro',
};

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  PRODUCTS_PER_PAGE: 12,
  ORDERS_PER_PAGE: 10,
} as const;

// Límites de validación
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 50,
  MIN_PRODUCT_NAME: 3,
  MAX_PRODUCT_NAME: 200,
  PHONE_REGEX: /^(\+53)?[5-9]\d{7}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

// Timeouts y delays
export const TIMING = {
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 3000,
  SEARCH_DEBOUNCE: 500,
} as const;

// Mensajes de error
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Por favor, verifica tu internet.',
  UNAUTHORIZED: 'No estás autorizado. Por favor, inicia sesión.',
  NOT_FOUND: 'No se encontró el recurso solicitado.',
  SERVER_ERROR: 'Error del servidor. Por favor, intenta más tarde.',
  VALIDATION_ERROR: 'Por favor, verifica los datos ingresados.',
  GENERIC_ERROR: 'Ocurrió un error inesperado.',
} as const;

// Configuración de imágenes
export const IMAGE_CONFIG = {
  PLACEHOLDER: '/placeholder-product.png',
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
} as const;