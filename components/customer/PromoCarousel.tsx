// components/CarouselSurMesure.tsx
"use client";

import { useProducts } from "@/contexte/ProductContext";
import { ProductPromo } from "@/types/product";
import { Waveform } from "ldrs/react";
import "ldrs/react/Waveform.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TouchEvent, useCallback, useEffect, useRef, useState } from "react";
import PromoCard from "./products/promotions/PromoCard";
interface CarouselProps {
  products: ProductPromo[];
  autoPlay?: boolean;
  interval?: number;
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function CarouselSurMesure({
  products,
  autoPlay = false,
  interval = 5000,
}: CarouselProps) {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [touchStartTime, setTouchStartTime] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragThreshold = 50;
  const timeThreshold = 300;

  // Détection mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handlePrevious = useCallback(() => {
    setActive((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  }, [products.length]);

  const handleNext = useCallback(() => {
    setActive((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  }, [products.length]);

  // Touch handlers
  const handleTouchStart = (e: TouchEvent) => {
    setIsPaused(true);
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
    setTouchStartTime(Date.now());
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    setIsDragging(false);
    const deltaX = startX - currentX;
    const timeElapsed = Date.now() - touchStartTime;
    const isQuickSwipe = timeElapsed < timeThreshold;
    const isSignificantSwipe = Math.abs(deltaX) > dragThreshold;

    if (isQuickSwipe && isSignificantSwipe) {
      if (deltaX > 0) {
        handleNext();
      } else {
        handlePrevious();
      }
    }

    if (autoPlay) {
      setTimeout(() => setIsPaused(false), 1000);
    }
  };

  // Mouse wheel pour desktop
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        if (e.deltaX > 0) {
          handleNext();
        } else {
          handlePrevious();
        }
      }
    },
    [handleNext, handlePrevious],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  // Auto-play
  useEffect(() => {
    if (!autoPlay || isPaused || products.length === 0) return;
    const timer = setInterval(handleNext, interval);
    return () => clearInterval(timer);
  }, [autoPlay, handleNext, interval, isPaused, products.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrevious, handleNext]);

  // Calcul du décalage pour le drag
  const dragOffset = isDragging ? startX - currentX : 0;
  const { loading: productsLoading } = useProducts();

  if (productsLoading && products.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Waveform size="35" stroke="3.5" speed="1" color="#f59e0b" />
        <p className="ml-3 text-gray-700">Chargement des promotions...</p>
      </div>
    );
  }
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-1">
      {/* Header avec navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <div className="text-center sm:text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Nos <span className="text-red-600">Promotions</span>
          </h2>
          <p className="text-gray-600 mt-2">
            Découvrez nos offres spéciales à prix réduits
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Compteur */}
          <div className="px-4 py-2 bg-gray-100 rounded-full">
            <span className="text-gray-800 font-bold">
              <span className="text-red-600">{active + 1}</span> /{" "}
              {products.length}
            </span>
          </div>

          {/* Boutons de navigation */}
          <div className="flex gap-2">
            <button
              onClick={handlePrevious}
              disabled={active === 0}
              className={cn(
                "p-3 rounded-full border transition-all duration-300",
                active === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:scale-105 active:scale-95",
              )}
              aria-label="Produit précédent"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              disabled={active === products.length - 1}
              className={cn(
                "p-3 rounded-full border transition-all duration-300",
                active === products.length - 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:scale-105 active:scale-95",
              )}
              aria-label="Produit suivant"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Container principal du carousel */}
      <div
        ref={containerRef}
        className="relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Indicateur de swipe pour mobile */}
        {isMobile && (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-20">
            <div className="flex items-center gap-1 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm border border-gray-200">
              <ChevronLeft className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-600">Glisser</span>
              <ChevronRight className="w-3 h-3 text-gray-500" />
            </div>
          </div>
        )}

        {/* Container des cartes */}
        <div className="relative h-105 overflow-hidden rounded-2xl bg-linear-to-br from-gray-50 to-white p-4 shadow-lg border border-gray-100">
          {/* Cartes */}
          <div className="absolute inset-0 flex items-center justify-center">
            {products.map((product, index) => {
              const offset = active - index;
              const absOffset = Math.abs(offset);
              const isActive = index === active;

              // Calcul des transformations
              const scale = 1 - absOffset * 0.1;
              const opacity = absOffset > 2 ? 0 : 1 - absOffset * 0.3;
              const translateX = offset * 100;
              const zIndex = 10 - absOffset;
              const blur = absOffset * 2;

              // Effet de glissement
              const dragEffect = isDragging && isActive ? dragOffset * 0.3 : 0;

              return (
                <div
                  key={product.id}
                  className="absolute w-full max-w-md transition-all duration-500 ease-out"
                  style={{
                    transform: `translateX(${translateX + dragEffect}px) scale(${scale})`,
                    opacity,
                    filter: `blur(${blur}px)`,
                    zIndex,
                    pointerEvents: isActive ? "auto" : "none",
                    transition: isDragging
                      ? "none"
                      : "all 500ms cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <div className="px-4">
                    <PromoCard product={product} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Points indicateurs */}
        <div className="flex justify-center gap-2 mt-8">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => setActive(index)}
              className={cn(
                "rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
                index === active
                  ? "w-8 h-2 bg-linear-to-r from-red-500 to-orange-500"
                  : "w-2 h-2 bg-gray-300 hover:bg-gray-400",
              )}
              aria-label={`Aller au produit ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
