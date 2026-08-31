'use client';

import { Zap, HeartHandshake, ShieldCheck, Mail, ArrowUpRight } from 'lucide-react';

interface Sponsor {
  name: string;
  category: string;
  tier: string;
  iconText: string;
  accent: string;
}

const SPONSORS_ROW_1: Sponsor[] = [
  { name: 'FAST&UP', category: 'Official Nutrition Partner', tier: 'PLATINUM', iconText: '⚡ FAST&UP', accent: '#f59e0b' },
  { name: 'GARMIN', category: 'Official Timing Partner', tier: 'TECH', iconText: '⏱ GARMIN', accent: '#38bdf8' },
  { name: 'ENERZAL', category: 'Hydration Partner', tier: 'ENERGY', iconText: '💧 ENERZAL', accent: '#22c55e' },
  { name: 'PUMA RUNNING', category: 'Apparel & Footwear Partner', tier: 'APPAREL', iconText: '🐆 PUMA', accent: '#ec4899' },
  { name: 'APOLLO HOSPITALS', category: 'Medical & Safety Partner', tier: 'HEALTHCARE', iconText: '✚ APOLLO', accent: '#ef4444' },
  { name: 'RED BULL', category: 'Energy Station Partner', tier: 'ENERGY', iconText: '🐂 RED BULL', accent: '#3b82f6' },
];

const SPONSORS_ROW_2: Sponsor[] = [
  { name: 'TATA GLUCO+', category: 'On-Route Refreshments', tier: 'HYDRATION', iconText: '⚡ TATA GLUCO+', accent: '#eab308' },
  { name: 'CULT.FIT', category: 'Fitness & Warm-Up Partner', tier: 'FITNESS', iconText: '🔥 CULT.FIT', accent: '#f97316' },
  { name: 'ASICS', category: 'Running Community Partner', tier: 'PERFORMANCE', iconText: '👟 ASICS', accent: '#a855f7' },
  { name: 'RED FM 93.5', category: 'Official Radio Partner', tier: 'MEDIA', iconText: '📻 RED FM', accent: '#f43f5e' },
  { name: 'ROTARY CLUB', category: 'Charity Impact Partner', tier: 'COMMUNITY', iconText: '🤝 ROTARY', accent: '#10b981' },
  { name: 'DECATHLON', category: 'Sports Gear Partner', tier: 'EQUIPMENT', iconText: '🏔 DECATHLON', accent: '#06b6d4' },
];

