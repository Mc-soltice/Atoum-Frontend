// Ajoutez ce composant avant votre CarouselSplit
"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Composant de bandeau promo moderne
export default function PromoBanner() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState({ hours: 24, minutes: 0, seconds: 0 });

  // Timer pour le compte à rebours avec redémarrage
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
        } else {
          // Redémarrer le compteur à 24h quand il atteint zéro
          return { hours: 24, minutes: 0, seconds: 0 };
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => String(num).padStart(2, '0');

  return (
    <div className="promo-banner-container">
      <div className="promo-banner">
        {/* Ligne 1 : Badge + Texte promo */}
        <div className="promo-header">
          <div className="promo-badge">⚡ FLASH SALE</div>
          <div className="promo-text-group">
            <span className="promo-text highlight">-30% SUR UNE SÉLECTION</span>
          </div>
        </div>

        {/* Ligne 2 : Timer seul sur mobile, Timer + CTA sur desktop */}
        <div className="promo-footer">
          <div className="promo-timer">
            <div className="timer-unit">
              <span className="timer-value">{formatNumber(timeLeft.hours)}</span>
              <span className="timer-label">h</span>
            </div>
            <span className="timer-separator">:</span>
            <div className="timer-unit">
              <span className="timer-value">{formatNumber(timeLeft.minutes)}</span>
              <span className="timer-label">m</span>
            </div>
            <span className="timer-separator">:</span>
            <div className="timer-unit">
              <span className="timer-value">{formatNumber(timeLeft.seconds)}</span>
              <span className="timer-label">s</span>
            </div>
          </div>

          <button
            className="promo-cta"
            onClick={() => router.push("/promotions")}
          >
            J'en profite
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        .promo-banner-container {
          margin-bottom: 1rem;
          border-radius: 16px;
          overflow: hidden;
          position: relative;
          z-index: 10;
          width: 100%;
          padding: 0 4px;
        }
        
        .promo-banner {
          background: linear-gradient(105deg, 
            #1a1a1a 0%,
            #2a2a2a 50%,
            #1a1a1a 100%);
          padding: 12px 16px;
          border-radius: 16px;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(34, 197, 94, 0.2);
          transition: all 0.3s ease;
        }
        
        .promo-banner::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(34, 197, 94, 0.06) 0%, transparent 70%);
          animation: rotate 10s linear infinite;
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        /* Header section */
        .promo-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 12px;
          position: relative;
          z-index: 2;
        }
        
        .promo-badge {
          background: linear-gradient(135deg, #dc2626, #ef4444);
          padding: 5px 12px;
          border-radius: 30px;
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          font-size: 0.7rem;
          letter-spacing: 0.05em;
          color: white;
          text-transform: uppercase;
          box-shadow: 0 2px 8px rgba(220, 38, 38, 0.3);
          animation: pulse 1.5s ease-in-out infinite;
          white-space: nowrap;
          position: relative;
          overflow: hidden;
        }
        
        .promo-badge::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -100%;
          width: 100%;
          height: 200%;
          background: linear-gradient(
            135deg,
            transparent 0%,
            rgba(255, 255, 255, 0.4) 25%,
            rgba(255, 255, 255, 0.6) 50%,
            rgba(255, 255, 255, 0.4) 75%,
            transparent 100%
          );
          animation: shimmer 2s infinite;
        }
        
        @keyframes shimmer {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        
        .promo-text-group {
          flex: 1;
        }
        
        .promo-text {
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: 0.8rem;
          letter-spacing: 0.02em;
          color: rgba(255, 255, 255, 0.95);
        }
        
        .promo-text.highlight {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        /* Footer section avec timer et CTA */
        .promo-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          position: relative;
          z-index: 2;
        }
        
        .promo-timer {
          display: flex;
          align-items: baseline;
          gap: 4px;
          background: rgba(0, 0, 0, 0.4);
          padding: 6px 14px;
          border-radius: 40px;
          flex: 1;
          justify-content: center;
        }
        
        .timer-unit {
          display: flex;
          align-items: baseline;
          gap: 3px;
        }
        
        .timer-value {
          font-family: 'Syne', monospace;
          font-weight: 800;
          font-size: 1.2rem;
          color: #22c55e;
          line-height: 1;
        }
        
        .timer-label {
          font-family: 'Outfit', sans-serif;
          font-weight: 600;
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.7);
          text-transform: lowercase;
        }
        
        .timer-separator {
          font-family: 'Syne', monospace;
          font-weight: 800;
          font-size: 1.1rem;
          color: #dc2626;
          margin: 0 2px;
        }
        
        .promo-cta {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          border: none;
          padding: 8px 18px;
          border-radius: 40px;
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: 0.8rem;
          color: white;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 10px rgba(34, 197, 94, 0.3);
          white-space: nowrap;
        }
        
        .promo-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(34, 197, 94, 0.4);
          gap: 10px;
        }
        
        .promo-cta:active {
          transform: translateY(0);
        }
        
        /* Version desktop */
        @media (min-width: 769px) {
          .promo-banner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 14px 24px;
          }
          
          .promo-header {
            margin-bottom: 0;
            flex: 2;
          }
          
          .promo-footer {
            flex: 1;
            justify-content: flex-end;
          }
          
          .promo-timer {
            flex: 0 0 auto;
            justify-content: center;
          }
          
          .promo-badge {
            font-size: 0.75rem;
          }
          
          .promo-text {
            font-size: 0.9rem;
          }
          
          .promo-cta {
            display: flex; /* Visible sur desktop */
          }
        }
        
        /* Version mobile - bouton caché */
        @media (max-width: 768px) {
          .promo-banner-container {
            padding: 0;
            margin-bottom: 0.75rem;
          }
          
          .promo-banner {
            padding: 10px 14px;
          }
          
          .promo-header {
            gap: 10px;
            margin-bottom: 10px;
          }
          
          .promo-badge {
            font-size: 0.65rem;
            padding: 4px 10px;
          }
          
          .promo-text {
            font-size: 0.7rem;
          }
          
          .promo-footer {
            gap: 0;
          }
          
          .promo-timer {
            padding: 5px 12px;
            gap: 3px;
            width: 100%;
          }
          
          .timer-value {
            font-size: 1rem;
          }
          
          .timer-label {
            font-size: 0.55rem;
          }
          
          .timer-separator {
            font-size: 0.9rem;
          }
          
          /* Cacher le bouton sur mobile */
          .promo-cta {
            display: none;
          }
        }
        
        /* Très petits écrans */
        @media (max-width: 480px) {
          .promo-banner {
            padding: 8px 12px;
          }
          
          .promo-header {
            margin-bottom: 10px;
          }
          
          .promo-badge {
            font-size: 0.6rem;
            padding: 3px 8px;
          }
          
          .promo-text {
            font-size: 0.65rem;
          }
          
          .timer-value {
            font-size: 0.9rem;
          }
          
          .timer-label {
            font-size: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}