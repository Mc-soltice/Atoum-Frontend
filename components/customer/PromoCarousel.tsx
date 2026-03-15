"use client";

import { ProductPromo } from "@/types/product";
import { Waveform } from "ldrs/react";
import "ldrs/react/Waveform.css";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { TouchEvent, useCallback, useEffect, useRef, useState } from "react";
import ProductImage from "@/components/admin/produit/ProductImage";

interface CarouselProps {
  products: ProductPromo[];
  autoPlay?: boolean;
  interval?: number;
  isLoading?: boolean;
  showControls?: boolean;
  showIndicators?: boolean;
  infiniteScroll?: boolean;
}

interface VisibleIndex {
  index: number;
  type: "reflection-left" | "reflection-right" | "active";
  distance: number;
}

// Fonction utilitaire pour combiner les classes
function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function PromoCarousel({
  products,
  autoPlay = true,
  interval = 4000,
  isLoading = false,
  showControls = true,
  showIndicators = true,
  infiniteScroll = true,
}: CarouselProps) {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductPromo | null>(
    null
  );
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [touchStartTime, setTouchStartTime] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const dragThreshold = 50;
  const timeThreshold = 300;

  // Reset active quand les produits changent
  useEffect(() => {
    setActive(0);
  }, [products]);

  // Détection mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const validProductCount = products.length;

  const handlePrevious = useCallback(() => {
    if (validProductCount === 0) return;
    setDragOffset(0);

    if (infiniteScroll) {
      setActive((prev) => (prev === 0 ? validProductCount - 1 : prev - 1));
    } else {
      setActive((prev) => (prev > 0 ? prev - 1 : prev));
    }
  }, [infiniteScroll, validProductCount]);

  const handleNext = useCallback(() => {
    if (validProductCount === 0) return;
    setDragOffset(0);

    if (infiniteScroll) {
      setActive((prev) => (prev === validProductCount - 1 ? 0 : prev + 1));
    } else {
      setActive((prev) => (prev < validProductCount - 1 ? prev + 1 : prev));
    }
  }, [infiniteScroll, validProductCount]);

  // Touch handlers pour mobile
  const handleTouchStart = (e: TouchEvent) => {
    setIsPaused(true);
    setIsDragging(true);
    setDragStartX(e.touches[0].clientX);
    setTouchStartTime(Date.now());
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || validProductCount <= 1) return;

    const currentX = e.touches[0].clientX;
    const deltaX = currentX - dragStartX;

    // Limiter le déplacement pour éviter de trop tirer
    const maxDrag = window.innerWidth * 0.3;
    const limitedDeltaX = Math.min(Math.max(deltaX, -maxDrag), maxDrag);

    setDragOffset(limitedDeltaX);

    // Empêcher le défilement vertical pendant le swipe horizontal
    e.preventDefault();
  };

  const handleTouchEnd = () => {
    if (!isDragging || validProductCount <= 1) {
      setDragOffset(0);
      setIsDragging(false);
      return;
    }

    const deltaX = dragOffset;
    const timeElapsed = Date.now() - touchStartTime;
    const isQuickSwipe = timeElapsed < timeThreshold;
    const isSignificantSwipe = Math.abs(deltaX) > dragThreshold;

    if ((isQuickSwipe && isSignificantSwipe) || Math.abs(deltaX) > dragThreshold) {
      if (deltaX < 0) {
        // Swipe vers la gauche -> suivant
        handleNext();
      } else {
        // Swipe vers la droite -> précédent
        handlePrevious();
      }
    }

    setDragOffset(0);
    setIsDragging(false);
  };

  // Auto-play
  useEffect(() => {
    if (!autoPlay || isPaused || validProductCount <= 1 || isLoading || isDragging) {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
      return;
    }

    autoPlayRef.current = setInterval(handleNext, interval);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
    };
  }, [autoPlay, handleNext, interval, isPaused, validProductCount, isLoading, isDragging]);

  // Navigation clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") setSelectedProduct(null);
      if (e.key === " ") {
        e.preventDefault();
        setIsPaused((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrevious, handleNext]);

  // Mouse wheel pour desktop
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (isMobile) return; // Désactivé sur mobile

      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        if (e.deltaX > 0) {
          handleNext();
        } else {
          handlePrevious();
        }
      }
    },
    [handleNext, handlePrevious, isMobile]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  const openLightbox = (product: ProductPromo) => {
    setSelectedProduct(product);
  };

  // Calcul des indices pour les reflets (uniquement desktop)
  const getVisibleIndices = useCallback((): VisibleIndex[] => {
    if (isMobile) return []; // Pas de reflets sur mobile

    const indices: VisibleIndex[] = [];
    const maxReflections = 4;

    if (validProductCount === 0) return indices;

    // Reflets à gauche
    for (let i = 1; i <= maxReflections; i++) {
      const index = (active - i + validProductCount) % validProductCount;
      indices.unshift({
        index,
        type: "reflection-left",
        distance: i,
      });
    }

    // Image active
    indices.push({
      index: active,
      type: "active",
      distance: 0,
    });

    // Reflets à droite
    for (let i = 1; i <= maxReflections; i++) {
      const index = (active + i) % validProductCount;
      indices.push({
        index,
        type: "reflection-right",
        distance: i,
      });
    }

    return indices;
  }, [active, validProductCount, isMobile]);

  // Calcul des indices des cartes principales
  const getMainCardsIndices = useCallback((): number[] => {
    if (validProductCount === 0) return [];

    if (isMobile) {
      // Sur mobile, on ne montre qu'une carte à la fois
      return [active];
    }

    // Desktop: 3 cartes
    if (validProductCount === 1) return [active];
    if (validProductCount === 2) {
      return [active, (active + 1) % validProductCount];
    }

    return [
      (active - 1 + validProductCount) % validProductCount,
      active,
      (active + 1) % validProductCount,
    ];
  }, [active, validProductCount, isMobile]);

  const visibleIndices = getVisibleIndices();
  const mainCardsIndices = getMainCardsIndices();

  if (isLoading && products.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Waveform size="35" stroke="3.5" speed="1" color="#f59e0b" />
        <p className="ml-3 text-gray-600">Chargement des promotions...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <>
      <div className="w-full max-w-7xl mx-auto px-4">
        {/* Header avec titre */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Nos <span className="text-red-600">Promotions</span>
            </h2>
            <p className="text-gray-600 mt-2">
              Découvrez nos offres spéciales à prix réduits
            </p>
          </div>
        </div>

        {/* Conteneur principal du carrousel */}
        <div
          ref={containerRef}
          className={cn(
            "relative w-full overflow-hidden rounded-3xl bg-linear-to-br from-gray-100 to-white border border-gray-200 shadow-xl",
            isMobile ? "h-[70vh] min-h-125" : "h-[80vh] min-h-150 max-h-225"
          )}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Zone de reflets (uniquement desktop) */}
          {!isMobile && (
            <div className="absolute inset-0 z-0 flex items-center justify-center">
              <div className="relative w-full h-full flex items-center justify-center">
                {visibleIndices.map((item, idx) => {
                  if (item.type === "active") return null;

                  const product = products[item.index];
                  if (!product) return null;

                  const opacity = Math.max(0.15, 0.5 - item.distance * 0.1);
                  const scale = 1 - item.distance * 0.15;
                  const blur = item.distance * 4;
                  const translateX =
                    item.type === "reflection-left"
                      ? `-${120 + item.distance * 60}%`
                      : `${120 + item.distance * 60}%`;

                  return (
                    <div
                      key={`${item.type}-${item.index}-${idx}`}
                      className="absolute w-[25%] h-[50%] transition-all duration-700 ease-out rounded-xl overflow-hidden"
                      style={{
                        transform: `translateX(${translateX}) scale(${scale})`,
                        opacity: opacity,
                        filter: `blur(${blur}px) brightness(0.8)`,
                        zIndex: 10 - item.distance,
                      }}
                    >
                      <div className="relative w-full h-full">
                        <ProductImage
                          src={product.main_image}
                          alt={product.name}
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-linear-to-r from-white/60 via-transparent to-white/60" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Boutons de navigation (cachés sur mobile) */}
          {showControls && validProductCount > 1 && !isMobile && (
            <>
              <button
                onClick={handlePrevious}
                className={cn(
                  "absolute left-4 top-1/2 -translate-y-1/2 z-40",
                  "p-4 rounded-full bg-white/80 backdrop-blur-lg border border-gray-200",
                  "text-amber-600 hover:text-amber-700 hover:bg-white/90 transition-all duration-300",
                  "shadow-lg hover:shadow-xl hover:scale-110",
                  "group"
                )}
                aria-label="Produit précédent"
              >
                <ChevronLeft className="w-8 h-8 md:w-10 md:h-10 group-hover:-translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleNext}
                className={cn(
                  "absolute right-4 top-1/2 -translate-y-1/2 z-40",
                  "p-4 rounded-full bg-white/80 backdrop-blur-lg border border-gray-200",
                  "text-amber-600 hover:text-amber-700 hover:bg-white/90 transition-all duration-300",
                  "shadow-lg hover:shadow-xl hover:scale-110",
                  "group"
                )}
                aria-label="Produit suivant"
              >
                <ChevronRight className="w-8 h-8 md:w-10 md:h-10 group-hover:translate-x-1 transition-transform" />
              </button>
            </>
          )}

          {/* Indicateurs de progression */}
          {showIndicators && validProductCount > 1 && (
            <div className={cn(
              "absolute z-40",
              isMobile
                ? "bottom-4 left-1/2 -translate-x-1/2"
                : "bottom-8 left-1/2 -translate-x-1/2"
            )}>
              <div className={cn(
                "flex items-center gap-2 bg-white/90 backdrop-blur-lg rounded-full border border-gray-200 shadow-lg",
                isMobile ? "px-4 py-2" : "px-6 py-3"
              )}>
                <span className="text-amber-600 text-sm font-medium">
                  {active + 1} / {validProductCount}
                </span>
                <div className="h-4 w-px bg-gray-300" />
                {Array.from({ length: Math.min(isMobile ? 5 : 7, validProductCount) }).map(
                  (_, index) => (
                    <button
                      key={index}
                      onClick={() => setActive(index)}
                      className={cn(
                        "transition-all duration-300",
                        isMobile ? "w-1.5 h-1.5" : "w-2 h-2",
                        index === active
                          ? cn("bg-amber-500", isMobile ? "w-4" : "w-6 scale-125")
                          : "bg-gray-300 hover:bg-gray-400 hover:scale-110"
                      )}
                      aria-label={`Aller au produit ${index + 1}`}
                    />
                  )
                )}
                {validProductCount > (isMobile ? 5 : 7) && (
                  <span className="text-amber-600/60 text-xs px-2">
                    +{validProductCount - (isMobile ? 5 : 7)}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Indicateur de swipe pour mobile */}
          {isMobile && validProductCount > 1 && !isDragging && dragOffset === 0 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 animate-pulse">
              <div className="flex items-center gap-1 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm border border-gray-200">
                <ChevronLeft className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-600">Glisser</span>
                <ChevronRight className="w-3 h-3 text-gray-500" />
              </div>
            </div>
          )}

          {/* Conteneur des cartes */}
          {validProductCount > 0 && (
            <div className="absolute inset-0 z-30 flex items-center justify-center overflow-hidden">
              <div
                ref={scrollContainerRef}
                className={cn(
                  "relative w-full h-full flex items-center justify-center",
                  isMobile && "transition-none"
                )}
              >
                {mainCardsIndices.map((index, positionIndex) => {
                  const product = products[index];
                  if (!product) return null;

                  const isActive = index === active;
                  const dragStyle = isMobile && isDragging ? {
                    transform: `translateX(calc(${dragOffset}px))`,
                    transition: 'none',
                  } : {};

                  // Styles pour mobile
                  const mobileStyles = {
                    width: '85%',
                    height: '70%',
                    transform: `translateX(0)`,
                    transition: isDragging ? 'none' : 'all 0.3s ease-out',
                    ...dragStyle,
                  };

                  // Styles pour desktop
                  const desktopStyles = {
                    width: isActive ? "40%" : "30%",
                    height: isActive ? "75%" : "60%",
                    transform: isActive
                      ? "translateX(0) scale(1) rotateY(0deg)"
                      : positionIndex === 0
                        ? "translateX(-110%) scale(0.85) rotateY(-15deg)"
                        : "translateX(110%) scale(0.85) rotateY(15deg)",
                    opacity: isActive ? 1 : 0.9,
                    filter: isActive
                      ? "drop-shadow(0 20px 20px rgba(0, 0, 0, 0.15))"
                      : "brightness(0.95) drop-shadow(0 10px 10px rgba(0, 0, 0, 0.1))",
                  };

                  // Calcul du prix promotionnel
                  const discount = product.discount_percentage || 0;
                  const promoPrice = product.original_price
                    ? product.original_price * (1 - discount / 100)
                    : product.price;

                  return (
                    <div
                      key={product.id}
                      className={cn(
                        "absolute rounded-3xl shadow-xl border-2 overflow-hidden",
                        "group cursor-pointer transform-gpu bg-white",
                        isMobile ? "transition-all" : "",
                        isActive && !isMobile && "shadow-amber-400/30 border-amber-400",
                        !isActive && !isMobile && "border-gray-200"
                      )}
                      style={isMobile ? mobileStyles : desktopStyles}
                      onClick={() => openLightbox(product)}
                    >
                      <div className="relative w-full h-full">
                        {/* Image de fond */}
                        <ProductImage
                          src={product.main_image}
                          alt={product.name}
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />

                        {/* Overlay dégradé pour thème clair */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />

                        {/* Contenu de la carte */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
                          {discount > 0 && (
                            <div className="mb-2">
                              <span className="inline-block px-2 md:px-3 py-1 bg-red-600 text-white text-xs md:text-sm font-semibold rounded-full">
                                -{discount}%
                              </span>
                            </div>
                          )}
                          <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2 line-clamp-1 text-white">
                            {product.name}
                          </h3>
                          <p className="text-xs md:text-sm text-gray-200 mb-2 md:mb-3 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex items-center gap-2 md:gap-3">
                            <span className="text-xl md:text-2xl font-bold text-amber-400">
                              {promoPrice.toFixed(2)}€
                            </span>
                            {product.original_price &&
                              product.original_price > product.price && (
                                <span className="text-xs md:text-sm text-gray-300 line-through">
                                  {product.original_price.toFixed(2)}€
                                </span>
                              )}
                          </div>
                        </div>

                        {/* Effet de brillance */}
                        <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Bouton zoom (caché sur mobile) */}
                        {isActive && !isMobile && (
                          <div className="absolute top-6 right-6 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                            <div className="p-3 bg-amber-400 backdrop-blur-md rounded-full shadow-lg hover:scale-110 transition-transform duration-300">
                              <ZoomIn className="w-6 h-6 text-gray-900" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Effet de bokeh en arrière-plan pour thème clair */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            {Array.from({ length: isMobile ? 4 : 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-amber-400/20 animate-pulse"
                style={{
                  width: `${Math.random() * (isMobile ? 50 : 100) + (isMobile ? 30 : 50)}px`,
                  height: `${Math.random() * (isMobile ? 50 : 100) + (isMobile ? 30 : 50)}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  filter: "blur(40px)",
                  animationDuration: `${Math.random() * 10 + 5}s`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox (inchangée) */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 bg-white/95 flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedProduct(null)}
        >
          <button
            className="absolute top-6 right-6 text-amber-600 hover:text-amber-700 transition-colors z-50"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProduct(null);
            }}
            aria-label="Fermer"
          >
            <X className="w-10 h-10" />
          </button>

          {/* Navigation dans la lightbox */}
          {validProductCount > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                  setSelectedProduct(
                    products[active === 0 ? validProductCount - 1 : active - 1]
                  );
                }}
                className="absolute left-6 top-1/2 -translate-y-1/2 text-amber-600 hover:text-amber-700 transition-colors z-50"
                aria-label="Produit précédent"
              >
                <ChevronLeft className="w-12 h-12" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                  setSelectedProduct(
                    products[active === validProductCount - 1 ? 0 : active + 1]
                  );
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-amber-600 hover:text-amber-700 transition-colors z-50"
                aria-label="Produit suivant"
              >
                <ChevronRight className="w-12 h-12" />
              </button>
            </>
          )}

          {/* Contenu de la lightbox */}
          <div className="relative max-w-5xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl">
            <div className="relative h-[60vh]">
              <ProductImage
                src={selectedProduct.main_image}
                alt={selectedProduct.name}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                {selectedProduct.discount_percentage &&
                  selectedProduct.discount_percentage > 0 && (
                    <div className="mb-3">
                      <span className="inline-block px-4 py-1.5 bg-red-600 text-white text-lg font-bold rounded-full">
                        -{selectedProduct.discount_percentage}%
                      </span>
                    </div>
                  )}
                <h2 className="text-3xl font-bold mb-3 text-white">
                  {selectedProduct.name}
                </h2>
                <p className="text-gray-200 mb-4 max-w-2xl">
                  {selectedProduct.description}
                </p>
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-bold text-amber-400">
                    {(
                      selectedProduct.original_price
                        ? selectedProduct.original_price *
                        (1 - (selectedProduct.discount_percentage || 0) / 100)
                        : selectedProduct.price
                    ).toFixed(2)}
                    €
                  </span>
                  {selectedProduct.original_price &&
                    selectedProduct.original_price >
                    selectedProduct.price && (
                      <span className="text-xl text-gray-300 line-through">
                        {selectedProduct.original_price.toFixed(2)}€
                      </span>
                    )}
                </div>
                <button className="mt-6 px-8 py-3 bg-amber-400 text-gray-900 rounded-full font-semibold hover:bg-amber-500 transition-colors">
                  Voir l&apos;offre
                </button>
              </div>
            </div>
          </div>

          {/* Info produit */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md rounded-full px-6 py-3 border border-gray-200 shadow-lg">
            <span className="text-amber-600 font-medium">
              Produit {active + 1} sur {validProductCount}
            </span>
          </div>
        </div>
      )}
    </>
  );
}