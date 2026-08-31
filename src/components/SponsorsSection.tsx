'use client';

import React from 'react';
import { Zap, HeartHandshake, ArrowUpRight, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

interface Sponsor {
  id: string;
  name: string;
  category: string;
  tier: string;
  accent: string;
  badgeBg: string;
}

const SPONSORS_ROW_1: Sponsor[] = [
  { id: 'FAST&UP', name: 'FAST&UP', category: 'Official Nutrition Partner', tier: 'PLATINUM', accent: '#f59e0b', badgeBg: 'rgba(245, 158, 11, 0.12)' },
  { id: 'GARMIN', name: 'GARMIN', category: 'Official Timing & GPS Partner', tier: 'TECH & TIMING', accent: '#0284c7', badgeBg: 'rgba(2, 132, 199, 0.12)' },
  { id: 'ENERZAL', name: 'ENERZAL', category: 'Energy & Hydration Partner', tier: 'HYDRATION', accent: '#10b981', badgeBg: 'rgba(16, 185, 129, 0.12)' },
  { id: 'PUMA RUNNING', name: 'PUMA RUNNING', category: 'Apparel & Footwear Partner', tier: 'APPAREL', accent: '#0f172a', badgeBg: 'rgba(15, 23, 42, 0.08)' },
  { id: 'APOLLO HOSPITALS', name: 'APOLLO HOSPITALS', category: 'Emergency & Medical Partner', tier: 'HEALTHCARE', accent: '#ef4444', badgeBg: 'rgba(239, 68, 68, 0.12)' },
  { id: 'RED BULL', name: 'RED BULL', category: 'Official Energy Station', tier: 'ENERGY', accent: '#dc2626', badgeBg: 'rgba(220, 38, 38, 0.12)' },
];

const SPONSORS_ROW_2: Sponsor[] = [
  { id: 'TATA GLUCO+', name: 'TATA GLUCO+', category: 'On-Route Refreshments', tier: 'REFRESHMENTS', accent: '#0284c7', badgeBg: 'rgba(2, 132, 199, 0.12)' },
  { id: 'CULT.FIT', name: 'CULT.FIT', category: 'Fitness & Zumba Warm-Up', tier: 'FITNESS', accent: '#ff3e6c', badgeBg: 'rgba(255, 62, 108, 0.12)' },
  { id: 'ASICS', name: 'ASICS', category: 'Running Community Partner', tier: 'PERFORMANCE', accent: '#3b82f6', badgeBg: 'rgba(59, 130, 246, 0.12)' },
  { id: 'RED FM 93.5', name: 'RED FM 93.5', category: 'Official Radio Partner', tier: 'MEDIA', accent: '#dc2626', badgeBg: 'rgba(220, 38, 38, 0.12)' },
  { id: 'ROTARY CLUB', name: 'ROTARY CLUB', category: 'Charity Impact Partner', tier: 'COMMUNITY', accent: '#d97706', badgeBg: 'rgba(217, 119, 6, 0.12)' },
  { id: 'DECATHLON', name: 'DECATHLON', category: 'Sports Gear & Kit Partner', tier: 'EQUIPMENT', accent: '#0284c7', badgeBg: 'rgba(2, 132, 199, 0.12)' },
];

const SPONSOR_PERKS = [
  'Logo on 400+ Official Runner Bibs',
  'Start & Finish Line Arch Branding',
  'Goodie Bag Inserts & Sampling',
  'Social Media & Email Shoutouts',
  'On-Ground Product Kiosk & Banners',
  'VIP Passes & Stage Acknowledgement',
];

function renderSponsorLogo(id: string) {
  switch (id) {
    case 'FAST&UP':
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(245,158,11,0.35)', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="#070f26" stroke="#070f26" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={{ fontSize: '21px', fontWeight: 900, letterSpacing: '-0.02em', fontStyle: 'italic', color: '#0f172a' }}>
            FAST<span style={{ color: '#f59e0b' }}>&</span>UP
          </span>
        </div>
      );
    case 'GARMIN':
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
              <path d="M16 3L28 25H4L16 3Z" fill="#0284c7" />
              <path d="M16 11L22 23H10L16 11Z" fill="#ffffff" />
            </svg>
          </div>
          <span style={{ fontSize: '21px', fontWeight: 900, letterSpacing: '0.12em', color: '#0f172a' }}>
            GARMIN<span style={{ color: '#0284c7' }}>.</span>
          </span>
        </div>
      );
    case 'ENERZAL':
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(16,185,129,0.35)', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="rgba(255,255,255,0.3)" />
            </svg>
          </div>
          <span style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '0.06em', color: '#0f172a' }}>
            ENER<span style={{ color: '#10b981' }}>ZAL</span>
          </span>
        </div>
      );
    case 'PUMA RUNNING':
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '38px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="36" height="30" viewBox="0 0 40 32" fill="#0f172a">
              <path d="M28.5 4C27 2 24.5 1 22 1.5C18.5 2 16 5 14 8C12 11 9 14.5 5 16C3 16.8 1 17.5 0 19C1.5 20 3.5 20.5 5.5 20C8 19.5 11 17.5 13.5 15C16 12.5 19 8.5 22 7C24.5 5.8 27 6 28.5 7.5L34 13C36 15 39 16 40 15C39.5 13.5 38 12 36 10L30 5C29.5 4.5 29 4.2 28.5 4Z" />
            </svg>
          </div>
          <span style={{ fontSize: '22px', fontWeight: 900, letterSpacing: '0.08em', color: '#0f172a' }}>
            PUMA
          </span>
        </div>
      );
    case 'APOLLO HOSPITALS':
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#fee2e2', border: '1.5px solid #ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#ef4444">
              <path d="M9 3H15V9H21V15H15V21H9V15H3V9H9V3Z" />
            </svg>
          </div>
          <div>
            <span style={{ fontSize: '19px', fontWeight: 900, letterSpacing: '-0.01em', color: '#0f172a', display: 'block', lineHeight: 1 }}>
              Apollo
            </span>
            <span style={{ fontSize: '9.5px', fontWeight: 800, letterSpacing: '0.12em', color: '#ef4444', textTransform: 'uppercase' }}>
              HOSPITALS
            </span>
          </div>
        </div>
      );
    case 'RED BULL':
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#fbbf24', border: '2px solid #ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(239,68,68,0.25)', flexShrink: 0 }}>
            <span style={{ fontSize: '16px', fontWeight: 900, color: '#dc2626' }}>⚡</span>
          </div>
          <span style={{ fontSize: '21px', fontWeight: 900, letterSpacing: '-0.02em', color: '#dc2626' }}>
            Red<span style={{ color: '#1e3a8a' }}>Bull</span>
          </span>
        </div>
      );
    case 'TATA GLUCO+':
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #0284c7, #0369a1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(2,132,199,0.3)', flexShrink: 0 }}>
            <span style={{ fontSize: '18px', fontWeight: 900, color: '#ffffff' }}>T</span>
          </div>
          <div>
            <span style={{ fontSize: '17px', fontWeight: 900, letterSpacing: '0.04em', color: '#0f172a', display: 'block', lineHeight: 1 }}>
              TATA <span style={{ color: '#eab308' }}>GLUCO+</span>
            </span>
            <span style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '0.12em', color: '#0284c7', textTransform: 'uppercase' }}>
              INSTANT ENERGY
            </span>
          </div>
        </div>
      );
    case 'CULT.FIT':
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #ff3e6c, #e11d48)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(255,62,108,0.35)', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
              <path d="M12 2C8 6 6 9 6 13A6 6 0 0 0 18 13C18 9 16 6 12 2Z" />
            </svg>
          </div>
          <span style={{ fontSize: '21px', fontWeight: 900, letterSpacing: '-0.02em', color: '#0f172a' }}>
            cult<span style={{ color: '#ff3e6c' }}>.fit</span>
          </span>
        </div>
      );
    case 'ASICS':
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="32" height="28" viewBox="0 0 32 28" fill="#1e1b4b">
              <path d="M8 24C12 24 16 18 20 10C22 6 25 3 29 2C24 3 20 7 17 13C14 19 11 23 6 24L8 24Z" />
              <path d="M14 24C18 24 21 19 24 13C26 9 28 6 31 5C27 6 24 10 21 16C18 21 16 23 12 24L14 24Z" fill="#3b82f6" />
            </svg>
          </div>
          <span style={{ fontSize: '22px', fontWeight: 900, letterSpacing: '0.12em', color: '#1e1b4b' }}>
            asics
          </span>
        </div>
      );
    case 'RED FM 93.5':
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(220,38,38,0.35)', flexShrink: 0 }}>
            <span style={{ fontSize: '13px', fontWeight: 900, color: '#ffffff' }}>93.5</span>
          </div>
          <div>
            <span style={{ fontSize: '19px', fontWeight: 900, letterSpacing: '-0.01em', color: '#dc2626', display: 'block', lineHeight: 1 }}>
              RED <span style={{ color: '#0f172a' }}>FM</span>
            </span>
            <span style={{ fontSize: '8.5px', fontWeight: 800, letterSpacing: '0.14em', color: '#64748b', textTransform: 'uppercase' }}>
              BAJAATE RAHO!
            </span>
          </div>
        </div>
      );
    case 'ROTARY CLUB':
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(245,158,11,0.3)', flexShrink: 0 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#0f172a">
              <circle cx="12" cy="12" r="9" stroke="#0f172a" strokeWidth="2" fill="none" />
              <circle cx="12" cy="12" r="4" fill="#0f172a" />
              <path d="M12 2V6M12 18V22M2 12H6M18 12H22" stroke="#0f172a" strokeWidth="2.5" />
            </svg>
          </div>
          <div>
            <span style={{ fontSize: '17px', fontWeight: 900, letterSpacing: '0.04em', color: '#0f172a', display: 'block', lineHeight: 1 }}>
              ROTARY
            </span>
            <span style={{ fontSize: '8.5px', fontWeight: 800, letterSpacing: '0.12em', color: '#d97706', textTransform: 'uppercase' }}>
              INTERNATIONAL
            </span>
          </div>
        </div>
      );
    case 'DECATHLON':
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(2,132,199,0.35)', flexShrink: 0 }}>
            <span style={{ fontSize: '19px', fontWeight: 900, color: '#ffffff' }}>D</span>
          </div>
          <span style={{ fontSize: '19px', fontWeight: 900, letterSpacing: '0.04em', color: '#0284c7' }}>
            DECATHLON
          </span>
        </div>
      );
    default:
      return null;
  }
}

