'use client';

import React, { useState } from 'react';
import { Plus, Minus, HelpCircle, Mail, Phone, MessageCircle, Sparkles, CheckCircle2 } from 'lucide-react';

interface FAQItem {
  id: number;
  category: 'all' | 'race' | 'kit' | 'charity';
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: 1,
    category: 'kit',
    question: 'What is included in the official runner registration kit?',
    answer: 'Every registered runner receives an exclusive high-performance dry-fit event jersey, official RFID timing bib, customized finisher medal, energy drinks, healthy post-run breakfast box, and a downloadable timing e-certificate.',
  },
  {
    id: 2,
    category: 'race',
    question: 'What time should I report on race day?',
    answer: 'Reporting starts promptly at 5:30 AM. The warm-up session and Zumba jives begin at 6:10 AM, followed by the Torch Bearing ceremony at 6:25 AM. The official 5K race flag-off is at 6:30 AM sharp.',
  },
  {
    id: 3,
    category: 'kit',
    question: 'When and where can I collect my BIB and kit (Expo)?',
    answer: 'Kit distribution takes place 1 day before the race at the Main Event Holding Area between 10:00 AM and 6:00 PM. Please bring your registration confirmation email/QR code and a valid photo ID.',
  },
  {
    id: 4,
    category: 'race',
    question: 'Are there hydration and medical support stations on the route?',
    answer: 'Yes! Fully stocked hydration points with water, electrolytes, and energy drinks are set up every 1.5 KM along the 5K course. Stationed Apollo medical teams and mobile volunteer marshals are deployed throughout the track.',
  },
  {
    id: 5,
    category: 'race',
    question: 'Can beginners, walkers, and families participate?',
    answer: 'Absolutely! Miles for Smiles welcomes seasoned athletes, hobbyist runners, families, and walk-joggers of all fitness levels. You can complete the scenic 5K at your own comfortable pace.',
  },
  {
    id: 6,
    category: 'charity',
    question: 'How does my participation support children’s healthcare?',
    answer: '100% of all race registration proceeds and corporate sponsorship funds go directly to verified pediatric health programs — providing life-changing dental care, cleft surgeries, and emergency healthcare for underprivileged children.',
  },
  {
    id: 7,
    category: 'race',
    question: 'Is secure baggage counter and parking available at the venue?',
    answer: 'Yes, a free supervised baggage storage counter is available at the start arena. Dedicated event parking spots for two-wheelers and four-wheelers are provided adjacent to the venue with directional signs.',
  },
  {
    id: 8,
    category: 'charity',
    question: 'Can I volunteer or become a corporate partner?',
    answer: 'Yes! We welcome enthusiastic volunteers, student ambassadors, and corporate sponsors. Please reach out via email at setunst@gmail.com / rameezrahman17@gmail.com or call +91 91729 01968 / +91 93018 04524 to join our team.',
  },
];

