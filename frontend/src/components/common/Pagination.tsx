// src/components/common/Pagination.tsx

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPrevNext?: boolean;
  showFirstLast?: boolean;
  maxButtons?: number;
}

/**
 * Componente de paginación con diseño moderno
 */
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showPrevNext = true,
  showFirstLast = true,
  maxButtons = 7,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  /**
   * Generar array de números de página a mostrar
   */
  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];
    
    if (totalPages <= maxButtons) {
      // Si hay pocas páginas, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Siempre mostrar primera página
      pages.push(1);

      // Calcular rango alrededor de la página actual
      const leftSiblingIndex = Math.max(currentPage - 1, 2);
      const rightSiblingIndex = Math.min(currentPage + 1, totalPages - 1);

      const showLeftEllipsis = leftSiblingIndex > 2;
      const showRightEllipsis = rightSiblingIndex < totalPages - 1;

      if (!showLeftEllipsis && showRightEllipsis) {
        // Mostrar más páginas al inicio
        const leftItemCount = 3 + 2;
        for (let i = 2; i <= leftItemCount; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
      } else if (showLeftEllipsis && !showRightEllipsis) {
        // Mostrar más páginas al final
        pages.push('ellipsis');
        const rightItemCount = 3 + 2;
        for (let i = totalPages - rightItemCount + 1; i < totalPages; i++) {
          pages.push(i);
        }
      } else if (showLeftEllipsis && showRightEllipsis) {
        // Mostrar ellipsis en ambos lados
        pages.push('ellipsis');
        for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
      } else {
        // No mostrar ellipsis
        for (let i = 2; i < totalPages; i++) {
          pages.push(i);
        }
      }

      // Siempre mostrar última página
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  /**
   * Ir a la página anterior
   */
  const goToPrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  /**
   * Ir a la página siguiente
   */
  const goToNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <nav className="flex items-center justify-between border-t border-gray-200 pt-6" aria-label="Paginación">
      {/* Info mobile */}
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={goToPrevious}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Anterior
        </button>
        <span className="text-sm text-gray-700 flex items-center">
          Página <span className="font-medium mx-1">{currentPage}</span> de <span className="font-medium ml-1">{totalPages}</span>
        </span>
        <button
          onClick={goToNext}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Siguiente
        </button>
      </div>

      {/* Desktop */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        {/* Info */}
        <div>
          <p className="text-sm text-gray-700">
            Página <span className="font-medium">{currentPage}</span> de{' '}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>

        {/* Botones de paginación */}
        <div className="flex items-center gap-1">
          {/* Primera página */}
          {showFirstLast && currentPage > 3 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                aria-label="Ir a la primera página"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
              <div className="px-1" />
            </>
          )}

          {/* Anterior */}
          {showPrevNext && (
            <button
              onClick={goToPrevious}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Página anterior"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Números de página */}
          <div className="flex items-center gap-1 mx-2">
            {pageNumbers.map((page, index) => {
              if (page === 'ellipsis') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700"
                  >
                    ...
                  </span>
                );
              }

              const isActive = page === currentPage;

              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page as number)}
                  className={`
                    relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
                    ${isActive
                      ? 'bg-orange-500 text-white shadow-md hover:bg-orange-600 z-10 scale-110'
                      : 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:scale-105'
                    }
                  `}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={`Ir a la página ${page}`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          {/* Siguiente */}
          {showPrevNext && (
            <button
              onClick={goToNext}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Página siguiente"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Última página */}
          {showFirstLast && currentPage < totalPages - 2 && (
            <>
              <div className="px-1" />
              <button
                onClick={() => onPageChange(totalPages)}
                className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                aria-label="Ir a la última página"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Pagination;