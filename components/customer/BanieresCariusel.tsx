// components/customer/BanieresCariusel.tsx
"use client"
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function BaniereCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isScrollingProgrammatically, setIsScrollingProgrammatically] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Liste des bannières dans le dossier public/Banieres
  const banners = [
    '/Banieres/b1.png',
    '/Banieres/b2.png',
    '/Banieres/b3.png',
    '/Banieres/b4.png',
  ];

  useEffect(() => {
    if (!isHovered && !isDragging) {
      const interval = setInterval(() => {
        goToNext();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isHovered, isDragging, currentIndex]);

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? banners.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    scrollToSlide(newIndex);
  };

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % banners.length;
    setCurrentIndex(newIndex);
    scrollToSlide(newIndex);
  };

  const scrollToSlide = (index: number) => {
    if (carouselRef.current) {
      setIsScrollingProgrammatically(true);
      const slideWidth = carouselRef.current.clientWidth;
      carouselRef.current.scrollTo({
        left: index * slideWidth,
        behavior: 'smooth'
      });
      // Réinitialiser le flag après le scroll
      setTimeout(() => {
        setIsScrollingProgrammatically(false);
      }, 500);
    }
  };

  // Gestion du scroll manuel
  const handleScroll = () => {
    if (carouselRef.current && !isDragging && !isScrollingProgrammatically) {
      const scrollPosition = carouselRef.current.scrollLeft;
      const slideWidth = carouselRef.current.clientWidth;
      const newIndex = Math.round(scrollPosition / slideWidth);
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < banners.length) {
        setCurrentIndex(newIndex);
      }
    }
  };

  // Gestion du drag (souris)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    handleScroll();
  };

  // Gestion du touch (mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !carouselRef.current) return;
    const x = e.touches[0].pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    handleScroll();
  };

  return (
    <div
      className="mt-2 mb-0 relative w-full  overflow-hidden rounded-lg shadow-2xl "
      style={{ height: '45vh' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Conteneur des bannières avec défilement horizontal */}
      <div
        ref={carouselRef}
        className="relative w-full h-full overflow-x-auto scroll-smooth hide-scrollbar "
        style={{ scrollSnapType: 'x mandatory', cursor: isDragging ? 'grabbing' : 'grab' }}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex h-full">
          {banners.map((banner, index) => (
            <div
              key={index}
              className="relative shrink-0 w-full h-full"
              style={{ scrollSnapAlign: 'start' }}
            >
              <Image
                src={banner}
                alt={`Banner ${index + 1}`}
                fill
                className="object-cover pointer-events-none"
                priority={index === 0}
                quality={90}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dégradé pour le texte (optionnel) */}
      <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent z-20 pointer-events-none" />

      {/* Boutons de navigation - cachés sur mobile, visibles sur desktop */}
      <button
        onClick={goToPrevious}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 transition-all duration-300 group"
        aria-label="Previous banner"
      >
        <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      </button>

      <button
        onClick={goToNext}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 transition-all duration-300 group"
        aria-label="Next banner"
      >
        <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      </button>

      {/* Indicateurs de progression */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              scrollToSlide(index);
            }}
            className={`transition-all duration-500 rounded-full ${index === currentIndex
              ? 'w-8 h-2 bg-white'
              : 'w-2 h-2 bg-white/50 hover:bg-white/80'
              }`}
            aria-label={`Go to banner ${index + 1}`}
          />
        ))}
      </div>

      {/* Styles responsives pour la hauteur */}
      <style jsx>{`
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        /* Sur mobile, la hauteur passe de 45vh à 25vh */
        @media (max-width: 768px) {
          div:first-child {
            height: 25vh !important;
          }
        }
      `}</style>
    </div>
  );
};