export default function FaqSection() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'race' | 'kit' | 'charity'>('all');
  const [openFaq, setOpenFaq] = useState<number | null>(1);

  const filteredFaqs = activeCategory === 'all'
    ? FAQS
    : FAQS.filter(item => item.category === activeCategory);

  const toggleFaq = (id: number) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <section id="faq" className="faq-section">
      <div className="faq-container">
        
        {/* ─── HEADER ─── */}
        <div className="faq-header">
          <div className="faq-badge">
            <Sparkles size={14} /> GOT QUESTIONS?
          </div>
          
          <h2 className="faq-title">
            FREQUENTLY ASKED <span className="highlight">QUESTIONS</span>
          </h2>

          <p className="faq-subtitle">
            Everything you need to know about race day flow, registration kits, route amenities, and our charity mission.
          </p>

          {/* Category Filter Tabs */}
          <div className="faq-tabs">
            <button
              onClick={() => setActiveCategory('all')}
              className={`faq-tab ${activeCategory === 'all' ? 'active' : ''}`}
            >
              All Questions
            </button>
            <button
              onClick={() => setActiveCategory('race')}
              className={`faq-tab ${activeCategory === 'race' ? 'active' : ''}`}
            >
              Race Day & Route
            </button>
            <button
              onClick={() => setActiveCategory('kit')}
              className={`faq-tab ${activeCategory === 'kit' ? 'active' : ''}`}
            >
              BIB & Runner Kit
            </button>
            <button
              onClick={() => setActiveCategory('charity')}
              className={`faq-tab ${activeCategory === 'charity' ? 'active' : ''}`}
            >
              Charity Impact
            </button>
          </div>
        </div>

        {/* ─── ACCORDION LIST ─── */}
        <div className="faq-list">
          {filteredFaqs.map((faq) => {
            const isOpen = openFaq === faq.id;
            return (
              <div
                key={faq.id}
                className={`faq-card ${isOpen ? 'open' : ''}`}
                onClick={() => toggleFaq(faq.id)}
              >
                <div className="faq-question-row">
                  <span className="faq-question-text">{faq.question}</span>
                  <div className={`faq-icon-btn ${isOpen ? 'active' : ''}`}>
                    {isOpen ? <Minus size={18} strokeWidth={2.5} /> : <Plus size={18} strokeWidth={2.5} />}
                  </div>
                </div>

                {isOpen && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ─── STILL HAVE QUESTIONS BANNER (CENTERED) ─── */}
        <div className="faq-support-card">
          <div className="support-icon">
            <HelpCircle size={28} />
          </div>
          
          <h4 className="support-title">Still have a question?</h4>
          
          <p className="support-desc">
            Can’t find the answer you’re looking for? Reach out to Setu & Rameez on the organizing committee directly.
          </p>

          <div className="support-actions">
            <a href="mailto:setunst@gmail.com,rameezrahman17@gmail.com" className="support-btn mail-btn">
              <Mail size={16} strokeWidth={2.5} /> Email Us
            </a>
            <a href="tel:+919172901968" className="support-btn phone-btn">
              <Phone size={15} strokeWidth={2.5} /> Call +91 91729 01968
            </a>
            <a href="tel:+919301804524" className="support-btn phone-btn">
              <Phone size={15} strokeWidth={2.5} /> Call +91 93018 04524
            </a>
          </div>
        </div>

      </div>

      <style jsx>{`
        .faq-section {
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
        }

        .faq-container {
          max-width: 980px;
          margin: 0 auto;
          position: relative;
          z-index: 5;
        }

        .faq-header {
          text-align: center;
          margin-bottom: 50px;
        }

        .faq-badge {
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

        .faq-title {
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

        .faq-subtitle {
          font-size: clamp(1rem, 1.4vw, 1.12rem);
          color: rgba(255, 255, 255, 0.75);
          max-width: 620px;
          margin: 0 auto 34px;
          line-height: 1.6;
        }

        .faq-tabs {
          display: inline-flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
          background: rgba(11, 26, 74, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 6px;
          border-radius: 14px;
        }

        .faq-tab {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          padding: 8px 18px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .faq-tab:hover {
          color: #ffffff;
        }

        .faq-tab.active {
          background: #C8FF3D;
          color: #070f26;
          box-shadow: 0 4px 14px rgba(200, 255, 61, 0.25);
        }

        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 50px;
        }

        .faq-card {
          background: rgba(15, 27, 66, 0.65);
          backdrop-filter: blur(14px);
          border: 1.5px solid rgba(255, 255, 255, 0.1);
          border-radius: 18px;
          padding: 22px 26px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          user-select: none;
        }

        .faq-card:hover {
          border-color: rgba(200, 255, 61, 0.4);
          background: rgba(18, 49, 139, 0.5);
        }

        .faq-card.open {
          border-color: #C8FF3D;
          background: rgba(18, 49, 139, 0.75);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
        }

        .faq-question-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
        }

        .faq-question-text {
          font-size: clamp(1.05rem, 1.35vw, 1.2rem);
          font-weight: 800;
          color: #ffffff;
          line-height: 1.35;
        }

        .faq-icon-btn {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }

        .faq-icon-btn.active {
          background: #C8FF3D;
          color: #070f26;
        }

        .faq-answer {
          margin-top: 14px;
          padding-top: 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .faq-answer p {
          font-size: 0.98rem;
          color: rgba(255, 255, 255, 0.85);
          line-height: 1.65;
          margin: 0;
        }

        .faq-support-card {
          background: rgba(11, 26, 74, 0.8);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 24px;
          padding: 38px 32px 36px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          max-width: 840px;
          margin: 50px auto 0;
          box-shadow: 0 16px 45px rgba(0, 0, 0, 0.35);
        }

        .support-icon {
          width: 54px;
          height: 54px;
          border-radius: 16px;
          background: rgba(200, 255, 61, 0.15);
          border: 1px solid rgba(200, 255, 61, 0.3);
          color: #C8FF3D;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .support-title {
          font-size: 20px;
          font-weight: 900;
          color: #ffffff;
          margin: 0 0 8px 0;
          letter-spacing: 0.01em;
          text-transform: uppercase;
        }

        .support-desc {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.75);
          max-width: 560px;
          margin: 0 auto 24px;
          line-height: 1.6;
        }

        .support-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .support-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 9999px;
          font-size: 13.5px;
          font-weight: 900;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          text-decoration: none;
        }

        .mail-btn {
          background: #C8FF3D;
          color: #070f26;
          box-shadow: 0 6px 20px rgba(200, 255, 61, 0.35);
        }

        .phone-btn {
          background: #ffffff;
          color: #070f26;
          box-shadow: 0 6px 20px rgba(255, 255, 255, 0.15);
        }

        @media (max-width: 768px) {
          .faq-section {
            padding: 70px 16px 80px !important;
          }
          .faq-tabs {
            overflow-x: auto;
            flex-wrap: nowrap !important;
            justify-content: flex-start !important;
            padding-bottom: 8px;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .faq-tabs::-webkit-scrollbar {
            display: none;
          }
          .faq-tab {
            flex-shrink: 0;
            padding: 8px 16px !important;
            font-size: 12px !important;
          }
          .faq-card {
            padding: 18px 18px !important;
            border-radius: 14px !important;
          }
          .faq-support-card {
            padding: 30px 18px !important;
            border-radius: 18px !important;
            margin-top: 36px !important;
          }
          .support-actions {
            flex-direction: column;
            width: 100%;
            gap: 10px;
          }
          .support-btn {
            width: 100%;
            padding: 13px 20px !important;
          }
        }
      `}</style>
    </section>
  );
}
