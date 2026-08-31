'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Menu, X } from 'lucide-react';
import { useState } from 'react';

/* ─── Ticker content ─── */
const TICKER_ITEMS = [
  'MAY 21 - 24',
  'RUN BEYOND LIMITS',
  'FULL MARATHON',
  'HALF MARATHON',
  'CHARITY RUN',
  'REGISTER NOW',
];

/* ─── Nav links ─── */
const NAV_LINKS = [
  { label: 'About',      href: '#about' },
  { label: 'Categories', href: '#categories' },
  { label: 'Schedule',   href: '#schedule' },
  { label: 'News',       href: '#news' },
];

export default function HeroSection() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const tickerItems = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS]; // seamless loop

  return (
    /*
     * Off-white outer wrapper creates the margin around hero — matching reference.
     */
    <div style={{ background: 'var(--blue, #12318B)', width: '100%', overflow: 'visible', position: 'relative', zIndex: 10 }}>

      {/* ══════════════════════════════════════════════════════════
          HERO SECTION
          Royal blue · fills viewport height edge-to-edge
          ══════════════════════════════════════════════════════════
      */}
      <section
        id="hero"
        style={{
          position: 'relative',
          backgroundColor: 'var(--blue, #12318B)',
          overflow: 'visible',
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* ══ BACKGROUND IMAGE OVERLAY WITH REDUCED OPACITY ══ */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: "url('/images/BG.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.65,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* ────────────────────────────────────────────────────
            HEADER  z-50
        ──────────────────────────────────────────────────── */}
        <header style={{ position: 'relative', zIndex: 50, flexShrink: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 36px 16px',
              gap: '12px',
            }}
          >
            {/* Logo */}
            <Link
              href="/"
              aria-label="Miles for Smiles"
              style={{ flexShrink: 0, lineHeight: 0, display: 'flex', alignItems: 'center' }}
            >
              <Image
                src="/images/logo.png"
                alt="Miles for Smiles Logo"
                width={160}
                height={44}
                style={{
                  height: 'auto',
                  maxHeight: '40px',
                  width: 'auto',
                  maxWidth: '180px',
                  objectFit: 'contain',
                }}
                priority
              />
            </Link>

            {/* Desktop nav */}
            <nav
              className="h-desktop-nav"
              style={{ display: 'flex', alignItems: 'center', gap: '18px', flex: 1, marginLeft: '36px' }}
            >
              {NAV_LINKS.map((link, i) => (
                <span key={link.href} style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                  <Link
                    href={link.href}
                    style={{
                      color: 'rgba(255,255,255,0.85)',
                      textDecoration: 'none',
                      fontSize: '15px',
                      fontWeight: 400,
                      letterSpacing: '0.02em',
                      transition: 'color 0.15s',
                    }}
                  >
                    {link.label}
                  </Link>
                  {i < NAV_LINKS.length - 1 && (
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '15px', userSelect: 'none' }}>
                      /
                    </span>
                  )}
                </span>
              ))}
            </nav>

            {/* Register button */}
            <Link
              href="/register"
              id="hero-register-btn"
              className="h-register-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'stretch',
                borderRadius: '7px',
                overflow: 'hidden',
                textDecoration: 'none',
                border: '1.5px solid rgba(255,255,255,0.25)',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#C8FF3D',
                  padding: '8px 11px',
                }}
              >
                <Calendar size={15} strokeWidth={2} color="#0b1a4a" />
              </span>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.13em',
                  color: '#111',
                  textTransform: 'uppercase',
                  background: '#ffffff',
                }}
              >
                REGISTER
              </span>
            </Link>

            {/* Mobile toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="h-mobile-toggle"
              style={{
                background: 'none', border: 'none', color: '#fff',
                cursor: 'pointer', padding: '4px', display: 'none',
              }}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Hairline divider */}
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.14)', margin: '0 36px' }} />

          {/* Mobile dropdown */}
          {mobileOpen && (
            <div
              style={{
                background: 'rgba(0,0,0,0.28)',
                padding: '14px 24px 18px',
                display: 'flex', flexDirection: 'column', gap: '14px',
              }}
            >
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontWeight: 500 }}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: '#C8FF3D', color: '#111', padding: '9px 16px',
                  borderRadius: '7px', fontWeight: 700, fontSize: '12px',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  textDecoration: 'none', width: 'fit-content',
                }}
              >
                <Calendar size={13} /> Register
              </Link>
            </div>
          )}
        </header>

        {/* ────────────────────────────────────────────────────
            HERO BODY — Canvas for typography, date badge, card & runner
        ──────────────────────────────────────────────────── */}
        <div
          style={{
            position: 'relative',
            flex: 1,
            overflow: 'visible',
            minHeight: '480px',
          }}
        >

          {/* ══ 3D DATE BADGE  z-20, upper-left ══ */}
          <div
            className="fade-in-right"
            style={{
              position: 'absolute',
              top: '32px',
              left: '52px',
              zIndex: 20,
            }}
          >
            <div style={{ position: 'relative', display: 'inline-block' }}>
              {/* 3D Left Extrusion (Medium Olive Shadow) */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '-20px',
                  width: '20px',
                  height: 'calc(100% + 16px)',
                  background: '#819E1E',
                  clipPath: 'polygon(0 16px, 100% 0, 100% calc(100% - 16px), 0 100%)',
                }}
              />

              {/* 3D Bottom Underside Face (Dark Olive Shadow) */}
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  width: '100%',
                  height: '16px',
                  background: '#688217',
                  clipPath: 'polygon(0 0, -20px 100%, calc(92% - 20px) 100%, 92% 0)',
                }}
              />

              {/* Front Face (Vivid Neon Lime) */}
              <div
                style={{
                  position: 'relative',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '14px',
                  background: '#C8FF3D',
                  color: '#1a1d24',
                  clipPath: 'polygon(0 0, 100% 0, 100% 68%, 92% 100%, 0 100%)',
                  padding: '13px 32px 13px 18px',
                }}
              >
                {/* 4-point Golden Star */}
                <span
                  style={{
                    color: '#FFBD12',
                    fontSize: '20px',
                    lineHeight: 1,
                    flexShrink: 0,
                    display: 'inline-block',
                    transform: 'translateY(-1px)',
                  }}
                >
                  ✦
                </span>

                {/* Date Text */}
                <span
                  style={{
                    fontSize: 'clamp(14px, 1.4vw, 18px)',
                    fontWeight: 500,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    lineHeight: 1,
                    whiteSpace: 'nowrap',
                    color: '#1a1d24',
                    fontFamily: 'var(--font-geist-sans), Inter, system-ui, sans-serif',
                  }}
                >
                  MAY, 21 - 24 2025
                </span>
              </div>
            </div>
          </div>

          {/* ══ CITY / EDITORIAL CARD  z-20, upper-right ══ */}
          <div
            className="fade-in-up fade-in-up-4 h-editorial-card"
            style={{
              position: 'absolute',
              top: '16px',
              right: '36px',
              zIndex: 20,
              width: '270px',
            }}
          >
            <div style={{ position: 'relative' }}>
              {/* Stacked shadow cards */}
              <div style={{
                position: 'absolute', top: '-9px', right: '-9px',
                width: '100%', height: '100%', borderRadius: '14px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.09)',
              }} />
              <div style={{
                position: 'absolute', top: '-4px', right: '-4px',
                width: '100%', height: '100%', borderRadius: '14px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.14)',
              }} />
              {/* Main card */}
              <div style={{
                position: 'relative',
                background: '#eeecea',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 6px 36px rgba(0,0,0,0.28)',
              }}>
                <div style={{ width: '100%', height: '150px', position: 'relative', overflow: 'hidden' }}>
                  <Image
                    src="/images/city-skyline.jpg"
                    alt="City skyline race venue"
                    fill
                    sizes="270px"
                    style={{ objectFit: 'cover', objectPosition: 'center top' }}
                  />
                </div>
                <div style={{ padding: '12px 14px 16px' }}>
                  <p style={{ color: '#1c1c2e', fontSize: '12px', lineHeight: '1.6', fontWeight: 400 }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ullamcorper
                    nec quam eget pulvinar. Nulla eget rutrum nisl.
                  </p>
                  <Link
                    href="#news"
                    id="editorial-card-read-more"
                    style={{
                      display: 'inline-block',
                      marginTop: '9px',
                      color: '#1c1c2e',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      textDecoration: 'underline',
                      textDecorationThickness: '1.5px',
                      textUnderlineOffset: '3px',
                    }}
                  >
                    READ MORE
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════
              GIANT TYPOGRAPHY — "RUN BEYOND LIMITS"  z-10  (BEHIND runner)
              ══════════════════════════════════════════════════════
              Ultra-thin, elegant geometric white text matching
              the reference design (MAYLAND MARATHON) in scale,
              weight (100), font size, two-line layout and positioning.
          */}
          {/* ══ HIDDEN SVG FILTER FOR ROUGH ATHLETIC TEXT TEXTURE ══ */}
          <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }} aria-hidden="true">
            <defs>
              <filter id="rough-text-texture" x="-10%" y="-10%" width="120%" height="120%">
                <feTurbulence type="fractalNoise" baseFrequency="0.038" numOctaves="3" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </defs>
          </svg>

          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              paddingBottom: '24px',
              pointerEvents: 'none',
              filter: 'url(#rough-text-texture) drop-shadow(0 4px 24px rgba(0, 0, 0, 0.4))',
            }}
          >
            {/* Line 0: MILES FOR SMILES */}
            <div
              className="fade-in-up"
              style={{ paddingLeft: '28px', marginBottom: '8px' }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: 'var(--font-geist-sans), Inter, system-ui, sans-serif',
                  fontWeight: 800,
                  fontSize: 'clamp(1rem, 2.2vw, 1.8rem)',
                  color: '#C8FF3D',
                  textTransform: 'uppercase',
                  letterSpacing: '0.18em',
                  lineHeight: 1,
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ color: '#C8FF3D', fontSize: '0.85em' }}>✦</span>
                MILES FOR SMILES
              </span>
            </div>

            {/* Line 1: CHARITY */}
            <div
              className="fade-in-up fade-in-up-2"
              style={{ paddingLeft: '28px', marginBottom: '-0.04em' }}
            >
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-geist-sans), Inter, system-ui, sans-serif',
                  fontWeight: 900,
                  fontSize: 'clamp(4rem, 8vw, 11.5rem)',
                  color: '#FFFFFF',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.01em',
                  lineHeight: 0.88,
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                  WebkitFontSmoothing: 'antialiased',
                }}
              >
                CHARITY
              </span>
            </div>

            {/* Line 2: 5K RUN */}
            <div
              className="fade-in-up fade-in-up-3"
              style={{ paddingLeft: '20px' }}
            >
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-geist-sans), Inter, system-ui, sans-serif',
                  fontWeight: 900,
                  fontSize: 'clamp(5rem, 14vw, 15rem)',
                  color: '#FFFFFF',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.01em',
                  lineHeight: 0.88,
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                  WebkitFontSmoothing: 'antialiased',
                }}
              >
                <span style={{ color: '#C8FF3D' }}>5K</span> RUN
              </span>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════
              RUNNER CUTOUT — z-30  (IN FRONT of text)
              ══════════════════════════════════════════════════════
              Enlarged significantly (height: 148%), cropped naturally
              around the knee/thigh area to match hero-reference.png framing.
              Head sits right below header, right-center over the headline.
          */}
          <div
            className="runner-container fade-in-up fade-in-up-1"
            style={{
              position: 'absolute',
              top: '0px',
              bottom: '-110px',
              left: '38%',
              width: '48%',
              zIndex: 30,
              pointerEvents: 'none',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              overflow: 'hidden',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/runner-cutout.png"
              alt="Runner - Charity 5K Run"
              style={{
                height: '188%',
                width: 'auto',
                maxWidth: 'none',
                objectFit: 'cover',
                objectPosition: 'top center',
              }}
            />
          </div>

        </div>
        {/* end hero body */}

        {/* ────────────────────────────────────────────────────
            NEON LIME TICKER  z-40  (IN FRONT at bottom)
            90px tall · neon lime · scrolling marquee
        ──────────────────────────────────────────────────── */}
        <div
          style={{
            position: 'relative',
            zIndex: 40,
            background: '#C8FF3D',
            height: '92px',
            width: '114%',
            left: '-7%',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            flexShrink: 0,
            transform: 'rotate(-2deg)',
            transformOrigin: 'right center',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
            margin: '20px 0 16px 0',
          }}
        >
          <div
            className="ticker-track"
            style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', willChange: 'transform' }}
          >
            {tickerItems.map((item, i) => (
              <span
                key={i}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '20px',
                  padding: '0 20px',
                  fontSize: 'clamp(1.25rem, 2.6vw, 2.1rem)',
                  fontWeight: 700,
                  letterSpacing: '0.055em',
                  textTransform: 'uppercase',
                  color: '#0b1a4a',
                }}
              >
                <span style={{ color: 'var(--blue, #12318B)', fontSize: '0.6em', lineHeight: 1 }}>✦</span>
                {item}
              </span>
            ))}
          </div>
        </div>

      </section>

      {/* ──────────────────────────────────────────────────
          RESPONSIVE OVERRIDES
      ────────────────────────────────────────────────── */}
      <style>{`
        /* Default: desktop ≥ 768px */
        .h-desktop-nav   { display: flex !important; }
        .h-register-btn  { display: inline-flex !important; }
        .h-mobile-toggle { display: none !important; }
        .h-editorial-card { display: block !important; }

        /* Tablet 900–1099px */
        @media (max-width: 1099px) {
          .h-editorial-card { width: 230px !important; }
          .runner-container { left: 32% !important; width: 54% !important; }
        }

        /* Small tablet 768–899px */
        @media (max-width: 899px) {
          .h-editorial-card { display: none !important; }
          .runner-container { left: 26% !important; width: 60% !important; }
        }

        /* Mobile < 768px */
        @media (max-width: 767px) {
          .h-desktop-nav   { display: none !important; }
          .h-register-btn  { display: none !important; }
          .h-mobile-toggle { display: flex !important; }
          .runner-container {
            left: 50% !important;
            transform: translateX(-50%);
            width: 85% !important;
          }
        }
      `}</style>
    </div>
  );
}
