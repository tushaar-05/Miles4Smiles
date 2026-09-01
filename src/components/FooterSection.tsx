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

        {/* ─── INSTITUTION & ORGANIZER CO-BRANDING SECTION ─── */}
        <div className="footer-organizers-strip">
          <div className="org-tag">PRESENTED & ORGANIZED BY</div>
          <div className="org-logos-container">
            <div className="inst-group">
              <div className="org-logo-card">
                <Image
                  src="/images/nstlogo.png"
                  alt="Newton School of Technology"
                  width={130}
                  height={38}
                  style={{ height: '30px', width: 'auto', objectFit: 'contain' }}
                />
              </div>
              <span className="org-cross">×</span>
              <div className="org-logo-card">
                <Image
                  src="/images/adypu logo.png"
                  alt="Ajeenkya DY Patil University"
                  width={130}
                  height={38}
                  style={{ height: '30px', width: 'auto', objectFit: 'contain' }}
                />
              </div>
            </div>

            <div className="org-divider-pipe" />

            <div className="club-group">
              <span className="club-organized-label">ORGANIZED BY</span>
              <div className="org-logo-card setu-card">
                <Image
                  src="/images/SETU Logo.png"
                  alt="SETU Club Logo"
                  width={38}
                  height={38}
                  style={{ height: '32px', width: 'auto', objectFit: 'contain' }}
                />
                <span className="setu-club-title">CLUB SETU</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── CREDITS & COPYRIGHT FOOTER BAR ─── */}
        <div className="footer-credits-bar">
          <p className="copyright-text">
            &copy; 2026 Miles for Smiles 5K Run. All rights reserved.
          </p>
          <div className="author-credit">
            <span>Made with <span className="heart-pulse">&#10084;&#65039;</span> by</span>{' '}
            <a
              href="https://tusharworks.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="author-link"
            >
              Tushar Singh
            </a>
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

        /* Bottom Row */
        .footer-bottom-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 24px;
        }

        .footer-left {
          display: flex;
          align-items: center;
          gap: clamp(16px, 2.5vw, 32px);
          flex-wrap: wrap;
        }

        .footer-brand-logo {
          display: flex;
          align-items: center;
          line-height: 0;
          transition: transform 0.2s ease;
        }

        .footer-brand-logo:hover {
          transform: scale(1.04);
        }

        .footer-nav {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .nav-link {
          color: rgba(255, 255, 255, 0.75);
          text-decoration: none;
          font-size: 13.5px;
          font-weight: 600;
          letter-spacing: 0.02em;
          transition: color 0.15s ease;
        }

        .nav-link:hover {
          color: #C8FF3D;
        }

        .nav-sep {
          color: rgba(255, 255, 255, 0.3);
          font-size: 13px;
        }

        .footer-right {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .footer-mail-link,
        .phone-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: rgba(255, 255, 255, 0.9);
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
          transition: color 0.15s ease;
        }

        .footer-mail-link:hover,
        .phone-link:hover {
          color: #C8FF3D;
        }

        .footer-contact-sep {
          color: rgba(255, 255, 255, 0.3);
          font-size: 14px;
        }

        .phone-links-wrap {
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }

        /* Organizers Strip */
        .footer-organizers-strip {
          margin-top: 45px;
          padding-top: 32px;
          border-top: 1px solid rgba(255, 255, 255, 0.16);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 14px;
        }

        .org-tag {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.18em;
          color: #C8FF3D;
          text-transform: uppercase;
        }

        .org-logos-container {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 16px 22px;
        }

        .inst-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .org-logo-card {
          background: #ffffff;
          padding: 8px 16px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }

        .org-cross {
          color: rgba(255, 255, 255, 0.65);
          font-size: 18px;
          font-weight: 800;
        }

        .org-divider-pipe {
          width: 1px;
          height: 32px;
          background: rgba(255, 255, 255, 0.25);
        }

        .club-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .club-organized-label {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.14em;
          color: rgba(255, 255, 255, 0.7);
          text-transform: uppercase;
        }

        .org-logo-card.setu-card {
          gap: 10px;
          background: #ffffff;
        }

        .setu-club-title {
          font-size: 14px;
          font-weight: 900;
          color: #0b1a4a;
          letter-spacing: 0.05em;
        }

        /* Credits bar */
        .footer-credits-bar {
          margin-top: 32px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.75);
        }

        .copyright-text {
          margin: 0;
        }

        .author-credit {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-weight: 500;
        }

        .heart-pulse {
          display: inline-block;
          color: #ff3b30;
          animation: pulseHeart 1.6s ease-in-out infinite;
        }

        @keyframes pulseHeart {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.25); }
        }

        .author-link {
          color: #C8FF3D;
          font-weight: 800;
          text-decoration: none;
          padding: 3px 10px;
          background: rgba(200, 255, 61, 0.12);
          border: 1px solid rgba(200, 255, 61, 0.35);
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .author-link:hover {
          background: #C8FF3D;
          color: #070f26;
          box-shadow: 0 0 16px rgba(200, 255, 61, 0.6);
          transform: translateY(-2px);
        }

        @media (max-width: 860px) {
          .footer-bottom-row {
            flex-direction: column;
            align-items: flex-start;
          }
          .org-divider-pipe {
            display: none;
          }
          .footer-credits-bar {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}
