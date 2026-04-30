"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";

const slides = [
  {
    id: 0,
    badge: "Nouveauté",
    label: "AIR MAX PULSE",
    headline: ["Confort", "Redéfini"],
    sub: "Amorti réactif nouvelle génération. Disponible maintenant.",
    cta: "Acheter",
    ctaSecondary: "Voir la collection",
    tag: "#AirMaxPulse",
    price: "À partir de 149€",
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=90",
    bg: "#F5F0E8",
    text: "#0A0A0A",
    accent: "#FF3B00",
    accentText: "#fff",
  },
  {
    id: 1,
    badge: "Tendance",
    label: "TECH OUTERWEAR",
    headline: ["L'hiver", "Autrement"],
    sub: "Matières techniques, coupes architecturales. Livraison offerte.",
    cta: "Découvrir",
    ctaSecondary: "Voir les looks",
    tag: "#WinterTech",
    price: "À partir de 299€",
    img: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1200&q=90",
    bg: "#0D0F14",
    text: "#FFFFFF",
    accent: "#3B82F6",
    accentText: "#fff",
  },
  {
    id: 2,
    badge: "Édition Limitée",
    label: "CAPSULE ÉTÉ",
    headline: ["Couleurs", "Vives"],
    sub: "100 pièces seulement. Sérigraphie artisanale, coton bio.",
    cta: "S'approprier",
    ctaSecondary: "En savoir plus",
    tag: "#SummerCapsule",
    price: "À partir de 79€",
    img: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200&q=90",
    bg: "#FFF9F0",
    text: "#1A1A1A",
    accent: "#FF9500",
    accentText: "#fff",
  },
  {
    id: 3,
    badge: "Bestseller",
    label: "EVERYDAY BAG",
    headline: ["Simple.", "Parfait."],
    sub: "Cuir pleine fleur, quincaillerie dorée. Le sac qui dure.",
    cta: "Commander",
    ctaSecondary: "Personnaliser",
    tag: "#EverydayBag",
    price: "À partir de 219€",
    img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&q=90",
    bg: "#1C1410",
    text: "#F5EFE6",
    accent: "#D4A853",
    accentText: "#1C1410",
  },
];

const DRAG_THRESHOLD = 60;
const AUTO_PLAY_DELAY = 5000;

