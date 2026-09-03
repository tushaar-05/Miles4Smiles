'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Users,
  Search,
  RefreshCw,
  Eye,
  EyeOff,
  ShieldAlert,
  X,
  Download,
  Award,
  ExternalLink,
  GraduationCap,
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

export default function VolunteerDeskPage() {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Active Desk Section: 'nst' | 'general'
  const [activeSection, setActiveSection] = useState<'nst' | 'general'>('nst');

  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [justRefreshed, setJustRefreshed] = useState(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [yearFilter, setYearFilter] = useState<'all' | '1st' | '2nd'>('all');
  const [raceTypeFilter, setRaceTypeFilter] = useState<'all' | 'competitive' | 'non-competitive' | 'pending'>('all');

  // Modals & States
  const [selectedRunner, setSelectedRunner] = useState<RegistrationRecord | null>(null);

  // Auto-authenticate with session storage
  useEffect(() => {
    const saved = sessionStorage.getItem('m4s_volunteer_passcode');
    if (saved) {
      setPasscode(saved);
      verifyAndLoad(saved);
    }
  }, []);

  // ⚡ 100% Automated Background Live Sync (Every 20 seconds)
  useEffect(() => {
    if (!isAuthenticated || !passcode) return;
    const interval = setInterval(() => {
      fetch('/api/admin/registrations', {
        headers: { 'x-volunteer-passcode': passcode },
      })
        .then(r => r.json())
        .then(data => {
          if (data.success && data.registrations) {
            setRegistrations(data.registrations);
          }
        })
        .catch(err => console.error('Silent desk auto-sync notice:', err));
    }, 20000);

    return () => clearInterval(interval);
  }, [isAuthenticated, passcode]);

  const verifyAndLoad = async (codeToVerify: string) => {
    setIsVerifying(true);
    setAuthError('');
    try {
      const res = await fetch('/api/admin/registrations', {
        headers: { 'x-volunteer-passcode': codeToVerify },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setAuthError(data.error || 'Invalid passcode. Access denied.');
        setIsAuthenticated(false);
        sessionStorage.removeItem('m4s_volunteer_passcode');
      } else {
        setIsAuthenticated(true);
        sessionStorage.setItem('m4s_volunteer_passcode', codeToVerify);
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
      const res = await fetch(`/api/admin/registrations`, {
        headers: { 'x-volunteer-passcode': passcode },
      });
      const data = await res.json();
      if (data.success) {
        setRegistrations(data.registrations || []);
        setJustRefreshed(true);
        setTimeout(() => setJustRefreshed(false), 2000);
      }
    } catch (err) {
      console.error('Error refreshing data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasscode('');
    sessionStorage.removeItem('m4s_volunteer_passcode');
  };

  // ─── Data Splitting: NST Students vs General Audience ───
  const nstRegistrations = useMemo(() => {
    return registrations.filter(r => 
      (r.category || '').toLowerCase().includes('nst') || 
      (r.email || '').includes('@adypu.edu.in') ||
      (r.city || '').toLowerCase().includes('nst')
    );
  }, [registrations]);

  const generalRegistrations = useMemo(() => {
    return registrations.filter(r => 
      !(r.category || '').toLowerCase().includes('nst') && 
      !(r.email || '').includes('@adypu.edu.in') &&
      !(r.city || '').toLowerCase().includes('nst')
    );
  }, [registrations]);

  // ─── Metrics ───
  const nstMetrics = useMemo(() => {
    const total = nstRegistrations.length;
    const paidList = nstRegistrations.filter(r => r.payment_status === 'paid');
    const pendingList = nstRegistrations.filter(r => r.payment_status === 'pending');
    const firstYear = nstRegistrations.filter(r => (r.city || '').includes('1st') || (r.dob || '').includes('1st')).length;
    const secondYear = total - firstYear;
    const competitive = nstRegistrations.filter(r => (r.race_type || '').toLowerCase().includes('comp') && !(r.race_type || '').toLowerCase().includes('non')).length;
    const joy = nstRegistrations.filter(r => (r.race_type || '').toLowerCase().includes('joy') || (r.race_type || '').toLowerCase().includes('non')).length;
    const unassigned = total - competitive - joy;

    return { total, paid: paidList.length, pending: pendingList.length, firstYear, secondYear, competitive, joy, unassigned };
  }, [nstRegistrations]);

  const generalMetrics = useMemo(() => {
    const total = generalRegistrations.length;
    const paidList = generalRegistrations.filter(r => r.payment_status === 'paid');
    const pendingList = generalRegistrations.filter(r => r.payment_status === 'pending');
    const competitive = generalRegistrations.filter(r => (r.race_type || '').toLowerCase().includes('comp') && !(r.race_type || '').toLowerCase().includes('non')).length;
    const joy = total - competitive;

    return { total, paid: paidList.length, pending: pendingList.length, competitive, joy };
  }, [generalRegistrations]);

  // Helper to extract URN and Year from NST record
  const getStudentURN = (runner: RegistrationRecord) => {
    const m = (runner.city || '').match(/URN:\s*([A-Za-z0-9]+)/);
    if (m && m[1]) return m[1].toUpperCase();
    if (runner.email && runner.email.startsWith('e2')) return runner.email.split('@')[0].toUpperCase();
    return '—';
  };

  const getStudentYear = (runner: RegistrationRecord) => {
    if ((runner.city || '').includes('2nd') || (runner.email || '').startsWith('e25')) return '2nd Year';
    return '1st Year';
  };

  // ─── Filtered NST List ───
  const filteredNST = useMemo(() => {
    return nstRegistrations.filter(r => {
      const q = searchQuery.toLowerCase().trim();
      const urn = getStudentURN(r).toLowerCase();
      const matchSearch =
        !q ||
        r.first_name.toLowerCase().includes(q) ||
        r.last_name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        urn.includes(q) ||
        (r.bib_number && r.bib_number.toLowerCase().includes(q));

      const yr = getStudentYear(r);
      const matchYear =
        yearFilter === 'all' ||
        (yearFilter === '1st' && yr === '1st Year') ||
        (yearFilter === '2nd' && yr === '2nd Year');

      const matchStatus = statusFilter === 'all' || r.payment_status === statusFilter;

      const matchRaceType =
        raceTypeFilter === 'all' ||
        (raceTypeFilter === 'competitive' && (r.race_type || '').toLowerCase().includes('comp') && !(r.race_type || '').toLowerCase().includes('non')) ||
        (raceTypeFilter === 'non-competitive' && ((r.race_type || '').toLowerCase().includes('non') || (r.race_type || '').toLowerCase().includes('joy'))) ||
        (raceTypeFilter === 'pending' && (r.race_type || '').toLowerCase().includes('pending'));

      return matchSearch && matchYear && matchStatus && matchRaceType;
    });
  }, [nstRegistrations, searchQuery, yearFilter, statusFilter, raceTypeFilter]);

  // ─── Filtered General List ───
  const filteredGeneral = useMemo(() => {
    return generalRegistrations.filter(r => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        r.first_name.toLowerCase().includes(q) ||
        r.last_name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        (r.bib_number && r.bib_number.toLowerCase().includes(q)) ||
        r.city.toLowerCase().includes(q);

      const matchStatus = statusFilter === 'all' || r.payment_status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [generalRegistrations, searchQuery, statusFilter]);

  // ─── CSV Export ───
  const exportDeskCSV = () => {
    const list = activeSection === 'nst' ? filteredNST : filteredGeneral;
    if (list.length === 0) return alert('No records to export.');

    const headers = ['BIB Number', 'Chest #', 'Name', 'Affiliation / City', 'Gender', 'Race Tier', 'T-Shirt Size', 'Phone', 'Email', 'Payment Status'];
    const rows = list.map(r => {
      const isNst = (r.category || '').toLowerCase().includes('nst');
      return [
        `"${r.bib_number || ''}"`,
        `"${r.chest_number || ''}"`,
        `"${r.first_name} ${r.last_name}"`,
        `"${isNst ? getStudentURN(r) : r.city}"`,
        `"${r.gender || ''}"`,
        `"${r.race_type || 'Competitive 5K'}"`,
        `"${r.t_shirt_size || 'M'}"`,
        `"${r.phone}"`,
        `"${r.email}"`,
        `"${r.payment_status}"`,
      ];
    });

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `volunteer_desk_${activeSection}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ─── Unauthenticated Login Screen ───
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #070d1e 0%, #0369a1 50%, #081333 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'var(--font-heading)' }}>
        <div style={{ background: '#ffffff', borderRadius: '24px', maxWidth: '440px', width: '100%', padding: '40px 36px', boxShadow: '0 25px 60px -15px rgba(0,0,0,0.6)', textAlign: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
          {/* Logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <div style={{ background: '#081333', padding: '10px 20px', borderRadius: '14px', display: 'inline-flex', alignItems: 'center', boxShadow: '0 4px 12px rgba(8,19,51,0.3)' }}>
              <Image src="/images/logo.png" alt="Miles for Smiles" width={140} height={36} style={{ height: '30px', width: 'auto', objectFit: 'contain' }} priority />
            </div>
          </div>

          <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', marginBottom: '6px' }}>Volunteer Desk Check-in</h1>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '28px' }}>Enter desk volunteer passcode to access participant check-in & kit distribution.</p>

          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type={showPasscode ? 'text' : 'password'}
                placeholder="Enter desk passcode"
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
                style={{ width: '100%', padding: '14px 44px 14px 16px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '15px', outline: 'none', background: '#f8fafc', color: '#0f172a', fontWeight: 600 }}
                autoFocus
              />
              <button type="button" onClick={() => setShowPasscode(!showPasscode)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                {showPasscode ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {authError && (
              <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '10px', padding: '10px', color: '#dc2626', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left' }}>
                <ShieldAlert size={16} style={{ flexShrink: 0 }} />
                <span>{authError}</span>
              </div>
            )}

            <button type="submit" disabled={isVerifying} style={{ width: '100%', background: '#0284c7', color: '#fff', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: 800, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(2,132,199,0.35)' }}>
              {isVerifying ? <RefreshCw size={18} className="animate-spin" /> : 'Open Volunteer Desk'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', fontFamily: 'var(--font-heading)' }}>
      <style jsx>{`
        .filter-btn {
          background: #f1f5f9;
          color: #475569;
          border: 1px solid #e2e8f0;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .filter-btn:hover {
          background: #e2e8f0;
          color: #0f172a;
        }
        .filter-btn.active {
          background: #0284c7 !important;
          color: #ffffff !important;
          border-color: #0284c7 !important;
        }
        .table-row-hover:hover {
          background: #f8fafc !important;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* ─── Top Header ─── */}
      <header style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 40, boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
              <div style={{ background: '#081333', padding: '6px 10px', borderRadius: '10px', display: 'inline-flex', alignItems: 'center' }}>
                <Image src="/images/logo.png" alt="Miles for Smiles" width={110} height={28} style={{ height: '22px', width: 'auto', objectFit: 'contain' }} priority />
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Miles for Smiles <span style={{ fontSize: '10px', background: '#0284c7', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>VOLUNTEER DESK</span>
                </div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Race-Day Kit Handover & Check-in Console</div>
              </div>
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: justRefreshed ? '#dcfce7' : '#f1f5f9',
                color: justRefreshed ? '#15803d' : '#334155',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
              {isLoading ? 'Syncing...' : justRefreshed ? 'Synced!' : 'Refresh'}
            </button>

            <button
              onClick={handleLogout}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#fee2e2',
                color: '#b91c1c',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <ShieldAlert size={14} /> Exit
            </button>
          </div>
        </div>

        {/* ─── Volunteer Top Section Tabs (Separated Counters) ─── */}
        <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 24px', display: 'flex', gap: '8px', borderTop: '1px solid #f1f5f9' }}>
          <button
            onClick={() => { setActiveSection('nst'); setSearchQuery(''); }}
            style={{
              padding: '12px 18px',
              fontSize: '13px',
              fontWeight: 800,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              borderBottom: activeSection === 'nst' ? '3px solid #b45309' : '3px solid transparent',
              color: activeSection === 'nst' ? '#b45309' : '#64748b',
              transition: 'all 0.15s',
            }}
          >
            <GraduationCap size={16} /> NST Students & Faculty Counter
            <span style={{ background: activeSection === 'nst' ? '#fef3c7' : '#f1f5f9', color: activeSection === 'nst' ? '#b45309' : '#64748b', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 800 }}>
              {nstMetrics.total}
            </span>
          </button>

          <button
            onClick={() => { setActiveSection('general'); setSearchQuery(''); }}
            style={{
              padding: '12px 18px',
              fontSize: '13px',
              fontWeight: 800,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              borderBottom: activeSection === 'general' ? '3px solid #0284c7' : '3px solid transparent',
              color: activeSection === 'general' ? '#0284c7' : '#64748b',
              transition: 'all 0.15s',
            }}
          >
            <Users size={16} /> General Public Counter
            <span style={{ background: activeSection === 'general' ? '#eff6ff' : '#f1f5f9', color: activeSection === 'general' ? '#0284c7' : '#64748b', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 800 }}>
              {generalMetrics.total}
            </span>
          </button>
        </div>
      </header>

      {/* ─── Main Content Area ─── */}
      <main style={{ maxWidth: '1600px', margin: '0 auto', padding: '24px' }}>
        {/* ========================================================= */}
        {/* VIEW 1: NST STUDENTS DESK COUNTER                         */}
        {/* ========================================================= */}
        {activeSection === 'nst' && (
          <div>
            {/* Top Stat Summary for Desk Volunteers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              <div style={{ background: '#fff', padding: '16px', borderRadius: '16px', border: '1px solid #fde68a' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#b45309', textTransform: 'uppercase' }}>STUDENT QUEUE</div>
                <div style={{ fontSize: '26px', fontWeight: 900, color: '#b45309', marginTop: '4px' }}>{nstMetrics.total}</div>
                <div style={{ fontSize: '12px', color: '#78350f' }}>{nstMetrics.paid} Paid • {nstMetrics.pending} Pending</div>
              </div>

              <div style={{ background: '#fff', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>RACE TIERS</div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '6px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Comp (₹149): </span>
                    <strong style={{ fontSize: '16px', color: '#16a34a' }}>{nstMetrics.competitive}</strong>
                  </div>
                  <div style={{ width: '1px', height: '20px', background: '#e2e8f0' }} />
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Joy (₹99): </span>
                    <strong style={{ fontSize: '16px', color: '#0284c7' }}>{nstMetrics.joy}</strong>
                  </div>
                </div>
              </div>

              <div style={{ background: '#fff', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>BATCH DISTRIBUTION</div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '6px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>1st Year: </span>
                    <strong style={{ fontSize: '16px', color: '#0f172a' }}>{nstMetrics.firstYear}</strong>
                  </div>
                  <div style={{ width: '1px', height: '20px', background: '#e2e8f0' }} />
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>2nd Year: </span>
                    <strong style={{ fontSize: '16px', color: '#0f172a' }}>{nstMetrics.secondYear}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* NST Search Bar */}
            <div style={{ background: '#fff', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '16px', display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flex: 1, minWidth: '280px' }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                  <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Search URN (e.g. E26B...), Student Name, Phone..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px 10px 36px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', background: '#f8fafc' }}
                  />
                </div>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                  Showing <strong>{filteredNST.length}</strong> students
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={exportDeskCSV}
                  style={{ background: '#b45309', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '12.5px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                >
                  <Download size={13} /> Export Desk Sheet
                </button>
              </div>
            </div>

            {/* NST Table */}
            <div className="table-shell" style={{ overflowX: 'auto', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <table style={{ width: '100%', minWidth: '1350px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#fffbeb', borderBottom: '1px solid #fde68a', color: '#92400e', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.06em' }}>
                    <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>BIB / Chest</th>
                    <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Student Name</th>
                    <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>URN Number</th>
                    <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Race Tier</th>
                    <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Batch & Contact</th>
                    <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>T-Shirt Size</th>
                    <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Weight</th>
                    <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Height</th>
                    <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Payment Proof</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>Profile</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNST.length === 0 ? (
                    <tr>
                      <td colSpan={10} style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
                        No students found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredNST.map((student, idx) => (
                      <tr key={student.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }} className="table-row-hover">
                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                          <span style={{ fontWeight: 800, color: '#b45309', fontSize: '14px' }}>
                            {student.bib_number || `M4S-NST-${101 + idx}`}
                          </span>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>Chest #{student.chest_number || `NST-${101 + idx}`}</div>
                        </td>

                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>
                            {student.first_name} {student.last_name}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>
                            {student.gender || 'Male'}
                          </div>
                        </td>

                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                          <span style={{ background: '#fef3c7', color: '#b45309', padding: '3px 8px', borderRadius: '6px', fontWeight: 800, fontSize: '12px', border: '1px solid #fde68a' }}>
                            {getStudentURN(student)}
                          </span>
                        </td>

                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                          <span
                            style={{
                              background: (student.race_type || '').toLowerCase().includes('comp') && !(student.race_type || '').toLowerCase().includes('non') ? '#dcfce7' : (student.race_type || '').toLowerCase().includes('pending') ? '#fee2e2' : '#e0f2fe',
                              color: (student.race_type || '').toLowerCase().includes('comp') && !(student.race_type || '').toLowerCase().includes('non') ? '#15803d' : (student.race_type || '').toLowerCase().includes('pending') ? '#b91c1c' : '#0369a1',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 800,
                            }}
                          >
                            {student.race_type || 'Pending Payment'}
                          </span>
                        </td>

                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                          <div style={{ fontWeight: 600, color: student.phone && student.phone !== '—' ? '#0f172a' : '#94a3b8' }}>
                            {student.phone && student.phone !== '—' ? student.phone : 'Not Provided'}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>{getStudentYear(student)}</div>
                        </td>

                        {/* T-Shirt Size */}
                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                          <span style={{ background: '#0b1a4a', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontWeight: 900, fontSize: '13px' }}>
                            {student.t_shirt_size || 'M'}
                          </span>
                        </td>

                        {/* Weight */}
                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                          <span style={{ fontWeight: 600, color: student.weight ? '#0f172a' : '#94a3b8' }}>
                            {student.weight ? (student.weight.toString().toLowerCase().includes('kg') ? student.weight : `${student.weight} kg`) : '—'}
                          </span>
                        </td>

                        {/* Height */}
                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                          <span style={{ fontWeight: 600, color: student.height ? '#0f172a' : '#94a3b8' }}>
                            {student.height || '—'}
                          </span>
                        </td>

                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                          {student.emergency_name && student.emergency_name.startsWith('http') ? (
                            <a
                              href={student.emergency_name}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                background: '#eff6ff',
                                color: '#1d4ed8',
                                border: '1px solid #bfdbfe',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: 700,
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                              }}
                            >
                              View Proof <ExternalLink size={10} />
                            </a>
                          ) : (
                            <span style={{ fontSize: '11px', color: '#94a3b8', fontStyle: 'italic' }}>No Proof Provided</span>
                          )}
                        </td>

                        <td style={{ padding: '12px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <button
                            onClick={() => setSelectedRunner(student)}
                            style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '4px 10px', borderRadius: '6px', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer', color: '#334155' }}
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: GENERAL PUBLIC DESK COUNTER                       */}
        {/* ========================================================= */}
        {activeSection === 'general' && (
          <div>
            {/* Top Stat Summary for Desk Volunteers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              <div style={{ background: '#fff', padding: '16px', borderRadius: '16px', border: '1px solid #bfdbfe' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase' }}>GENERAL QUEUE</div>
                <div style={{ fontSize: '26px', fontWeight: 900, color: '#0284c7', marginTop: '4px' }}>{generalMetrics.total}</div>
                <div style={{ fontSize: '12px', color: '#475569' }}>{generalMetrics.paid} Paid • {generalMetrics.pending} Pending</div>
              </div>

              <div style={{ background: '#fff', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>RACE TIERS</div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '6px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Comp 5K: </span>
                    <strong style={{ fontSize: '16px', color: '#16a34a' }}>{generalMetrics.competitive}</strong>
                  </div>
                  <div style={{ width: '1px', height: '20px', background: '#e2e8f0' }} />
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Joy Run: </span>
                    <strong style={{ fontSize: '16px', color: '#0284c7' }}>{generalMetrics.joy}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* General Search Bar */}
            <div style={{ background: '#fff', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '16px', display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flex: 1, minWidth: '280px' }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                  <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Search Runner Name, Phone, BIB, City..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px 10px 36px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', background: '#f8fafc' }}
                  />
                </div>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                  Showing <strong>{filteredGeneral.length}</strong> runners
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={exportDeskCSV}
                  style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '12.5px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                >
                  <Download size={13} /> Export Desk Sheet
                </button>
              </div>
            </div>

            {/* General Table */}
            <div className="table-shell" style={{ overflowX: 'auto', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <table style={{ width: '100%', minWidth: '1200px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.06em' }}>
                    <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>BIB / Chest</th>
                    <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Runner Details</th>
                    <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Contact</th>
                    <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>City / Location</th>
                    <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Race Tier</th>
                    <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>T-Shirt Bag Size</th>
                    <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Status</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>Profile</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGeneral.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
                        No general participants found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredGeneral.map((runner, idx) => (
                      <tr key={runner.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }} className="table-row-hover">
                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                          <span style={{ fontWeight: 800, color: '#0b1a4a', fontSize: '14px' }}>
                            {runner.bib_number || `M4S-GEN-${101 + idx}`}
                          </span>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>Chest #{runner.chest_number || (101 + idx)}</div>
                        </td>

                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>
                            {runner.first_name} {runner.last_name}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>
                            {runner.gender} • DOB: {runner.dob || '—'}
                          </div>
                        </td>

                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{runner.phone}</div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>{runner.email}</div>
                        </td>

                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{runner.city || 'Pune'}</div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>Emerg: {runner.emergency_phone || '—'}</div>
                        </td>

                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                          <span
                            style={{
                              background: (runner.race_type || '').toLowerCase().includes('comp') ? '#dcfce7' : '#e0f2fe',
                              color: (runner.race_type || '').toLowerCase().includes('comp') ? '#15803d' : '#0369a1',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 800,
                            }}
                          >
                            {runner.race_type || 'Competitive 5K'}
                          </span>
                        </td>

                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                          <span style={{ background: '#0b1a4a', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontWeight: 900, fontSize: '13px' }}>
                            {runner.t_shirt_size || 'M'}
                          </span>
                        </td>

                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                          <span
                            style={{
                              background: runner.payment_status === 'paid' ? '#dcfce7' : '#fee2e2',
                              color: runner.payment_status === 'paid' ? '#15803d' : '#b91c1c',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 800,
                            }}
                          >
                            {runner.payment_status === 'paid' ? 'PAID' : 'PENDING'}
                          </span>
                        </td>

                        <td style={{ padding: '12px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <button
                            onClick={() => setSelectedRunner(runner)}
                            style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '4px 10px', borderRadius: '6px', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer', color: '#334155' }}
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ─── Runner Details Modal (Read-Only for Volunteers) ─── */}
      {selectedRunner && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: '#fff', borderRadius: '20px', maxWidth: '500px', width: '100%', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase' }}>Participant Profile</span>
                <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', margin: '2px 0 0 0' }}>
                  {selectedRunner.first_name} {selectedRunner.last_name}
                </h3>
              </div>
              <button onClick={() => setSelectedRunner(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>BIB NUMBER</div>
                <strong style={{ fontSize: '15px', color: '#0b1a4a' }}>{selectedRunner.bib_number || 'Pending'}</strong>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>CHEST NUMBER</div>
                <strong style={{ fontSize: '15px', color: '#0b1a4a' }}>#{selectedRunner.chest_number || '—'}</strong>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>RACE TIER</div>
                <strong style={{ fontSize: '14px', color: '#0b1a4a' }}>{selectedRunner.race_type || 'Competitive 5K'}</strong>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>T-SHIRT SIZE</div>
                <strong style={{ fontSize: '15px', color: '#0b1a4a' }}>{selectedRunner.t_shirt_size || 'M'}</strong>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>PHONE</div>
                <strong>{selectedRunner.phone}</strong>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>EMAIL</div>
                <span style={{ fontSize: '11.5px', wordBreak: 'break-all' }}>{selectedRunner.email}</span>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ fontSize: '11px', color: '#64748b' }}>AFFILIATION / CAMPUS</div>
                <strong>{selectedRunner.city}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                onClick={() => setSelectedRunner(null)}
                style={{ background: '#0b1a4a', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 800, fontSize: '13px', cursor: 'pointer' }}
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
