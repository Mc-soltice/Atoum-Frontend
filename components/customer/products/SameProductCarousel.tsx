"use client";
import { Product } from "@/types/product";
import { useCallback, useEffect, useRef, useState } from "react";
import ProductCard from "./ProductCard";

interface Props {
  slides: Product[];
  title?: string;
  itemsPerView?: number;
  autoplay?: boolean;
  autoplayInterval?: number;
}

export default function SameProductCarousel({
  slides,
  title = "Produits similaires",
  itemsPerView = 4,
  autoplay = false,
  autoplayInterval = 5000,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  if (!slides || slides.length === 0) return null;

  const updateArrowsVisibility = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    }
  }, []);

  useEffect(() => {
    updateArrowsVisibility();
    window.addEventListener("resize", updateArrowsVisibility);
    return () => window.removeEventListener("resize", updateArrowsVisibility);
  }, [updateArrowsVisibility]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollTo({
        left:
          direction === "left"
            ? scrollRef.current.scrollLeft - scrollAmount
            : scrollRef.current.scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current.offsetLeft || 0);
    scrollRef.current.scrollLeft = scrollLeft - (x - startX) * 1.5;
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    if (!autoplay || isHovered) return;
    const interval = setInterval(() => {
      if (scrollRef.current && showRightArrow) {
        scroll("right");
      } else if (scrollRef.current) {
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
      }
    }, autoplayInterval);
    return () => clearInterval(interval);
  }, [autoplay, autoplayInterval, isHovered, showRightArrow]);

  return (
    <div
      className="carousel-container"
      // On expose --items-per-view pour que le CSS puisse l'utiliser
      style={{ "--items": itemsPerView } as React.CSSProperties}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {title && (
        <div className="carousel-header">
          <h3 className="carousel-title">{title}</h3>
          <span className="carousel-badge">
            {slides.length} produit{slides.length > 1 ? "s" : ""}
          </span>
        </div>
      )}

      <div className="carousel-wrapper">
        {showLeftArrow && (
          <button
            className="carousel-arrow carousel-arrow--left"
            onClick={() => scroll("left")}
            aria-label="Voir les produits précédents"
            type="button"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        <div
          ref={scrollRef}
          className={`carousel-scroll${isDragging ? " dragging" : ""}`}
          onScroll={updateArrowsVisibility}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          role="region"
          aria-label="Carrousel de produits"
          tabIndex={0}
        >
          {slides.map((product) => (
            <div key={product.id} className="carousel-card">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {showRightArrow && (
          <button
            className="carousel-arrow carousel-arrow--right"
            onClick={() => scroll("right")}
            aria-label="Voir les produits suivants"
            type="button"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      <style jsx>{`
        .carousel-container {
          width: 100%;
          position: relative;
          background: linear-gradient(135deg, #fafcf8 0%, #ffffff 100%);
          border-radius: 24px;
          padding: clamp(0.75rem, 2vw, 1.5rem);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
          /* Expose la variable pour les enfants */
          --gap: 0.75rem;
          --cols: var(--items, 4);
        }

        /* ─── Header ─────────────────────────────────────── */
        .carousel-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: clamp(1rem, 3vw, 2rem);
          flex-wrap: wrap;
          gap: 0.5rem;
          padding: 0 0.5rem;
        }

        .carousel-title {
          font-size: clamp(1.1rem, 2.5vw, 1.5rem);
          font-weight: 700;
          background: linear-gradient(135deg, #1a4d2e 0%, #2d6a4f 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-family: var(--font-serif, Georgia, serif);
          margin: 0;
          letter-spacing: -0.01em;
        }

        .carousel-badge {
          font-size: 0.875rem;
          color: #ffffff;
          background: linear-gradient(135deg, #7cb342 0%, #558b2f 100%);
          padding: 0.375rem 1rem;
          border-radius: 40px;
          font-weight: 500;
          box-shadow: 0 2px 8px rgba(124, 179, 66, 0.2);
          white-space: nowrap;
        }

        /* ─── Wrapper + flèches ──────────────────────────── */
        .carousel-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .carousel-arrow {
          /* Flèches en position absolue, hors flux → la zone de scroll garde toute la largeur */
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: clamp(32px, 4vw, 44px);
          height: clamp(32px, 4vw, 44px);
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.95);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 10;
          color: #2d6a4f;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          backdrop-filter: blur(8px);
          flex-shrink: 0;
        }

        .carousel-arrow:hover {
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 8px 24px rgba(124, 179, 66, 0.25);
          color: #7cb342;
        }

        .carousel-arrow:active {
          transform: translateY(-50%) scale(0.95);
        }

        .carousel-arrow--left {
          left: -22px;
        }
        .carousel-arrow--right {
          right: -22px;
        }

        /* ─── Zone de scroll ─────────────────────────────── */
        .carousel-scroll {
          display: flex;
          gap: var(--gap);
          overflow-x: auto;
          scroll-behavior: smooth;
          padding: 0.75rem 0.25rem;
          scrollbar-width: thin;
          scrollbar-color: #7cb342 #e8f0e5;
          width: 100%; /* occupe tout le wrapper */
          cursor: grab;
          user-select: none;
          scroll-snap-type: x mandatory;
        }

        .carousel-scroll.dragging {
          cursor: grabbing;
          scroll-behavior: auto;
        }

        .carousel-scroll::-webkit-scrollbar {
          height: 6px;
        }
        .carousel-scroll::-webkit-scrollbar-track {
          background: #e8f0e5;
          border-radius: 10px;
        }
        .carousel-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #7cb342, #558b2f);
          border-radius: 10px;
        }
        .carousel-scroll::-webkit-scrollbar-thumb:hover {
          background: #558b2f;
        }

        /* ─── Carte ──────────────────────────────────────── */
        /*
         * La largeur est calculée dynamiquement :
         *   (100% du scroll - (cols-1) × gap) / cols
         * On utilise var(--cols) hérité du container.
         * Pas de min-width fixe : c'est le contenu qui s'adapte.
         */
        .carousel-card {
          flex: 0 0 calc((100% - (var(--cols) - 1) * var(--gap)) / var(--cols));
          scroll-snap-align: start;
          animation: cardAppear 0.5s ease-out both;
          animation-delay: calc(var(--card-index, 0) * 0.05s);
          /* overflow hidden pour que le contenu interne ne déborde pas */
          overflow: hidden;
          min-width: 0; /* empêche flex de gonfler la carte */
        }

        /* ─── Responsive : on réduit --cols, pas la taille du contenu ── */
        @media (max-width: 1024px) {
          .carousel-container {
            --cols: 3;
          }
          .carousel-arrow--left {
            left: -12px;
          }
          .carousel-arrow--right {
            right: -12px;
          }
        }

        @media (max-width: 768px) {
          .carousel-container {
            --cols: 2;
          }
          .carousel-arrow--left {
            left: -8px;
          }
          .carousel-arrow--right {
            right: -8px;
          }
        }

        @media (max-width: 480px) {
          .carousel-container {
            --cols: 1.5;
          } /* affiche 1,5 carte → hint de scroll */
          .carousel-arrow {
            display: none;
          }
        }

        /* ─── Animations ─────────────────────────────────── */
        @keyframes cardAppear {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ─── Accessibilité ──────────────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .carousel-scroll {
            scroll-behavior: auto;
          }
          .carousel-card {
            animation: none;
          }
        }

        @media (prefers-contrast: high) {
          .carousel-arrow {
            border: 2px solid #1a4d2e;
            background: white;
          }
        }
      `}</style>
    </div>
  );
}
