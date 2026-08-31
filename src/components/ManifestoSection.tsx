'use client';

import Image from 'next/image';

export default function ManifestoSection() {
  return (
    <section
      style={{
        position: 'relative',
        background: '#ffffff',
        padding: '100px 24px 110px',
        overflow: 'hidden',
      }}
    >
      <div
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
          style={{
            maxWidth: '880px',
            textAlign: 'center',
            position: 'relative',
            zIndex: 2,
            padding: '0 20px',
          }}
        >
          <p
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
            {/* Running isn’t only about distance or speed. It’s about movement,
            balance, and feeling alive. Our community brings together people who
            believe every step is part of something bigger. */}
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Perspiciatis beatae quam vel aut dolore debitis blanditiis ipsa! Culpa ullam optio id, nam, nihil 
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
          .manifesto-card-left,
          .manifesto-card-right {
            position: relative !important;
            top: auto !important;
            left: auto !important;
            right: auto !important;
            transform: none !important;
            margin: 0 auto;
          }
        }
      `}</style>
    </section>
  );
}
