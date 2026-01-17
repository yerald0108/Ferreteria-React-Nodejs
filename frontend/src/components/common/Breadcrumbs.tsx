// src/components/common/Breadcrumbs.tsx
import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

export interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Componente de breadcrumbs (migas de pan) para navegación
 */
const Breadcrumbs = ({ items, className = '' }: BreadcrumbsProps) => {
  if (!items || items.length === 0) return null;

  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 flex-wrap">
        {/* Home link */}
        <li className="inline-flex items-center">
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-1.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Inicio
          </Link>
        </li>

        {/* Dynamic breadcrumb items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index}>
              <div className="flex items-center">
                {/* Separator */}
                <svg
                  className="w-5 h-5 text-gray-400 mx-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>

                {/* Breadcrumb item */}
                {isLast || !item.path ? (
                  <span
                    className="text-sm font-medium text-gray-500 flex items-center"
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {item.icon && <span className="mr-1.5">{item.icon}</span>}
                    <span className="line-clamp-1">{item.label}</span>
                  </span>
                ) : (
                  <Link
                    to={item.path}
                    className="text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors flex items-center"
                  >
                    {item.icon && <span className="mr-1.5">{item.icon}</span>}
                    <span className="line-clamp-1">{item.label}</span>
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;

/**
 * EJEMPLOS DE USO:
 *
 * // Ejemplo 1: Breadcrumbs simple
 * <Breadcrumbs
 *   items={[
 *     { label: 'Productos', path: '/products' },
 *     { label: 'Herramientas', path: '/category/herramientas' },
 *     { label: 'Martillo de Carpintero' }
 *   ]}
 * />
 *
 * // Ejemplo 2: Con iconos personalizados
 * <Breadcrumbs
 *   items={[
 *     { 
 *       label: 'Productos', 
 *       path: '/products',
 *       icon: <svg>...</svg>
 *     },
 *     { label: 'Detalle del producto' }
 *   ]}
 * />
 *
 * // Ejemplo 3: En una página de producto
 * const ProductDetail = () => {
 *   const { product, category } = useProductData();
 *   
 *   return (
 *     <div>
 *       <Breadcrumbs
 *         items={[
 *           { label: 'Productos', path: ROUTES.PRODUCTS },
 *           { label: category.name, path: `/category/${category.slug}` },
 *           { label: product.name }
 *         ]}
 *       />
 *       ...
 *     </div>
 *   );
 * };
 *
 * // Ejemplo 4: En checkout
 * <Breadcrumbs
 *   items={[
 *     { label: 'Carrito', path: ROUTES.CART },
 *     { label: 'Checkout', path: ROUTES.CHECKOUT },
 *     { label: 'Confirmación' }
 *   ]}
 * />
 */