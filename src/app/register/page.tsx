'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Check,
  Flag,
  User,
  Ruler,
  Mail,
  ShieldCheck,
  PartyPopper,
} from 'lucide-react';

/* ─── Dropdown Options ─── */
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
const MONTHS = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];
const YEARS = Array.from({ length: 75 }, (_, i) => String(2018 - i));

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const TSHIRT_SIZES = [
  { code: 'XS', label: 'XS (34")' },
  { code: 'S', label: 'S (36")' },
  { code: 'M', label: 'M (38")' },
  { code: 'L', label: 'L (40")' },
  { code: 'XL', label: 'XL (42")' },
  { code: 'XXL', label: 'XXL (44")' },
];

export default function RegisterPage() {
  /* Category Selection */
  const [category, setCategory] = useState<'competitive' | 'non-competitive'>('competitive');

  /* Form State */
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'Male',
    bloodGroup: 'O+',
    weight: '',
    height: '',
    tShirtSize: 'M',
    dobDay: '15',
    dobMonth: '05',
    dobYear: '2000',
    email: '',
    phone: '',
    city: '',
    emergencyName: '',
    emergencyPhone: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bibNumber, setBibNumber] = useState('');

  const price = category === 'competitive' ? 249 : 149;

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const generatedBib = 'BIB-' + Math.floor(1000 + Math.random() * 9000);
      setBibNumber(generatedBib);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <div className="page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800&display=swap');

        .page {
          --navy: #0b1a4a;
          --navy-2: #12318b;
          --paper: #f3f2ec;
          --lime: #c8ff3d;
          --ink: #10182c;
          --slate: #5c6785;
          --line: #dfe3ed;
          --flare: #ff5f4d;
          min-height: 100vh;
          background: var(--paper);
          color: var(--ink);
          font-family: 'Inter', system-ui, sans-serif;
        }
        .page * { box-sizing: border-box; }
        .display { font-family: 'Bebas Neue', 'Inter', sans-serif; letter-spacing: 0.02em; }
        .tabular { font-variant-numeric: tabular-nums; }

        .page a:focus-visible,
        .page button:focus-visible,
        .page input:focus-visible,
        .page select:focus-visible,
        .page [tabindex]:focus-visible {
          outline: 2px solid var(--navy-2);
          outline-offset: 2px;
        }

        /* Hero */
        .hero {
          position: relative;
          background-image: url('/images/BG.png');
          background-size: cover;
          background-position: center;
          background-color: var(--navy-2);
          padding: 22px 20px 84px;
          color: #fff;
        }
        .hero::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(11, 26, 74, 0.35) 0%, rgba(11, 26, 74, 0.75) 100%);
          pointer-events: none;
        }
        .hero-inner { max-width: 1100px; margin: 0 auto; position: relative; z-index: 1; }
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: rgba(255, 255, 255, 0.92);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          background: rgba(255, 255, 255, 0.12);
          padding: 8px 16px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          transition: background 0.15s ease;
        }
        .back-link:hover { background: rgba(255, 255, 255, 0.2); }

        .tag-row { display: flex; align-items: center; justify-content: center; gap: 18px; flex-wrap: wrap; margin: 28px 0 18px; }
        .tag-pill {
          background: rgba(11, 26, 74, 0.55);
          border: 1px solid rgba(200, 255, 61, 0.35);
          color: var(--lime);
          padding: 7px 16px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.06em;
        }
        .hero-title {
          text-align: center;
          font-size: clamp(2.2rem, 6vw, 3.6rem);
          line-height: 0.95;
          color: #fff;
        }
        .hero-sub {
          text-align: center;
          color: rgba(255, 255, 255, 0.75);
          font-size: 14px;
          margin-top: 10px;
        }

        /* Main card */
        .shell { max-width: 840px; margin: -46px auto 60px; padding: 0 16px; position: relative; z-index: 5; }
        .card {
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(11, 26, 74, 0.16);
        }
        .form-pad { padding: 36px 30px 30px; }

        .intro { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid var(--line); }
        .intro h2 { font-size: 24px; font-weight: 800; color: var(--navy); margin: 0; }
        .intro p { color: var(--slate); font-size: 13px; margin: 4px 0 0; }
        .req-note { font-size: 12px; color: var(--slate); white-space: nowrap; }
        .req-note b { color: var(--flare); font-weight: 700; }

        /* Checkpoint route rail */
        .route { display: flex; flex-direction: column; }
        .checkpoint { display: grid; grid-template-columns: 40px 1fr; column-gap: 18px; }
        .checkpoint + .checkpoint { margin-top: 6px; }
        .marker-col { position: relative; display: flex; justify-content: center; }
        .marker-col::before {
          content: '';
          position: absolute;
          top: 40px;
          bottom: -26px;
          left: 50%;
          width: 2px;
          transform: translateX(-50%);
          background-image: linear-gradient(var(--line) 60%, transparent 0%);
          background-position: left;
          background-size: 2px 8px;
          background-repeat: repeat-y;
        }
        .checkpoint:last-of-type .marker-col::before { display: none; }
        .marker {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #fff;
          border: 2px solid var(--navy-2);
          color: var(--navy-2);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
          flex-shrink: 0;
        }
        .checkpoint-body { padding-bottom: 30px; }
        .checkpoint-head { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; padding-top: 8px; }
        .checkpoint-head .km { font-size: 11px; font-weight: 700; color: var(--slate); }
        .checkpoint-head h3 { font-size: 15px; font-weight: 800; color: var(--ink); margin: 0; }

        .field-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 14px; }
        .field-grid + .field-grid { margin-top: 14px; }
        .field label { display: block; font-size: 12.5px; font-weight: 600; color: var(--slate); margin-bottom: 6px; }
        .field label .opt { color: #a7b0c3; font-weight: 400; }
        .field label .star { color: var(--flare); }
        .field input, .field select {
          width: 100%;
          padding: 11px 13px;
          border-radius: 9px;
          border: 1.5px solid var(--line);
          font-size: 14px;
          font-family: inherit;
          color: var(--ink);
          background: #fff;
          transition: border-color 0.15s ease;
        }
        .field input::placeholder { color: #b4bbcb; }
        .field input:hover, .field select:hover { border-color: #b9c2d8; }
        .field input:focus, .field select:focus { border-color: var(--navy-2); outline: none; }
        .dob-grid { display: grid; grid-template-columns: 0.8fr 1.3fr 0.8fr; gap: 6px; }
        .dob-grid select { padding: 11px 6px; font-size: 13px; }

        .emergency-box { background: var(--paper); border: 1px solid var(--line); border-radius: 12px; padding: 16px; }
        .emergency-title { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; color: var(--navy); margin-bottom: 12px; }

        /* Category cards */
        .cat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: 14px; }
        .cat-card {
          position: relative;
          border-radius: 16px;
          padding: 22px;
          cursor: pointer;
          border: 1.5px solid var(--line);
          background: #fff;
          transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease;
        }
        .cat-card:hover { transform: translateY(-1px); }
        .cat-card.active {
          border-color: var(--navy-2);
          background: var(--navy);
          color: #fff;
          box-shadow: 0 14px 34px rgba(11, 26, 74, 0.28);
        }
        .cat-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
        .cat-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; color: var(--slate); }
        .cat-card.active .cat-badge { color: var(--lime); }
        .cat-radio {
          width: 22px; height: 22px; border-radius: 50%;
          border: 2px solid var(--line);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .cat-card.active .cat-radio { border-color: var(--lime); background: var(--lime); }
        .cat-title { font-size: 22px; font-weight: 800; margin: 0 0 4px; color: var(--navy); }
        .cat-card.active .cat-title { color: #fff; }
        .cat-price { font-size: 30px; font-weight: 900; color: var(--navy-2); margin-bottom: 14px; }
        .cat-price .display { font-size: 30px; }
        .cat-card.active .cat-price { color: var(--lime); }
        .cat-price small { font-size: 14px; font-weight: 600; opacity: 0.7; }
        .cat-note { font-size: 13px; line-height: 1.5; color: var(--slate); background: var(--paper); border-radius: 10px; padding: 12px 14px; }
        .cat-card.active .cat-note { color: rgba(255, 255, 255, 0.85); background: rgba(255, 255, 255, 0.08); }

        /* Finish line panel */
        .finish {
          margin-top: 8px;
          border-radius: 16px;
          overflow: hidden;
          background: var(--navy);
          color: #fff;
        }
        .finish-flag {
          height: 8px;
          background-image: repeating-linear-gradient(45deg, #fff 0 8px, transparent 8px 16px);
          background-size: 16px 8px;
          opacity: 0.85;
        }
        .finish-body { padding: 22px 24px; display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap; }
        .finish-label { font-size: 12px; font-weight: 600; color: rgba(255, 255, 255, 0.65); }
        .finish-price { font-size: 34px; font-weight: 900; color: var(--lime); line-height: 1; margin: 4px 0 6px; }
        .finish-sub { font-size: 12.5px; color: rgba(255, 255, 255, 0.7); }
        .finish-cta {
          background: var(--lime);
          color: var(--navy);
          border: none;
          border-radius: 999px;
          padding: 16px 34px;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.02em;
          cursor: pointer;
          box-shadow: 0 10px 24px rgba(200, 255, 61, 0.25);
          transition: transform 0.1s ease, box-shadow 0.15s ease;
        }
        .finish-cta:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 14px 30px rgba(200, 255, 61, 0.32); }
        .finish-cta:disabled { cursor: wait; opacity: 0.8; }

        /* Success state */
        .success { background: #fff; border-radius: 20px; padding: 44px 32px; box-shadow: 0 20px 60px rgba(11, 26, 74, 0.16); text-align: center; }
        .success-icon { width: 68px; height: 68px; background: var(--lime); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
        .success h2 { font-size: 30px; color: var(--navy); margin: 0 0 8px; }
        .success > p { color: var(--slate); font-size: 15px; margin-bottom: 26px; }
        .ticket { position: relative; background: var(--paper); border-radius: 16px; padding: 22px; margin-bottom: 30px; text-align: left; overflow: hidden; }
        .ticket::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 6px; background-image: repeating-linear-gradient(45deg, var(--navy) 0 8px, var(--lime) 8px 16px); }
        .ticket-top { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed var(--line); padding: 14px 0 14px; margin-bottom: 16px; }
        .bib-label { font-size: 11px; color: var(--slate); font-weight: 600; }
        .bib-num { font-size: 26px; font-weight: 900; color: var(--navy); }
        .paid-chip { background: var(--navy); color: var(--lime); padding: 6px 14px; border-radius: 999px; font-size: 12px; font-weight: 700; }
        .ticket-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; }
        .ticket-grid span { font-size: 11px; color: var(--slate); }
        .ticket-grid div { font-weight: 700; color: var(--ink); margin-top: 2px; }
        .home-btn { display: inline-block; background: var(--navy); color: #fff; padding: 14px 30px; border-radius: 999px; font-weight: 700; font-size: 14px; text-decoration: none; }

        @media (max-width: 620px) {
          .checkpoint { grid-template-columns: 1fr; }
          .marker-col { display: none; }
          .checkpoint-body { padding-bottom: 24px; }
        }
      `}</style>

      {/* ══════════════ HERO ══════════════ */}
      <header className="hero">
        <div className="hero-inner">
          <Link href="/" className="back-link">
            <ArrowLeft size={16} /> Back to Home
          </Link>

          <div className="tag-row">
            <span className="tag-pill">#MILESFORSMILES</span>
            <Link href="/" style={{ display: 'inline-block', lineHeight: 0 }}>
              <Image
                src="/images/logo.png"
                alt="Miles for Smiles Logo"
                width={240}
                height={60}
                style={{ height: '54px', width: 'auto', objectFit: 'contain' }}
                priority
              />
            </Link>
            <span className="tag-pill">#RUNFORCHARITY</span>
          </div>

          <h1 className="hero-title display">5K Charity Run — Registration</h1>
          <p className="hero-sub">Five checkpoints stand between you and your bib number.</p>
        </div>
      </header>

      {/* ══════════════ MAIN ══════════════ */}
      <main className="shell">
        {isSubmitted ? (
          <div className="success">
            <div className="success-icon">
              <Check size={34} color="#0b1a4a" strokeWidth={3} />
            </div>
            <h2 className="display">Registration confirmed</h2>
            <p>Thanks for running with us — your bib is locked in and your spot on the route is saved.</p>

            <div className="ticket">
              <div className="ticket-top">
                <div>
                  <div className="bib-label">Assigned bib number</div>
                  <div className="bib-num tabular">{bibNumber}</div>
                </div>
                <div className="paid-chip tabular">Paid ₹{price}</div>
              </div>
              <div className="ticket-grid">
                <div>
                  <span>Participant</span>
                  <div>{formData.firstName} {formData.lastName}</div>
                </div>
                <div>
                  <span>Category</span>
                  <div>{category === 'competitive' ? 'Competitive (₹249)' : 'Non-competitive (₹149)'}</div>
                </div>
                <div>
                  <span>T-shirt size</span>
                  <div>{formData.tShirtSize}</div>
                </div>
                <div>
                  <span>Emergency contact</span>
                  <div>{formData.emergencyName} ({formData.emergencyPhone})</div>
                </div>
              </div>
            </div>

            <Link href="/" className="home-btn">Return to Home</Link>
          </div>
        ) : (
          <div className="card">
            <form onSubmit={handleSubmit} className="form-pad">

              <div className="intro">
                <div>
                  <h2>Participant Information</h2>
                  <p>It only takes a few minutes to line up for the start.</p>
                </div>
                <div className="req-note"><b>*</b> marks a required field</div>
              </div>

              <div className="route">

                {/* Checkpoint 1 — Category */}
                <div className="checkpoint">
                  <div className="marker-col"><div className="marker"><Flag size={18} /></div></div>
                  <div className="checkpoint-body">
                    <div className="checkpoint-head">
                      <span className="km display">START</span>
                      <h3>Choose your distance</h3>
                    </div>

                    <div className="cat-grid">
                      <div
                        className={`cat-card${category === 'competitive' ? ' active' : ''}`}
                        onClick={() => setCategory('competitive')}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="cat-top">
                          <span className="cat-badge"><Flag size={13} /> Priority start</span>
                          <div className="cat-radio">{category === 'competitive' && <Check size={13} color="#0b1a4a" strokeWidth={3.5} />}</div>
                        </div>
                        <h4 className="cat-title">Competitive</h4>
                        <div className="cat-price tabular"><span className="display">₹249</span><small>.00</small></div>
                        <p className="cat-note">You'll start a little ahead of the pack, closer to the timing line.</p>
                      </div>

                      <div
                        className={`cat-card${category === 'non-competitive' ? ' active' : ''}`}
                        onClick={() => setCategory('non-competitive')}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="cat-top">
                          <span className="cat-badge">Fun & charity run</span>
                          <div className="cat-radio">{category === 'non-competitive' && <Check size={13} color="#0b1a4a" strokeWidth={3.5} />}</div>
                        </div>
                        <h4 className="cat-title">Non-Competitive</h4>
                        <div className="cat-price tabular"><span className="display">₹149</span><small>.00</small></div>
                        <p className="cat-note">Run the 5K at your own pace, alongside friends and family.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checkpoint 2 — Personal */}
                <div className="checkpoint">
                  <div className="marker-col"><div className="marker"><User size={17} /></div></div>
                  <div className="checkpoint-body">
                    <div className="checkpoint-head">
                      <span className="km display">1KM</span>
                      <h3>Personal information</h3>
                    </div>

                    <div className="field-grid">
                      <div className="field">
                        <label>First name <span className="star">*</span></label>
                        <input type="text" required value={formData.firstName} onChange={e => handleChange('firstName', e.target.value)} placeholder="e.g. Rahul" />
                      </div>
                      <div className="field">
                        <label>Last name <span className="opt">(optional)</span></label>
                        <input type="text" value={formData.lastName} onChange={e => handleChange('lastName', e.target.value)} placeholder="e.g. Sharma" />
                      </div>
                    </div>

                    <div className="field-grid">
                      <div className="field">
                        <label>Gender <span className="star">*</span></label>
                        <select value={formData.gender} onChange={e => handleChange('gender', e.target.value)}>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="field">
                        <label>Date of birth <span className="star">*</span></label>
                        <div className="dob-grid">
                          <select value={formData.dobDay} onChange={e => handleChange('dobDay', e.target.value)}>
                            {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                          <select value={formData.dobMonth} onChange={e => handleChange('dobMonth', e.target.value)}>
                            {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                          </select>
                          <select value={formData.dobYear} onChange={e => handleChange('dobYear', e.target.value)}>
                            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checkpoint 3 — Runner & Gear */}
                <div className="checkpoint">
                  <div className="marker-col"><div className="marker"><Ruler size={17} /></div></div>
                  <div className="checkpoint-body">
                    <div className="checkpoint-head">
                      <span className="km display">2KM</span>
                      <h3>Runner & gear specifications</h3>
                    </div>

                    <div className="field-grid">
                      <div className="field">
                        <label>Blood group <span className="star">*</span></label>
                        <select value={formData.bloodGroup} onChange={e => handleChange('bloodGroup', e.target.value)}>
                          {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                        </select>
                      </div>
                      <div className="field">
                        <label>Weight (kg) <span className="star">*</span></label>
                        <input type="number" required value={formData.weight} onChange={e => handleChange('weight', e.target.value)} placeholder="e.g. 68" />
                      </div>
                      <div className="field">
                        <label>Height (cm) <span className="star">*</span></label>
                        <input type="number" required value={formData.height} onChange={e => handleChange('height', e.target.value)} placeholder="e.g. 175" />
                      </div>
                      <div className="field">
                        <label>T-shirt size <span className="star">*</span></label>
                        <select value={formData.tShirtSize} onChange={e => handleChange('tShirtSize', e.target.value)}>
                          {TSHIRT_SIZES.map(ts => <option key={ts.code} value={ts.code}>{ts.label}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checkpoint 4 — Contact */}
                <div className="checkpoint">
                  <div className="marker-col"><div className="marker"><Mail size={16} /></div></div>
                  <div className="checkpoint-body">
                    <div className="checkpoint-head">
                      <span className="km display">3KM</span>
                      <h3>Contact information</h3>
                    </div>

                    <div className="field-grid">
                      <div className="field">
                        <label>Email address <span className="star">*</span></label>
                        <input type="email" required value={formData.email} onChange={e => handleChange('email', e.target.value)} placeholder="rahul@example.com" />
                      </div>
                      <div className="field">
                        <label>Phone number <span className="star">*</span></label>
                        <input type="tel" required value={formData.phone} onChange={e => handleChange('phone', e.target.value)} placeholder="+91 98765 43210" />
                      </div>
                      <div className="field">
                        <label>City <span className="star">*</span></label>
                        <input type="text" required value={formData.city} onChange={e => handleChange('city', e.target.value)} placeholder="e.g. Mumbai" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checkpoint 5 — Emergency */}
                <div className="checkpoint">
                  <div className="marker-col"><div className="marker"><ShieldCheck size={17} /></div></div>
                  <div className="checkpoint-body">
                    <div className="checkpoint-head">
                      <span className="km display">4KM</span>
                      <h3>Emergency contact</h3>
                    </div>

                    <div className="emergency-box">
                      <div className="emergency-title"><ShieldCheck size={15} /> In case we need to reach someone for you</div>
                      <div className="field-grid">
                        <div className="field">
                          <label>Contact name <span className="star">*</span></label>
                          <input type="text" required value={formData.emergencyName} onChange={e => handleChange('emergencyName', e.target.value)} placeholder="Contact person name" />
                        </div>
                        <div className="field">
                          <label>Contact phone <span className="star">*</span></label>
                          <input type="tel" required value={formData.emergencyPhone} onChange={e => handleChange('emergencyPhone', e.target.value)} placeholder="Contact person number" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Finish line */}
              <div className="finish">
                <div className="finish-flag" />
                <div className="finish-body">
                  <div>
                    <div className="finish-label">5KM · Selected category total</div>
                    <div className="finish-price tabular display">₹{price}.00</div>
                    <div className="finish-sub">{category === 'competitive' ? 'Competitive 5K run' : 'Non-competitive 5K fun run'}</div>
                  </div>
                  <button type="submit" disabled={isSubmitting} className="finish-cta">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      {isSubmitting ? 'Processing…' : (<>Proceed to payment <PartyPopper size={16} /></>)}
                    </span>
                  </button>
                </div>
              </div>

            </form>
          </div>
        )}
      </main>
    </div>
  );
}