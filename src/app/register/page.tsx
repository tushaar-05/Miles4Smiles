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
  Stethoscope,
  HeartHandshake,
  Smile,
  AlertCircle,
  Lock,
  Printer,
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

/* ─── Razorpay Script Loader ─── */
const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as unknown as { Razorpay?: unknown }).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayInstanceOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id: string;
  handler: (response: RazorpaySuccessResponse) => void | Promise<void>;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayConstructor {
  new (options: RazorpayInstanceOptions): {
    open: () => void;
  };
}

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
  const [chestNumber, setChestNumber] = useState('');
  const [paymentDetails, setPaymentDetails] = useState({
    paymentId: '',
    orderId: '',
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const price = category === 'competitive' ? 249 : 149;

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      // 1. Ensure Razorpay checkout script is loaded
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection and retry.');
      }

      // 2. Create Order from API
      const orderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          email: formData.email,
          phone: formData.phone,
          firstName: formData.firstName,
          lastName: formData.lastName,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create payment order.');
      }

      // 3. Configure and Open Razorpay Checkout Modal
      const RazorpaySDK = (window as unknown as { Razorpay: RazorpayConstructor }).Razorpay;

      const options: RazorpayInstanceOptions = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Miles for Smiles 5K',
        description: `${category === 'competitive' ? '5K Competitive Run' : '5K Joy Run'} (₹${price})`,
        image: '/images/logo.png',
        order_id: orderData.orderId,
        handler: async (response: RazorpaySuccessResponse) => {
          try {
            // 4. Verify payment on server
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                runnerData: {
                  ...formData,
                  category,
                },
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              setBibNumber(verifyData.bibNumber);
              setChestNumber(verifyData.chestNumber);
              setPaymentDetails({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
              });
              setIsSubmitted(true);
            } else {
              setErrorMessage(verifyData.error || 'Payment signature verification failed.');
            }
          } catch (err: unknown) {
            console.error('Payment verification error:', err);
            setErrorMessage('Payment verification error. Please reach out to support with your transaction details.');
          } finally {
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#12318B',
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
          },
        },
      };

      const rzp = new RazorpaySDK(options);
      rzp.open();
    } catch (err: unknown) {
      console.error('Payment Initiation Error:', err);
      const msg = err instanceof Error ? err.message : 'Payment initiation failed.';
      setErrorMessage(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800;900&display=swap');

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

        /* Impact band */
        .impact {
          max-width: 840px;
          margin: -34px auto 0;
          padding: 0 16px;
          position: relative;
          z-index: 6;
        }
        .impact-card {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 14px 40px rgba(11, 26, 74, 0.14);
          padding: 18px 22px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }
        .impact-item { display: flex; align-items: flex-start; gap: 10px; }
        .impact-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(200, 255, 61, 0.22);
          color: var(--navy);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .impact-item h4 { font-size: 13px; font-weight: 700; color: var(--navy); margin-bottom: 2px; }
        .impact-item p { font-size: 11.5px; color: var(--slate); line-height: 1.4; }

        /* Main */
        .shell { max-width: 840px; margin: 32px auto 80px; padding: 0 16px; }

        /* Error alert */
        .error-alert {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #fee2e2;
          border: 1px solid #ef4444;
          color: #991b1b;
          padding: 14px 18px;
          border-radius: 12px;
          font-size: 13.5px;
          margin-bottom: 24px;
        }

        /* Success ticket */
        .success {
          background: #fff;
          border-radius: 20px;
          padding: 44px 32px;
          text-align: center;
          box-shadow: 0 16px 48px rgba(11, 26, 74, 0.12);
        }
        .success-icon {
          width: 68px;
          height: 68px;
          background: var(--lime);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          box-shadow: 0 8px 24px rgba(200, 255, 61, 0.5);
        }
        .success h2 { font-size: 2.4rem; color: var(--navy); margin-bottom: 8px; }
        .success p { color: var(--slate); font-size: 14.5px; max-width: 520px; margin: 0 auto 20px; }

        .impact-note {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(18, 49, 139, 0.08);
          color: var(--navy-2);
          padding: 8px 16px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 28px;
        }

        .ticket {
          background: #fafaf8;
          border: 2px dashed #ccd3e2;
          border-radius: 18px;
          padding: 24px 28px;
          max-width: 540px;
          margin: 0 auto 30px;
          text-align: left;
        }
        .ticket-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 18px;
          border-bottom: 1px solid var(--line);
          margin-bottom: 18px;
        }
        .bib-label { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: var(--slate); }
        .bib-num { font-size: 2.2rem; font-weight: 900; color: var(--navy-2); line-height: 1; margin-top: 4px; }
        .paid-chip {
          background: var(--lime);
          color: var(--navy);
          font-size: 13px;
          font-weight: 900;
          padding: 6px 14px;
          border-radius: 8px;
        }
        .ticket-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          font-size: 13px;
        }
        .ticket-grid span { color: var(--slate); font-size: 11px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; display: block; margin-bottom: 2px; }
        .ticket-grid div { color: var(--ink); font-weight: 600; }

        .success-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          flex-wrap: wrap;
        }

        .home-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--navy);
          color: #fff;
          padding: 13px 30px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 800;
          text-decoration: none;
          transition: background 0.15s ease;
        }
        .home-btn:hover { background: var(--navy-2); }

        .print-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #fff;
          color: var(--navy);
          border: 1.5px solid var(--line);
          padding: 12px 24px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .print-btn:hover { background: #f0f2f7; }

        /* Form Card */
        .card {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 16px 48px rgba(11, 26, 74, 0.08);
          overflow: hidden;
        }
        .form-pad { padding: 36px 32px; }

        .intro {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--line);
          margin-bottom: 32px;
        }
        .intro h2 { font-size: 20px; font-weight: 800; color: var(--navy); margin-bottom: 4px; }
        .intro p { font-size: 13px; color: var(--slate); margin: 0; }
        .req-note { font-size: 12px; color: var(--slate); }
        .star { color: var(--flare); font-weight: 700; }
        .opt { color: var(--slate); font-size: 11px; font-weight: 400; }

        .route { display: flex; flex-direction: column; gap: 32px; }

        /* Checkpoint row */
        .checkpoint { display: flex; gap: 20px; }
        .marker-col { display: flex; flex-direction: column; align-items: center; }
        .marker {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(18, 49, 139, 0.08);
          border: 2px solid var(--navy-2);
          color: var(--navy-2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .checkpoint-body { flex: 1; }
        .checkpoint-head { display: flex; align-items: baseline; gap: 10px; margin-bottom: 16px; }
        .km { font-size: 1.3rem; color: var(--navy-2); font-weight: 900; }
        .checkpoint-head h3 { font-size: 16px; font-weight: 800; color: var(--ink); margin: 0; }

        /* Category Choice Cards */
        .cat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .cat-card {
          border: 2px solid var(--line);
          border-radius: 14px;
          padding: 18px 20px;
          cursor: pointer;
          transition: all 0.15s ease;
          background: #fff;
        }
        .cat-card:hover { border-color: #b0bbd4; }
        .cat-card.active {
          border-color: var(--navy-2);
          background: rgba(18, 49, 139, 0.03);
          box-shadow: 0 4px 16px rgba(18, 49, 139, 0.08);
        }
        .cat-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
        .cat-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 10.5px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--navy-2);
          background: rgba(18, 49, 139, 0.1);
          padding: 4px 8px;
          border-radius: 6px;
        }
        .cat-radio {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid var(--line);
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
        }
        .cat-card.active .cat-radio {
          border-color: var(--navy-2);
          background: var(--lime);
        }
        .cat-title { font-size: 16px; font-weight: 800; color: var(--navy); margin-bottom: 4px; }
        .cat-price { font-size: 1.8rem; font-weight: 900; color: var(--navy); line-height: 1; margin-bottom: 6px; }
        .cat-price small { font-size: 0.55em; color: var(--slate); font-weight: 600; }
        .cat-note { font-size: 12px; color: var(--slate); line-height: 1.4; margin-bottom: 10px; }
        .cat-impact {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          color: #0d6938;
          background: #ecfdf5;
          padding: 5px 8px;
          border-radius: 6px;
        }

        /* Form Fields */
        .field-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; }
        .field { display: flex; flex-direction: column; gap: 6px; }
        .field label { font-size: 12.5px; font-weight: 700; color: var(--ink); }
        .field input, .field select {
          height: 44px;
          padding: 0 14px;
          border: 1.5px solid var(--line);
          border-radius: 10px;
          font-size: 14px;
          color: var(--ink);
          background: #fff;
          font-family: inherit;
          transition: border-color 0.15s ease;
        }
        .field input:focus, .field select:focus {
          border-color: var(--navy-2);
          outline: none;
        }
        .dob-grid { display: grid; grid-template-columns: 1fr 1.6fr 1.2fr; gap: 8px; }

        .emergency-box {
          background: #fafaf8;
          border: 1px solid var(--line);
          border-radius: 14px;
          padding: 16px 18px;
        }
        .emergency-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          color: var(--slate);
          margin-bottom: 12px;
        }

        /* Finish Line & Razorpay CTA */
        .finish {
          margin-top: 40px;
          background: var(--navy);
          border-radius: 16px;
          padding: 24px 28px;
          color: #fff;
          box-shadow: 0 12px 36px rgba(11, 26, 74, 0.25);
        }
        .finish-body {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }
        .finish-label { font-size: 11.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255, 255, 255, 0.7); margin-bottom: 2px; }
        .finish-price { font-size: 2.6rem; font-weight: 900; color: var(--lime); line-height: 1; }
        .finish-sub { font-size: 12.5px; color: rgba(255, 255, 255, 0.85); margin-top: 4px; }
        .finish-trust { display: flex; align-items: center; gap: 6px; font-size: 11px; color: rgba(255, 255, 255, 0.6); margin-top: 6px; }

        .finish-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: var(--lime);
          color: var(--navy);
          border: none;
          padding: 16px 36px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 900;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(200, 255, 61, 0.35);
          transition: all 0.15s ease;
        }
        .finish-cta:hover:not(:disabled) {
          background: #d5ff59;
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(200, 255, 61, 0.5);
        }
        .finish-cta:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .secure-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 12px;
          color: var(--slate);
          margin-top: 18px;
          text-align: center;
        }

        @media (max-width: 768px) {
          .impact-card { grid-template-columns: 1fr; }
          .cat-grid { grid-template-columns: 1fr; }
          .finish-body { flex-direction: column; align-items: stretch; text-align: center; }
          .finish-trust { justify-content: center; }
          .finish-cta { width: 100%; }
        }
      `}</style>

      {/* ══════════════ HERO HEADER ══════════════ */}
      <header className="hero">
        <div className="hero-inner">
          <Link href="/" className="back-link">
            <ArrowLeft size={16} /> Back to main event
          </Link>

          <div className="tag-row">
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center' }}>
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
          <p className="hero-sub">Secure your official BIB number and support pediatric healthcare for children in need.</p>
        </div>
      </header>

      {/* ══════════════ IMPACT BAND ══════════════ */}
      <div className="impact">
        <div className="impact-card">
          <div className="impact-item">
            <div className="impact-icon"><Stethoscope size={16} /></div>
            <div>
              <h4>Free Pediatric Care</h4>
              <p>Your registration directly funds dental screenings and treatment for underprivileged children.</p>
            </div>
          </div>
          <div className="impact-item">
            <div className="impact-icon"><HeartHandshake size={16} /></div>
            <div>
              <h4>100% Charity Cause</h4>
              <p>All race registration funds go straight to verified pediatric health programs.</p>
            </div>
          </div>
          <div className="impact-item">
            <div className="impact-icon"><Smile size={16} /></div>
            <div>
              <h4>Real Medical Support</h4>
              <p>Providing essential surgeries, oral hygiene kits, and aftercare for kids.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════ MAIN CONTENT ══════════════ */}
      <main className="shell">
        {isSubmitted ? (
          /* ─── SUCCESS CONFIRMATION SCREEN ─── */
          <div className="success">
            <div className="success-icon">
              <Check size={36} color="#0b1a4a" strokeWidth={3.5} />
            </div>
            <h2 className="display">Registration Confirmed!</h2>
            <p>Payment successful! Your official 5K BIB number has been generated and your spot on the starting grid is locked in.</p>

            <div className="impact-note">
              <Smile size={15} /> Your ₹{price} contribution is on its way to a child&rsquo;s healthcare
            </div>

            <div className="ticket">
              <div className="ticket-top">
                <div>
                  <div className="bib-label">Assigned Chest Number</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '4px' }}>
                    <div className="bib-num tabular display" style={{ color: 'var(--navy-2)', fontSize: '2.8rem' }}>
                      #{chestNumber || '101'}
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--slate)', letterSpacing: '0.04em' }}>
                      ({bibNumber})
                    </span>
                  </div>
                </div>
                <div className="paid-chip tabular">PAID ₹{price}.00</div>
              </div>
              <div className="ticket-grid">
                <div>
                  <span>Participant Name</span>
                  <div>{formData.firstName} {formData.lastName}</div>
                </div>
                <div>
                  <span>Chest No. / BIB</span>
                  <div style={{ color: 'var(--navy-2)', fontWeight: 800 }}>#{chestNumber} ({bibNumber})</div>
                </div>
                <div>
                  <span>Race Category</span>
                  <div>{category === 'competitive' ? '5K Competitive (₹249)' : '5K Joy Run (₹149)'}</div>
                </div>
                <div>
                  <span>T-Shirt Size</span>
                  <div>{formData.tShirtSize}</div>
                </div>
                <div>
                  <span>Blood Group</span>
                  <div>{formData.bloodGroup}</div>
                </div>
                <div>
                  <span>Razorpay Payment ID</span>
                  <div style={{ wordBreak: 'break-all', fontSize: '12px', fontFamily: 'monospace' }}>{paymentDetails.paymentId || 'Verified'}</div>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <span>Emergency Contact</span>
                  <div>{formData.emergencyName} ({formData.emergencyPhone})</div>
                </div>
              </div>
            </div>

            <div className="success-actions">
              <button onClick={handlePrint} className="print-btn">
                <Printer size={16} /> Print Confirmation
              </button>
              <Link href="/" className="home-btn">
                Return to Home
              </Link>
            </div>
          </div>
        ) : (
          /* ─── REGISTRATION FORM ─── */
          <div className="card">
            <form onSubmit={handleSubmit} className="form-pad">

              {errorMessage && (
                <div className="error-alert">
                  <AlertCircle size={18} />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="intro">
                <div>
                  <h2>Participant Registration</h2>
                  <p>Fill in your details below to complete your registration and secure your runner kit.</p>
                </div>
                <div className="req-note"><b>*</b> marks a required field</div>
              </div>

              <div className="route">

                {/* Checkpoint 1 — Category */}
                <div className="checkpoint">
                  <div className="marker-col"><div className="marker"><Flag size={18} /></div></div>
                  <div className="checkpoint-body">
                    <div className="checkpoint-head">
                      <span className="km display">STEP 1</span>
                      <h3>Choose Your Race Category</h3>
                    </div>

                    <div className="cat-grid">
                      <div
                        className={`cat-card${category === 'competitive' ? ' active' : ''}`}
                        onClick={() => setCategory('competitive')}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="cat-top">
                          <span className="cat-badge"><Flag size={13} /> Front-Grid Priority</span>
                          <div className="cat-radio">{category === 'competitive' && <Check size={13} color="#0b1a4a" strokeWidth={3.5} />}</div>
                        </div>
                        <h4 className="cat-title">Competitive 5K</h4>
                        <div className="cat-price tabular"><span className="display">₹249</span><small>.00</small></div>
                        <p className="cat-note">Front-grid priority flag-off, RFID timing bib, and eligible for ₹35,000 cash prizes.</p>
                        <div className="cat-impact"><Smile size={13} /> Full dental screening & care kit</div>
                      </div>

                      <div
                        className={`cat-card${category === 'non-competitive' ? ' active' : ''}`}
                        onClick={() => setCategory('non-competitive')}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="cat-top">
                          <span className="cat-badge">Joy & Charity Run</span>
                          <div className="cat-radio">{category === 'non-competitive' && <Check size={13} color="#0b1a4a" strokeWidth={3.5} />}</div>
                        </div>
                        <h4 className="cat-title">Non-Competitive 5K</h4>
                        <div className="cat-price tabular"><span className="display">₹149</span><small>.00</small></div>
                        <p className="cat-note">Run or walk at your own relaxed pace with friends, family, and supporters.</p>
                        <div className="cat-impact"><Smile size={13} /> Free screening for a child in need</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checkpoint 2 — Personal */}
                <div className="checkpoint">
                  <div className="marker-col"><div className="marker"><User size={17} /></div></div>
                  <div className="checkpoint-body">
                    <div className="checkpoint-head">
                      <span className="km display">STEP 2</span>
                      <h3>Personal Information</h3>
                    </div>

                    <div className="field-grid">
                      <div className="field">
                        <label>First Name <span className="star">*</span></label>
                        <input type="text" required value={formData.firstName} onChange={e => handleChange('firstName', e.target.value)} placeholder="e.g. Rahul" />
                      </div>
                      <div className="field">
                        <label>Last Name <span className="opt">(optional)</span></label>
                        <input type="text" value={formData.lastName} onChange={e => handleChange('lastName', e.target.value)} placeholder="e.g. Sharma" />
                      </div>
                    </div>

                    <div className="field-grid" style={{ marginTop: '14px' }}>
                      <div className="field">
                        <label>Gender <span className="star">*</span></label>
                        <select value={formData.gender} onChange={e => handleChange('gender', e.target.value)}>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="field">
                        <label>Date of Birth <span className="star">*</span> (Min Age: 10 Yrs)</label>
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
                      <span className="km display">STEP 3</span>
                      <h3>Runner Specifications & Kit</h3>
                    </div>

                    <div className="field-grid">
                      <div className="field">
                        <label>Blood Group <span className="star">*</span></label>
                        <select value={formData.bloodGroup} onChange={e => handleChange('bloodGroup', e.target.value)}>
                          {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                        </select>
                      </div>
                      <div className="field">
                        <label>Weight (kg) <span className="star">*</span></label>
                        <input type="number" required min="20" max="250" value={formData.weight} onChange={e => handleChange('weight', e.target.value)} placeholder="e.g. 68" />
                      </div>
                      <div className="field">
                        <label>Height (cm) <span className="star">*</span></label>
                        <input type="number" required min="80" max="250" value={formData.height} onChange={e => handleChange('height', e.target.value)} placeholder="e.g. 175" />
                      </div>
                      <div className="field">
                        <label>T-Shirt Size <span className="star">*</span></label>
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
                      <span className="km display">STEP 4</span>
                      <h3>Contact Details</h3>
                    </div>

                    <div className="field-grid">
                      <div className="field">
                        <label>Email Address <span className="star">*</span></label>
                        <input type="email" required value={formData.email} onChange={e => handleChange('email', e.target.value)} placeholder="rahul@example.com" />
                      </div>
                      <div className="field">
                        <label>Phone Number <span className="star">*</span></label>
                        <input type="tel" required value={formData.phone} onChange={e => handleChange('phone', e.target.value)} placeholder="e.g. 9876543210" />
                      </div>
                      <div className="field">
                        <label>City <span className="star">*</span></label>
                        <input type="text" required value={formData.city} onChange={e => handleChange('city', e.target.value)} placeholder="e.g. Pune" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checkpoint 5 — Emergency */}
                <div className="checkpoint">
                  <div className="marker-col"><div className="marker"><ShieldCheck size={17} /></div></div>
                  <div className="checkpoint-body">
                    <div className="checkpoint-head">
                      <span className="km display">STEP 5</span>
                      <h3>Emergency Contact</h3>
                    </div>

                    <div className="emergency-box">
                      <div className="emergency-title"><ShieldCheck size={15} /> Emergency contact details for race day</div>
                      <div className="field-grid">
                        <div className="field">
                          <label>Contact Person Name <span className="star">*</span></label>
                          <input type="text" required value={formData.emergencyName} onChange={e => handleChange('emergencyName', e.target.value)} placeholder="e.g. Amit Sharma" />
                        </div>
                        <div className="field">
                          <label>Emergency Phone <span className="star">*</span></label>
                          <input type="tel" required value={formData.emergencyPhone} onChange={e => handleChange('emergencyPhone', e.target.value)} placeholder="e.g. 9876500000" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Finish Line & Payment CTA */}
              <div className="finish">
                <div className="finish-body">
                  <div>
                    <div className="finish-label">Selected Category Total</div>
                    <div className="finish-price tabular display">₹{price}.00</div>
                    <div className="finish-sub">{category === 'competitive' ? '5K Competitive Run Registration' : '5K Non-Competitive Joy Run Registration'}</div>
                    <div className="finish-trust"><HeartHandshake size={13} /> 100% Proceeds Support Miles for Smiles Charity</div>
                  </div>
                  <button type="submit" disabled={isSubmitting} className="finish-cta">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      {isSubmitting ? 'Opening Razorpay…' : (<>Pay ₹{price} with Razorpay <PartyPopper size={16} /></>)}
                    </span>
                  </button>
                </div>
              </div>

              <div className="secure-badge">
                <Lock size={13} /> 256-bit Encrypted & Secured by Razorpay Payment Gateway
              </div>

            </form>
          </div>
        )}
      </main>
    </div>
  );
}