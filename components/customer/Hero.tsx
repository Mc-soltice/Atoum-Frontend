// components/customer/BanieresCariusel.tsx
"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isScrollingProgrammatically, setIsScrollingProgrammatically] =
    useState(false);
  const [isFading, setIsFading] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Contenu textuel pour chaque slide
  const slides = [
    {
      badge: "Communauté",
      title: "Un espace pour s'élever, apprendre et s'affirmer",
      description:
        "VirtualLab est une plateforme dédiée aux femmes qui souhaitent évoluer, se découvrir et construire une vie alignée avec leurs ambitions.",
      image: "/Banieres/b1.png",
    },
    {
      badge: "Inspiration",
      title: "Des contenus qui nourrissent ton esprit au quotidien",
      description:
        "Podcasts, ebooks et conseils pratiques pour t'accompagner dans ton développement personnel et t'aider à avancer chaque jour.",
      image: "/Banieres/b2.png",
    },
    {
      badge: "Bien-être",
      title: "Des astuces simples pour transformer ton quotidien",
      description:
        "Organisation, confiance en soi, relations, mindset… découvre des clés concrètes pour améliorer ta vie pas à pas.",
      image: "/Banieres/b3.png",
    },
    {
      badge: "Empowerment",
      title: "Prends ta place. Assume qui tu es.",
      description:
        "VirtualLab est un espace où chaque femme peut grandir, s'exprimer librement et reprendre le contrôle de sa vie.",
      image: "/Banieres/b4.png",
    },
  ];

  // Auto slide avec animation de fondu
  useEffect(() => {
    if (!isHovered && !isDragging) {
      const interval = setInterval(() => {
        goToNextWithFade();
      }, 7000);
      return () => clearInterval(interval);
    }
  }, [isHovered, isDragging, currentIndex]);

  const goToPreviousWithFade = () => {
    setIsFading(true);
    setTimeout(() => {
      const newIndex =
        currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
      setCurrentIndex(newIndex);
      scrollToSlide(newIndex);
      setIsFading(false);
    }, 600);
  };

  const goToNextWithFade = () => {
    setIsFading(true);
    setTimeout(() => {
      const newIndex = (currentIndex + 1) % slides.length;
      setCurrentIndex(newIndex);
      scrollToSlide(newIndex);
      setIsFading(false);
    }, 600);
  };

  const goToSlideWithFade = (index: number) => {
    if (index === currentIndex) return;
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex(index);
      scrollToSlide(index);
      setIsFading(false);
    }, 600);
  };

  const scrollToSlide = (index: number) => {
    if (carouselRef.current) {
      setIsScrollingProgrammatically(true);
      const slideWidth = carouselRef.current.clientWidth;
      carouselRef.current.scrollTo({
        left: index * slideWidth,
        behavior: "smooth",
      });
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
      if (
        newIndex !== currentIndex &&
        newIndex >= 0 &&
        newIndex < slides.length
      ) {
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

  const currentSlide = slides[currentIndex];

  return (
    <section className="relative w-full overflow-hidden -mt-16 md:h-[75vh]">
      {/* Conteneur des images avec défilement horizontal */}
      <div
        ref={carouselRef}
        className="absolute inset-0 w-full h-full overflow-x-auto scroll-smooth hide-scrollbar"
        style={{
          scrollSnapType: "x mandatory",
          cursor: isDragging ? "grabbing" : "grab",
        }}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          handleMouseUp();
          setIsHovered(false);
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => setIsHovered(true)}
      >
        <div className="flex h-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="relative shrink-0 w-full h-full"
              style={{ scrollSnapAlign: "start" }}
            >
              <Image
                src={slide.image}
                alt={`Slide ${index + 1}`}
                fill
                className="object-cover object-center"
                priority={index === 0}
                quality={90}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/30 via-black/20 to-black/10" />

      {/* Content - Mobile First avec tailles progressives */}
      <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 md:px-8 pb-6 sm:pb-8 md:pb-12 flex flex-col gap-3 sm:gap-4 z-20">
        {/* Badge dynamique avec animation */}
        <span
          className={`w-fit text-white text-xs sm:text-sm font-medium bg-white/20 backdrop-blur-sm border border-white/30 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-700 ${
            isFading ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"
          }`}
        >
          {currentSlide.badge}
        </span>

        {/* Titre dynamique avec animation
        <h1
          className={`text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl transition-all duration-700 ${
            isFading ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"
          }`}
        >
          {currentSlide.title}
        </h1> */}

        {/* Description dynamique avec animation */}
        {/* <p
          className={`text-white/80 text-sm sm:text-base max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg leading-relaxed transition-all duration-700 ${
            isFading ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"
          }`}
        >
          {currentSlide.description}
        </p> */}

        {/* Dots et boutons de navigation */}
        <div className="flex items-center justify-between mt-2 sm:mt-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlideWithFade(i)}
                className={`transition-all duration-500 ${
                  i === currentIndex
                    ? "w-6 sm:w-8 bg-white"
                    : "w-2 sm:w-2.5 bg-white/40 hover:bg-white/60"
                } h-1.5 sm:h-2 rounded-full`}
                aria-label={`Aller au slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Boutons de navigation fléchés - visibles sur desktop */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={goToPreviousWithFade}
              className="p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 transition-all duration-300 group"
              aria-label="Slide précédent"
            >
              <ChevronLeft className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={goToNextWithFade}
              className="p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 transition-all duration-300 group"
              aria-label="Slide suivant"
            >
              <ChevronRight className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Styles responsives */}
      <style jsx>{`
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        /* Styles spécifiques pour mobile (max-width: 768px) */
        @media (max-width: 768px) {
          section {
            aspect-ratio: 16 / 9;
            height: auto !important;
          }
        }
      `}</style>
    </section>
  );
}
