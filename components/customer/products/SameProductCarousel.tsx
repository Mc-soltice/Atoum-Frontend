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
  autoplayInterval = 5000
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  if (!slides || slides.length === 0) return null;

  // Mise à jour de la visibilité des flèches
  const updateArrowsVisibility = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    }
  }, []);

  useEffect(() => {
    updateArrowsVisibility();
    window.addEventListener('resize', updateArrowsVisibility);
    return () => window.removeEventListener('resize', updateArrowsVisibility);
  }, [updateArrowsVisibility]);

  // Navigation
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      const newScrollLeft = direction === 'left'
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount;

      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  // Drag & drop navigation
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current.offsetLeft || 0);
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Autoplay
  useEffect(() => {
    if (!autoplay || isHovered) return;

    const interval = setInterval(() => {
      if (scrollRef.current && showRightArrow) {
        scroll('right');
      } else if (scrollRef.current && !showRightArrow) {
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      }
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [autoplay, autoplayInterval, isHovered, showRightArrow]);

  return (
    <div
      className="nature-promo-carousel-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {title && (
        <div className="nature-promo-carousel-header">
          <h3 className="nature-promo-carousel-title">{title}</h3>
          <div className="nature-promo-carousel-indicators">
            <span className="indicator">
              {slides.length} produit{slides.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}

      <div className="nature-promo-carousel-wrapper">
        {/* Flèche gauche */}
        {showLeftArrow && (
          <button
            className="nature-promo-arrow nature-promo-arrow-left"
            onClick={() => scroll('left')}
            aria-label="Voir les produits précédents"
            type="button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {/* Carrousel */}
        <div
          ref={scrollRef}
          className={`nature-promo-scroll ${isDragging ? 'dragging' : ''}`}
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
            <div key={product.id} className="nature-promo-card">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Flèche droite */}
        {showRightArrow && (
          <button
            className="nature-promo-arrow nature-promo-arrow-right"
            onClick={() => scroll('right')}
            aria-label="Voir les produits suivants"
            type="button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

      <style jsx>{`
        .nature-promo-carousel-container {
          width: 100%;
          position: relative;
          background: linear-gradient(135deg, #fafcf8 0%, #ffffff 100%);
          border-radius: 24px;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
        }

        .nature-promo-carousel-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 0.5rem;
          padding: 0 0.5rem;
        }

        .nature-promo-carousel-title {
          font-size: 1.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #1a4d2e 0%, #2d6a4f 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-family: var(--font-serif, Georgia, serif);
          margin: 0;
          letter-spacing: -0.01em;
        }

        .nature-promo-carousel-indicators {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .indicator {
          font-size: 0.875rem;
          color: #ffffff;
          background: linear-gradient(135deg, #7cb342 0%, #558b2f 100%);
          padding: 0.375rem 1rem;
          border-radius: 40px;
          font-weight: 500;
          box-shadow: 0 2px 8px rgba(124, 179, 66, 0.2);
        }

        .nature-promo-carousel-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .nature-promo-scroll {
          display: flex;
          gap: 0.75rem;
          overflow-x: auto;
          scroll-behavior: smooth;
          padding: 0.75rem 0.25rem;
          scrollbar-width: thin;
          scrollbar-color: #7cb342 #e8f0e5;
          flex: 1;
          cursor: grab;
          user-select: none;
          scroll-snap-type: x mandatory;
        }

        .nature-promo-scroll.dragging {
          cursor: grabbing;
          scroll-behavior: auto;
        }

        .nature-promo-scroll::-webkit-scrollbar {
          height: 6px;
        }

        .nature-promo-scroll::-webkit-scrollbar-track {
          background: #e8f0e5;
          border-radius: 10px;
        }

        .nature-promo-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #7cb342 0%, #558b2f 100%);
          border-radius: 10px;
        }

        .nature-promo-scroll::-webkit-scrollbar-thumb:hover {
          background: #558b2f;
        }

        .nature-promo-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: white;
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
          background: rgba(255, 255, 255, 0.95);
        }

        .nature-promo-arrow:hover {
          background: white;
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 8px 24px rgba(124, 179, 66, 0.25);
          color: #7cb342;
        }

        .nature-promo-arrow:active {
          transform: translateY(-50%) scale(0.95);
        }

        .nature-promo-arrow-left {
          left: -22px;
        }

        .nature-promo-arrow-right {
          right: -22px;
        }

        .nature-promo-card {
          flex: 0 0 calc((100% - (${itemsPerView - 1} * 1.5rem)) / ${itemsPerView});
          min-width: 180px;
          text-decoration: none;
          display: block;
          scroll-snap-align: start;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nature-promo-card-inner {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .nature-promo-card:hover .nature-promo-card-inner {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(45, 80, 22, 0.12);
        }

        .nature-promo-card:focus-visible {
          outline: none;
        }

        .nature-promo-card:focus-visible .nature-promo-card-inner {
          outline: 2px solid #7cb342;
          outline-offset: 2px;
        }

        .nature-promo-badge,
        .nature-promo-badge-new {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 2;
          background: linear-gradient(135deg, #d85a30, #c44520);
          color: white;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 30px;
          letter-spacing: 0.03em;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          animation: slideIn 0.3s ease-out;
        }

        .nature-promo-badge-new {
          background: linear-gradient(135deg, #2196f3, #1976d2);
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .nature-promo-card-img {
          aspect-ratio: 1 / 1;
          background: linear-gradient(135deg, #f9fcf6 0%, #f0f4ea 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .nature-promo-card-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nature-promo-card:hover .nature-promo-card-img img {
          transform: scale(1.1);
        }

        .nature-promo-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(45, 106, 79, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          backdrop-filter: blur(4px);
        }

        .nature-promo-card:hover .nature-promo-overlay {
          opacity: 1;
        }

        .nature-promo-view {
          color: white;
          font-size: 0.875rem;
          font-weight: 600;
          padding: 8px 16px;
          border: 2px solid white;
          border-radius: 40px;
          transform: translateY(10px);
          transition: transform 0.3s ease;
        }

        .nature-promo-card:hover .nature-promo-view {
          transform: translateY(0);
        }

        .nature-promo-placeholder {
          font-size: 3rem;
          opacity: 0.6;
          position: absolute;
        }

        .hidden {
          display: none;
        }

        .nature-promo-card-body {
          padding: 1rem;
        }

        .nature-promo-card-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1a2e1a;
          margin-bottom: 0.5rem;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 2.45rem;
        }

        .nature-promo-card-prices {
          display: flex;
          gap: 0.5rem;
          align-items: baseline;
          flex-wrap: wrap;
          margin-bottom: 0.5rem;
        }

        .nature-price-current {
          font-family: var(--font-serif, Georgia, serif);
          font-size: 1.125rem;
          font-weight: 700;
          color: #2d6a4f;
        }

        .nature-price-old {
          font-size: 0.75rem;
          color: #a0948c;
          text-decoration: line-through;
          font-weight: 500;
        }

        .nature-promo-rating {
          display: flex;
          gap: 0.25rem;
          align-items: center;
          margin-top: 0.5rem;
        }

        .stars {
          color: #ffc107;
          font-size: 0.75rem;
          letter-spacing: 1px;
        }

        .rating-count {
          font-size: 0.7rem;
          color: #6b8c5c;
        }

        /* Responsive design amélioré */
        @media (max-width: 1280px) {
          .nature-promo-card {
            flex: 0 0 calc((100% - 3rem) / 4);
          }
        }

        @media (max-width: 1024px) {
          .nature-promo-card {
            flex: 0 0 calc((100% - 3rem) / 3);
          }
          .nature-promo-arrow-left { left: -12px; }
          .nature-promo-arrow-right { right: -12px; }
          .nature-promo-carousel-container {
            padding: 1rem;
          }
        }

        @media (max-width: 768px) {
          .nature-promo-card {
            flex: 0 0 calc((100% - 1.5rem) / 2);
            min-width: 160px;
          }
          .nature-promo-arrow {
            width: 36px;
            height: 36px;
          }
          .nature-promo-arrow-left { left: -8px; }
          .nature-promo-arrow-right { right: -8px; }
          .nature-promo-carousel-title {
            font-size: 1.25rem;
          }
        }

        @media (max-width: 640px) {
          .nature-promo-card {
            min-width: 140px;
          }
          .nature-promo-card-name {
            font-size: 0.75rem;
          }
          .nature-price-current {
            font-size: 0.875rem;
          }
          .nature-promo-arrow {
            width: 32px;
            height: 32px;
          }
        }

        @media (max-width: 480px) {
          .nature-promo-arrow {
            display: none;
          }
          .nature-promo-card {
            min-width: 130px;
          }
          .nature-promo-carousel-container {
            padding: 0.75rem;
          }
          .nature-promo-card-body {
            padding: 0.75rem;
          }
        }

        /* Support du mode réduit de mouvement */
        @media (prefers-reduced-motion: reduce) {
          .nature-promo-scroll {
            scroll-behavior: auto;
          }
          .nature-promo-card:hover .nature-promo-card-img img {
            transform: none;
          }
          .nature-promo-badge {
            animation: none;
          }
          .nature-promo-overlay {
            display: none;
          }
        }

        /* Support du contraste élevé */
        @media (prefers-contrast: high) {
          .nature-promo-card-inner {
            border: 2px solid #1a4d2e;
          }
          .nature-promo-arrow {
            border: 2px solid #1a4d2e;
            background: white;
          }
        }

        /* Animation d'apparition des cartes */
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

        .nature-promo-card {
          animation: cardAppear 0.5s ease-out;
          animation-delay: calc(var(--card-index, 0) * 0.05s);
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  );
}