export default function SponsorsSection() {
  return (
    <section id="sponsors" className="sp">
      {/* Faint watermark, matching the hero's ghost runner */}
      <span className="sp-watermark display" aria-hidden="true">PARTNERS</span>

      <div className="sp-inner">

        {/* ─── SECTION HEADER ─── */}
        <div className="sp-header">
          <span className="ribbon"><Sparkles size={13} /> Sponsorship & Partnership</span>

          <h2 className="sp-title display">
            <span className="navy">Powered by</span> <span className="lime">Champions</span>
          </h2>

          <p className="sp-sub">
            Join industry leaders and wellness champions who power the <strong>Miles for Smiles 5K Charity Run</strong> — connecting your brand with 400+ active participants while transforming children&rsquo;s lives.
          </p>
        </div>

        {/* ─── SCOREBOARD STAT STRIP ─── */}
        <div className="scoreboard">
          <div className="score-cell">
            <div className="score-num display">400+</div>
            <div className="score-label">Active Runners on Race Day</div>
            <div className="score-sub">Competitive & Fun Run Participants</div>
          </div>
          <div className="score-cell">
            <div className="score-num display">100%</div>
            <div className="score-label">Charity Cause Alignment</div>
            <div className="score-sub">Direct Healthcare for Children</div>
          </div>
          <div className="score-cell">
            <div className="score-num display">35K+</div>
            <div className="score-label">Digital & Social Reach</div>
            <div className="score-sub">High-Engagement Impressions</div>
          </div>
          <div className="score-cell">
            <div className="score-num display">Tier 1</div>
            <div className="score-label">Prime Bib & Route Visibility</div>
            <div className="score-sub">Exclusive Stage & Media Rights</div>
          </div>
        </div>

      </div>

      {/* ─── MOVING MARQUEE ROW 1 (SCROLLS LEFT) ─── */}
      <div className="sponsors-marquee-wrapper" style={{ marginBottom: '20px' }}>
        <div className="sponsors-track track-left">
          {[...SPONSORS_ROW_1, ...SPONSORS_ROW_1, ...SPONSORS_ROW_1].map((sponsor, i) => (
            <div key={i} className="sponsor-brand-card">
              {renderSponsorLogo(sponsor.id)}
            </div>
          ))}
        </div>
      </div>

      {/* ─── MOVING MARQUEE ROW 2 (SCROLLS RIGHT) ─── */}
      <div className="sponsors-marquee-wrapper" style={{ marginBottom: '60px' }}>
        <div className="sponsors-track track-right">
          {[...SPONSORS_ROW_2, ...SPONSORS_ROW_2, ...SPONSORS_ROW_2].map((sponsor, i) => (
            <div key={i} className="sponsor-brand-card">
              {renderSponsorLogo(sponsor.id)}
            </div>
          ))}
        </div>
      </div>

      {/* ─── SPONSORSHIP CTA ─── */}
      <div className="sp-cta-wrap">
        <div className="sp-cta">

          {/* Left Column: Why Partner + Perks */}
          <div>
            <span className="ribbon on-navy"><Zap size={13} /> Sponsorship Benefits</span>

            <h3 className="sp-cta-title display">
              Elevate your brand with <span className="lime-text">Miles for Smiles</span>
            </h3>

            <p className="sp-cta-desc">
              Partnering with us gives your brand high-impact physical and digital visibility before, during, and after race day.
            </p>

            <div className="perks-grid">
              {SPONSOR_PERKS.map((perk, index) => (
                <div key={index} className="perk-row">
                  <CheckCircle2 size={16} color="#C8FF3D" style={{ flexShrink: 0 }} />
                  <span>{perk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Bib-style CTA */}
          <div className="sponsor-bib">
            <div className="bib-flag" />
            <div className="bib-tag display">#SPONSOR</div>

            <div className="bib-icon">
              <HeartHandshake size={26} />
            </div>

            <h4 className="bib-heading">Become a Sponsor</h4>

            <p className="bib-desc">
              Custom sponsorship packages available for Title, Hydration, Media & Goodie Partners.
            </p>

            <a
              href="mailto:setunst@gmail.com,rameezrahman17@gmail.com?subject=Sponsorship%20Proposal%20-%20Miles4Smiles%205K"
              className="bib-cta"
            >
              Request Proposal <ArrowUpRight size={18} strokeWidth={3} />
            </a>

            <div className="bib-trust"><ShieldCheck size={13} /> Verified charity partner network</div>
            <div className="bib-email">Direct: <strong>setunst@gmail.com</strong> | <strong>+91 91729 01968</strong></div>
            <div className="bib-email" style={{ marginTop: '4px' }}><strong>rameezrahman17@gmail.com</strong> | <strong>+91 93018 04524</strong></div>
          </div>

        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800&display=swap');

        .sp {
          --navy: #0b1a4a;
          --navy-2: #12318b;
          --lime: #c8ff3d;
          --paper: #f3f2ec;
          --ink: #10182c;
          --slate: #5c6785;
          --line: #dfe3ed;
          position: relative;
          background: var(--paper);
          padding: 100px 24px 0;
          overflow: hidden;
          font-family: 'Inter', system-ui, sans-serif;
        }
        .display { font-family: 'Bebas Neue', 'Inter', sans-serif; letter-spacing: 0.02em; }

        .sp-watermark {
          position: absolute;
          top: -4%;
          left: 50%;
          transform: translateX(-50%);
          font-size: clamp(6rem, 16vw, 13rem);
          color: rgba(11, 26, 74, 0.045);
          white-space: nowrap;
          line-height: 1;
          pointer-events: none;
          z-index: 0;
        }

        .sp-inner { max-width: 1200px; margin: 0 auto; position: relative; z-index: 1; }

        .sp-header { text-align: center; max-width: 760px; margin: 0 auto 50px; }
        .ribbon {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: var(--lime);
          color: var(--navy);
          font-weight: 800;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 9px 18px 9px 22px;
          clip-path: polygon(0 50%, 14px 0, 100% 0, 100% 100%, 14px 100%);
          margin-bottom: 20px;
        }
        .ribbon.on-navy { background: rgba(200, 255, 61, 0.15); color: var(--lime); border: 1px solid rgba(200, 255, 61, 0.35); clip-path: none; border-radius: 999px; padding: 8px 16px; }

        .sp-title { font-size: clamp(2.4rem, 6vw, 4.2rem); line-height: 0.95; margin: 0 0 18px; }
        .sp-title .navy { color: var(--navy); }
        .sp-title .lime { color: var(--navy-2); background: var(--lime); padding: 0 10px; }
        .sp-sub { font-size: clamp(1rem, 1.4vw, 1.1rem); color: var(--slate); line-height: 1.6; margin: 0; }

        /* Scoreboard */
        .scoreboard {
          background: var(--navy);
          border-radius: 20px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          position: relative;
          overflow: hidden;
          margin-bottom: 60px;
        }
        .scoreboard::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          background-image: repeating-linear-gradient(45deg, var(--lime) 0 8px, transparent 8px 16px);
        }
        .score-cell { padding: 32px 20px 26px; text-align: center; position: relative; }
        .score-cell + .score-cell::before {
          content: '';
          position: absolute; left: 0; top: 22%; bottom: 22%; width: 1px;
          background-image: linear-gradient(rgba(255,255,255,0.18) 50%, transparent 0%);
          background-size: 1px 6px; background-repeat: repeat-y;
        }
        .score-num { font-size: clamp(2.1rem, 4vw, 3rem); color: var(--lime); line-height: 1; }
        .score-label { font-size: 13px; font-weight: 800; color: #fff; margin-top: 8px; }
        .score-sub { font-size: 11px; color: rgba(255, 255, 255, 0.55); margin-top: 2px; }
        @media (max-width: 700px) {
          .scoreboard { grid-template-columns: repeat(2, 1fr); }
          .score-cell:nth-child(3)::before, .score-cell:nth-child(1)::before { display: none; }
        }

        /* Marquee */
        .sponsors-marquee-wrapper {
          width: 100%;
          overflow: hidden;
          position: relative;
          mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
        }
        .sponsors-track { display: flex; align-items: center; gap: 18px; width: max-content; will-change: transform; }
        .track-left { animation: scrollLeft 34s linear infinite; }
        .track-right { animation: scrollRight 36s linear infinite; }
        @keyframes scrollLeft { 0% { transform: translateX(0); } 100% { transform: translateX(-33.333%); } }
        @keyframes scrollRight { 0% { transform: translateX(-33.333%); } 100% { transform: translateX(0); } }

        .sponsor-brand-card {
          flex-shrink: 0;
          min-width: 220px;
          height: 82px;
          background: #ffffff;
          border: 1.5px solid var(--line);
          border-radius: 16px;
          padding: 0 28px;
          user-select: none;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(11, 26, 74, 0.04);
        }

        /* CTA */
        .sp-cta-wrap { max-width: 1180px; margin: 0 auto; padding: 0 24px 100px; position: relative; z-index: 1; }
        .sp-cta {
          background: var(--navy);
          border: 2px solid var(--lime);
          border-radius: 24px;
          padding: clamp(30px, 5vw, 52px);
          color: #fff;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          align-items: center;
          gap: clamp(28px, 4vw, 50px);
          position: relative;
          overflow: hidden;
        }
        .sp-cta::after {
          content: '';
          position: absolute; top: 0; right: 0;
          width: 0; height: 0;
          border-style: solid;
          border-width: 0 90px 90px 0;
          border-color: transparent var(--lime) transparent transparent;
          opacity: 0.9;
        }

        .sp-cta-title { font-size: clamp(1.9rem, 3.5vw, 2.7rem); line-height: 1; letter-spacing: 0.01em; margin: 0 0 16px; text-transform: none; }
        .lime-text { color: var(--lime); }
        .sp-cta-desc { font-size: 1rem; color: rgba(255, 255, 255, 0.8); line-height: 1.6; margin-bottom: 24px; max-width: 46ch; }

        .perks-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 12px; }
        .perk-row { display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 600; color: rgba(255, 255, 255, 0.95); }

        .sponsor-bib {
          position: relative;
          background: rgba(7, 15, 38, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 18px;
          padding: 30px 26px 26px;
          text-align: center;
          overflow: hidden;
        }
        .bib-flag { position: absolute; top: 0; left: 0; right: 0; height: 6px; background-image: repeating-linear-gradient(45deg, var(--lime) 0 8px, var(--navy) 8px 16px); }
        .bib-tag { font-size: 13px; letter-spacing: 0.3em; color: rgba(200, 255, 61, 0.65); margin: 16px 0 14px; }
        .bib-icon { width: 54px; height: 54px; border-radius: 16px; background: var(--lime); color: #070f26; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px; box-shadow: 0 8px 22px rgba(200, 255, 61, 0.32); }
        .bib-heading { font-size: 1.3rem; font-weight: 900; color: #fff; margin: 0 0 8px; }
        .bib-desc { font-size: 13px; color: rgba(255, 255, 255, 0.7); line-height: 1.55; margin-bottom: 22px; }
        .bib-cta {
          display: inline-flex; align-items: center; justify-content: center; gap: 10px;
          background: var(--lime); color: #070f26; width: 100%;
          padding: 15px 22px; border-radius: 999px; font-size: 14px; font-weight: 900;
          letter-spacing: 0.05em; text-decoration: none; box-shadow: 0 10px 26px rgba(200, 255, 61, 0.32);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .bib-cta:hover { transform: translateY(-2px); box-shadow: 0 14px 32px rgba(200, 255, 61, 0.45); }
        .bib-trust { display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 11px; color: rgba(200, 255, 61, 0.8); margin-top: 14px; }
        .bib-email { font-size: 11.5px; color: rgba(255, 255, 255, 0.5); margin-top: 8px; }
        .bib-email strong { color: #fff; }

        @media (max-width: 900px) {
          .sp-cta { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}