export default function SponsorsSection() {
  return (
    <section
      id="sponsors"
      style={{
        position: 'relative',
        background: '#ffffff',
        padding: '95px 0 105px',
        overflow: 'hidden',
        borderTop: '1px solid #e2e8f0',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', textAlign: 'center', position: 'relative', zIndex: 5 }}>
        
        {/* Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#12318B',
            color: '#C8FF3D',
            padding: '7px 20px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 900,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '18px',
            transform: 'rotate(-1.5deg)',
            boxShadow: '0 6px 20px rgba(18, 49, 139, 0.2)',
          }}
        >
          <Zap size={14} fill="#C8FF3D" color="#C8FF3D" /> COMMUNITY CHAMPIONS
        </div>

        {/* Heading */}
        <h2
          style={{
            fontFamily: 'var(--font-geist-sans), Inter, sans-serif',
            fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)',
            fontWeight: 900,
            color: '#0f172a',
            letterSpacing: '0.03em',
            lineHeight: 1.1,
            textTransform: 'uppercase',
            margin: '0 0 16px 0',
          }}
        >
          POWERED BY OUR <span style={{ color: '#12318B' }}>PARTNERS</span>
        </h2>

        <p
          style={{
            fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
            color: '#64748b',
            maxWidth: '650px',
            margin: '0 auto 55px',
            lineHeight: 1.6,
          }}
        >
          Proudly supported by leading sports, healthcare, and wellness brands who believe in fitness, community, and bringing smiles.
        </p>

      </div>

      {/* ─── MOVING MARQUEE ROW 1 (SCROLLS LEFT) ─── */}
      <div className="sponsors-marquee-wrapper" style={{ marginBottom: '22px' }}>
        <div className="sponsors-track track-left">
          {[...SPONSORS_ROW_1, ...SPONSORS_ROW_1, ...SPONSORS_ROW_1].map((sponsor, i) => (
            <div key={i} className="sponsor-card">
              <div className="sponsor-card-inner">
                <div className="sponsor-tag" style={{ color: sponsor.accent }}>
                  {sponsor.tier}
                </div>
                <div className="sponsor-brand">{sponsor.iconText}</div>
                <div className="sponsor-category">{sponsor.category}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── MOVING MARQUEE ROW 2 (SCROLLS RIGHT) ─── */}
      <div className="sponsors-marquee-wrapper">
        <div className="sponsors-track track-right">
          {[...SPONSORS_ROW_2, ...SPONSORS_ROW_2, ...SPONSORS_ROW_2].map((sponsor, i) => (
            <div key={i} className="sponsor-card">
              <div className="sponsor-card-inner">
                <div className="sponsor-tag" style={{ color: sponsor.accent }}>
                  {sponsor.tier}
                </div>
                <div className="sponsor-brand">{sponsor.iconText}</div>
                <div className="sponsor-category">{sponsor.category}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA / Become Sponsor */}
      <div style={{ maxWidth: '850px', margin: '55px auto 0', padding: '0 24px', textAlign: 'center', position: 'relative', zIndex: 5 }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #12318B 0%, #0a1c54 100%)',
            border: '1px solid rgba(200, 255, 61, 0.3)',
            borderRadius: '20px',
            padding: '24px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '18px',
            boxShadow: '0 16px 40px rgba(18, 49, 139, 0.2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', textAlign: 'left' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: 'rgba(200, 255, 61, 0.15)',
                color: '#C8FF3D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <HeartHandshake size={24} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff' }}>
                Interested in sponsoring Miles for Smiles?
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.75)' }}>
                Partner with us to support child health and reach 400+ active participants.
              </div>
            </div>
          </div>

          <a
            href="mailto:contact@milesforsmiles.org?subject=Sponsorship%20Inquiry%20-%20Miles4Smiles"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#C8FF3D',
              color: '#070f26',
              padding: '10px 22px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: 900,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              boxShadow: '0 6px 20px rgba(200, 255, 61, 0.3)',
            }}
          >
            Become a Partner <ArrowUpRight size={16} strokeWidth={2.5} />
          </a>
        </div>
      </div>

      <style jsx>{`
        .sponsors-marquee-wrapper {
          width: 100%;
          overflow: hidden;
          position: relative;
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
        }

        .sponsors-track {
          display: flex;
          align-items: center;
          gap: 20px;
          width: max-content;
          will-change: transform;
        }

        .track-left {
          animation: scrollLeft 35s linear infinite;
        }

        .track-right {
          animation: scrollRight 38s linear infinite;
        }

        .sponsors-marquee-wrapper:hover .sponsors-track {
          animation-play-state: paused;
        }

        @keyframes scrollLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        @keyframes scrollRight {
          0% {
            transform: translateX(-33.333%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .sponsor-card {
          flex-shrink: 0;
          width: 250px;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 18px;
          padding: 18px 22px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
          user-select: none;
        }

        .sponsor-card:hover {
          transform: translateY(-4px);
          border-color: #12318B;
          box-shadow: 0 14px 32px rgba(18, 49, 139, 0.12);
        }

        .sponsor-tag {
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .sponsor-brand {
          font-size: 18px;
          font-weight: 900;
          letter-spacing: 0.04em;
          color: #0f172a;
          line-height: 1.2;
          margin-bottom: 4px;
          text-transform: uppercase;
        }

        .sponsor-category {
          font-size: 12px;
          color: #64748b;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </section>
  );
}