export default function Carousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const slide = slides[current];

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

  // Define easing functions as strings that framer-motion accepts
  const customEase = [0.76, 0, 0.24, 1];
  const customEase2 = [0.22, 1, 0.36, 1];
  const springEase = [0.4, 0, 0.2, 1];

  const imgVariants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", scale: 1.08 }),
    center: {
      x: 0,
      scale: 1,
      transition: { duration: 0.85, ease: customEase as any }
    },
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
    visible: {
      y: "0%",
      opacity: 1,
      transition: { duration: 0.52, ease: customEase2 as any }
    },
    exit: {
      y: "-55%",
      opacity: 0,
      transition: { duration: 0.28, ease: [0.55, 0, 1, 0.45] as any }
    },
  };

  const fadeUp = {
    hidden: { y: 18, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: { delay: 0.45 + i * 0.07, duration: 0.48, ease: customEase2 as any },
    }),
    exit: { y: -8, opacity: 0, transition: { duration: 0.18 } },
  };

  const circumference = 2 * Math.PI * 7;

  return (
    <div
      className="carousel-root rounded-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: slide.bg,
        color: slide.text,
        transition: "background 0.9s ease, color 0.6s ease",
      }}
    >
      {/* Image */}
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
            <img src={slide.img} alt={slide.label} className="slide-img" />
            <div
              className="overlay"
              style={{
                background: `linear-gradient(105deg, ${slide.bg}F8 0%, ${slide.bg}D0 30%, ${slide.bg}55 58%, transparent 100%)`,
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Counter top-right */}
      <div className="counter" style={{ color: `${slide.text}50` }}>
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
        <span className="counter-sep" style={{ background: `${slide.text}28` }} />
        <span>0{slides.length}</span>
      </div>

      {/* Content */}
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
              style={{ background: slide.accent, color: slide.accentText }}
            >
              {slide.badge}
            </motion.span>

            {/* Label */}
            <motion.p variants={fadeUp} custom={1} className="label">
              {slide.label}
            </motion.p>

            {/* Headline — char by char */}
            <h2 className="headline">
              {slide.headline.map((line, li) => (
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

            {/* Sub */}
            <motion.p variants={fadeUp} custom={2} className="sub">
              {slide.sub}
            </motion.p>

            {/* Price */}
            <motion.p
              variants={fadeUp}
              custom={3}
              className="price"
              style={{ color: slide.accent }}
            >
              {slide.price}
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} custom={4} className="ctas">
              <motion.button
                className="btn-primary rounded-lg p-2"
                style={{ background: slide.accent, color: slide.accentText }}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 380, damping: 22 }}
              >
                {slide.cta}
              </motion.button>
              <motion.button
                className="btn-ghost ml-1"
                style={{ borderColor: `${slide.text}28`, color: slide.text }}
                whileHover={{
                  scale: 1.03,
                  borderColor: slide.accent,
                  color: slide.accent,
                }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.18 }}
              >
                {slide.ctaSecondary}
              </motion.button>
            </motion.div>

            {/* Hashtag */}
            <motion.p
              variants={fadeUp}
              custom={5}
              className="hashtag"
              style={{ color: `${slide.text}45` }}
            >
              {slide.tag}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom bar */}
      <div className="bottom-bar">
        {/* Dot indicators with SVG progress ring */}
        <div className="dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className="dot-btn"
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
            >
              <svg width="34" height="34" viewBox="0 0 36 36">
                {/* Track */}
                <circle
                  cx="18" cy="18" r="7"
                  fill="none"
                  stroke={i === current ? `${slide.text}20` : `${slide.text}18`}
                  strokeWidth="1.5"
                />
                {/* Animated progress ring on active */}
                {i === current && (
                  <motion.circle
                    cx="18" cy="18" r="7"
                    fill="none"
                    stroke={slide.accent}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference, rotate: -90 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: AUTO_PLAY_DELAY / 1000, ease: "linear" }}
                    style={{ transformOrigin: "18px 18px" }}
                  />
                )}
                {/* Center dot */}
                <motion.circle
                  cx="18" cy="18"
                  animate={{
                    r: i === current ? 4 : 2.5,
                    fill: i === current ? slide.accent : `${slide.text}38`,
                  }}
                  transition={{ duration: 0.32, ease: springEase as any }}
                />
              </svg>
            </button>
          ))}
        </div>

        {/* Arrow controls */}
        <div className="arrows">
          <motion.button
            className="arrow-btn"
            onClick={prev}
            style={{ borderColor: `${slide.text}22`, color: slide.text }}
            whileHover={{ scale: 1.1, x: -2, borderColor: slide.accent, color: slide.accent }}
            whileTap={{ scale: 0.9 }}
          >
            ←
          </motion.button>
          <motion.button
            className="arrow-btn"
            onClick={next}
            style={{ borderColor: `${slide.text}22`, color: slide.text }}
            whileHover={{ scale: 1.1, x: 2, borderColor: slide.accent, color: slide.accent }}
            whileTap={{ scale: 0.9 }}
          >
            →
          </motion.button>
        </div>
      </div>

      <style jsx>{`

        .carousel-root {
          position: relative;
          width: 100%;
          height: 560px;
          overflow: hidden;
          font-family: 'Outfit', sans-serif;
          cursor: grab;
          user-select: none;
        }
        .carousel-root:active { cursor: grabbing; }

        /* Image */
        .img-track { position: absolute; inset: 0; overflow: hidden; }
        .img-wrapper { position: absolute; inset: 0; will-change: transform; }
        .slide-img {
          width: 100%; height: 100%;
          object-fit: cover; object-position: center;
          pointer-events: none; display: block;
        }
        .overlay { position: absolute; inset: 0; }

        /* Counter */
        .counter {
          position: absolute;
          top: 1.6rem; right: 5%;
          display: flex; align-items: center; gap: 0.55rem;
          font-size: 0.72rem; font-weight: 500; letter-spacing: 0.08em;
          z-index: 10;
        }
        .counter-sep { width: 22px; height: 1px; display: block; }

        /* Content */
        .content {
          position: absolute; inset: 0;
          display: flex; align-items: center;
          z-index: 5; padding: 0 5%;
        }
        .content-inner {
          max-width: 500px;
          display: flex; flex-direction: column; gap: 0;
        }

        .badge {
          display: inline-flex; align-self: flex-start;
          font-size: 0.62rem; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase;
          padding: 0.28rem 0.8rem;
          border-radius: 2px;
          margin-bottom: 0.85rem;
        }

        .label {
          font-size: 0.68rem; font-weight: 500;
          letter-spacing: 0.35em; text-transform: uppercase;
          opacity: 0.45; margin: 0 0 0.55rem;
        }

        .headline {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2.8rem, 5.5vw, 5rem);
          font-weight: 800;
          line-height: 0.93;
          margin: 0 0 1.1rem;
          letter-spacing: -0.02em;
        }
        .headline-line {
          display: block;
          overflow: hidden;
          line-height: 1.06;
        }

        .sub {
          font-size: 0.88rem; line-height: 1.65;
          opacity: 0.6; margin: 0 0 0.55rem;
          max-width: 360px; font-weight: 300;
        }

        .price {
          font-size: 0.95rem; font-weight: 600;
          margin: 0 0 1.35rem; letter-spacing: 0.01em;
        }

        .ctas { display: flex; gap: 0.65rem; flex-wrap: wrap; margin-bottom: 1.1rem; }

        .btn-primary {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.72rem 1.5rem;
          font-size: 0.78rem; font-weight: 600;
          letter-spacing: 0.08em; text-transform: uppercase;
          border: none; border-radius: 3px; cursor: pointer;
          font-family: 'Outfit', sans-serif;
        }
        .btn-arrow { transition: transform 0.2s; }
        .btn-primary:hover .btn-arrow { transform: translateX(4px); }

        .btn-ghost {
          display: inline-flex; align-items: center;
          padding: 0.72rem 1.3rem;
          font-size: 0.78rem; font-weight: 500;
          letter-spacing: 0.05em;
          background: transparent; border: 1px solid;
          border-radius: 3px; cursor: pointer;
          font-family: 'Outfit', sans-serif;
        }

        .hashtag {
          font-size: 0.7rem; letter-spacing: 0.05em; margin: 0;
        }

        /* Bottom bar */
        .bottom-bar {
          position: absolute;
          bottom: 1.4rem; left: 5%; right: 5%;
          display: flex; align-items: center;
          justify-content: space-between;
          z-index: 10;
        }

        .dots { display: flex; align-items: center; gap: 0; }
        .dot-btn {
          background: none; border: none; padding: 2px;
          cursor: pointer; line-height: 0;
        }

        .arrows { display: flex; gap: 0.45rem; }
        .arrow-btn {
          width: 2.4rem; height: 2.4rem;
          display: flex; align-items: center; justify-content: center;
          background: transparent; border: 1px solid;
          border-radius: 50%; font-size: 0.9rem;
          cursor: pointer; font-family: inherit;
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