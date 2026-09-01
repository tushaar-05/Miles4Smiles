'use client';

import { Clock, Flame, Flag, Music, Mic, UserCheck, Award, Heart, Sparkles, Zap, ShieldCheck, Ticket, ChevronRight } from 'lucide-react';

const SCHEDULE = [
  {
    step: '01',
    time: '05:30 AM',
    title: 'Reporting & Check-In',
    sub: 'BIB COLLECTION & RUNNER ASSEMBLY',
    desc: 'Gates open! Collect your running bib, meet fellow runners & assemble at the start arena.',
    icon: UserCheck,
    badge: 'START ARENA',
    color: '#38bdf8',
    isFeatured: false,
    isSpecial: false,
  },
  {
    step: '02',
    time: '06:00 - 06:10 AM',
    title: 'Welcome & Dignitaries Intro',
    sub: 'CHARITY INSPIRATION & OPENING ADDRESS',
    desc: 'Opening address introducing chief guests, dignitaries & dedicating our run to children in need.',
    icon: Mic,
    badge: 'MAIN STAGE',
    color: '#c084fc',
    isFeatured: false,
    isSpecial: false,
  },
  {
    step: '03',
    time: '06:10 - 06:25 AM',
    title: 'Zumba & Jives Party Warm-Up',
    sub: 'HIGH ENERGY MUSIC & MOVEMENT',
    desc: 'Pumping beats & energetic Zumba routines led by top trainers to ignite your muscles!',
    icon: Music,
    badge: 'WARM-UP ZONE',
    color: '#fb7185',
    isFeatured: false,
    isSpecial: false,
  },
  {
    step: '04',
    time: '06:25 - 06:30 AM',
    title: 'Torch Bearing Ceremony',
    sub: 'LIGHTING THE FLAME OF HOPE & UNITY',
    desc: 'Symbolic flame lighting ceremony inspiring hope, unity, and community spirit across all runners.',
    icon: Flame,
    badge: 'SPECIAL CEREMONY',
    color: '#f97316',
    isFeatured: false,
    isSpecial: true,
  },
  {
    step: '05',
    time: '06:30 AM',
    title: 'FLAG OFF — 5K RACE STARTS!',
    sub: 'THE BIG MOMENT · RUN FOR SMILES',
    desc: 'The official horn sounds! 400+ runners step onto the track together. Run, jog, or walk for a cause!',
    icon: Flag,
    badge: 'MAIN EVENT',
    color: '#C8FF3D',
    isFeatured: true,
    isSpecial: false,
  },
  {
    step: '06',
    time: '08:00 AM',
    title: 'Podium & Celebration Wrap-Up',
    sub: 'FINISHER MEDALS, PHOTOS & REFRESHMENTS',
    desc: 'Cross the finish line to celebrate your finish, capture photos & applaud podium awards!',
    icon: Award,
    badge: 'FINISH LINE',
    color: '#34d399',
    isFeatured: false,
    isSpecial: false,
  },
];

