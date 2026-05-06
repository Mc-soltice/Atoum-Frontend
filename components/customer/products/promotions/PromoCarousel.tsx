"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import Link from "next/link";
import ProductImage from "@/components/admin/produit/ProductImage";
import { useCart } from "@/contexte/panier/CartContext";
import { ProductPromo } from "@/types/product";

interface Props {
  slides: ProductPromo[];
  onCartClick?: () => void;
}

const DRAG_THRESHOLD = 60;
const AUTO_PLAY_DELAY = 5000;

export default function CarouselP({ slides, onCartClick }: Props) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { addToCart } = useCart();

  // Slide courant
  const slide = slides[current];

  // ── Champs dérivés depuis ProductPromo ──────────────────────────────
  const isAvailable = slide.stock > 0;
  const hasDiscount =
    slide.original_price && slide.original_price > slide.price;

  const discountPercent = hasDiscount
    ? (((slide.original_price! - slide.price) / slide.original_price!) * 100).toFixed(0)
    : null;

  const badge = hasDiscount ? `−${discountPercent}%` : "Nouveauté";
  const label = slide.name.toUpperCase();
  // Découpe le nom en deux lignes (mot 1 / reste) pour l'effet char-by-char
  const words = slide.name.split(" ");
  const headline: [string, string] = [
    words[0] ?? slide.name,
    words.slice(1).join(" ") || "",
  ];
  const priceDisplay = hasDiscount
    ? `${slide.price.toLocaleString()} € (était ${slide.original_price?.toLocaleString()} €)`
    : `À partir de ${slide.price.toLocaleString()} €`;

  // ── Couleurs fixes par index (identité visuelle conservée) ───────────
  const THEMES = [
    { bg: "#F5F0E8", text: "#0A0A0A", accent: "#FF3B00", accentText: "#fff" },
    { bg: "#0D0F14", text: "#FFFFFF", accent: "#3B82F6", accentText: "#fff" },
    { bg: "#FFF9F0", text: "#1A1A1A", accent: "#FF9500", accentText: "#fff" },
    { bg: "#1C1410", text: "#F5EFE6", accent: "#D4A853", accentText: "#1C1410" },
  ];
  const theme = THEMES[current % THEMES.length];

  // ── Navigation ───────────────────────────────────────────────────────
  const goTo = (index: number, dir?: number) => {
    const d = dir ?? (index > current ? 1 : -1);
    setDirection(d);
    setCurrent(index);
  };
  const next = () => goTo((current + 1) % slides.length, 1);
  const prev = () => goTo((current - 1 + slides.length) % slides.length, -1);

  useEffect(() => {
    if (isHovered) return;
    timerRef.current = setTimeout(next, AUTO_PLAY_DELAY);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [current, isHovered]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -DRAG_THRESHOLD) next();
    else if (info.offset.x > DRAG_THRESHOLD) prev();
  };

  // ── Panier ───────────────────────────────────────────────────────────
  const handleAddToCart = () => {
    if (!isAvailable) return;
    addToCart(slide, 1);
    if (onCartClick) onCartClick();
  };

  // ── Variants Framer Motion (identiques à l'original) ─────────────────
  const customEase = [0.76, 0, 0.24, 1];
  const customEase2 = [0.22, 1, 0.36, 1];
  const springEase = [0.4, 0, 0.2, 1];

  const imgVariants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", scale: 1.08 }),
    center: { x: 0, scale: 1, transition: { duration: 0.85, ease: customEase as any } },
    exit: (d: number) => ({
      x: d > 0 ? "-28%" : "28%",
      scale: 1.04,
      opacity: 0,
      transition: { duration: 0.65, ease: customEase as any },
    }),
  };

  const textContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06, delayChildren: 0.3 } },
    exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
  };

  const charVariant = {
    hidden: { y: "115%", opacity: 0 },
    visible: { y: "0%", opacity: 1, transition: { duration: 0.52, ease: customEase2 as any } },
    exit: { y: "-55%", opacity: 0, transition: { duration: 0.28, ease: [0.55, 0, 1, 0.45] as any } },
  };

  const fadeUp = {
    hidden: { y: 18, opacity: 0 },
    visible: (i: number) => ({
      y: 0, opacity: 1,
      transition: { delay: 0.45 + i * 0.07, duration: 0.48, ease: customEase2 as any },
    }),
    exit: { y: -8, opacity: 0, transition: { duration: 0.18 } },
  };

  const circumference = 2 * Math.PI * 7;

  if (!slides.length) return null;

  return (
    <div
      className="carousel-root rounded-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: theme.bg,
        color: theme.text,
        transition: "background 0.9s ease, color 0.6s ease",
      }}
    >
      {/* ── Image ─────────────────────────────────────────────────────── */}
      <div className="img-track rounded-lg">
        <AnimatePresence custom={direction} mode="popLayout">
          <motion.div
            key={`img-${current}`}
            className="img-wrapper"
            custom={direction}
            variants={imgVariants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
          >
            {/* ProductImage remplace <img> */}
            <ProductImage
              src={slide.main_image}
              alt={slide.name}
              className="slide-img"
            />
            <div
              className="overlay"
              style={{
                background: `linear-gradient(105deg, ${theme.bg}F8 0%, ${theme.bg}D0 30%, ${theme.bg}55 58%, transparent 100%)`,
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Compteur ──────────────────────────────────────────────────── */}
      <div className="counter" style={{ color: `${theme.text}50` }}>
        <AnimatePresence mode="wait">
          <motion.span
            key={current}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.28 }}
          >
            0{current + 1}
          </motion.span>
        </AnimatePresence>
        <span className="counter-sep" style={{ background: `${theme.text}28` }} />
        <span>0{slides.length}</span>
      </div>

      {/* ── Contenu ───────────────────────────────────────────────────── */}
      <div className="content">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${current}`}
            className="content-inner"
            variants={textContainer}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Badge */}
            <motion.span
              variants={fadeUp}
              custom={0}
              className="badge"
              style={{ background: theme.accent, color: theme.accentText }}
            >
              {badge}
            </motion.span>

            {/* Label */}
            <motion.p variants={fadeUp} custom={1} className="label">
              {label}
            </motion.p>

            {/* Headline char-by-char */}
            <h2 className="headline">
              {headline.filter(Boolean).map((line, li) => (
                <span key={li} className="headline-line">
                  {line.split("").map((char, ci) => (
                    <motion.span
                      key={`${li}-${ci}`}
                      variants={charVariant}
                      style={{
                        display: "inline-block",
                        whiteSpace: char === " " ? "pre" : "normal",
                      }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              ))}
            </h2>

            {/* Description */}
            <motion.p variants={fadeUp} custom={2} className="sub">
              {slide.description}
            </motion.p>

            {/* Prix */}
            <motion.p
              variants={fadeUp}
              custom={3}
              className="price"
              style={{ color: theme.accent }}
            >
              {priceDisplay}
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} custom={4} className="ctas">
              {/* CTA principal → page produit */}
              <Link href={`/produits/${slide.id}`} aria-label={`Voir ${slide.name}`}>
                <motion.span
                  className="btn-primary rounded-lg p-2"
                  style={{ background: theme.accent, color: theme.accentText }}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 380, damping: 22 }}
                >
                  Voir le produit
                </motion.span>
              </Link>

              {/* CTA secondaire → ajouter au panier */}
              <motion.button
                className="btn-ghost ml-1"
                style={{ borderColor: `${theme.text}28`, color: theme.text }}
                onClick={handleAddToCart}
                disabled={!isAvailable}
                whileHover={isAvailable ? {
                  scale: 1.03,
                  borderColor: theme.accent,
                  color: theme.accent,
                } : {}}
                whileTap={isAvailable ? { scale: 0.97 } : {}}
                transition={{ duration: 0.18 }}
              >
                {isAvailable ? "Ajouter au panier" : "Indisponible"}
              </motion.button>
            </motion.div>

            {/* Stock faible */}
            {slide.stock > 0 && slide.stock <= 5 && (
              <motion.p
                variants={fadeUp}
                custom={5}
                className="hashtag"
                style={{ color: theme.accent }}
              >
                ⚠ Plus que {slide.stock} en stock
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Barre du bas ──────────────────────────────────────────────── */}
      <div className="bottom-bar">
        <div className="dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className="dot-btn"
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
            >
              <svg width="34" height="34" viewBox="0 0 36 36">
                <circle
                  cx="18" cy="18" r="7"
                  fill="none"
                  stroke={i === current ? `${theme.text}20` : `${theme.text}18`}
                  strokeWidth="1.5"
                />
                {i === current && (
                  <motion.circle
                    cx="18" cy="18" r="7"
                    fill="none"
                    stroke={theme.accent}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference, rotate: -90 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: AUTO_PLAY_DELAY / 1000, ease: "linear" }}
                    style={{ transformOrigin: "18px 18px" }}
                  />
                )}
                <motion.circle
                  cx="18" cy="18"
                  animate={{
                    r: i === current ? 4 : 2.5,
                    fill: i === current ? theme.accent : `${theme.text}38`,
                  }}
                  transition={{ duration: 0.32, ease: springEase as any }}
                />
              </svg>
            </button>
          ))}
        </div>

        <div className="arrows">
          <motion.button
            className="arrow-btn"
            onClick={prev}
            style={{ borderColor: `${theme.text}22`, color: theme.text }}
            whileHover={{ scale: 1.1, x: -2, borderColor: theme.accent, color: theme.accent }}
            whileTap={{ scale: 0.9 }}
          >←</motion.button>
          <motion.button
            className="arrow-btn"
            onClick={next}
            style={{ borderColor: `${theme.text}22`, color: theme.text }}
            whileHover={{ scale: 1.1, x: 2, borderColor: theme.accent, color: theme.accent }}
            whileTap={{ scale: 0.9 }}
          >→</motion.button>
        </div>
      </div>

      {/* ── Styles (identiques à l'original) ─────────────────────────── */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Outfit:wght@300;400;500;600&display=swap');

        .carousel-root {
          position: relative; width: 100%; height: 560px;
          overflow: hidden; font-family: 'Outfit', sans-serif;
          cursor: grab; user-select: none;
        }
        .carousel-root:active { cursor: grabbing; }
        .img-track { position: absolute; inset: 0; overflow: hidden; }
        .img-wrapper { position: absolute; inset: 0; will-change: transform; }
        .slide-img {
          width: 100%; height: 100%;
          object-fit: cover; object-position: center;
          pointer-events: none; display: block;
        }
        .overlay { position: absolute; inset: 0; }
        .counter {
          position: absolute; top: 1.6rem; right: 5%;
          display: flex; align-items: center; gap: 0.55rem;
          font-size: 0.72rem; font-weight: 500; letter-spacing: 0.08em; z-index: 10;
        }
        .counter-sep { width: 22px; height: 1px; display: block; }
        .content {
          position: absolute; inset: 0;
          display: flex; align-items: center; z-index: 5; padding: 0 5%;
        }
        .content-inner { max-width: 500px; display: flex; flex-direction: column; gap: 0; }
        .badge {
          display: inline-flex; align-self: flex-start;
          font-size: 0.62rem; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase;
          padding: 0.28rem 0.8rem; border-radius: 2px; margin-bottom: 0.85rem;
        }
        .label {
          font-size: 0.68rem; font-weight: 500;
          letter-spacing: 0.35em; text-transform: uppercase;
          opacity: 0.45; margin: 0 0 0.55rem;
        }
        .headline {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2.8rem, 5.5vw, 5rem);
          font-weight: 800; line-height: 0.93;
          margin: 0 0 1.1rem; letter-spacing: -0.02em;
        }
        .headline-line { display: block; overflow: hidden; line-height: 1.06; }
        .sub { font-size: 0.88rem; line-height: 1.65; opacity: 0.6; margin: 0 0 0.55rem; max-width: 360px; font-weight: 300; }
        .price { font-size: 0.95rem; font-weight: 600; margin: 0 0 1.35rem; letter-spacing: 0.01em; }
        .ctas { display: flex; gap: 0.65rem; flex-wrap: wrap; margin-bottom: 1.1rem; }
        .btn-primary {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.72rem 1.5rem; font-size: 0.78rem; font-weight: 600;
          letter-spacing: 0.08em; text-transform: uppercase;
          border: none; border-radius: 3px; cursor: pointer; font-family: 'Outfit', sans-serif;
        }
        .btn-ghost {
          display: inline-flex; align-items: center;
          padding: 0.72rem 1.3rem; font-size: 0.78rem; font-weight: 500;
          letter-spacing: 0.05em; background: transparent; border: 1px solid;
          border-radius: 3px; cursor: pointer; font-family: 'Outfit', sans-serif;
        }
        .btn-ghost:disabled { opacity: 0.45; cursor: not-allowed; }
        .hashtag { font-size: 0.7rem; letter-spacing: 0.05em; margin: 0; }
        .bottom-bar {
          position: absolute; bottom: 1.4rem; left: 5%; right: 5%;
          display: flex; align-items: center; justify-content: space-between; z-index: 10;
        }
        .dots { display: flex; align-items: center; gap: 0; }
        .dot-btn { background: none; border: none; padding: 2px; cursor: pointer; line-height: 0; }
        .arrows { display: flex; gap: 0.45rem; }
        .arrow-btn {
          width: 2.4rem; height: 2.4rem;
          display: flex; align-items: center; justify-content: center;
          background: transparent; border: 1px solid;
          border-radius: 50%; font-size: 0.9rem; cursor: pointer; font-family: inherit;
        }
        @media (max-width: 640px) {
          .carousel-root { height: 400px; }
          .headline { font-size: clamp(2.2rem, 10vw, 3rem); }
          .sub, .btn-ghost { display: none; }
          .content, .bottom-bar, .counter { left: 4%; right: 4%; padding: 0 4%; }
        }
      `}</style>
    </div>
  );
}