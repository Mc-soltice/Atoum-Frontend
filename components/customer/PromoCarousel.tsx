"use client";

import { useCart } from "@/contexte/panier/CartContext";
import { ProductPromo } from "@/types/product";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  slides: ProductPromo[];
  onCartClick?: () => void;
}

const AUTO_PLAY_DELAY = 5000;
const DRAG_THRESHOLD = 50;

const PALETTES = [
  { accent: "#FF3B00", badgeColor: "#fff" },
  { accent: "#3B82F6", badgeColor: "#fff" },
  { accent: "#D4A853", badgeColor: "#1C1410" },
  { accent: "#7F77DD", badgeColor: "#fff" },
];

// Fonction pour obtenir les dimensions d'une image
const getImageDimensions = (url: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      resolve({ width: 800, height: 600 });
    };
    img.src = url;
  });
};

export default function CarouselSplit({ slides, onCartClick }: Props) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [animState, setAnimState] = useState<"idle" | "exit" | "enter">("idle");
  const [isHovered, setIsHovered] = useState(false);
  const [imageRatios, setImageRatios] = useState<number[]>([]);
  const [currentRatio, setCurrentRatio] = useState<number>(1);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true); // 👈 NOUVEAU : gère le premier chargement
  const [isReady, setIsReady] = useState(false); // 👈 NOUVEAU : attend que les images soient prêtes
  const [carouselHeight, setCarouselHeight] = useState<string>('50vh'); // 👈 FIXÉ : hauteur par défaut

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragStartRef = useRef<number | null>(null);
  const animatingRef = useRef(false);

  const { addToCart } = useCart();
  const slide = slides[current];
  const palette = PALETTES[current % PALETTES.length];

  // Détection mobile et calcul de la hauteur (côté client uniquement)
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setCarouselHeight(mobile ? 'auto' : 'calc(100vh / 2)');
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ── Chargement des ratios d'images ──────────────────────────────────
  useEffect(() => {
    const loadRatios = async () => {
      const ratios = await Promise.all(
        slides.map(async (slide) => {
          const dimensions = await getImageDimensions(slide.main_image);
          return dimensions.height / dimensions.width;
        })
      );
      setImageRatios(ratios);
      setIsReady(true); // 👈 Toutes les images sont chargées
    };

    if (slides.length > 0) {
      loadRatios();
    }
  }, [slides]);

  // Mise à jour du ratio courant
  useEffect(() => {
    if (imageRatios[current]) {
      setCurrentRatio(imageRatios[current]);
    }
  }, [current, imageRatios]);

  // ── Animation d'entrée au premier chargement ───────────────────────
  useEffect(() => {
    if (isReady && isFirstLoad && slides.length > 0) {
      // Petit délai pour que le DOM soit complètement prêt
      const timer = setTimeout(() => {
        setAnimState("enter");
        setTimeout(() => {
          setAnimState("idle");
          setIsFirstLoad(false);
        }, 550);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isReady, isFirstLoad, slides.length]);

  // ── Champs dérivés ──────────────────────────────────────────────────
  const isAvailable = slide?.stock > 0;
  const hasDiscount = slide?.original_price && slide.original_price > slide.price;

  const discountPercent = hasDiscount
    ? Math.round(((slide.original_price! - slide.price) / slide.original_price!) * 100)
    : null;

  const badge = hasDiscount ? `−${discountPercent}%` : "Nouveauté";

  const words = slide?.name?.split(" ") || [""];
  const headlineL1 = words[0] ?? "";
  const headlineL2 = words.slice(1).join(" ");

  const description =
    slide?.description?.length > 130
      ? slide.description.substring(0, 127) + "..."
      : slide?.description || "";

  const priceDisplay = hasDiscount
    ? `${slide.price.toLocaleString()} € · était ${slide.original_price?.toLocaleString()} €`
    : `À partir de ${slide.price.toLocaleString()} €`;

  // ── Navigation ──────────────────────────────────────────────────────
  const goTo = useCallback(
    (index: number, dir?: 1 | -1) => {
      if (animatingRef.current || index === current || !isReady) return;
      const d = dir ?? (index > current ? 1 : -1);
      animatingRef.current = true;

      setAnimState("exit");
      setTimeout(() => {
        setDirection(d);
        setCurrent(index);
        setAnimState("enter");
        setTimeout(() => {
          setAnimState("idle");
          animatingRef.current = false;
        }, 550);
      }, 300);
    },
    [current, isReady]
  );

  const next = useCallback(
    () => goTo((current + 1) % slides.length, 1),
    [current, slides.length, goTo]
  );
  const prev = useCallback(
    () => goTo((current - 1 + slides.length) % slides.length, -1),
    [current, slides.length, goTo]
  );

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(next, AUTO_PLAY_DELAY);
  }, [next]);

  useEffect(() => {
    if (!isHovered && !isFirstLoad) resetTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [current, isHovered, resetTimer, isFirstLoad]);

  // ── Drag / swipe (souris) ──────────────────────────────────────────
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isMobile) return;
    dragStartRef.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isMobile) return;
    if (dragStartRef.current === null) return;
    const dx = e.clientX - dragStartRef.current;
    dragStartRef.current = null;
    if (dx < -DRAG_THRESHOLD) next();
    else if (dx > DRAG_THRESHOLD) prev();
  };

  // ── Touch events pour mobile ───────────────────────────────────────
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > DRAG_THRESHOLD;
    const isRightSwipe = distance < -DRAG_THRESHOLD;

    if (isLeftSwipe) {
      next();
    } else if (isRightSwipe) {
      prev();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  // ── Panier ──────────────────────────────────────────────────────────
  const handleAddToCart = () => {
    if (!isAvailable) return;
    addToCart(slide, 1);
    if (onCartClick) onCartClick();
  };

  // ── Classes d'animation ─────────────────────────────────────────────
  const contentClass =
    animState === "exit"
      ? direction > 0
        ? "anim-exit-left"
        : "anim-exit-right"
      : animState === "enter"
        ? direction > 0
          ? "anim-enter-left"
          : "anim-enter-right"
        : "";

  const imgClass = animState === "enter" ? "anim-img-in" : "";
  const showContent = !isFirstLoad || animState === "enter"; // 👈 Affiche uniquement après l'animation initiale

  if (!slides.length) return null;

  // 👈 Pendant le premier chargement, on montre un placeholder sans contenu
  if (isFirstLoad && !isReady) {
    return (
      <div
        className="cr-root cr-loading"
        style={{ height: carouselHeight }}
      >
        <div className="cr-left">
          <div className="cr-accent-bar" style={{ background: palette.accent }} />
          <div className="cr-mist-effect"></div>
        </div>
        <div className="cr-right" />
      </div>
    );
  }

  return (
    <div
      className="cr-root"
      style={{ height: carouselHeight }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Panneau gauche : contenu avec effet de brume ── */}
      <div className="cr-left">
        {/* Barre d'accent verticale */}
        <div
          className="cr-accent-bar"
          style={{ background: palette.accent, transition: "background 0.5s ease" }}
        />

        {/* Effet de brume qui déborde sur l'image */}
        <div className="cr-mist-effect"></div>

        {showContent && (
          <>
            <div className={`cr-top ${contentClass}`}>
              {/* Badge */}
              <span
                className="cr-badge"
                style={{ background: palette.accent, color: palette.badgeColor }}
              >
                {badge}
              </span>

              {/* Catégorie */}
              <p className="cr-label">{slide?.name?.toUpperCase()}</p>

              {/* Titre */}
              <h2 className="cr-headline">
                {headlineL1}
                {headlineL2 && <><br />{headlineL2}</>}
              </h2>

              {/* Description */}
              <p className="cr-desc">{description}</p>

              {/* Prix */}
              <p className="cr-price" style={{ color: palette.accent }}>
                {priceDisplay}
              </p>
            </div>

            {/* ── Bas : CTAs + navigation ── */}
            <div className={`cr-bottom ${contentClass}`}>
              <div className="cr-ctas">
                <Link href={`/produits/${slide.id}`} aria-label={`Voir ${slide.name}`}>
                  <button
                    className="cr-btn-primary"
                    style={{ background: palette.accent, color: palette.badgeColor }}
                  >
                    En savoir plus
                  </button>
                </Link>
                <button
                  className="cr-btn-ghost"
                  onClick={handleAddToCart}
                  disabled={!isAvailable}
                >
                  {isAvailable ? "Acheter" : "Indisponible"}
                </button>
              </div>

              {/* Alerte stock faible */}
              {slide.stock > 0 && slide.stock <= 5 && (
                <p className="cr-stock-warn">⚠ Plus que {slide.stock} en stock</p>
              )}

              {/* Navigation */}
              <div className="cr-nav">
                <div className="cr-dots">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      className={`cr-dot${i === current ? " active" : ""}`}
                      style={{
                        background:
                          i === current ? palette.accent : "var(--cr-border)",
                        width: i === current ? "22px" : "6px",
                      }}
                      onClick={() => goTo(i)}
                      aria-label={`Slide ${i + 1}`}
                    />
                  ))}
                </div>
                <div className="cr-arrows">
                  <button className="cr-arrow" onClick={prev} aria-label="Précédent">
                    ←
                  </button>
                  <button className="cr-arrow" onClick={next} aria-label="Suivant">
                    →
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Panneau droit : image ── */}
      <div className="cr-right">
        {/* Tags superposés */}
        {showContent && (
          <div className="cr-tag-strip">
            {hasDiscount && (
              <span
                className="cr-tag"
                style={{ background: palette.accent, color: palette.badgeColor }}
              >
                {badge}
              </span>
            )}
            {!isAvailable && (
              <span className="cr-tag cr-tag-out">Épuisé</span>
            )}
          </div>
        )}

        {/* Indicateur de swipe mobile */}
        {isMobile && showContent && (
          <div className="cr-swipe-indicator">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M7 12L12 7L17 12M12 7L12 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        )}

        {/* Conteneur image */}
        <div className="cr-image-container">
          <div className={`cr-img-slot ${imgClass}`}>
            <img
              src={slide.main_image}
              alt={slide.name}
              className="cr-img"
              style={{
                width: 'auto',
                height: '100%',
                maxWidth: 'none',
                objectFit: 'contain',
              }}
            />
          </div>
        </div>

        {/* Compteur */}
        {showContent && (
          <div className="cr-counter">
            {String(current + 1).padStart(2, "0")} /{" "}
            {String(slides.length).padStart(2, "0")}
          </div>
        )}
      </div>

      <style jsx>{`
        /* ── Variables ── */
        .cr-root {
          --cr-border: rgba(0, 0, 0, 0.12);
          --mist-color: rgba(255, 255, 255, 0);
          border-radius: 16px;
          overflow: hidden;
        }
        @media (prefers-color-scheme: dark) {
          .cr-root { 
            --cr-border: rgba(255, 255, 255, 0.18);
            --mist-color: rgba(0, 0, 0, 0);
          }
        }

        /* ── Root avec hauteur fixe 1/2 écran (PC) ── */
        .cr-root {
          position: relative;
          display: flex;
          height: 50vh;
          min-height: 400px;
          overflow: hidden;
          font-family: 'Outfit', sans-serif;
          background: #fff;
          border: 0.5px solid rgba(0, 0, 0, 0.09);
          user-select: none;
          cursor: grab;
          border-radius: 24px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
        }
        .cr-root:active { cursor: grabbing; }

        /* État de chargement - pas d'interaction */
        .cr-root.cr-loading {
          cursor: default;
        }
        .cr-root.cr-loading:active {
          cursor: default;
        }

        /* ── Panneau gauche ── */
        .cr-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 2rem 2rem 1.5rem;
          position: relative;
          overflow: hidden;
          gap: 1.5rem;
          background: transparent;
          z-index: 2;
        }

        /* ── Effet de fondu amélioré qui empiète sur l'image ── */
        .cr-mist-effect {
          position: absolute;
          right: -20px;
          top: 0;
          width: 45%;
          height: 100%;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0.98) 0%,
            rgba(255, 255, 255, 0.85) 20%,
            rgba(255, 255, 255, 0.5) 50%,
            rgba(255, 255, 255, 0.15) 80%,
            rgba(255, 255, 255, 0) 100%
          );
          pointer-events: none;
          z-index: 1;
          backdrop-filter: blur(4px);
          mask: linear-gradient(to right, black 0%, black 50%, transparent 100%);
          -webkit-mask: linear-gradient(to right, black 0%, black 50%, transparent 100%);
        }

        @media (prefers-color-scheme: dark) {
          .cr-mist-effect {
            background: linear-gradient(
              to right,
              rgba(17, 17, 19, 0.98) 0%,
              rgba(17, 17, 19, 0.85) 20%,
              rgba(17, 17, 19, 0.5) 50%,
              rgba(17, 17, 19, 0.15) 80%,
              rgba(17, 17, 19, 0) 100%
            );
          }
        }

        .cr-accent-bar {
          width: 3px;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
          border-radius: 0 2px 2px 0;
          z-index: 2;
        }

        /* ── Contenu texte ── */
        .cr-top {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          position: relative;
          z-index: 2;
        }

        .cr-badge {
          display: inline-flex;
          align-self: flex-start;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 4px 12px;
          border-radius: 6px;
        }

        .cr-label {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #888;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .cr-headline {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.5rem, 2.5vw, 2.2rem);
          font-weight: 800;
          line-height: 1;
          letter-spacing: -0.02em;
          margin: 0;
          color: #0A0A0A;
        }

        .cr-desc {
          font-size: 12px;
          line-height: 1.6;
          color: #666;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .cr-price {
          font-size: 1.95rem;
          font-weight: 600;
          margin: 0;
          letter-spacing: 0.01em;
        }

        /* ── Bas ── */
        .cr-bottom {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          position: relative;
          z-index: 2;
        }

        .cr-ctas {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .cr-btn-primary {
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 8px 18px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: transform 0.15s, opacity 0.15s;
        }
        .cr-btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
        .cr-btn-primary:active { transform: scale(0.97); }

        .cr-btn-ghost {
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          font-weight: 500;
          padding: 8px 16px;
          background: transparent;
          border: 1px solid rgba(0, 0, 0, 0.15);
          border-radius: 8px;
          cursor: pointer;
          color: #0A0A0A;
          transition: border-color 0.15s, transform 0.15s;
        }
        .cr-btn-ghost:hover { border-color: rgba(0,0,0,0.35); transform: translateY(-1px); }
        .cr-btn-ghost:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

        .cr-stock-warn {
          font-size: 10px;
          color: #F59E0B;
          font-weight: 500;
          margin: 0;
        }

        /* ── Navigation ── */
        .cr-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .cr-dots { display: flex; gap: 6px; align-items: center; }

        .cr-dot {
          height: 6px;
          border-radius: 3px;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: width 0.3s ease, background 0.3s ease;
        }

        .cr-arrows { display: flex; gap: 6px; }

        .cr-arrow {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 1px solid rgba(0, 0, 0, 0.15);
          background: transparent;
          color: #0A0A0A;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          transition: border-color 0.15s, transform 0.15s;
        }
        .cr-arrow:hover { transform: scale(1.08); border-color: rgba(0,0,0,0.4); }
        .cr-arrow:active { transform: scale(0.93); }

        /* ── Panneau droit ── */
        .cr-right {
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
          background: #F5F4F0;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
        }

        .cr-image-container {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .cr-img-slot {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cr-img {
          display: block;
          transition: transform 0.3s ease;
        }

        .cr-img:hover {
          transform: scale(1.05);
        }

        .cr-tag-strip {
          position: absolute;
          top: 14px;
          left: 14px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          z-index: 5;
        }

        .cr-tag {
          font-size: 10px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 6px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .cr-tag-out {
          background: rgba(0,0,0,0.08);
          color: #666;
          border: 0.5px solid rgba(0,0,0,0.1);
        }

        .cr-counter {
          position: absolute;
          bottom: 14px;
          right: 16px;
          font-size: 11px;
          color: #999;
          letter-spacing: 0.1em;
          font-weight: 500;
          z-index: 5;
        }

        /* Indicateur swipe mobile */
        .cr-swipe-indicator {
          position: absolute;
          top: 50%;
          right: 12px;
          transform: translateY(-50%);
          z-index: 6;
          color: rgba(0,0,0,0.3);
          animation: swipePulse 2s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes swipePulse {
          0%, 100% { opacity: 0.3; transform: translateY(-50%) translateX(0); }
          50% { opacity: 0.8; transform: translateY(-50%) translateX(4px); }
        }

        @media (prefers-color-scheme: dark) {
          .cr-swipe-indicator { color: rgba(255,255,255,0.3); }
        }

        /* ── Animations ── */
        @keyframes exitLeft {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(-24px); }
        }
        @keyframes exitRight {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(24px); }
        }
        @keyframes enterLeft {
          from { opacity: 0; transform: translateX(32px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes enterRight {
          from { opacity: 0; transform: translateX(-32px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes imgIn {
          from { opacity: 0; transform: scale(0.94); }
          to   { opacity: 1; transform: scale(1); }
        }

        .anim-exit-left  { animation: exitLeft  0.3s cubic-bezier(0.55,0,1,0.45) forwards; }
        .anim-exit-right { animation: exitRight 0.3s cubic-bezier(0.55,0,1,0.45) forwards; }
        .anim-enter-left  { animation: enterLeft  0.5s cubic-bezier(0.22,1,0.36,1) forwards; }
        .anim-enter-right { animation: enterRight 0.5s cubic-bezier(0.22,1,0.36,1) forwards; }
        .anim-img-in { animation: imgIn 0.55s cubic-bezier(0.22,1,0.36,1) forwards; }

        /* ── Dark mode ── */
        @media (prefers-color-scheme: dark) {
          .cr-root { background: #111113; border-color: rgba(255,255,255,0.08); }
          .cr-headline { color: #F5F5F5; }
          .cr-label { color: #666; }
          .cr-desc { color: #999; }
          .cr-btn-ghost { color: #F5F5F5; border-color: rgba(255,255,255,0.15); }
          .cr-btn-ghost:hover { border-color: rgba(255,255,255,0.35); }
          .cr-arrow { color: #F5F5F5; border-color: rgba(255,255,255,0.15); }
          .cr-arrow:hover { border-color: rgba(255,255,255,0.4); }
          .cr-right { background: #1A1A1C; }
          .cr-counter { color: #555; }
        }

        /* ── RESPONSIVE MOBILE UNIQUEMENT ── */
        @media (max-width: 768px) {
          .cr-root {
            flex-direction: column;
            height: auto;
            min-height: auto;
            border-radius: 16px;
            cursor: auto;
          }
          .cr-root:active { cursor: auto; }
          
          .cr-left {
            padding: 1.25rem;
            min-height: 320px;
            order: 2;
          }
          
          .cr-right {
            height: 320px;
            order: 1;
            min-height: 280px;
          }
          
          .cr-mist-effect {
            width: 100%;
            right: 0;
            top: auto;
            bottom: 0;
            height: 60%;
            background: linear-gradient(
              to bottom,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 0.15) 30%,
              rgba(255, 255, 255, 0.5) 60%,
              rgba(255, 255, 255, 0.85) 85%,
              rgba(255, 255, 255, 0.98) 100%
            );
            mask: linear-gradient(to bottom, transparent 0%, black 40%, black 100%);
            -webkit-mask: linear-gradient(to bottom, transparent 0%, black 40%, black 100%);
          }
          
          @media (prefers-color-scheme: dark) {
            .cr-mist-effect {
              background: linear-gradient(
                to bottom,
                rgba(17, 17, 19, 0) 0%,
                rgba(17, 17, 19, 0.15) 30%,
                rgba(17, 17, 19, 0.5) 60%,
                rgba(17, 17, 19, 0.85) 85%,
                rgba(17, 17, 19, 0.98) 100%
              );
            }
          }
          
          .cr-headline { font-size: 1.5rem; }
          .cr-price { font-size: 1.5rem; }
          .cr-desc { font-size: 11px; -webkit-line-clamp: 3; }
          
          .cr-accent-bar {
            width: 100%;
            height: 3px;
            top: 0;
            left: 0;
            border-radius: 0 0 2px 2px;
          }
          
          .cr-ctas button {
            padding: 10px 20px;
            font-size: 12px;
          }
          
          .cr-nav {
            margin-top: 0.5rem;
          }
          
          .cr-arrow {
            width: 36px;
            height: 36px;
            font-size: 14px;
          }
          
          .cr-dot {
            height: 8px;
          }
          
          .cr-dot.active {
            width: 28px !important;
          }
          
          .cr-tag-strip {
            top: 10px;
            left: 10px;
          }
          
          .cr-counter {
            bottom: 10px;
            right: 12px;
            font-size: 10px;
          }
        }

        /* Petit mobile */
        @media (max-width: 480px) {
          .cr-left {
            padding: 1rem;
            min-height: 280px;
          }
          
          .cr-right {
            height: 260px;
          }
          
          .cr-headline {
            font-size: 1.3rem;
          }
          
          .cr-price {
            font-size: 1.3rem;
          }
          
          .cr-desc {
            font-size: 10px;
          }
          
          .cr-ctas {
            gap: 6px;
          }
          
          .cr-ctas button {
            padding: 8px 16px;
            font-size: 11px;
          }
          
          .cr-nav {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }
          
          .cr-dots {
            justify-content: center;
          }
          
          .cr-arrows {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}