'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Timer, ArrowRight, Zap } from 'lucide-react';

export default function CountdownTickerSection() {
  /* Target Date: September 5, 2026 */
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  useEffect(() => {
    const targetDate = new Date('2026-09-05T06:30:00+05:30').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({
          days: String(d).padStart(2, '0'),
          hours: String(h).padStart(2, '0'),
          minutes: String(m).padStart(2, '0'),
          seconds: String(s).padStart(2, '0'),
        });
      } else {
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      style={{
        position: 'relative',
        background: '#0b1a4a',
        backgroundImage: "url('/images/BG-test.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#ffffff',
        padding: '54px 20px 60px',
        overflow: 'hidden',
        // borderTop: '3px solid #C8FF3D',
        borderBottom: '3px solid #12318B',
      }}
    >
      {/* ─── MOVING TICKER SCROLLING STRIP AT TOP ─── */}
      {/* <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          background: '#12318B',
          borderBottom: '1px solid rgba(200, 255, 61, 0.3)',
          padding: '8px 0',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          zIndex: 5,
        }}
      >
        <div className="countdown-ticker-track" style={{ display: 'inline-flex', alignItems: 'center' }}>
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '16px',
                fontSize: '12px',
                fontWeight: 800,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#C8FF3D',
                paddingRight: '32px',
              }}
            >
              <Zap size={13} fill="#C8FF3D" /> RACE DAY COUNTDOWN · MAY 21-24, 2025
              <span style={{ color: '#ffffff', opacity: 0.6 }}>✦</span> MILES FOR SMILES 5K CHARITY RUN
              <span style={{ color: '#ffffff', opacity: 0.6 }}>✦</span> REGISTRATION LIVE NOW
            </span>
          ))}
        </div>
      </div> */}

      {/* Main Content */}
      <div style={{ maxWidth: '1100px', margin: '24px auto 0', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        
        {/* Header Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(200, 255, 61, 0.15)', border: '1px solid rgba(200, 255, 61, 0.4)', padding: '6px 16px', borderRadius: '20px', marginBottom: '16px' }}>
          <Timer size={15} color="#C8FF3D" />
          <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.12em', color: '#C8FF3D', textTransform: 'uppercase' }}>
            OFFICIAL RACE COUNTDOWN
          </span>
        </div>

        <h2
          style={{
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: '#ffffff',
            marginBottom: '32px',
            textShadow: '0 4px 20px rgba(0,0,0,0.4)',
          }}
        >
          THE CLOCK IS TICKING. ARE YOU READY?
        </h2>

        {/* ─── BIG COUNTDOWN NUMERICAL BLOCKS ─── */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 'clamp(10px, 2.5vw, 24px)',
            flexWrap: 'wrap',
            marginBottom: '36px',
          }}
        >
          {/* Days */}
          <div className="countdown-block">
            <div className="countdown-number">{timeLeft.days}</div>
            <div className="countdown-label">DAYS</div>
          </div>

          <div className="countdown-colon">:</div>

          {/* Hours */}
          <div className="countdown-block">
            <div className="countdown-number">{timeLeft.hours}</div>
            <div className="countdown-label">HOURS</div>
          </div>

          <div className="countdown-colon">:</div>

          {/* Minutes */}
          <div className="countdown-block">
            <div className="countdown-number">{timeLeft.minutes}</div>
            <div className="countdown-label">MINUTES</div>
          </div>

          <div className="countdown-colon">:</div>

          {/* Seconds */}
          <div className="countdown-block countdown-seconds">
            <div className="countdown-number" style={{ color: '#C8FF3D' }}>{timeLeft.seconds}</div>
            <div className="countdown-label">SECONDS</div>
          </div>
        </div>

        {/* CTA Button */}
        <div>
          <Link
            href="/register"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              background: '#C8FF3D',
              color: '#0b1a4a',
              padding: '16px 36px',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: 900,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              boxShadow: '0 8px 30px rgba(200, 255, 61, 0.35)',
              transition: 'all 0.2s ease',
            }}
          >
            REGISTER FOR 5K RUN <ArrowRight size={18} strokeWidth={3} />
          </Link>
        </div>

      </div>

      <style jsx>{`
        .countdown-ticker-track {
          animation: countdownTicker 22s linear infinite;
        }
        @keyframes countdownTicker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .countdown-block {
          background: rgba(11, 26, 74, 0.85);
          border: 2px solid rgba(200, 255, 61, 0.3);
          border-radius: 16px;
          padding: 16px 20px;
          min-width: clamp(72px, 18vw, 130px);
          backdrop-filter: blur(8px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
          text-align: center;
        }
        .countdown-number {
          font-family: var(--font-geist-sans), Inter, sans-serif;
          font-size: clamp(1.9rem, 6vw, 4.5rem);
          font-weight: 900;
          line-height: 1;
          color: #ffffff;
          margin-bottom: 4px;
          font-variant-numeric: tabular-nums;
        }
        .countdown-label {
          font-size: clamp(9px, 1.8vw, 12px);
          font-weight: 800;
          letter-spacing: 0.12em;
          color: rgba(255, 255, 255, 0.7);
        }
        .countdown-colon {
          font-size: clamp(1.4rem, 4vw, 3.5rem);
          font-weight: 900;
          color: #C8FF3D;
          opacity: 0.8;
        }

        @media (max-width: 600px) {
          .countdown-block {
            padding: 12px 10px !important;
            border-radius: 12px !important;
            min-width: 64px !important;
          }
          .countdown-colon {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
