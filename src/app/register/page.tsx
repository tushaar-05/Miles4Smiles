'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Check,
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
  GraduationCap,
  Sparkles,
  ExternalLink,
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
  { code: 'S', label: 'S (36")' },
  { code: 'M', label: 'M (38")' },
  { code: 'L', label: 'L (40")' },
  { code: 'XL', label: 'XL (42")' },
  { code: 'XXL', label: 'XXL (44")' },
];

const NST_GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfaMvm-ycekfQ_18OnXpbTCdDK4bG0Ra24qKbHDysN2pZnjpA/viewform?usp=publish-editor';

export default function RegisterPage() {
  /* Participant Type: General vs NST Student */
  const [participantType, setParticipantType] = useState<'general' | 'student'>('general');

  /* Form State for General Participants */
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    bloodGroup: '',
    weight: '',
    height: '',
    tShirtSize: '',
    dobDay: '',
    dobMonth: '',
    dobYear: '',
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
      // 1. Initiate payment & generate order reference
      const initRes = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantType: 'general',
          category: 'competitive',
          email: formData.email,
          phone: formData.phone,
          firstName: formData.firstName,
          lastName: formData.lastName,
        }),
      });

      const initData = await initRes.json();
      if (!initData.success) {
        throw new Error(initData.error || 'Failed to initiate registration.');
      }

      // 2. Persist runner data & unique Chest/BIB number in Supabase
      const verifyRes = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gateway_order_id: initData.orderId,
          gateway_payment_id: `easebuzz_${Date.now()}`,
          gateway_status: 'PENDING_GATEWAY',
          runnerData: {
            ...formData,
            participantType: 'general',
            category: 'competitive',
          },
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        throw new Error(verifyData.error || 'Failed to record registration details.');
      }

      // 3. Redirect participant directly to Easebuzz payment portal
      const targetGatewayUrl = initData.gatewayUrl || 'https://easebuzz.in/link/WO6Z5';
      window.location.href = targetGatewayUrl;
    } catch (err: unknown) {
      console.error('Registration/Payment Error:', err);
      const msg = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setErrorMessage(msg);
    } finally {
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
          --emerald: #059669;
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

        /* Group Segmented Switcher */
        .group-selector-wrap {
          margin-bottom: 28px;
        }
        .group-selector-title {
          font-size: 12px;
          font-weight: 800;
          color: var(--slate);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .group-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .group-btn {
          border: 2px solid var(--line);
          background: #fff;
          border-radius: 14px;
          padding: 14px 16px;
          cursor: pointer;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          gap: 12px;
          text-align: left;
        }
        .group-btn:hover {
          border-color: #b0bbd4;
        }
        .group-btn.active {
          border-color: var(--navy-2);
          background: rgba(18, 49, 139, 0.04);
          box-shadow: 0 4px 14px rgba(18, 49, 139, 0.08);
        }
        .group-icon-circle {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #f1f4f9;
          color: var(--navy);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.15s ease;
        }
        .group-btn.active .group-icon-circle {
          background: var(--navy-2);
          color: var(--lime);
        }
        .group-info h4 {
          font-size: 14px;
          font-weight: 800;
          color: var(--navy);
          margin-bottom: 2px;
        }
        .group-info p {
          font-size: 11.5px;
          color: var(--slate);
          margin: 0;
        }

        /* NST Student Dedicated Portal Card */
        .student-portal-card {
          background: #ffffff;
          border: 2px solid #3b82f6;
          border-radius: 20px;
          padding: 36px 32px;
          box-shadow: 0 16px 48px rgba(59, 130, 246, 0.12);
        }
        .student-portal-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #eff6ff;
          color: #1d4ed8;
          font-size: 12px;
          font-weight: 800;
          padding: 6px 14px;
          border-radius: 999px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 14px;
          border: 1px solid #bfdbfe;
        }
        .student-portal-title {
          font-size: 24px;
          font-weight: 800;
          color: var(--navy);
          margin-bottom: 8px;
        }
        .student-portal-desc {
          font-size: 14.5px;
          color: var(--slate);
          line-height: 1.5;
          max-width: 600px;
          margin-bottom: 24px;
        }
        .student-perks-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
          margin-bottom: 30px;
        }
        .student-perk {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 14px 16px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .student-perk-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #dbeafe;
          color: #1e40af;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .student-perk h5 {
          font-size: 13px;
          font-weight: 700;
          color: var(--navy);
          margin-bottom: 2px;
        }
        .student-perk p {
          font-size: 11.5px;
          color: var(--slate);
          margin: 0;
        }
        .student-action-area {
          background: #f0fdf4;
          border: 1.5px dashed #86efac;
          border-radius: 16px;
          padding: 22px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }
        .student-action-text h4 {
          font-size: 15px;
          font-weight: 800;
          color: #166534;
          margin-bottom: 4px;
        }
        .student-action-text p {
          font-size: 12.5px;
          color: #15803d;
          margin: 0;
        }
        .student-google-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #16a34a;
          color: #ffffff;
          padding: 14px 28px;
          border-radius: 12px;
          font-size: 14.5px;
          font-weight: 800;
          text-decoration: none;
          box-shadow: 0 6px 20px rgba(22, 163, 74, 0.35);
          transition: all 0.15s ease;
        }
        .student-google-btn:hover {
          background: #15803d;
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(22, 163, 74, 0.45);
        }

        /* ══════════ OFFICIAL BRANDED MARATHON PASS STYLES ══════════ */
        .success-wrapper {
          max-width: 680px;
          margin: 0 auto 60px;
        }
        .screen-confirm-head {
          text-align: center;
          margin-bottom: 24px;
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

        .marathon-pass {
          background: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(11, 26, 74, 0.15);
          border: 2px solid var(--navy-2);
        }

        .pass-hero {
          background: var(--navy-2);
          background-image: linear-gradient(135deg, #0b1a4a 0%, #12318b 100%);
          padding: 18px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #ffffff;
          gap: 16px;
          flex-wrap: wrap;
        }
        .pass-hero-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .pass-event-tag {
          background: rgba(200, 255, 61, 0.18);
          color: var(--lime);
          border: 1px solid rgba(200, 255, 61, 0.35);
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.06em;
        }
        .pass-hero-right {
          text-align: right;
        }
        .pass-badge-date {
          font-size: 14px;
          font-weight: 900;
          letter-spacing: 0.08em;
          color: var(--lime);
        }
        .pass-venue-text {
          font-size: 10.5px;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 700;
          letter-spacing: 0.04em;
          margin-top: 2px;
        }

        .pass-body {
          padding: 22px 24px;
          background: #ffffff;
        }

        /* Simulated Marathon BIB Card */
        .bib-card {
          position: relative;
          background: #fafaf8;
          border: 2.5px solid var(--navy-2);
          border-radius: 16px;
          padding: 16px 20px;
          text-align: center;
          margin-bottom: 18px;
          box-shadow: 0 6px 20px rgba(11, 26, 74, 0.06);
        }
        .bib-pin {
          position: absolute;
          width: 13px;
          height: 13px;
          background: #ffffff;
          border: 2px solid var(--navy-2);
          border-radius: 50%;
        }
        .bib-pin.tl { top: 8px; left: 8px; }
        .bib-pin.tr { top: 8px; right: 8px; }
        .bib-pin.bl { bottom: 8px; left: 8px; }
        .bib-pin.br { bottom: 8px; right: 8px; }

        .bib-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2px;
        }
        .bib-sub-label {
          font-size: 11px;
          font-weight: 900;
          color: var(--slate);
          letter-spacing: 0.12em;
        }
        .bib-paid-badge {
          background: var(--lime);
          color: var(--navy);
          font-size: 12px;
          font-weight: 900;
          padding: 4px 10px;
          border-radius: 6px;
          letter-spacing: 0.04em;
        }

        .bib-number-display {
          font-size: clamp(3.6rem, 8vw, 4.8rem);
          font-weight: 900;
          color: var(--navy-2);
          line-height: 0.95;
          margin: 4px 0 8px;
          letter-spacing: 0.03em;
        }

        .bib-category-pill {
          display: inline-block;
          background: var(--navy);
          color: var(--lime);
          padding: 5px 14px;
          border-radius: 999px;
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        /* Runner details */
        .pass-details-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px 14px;
          padding: 14px 16px;
          background: #f4f6fb;
          border-radius: 12px;
          margin-bottom: 16px;
          border: 1px solid #dfe3ed;
        }
        .detail-cell {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .detail-label {
          font-size: 9.5px;
          font-weight: 800;
          color: var(--slate);
          letter-spacing: 0.06em;
        }
        .detail-value {
          font-size: 12.5px;
          font-weight: 700;
          color: var(--navy);
        }
        .detail-value.mono {
          font-family: monospace;
        }

        /* Schedule */
        .pass-schedule-strip {
          display: flex;
          align-items: center;
          justify-content: space-around;
          background: #ffffff;
          border: 1.5px dashed #ccd3e2;
          border-radius: 10px;
          padding: 8px 12px;
          margin-bottom: 16px;
          font-size: 11px;
        }
        .sched-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .sched-time {
          font-weight: 900;
          color: var(--navy-2);
        }
        .sched-desc {
          color: var(--slate);
          font-weight: 600;
        }
        .sched-sep {
          color: var(--navy-2);
          font-size: 8px;
          opacity: 0.6;
        }

        /* Barcode */
        .pass-barcode-strip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 12px;
          border-top: 2px dashed #ccd3e2;
          gap: 16px;
        }
        .barcode-graphic {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 3px;
        }
        .barcode-text {
          font-size: 9px;
          font-family: monospace;
          color: var(--slate);
          letter-spacing: 0.1em;
        }
        .barcode-instructions {
          text-align: right;
          max-width: 240px;
        }
        .barcode-instructions strong {
          display: block;
          font-size: 11px;
          color: var(--navy-2);
          letter-spacing: 0.06em;
        }
        .barcode-instructions span {
          font-size: 9.5px;
          color: var(--slate);
          line-height: 1.3;
          display: block;
        }

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
          background: var(--lime);
          color: var(--navy);
          border: none;
          padding: 13px 28px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.15s ease;
          box-shadow: 0 6px 18px rgba(200, 255, 61, 0.4);
        }
        .print-btn:hover {
          background: #d5ff59;
          transform: translateY(-2px);
        }

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
          margin-bottom: 28px;
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

        /* Finish Line & Payment Gateway CTA (Centered Layout) */
        .finish {
          margin-top: 36px;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 18px;
          padding: 30px 24px 20px;
          text-align: center;
        }
        .finish-centered-body {
          max-width: 560px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .finish-header {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 8px;
        }
        .finish-title {
          font-size: 18px;
          font-weight: 800;
          color: var(--navy);
          letter-spacing: -0.01em;
        }
        .finish-pill {
          background: #eff6ff;
          color: #1d4ed8;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 9px;
          border-radius: 6px;
          border: 1px solid #dbeafe;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .finish-desc {
          font-size: 13.5px;
          color: var(--slate);
          line-height: 1.5;
          margin: 0 auto 12px;
          max-width: 500px;
          text-align: center;
        }
        .finish-trust {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          color: #059669;
          margin-bottom: 20px;
        }
        .trust-icon {
          flex-shrink: 0;
          color: #059669;
        }
        .finish-btn-wrap {
          display: flex;
          justify-content: center;
          width: 100%;
        }
        .finish-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: var(--navy);
          color: #ffffff;
          border: none;
          padding: 15px 36px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 0.02em;
          cursor: pointer;
          transition: all 0.15s ease;
          box-shadow: 0 6px 18px rgba(11, 26, 74, 0.2);
          min-width: 240px;
        }
        .finish-cta:hover:not(:disabled) {
          background: var(--navy-2);
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(18, 49, 139, 0.3);
        }
        .finish-cta:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }
        .finish-footer {
          margin-top: 22px;
          padding-top: 14px;
          border-top: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .finish-security {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 12px;
          color: #64748b;
          font-weight: 500;
        }

        @media print {
          .hero, .impact, .screen-confirm-head, .success-actions, header, nav, footer {
            display: none !important;
          }
          .page {
            background: #ffffff !important;
            padding: 0 !important;
          }
          .shell {
            margin: 0 !important;
            padding: 0 !important;
            max-width: 100% !important;
          }
          .marathon-pass {
            box-shadow: none !important;
            border: 2px solid #000000 !important;
          }
        }

        @media (max-width: 640px) {
          .group-grid, .student-perks-grid { grid-template-columns: 1fr; }
          .impact-card { grid-template-columns: 1fr; }
          .form-pad { padding: 24px 18px; }
          .pass-details-grid { grid-template-columns: 1fr 1fr; }
          .finish-body, .student-action-area { flex-direction: column; align-items: stretch; text-align: center; }
          .finish-cta, .student-google-btn { width: 100%; justify-content: center; }
        }
      `}</style>

      {/* ══════════════ HERO SECTION ══════════════ */}
      {!isSubmitted && (
        <>
          <header className="hero">
            <div className="hero-inner">
              <Link href="/" className="back-link">
                <ArrowLeft size={16} /> Back to Homepage
              </Link>
              <div className="tag-row" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div className="tag-pill">#RUNFORCHARITY • SEP 05, 2026</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.95)', padding: '5px 14px', borderRadius: '999px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                  <Image src="/images/nstlogo.png" alt="NST Logo" width={60} height={18} style={{ height: '16px', width: 'auto', objectFit: 'contain' }} />
                  <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 800 }}>×</span>
                  <Image src="/images/adypu logo.png" alt="ADYPU Logo" width={60} height={18} style={{ height: '16px', width: 'auto', objectFit: 'contain' }} />
                  <span style={{ color: '#94a3b8', fontSize: '12px' }}>•</span>
                  <Image src="/images/SETU Logo.png" alt="SETU Logo" width={18} height={18} style={{ height: '16px', width: 'auto', objectFit: 'contain' }} />
                  <span style={{ fontSize: '10px', fontWeight: 900, color: '#0b1a4a' }}>SETU</span>
                  <span style={{ color: '#64748b', fontSize: '10px', fontWeight: 800 }}>&</span>
                  <Image src="/images/SPORTSCLUBLOGOG.png" alt="Sports Club Logo" width={18} height={18} style={{ height: '16px', width: 'auto', objectFit: 'contain' }} />
                  <span style={{ fontSize: '10px', fontWeight: 900, color: '#0b1a4a' }}>SPORTS</span>
                </div>
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
        </>
      )}

      {/* ══════════════ MAIN CONTENT ══════════════ */}
      <main className="shell" style={{ marginTop: isSubmitted ? '40px' : undefined }}>
        {isSubmitted ? (
          /* ─── SUCCESS CONFIRMATION SCREEN — OFFICIAL MARATHON PASS ─── */
          <div className="success-wrapper">
            
            {/* Screen celebratory title (hidden on print) */}
            <div className="screen-confirm-head">
              <div className="success-icon">
                <Check size={36} color="#0b1a4a" strokeWidth={3.5} />
              </div>
              <h2 className="display" style={{ fontSize: '2.4rem', color: '#0b1a4a', marginBottom: '6px' }}>Registration Confirmed!</h2>
              <p style={{ color: '#5c6785', fontSize: '14px', maxWidth: '500px', margin: '0 auto 16px' }}>
                Registration details recorded! Your official race chest number is issued and your spot on the starting grid is locked in.
              </p>
              <div className="impact-note">
                <Smile size={15} /> Your contribution is on its way to a child&rsquo;s healthcare
              </div>
            </div>

            {/* ══════════ OFFICIAL BRANDED MARATHON RUNNER PASS ══════════ */}
            <div className="marathon-pass">
              
              {/* Pass Top Banner */}
              <div className="pass-hero">
                <div className="pass-hero-left">
                  <Image
                    src="/images/logo.png"
                    alt="Miles for Smiles"
                    width={180}
                    height={46}
                    style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
                  />
                  <div className="pass-event-tag">#RUNFORCHARITY • 5K RUN</div>
                </div>
                <div className="pass-hero-right">
                  <div className="pass-badge-date">SEP 05, 2026</div>
                  <div className="pass-venue-text">CLUB CHARHOLI, PUNE • 5:30 AM</div>
                </div>
              </div>

              {/* Pass Main Body */}
              <div className="pass-body">

                {/* Simulated Marathon BIB Card */}
                <div className="bib-card">
                  <div className="bib-pin tl" />
                  <div className="bib-pin tr" />
                  <div className="bib-pin bl" />
                  <div className="bib-pin br" />

                  <div className="bib-header-row">
                    <span className="bib-sub-label">OFFICIAL RACE CHEST NUMBER</span>
                    <span className="bib-paid-badge tabular">REGISTERED</span>
                  </div>

                  <div className="bib-number-display display tabular">
                    #{chestNumber || '101'}
                  </div>

                  <div className="bib-category-pill">
                    OFFICIAL PARTICIPANT • 5K CHARITY RUN
                  </div>
                </div>

                {/* Runner Details Grid */}
                <div className="pass-details-grid">
                  <div className="detail-cell">
                    <span className="detail-label">PARTICIPANT NAME</span>
                    <span className="detail-value">{formData.firstName} {formData.lastName}</span>
                  </div>
                  <div className="detail-cell">
                    <span className="detail-label">PARTICIPANT TYPE</span>
                    <span className="detail-value">General Participant</span>
                  </div>
                  <div className="detail-cell">
                    <span className="detail-label">T-SHIRT SIZE</span>
                    <span className="detail-value">{formData.tShirtSize}</span>
                  </div>
                  <div className="detail-cell">
                    <span className="detail-label">BLOOD GROUP</span>
                    <span className="detail-value">{formData.bloodGroup}</span>
                  </div>
                  <div className="detail-cell">
                    <span className="detail-label">CITY</span>
                    <span className="detail-value">{formData.city || 'Pune'}</span>
                  </div>
                  <div className="detail-cell">
                    <span className="detail-label">EMERGENCY CONTACT</span>
                    <span className="detail-value">{formData.emergencyName} ({formData.emergencyPhone})</span>
                  </div>
                  <div className="detail-cell">
                    <span className="detail-label">ORDER REFERENCE</span>
                    <span className="detail-value mono" style={{ fontSize: '11px' }}>{paymentDetails.orderId || 'M4S-REG'}</span>
                  </div>
                </div>

                {/* Race Day Schedule Strip */}
                <div className="pass-schedule-strip">
                  <div className="sched-item">
                    <span className="sched-time">5:30 AM</span>
                    <span className="sched-desc">Reporting & Check-In</span>
                  </div>
                  <div className="sched-sep">✦</div>
                  <div className="sched-item">
                    <span className="sched-time">6:00 AM</span>
                    <span className="sched-desc">Zumba & Warmup</span>
                  </div>
                  <div className="sched-sep">✦</div>
                  <div className="sched-item">
                    <span className="sched-time">6:30 AM</span>
                    <span className="sched-desc">Race Flag-Off</span>
                  </div>
                </div>

                {/* Barcode & Security Strip */}
                <div className="pass-barcode-strip">
                  <div className="barcode-graphic">
                    <svg height="34" width="220" viewBox="0 0 220 34" fill="#0b1a4a">
                      <rect x="0" y="0" width="3" height="34"/>
                      <rect x="5" y="0" width="2" height="34"/>
                      <rect x="9" y="0" width="4" height="34"/>
                      <rect x="16" y="0" width="2" height="34"/>
                      <rect x="20" y="0" width="5" height="34"/>
                      <rect x="28" y="0" width="2" height="34"/>
                      <rect x="32" y="0" width="3" height="34"/>
                      <rect x="38" y="0" width="4" height="34"/>
                      <rect x="45" y="0" width="2" height="34"/>
                      <rect x="49" y="0" width="6" height="34"/>
                      <rect x="58" y="0" width="2" height="34"/>
                      <rect x="63" y="0" width="4" height="34"/>
                      <rect x="70" y="0" width="3" height="34"/>
                      <rect x="76" y="0" width="5" height="34"/>
                      <rect x="84" y="0" width="2" height="34"/>
                      <rect x="88" y="0" width="4" height="34"/>
                      <rect x="95" y="0" width="3" height="34"/>
                      <rect x="101" y="0" width="5" height="34"/>
                      <rect x="109" y="0" width="2" height="34"/>
                      <rect x="114" y="0" width="4" height="34"/>
                      <rect x="121" y="0" width="3" height="34"/>
                      <rect x="127" y="0" width="6" height="34"/>
                      <rect x="136" y="0" width="2" height="34"/>
                      <rect x="141" y="0" width="4" height="34"/>
                      <rect x="148" y="0" width="3" height="34"/>
                      <rect x="154" y="0" width="5" height="34"/>
                      <rect x="162" y="0" width="2" height="34"/>
                      <rect x="167" y="0" width="4" height="34"/>
                      <rect x="174" y="0" width="3" height="34"/>
                      <rect x="180" y="0" width="5" height="34"/>
                      <rect x="188" y="0" width="2" height="34"/>
                      <rect x="193" y="0" width="4" height="34"/>
                      <rect x="200" y="0" width="3" height="34"/>
                      <rect x="206" y="0" width="5" height="34"/>
                      <rect x="214" y="0" width="3" height="34"/>
                    </svg>
                    <span className="barcode-text">M4S-2026-CHEST-{chestNumber || '101'}</span>
                  </div>
                  <div className="barcode-instructions">
                    <strong>OFFICIAL ENTRY PASS</strong>
                    <span>Present this pass at the counter on race morning for BIB & kit collection.</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Action Buttons (hidden on print) */}
            <div className="success-actions" style={{ marginTop: '24px' }}>
              <button onClick={handlePrint} className="print-btn">
                <Printer size={16} /> Print Official Pass
              </button>
              <Link href="/" className="home-btn">
                Return to Home
              </Link>
            </div>
          </div>
        ) : (
          /* ─── REGISTRATION CONTAINER ─── */
          <div>
            {/* ─── PARTICIPANT GROUP SELECTOR (General vs NST Student) ─── */}
            <div className="group-selector-wrap">
              <div className="group-selector-title">
                <Sparkles size={14} /> Select Registration Group
              </div>
              <div className="group-grid">
                <div
                  className={`group-btn${participantType === 'general' ? ' active' : ''}`}
                  onClick={() => setParticipantType('general')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="group-icon-circle">
                    <User size={18} />
                  </div>
                  <div className="group-info">
                    <h4>General Participant</h4>
                    <p>Open for all runners & charity champions</p>
                  </div>
                </div>

                <div
                  className={`group-btn${participantType === 'student' ? ' active' : ''}`}
                  onClick={() => setParticipantType('student')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="group-icon-circle">
                    <GraduationCap size={18} />
                  </div>
                  <div className="group-info">
                    <h4>NST Student / Faculty</h4>
                    <p>Exclusive Google Form registration for NST students & faculty</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ══════════════ NST STUDENT GOOGLE FORM PORTAL ══════════════ */}
            {participantType === 'student' ? (
              <div className="student-portal-card">
                <div className="student-portal-badge">
                  <GraduationCap size={15} /> NST Student Portal
                </div>
                <h3 className="student-portal-title">Newton School of Technology — 5K Registration</h3>
                <p className="student-portal-desc">
                  Students of Newton School of Technology (NST) register through our official Google Form to access exclusive student registration, batch allocation, and on-campus kit distribution.
                </p>

                <div className="student-action-area">
                  <div className="student-action-text">
                    <h4>Ready to register?</h4>
                    <p>Fill out the official Google Form. Your coordinator will verify your entry and issue your BIB number.</p>
                  </div>
                  <a
                    href={NST_GOOGLE_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="student-google-btn"
                  >
                    Open NST Google Form <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            ) : (
              /* ══════════════ GENERAL PARTICIPANT FORM ══════════════ */
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
                      <p>Fill in your details below to secure your runner kit and start grid placement.</p>
                    </div>
                    <div className="req-note"><b>*</b> marks a required field</div>
                  </div>

                  <div className="route">

                    {/* Step 1 — Personal Info */}
                    <div className="checkpoint">
                      <div className="marker-col"><div className="marker"><User size={17} /></div></div>
                      <div className="checkpoint-body">
                        <div className="checkpoint-head">
                          <span className="km display">STEP 1</span>
                          <h3>Personal Information</h3>
                        </div>

                        <div className="field-grid">
                          <div className="field">
                            <label>First Name <span className="star">*</span></label>
                            <input type="text" required value={formData.firstName} onChange={e => handleChange('firstName', e.target.value)} placeholder="e.g. Rahul" />
                          </div>
                          <div className="field">
                            <label>Surname / Last Name <span className="star">*</span></label>
                            <input type="text" required value={formData.lastName} onChange={e => handleChange('lastName', e.target.value)} placeholder="e.g. Sharma" />
                          </div>
                        </div>

                        <div className="field-grid" style={{ marginTop: '14px' }}>
                          <div className="field">
                            <label>Gender <span className="star">*</span></label>
                            <select required value={formData.gender} onChange={e => handleChange('gender', e.target.value)}>
                              <option value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div className="field">
                            <label>Date of Birth <span className="star">*</span> (Min Age: 10 Yrs | Senior Adult: 40+)</label>
                            <div className="dob-grid">
                              <select required value={formData.dobDay} onChange={e => handleChange('dobDay', e.target.value)}>
                                <option value="">Day</option>
                                {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                              </select>
                              <select required value={formData.dobMonth} onChange={e => handleChange('dobMonth', e.target.value)}>
                                <option value="">Month</option>
                                {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                              </select>
                              <select required value={formData.dobYear} onChange={e => handleChange('dobYear', e.target.value)}>
                                <option value="">Year</option>
                                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Step 2 — Runner & Gear */}
                    <div className="checkpoint">
                      <div className="marker-col"><div className="marker"><Ruler size={17} /></div></div>
                      <div className="checkpoint-body">
                        <div className="checkpoint-head">
                          <span className="km display">STEP 2</span>
                          <h3>Runner Specifications & Kit</h3>
                        </div>

                        <div className="field-grid">
                          <div className="field">
                            <label>Blood Group <span className="star">*</span></label>
                            <select required value={formData.bloodGroup} onChange={e => handleChange('bloodGroup', e.target.value)}>
                              <option value="">Select Blood Group</option>
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
                            <select required value={formData.tShirtSize} onChange={e => handleChange('tShirtSize', e.target.value)}>
                              <option value="">Select Size</option>
                              {TSHIRT_SIZES.map(ts => <option key={ts.code} value={ts.code}>{ts.label}</option>)}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Step 3 — Contact Details */}
                    <div className="checkpoint">
                      <div className="marker-col"><div className="marker"><Mail size={16} /></div></div>
                      <div className="checkpoint-body">
                        <div className="checkpoint-head">
                          <span className="km display">STEP 3</span>
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

                    {/* Step 4 — Emergency Contact */}
                    <div className="checkpoint">
                      <div className="marker-col"><div className="marker"><ShieldCheck size={17} /></div></div>
                      <div className="checkpoint-body">
                        <div className="checkpoint-head">
                          <span className="km display">STEP 4</span>
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

                  {/* Finish Line & Payment CTA (Fully Centered) */}
                  <div className="finish">
                    <div className="finish-centered-body">
                      <div className="finish-header">
                        <span className="finish-title">Complete Registration</span>
                        <span className="finish-pill">Final Step</span>
                      </div>
                      <p className="finish-desc">
                        Select your race category (Competitive 5K ₹249 or Joy Run ₹149) and complete your entry on the official payment gateway.
                      </p>
                      <div className="finish-trust">
                        <HeartHandshake size={14} className="trust-icon" />
                        <span>100% of proceeds support pediatric healthcare</span>
                      </div>

                      <div className="finish-btn-wrap">
                        <button type="submit" disabled={isSubmitting} className="finish-cta">
                          <span>{isSubmitting ? 'Opening Gateway…' : 'Proceed to Payment'}</span>
                          <ArrowRight size={17} />
                        </button>
                      </div>
                    </div>

                    <div className="finish-footer">
                      <div className="finish-security">
                        <Lock size={13} />
                        <span>256-bit SSL Encrypted • Official Payment Gateway</span>
                      </div>
                    </div>
                  </div>

                </form>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}