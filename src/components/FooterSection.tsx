'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Mail, Phone } from 'lucide-react';

export default function FooterSection() {
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  useEffect(() => {
    // Target event date: Sep 5, 2026
    const targetDate = new Date('2026-09-05T06:30:00+05:30').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60)) / (1000 * 60));
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
    <footer className="footer-wrap">
      <div className="footer-card">
        
        {/* ─── GIANT COUNTDOWN TIMER ─── */}
        <div className="countdown-timer-display">
          <span className="timer-unit">{timeLeft.days}</span>
          <span className="timer-colon">:</span>
          <span className="timer-unit">{timeLeft.hours}</span>
          <span className="timer-colon">:</span>
          <span className="timer-unit">{timeLeft.minutes}</span>
          <span className="timer-colon">:</span>
          <span className="timer-unit">{timeLeft.seconds}</span>
        </div>

        {/* ─── DIVIDER WITH REGISTER BUTTON ─── */}
        <div className="divider-row">
          <div className="divider-line" />
          <Link
            href="/register"
            style={{
              position: 'relative',
              zIndex: 2,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backgroundColor: '#C8FF3D',
              color: '#070f26',
              padding: '12px 28px',
              borderRadius: '9999px',
              fontSize: '13px',
              fontWeight: 900,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              boxShadow: '0 6px 24px rgba(200, 255, 61, 0.45)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            className="register-cta-btn"
          >
            REGISTER <ArrowRight size={16} strokeWidth={3} />
          </Link>
        </div>

        {/* ─── BOTTOM NAV & CONTACT ROW ─── */}
        <div className="footer-bottom-row">
          
          {/* Left: Brand Mark + Nav Links */}
          <div className="footer-left">
            <Link href="/" className="footer-brand-logo">
              <Image
                src="/images/logo.png"
                alt="Miles for Smiles Logo"
                width={120}
                height={38}
                style={{ height: '32px', width: 'auto', objectFit: 'contain' }}
              />
            </Link>

            <nav className="footer-nav">
              <a href="#about" className="nav-link">About</a>
              <span className="nav-sep">/</span>
              <a href="#schedule" className="nav-link">Schedule</a>
              <span className="nav-sep">/</span>
              <a href="#categories" className="nav-link">Categories</a>
              <span className="nav-sep">/</span>
              <a href="#route" className="nav-link">Route</a>
              <span className="nav-sep">/</span>
              <a href="#sponsors" className="nav-link">Partners</a>
              <span className="nav-sep">/</span>
              <a href="#faq" className="nav-link">FAQ</a>
            </nav>
          </div>

          {/* Right: Contact Details */}
          <div className="footer-right">
            <a
              href="mailto:setunst@gmail.com,rameezrahman17@gmail.com"
              className="footer-mail-link"
            >
              <Mail size={15} />
              <span>setunst@gmail.com</span>
            </a>

            <span className="footer-contact-sep">/</span>

            <div className="phone-links-wrap">
              <a href="tel:+919172901968" className="phone-link">
                <Phone size={15} />
                <span>+91 91729 01968</span>
              </a>
              <span style={{ opacity: 0.35 }}>|</span>
              <a href="tel:+919301804524" className="phone-link">
                <span>+91 93018 04524</span>
              </a>
            </div>
          </div>

        </div>

      </div>

      <style jsx>{`
        .footer-wrap {
          position: relative;
          background: #ffffff;
          padding: 24px 20px 48px;
          width: 100%;
          overflow: hidden;
        }

        .footer-card {
          width: 100%;
          max-width: 100%;
          background: #12318B;
          background: linear-gradient(135deg, #0f2b80 0%, #163cb5 50%, #102d87 100%);
          border-radius: 28px;
          padding: clamp(55px, 7vw, 95px) clamp(24px, 5vw, 60px) clamp(30px, 4vw, 42px);
          color: #ffffff;
          box-shadow: 0 20px 50px rgba(18, 49, 139, 0.22);
          position: relative;
        }

        /* Countdown display matching countdown section font */
        .countdown-timer-display {
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-geist-sans), 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: clamp(3.2rem, 9.2vw, 8.2rem);
          font-weight: 800;
          letter-spacing: 0.02em;
          line-height: 1;
          color: #ffffff;
          user-select: none;
          text-align: center;
          font-variant-numeric: tabular-nums;
        }

        .timer-unit {
          min-width: 1.15em;
          text-align: center;
          font-weight: 800;
        }

        .timer-colon {
          margin: 0 0.15em;
          opacity: 0.9;
          font-weight: 800;
          position: relative;
          top: -0.05em;
        }

        /* Divider line with centered CTA button */
        .divider-row {
          position: relative;
          width: 100%;
          margin: clamp(40px, 5.5vw, 65px) 0 clamp(32px, 4.5vw, 48px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .divider-line {
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          height: 1px;
          background: rgba(255, 255, 255, 0.25);
          z-index: 1;
        }

        .register-cta-btn:hover {
          transform: scale(1.06) translateY(-2px) !important;
          background-color: #d8ff66 !important;
          box-shadow: 0 10px 30px rgba(200, 255, 61, 0.6) !important;
        }

        /* Bottom Row */
        .footer-bottom-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
        }

        .footer-left {
          display: flex;
          align-items: center;
          gap: clamp(16px, 3vw, 36px);
          flex-wrap: wrap;
        }

        .footer-brand-logo {
          display: flex;
          align-items: center;
        }

        .footer-nav {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .nav-link {
          color: rgba(255, 255, 255, 0.85);
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .nav-link:hover {
          color: #C8FF3D;
        }

        .nav-sep {
          color: rgba(255, 255, 255, 0.35);
          font-size: 13px;
          font-weight: 300;
        }

        .footer-right {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .footer-mail-link {
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(255, 255, 255, 0.85);
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .footer-mail-link:hover {
          color: #C8FF3D;
        }

        .footer-contact-sep {
          color: rgba(255, 255, 255, 0.35);
          font-size: 13px;
          font-weight: 300;
        }

        .phone-links-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .phone-link {
          display: flex;
          align-items: center;
          gap: 6px;
          color: rgba(255, 255, 255, 0.85);
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .phone-link:hover {
          color: #C8FF3D;
        }

        @media (max-width: 860px) {
          .footer-bottom-row {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 22px;
          }
          .footer-left {
            flex-direction: column;
            justify-content: center;
            gap: 16px;
          }
          .footer-nav {
            justify-content: center;
          }
          .footer-right {
            justify-content: center;
          }
        }
      `}</style>
    </footer>
  );
}
