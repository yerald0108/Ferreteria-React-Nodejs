// src/hooks/index.ts

// Auth
export { useAuth } from './useAuth';

// Cart
export { useCart } from './useCart';

// Products
export { useProducts } from './useProducts';

// Utilities
export { useDebounce } from './useDebounce';
export { useLocalStorage } from './useLocalStorage';

/**
 * HOOKS DISPONIBLES:
 * 
 * ✅ useAuth() - Autenticación y usuario
 * ✅ useCart() - Carrito de compras
 * ✅ useProducts() - Productos, filtros, paginación
 * ✅ useDebounce() - Delay para búsquedas
 * ✅ useLocalStorage() - Persistencia local
 * 
 * PRÓXIMOS HOOKS SUGERIDOS:
 * 
 * ⏳ useCategories() - Categorías y subcategorías
 * ⏳ useFeaturedProducts() - Productos destacados
 * ⏳ useProduct() - Producto individual
 * ⏳ useReviews() - Reseñas de productos
 * ⏳ useOrders() - Órdenes del usuario
 * ⏳ useAddresses() - Direcciones guardadas
 * ⏳ useWishlist() - Lista de deseos
 * ⏳ usePagination() - Lógica de paginación
 * ⏳ useFilters() - Lógica de filtros
 * ⏳ useModal() - Control de modales
 * ⏳ useToast() - Notificaciones toast
 */