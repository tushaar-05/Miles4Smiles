'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Users,
  CheckCircle2,
  Clock,
  Search,
  RefreshCw,
  Lock,
  Eye,
  EyeOff,
  ShieldAlert,
  Phone,
  Mail,
  X,
  UserPlus,
  MessageCircle,
  Copy,
  Check,
  Sparkles,
  Layers,
  Download,
  BarChart3,
  Activity,
  Globe,
  ArrowUpRight,
} from 'lucide-react';

interface RegistrationRecord {
  id: string;
  first_name: string;
  last_name: string;
  gender: string;
  blood_group: string;
  dob: string;
  weight?: string;
  height?: string;
  t_shirt_size: string;
  email: string;
  phone: string;
  city: string;
  emergency_name: string;
  emergency_phone: string;
  category: string;
  race_type?: string;
  amount: number;
  chest_number: string;
  bib_number: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  payment_status: 'paid' | 'pending';
  created_at: string;
}

export default function DeskDashboardPage() {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Website Views Analytics State
  const [pageViews, setPageViews] = useState<{
    totalViews: number;
    homeViews: number;
    bounceRate: number;
  }>({
    totalViews: 59,
    homeViews: 59,
    bounceRate: 68,
  });

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [raceTypeFilter, setRaceTypeFilter] = useState<string>('all');

  // Modals
  const [selectedRunner, setSelectedRunner] = useState<RegistrationRecord | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (isAddingNew || selectedRunner) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAddingNew, selectedRunner]);

  // On-spot runner form state (Amount is auto-locked based on race_type)
  const [newRunnerData, setNewRunnerData] = useState({
    first_name: '',
    last_name: '',
    gender: 'Male',
    blood_group: 'O+',
    dob: '2000-01-01',
    weight: '',
    height: '',
    t_shirt_size: 'M',
    email: '',
    phone: '',
    city: 'Pune',
    emergency_name: '',
    emergency_phone: '',
    category: 'Male',
    race_type: 'Competitive 5K',
    amount: 249,
    payment_status: 'paid' as 'paid' | 'pending',
  });

  // Check saved session on mount
  useEffect(() => {
    const saved = sessionStorage.getItem('m4s_desk_passcode');
    if (saved) {
      setPasscode(saved);
      verifyAndLoad(saved);
    }
    fetchPageViews();
  }, []);

  const fetchPageViews = async () => {
    try {
      const res = await fetch('/api/analytics/track');
      const data = await res.json();
      if (data.success) {
        setPageViews({
          totalViews: data.totalViews || 0,
          homeViews: data.homeViews || 0,
          bounceRate: typeof data.bounceRate === 'number' ? data.bounceRate : 0,
        });
      }
    } catch (e) {
      console.error('Error fetching views:', e);
    }
  };

  const verifyAndLoad = async (codeToVerify: string) => {
    setIsVerifying(true);
    setAuthError('');
    try {
      const res = await fetch(`/api/admin/registrations`, {
        headers: { 'x-volunteer-passcode': codeToVerify },
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setAuthError(data.error || 'Invalid passcode');
        setIsAuthenticated(false);
        sessionStorage.removeItem('m4s_desk_passcode');
      } else {
        setIsAuthenticated(true);
        sessionStorage.setItem('m4s_desk_passcode', codeToVerify);
        setRegistrations(data.registrations || []);
      }
    } catch (err) {
      console.error(err);
      setAuthError('Failed to connect to server. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) return;
    verifyAndLoad(passcode.trim());
  };

  const handleRefresh = async () => {
    if (!passcode) return;
    setIsLoading(true);
    try {
      const [regRes] = await Promise.all([
        fetch(`/api/admin/registrations`, {
          headers: { 'x-volunteer-passcode': passcode },
        }),
        fetchPageViews(),
      ]);
      const data = await regRes.json();
      if (data.success) {
        setRegistrations(data.registrations || []);
      }
    } catch (err) {
      console.error('Error refreshing:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Export to CSV ───
  const exportToCSV = () => {
    if (filteredRegistrations.length === 0) {
      alert('No records available to export.');
      return;
    }

    const headers = [
      'BIB Number',
      'Chest Number',
      'First Name',
      'Last Name',
      'Gender',
      'DOB',
      'Blood Group',
      'T-Shirt Size',
      'Email',
      'Phone',
      'City',
      'Division Category',
      'Race Type',
      'Amount Paid (INR)',
      'Payment Status',
      'Emergency Name',
      'Emergency Phone',
      'Registered At',
    ];

    const rows = filteredRegistrations.map(r => [
      `"${r.bib_number || ''}"`,
      `"${r.chest_number || ''}"`,
      `"${r.first_name || ''}"`,
      `"${r.last_name || ''}"`,
      `"${r.gender || ''}"`,
      `"${r.dob || ''}"`,
      `"${r.blood_group || ''}"`,
      `"${r.t_shirt_size || ''}"`,
      `"${r.email || ''}"`,
      `"${r.phone || ''}"`,
      `"${r.city || ''}"`,
      `"${r.category || ''}"`,
      `"${r.race_type || ''}"`,
      `"${r.amount || 0}"`,
      `"${r.payment_status || 'pending'}"`,
      `"${r.emergency_name || ''}"`,
      `"${r.emergency_phone || ''}"`,
      `"${new Date(r.created_at).toLocaleString('en-IN')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `miles4smiles_registrations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ─── Create New Runner (On-Spot) ───
  const handleSaveNewRunner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRunnerData.first_name || !newRunnerData.phone) {
      alert('Please fill out at least First Name and Phone Number.');
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-volunteer-passcode': passcode,
        },
        body: JSON.stringify(newRunnerData),
      });
      const data = await res.json();
      if (data.success) {
        setRegistrations(prev => [data.registration, ...prev]);
        setIsAddingNew(false);
        setNewRunnerData({
          first_name: '',
          last_name: '',
          gender: 'Male',
          blood_group: 'O+',
          dob: '2000-01-01',
          weight: '',
          height: '',
          t_shirt_size: 'M',
          email: '',
          phone: '',
          city: 'Pune',
          emergency_name: '',
          emergency_phone: '',
          category: 'Male',
          race_type: 'Competitive 5K',
          amount: 249,
          payment_status: 'paid',
        });
        alert(`Runner registered successfully! Assigned BIB: ${data.registration.bib_number}`);
      } else {
        alert(`Failed to register: ${data.error}`);
      }
    } catch (err) {
      alert('Network error while registering participant.');
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasscode('');
    sessionStorage.removeItem('m4s_desk_passcode');
  };

  // ─── Analytics Metrics (Check-in focused) ───
  const metrics = useMemo(() => {
    const total = registrations.length;
    const paidList = registrations.filter(r => r.payment_status === 'paid');
    const pendingList = registrations.filter(r => r.payment_status === 'pending');

    const maleCount = registrations.filter(r => (r.category || '').toLowerCase() === 'male').length;
    const femaleCount = registrations.filter(r => (r.category || '').toLowerCase() === 'female').length;
    const seniorCount = registrations.filter(r => (r.category || '').toLowerCase().includes('senior')).length;

    const compCount = registrations.filter(r => (r.race_type || '').toLowerCase().includes('comp')).length;
    const joyCount = registrations.filter(r => (r.race_type || '').toLowerCase().includes('non') || (r.race_type || '').toLowerCase().includes('joy')).length;

    const paidRate = total > 0 ? Math.round((paidList.length / total) * 100) : 0;

    return {
      total,
      paid: paidList.length,
      pending: pendingList.length,
      paidRate,
      male: maleCount,
      female: femaleCount,
      senior: seniorCount,
      competitive: compCount,
      joy: joyCount,
    };
  }, [registrations]);

  // ─── Filtered List ───
  const filteredRegistrations = useMemo(() => {
    return registrations.filter(runner => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        runner.first_name.toLowerCase().includes(q) ||
        runner.last_name.toLowerCase().includes(q) ||
        runner.email.toLowerCase().includes(q) ||
        runner.phone.includes(q) ||
        (runner.bib_number && runner.bib_number.toLowerCase().includes(q)) ||
        (runner.chest_number && runner.chest_number.includes(q)) ||
        runner.city.toLowerCase().includes(q);

      const matchStatus = statusFilter === 'all' || runner.payment_status === statusFilter;
      const matchCategory =
        categoryFilter === 'all' ||
        (categoryFilter === 'senior' && (runner.category || '').toLowerCase().includes('senior')) ||
        (categoryFilter === 'female' && (runner.category || '').toLowerCase() === 'female') ||
        (categoryFilter === 'male' && (runner.category || '').toLowerCase() === 'male');

      const matchRaceType =
        raceTypeFilter === 'all' ||
        (raceTypeFilter === 'competitive' && (runner.race_type || '').toLowerCase().includes('comp')) ||
        (raceTypeFilter === 'non-competitive' && ((runner.race_type || '').toLowerCase().includes('non') || (runner.race_type || '').toLowerCase().includes('joy')));

      return matchSearch && matchStatus && matchCategory && matchRaceType;
    });
  }, [registrations, searchQuery, statusFilter, categoryFilter, raceTypeFilter]);

  // ═════════════════════════════════════════════════════════════════════
  // VIEW: Passcode Gate Screen
  // ═════════════════════════════════════════════════════════════════════
  if (!isAuthenticated) {
    return (
      <div className="desk-login-wrapper">
        <style>{`
          .desk-login-wrapper {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: radial-gradient(circle at 50% 20%, #1e3a8a 0%, #081333 100%);
            font-family: 'Inter', system-ui, sans-serif;
            padding: 20px;
            color: #0f172a;
          }
          .login-card {
            width: 100%;
            max-width: 420px;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 24px;
            padding: 36px 28px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
            text-align: center;
          }
          .login-icon {
            width: 58px;
            height: 58px;
            border-radius: 16px;
            background: #0b1a4a;
            color: #38bdf8;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 16px;
            box-shadow: 0 8px 24px rgba(11, 26, 74, 0.25);
          }
          .login-input {
            width: 100%;
            padding: 13px 16px;
            background: #f8fafc;
            border: 1.5px solid #cbd5e1;
            border-radius: 12px;
            color: #0f172a;
            font-size: 15px;
            outline: none;
            transition: all 0.2s;
          }
          .login-input:focus {
            border-color: #0284c7;
            background: #ffffff;
            box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
          }
          .login-btn {
            width: 100%;
            padding: 13px;
            background: linear-gradient(135deg, #0b1a4a 0%, #173b9e 100%);
            color: #ffffff;
            font-weight: 800;
            font-size: 14px;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.2s;
            margin-top: 16px;
            box-shadow: 0 6px 20px rgba(11, 26, 74, 0.25);
          }
          .login-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(11, 26, 74, 0.35);
          }
          .login-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        `}</style>

        <div className="login-card">
          <div className="login-icon">
            <Lock size={26} />
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
            <Sparkles size={12} /> Volunteer Portal
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', marginBottom: '4px', letterSpacing: '-0.02em' }}>
            Registration Desk
          </h2>
          <p style={{ color: '#64748b', fontSize: '13.5px', marginBottom: '22px' }}>
            Participant Check-in & On-Spot Registration
          </p>

          <form onSubmit={handleLoginSubmit}>
            <div style={{ position: 'relative', marginBottom: '14px', textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Desk Access Passcode
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPasscode ? 'text' : 'password'}
                  placeholder="Enter desk passcode..."
                  value={passcode}
                  onChange={e => setPasscode(e.target.value)}
                  className="login-input"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                  }}
                >
                  {showPasscode ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {authError && (
              <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', padding: '9px 12px', borderRadius: '10px', color: '#b91c1c', fontSize: '13px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert size={16} />
                <span>{authError}</span>
              </div>
            )}

            <button type="submit" disabled={isVerifying || !passcode.trim()} className="login-btn">
              {isVerifying ? 'Verifying Passcode...' : 'Open Registration Desk'}
            </button>
          </form>

          <div style={{ marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
            <Link href="/" style={{ color: '#64748b', fontSize: '12.5px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              ← Return to Main Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════════
  // VIEW: Main Desk Portal (Executive UI with CSV Export & Views Tracker)
  // ═════════════════════════════════════════════════════════════════════
  return (
    <div className="desk-container">
      <style>{`
        .desk-container {
          min-height: 100vh;
          background: #f8fafc;
          color: #0f172a;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          padding-bottom: 60px;
        }

        /* Top Royal Blue Navbar */
        .desk-nav {
          background: #0b1a4a;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          padding: 12px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 4px 20px rgba(11, 26, 74, 0.25);
        }

        /* ─── Executive Metric Card Styling ─── */
        .exec-stat-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04), 0 4px 12px rgba(15, 23, 42, 0.02);
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s;
          position: relative;
        }
        .exec-stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.07);
        }

        .stat-icon-bubble {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .table-shell {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }

        .table-row-hover:hover {
          background: #f8fafc;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .status-paid {
          background: #dcfce7;
          color: #15803d;
          border: 1px solid #bbf7d0;
        }
        .status-pending {
          background: #fef3c7;
          color: #b45309;
          border: 1px solid #fde68a;
        }

        .filter-btn {
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid #e2e8f0;
          background: #f1f5f9;
          color: #475569;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .filter-btn:hover {
          background: #e2e8f0;
        }
        .filter-btn.active {
          background: #0b1a4a;
          color: #ffffff;
          border-color: #0b1a4a;
          font-weight: 700;
        }

        /* Mobile Card View Styles */
        .mobile-card {
          display: none;
        }

        /* Modal Styles with Robust Internal Scroll */
        .runner-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(6px);
          z-index: 999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }
        .runner-modal {
          width: 100%;
          max-width: 620px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 25px 60px rgba(15, 23, 42, 0.35);
          display: flex;
          flex-direction: column;
          max-height: 88vh;
        }
        .modal-body-scroll {
          padding: 22px 24px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          overflow-y: scroll;
          overscroll-behavior: contain;
          -webkit-overflow-scrolling: touch;
          min-height: 0;
          flex: 1 1 auto;
        }
        .modal-body-scroll::-webkit-scrollbar {
          width: 7px;
        }
        .modal-body-scroll::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .modal-body-scroll::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }

        .form-input {
          width: 100%;
          padding: 10px 12px;
          background: #f8fafc;
          border: 1.5px solid #cbd5e1;
          border-radius: 10px;
          color: #0f172a;
          font-size: 13.5px;
          outline: none;
        }
        .form-input:focus {
          border-color: #0284c7;
          background: #ffffff;
          box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.15);
        }
        .form-input-locked {
          background: #f1f5f9 !important;
          color: #0f172a !important;
          font-weight: 800;
          cursor: not-allowed;
          border-color: #cbd5e1 !important;
        }
        .form-label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }

        /* ─── Responsive Queries ─── */
        @media (max-width: 840px) {
          .desktop-table-view {
            display: none !important;
          }
          .mobile-card {
            display: flex;
            flex-direction: column;
            gap: 12px;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            padding: 16px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
          }
          .desk-nav {
            padding: 10px 16px;
          }
          .metrics-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 10px !important;
          }
          .modal-body-scroll {
            grid-template-columns: 1fr !important;
            padding: 18px 16px;
          }
        }
      `}</style>

      {/* ─── Top Navbar ─── */}
      <header className="desk-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
            <Image src="/images/logo.png" alt="Miles for Smiles" width={120} height={32} style={{ height: '26px', width: 'auto' }} />
          </Link>
          <div style={{ height: '18px', width: '1px', background: 'rgba(255, 255, 255, 0.25)' }} />
          <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Race Desk
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Export CSV Button */}
          <button
            onClick={exportToCSV}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
            title="Download CSV spreadsheet of registrations"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>

          {/* Quick Add Button */}
          <button
            onClick={() => setIsAddingNew(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '10px',
              background: '#38bdf8',
              border: 'none',
              color: '#081333',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(56, 189, 248, 0.35)',
            }}
          >
            <UserPlus size={15} />
            <span>+ Add Runner</span>
          </button>

          <button
            onClick={handleRefresh}
            disabled={isLoading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 12px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            title="Refresh database"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          </button>

          <button
            onClick={handleLogout}
            style={{
              padding: '8px 12px',
              borderRadius: '10px',
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              color: '#fca5a5',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* ─── Main Content Container ─── */}
      <main style={{ maxWidth: '1360px', margin: '0 auto', padding: '20px 16px' }}>

        {/* ─── Modern Executive Metric Cards Grid ─── */}
        <div className="metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '14px', marginBottom: '16px' }}>
          
          {/* Card 1: Total Registered */}
          <div className="exec-stat-card">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Total Registrations
                </span>
                <div style={{ fontSize: '28px', fontWeight: 900, color: '#0b1a4a', letterSpacing: '-0.03em', lineHeight: 1.1, marginTop: '4px' }}>
                  {metrics.total}
                </div>
              </div>

              <div className="stat-icon-bubble" style={{ background: '#eff6ff', color: '#2563eb' }}>
                <Users size={16} />
              </div>
            </div>

            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', background: '#eff6ff', color: '#1d4ed8', padding: '2px 7px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>
                <Sparkles size={11} /> Live DB
              </span>
              <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                General Runners
              </span>
            </div>
          </div>

          {/* Card 2: Confirmed Paid */}
          <div className="exec-stat-card">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#166534', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Confirmed Paid
                </span>
                <div style={{ fontSize: '28px', fontWeight: 900, color: '#16a34a', letterSpacing: '-0.03em', lineHeight: 1.1, marginTop: '4px' }}>
                  {metrics.paid}
                </div>
              </div>

              <div className="stat-icon-bubble" style={{ background: '#dcfce7', color: '#16a34a' }}>
                <CheckCircle2 size={16} />
              </div>
            </div>

            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', background: '#dcfce7', color: '#15803d', padding: '2px 7px', borderRadius: '6px', fontSize: '11px', fontWeight: 800 }}>
                {metrics.paidRate}% Verified
              </span>
              <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                Ready for Pickup
              </span>
            </div>
          </div>

          {/* Card 3: Pending Verification */}
          <div className="exec-stat-card">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#92400e', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Pending Verification
                </span>
                <div style={{ fontSize: '28px', fontWeight: 900, color: '#d97706', letterSpacing: '-0.03em', lineHeight: 1.1, marginTop: '4px' }}>
                  {metrics.pending}
                </div>
              </div>

              <div className="stat-icon-bubble" style={{ background: '#fef3c7', color: '#d97706' }}>
                <Clock size={16} />
              </div>
            </div>

            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', background: '#fef3c7', color: '#b45309', padding: '2px 7px', borderRadius: '6px', fontSize: '11px', fontWeight: 800 }}>
                Action Req
              </span>
              <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                Awaiting Spot Pay
              </span>
            </div>
          </div>

          {/* Card 4: Divisions Micro-Grid */}
          <div className="exec-stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Category Divisions
              </span>
              <div className="stat-icon-bubble" style={{ background: '#f1f5f9', color: '#475569' }}>
                <Layers size={15} />
              </div>
            </div>

            {/* 3 Proportional Micro Stat Boxes */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginTop: '2px' }}>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '5px 4px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>MALE</div>
                <div style={{ fontSize: '15px', fontWeight: 900, color: '#2563eb' }}>{metrics.male}</div>
              </div>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '5px 4px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>FEMALE</div>
                <div style={{ fontSize: '15px', fontWeight: 900, color: '#db2777' }}>{metrics.female}</div>
              </div>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '5px 4px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>SENIOR</div>
                <div style={{ fontSize: '15px', fontWeight: 900, color: '#d97706' }}>{metrics.senior}</div>
              </div>
            </div>
          </div>

        </div>

        {/* ─── Home Page Traffic & Views Live Analytics Bar ─── */}
        <div style={{ background: 'linear-gradient(135deg, #0b1a4a 0%, #1e3a8a 100%)', borderRadius: '16px', padding: '16px 20px', color: '#ffffff', marginBottom: '18px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '14px', boxShadow: '0 4px 16px rgba(11, 26, 74, 0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Globe size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Home Page Traffic & Visitors
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(34, 197, 94, 0.25)', color: '#4ade80', padding: '2px 8px', borderRadius: '999px', fontSize: '10.5px', fontWeight: 800 }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', animation: 'pulse 1.5s infinite' }} />
                  Vercel Analytics Active
                </span>
              </div>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'rgba(255, 255, 255, 0.75)' }}>
                Unique landing page visitors (deduplicated per browser session)
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '8px 16px', borderRadius: '10px', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
              <div style={{ fontSize: '10.5px', color: 'rgba(255, 255, 255, 0.7)', fontWeight: 700, textTransform: 'uppercase' }}>Home Page Views</div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#38bdf8' }}>{pageViews.homeViews.toLocaleString()}</div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '8px 16px', borderRadius: '10px', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
              <div style={{ fontSize: '10.5px', color: 'rgba(255, 255, 255, 0.7)', fontWeight: 700, textTransform: 'uppercase' }}>Bounce Rate</div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: pageViews.bounceRate <= 40 ? '#4ade80' : '#f59e0b' }}>
                {pageViews.bounceRate}%
              </div>
            </div>
          </div>
        </div>

        {/* ─── Search & Filters Bar ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '14px 16px', marginBottom: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ position: 'relative', flex: '1 1 260px', minWidth: '220px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search runner by Name, Phone, BIB, Chest, City..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 36px',
                  background: '#f8fafc',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '10px',
                  color: '#0f172a',
                  fontSize: '13.5px',
                  outline: 'none',
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div style={{ fontSize: '12.5px', color: '#64748b', fontWeight: 600 }}>
              Showing <strong style={{ color: '#0f172a' }}>{filteredRegistrations.length}</strong> of {registrations.length} runners
            </div>
          </div>

          {/* Filter Chips (Horizontal scrollable on mobile) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginRight: '2px', whiteSpace: 'nowrap' }}>
              Status:
            </span>
            <button className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`} onClick={() => setStatusFilter('all')}>
              All ({registrations.length})
            </button>
            <button className={`filter-btn ${statusFilter === 'paid' ? 'active' : ''}`} onClick={() => setStatusFilter('paid')}>
              Paid ({metrics.paid})
            </button>
            <button className={`filter-btn ${statusFilter === 'pending' ? 'active' : ''}`} onClick={() => setStatusFilter('pending')}>
              Pending ({metrics.pending})
            </button>

            <div style={{ width: '1px', height: '18px', background: '#cbd5e1', margin: '0 4px', flexShrink: 0 }} />

            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginRight: '2px', whiteSpace: 'nowrap' }}>
              Category:
            </span>
            <button className={`filter-btn ${categoryFilter === 'all' ? 'active' : ''}`} onClick={() => setCategoryFilter('all')}>
              All
            </button>
            <button className={`filter-btn ${categoryFilter === 'male' ? 'active' : ''}`} onClick={() => setCategoryFilter('male')}>
              Male
            </button>
            <button className={`filter-btn ${categoryFilter === 'female' ? 'active' : ''}`} onClick={() => setCategoryFilter('female')}>
              Female
            </button>
            <button className={`filter-btn ${categoryFilter === 'senior' ? 'active' : ''}`} onClick={() => setCategoryFilter('senior')}>
              Senior 40+
            </button>
          </div>
        </div>

        {/* ─── 1. Desktop Table View (Large Screens) ─── */}
        <div className="table-shell desktop-table-view">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.08em' }}>
                  <th style={{ padding: '14px 16px' }}>BIB / Chest</th>
                  <th style={{ padding: '14px 16px' }}>Runner Details</th>
                  <th style={{ padding: '14px 16px' }}>Contact</th>
                  <th style={{ padding: '14px 16px' }}>Category & Kit</th>
                  <th style={{ padding: '14px 16px' }}>Race Tier</th>
                  <th style={{ padding: '14px 16px' }}>Status</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right' }}>View Profile</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
                      No participants match your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredRegistrations.map((runner, index) => (
                    <tr
                      key={runner.id || index}
                      className="table-row-hover"
                      style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}
                    >
                      {/* BIB & Chest */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontWeight: 800, color: '#0b1a4a', fontSize: '13.5px' }}>
                            {runner.bib_number || 'Pending'}
                          </span>
                          {runner.bib_number && (
                            <button
                              onClick={() => copyToClipboard(runner.bib_number, `bib_${runner.id}`)}
                              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
                              title="Copy BIB"
                            >
                              {copiedId === `bib_${runner.id}` ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                            </button>
                          )}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          Chest #{runner.chest_number || '—'}
                        </div>
                      </td>

                      {/* Runner Name & Gender */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>
                          {runner.first_name} {runner.last_name}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                          {runner.gender} • DOB: {runner.dob || '—'}
                        </div>
                      </td>

                      {/* Contact Info & WhatsApp shortcut */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <a
                            href={`tel:${runner.phone}`}
                            style={{ color: '#0f172a', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
                          >
                            <Phone size={12} color="#0b1a4a" />
                            <span>{runner.phone}</span>
                          </a>

                          <a
                            href={`https://wa.me/91${runner.phone.replace(/[^0-9]/g, '').slice(-10)}?text=${encodeURIComponent(`Hi ${runner.first_name}, regarding your Miles for Smiles 5K Run registration (BIB: ${runner.bib_number || 'Pending'}).`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              background: '#dcfce7',
                              color: '#15803d',
                              border: '1px solid #bbf7d0',
                              borderRadius: '4px',
                              padding: '2px 5px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              textDecoration: 'none',
                              fontSize: '10.5px',
                              fontWeight: 700,
                            }}
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle size={10} style={{ marginRight: '2px' }} /> WA
                          </a>
                        </div>
                        <div style={{ color: '#64748b', fontSize: '11.5px', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '3px' }}>
                          <Mail size={12} />
                          <span style={{ maxWidth: '170px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {runner.email}
                          </span>
                        </div>
                      </td>

                      {/* Category & Kit */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 700, color: '#2563eb' }}>
                          {runner.category || 'General'}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                          T-Shirt: <strong style={{ color: '#0f172a' }}>{runner.t_shirt_size || 'M'}</strong> | Blood: {runner.blood_group || '—'}
                        </div>
                      </td>

                      {/* Race Type */}
                      <td style={{ padding: '12px 16px' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            background:
                              (runner.race_type || '').includes('Comp')
                                ? '#dcfce7'
                                : '#e0f2fe',
                            color:
                              (runner.race_type || '').includes('Comp') ? '#15803d' : '#0369a1',
                            border: '1px solid #cbd5e1',
                          }}
                        >
                          {runner.race_type || '5K Run'}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '12px 16px' }}>
                        <span className={`status-badge ${runner.payment_status === 'paid' ? 'status-paid' : 'status-pending'}`}>
                          {runner.payment_status === 'paid' ? (
                            <>
                              <CheckCircle2 size={12} /> PAID
                            </>
                          ) : (
                            <>
                              <Clock size={12} /> PENDING
                            </>
                          )}
                        </span>
                      </td>

                      {/* View Details Only */}
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <button
                          onClick={() => setSelectedRunner(runner)}
                          style={{
                            background: '#f1f5f9',
                            color: '#0b1a4a',
                            border: '1px solid #cbd5e1',
                            padding: '5px 12px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ─── 2. Mobile & Tablet Card List View (< 840px) ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredRegistrations.length === 0 ? (
            <div style={{ padding: '36px', textAlign: 'center', background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', color: '#94a3b8' }}>
              No participants match your search criteria.
            </div>
          ) : (
            filteredRegistrations.map((runner, index) => (
              <div key={`mob_${runner.id || index}`} className="mobile-card">
                {/* Top Row: BIB + Status Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontWeight: 900, color: '#0b1a4a', fontSize: '15px' }}>
                      {runner.bib_number || 'Pending'}
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748b', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                      #{runner.chest_number || '—'}
                    </span>
                  </div>

                  <span className={`status-badge ${runner.payment_status === 'paid' ? 'status-paid' : 'status-pending'}`}>
                    {runner.payment_status === 'paid' ? 'PAID' : 'PENDING'}
                  </span>
                </div>

                {/* Middle Row: Name + Category & Tier */}
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                    {runner.first_name} {runner.last_name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                    <strong style={{ color: '#2563eb' }}>{runner.category}</strong> • {runner.race_type || '5K Run'} • T-Shirt: <strong>{runner.t_shirt_size}</strong>
                  </div>
                </div>

                {/* Bottom Row: Actions (Call, WhatsApp, Details) */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <a
                      href={`tel:${runner.phone}`}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        background: '#f1f5f9',
                        color: '#0f172a',
                        textDecoration: 'none',
                        fontSize: '12px',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <Phone size={12} color="#0b1a4a" /> Call
                    </a>

                    <a
                      href={`https://wa.me/91${runner.phone.replace(/[^0-9]/g, '').slice(-10)}?text=${encodeURIComponent(`Hi ${runner.first_name}, regarding your Miles for Smiles 5K Run registration (BIB: ${runner.bib_number || 'Pending'}).`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        background: '#dcfce7',
                        color: '#15803d',
                        textDecoration: 'none',
                        fontSize: '12px',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        border: '1px solid #bbf7d0',
                      }}
                    >
                      <MessageCircle size={12} /> WhatsApp
                    </a>
                  </div>

                  <button
                    onClick={() => setSelectedRunner(runner)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      background: '#0b1a4a',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* ═════════════════════════════════════════════════════════════════
          MODAL: ON-SPOT REGISTRATION DESK
         ═════════════════════════════════════════════════════════════════ */}
      {isAddingNew && (
        <div className="runner-modal-backdrop" onClick={() => setIsAddingNew(false)}>
          <div className="runner-modal" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSaveNewRunner} style={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '88vh', overflow: 'hidden' }}>
              <div style={{ padding: '18px 22px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <UserPlus size={18} color="#0284c7" />
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    On-Spot Registration Desk
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="modal-body-scroll">
                <div>
                  <label className="form-label">First Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter first name"
                    value={newRunnerData.first_name}
                    onChange={e => setNewRunnerData({ ...newRunnerData, first_name: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Last Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter last name"
                    value={newRunnerData.last_name}
                    onChange={e => setNewRunnerData({ ...newRunnerData, last_name: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={newRunnerData.phone}
                    onChange={e => setNewRunnerData({ ...newRunnerData, phone: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    placeholder="runner@example.com"
                    value={newRunnerData.email}
                    onChange={e => setNewRunnerData({ ...newRunnerData, email: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">Gender</label>
                  <select
                    value={newRunnerData.gender}
                    onChange={e => setNewRunnerData({ ...newRunnerData, gender: e.target.value, category: e.target.value === 'Female' ? 'Female' : 'Male' })}
                    className="form-input"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Date of Birth</label>
                  <input
                    type="date"
                    value={newRunnerData.dob}
                    onChange={e => setNewRunnerData({ ...newRunnerData, dob: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">T-Shirt Size</label>
                  <select
                    value={newRunnerData.t_shirt_size}
                    onChange={e => setNewRunnerData({ ...newRunnerData, t_shirt_size: e.target.value })}
                    className="form-input"
                  >
                    <option value="S">S (Small)</option>
                    <option value="M">M (Medium)</option>
                    <option value="L">L (Large)</option>
                    <option value="XL">XL (Extra Large)</option>
                    <option value="XXL">XXL (Double Extra Large)</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Blood Group</label>
                  <select
                    value={newRunnerData.blood_group}
                    onChange={e => setNewRunnerData({ ...newRunnerData, blood_group: e.target.value })}
                    className="form-input"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                {/* Race Tier Selection (Auto updates & locks amount) */}
                <div>
                  <label className="form-label">Race Tier *</label>
                  <select
                    value={newRunnerData.race_type}
                    onChange={e => {
                      const tier = e.target.value;
                      const price = tier === 'Competitive 5K' ? 249 : 149;
                      setNewRunnerData({ ...newRunnerData, race_type: tier, amount: price });
                    }}
                    className="form-input"
                  >
                    <option value="Competitive 5K">Competitive 5K (₹249)</option>
                    <option value="Non-Competitive 5K">Non-Competitive 5K (₹149)</option>
                  </select>
                </div>

                {/* Amount Collected (LOCKED / READ-ONLY) */}
                <div>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Amount Collected</span>
                    <span style={{ color: '#16a34a', fontSize: '10.5px', fontWeight: 800 }}>🔒 Auto-Locked</span>
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={`₹${newRunnerData.amount}`}
                    className="form-input form-input-locked"
                    title="Amount is auto-calculated based on race tier"
                  />
                </div>

                <div>
                  <label className="form-label">Payment Mode</label>
                  <select
                    value={newRunnerData.payment_status}
                    onChange={e => setNewRunnerData({ ...newRunnerData, payment_status: e.target.value as 'paid' | 'pending' })}
                    className="form-input"
                  >
                    <option value="paid">PAID (Cash / Spot QR Code)</option>
                    <option value="pending">PENDING</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    value={newRunnerData.city}
                    onChange={e => setNewRunnerData({ ...newRunnerData, city: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">Emergency Contact Name</label>
                  <input
                    type="text"
                    placeholder="Contact person"
                    value={newRunnerData.emergency_name}
                    onChange={e => setNewRunnerData({ ...newRunnerData, emergency_name: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Emergency Contact Phone</label>
                  <input
                    type="tel"
                    placeholder="Emergency phone"
                    value={newRunnerData.emergency_phone}
                    onChange={e => setNewRunnerData({ ...newRunnerData, emergency_phone: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ padding: '16px 22px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '10px', flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  style={{ padding: '10px 18px', borderRadius: '10px', background: '#e2e8f0', color: '#334155', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  style={{ padding: '10px 22px', borderRadius: '10px', background: '#0b1a4a', color: '#38bdf8', border: 'none', cursor: 'pointer', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <UserPlus size={15} />
                  <span>{isSaving ? 'Registering...' : 'Register Participant'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════
          MODAL: VIEW RUNNER PROFILE DETAILS
         ═════════════════════════════════════════════════════════════════ */}
      {selectedRunner && (
        <div className="runner-modal-backdrop" onClick={() => setSelectedRunner(null)}>
          <div className="runner-modal" onClick={e => e.stopPropagation()}>
            <div style={{ padding: '18px 22px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#0284c7', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Participant Details
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', margin: '2px 0 0' }}>
                  {selectedRunner.first_name} {selectedRunner.last_name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRunner(null)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '22px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13px', overflowY: 'auto', overscrollBehavior: 'contain', flex: 1, minHeight: 0 }}>
              <div>
                <div style={{ color: '#64748b', fontSize: '11.5px', fontWeight: 600 }}>BIB NUMBER</div>
                <div style={{ fontWeight: 900, color: '#0b1a4a', fontSize: '17px' }}>{selectedRunner.bib_number || 'Pending'}</div>
              </div>

              <div>
                <div style={{ color: '#64748b', fontSize: '11.5px', fontWeight: 600 }}>CHEST NUMBER</div>
                <div style={{ fontWeight: 900, color: '#0f172a', fontSize: '17px' }}>#{selectedRunner.chest_number || '—'}</div>
              </div>

              <div>
                <div style={{ color: '#64748b', fontSize: '11.5px', fontWeight: 600 }}>DIVISION CATEGORY</div>
                <div style={{ fontWeight: 700, color: '#2563eb' }}>{selectedRunner.category}</div>
              </div>

              <div>
                <div style={{ color: '#64748b', fontSize: '11.5px', fontWeight: 600 }}>RACE TIER</div>
                <div style={{ fontWeight: 700, color: '#16a34a' }}>{selectedRunner.race_type || 'Unknown'}</div>
              </div>

              <div>
                <div style={{ color: '#64748b', fontSize: '11.5px', fontWeight: 600 }}>PHONE</div>
                <div style={{ color: '#0f172a', fontWeight: 700 }}>{selectedRunner.phone}</div>
              </div>

              <div>
                <div style={{ color: '#64748b', fontSize: '11.5px', fontWeight: 600 }}>EMAIL</div>
                <div style={{ color: '#0f172a', wordBreak: 'break-all' }}>{selectedRunner.email}</div>
              </div>

              <div>
                <div style={{ color: '#64748b', fontSize: '11.5px', fontWeight: 600 }}>T-SHIRT & BLOOD GROUP</div>
                <div style={{ color: '#0f172a' }}>Size: <strong>{selectedRunner.t_shirt_size}</strong> | Blood: {selectedRunner.blood_group}</div>
              </div>

              <div>
                <div style={{ color: '#64748b', fontSize: '11.5px', fontWeight: 600 }}>CITY</div>
                <div style={{ color: '#0f172a' }}>{selectedRunner.city}</div>
              </div>

              <div style={{ gridColumn: 'span 2', background: '#fee2e2', padding: '12px 14px', borderRadius: '12px', border: '1px solid #fca5a5' }}>
                <div style={{ color: '#b91c1c', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>EMERGENCY CONTACT</div>
                <div style={{ color: '#7f1d1d', fontWeight: 700, marginTop: '2px' }}>
                  {selectedRunner.emergency_name} — {selectedRunner.emergency_phone}
                </div>
              </div>
            </div>

            <div style={{ padding: '14px 22px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', flexShrink: 0 }}>
              <button
                onClick={() => setSelectedRunner(null)}
                style={{ padding: '9px 22px', borderRadius: '10px', background: '#0b1a4a', color: '#ffffff', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
