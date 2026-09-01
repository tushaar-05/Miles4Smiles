'use client';

import Image from 'next/image';

export default function RouteSection() {
  return (
    <section
      id="route"
      className="route-section"
      style={{
        position: 'relative',
        background: '#001A5A',
        padding: '90px 24px 100px',
        overflow: 'hidden',
        color: '#ffffff',
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 5,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.35fr 0.65fr',
            alignItems: 'center',
            gap: 'clamp(32px, 5vw, 60px)',
          }}
          className="route-grid"
        >
          {/* ─── LEFT: MAP IMAGE (16:9 WIDESCREEN) ─── */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', maxWidth: '840px' }}>
              <Image
                src="/images/newRoute.png"
                alt="Miles for Smiles Running Tracks Map"
                fill
                sizes="(max-width: 768px) 100vw, 65vw"
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
          </div>

          {/* ─── RIGHT: EDITORIAL RUNNING TRACKS ─── */}
          <div style={{ paddingLeft: 'clamp(0px, 2vw, 20px)' }}>
            {/* Giant Heading */}
            <h2
              style={{
                fontFamily: 'var(--font-heading), var(--font-geist-sans), Impact, Inter, sans-serif',
                fontSize: 'clamp(2.6rem, 6.5vw, 5.2rem)',
                fontWeight: 900,
                color: '#ffffff',
                letterSpacing: '0.02em',
                lineHeight: 0.92,
                textTransform: 'uppercase',
                margin: '0 0 24px 0',
                textShadow: '0 4px 24px rgba(0, 0, 0, 0.4)',
              }}
            >
              RUNNING<br />
              TRACKS
            </h2>

            {/* Paragraph 1 */}
            <p
              style={{
                fontSize: 'clamp(1rem, 1.45vw, 1.18rem)',
                color: 'rgba(255, 255, 255, 0.9)',
                lineHeight: 1.65,
                margin: '0 0 20px 0',
                fontWeight: 400,
              }}
            >
              The route begins at Club Charholi and heads along DY Patil University Road to the 2.5 KM turnaround, before returning to the shared finish line.
            </p>

            {/* Paragraph 2 */}
            <p
              style={{
                fontSize: 'clamp(0.96rem, 1.35vw, 1.12rem)',
                color: 'rgba(255, 255, 255, 0.82)',
                lineHeight: 1.65,
                margin: 0,
                fontWeight: 400,
              }}
            >
              <strong style={{ color: '#ffffff', fontWeight: 800 }}>
                Hydration stations
              </strong>{' '}
              along the route keep runners refreshed and supported throughout the run.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .route-section {
            padding: 60px 16px 70px !important;
          }
          .route-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
            text-align: center;
          }
          .route-grid > div:last-child {
            padding-left: 0 !important;
            max-width: 600px;
            margin: 0 auto;
          }
        }
      `}</style>
    </section>
  );
}
