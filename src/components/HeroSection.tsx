'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Menu, X, ChevronRight, ArrowRight } from 'lucide-react';

/* ─── Ticker content ─── */
const TICKER_ITEMS = [
  '5K RUN',
  'CHARITY RUN',
  'REGISTER NOW',
  'SEP - 5TH',
];

/* ─── Nav links ─── */
const NAV_LINKS = [
  { label: 'About',      href: '#about' },
  { label: 'Schedule',   href: '#schedule' },
  { label: 'Categories', href: '#categories' },
  { label: 'Route',      href: '#route' },
  { label: 'Partners',   href: '#sponsors' },
  { label: 'FAQ',        href: '#faq' },
];

const MOBILE_DRAWER_LINKS = [
  { label: 'ABOUT THE RUN',       href: '#about' },
  { label: 'EVENT SCHEDULE',      href: '#schedule' },
  { label: 'RACE CATEGORIES',     href: '#categories' },
  { label: 'RUNNING TRACKS',      href: '#route' },
  { label: 'PARTNERS & SPONSORS', href: '#sponsors' },
  { label: 'FAQ',                 href: '#faq' },
];

export default function HeroSection() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const tickerRef = useRef<HTMLDivElement>(null);
  const tickerItems = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS]; // seamless loop

  /* ─── Butter-Smooth RAF Momentum Marquee Loop ─── */
  useEffect(() => {
    let x = 0;
    const baseSpeed = 0.85; // smooth gentle cruising speed (px/frame)
    let extraSpeed = 0;
    let lastScrollY = window.scrollY;
    let rafId: number;

    const onWindowScroll = () => {
      const currentScrollY = window.scrollY;
      const deltaY = Math.abs(currentScrollY - lastScrollY);
      lastScrollY = currentScrollY;

      // Very subtle, gentle boost on scroll
      extraSpeed = Math.min(extraSpeed + deltaY * 0.012, 1.2);
    };

    window.addEventListener('scroll', onWindowScroll, { passive: true });

    // Also connect to Lenis velocity if present
    const lenis = (window as unknown as { lenis?: { on: (event: string, cb: (e: { velocity: number }) => void) => void } }).lenis;
    if (lenis && lenis.on) {
      lenis.on('scroll', ({ velocity }: { velocity: number }) => {
        extraSpeed = Math.min(extraSpeed + Math.abs(velocity) * 0.015, 1.2);
      });
    }

    const loop = () => {
      // Smooth physical decay
      extraSpeed *= 0.90;
      if (extraSpeed < 0.005) extraSpeed = 0;

      const currentVelocity = baseSpeed + extraSpeed;
      x -= currentVelocity;

      if (tickerRef.current) {
        const halfWidth = tickerRef.current.scrollWidth / 2;
        if (halfWidth > 0 && Math.abs(x) >= halfWidth) {
          x += halfWidth;
        }
        tickerRef.current.style.transform = `translate3d(${x}px, 0, 0)`;
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('scroll', onWindowScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      const targetId = href.replace('#', '');
      const elem = document.getElementById(targetId);
      if (elem) {
        e.preventDefault();
        const lenis = (window as unknown as { lenis?: { scrollTo: (target: HTMLElement, options?: { offset?: number; duration?: number }) => void } }).lenis;
        if (lenis) {
          lenis.scrollTo(elem, { offset: -60, duration: 1.2 });
        } else {
          elem.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <>
      {/* ══════════════════════════════════════════════════════
          ROOT-LEVEL MOBILE SIDE DRAWER (SLIDES IN FROM LEFT)
          Placed at root to avoid any parent overflow or stacking clipping
          ══════════════════════════════════════════════════════ */}
      <div
        className={`mobile-drawer-backdrop ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden={!mobileOpen}
      />

      <div
        className={`mobile-side-drawer ${mobileOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
      >
        {/* Drawer Top Header with Logo & Close 'X' Button */}
        <div className="drawer-header">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            aria-label="Miles for Smiles"
            style={{ display: 'flex', alignItems: 'center', lineHeight: 0 }}
          >
            <Image
              src="/images/logo.png"
              alt="Miles for Smiles Logo"
              width={140}
              height={38}
              style={{
                height: 'auto',
                maxHeight: '34px',
                width: 'auto',
                maxWidth: '150px',
                objectFit: 'contain',
              }}
              priority
            />
          </Link>
          <button
            className="drawer-close-btn"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={26} strokeWidth={2.5} />
          </button>
        </div>

        {/* Navigation List — Clean Stack with Hairline Dividers */}
        <nav className="drawer-nav">
          {MOBILE_DRAWER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(e) => {
                handleNavClick(e, link.href);
                setMobileOpen(false);
              }}
              className="drawer-link"
            >
              <span>{link.label}</span>
              <ChevronRight size={18} opacity={0.6} />
            </Link>
          ))}
        </nav>

        {/* Dedicated Separate Register Now Button */}
        <div className="drawer-cta-wrap">
          <Link
            href="/register"
            onClick={() => setMobileOpen(false)}
            className="drawer-register-btn"
          >
            <span>REGISTER NOW</span>
            <ArrowRight size={18} strokeWidth={3} />
          </Link>
        </div>

        {/* Drawer Bottom Details */}
        <div className="drawer-footer">
          <div className="drawer-event-pill">
            <span style={{ color: '#C8FF3D' }}>✦</span> SEP 05, 2026 • 6:30 AM
          </div>
          <div className="drawer-contact-line">
            <a href="mailto:setunst@gmail.com">setunst@gmail.com</a>
          </div>
          <div className="drawer-contact-line" style={{ marginTop: '4px' }}>
            <a href="tel:9172901968">+91 91729 01968</a>
          </div>
        </div>
      </div>

      <div className="hero-outer-wrapper" style={{ background: 'var(--blue, #12318B)', width: '100%', overflow: 'hidden', position: 'relative', zIndex: 10 }}>

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
          overflow: 'hidden',
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
            opacity: 0.1,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* ────────────────────────────────────────────────────
            HEADER  z-50
        ──────────────────────────────────────────────────── */}
        <header style={{ position: 'relative', zIndex: 50, flexShrink: 0 }}>
          <div
            className="hero-header-wrap"
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
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
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
                  </a>
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
        </header>

        {/* ────────────────────────────────────────────────────
            HERO BODY — Canvas for typography, date badge, card & runner
        ──────────────────────────────────────────────────── */}
        <div
          className="hero-body-canvas"
          style={{
            position: 'relative',
            flex: 1,
            overflow: 'visible',
            minHeight: '480px',
          }}
        >

          {/* ══ 3D DATE BADGE  z-20, upper-left ══ */}
          <div
            className="fade-in-right hero-date-badge-wrap"
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
                  SEPTEMBER 05, 2026
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
            className="hero-typo-wrap"
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
              className="fade-in-up hero-typo-line0"
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
              className="fade-in-up fade-in-up-2 hero-typo-line1"
              style={{ paddingLeft: '28px', marginBottom: '-0.04em' }}
            >
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-geist-sans), Inter, system-ui, sans-serif',
                  fontWeight: 900,
                  fontSize: 'clamp(3.4rem, 8vw, 11.5rem)',
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
              className="fade-in-up fade-in-up-3 hero-typo-line2"
              style={{ paddingLeft: '20px' }}
            >
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-geist-sans), Inter, system-ui, sans-serif',
                  fontWeight: 900,
                  fontSize: 'clamp(4.2rem, 14vw, 15rem)',
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
              ATHLETIC RUNNER CUTOUT — z-30  (IN FRONT OF headline)
              ══════════════════════════════════════════════════════
          */}
          <div
            className="runner-container fade-in-up fade-in-up-1"
            style={{
              position: 'absolute',
              top: '0px',
              bottom: '0px',
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
            Full athletic marquee banner - zero cutoffs on desktop & mobile
        ──────────────────────────────────────────────────── */}
        <div
          className="hero-ticker-outer"
          style={{
            position: 'relative',
            zIndex: 40,
            width: '100%',
            overflow: 'hidden',
            padding: '14px 0 18px',
            marginTop: '-10px',
          }}
        >
          <div
            className="hero-ticker-shell"
            style={{
              position: 'relative',
              background: '#C8FF3D',
              width: '112%',
              marginLeft: '-6%',
              padding: '16px 0',
              display: 'flex',
              alignItems: 'center',
              overflow: 'hidden',
              transform: 'rotate(-1.2deg)',
              transformOrigin: 'center center',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
            }}
          >
            <div
              ref={tickerRef}
              style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', willChange: 'transform' }}
            >
              {tickerItems.map((item, i) => (
                <span
                  key={i}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '22px',
                    padding: '0 22px',
                    fontSize: 'clamp(1.15rem, 2vw, 1.8rem)',
                    fontWeight: 800,
                    letterSpacing: '0.055em',
                    textTransform: 'uppercase',
                    color: '#0b1a4a',
                    lineHeight: 1,
                  }}
                >
                  <span style={{ color: 'var(--blue, #12318B)', fontSize: '0.7em', lineHeight: 1 }}>✦</span>
                  {item}
                </span>
              ))}
            </div>
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
          #hero {
            min-height: auto !important;
            height: auto !important;
          }

          .hero-body-canvas {
            min-height: 485px !important;
            height: 505px !important;
          }

          .hero-outer-wrapper {
            overflow: hidden !important;
            width: 100% !important;
            max-width: 100vw !important;
          }

          .h-desktop-nav   { display: none !important; }
          .h-register-btn  { display: none !important; }
          .h-mobile-toggle { display: flex !important; }
          .h-editorial-card { display: none !important; }

          .hero-header-wrap {
            padding: 12px 16px 6px !important;
          }

          .hero-date-badge-wrap {
            top: 10px !important;
            left: 14px !important;
            z-index: 45 !important;
          }

          /* Force text ON TOP of runner image and make it BOLD & PROMINENT */
          .hero-typo-wrap {
            z-index: 35 !important;
            padding-bottom: 22px !important;
          }

          .hero-typo-line0 span {
            font-size: clamp(1rem, 3.8vw, 1.4rem) !important;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.85) !important;
            letter-spacing: 0.16em !important;
          }

          .hero-typo-line1 span {
            font-size: clamp(4.4rem, 16.5vw, 6.6rem) !important;
            line-height: 0.84 !important;
            text-shadow: 0 4px 18px rgba(0, 0, 0, 0.9), 0 2px 6px rgba(0, 0, 0, 0.95) !important;
          }

          .hero-typo-line2 span {
            font-size: clamp(5.6rem, 21.5vw, 9.4rem) !important;
            line-height: 0.82 !important;
            text-shadow: 0 4px 24px rgba(0, 0, 0, 0.95), 0 2px 8px rgba(0, 0, 0, 0.98) !important;
          }

          .hero-typo-line0,
          .hero-typo-line1 {
            padding-left: 14px !important;
          }
          .hero-typo-line2 {
            padding-left: 10px !important;
          }

          /* Runner properly scaled & tucked into marquee */
          .runner-container {
            left: 54% !important;
            transform: translateX(-50%) !important;
            width: 82% !important;
            max-width: 340px !important;
            top: 12px !important;
            bottom: -30px !important;
            z-index: 20 !important;
            opacity: 0.96 !important;
          }

          .runner-container img {
            height: 136% !important;
            width: auto !important;
            object-fit: contain !important;
            object-position: bottom center !important;
          }

          /* Marquee outer and inner on mobile */
          .hero-ticker-outer {
            padding: 10px 0 14px !important;
            margin-top: -18px !important;
          }
          .hero-ticker-shell {
            width: 114% !important;
            margin-left: -7% !important;
            padding: 12px 0 !important;
            transform: rotate(-1.2deg) !important;
          }
          .hero-ticker-shell span {
            font-size: 1.1rem !important;
            padding: 0 14px !important;
            gap: 14px !important;
          }
        }

        /* ══════════════════════════════════════════════════════
            MOBILE SIDE DRAWER (SLIDES IN FROM LEFT)
           ══════════════════════════════════════════════════════ */
        .mobile-drawer-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(7, 15, 38, 0.7);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 998;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .mobile-drawer-backdrop.open {
          opacity: 1;
          pointer-events: auto;
        }

        .mobile-side-drawer {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: min(85vw, 340px);
          height: 100vh;
          height: 100dvh;
          background: #f7f6f0;
          color: #0b1a4a;
          z-index: 999;
          transform: translateX(-100%);
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          box-shadow: 12px 0 40px rgba(0, 0, 0, 0.4);
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
        .mobile-side-drawer.open {
          transform: translateX(0);
        }

        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 20px;
          border-bottom: 1.5px solid rgba(200, 255, 61, 0.25);
          background: #0b1a4a;
          flex-shrink: 0;
        }
        .drawer-close-btn {
          background: none;
          border: none;
          color: #C8FF3D;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease;
        }
        .drawer-close-btn:hover {
          transform: scale(1.1);
        }

        .drawer-nav {
          display: flex;
          flex-direction: column;
          background: #f7f6f0;
          flex-shrink: 0;
        }
        .drawer-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 17px 22px;
          font-family: var(--font-geist-sans), 'Inter', sans-serif;
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #0b1a4a;
          text-decoration: none;
          border-bottom: 1px solid rgba(11, 26, 74, 0.1);
          transition: background 0.15s ease, padding-left 0.15s ease, color 0.15s ease;
        }
        .drawer-link:hover, .drawer-link:active {
          background: rgba(18, 49, 139, 0.06);
          padding-left: 26px;
          color: #12318b;
        }

        .drawer-cta-wrap {
          padding: 20px 20px 14px;
          background: #f7f6f0;
          flex-shrink: 0;
        }
        .drawer-register-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: #C8FF3D;
          color: #0b1a4a;
          padding: 15px 20px;
          border-radius: 12px;
          font-family: var(--font-geist-sans), 'Inter', sans-serif;
          font-size: 14.5px;
          font-weight: 900;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          text-decoration: none;
          box-shadow: 0 6px 20px rgba(200, 255, 61, 0.4);
          transition: all 0.15s ease;
          width: 100%;
        }
        .drawer-register-btn:active {
          transform: scale(0.98);
          background: #d4ff59;
        }

        .drawer-footer {
          padding: 20px 22px 28px;
          border-top: 1px solid rgba(11, 26, 74, 0.1);
          background: #eeecea;
          margin-top: auto;
          flex-shrink: 0;
        }
        .drawer-event-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #0b1a4a;
          color: #ffffff;
          padding: 7px 14px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .drawer-contact-line {
          font-size: 12.5px;
          color: #5c6785;
        }
        .drawer-contact-line a {
          color: #0b1a4a;
          text-decoration: none;
          font-weight: 700;
        }

        /* Very Small Mobile < 420px */
        @media (max-width: 420px) {
          .hero-body-canvas {
            min-height: 460px !important;
            height: 480px !important;
          }
          .hero-header-wrap {
            padding: 10px 14px !important;
          }
          .hero-date-badge-wrap {
            top: 8px !important;
            left: 10px !important;
          }
          .hero-date-badge-wrap span {
            font-size: 11px !important;
            letter-spacing: 0.06em !important;
          }
        }
      `}</style>
    </div>
    </>
  );
}
