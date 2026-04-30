// Ajoutez ce composant avant votre CarouselSplit
"use client";
import { useEffect, useState } from "react";

// Composant de bandeau promo moderne
export default function PromoBannercopy() {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 24, minutes: 0, seconds: 0 });

  // Timer pour le clignotement
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(prev => !prev);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  // Timer pour le compte à rebours
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => String(num).padStart(2, '0');

  return (
    <div className="promo-banner-container">
      <div className={`promo-banner ${!isVisible ? 'blink-off' : ''}`}>
        {/* Pattern décoratif */}
        <div className="pattern-overlay"></div>

        <div className="promo-content">
          <div className="promo-badge">FLASH SALE</div>
          <div className="promo-text-group">
            <span className="promo-text">LIVRAISON OFFERTE</span>
            <span className="promo-separator">✦</span>
            <span className="promo-text highlight">CONSULTEZ NOS PRODUITS EN PROMO</span>
            <span className="promo-separator">✦</span>
            <span className="promo-code">CODE: FLASH30</span>
          </div>
        </div>

        <div className="promo-timer">
          <div className="timer-unit">
            <span className="timer-value">{formatNumber(timeLeft.hours)}</span>
            <span className="timer-label">HEURES</span>
          </div>
          <span className="timer-separator">:</span>
          <div className="timer-unit">
            <span className="timer-value">{formatNumber(timeLeft.minutes)}</span>
            <span className="timer-label">MIN</span>
          </div>
          <span className="timer-separator">:</span>
          <div className="timer-unit">
            <span className="timer-value">{formatNumber(timeLeft.seconds)}</span>
            <span className="timer-label">SEC</span>
          </div>
        </div>

        <button className="promo-cta">
          J'en profite
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <style jsx>{`
        .promo-banner-container {
          margin-bottom: clamp(0.75rem, 2vw, 1.5rem);
          border-radius: clamp(12px, 2vw, 20px);
          overflow: hidden;
          position: relative;
          z-index: 10;
        }
        
        .promo-banner {
          background: linear-gradient(105deg, 
            rgb(15, 15, 25) 0%,
            rgb(25, 20, 45) 25%,
            rgb(45, 20, 55) 50%,
            rgb(25, 20, 45) 75%,
            rgb(15, 15, 25) 100%);
          background-size: 200% 100%;
          padding: clamp(8px, 1.5vw, 14px) clamp(12px, 2.5vw, 28px);
          border-radius: clamp(12px, 2vw, 20px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: clamp(10px, 2vw, 20px);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255, 75, 75, 0.3);
          backdrop-filter: blur(10px);
        }
        
        .pattern-overlay {
          position: absolute;
          inset: 0;
          background-image: 
            repeating-linear-gradient(45deg, rgba(255, 75, 75, 0.05) 0px, rgba(255, 75, 75, 0.05) 2px, transparent 2px, transparent 8px);
          pointer-events: none;
        }
        
        .promo-banner::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255, 75, 75, 0.1) 0%, transparent 70%);
          animation: rotate 10s linear infinite;
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .promo-banner.blink-off {
          opacity: 0.6;
        }
        
        .promo-content {
          display: flex;
          align-items: center;
          gap: clamp(10px, 2vw, 20px);
          flex: 1;
          flex-wrap: wrap;
          justify-content: center;
        }
        
        .promo-badge {
          background: linear-gradient(135deg, #FF4B4B, #FF6B6B);
          padding: clamp(4px, 0.8vw, 6px) clamp(8px, 1.5vw, 14px);
          border-radius: 30px;
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          font-size: clamp(0.55rem, 1.2vw, 0.7rem);
          letter-spacing: 0.1em;
          color: white;
          text-transform: uppercase;
          box-shadow: 0 2px 8px rgba(255, 75, 75, 0.4);
          animation: pulse 1.5s ease-in-out infinite;
          white-space: nowrap;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 2px 8px rgba(255, 75, 75, 0.4); }
          50% { transform: scale(1.05); box-shadow: 0 4px 15px rgba(255, 75, 75, 0.6); }
        }
        
        .promo-text-group {
          display: flex;
          align-items: center;
          gap: clamp(6px, 1.5vw, 12px);
          flex-wrap: wrap;
          justify-content: center;
        }
        
        .promo-text {
          font-family: 'Outfit', sans-serif;
          font-weight: 600;
          font-size: clamp(0.65rem, 1.4vw, 0.9rem);
          letter-spacing: 0.05em;
          color: rgba(255, 255, 255, 0.9);
          white-space: nowrap;
        }
        
        .promo-text.highlight {
          font-weight: 800;
          color: #FF4B4B;
          text-shadow: 0 0 10px rgba(255, 75, 75, 0.5);
        }
        
        .promo-separator {
          font-size: clamp(0.6rem, 1.2vw, 0.8rem);
          color: rgba(255, 255, 255, 0.5);
        }
        
        .promo-code {
          background: rgba(255, 75, 75, 0.2);
          padding: clamp(2px, 0.6vw, 4px) clamp(6px, 1.2vw, 12px);
          border-radius: 20px;
          font-family: 'Syne', monospace;
          font-weight: 700;
          font-size: clamp(0.6rem, 1.3vw, 0.85rem);
          color: #FF4B4B;
          letter-spacing: 0.05em;
          border: 1px solid rgba(255, 75, 75, 0.3);
          white-space: nowrap;
        }
        
        .promo-timer {
          display: flex;
          align-items: center;
          gap: clamp(4px, 1vw, 8px);
          background: rgba(0, 0, 0, 0.4);
          padding: clamp(4px, 0.8vw, 8px) clamp(10px, 2vw, 20px);
          border-radius: 50px;
          backdrop-filter: blur(8px);
        }
        
        .timer-unit {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: clamp(30px, 6vw, 45px);
        }
        
        .timer-value {
          font-family: 'Syne', monospace;
          font-weight: 800;
          font-size: clamp(0.85rem, 2vw, 1.2rem);
          color: white;
          line-height: 1.2;
        }
        
        .timer-label {
          font-family: 'Outfit', sans-serif;
          font-weight: 600;
          font-size: clamp(0.45rem, 1vw, 0.6rem);
          letter-spacing: 0.08em;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
        }
        
        .timer-separator {
          font-family: 'Syne', monospace;
          font-weight: 800;
          font-size: clamp(0.85rem, 2vw, 1.2rem);
          color: #FF4B4B;
          margin-bottom: clamp(6px, 1.5vw, 12px);
        }
        
        .promo-cta {
          background: linear-gradient(135deg, #FF4B4B, #FF6B6B);
          border: none;
          padding: clamp(6px, 1.2vw, 10px) clamp(12px, 2.5vw, 24px);
          border-radius: 50px;
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: clamp(0.65rem, 1.4vw, 0.85rem);
          color: white;
          display: flex;
          align-items: center;
          gap: clamp(4px, 1vw, 8px);
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(255, 75, 75, 0.3);
          white-space: nowrap;
        }
        
        .promo-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 75, 75, 0.4);
          gap: clamp(6px, 1.5vw, 12px);
        }
        
        .promo-cta:active {
          transform: translateY(0);
        }
        
        .promo-cta svg {
          width: clamp(12px, 2vw, 16px);
          height: clamp(12px, 2vw, 16px);
        }
        
        /* Points de rupture progressifs avec réduction du contenu */
        @media (max-width: 800px) {
          .promo-text {
            font-size: clamp(0.6rem, 1.2vw, 0.75rem);
          }
          
          .promo-code {
            font-size: clamp(0.55rem, 1.1vw, 0.7rem);
          }
          
          .promo-badge {
            font-size: clamp(0.5rem, 1vw, 0.6rem);
          }
        }
        
        @media (max-width: 700px) {
          .promo-banner {
            flex-direction: column;
            padding: clamp(10px, 2vw, 16px);
          }
          
          .promo-content {
            width: 100%;
            justify-content: center;
          }
          
          .promo-text-group {
            justify-content: center;
          }
          
          .promo-timer {
            order: 2;
          }
          
          .promo-cta {
            order: 3;
          }
        }
        
        @media (max-width: 550px) {
          .promo-content {
            flex-direction: column;
            gap: clamp(8px, 2vw, 12px);
          }
          
          .promo-text-group {
            gap: clamp(4px, 1.5vw, 8px);
          }
          
          .promo-text {
            font-size: clamp(0.55rem, 1.1vw, 0.65rem);
          }
          
          .promo-separator {
            font-size: clamp(0.5rem, 1vw, 0.6rem);
          }
          
          .promo-code {
            font-size: clamp(0.5rem, 1vw, 0.6rem);
            padding: clamp(1px, 0.5vw, 3px) clamp(4px, 1vw, 8px);
          }
        }
        
        @media (max-width: 450px) {
          .timer-value {
            font-size: clamp(0.7rem, 1.5vw, 0.85rem);
          }
          
          .timer-unit {
            min-width: clamp(25px, 5vw, 30px);
          }
          
          .promo-badge {
            font-size: clamp(0.45rem, 0.9vw, 0.55rem);
            padding: clamp(2px, 0.5vw, 4px) clamp(6px, 1.2vw, 10px);
          }
          
          .promo-text {
            font-size: clamp(0.5rem, 1vw, 0.6rem);
          }
          
          .promo-cta {
            font-size: clamp(0.55rem, 1.1vw, 0.65rem);
            padding: clamp(4px, 1vw, 8px) clamp(10px, 2vw, 20px);
          }
        }
        
        @media (max-width: 360px) {
          .promo-text-group {
            gap: clamp(2px, 1vw, 4px);
          }
          
          .promo-text {
            font-size: 0.5rem;
          }
          
          .promo-separator {
            font-size: 0.45rem;
          }
          
          .timer-label {
            font-size: 0.4rem;
          }
          
          .timer-value {
            font-size: 0.7rem;
          }
          
          .timer-unit {
            min-width: 22px;
          }
        }
      `}</style>
    </div>
  );
}