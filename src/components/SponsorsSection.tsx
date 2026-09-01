'use client';

import React from 'react';
import Image from 'next/image';
import { Zap, HeartHandshake, ArrowUpRight, Sparkles, CheckCircle2, ShieldCheck, MapPin, Stethoscope } from 'lucide-react';

const SPONSOR_PERKS = [
  'Logo on 400+ Official Runner Bibs',
  'Start & Finish Line Arch Branding',
  'Goodie Bag Inserts & Sampling',
  'Social Media & Email Shoutouts',
  'On-Ground Product Kiosk & Banners',
  'VIP Passes & Stage Acknowledgement',
];

export default function SponsorsSection() {
  return (
    <section id="sponsors" className="sp">
      {/* Faint watermark */}
      <span className="sp-watermark display" aria-hidden="true">PARTNERS</span>

      <div className="sp-inner">

        {/* ─── SECTION HEADER ─── */}
        <div className="sp-header">
          <span className="ribbon"><Sparkles size={13} /> Sponsorship & Partnership</span>

          <h2 className="sp-title display">
            <span className="navy">Partner with</span> <span className="lime">Champions</span>
          </h2>

          <p className="sp-sub">
            Proudly supported by our official event partners and wellness champions who power the <strong>Miles for Smiles 5K Charity Run</strong> — connecting your brand with 400+ active participants while transforming children&rsquo;s lives.
          </p>
        </div>

        {/* ─── OFFICIAL PARTNERS SHOWCASE ─── */}
        <div className="partners-showcase-wrap">
          <div className="partners-tag">
            <Sparkles size={13} /> OFFICIAL EVENT PARTNERS
          </div>

          <div className="partners-grid">
            
            {/* Partner 1: Pharmacy Partner (A-One) */}
            <div className="partner-card">
              <div className="partner-category-pill">
                <Stethoscope size={12} />
                <span>PHARMACY PARTNER</span>
              </div>
              <div className="partner-logo-box">
                <Image
                  src="/images/sponsors/A-one.png"
                  alt="A-one - Official Pharmacy Partner"
                  width={240}
                  height={90}
                  style={{ maxHeight: '80px', width: 'auto', objectFit: 'contain' }}
                />
              </div>
              <div className="partner-info">
                <h4 className="partner-name">A-One</h4>
                <p className="partner-role">Official Pharmacy Partner</p>
              </div>
            </div>

            {/* Partner 2: Venue Partner (Club Charoli) */}
            <div className="partner-card">
              <div className="partner-category-pill venue-pill">
                <MapPin size={12} />
                <span>VENUE PARTNER</span>
              </div>
              <div className="partner-logo-box">
                <Image
                  src="/images/sponsors/ClubCharoli.png"
                  alt="Club Charoli - Official Venue Partner"
                  width={240}
                  height={90}
                  style={{ maxHeight: '80px', width: 'auto', objectFit: 'contain' }}
                />
              </div>
              <div className="partner-info">
                <h4 className="partner-name">Club Charoli</h4>
                <p className="partner-role">Official Venue Partner</p>
              </div>
            </div>

          </div>
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
          padding: 100px 24px 90px;
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

        .sp-header { text-align: center; max-width: 760px; margin: 0 auto 40px; }
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

        .sp-sub { font-size: 16px; color: var(--slate); line-height: 1.6; margin: 0; }
        .sp-sub strong { color: var(--ink); }

        /* Partners Showcase */
        .partners-showcase-wrap {
          margin-bottom: 50px;
          text-align: center;
        }
        .partners-tag {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: 0.16em;
          color: var(--navy-2);
          text-transform: uppercase;
          margin-bottom: 26px;
        }
        .partners-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 30px;
          max-width: 840px;
          margin: 0 auto;
        }
        .partner-card {
          background: #ffffff;
          border: 1.5px solid var(--line);
          border-radius: 24px;
          padding: 36px 28px 28px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          box-shadow: 0 12px 36px rgba(11, 26, 74, 0.06);
          position: relative;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .partner-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 18px 45px rgba(11, 26, 74, 0.12);
        }
        .partner-category-pill {
          position: absolute;
          top: -13px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--lime);
          color: var(--navy);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.08em;
          padding: 5px 16px;
          border-radius: 9999px;
          box-shadow: 0 4px 14px rgba(200, 255, 61, 0.45);
          text-transform: uppercase;
        }
        .partner-category-pill.venue-pill {
          background: var(--navy);
          color: var(--lime);
          box-shadow: 0 4px 14px rgba(11, 26, 74, 0.3);
        }
        .partner-logo-box {
          height: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
          width: 100%;
        }
        .partner-name {
          font-size: 20px;
          font-weight: 800;
          color: var(--navy);
          margin: 0 0 3px;
        }
        .partner-role {
          font-size: 13px;
          font-weight: 600;
          color: var(--slate);
          margin: 0;
        }

        /* Scoreboard */
        .scoreboard {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          background: #ffffff;
          border: 1.5px solid var(--line);
          border-radius: 20px;
          box-shadow: 0 14px 36px rgba(11, 26, 74, 0.06);
          margin-bottom: 60px;
          overflow: hidden;
        }
        .score-cell {
          padding: 30px 24px;
          border-right: 1px solid var(--line);
          text-align: center;
        }
        .score-cell:last-child { border-right: none; }
        .score-num { font-size: 42px; line-height: 1; color: var(--navy); margin-bottom: 6px; }
        .score-label { font-size: 14px; font-weight: 800; color: var(--ink); margin-bottom: 4px; }
        .score-sub { font-size: 11.5px; color: var(--slate); }

        /* CTA */
        .sp-cta-wrap {
          background: linear-gradient(135deg, var(--navy) 0%, #070f26 100%);
          border-radius: 28px;
          padding: 50px;
          box-shadow: 0 25px 60px rgba(11, 26, 74, 0.25);
          position: relative;
          overflow: hidden;
        }
        .sp-cta {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 50px;
          align-items: center;
          position: relative;
          z-index: 2;
        }
        .sp-cta-title { font-size: clamp(2rem, 4vw, 3rem); line-height: 1.05; color: #ffffff; margin: 0 0 14px; }
        .lime-text { color: var(--lime); }
        .sp-cta-desc { font-size: 15px; color: rgba(255, 255, 255, 0.8); line-height: 1.6; margin: 0 0 28px; }

        .perks-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 20px; }
        .perk-row { display: flex; align-items: center; gap: 10px; font-size: 13.5px; color: #ffffff; font-weight: 500; }

        /* Bib-Style Right Card */
        .sponsor-bib {
          background: #ffffff;
          border-radius: 22px;
          padding: 36px 30px;
          text-align: center;
          position: relative;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
          overflow: hidden;
        }
        .bib-flag { position: absolute; top: 0; left: 0; right: 0; height: 6px; background: var(--lime); }
        .bib-tag { font-size: 18px; color: #94a3b8; letter-spacing: 0.1em; margin-bottom: 12px; }
        .bib-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: rgba(200, 255, 61, 0.2);
          color: var(--navy);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }
        .bib-heading { font-size: 22px; font-weight: 800; color: var(--navy); margin: 0 0 8px; }
        .bib-desc { font-size: 13px; color: var(--slate); line-height: 1.5; margin: 0 0 22px; }
        .bib-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          background: var(--navy);
          color: var(--lime);
          font-weight: 800;
          font-size: 15px;
          padding: 14px 24px;
          border-radius: 12px;
          text-decoration: none;
          transition: transform 0.15s ease, background 0.15s ease;
          box-shadow: 0 6px 18px rgba(11, 26, 74, 0.2);
        }
        .bib-cta:hover { transform: translateY(-2px); background: var(--navy-2); }
        .bib-trust { font-size: 11.5px; font-weight: 700; color: #059669; display: flex; align-items: center; justify-content: center; gap: 5px; margin-top: 16px; text-transform: uppercase; letter-spacing: 0.05em; }
        .bib-email { font-size: 12px; color: var(--slate); margin-top: 12px; }
        .bib-email strong { color: var(--navy); }

        @media (max-width: 960px) {
          .scoreboard { grid-template-columns: 1fr 1fr; }
          .score-cell:nth-child(2) { border-right: none; }
          .score-cell:nth-child(1), .score-cell:nth-child(2) { border-bottom: 1px solid var(--line); }
          .sp-cta { grid-template-columns: 1fr; }
          .perks-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 680px) {
          .sp { padding: 70px 16px 70px; }
          .partners-grid { grid-template-columns: 1fr; gap: 32px; }
          .scoreboard { grid-template-columns: 1fr; }
          .score-cell { border-right: none; border-bottom: 1px solid var(--line); padding: 22px 16px; }
          .score-cell:last-child { border-bottom: none; }
          .sp-cta-wrap { padding: 30px 20px; }
        }
      `}</style>
    </section>
  );
}