// src/components/products/ProductImageGallery.tsx
import { useState } from 'react';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  thumbnail?: string;
}

/**
 * Galería de imágenes con thumbnails y lightbox
 */
const ProductImageGallery = ({ 
  images, 
  productName,
  thumbnail 
}: ProductImageGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  // Combinar thumbnail con images si existe
  const allImages = thumbnail && !images.includes(thumbnail) 
    ? [thumbnail, ...images] 
    : images.length > 0 
    ? images 
    : thumbnail 
    ? [thumbnail] 
    : [];

  const currentImage = allImages[selectedIndex] || '/placeholder-product.png';

  /**
   * Navegar a la siguiente imagen
   */
  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev + 1) % allImages.length);
  };

  /**
   * Navegar a la imagen anterior
   */
  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  /**
   * Manejar teclado en lightbox
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showLightbox) return;
    
    switch (e.key) {
      case 'ArrowLeft':
        prevImage();
        break;
      case 'ArrowRight':
        nextImage();
        break;
      case 'Escape':
        setShowLightbox(false);
        setIsZoomed(false);
        break;
    }
  };

  if (allImages.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
        <svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Imagen principal */}
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
        <img
          src={currentImage}
          alt={`${productName} - Imagen ${selectedIndex + 1}`}
          className="w-full h-full object-cover cursor-zoom-in transition-transform duration-300 group-hover:scale-105"
          onClick={() => setShowLightbox(true)}
        />

        {/* Badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button
            onClick={() => setShowLightbox(true)}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
            aria-label="Ver en pantalla completa"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </button>
        </div>

        {/* Navegación (si hay múltiples imágenes) */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
              aria-label="Imagen anterior"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
              aria-label="Imagen siguiente"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Indicador de posición */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/70 backdrop-blur-sm text-white text-sm rounded-full">
              {selectedIndex + 1} / {allImages.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`
                aspect-square rounded-lg overflow-hidden border-2 transition-all
                ${selectedIndex === index
                  ? 'border-orange-500 ring-2 ring-orange-500 ring-offset-2'
                  : 'border-gray-200 hover:border-gray-400'
                }
              `}
            >
              <img
                src={image}
                alt={`${productName} - Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {showLightbox && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={() => {
            setShowLightbox(false);
            setIsZoomed(false);
          }}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Botón cerrar */}
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors z-10"
            aria-label="Cerrar"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Info */}
          <div className="absolute top-4 left-4 text-white bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg">
            <p className="text-sm">
              {selectedIndex + 1} / {allImages.length}
            </p>
          </div>

          {/* Controles */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/50 backdrop-blur-sm px-6 py-3 rounded-full">
            <button
              onClick={prevImage}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Anterior"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(!isZoomed);
              }}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label={isZoomed ? "Alejar" : "Acercar"}
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isZoomed ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                )}
              </svg>
            </button>

            <button
              onClick={nextImage}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Siguiente"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Imagen */}
          <img
            src={currentImage}
            alt={`${productName} - Imagen ${selectedIndex + 1}`}
            className={`
              max-h-[90vh] max-w-[90vw] object-contain transition-transform duration-300
              ${isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'}
            `}
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(!isZoomed);
            }}
          />

          {/* Navegación con teclado hint */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            Usa las flechas ← → para navegar • ESC para cerrar
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;