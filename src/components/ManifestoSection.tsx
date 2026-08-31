'use client';

import Image from 'next/image';

export default function ManifestoSection() {
  return (
    <section
      id="about"
      className="manifesto-section"
      style={{
        position: 'relative',
        background: '#ffffff',
        padding: '90px 20px 100px',
        overflow: 'hidden',
      }}
    >
      <div
        className="manifesto-container"
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '380px',
        }}
      >
        {/* ─── TILTED PHOTO CARD LEFT ─── */}
        <div
          className="manifesto-card-left"
          style={{
            position: 'absolute',
            left: '0px',
            top: '50%',
            transform: 'translateY(-50%) rotate(-10deg)',
            width: 'clamp(140px, 16vw, 205px)',
            aspectRatio: '4/4.5',
            borderRadius: '22px',
            overflow: 'hidden',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.12)',
            zIndex: 1,
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <Image
            src="/images/running-shoes-track.jpg"
            alt="Runner taking steps on the track"
            fill
            sizes="(max-width: 768px) 140px, 205px"
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* ─── CENTER STATEMENT TEXT ─── */}
        <div
          className="manifesto-text-wrap"
          style={{
            maxWidth: '860px',
            textAlign: 'center',
            position: 'relative',
            zIndex: 2,
            padding: '0 24px',
          }}
        >
          <p
            className="manifesto-paragraph"
            style={{
              fontFamily: 'var(--font-geist-sans), Inter, system-ui, sans-serif',
              fontSize: 'clamp(1.25rem, 2.5vw, 2.15rem)',
              fontWeight: 500,
              lineHeight: 1.55,
              color: '#0f172a',
              letterSpacing: '-0.015em',
              margin: 0,
            }}
          >
            Running isn’t only about distance or speed. It’s about movement, empathy, and giving every child a reason to smile. Our community brings together runners from across the country to turn every kilometer into life-saving pediatric healthcare.
          </p>
        </div>

        {/* ─── TILTED PHOTO CARD RIGHT ─── */}
        <div
          className="manifesto-card-right"
          style={{
            position: 'absolute',
            right: '0px',
            top: '50%',
            transform: 'translateY(-50%) rotate(10deg)',
            width: 'clamp(140px, 16vw, 205px)',
            aspectRatio: '4/4.5',
            borderRadius: '22px',
            overflow: 'hidden',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.12)',
            zIndex: 1,
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <Image
            src="/images/runner-action.jpg"
            alt="Smiling female runner outdoors"
            fill
            sizes="(max-width: 768px) 140px, 205px"
            style={{ objectFit: 'cover' }}
          />
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 860px) {
          .manifesto-section {
            padding: 60px 16px 70px !important;
          }
          .manifesto-container {
            flex-direction: column !important;
            gap: 28px !important;
            min-height: auto !important;
          }
          .manifesto-text-wrap {
            padding: 0 8px !important;
          }
          .manifesto-paragraph {
            font-size: clamp(1.15rem, 4.5vw, 1.45rem) !important;
            line-height: 1.6 !important;
          }
          .manifesto-card-left,
          .manifesto-card-right {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