export default function RaceOverviewSection() {
  return (
    <section
      id="schedule"
      style={{
        position: 'relative',
        background: '#070f26',
        backgroundImage: "url('/images/bg02.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#ffffff',
        padding: '100px 24px 110px',
        overflow: 'hidden',
      }}
    >
      {/* Background Radial Ambient Lights */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(18, 49, 139, 0.7) 0%, rgba(7, 15, 38, 0) 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '5%',
          right: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(200, 255, 61, 0.15) 0%, rgba(7, 15, 38, 0) 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1180px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        
        {/* ─── SECTION HEADER ─── */}
        <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 75px' }}>
          
          {/* Tilted Header Tag */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#C8FF3D',
              color: '#070f26',
              padding: '7px 20px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 900,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '20px',
              transform: 'rotate(-1.5deg)',
              boxShadow: '0 6px 20px rgba(200, 255, 61, 0.25)',
            }}
          >
            <Zap size={14} fill="#070f26" /> OFFICIAL EVENT TIMELINE
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-geist-sans), Inter, sans-serif',
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              fontWeight: 900,
              letterSpacing: '0.04em',
              lineHeight: 1.1,
              textTransform: 'uppercase',
              margin: '0 0 20px 0',
            }}
          >
            <span style={{ color: '#ffffff', textShadow: '0 4px 20px rgba(0,0,0,0.6)' }}>RACE DAY </span>
            <span
              style={{
                display: 'inline-block',
                background: '#C8FF3D',
                color: '#070f26',
                padding: '2px 18px',
                borderRadius: '14px',
                transform: 'rotate(-2deg)',
                boxShadow: '0 8px 25px rgba(200, 255, 61, 0.35)',
              }}
            >
              FLOW
            </span>
          </h2>

          <p
            style={{
              fontSize: 'clamp(1rem, 1.6vw, 1.15rem)',
              color: 'rgba(255, 255, 255, 0.8)',
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Experience every electric moment of race morning — from bib check-in and high-octane Zumba warm-ups to the torch ceremony and 6:30 AM flag off!
          </p>
        </div>

        {/* ─── UNIQUE EVENT ROADMAP TRACK ─── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            position: 'relative',
          }}
        >
          {SCHEDULE.map((item, index) => {
            const Icon = item.icon;
            const isFeatured = item.isFeatured;
            const isSpecial = item.isSpecial;

            /* Render FEATURED CARD for 6:30 AM Flag Off */
            if (isFeatured) {
              return (
                <div
                  key={index}
                  className="featured-race-card"
                  style={{
                    position: 'relative',
                    background: 'linear-gradient(135deg, #C8FF3D 0%, #a6df15 100%)',
                    color: '#070f26',
                    borderRadius: '24px',
                    padding: '36px 36px 36px 40px',
                    boxShadow: '0 25px 60px rgba(200, 255, 61, 0.35)',
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr auto',
                    alignItems: 'center',
                    gap: '32px',
                    overflow: 'hidden',
                    border: '3px solid #ffffff',
                    margin: '12px 0',
                  }}
                >
                  {/* Watermark Big Digits */}
                  <div
                    style={{
                      position: 'absolute',
                      right: '120px',
                      bottom: '-20px',
                      fontSize: '160px',
                      fontWeight: 900,
                      color: 'rgba(7, 15, 38, 0.06)',
                      pointerEvents: 'none',
                      lineHeight: 1,
                      userSelect: 'none',
                    }}
                  >
                    05
                  </div>

                  {/* Left Column: Big Time Badge */}
                  <div
                    style={{
                      background: '#070f26',
                      color: '#C8FF3D',
                      borderRadius: '20px',
                      padding: '20px 24px',
                      textAlign: 'center',
                      minWidth: '150px',
                      boxShadow: '0 10px 30px rgba(7, 15, 38, 0.3)',
                    }}
                  >
                    <div style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: '4px' }}>
                      STEP {item.step}
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '0.02em', lineHeight: 1 }}>
                      {item.time}
                    </div>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#C8FF3D', marginTop: '6px', letterSpacing: '0.1em' }}>
                      ★ MAIN RACE
                    </div>
                  </div>

                  {/* Center Column: Details */}
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'rgba(7, 15, 38, 0.12)',
                        color: '#070f26',
                        padding: '4px 14px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 900,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        marginBottom: '10px',
                      }}
                    >
                      <Sparkles size={13} /> {item.sub}
                    </div>

                    <h3
                      style={{
                        fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                        fontWeight: 900,
                        color: '#070f26',
                        letterSpacing: '-0.02em',
                        lineHeight: 1.15,
                        margin: '0 0 10px 0',
                        textTransform: 'uppercase',
                      }}
                    >
                      {item.title}
                    </h3>

                    <p
                      style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: 'rgba(7, 15, 38, 0.85)',
                        lineHeight: 1.5,
                        margin: 0,
                        maxWidth: '560px',
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>

                  {/* Right Column: Icon & Action */}
                  <div className="schedule-icon-col" style={{ textAlign: 'right', position: 'relative', zIndex: 2 }}>
                    <div
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '20px',
                        background: '#070f26',
                        color: '#C8FF3D',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 10px 30px rgba(7, 15, 38, 0.3)',
                      }}
                    >
                      <Flag size={30} />
                    </div>
                  </div>
                </div>
              );
            }

            /* Render SPECIAL CARD for 6:25 AM Torch Ceremony */
            if (isSpecial) {
              return (
                <div
                  key={index}
                  className="special-race-card"
                  style={{
                    position: 'relative',
                    background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(15, 27, 66, 0.8) 100%)',
                    backdropFilter: 'blur(16px)',
                    borderRadius: '24px',
                    padding: '28px 32px',
                    border: '2px solid rgba(249, 115, 22, 0.6)',
                    boxShadow: '0 16px 40px rgba(249, 115, 22, 0.15)',
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr auto',
                    alignItems: 'center',
                    gap: '28px',
                    overflow: 'hidden',
                  }}
                >
                  {/* Watermark Big Digits */}
                  <div
                    style={{
                      position: 'absolute',
                      right: '120px',
                      bottom: '-20px',
                      fontSize: '150px',
                      fontWeight: 900,
                      color: 'rgba(249, 115, 22, 0.08)',
                      pointerEvents: 'none',
                      lineHeight: 1,
                      userSelect: 'none',
                      zIndex: 1,
                    }}
                  >
                    {item.step}
                  </div>

                  <div
                    style={{
                      position: 'relative',
                      zIndex: 2,
                      background: 'rgba(249, 115, 22, 0.2)',
                      border: '1px solid rgba(249, 115, 22, 0.5)',
                      color: '#f97316',
                      borderRadius: '16px',
                      padding: '16px 20px',
                      textAlign: 'center',
                      minWidth: '140px',
                    }}
                  >
                    <div style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>
                      STEP {item.step}
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 900, color: '#ffffff', marginTop: '2px' }}>
                      {item.time}
                    </div>
                  </div>

                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '0.12em', color: '#f97316', textTransform: 'uppercase', marginBottom: '6px' }}>
                      🔥 {item.sub}
                    </div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', margin: '0 0 6px 0' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '0.94rem', color: 'rgba(255,255,255,0.75)', margin: 0 }}>
                      {item.desc}
                    </p>
                  </div>

                  <div
                    className="schedule-icon-col"
                    style={{
                      position: 'relative',
                      zIndex: 2,
                      width: '52px',
                      height: '52px',
                      borderRadius: '16px',
                      background: 'rgba(249, 115, 22, 0.2)',
                      border: '1px solid rgba(249, 115, 22, 0.5)',
                      color: '#f97316',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Flame size={26} />
                  </div>
                </div>
              );
            }

            /* Render REGULAR ATHLETIC ROW CARDS */
            return (
              <div
                key={index}
                className="roadmap-row-card"
                style={{
                  position: 'relative',
                  background: 'rgba(15, 27, 66, 0.65)',
                  backdropFilter: 'blur(16px)',
                  borderRadius: '22px',
                  padding: '24px 30px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.25)',
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr auto',
                  alignItems: 'center',
                  gap: '24px',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  overflow: 'hidden',
                }}
              >
                {/* Watermark Big Digits */}
                <div
                  style={{
                    position: 'absolute',
                    right: '110px',
                    bottom: '-20px',
                    fontSize: '140px',
                    fontWeight: 900,
                    color: 'rgba(255, 255, 255, 0.05)',
                    pointerEvents: 'none',
                    lineHeight: 1,
                    userSelect: 'none',
                    zIndex: 1,
                  }}
                >
                  {item.step}
                </div>

                {/* Step Number & Time Badge */}
                <div
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '14px 18px',
                    textAlign: 'center',
                    minWidth: '130px',
                  }}
                >
                  <div style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '0.12em', color: item.color, textTransform: 'uppercase' }}>
                    STEP {item.step}
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
                    {item.time}
                  </div>
                </div>

                {/* Content */}
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '0.12em', color: item.color, textTransform: 'uppercase', marginBottom: '4px' }}>
                    ✦ {item.sub}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: '0 0 6px 0' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.5 }}>
                    {item.desc}
                  </p>
                </div>

                {/* Icon */}
                <div
                  className="schedule-icon-col"
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    width: '46px',
                    height: '46px',
                    borderRadius: '14px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: item.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={22} />
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── CHARITY & WRAP UP BANNER ─── */}
        <div
          className="wrapup-banner"
          style={{
            marginTop: '65px',
            background: 'linear-gradient(135deg, rgba(18, 49, 139, 0.85) 0%, rgba(7, 15, 38, 0.95) 100%)',
            border: '2px solid rgba(200, 255, 61, 0.35)',
            borderRadius: '24px',
            padding: '28px 36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
          }}
        >
          <div className="wrapup-left" style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div
              className="wrapup-icon-box"
              style={{
                width: '52px',
                height: '52px',
                minWidth: '52px',
                maxWidth: '52px',
                flexShrink: 0,
                borderRadius: '16px',
                background: 'rgba(200, 255, 61, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1.5px solid rgba(200, 255, 61, 0.4)',
              }}
            >
              <Heart size={26} color="#C8FF3D" fill="#C8FF3D" style={{ flexShrink: 0 }} />
            </div>
            <div>
              <div className="wrapup-title" style={{ fontSize: '17px', fontWeight: 800, color: '#ffffff', marginBottom: '4px', lineHeight: 1.3 }}>
                Full Event Wrap Up & Venue Clearance by 8:00 AM
              </div>
              <div className="wrapup-desc" style={{ fontSize: '13.5px', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.5 }}>
                100% of registration proceeds support Miles for Smiles charity initiatives.
              </div>
            </div>
          </div>

          <div
            className="wrapup-badge"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: '#C8FF3D',
              color: '#070f26',
              padding: '13px 24px',
              borderRadius: '14px',
              fontSize: '13px',
              fontWeight: 900,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              boxShadow: '0 8px 24px rgba(200, 255, 61, 0.3)',
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
          >
            <ShieldCheck size={18} /> Reporting: 5:30 AM Sharp
          </div>
        </div>

      </div>

      <style jsx>{`
        .roadmap-row-card:hover,
        .special-race-card:hover,
        .featured-race-card:hover {
          transform: translateX(6px);
        }
        @media (max-width: 768px) {
          .schedule-icon-col {
            display: none !important;
          }
          .featured-race-card,
          .special-race-card,
          .roadmap-row-card {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
            padding: 22px 18px !important;
            border-radius: 18px !important;
          }
          .featured-race-card > div:first-child,
          .special-race-card > div:first-child,
          .roadmap-row-card > div:first-child {
            min-width: 100% !important;
            text-align: left !important;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .wrapup-banner {
            flex-direction: column !important;
            align-items: stretch !important;
            padding: 22px 18px !important;
            margin-top: 40px !important;
            border-radius: 18px !important;
            gap: 16px !important;
          }
          .wrapup-left {
            align-items: flex-start !important;
            gap: 14px !important;
          }
          .wrapup-icon-box {
            width: 44px !important;
            height: 44px !important;
            min-width: 44px !important;
            max-width: 44px !important;
            border-radius: 12px !important;
            margin-top: 2px;
          }
          .wrapup-title {
            font-size: 15px !important;
            margin-bottom: 4px !important;
          }
          .wrapup-desc {
            font-size: 12.5px !important;
          }
          .wrapup-badge {
            width: 100% !important;
            padding: 12px 16px !important;
            font-size: 12px !important;
            letter-spacing: 0.06em !important;
          }
        }
      `}</style>
    </section>
  );
}
