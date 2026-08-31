'use client';

import React from 'react';
import Link from 'next/link';
import { Trophy, Zap, CheckCircle2, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export default function CategoriesSection() {
  return (
    <section id="categories" className="categories-section">
      <div className="categories-container">
        
        {/* ─── SECTION HEADER ─── */}
        <div className="cat-header">
          <div className="cat-badge">
            <Sparkles size={14} /> CHOOSE YOUR CHALLENGE
          </div>
          
          <h2 className="cat-title">
            RACE CATEGORIES & <span className="highlight">PRIZES</span>
          </h2>

          <p className="cat-subtitle">
            Whether you&rsquo;re chasing the ₹35,000 podium cash prize or jogging for charity smiles, choose the tier that matches your passion.
          </p>
        </div>

        {/* ─── ₹35,000 CASH PRIZE HIGHLIGHT BANNER ─── */}
        <div className="prize-banner">
          <div className="prize-banner-top">
            <div className="prize-trophy-badge">
              <Trophy size={28} />
            </div>
            <div>
              <div className="prize-tag">OFFICIAL CASH PRIZE POOL</div>
              <h3 className="prize-amount">₹35,000 TOTAL REWARDS</h3>
            </div>
          </div>

          <div className="prize-split-grid">
            {/* Boys / Men Division */}
            <div className="prize-podium-card">
              <div className="podium-header">
                <span className="podium-gender">🏃‍♂️ Men / Boys Category</span>
                <span className="podium-badge">Competitive 5K</span>
              </div>
              <div className="podium-ranks">
                <div className="rank-item first">
                  <span className="rank-medal">🥇 1st Place</span>
                  <span className="rank-cash">₹10,000</span>
                </div>
                <div className="rank-item second">
                  <span className="rank-medal">🥈 2nd Place</span>
                  <span className="rank-cash">₹7,500</span>
                </div>
              </div>
            </div>

            {/* Girls / Women Division */}
            <div className="prize-podium-card">
              <div className="podium-header">
                <span className="podium-gender">🏃‍♀️ Women / Girls Category</span>
                <span className="podium-badge">Competitive 5K</span>
              </div>
              <div className="podium-ranks">
                <div className="rank-item first">
                  <span className="rank-medal">🥇 1st Place</span>
                  <span className="rank-cash">₹10,000</span>
                </div>
                <div className="rank-item second">
                  <span className="rank-medal">🥈 2nd Place</span>
                  <span className="rank-cash">₹7,500</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── CATEGORY PRICING CARDS ─── */}
        <div className="categories-grid">
          
          {/* 1. NON-COMPETITIVE CARD (₹149) */}
          <div className="cat-card fun-run-card">
            <div className="card-top-row">
              <span className="cat-type-tag">COMMUNITY & JOY RUN</span>
              <span className="age-tag">Min Age: 10 Yrs</span>
            </div>

            <h3 className="cat-card-title">Non-Competitive 5K</h3>
            <p className="cat-card-desc">
              A self-paced charity walk, jog, or run designed for fitness lovers, families, and supporters running for smiles.
            </p>

            <div className="price-tag-wrap">
              <span className="currency">₹</span>
              <span className="price-val">149</span>
              <span className="price-term">/ participant</span>
            </div>

            <div className="perks-list">
              <div className="perk-item">
                <CheckCircle2 size={16} className="perk-icon" />
                <span>Official <strong>Runner BIB</strong></span>
              </div>

              <div className="perk-item">
                <CheckCircle2 size={16} className="perk-icon" />
                <span>On-Route <strong>Hydration & Electrolytes</strong></span>
              </div>
              <div className="perk-item">
                <CheckCircle2 size={16} className="perk-icon" />
                <span>Healthy <strong>Post-Run Breakfast</strong></span>
              </div>
              <div className="perk-item">
                <CheckCircle2 size={16} className="perk-icon" />
                <span>Official <strong>Participation E-Certificate</strong></span>
              </div>
              <div className="perk-item">
                <CheckCircle2 size={16} className="perk-icon" />
                <span>Medical & Emergency Safety</span>
              </div>
            </div>

            <Link
              href="/register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                width: '100%',
                padding: '16px 24px',
                borderRadius: '14px',
                fontSize: '14px',
                fontWeight: 900,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                border: '1.5px solid rgba(255, 255, 255, 0.25)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              className="cat-btn-fun"
            >
              Register for Joy Run <ArrowRight size={17} strokeWidth={2.5} />
            </Link>
          </div>

          {/* 2. COMPETITIVE CARD (₹249 - FEATURED) */}
          <div className="cat-card competitive-card">
            <div className="featured-badge">
              <Trophy size={13} /> CASH PRIZE ELIGIBLE
            </div>

            <div className="card-top-row">
              <span className="cat-type-tag competitive-tag">TIMED SPEED DIVISION</span>
              <span className="age-tag competitive-age">Min Age: 10 Yrs</span>
            </div>

            <h3 className="cat-card-title">Competitive 5K</h3>
            <p className="cat-card-desc">
              For athletes and competitive runners chasing leaderboard glory and the ₹35,000 cash prize pool.
            </p>

            {/* Exclusive Competitive Advantage */}
            <div className="advantage-box">
              <Zap size={16} color="#C8FF3D" style={{ flexShrink: 0 }} />
              <span><strong>Front-Grid Advantage:</strong> Starts ahead of the rest of the pack!</span>
            </div>

            <div className="price-tag-wrap">
              <span className="currency lime-currency">₹</span>
              <span className="price-val lime-val">249</span>
              <span className="price-term">/ participant</span>
            </div>

            <div className="perks-list">
              <div className="perk-item">
                <CheckCircle2 size={16} className="perk-icon lime-icon" />
                <span><strong>Priority Front-Line Flag-Off</strong></span>
              </div>
              <div className="perk-item">
                <CheckCircle2 size={16} className="perk-icon lime-icon" />
                <span>Eligible for <strong>₹35,000 Cash Prize</strong></span>
              </div>
              <div className="perk-item">
                <CheckCircle2 size={16} className="perk-icon lime-icon" />
                <span>Official <strong>Runner Bib</strong></span>
              </div>
              {/* <div className="perk-item">
                <CheckCircle2 size={16} className="perk-icon lime-icon" />
                <span>Customized <strong>Finisher Medal</strong></span>
              </div> */}
              <div className="perk-item">
                <CheckCircle2 size={16} className="perk-icon lime-icon" />
                <span>On-Route <strong>Hydration & Electrolytes</strong></span>
              </div>
              <div className="perk-item">
                <CheckCircle2 size={16} className="perk-icon lime-icon" />
                <span>Healthy <strong>Post-Run Breakfast</strong></span>
              </div>
              <div className="perk-item">
                <CheckCircle2 size={16} className="perk-icon lime-icon" />
                <span>Verified <strong>Timing E-Certificate</strong></span>
              </div>
            </div>

            <Link
              href="/register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                width: '100%',
                padding: '16px 24px',
                borderRadius: '14px',
                fontSize: '14px',
                fontWeight: 900,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                backgroundColor: '#C8FF3D',
                color: '#070f26',
                boxShadow: '0 8px 26px rgba(200, 255, 61, 0.4)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              className="cat-btn-comp"
            >
              Register for Competitive Run <ArrowRight size={17} strokeWidth={2.8} />
            </Link>
          </div>

        </div>

      </div>

      <style jsx>{`
        .categories-section {
          position: relative;
          background-color: #070f26;
          background-image: url('/images/bg02.png');
          background-size: 100% auto;
          background-repeat: repeat-y;
          background-position: top center;
          padding: 100px 24px 110px;
          color: #ffffff;
          overflow: hidden;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          font-family: var(--font-geist-sans), Inter, system-ui, sans-serif;
        }

        .categories-container {
          max-width: 1140px;
          margin: 0 auto;
          position: relative;
          z-index: 5;
        }

        .cat-header {
          text-align: center;
          margin-bottom: 50px;
        }

        .cat-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #C8FF3D;
          color: #070f26;
          padding: 6px 18px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 18px;
          transform: rotate(-1.5deg);
          box-shadow: 0 6px 20px rgba(200, 255, 61, 0.25);
        }

        .cat-title {
          font-family: var(--font-heading), var(--font-geist-sans), Inter, sans-serif;
          font-size: clamp(2.2rem, 5vw, 3.8rem);
          font-weight: 900;
          color: #ffffff;
          letter-spacing: 0.02em;
          line-height: 1.05;
          text-transform: uppercase;
          margin: 0 0 16px 0;
        }

        .highlight {
          color: #C8FF3D;
        }

        .cat-subtitle {
          font-size: clamp(1rem, 1.4vw, 1.15rem);
          color: rgba(255, 255, 255, 0.75);
          max-width: 660px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* Prize Banner */
        .prize-banner {
          position: relative;
          background: linear-gradient(135deg, #12318B 0%, #0a1c54 100%);
          border: 2px solid #C8FF3D;
          border-radius: 24px;
          padding: clamp(24px, 4vw, 36px);
          margin-bottom: 50px;
          box-shadow: 0 16px 40px rgba(18, 49, 139, 0.35);
        }

        .prize-banner-top {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .prize-trophy-badge {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: #C8FF3D;
          color: #070f26;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 6px 20px rgba(200, 255, 61, 0.35);
        }

        .prize-tag {
          font-size: 11.5px;
          font-weight: 900;
          letter-spacing: 0.15em;
          color: #C8FF3D;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .prize-amount {
          font-size: clamp(1.6rem, 3.5vw, 2.4rem);
          font-weight: 900;
          letter-spacing: 0.02em;
          color: #ffffff;
          line-height: 1.1;
          margin: 0;
        }

        .prize-split-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }

        .prize-podium-card {
          background: rgba(7, 15, 38, 0.75);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 18px;
          padding: 20px 22px;
        }

        .podium-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          gap: 10px;
          flex-wrap: wrap;
        }

        .podium-gender {
          font-size: 15px;
          font-weight: 800;
          color: #ffffff;
        }

        .podium-badge {
          font-size: 10px;
          font-weight: 900;
          background: rgba(200, 255, 61, 0.18);
          color: #C8FF3D;
          padding: 4px 10px;
          border-radius: 6px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .podium-ranks {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .rank-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 10px 16px;
        }

        .rank-item.first {
          border: 1px solid rgba(200, 255, 61, 0.3);
          background: rgba(200, 255, 61, 0.08);
        }

        .rank-medal {
          font-size: 14px;
          font-weight: 700;
          color: #ffffff;
        }

        .rank-cash {
          font-size: 18px;
          font-weight: 900;
          color: #C8FF3D;
        }

        /* Categories Grid */
        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 30px;
          align-items: stretch;
        }

        .cat-card {
          background: rgba(15, 27, 66, 0.65);
          backdrop-filter: blur(16px);
          border: 1.5px solid rgba(255, 255, 255, 0.12);
          border-radius: 26px;
          padding: 38px 32px 34px;
          display: flex;
          flex-direction: column;
          position: relative;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .cat-card:hover {
          transform: translateY(-4px);
        }

        .competitive-card {
          border: 2px solid #C8FF3D;
          background: rgba(18, 49, 139, 0.55);
          box-shadow: 0 16px 45px rgba(18, 49, 139, 0.4);
        }

        .featured-badge {
          position: absolute;
          top: -14px;
          right: 24px;
          background: #C8FF3D;
          color: #070f26;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 6px 16px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 4px 16px rgba(200, 255, 61, 0.4);
        }

        .card-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .cat-type-tag {
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.7);
        }

        .competitive-tag {
          color: #C8FF3D;
        }

        .age-tag {
          font-size: 11.5px;
          font-weight: 800;
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          padding: 4px 10px;
          border-radius: 999px;
        }

        .competitive-age {
          background: rgba(200, 255, 61, 0.15);
          color: #C8FF3D;
          border: 1px solid rgba(200, 255, 61, 0.3);
        }

        .cat-card-title {
          font-size: 1.85rem;
          font-weight: 900;
          color: #ffffff;
          margin: 0 0 10px 0;
          text-transform: uppercase;
          letter-spacing: 0.01em;
        }

        .cat-card-desc {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.75);
          line-height: 1.55;
          margin-bottom: 22px;
        }

        .advantage-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(200, 255, 61, 0.12);
          border: 1px dashed rgba(200, 255, 61, 0.4);
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 13px;
          color: #ffffff;
          margin-bottom: 22px;
        }

        /* Clean Modern Pricing Typography */
        .price-tag-wrap {
          display: flex;
          align-items: baseline;
          gap: 4px;
          margin-bottom: 26px;
          padding-bottom: 22px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          font-family: var(--font-heading), var(--font-geist-sans), Inter, sans-serif;
        }

        .currency {
          font-size: 1.8rem;
          font-weight: 900;
          color: #ffffff;
          line-height: 1;
        }

        .price-val {
          font-size: 3.4rem;
          font-weight: 900;
          color: #ffffff;
          line-height: 1;
          letter-spacing: -0.02em;
          font-variant-numeric: tabular-nums;
        }

        .lime-currency, .lime-val {
          color: #C8FF3D;
        }

        .price-term {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 600;
          font-family: var(--font-geist-sans), Inter, sans-serif;
          margin-left: 6px;
        }

        .perks-list {
          display: flex;
          flex-direction: column;
          gap: 13px;
          margin-bottom: 32px;
          flex-grow: 1;
        }

        .perk-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.88);
        }

        .perk-icon {
          color: rgba(255, 255, 255, 0.6);
          flex-shrink: 0;
        }

        .lime-icon {
          color: #C8FF3D;
        }

        .cat-btn-fun:hover {
          background-color: rgba(255, 255, 255, 0.2) !important;
          transform: translateY(-2px);
        }

        .cat-btn-comp:hover {
          background-color: #d6ff5c !important;
          box-shadow: 0 12px 32px rgba(200, 255, 61, 0.6) !important;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .categories-section {
            padding: 70px 16px 80px !important;
          }
          .prize-banner {
            padding: 24px 18px !important;
            border-radius: 18px !important;
          }
          .prize-banner-top {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .prize-amount {
            font-size: 1.8rem !important;
          }
          .cat-card {
            padding: 28px 20px !important;
            border-radius: 20px !important;
          }
          .categories-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .prize-split-grid {
            grid-template-columns: 1fr !important;
            gap: 14px !important;
          }
          .rank-item {
            padding: 10px 12px !important;
          }
        }
      `}</style>
    </section>
  );
}