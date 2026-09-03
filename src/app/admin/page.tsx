'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Users,
  IndianRupee,
  Search,
  Download,
  RefreshCw,
  Eye,
  EyeOff,
  ShieldAlert,
  Trash2,
  Award,
  BarChart3,
  ExternalLink,
  GraduationCap,
  Globe,
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

export default function AdminPage() {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [authError, setAuthError] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);

  // Active Main Section: 'nst' | 'general'
  const [activeSection, setActiveSection] = useState<'nst' | 'general'>('nst');

  // Data & Live States
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [justRefreshed, setJustRefreshed] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [yearFilter, setYearFilter] = useState<'all' | '1st' | '2nd'>('all');
  const [raceTypeFilter, setRaceTypeFilter] = useState<'all' | 'competitive' | 'non-competitive' | 'pending'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'male' | 'female' | 'senior'>('all');

  // Gateway Sync Modal
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [syncRawText, setSyncRawText] = useState('');
  const [isSyncingGateway, setIsSyncingGateway] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  // Auto-authenticate with session storage & instant cache hydration
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('m4s_admin_passcode');
      const cachedData = sessionStorage.getItem('m4s_admin_cached_regs');
      
      if (saved) {
        setPasscode(saved);
        if (cachedData) {
          try {
            const parsed = JSON.parse(cachedData);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setRegistrations(parsed);
              setIsAuthenticated(true);
              setIsCheckingAuth(false);
            }
          } catch {}
        }
        verifyAndLoad(saved, !cachedData);
      } else {
        setIsCheckingAuth(false);
      }
    } catch {
      setIsCheckingAuth(false);
    }
  }, []);

  // ⚡ 100% Automated Background Live Sync (Every 20 seconds)
  useEffect(() => {
    if (!isAuthenticated || !passcode) return;
    const interval = setInterval(() => {
      fetch('/api/admin/registrations', {
        headers: { 'x-admin-passcode': passcode },
      })
        .then(r => r.json())
        .then(data => {
          if (data.success && data.registrations) {
            setRegistrations(data.registrations);
            try { sessionStorage.setItem('m4s_admin_cached_regs', JSON.stringify(data.registrations)); } catch {}
          }
        })
        .catch(err => console.error('Silent auto-sync notice:', err));
    }, 20000);

    return () => clearInterval(interval);
  }, [isAuthenticated, passcode]);

  const verifyAndLoad = async (codeToVerify: string, showSpinner = true) => {
    if (showSpinner) setIsVerifying(true);
    setAuthError('');
    try {
      const res = await fetch('/api/admin/registrations', {
        headers: { 'x-admin-passcode': codeToVerify },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setAuthError(data.error || 'Invalid passcode. Access denied.');
        setIsAuthenticated(false);
        sessionStorage.removeItem('m4s_admin_passcode');
        sessionStorage.removeItem('m4s_admin_cached_regs');
      } else {
        setIsAuthenticated(true);
        sessionStorage.setItem('m4s_admin_passcode', codeToVerify);
        setRegistrations(data.registrations || []);
        try { sessionStorage.setItem('m4s_admin_cached_regs', JSON.stringify(data.registrations || [])); } catch {}
      }
    } catch (err) {
      console.error(err);
      if (showSpinner) setAuthError('Failed to connect to server. Please try again.');
    } finally {
      setIsVerifying(false);
      setIsCheckingAuth(false);
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
          headers: { 'x-admin-passcode': passcode },
        }),
        new Promise(res => setTimeout(res, 650)),
      ]);
      const data = await regRes.json();
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

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'paid' ? 'pending' : 'paid';
    setUpdatingId(id);
    try {
      const res = await fetch('/api/admin/registrations', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': passcode,
        },
        body: JSON.stringify({ id, payment_status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setRegistrations(prev =>
          prev.map(r => (r.id === id ? { ...r, payment_status: newStatus as 'paid' | 'pending' } : r))
        );
      } else {
        alert(`Failed to update status: ${data.error}`);
      }
    } catch {
      alert('Network error while updating status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteRecord = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete registration for ${name}? This cannot be undone.`)) {
      return;
    }
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/registrations?id=${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-passcode': passcode },
      });
      const data = await res.json();
      if (data.success) {
        setRegistrations(prev => prev.filter(r => r.id !== id));
      } else {
        alert(`Failed to delete: ${data.error}`);
      }
    } catch {
      alert('Network error while deleting record.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleGatewaySync = async () => {
    if (!syncRawText.trim()) return alert('Please paste Google Sheet rows or CSV data.');
    setIsSyncingGateway(true);
    setSyncResult(null);

    try {
      // Parse pasted lines (handles both Tab-separated copy from Sheets and CSV)
      const lines = syncRawText.trim().split('\n');
      if (lines.length < 2) {
        setIsSyncingGateway(false);
        return alert('Please paste at least one header row and one data row.');
      }

      const isTab = lines[0].includes('\t');
      const parseLine = (line: string) => {
        if (isTab) return line.split('\t').map(c => c.trim().replace(/^"|"$/g, ''));
        const matches = line.match(/(?:\"([^\"]*)\"|([^\",]+))/g);
        return matches ? matches.map(m => m.replace(/^\"|\"$/g, '').trim()) : line.split(',').map(c => c.trim());
      };

      const headers = parseLine(lines[0]);
      const rows = [];

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const cols = parseLine(lines[i]);
        const rowObj: Record<string, string> = {};
        headers.forEach((h, idx) => {
          if (h && cols[idx] !== undefined) {
            rowObj[h] = cols[idx];
          }
        });
        rows.push(rowObj);
      }

      const res = await fetch('/api/sync/gateway', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode, rows }),
      });

      const data = await res.json();
      if (data.success) {
        setSyncResult(data.message);
        await handleRefresh();
        setTimeout(() => {
          setShowSyncModal(false);
          setSyncRawText('');
          setSyncResult(null);
        }, 2200);
      } else {
        alert(`Sync failed: ${data.error}`);
      }
    } catch (err: any) {
      alert(`Network error during sync: ${err.message}`);
    } finally {
      setIsSyncingGateway(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasscode('');
    sessionStorage.removeItem('m4s_admin_passcode');
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

  // ─── Metrics Calculations ───
  const nstMetrics = useMemo(() => {
    const total = nstRegistrations.length;
    const paidList = nstRegistrations.filter(r => r.payment_status === 'paid');
    const pendingList = nstRegistrations.filter(r => r.payment_status === 'pending');
    const firstYear = nstRegistrations.filter(r => (r.city || '').includes('1st') || (r.dob || '').includes('1st')).length;
    const secondYear = total - firstYear;
    const competitive = nstRegistrations.filter(r => (r.race_type || '').toLowerCase().includes('comp') && !(r.race_type || '').toLowerCase().includes('non')).length;
    const joy = nstRegistrations.filter(r => (r.race_type || '').toLowerCase().includes('joy') || (r.race_type || '').toLowerCase().includes('non')).length;
    const unassigned = total - competitive - joy;
    const revenue = paidList.reduce((acc, c) => acc + (Number(c.amount) || 0), 0);

    return { total, paid: paidList.length, pending: pendingList.length, firstYear, secondYear, competitive, joy, unassigned, revenue };
  }, [nstRegistrations]);

  // Helper to calculate exact age from DOB
  const calculateAge = (dobString?: string) => {
    if (!dobString || dobString === '—') return '—';
    const num = parseInt(dobString);
    if (!isNaN(num) && num > 0 && num < 120 && !dobString.includes('-')) return `${num} yrs`;
    const birthDate = new Date(dobString);
    if (isNaN(birthDate.getTime())) return '—';
    const eventDate = new Date('2026-09-05');
    let age = eventDate.getFullYear() - birthDate.getFullYear();
    const m = eventDate.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && eventDate.getDate() < birthDate.getDate())) {
      age--;
    }
    return age > 0 && age < 120 ? `${age} yrs` : '—';
  };

  // Helper to categorize General Public runner
  const getGeneralCategory = (runner: RegistrationRecord) => {
    const ageStr = calculateAge(runner.dob);
    const ageNum = parseInt(ageStr);
    if ((ageNum && ageNum >= 50) || (runner.category || '').toLowerCase().includes('senior')) {
      return 'Senior Adult (50+)';
    }
    if ((runner.gender || '').toLowerCase() === 'female' || (runner.category || '').toLowerCase().includes('female')) {
      return 'Female';
    }
    return 'Male';
  };

  const generalMetrics = useMemo(() => {
    const total = generalRegistrations.length;
    const paidList = generalRegistrations.filter(r => r.payment_status === 'paid');
    const pendingList = generalRegistrations.filter(r => r.payment_status === 'pending');
    const revenue = paidList.reduce((acc, c) => acc + (Number(c.amount) || 0), 0);
    const competitive = generalRegistrations.filter(r => (r.race_type || '').toLowerCase().includes('comp') && !(r.race_type || '').toLowerCase().includes('non')).length;
    const joy = generalRegistrations.filter(r => (r.race_type || '').toLowerCase().includes('joy') || (r.race_type || '').toLowerCase().includes('non')).length;
    
    const senior = generalRegistrations.filter(r => getGeneralCategory(r) === 'Senior Adult (50+)').length;
    const female = generalRegistrations.filter(r => getGeneralCategory(r) === 'Female').length;
    const male = generalRegistrations.filter(r => getGeneralCategory(r) === 'Male').length;

    return { total, paid: paidList.length, pending: pendingList.length, revenue, competitive, joy, male, female, senior };
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
      const genCat = getGeneralCategory(r);
      const matchSearch =
        !q ||
        r.first_name.toLowerCase().includes(q) ||
        r.last_name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        (r.bib_number && r.bib_number.toLowerCase().includes(q)) ||
        r.city.toLowerCase().includes(q) ||
        genCat.toLowerCase().includes(q);

      const matchStatus = statusFilter === 'all' || r.payment_status === statusFilter;
      const matchRaceType =
        raceTypeFilter === 'all' ||
        (raceTypeFilter === 'competitive' && (r.race_type || '').toLowerCase().includes('comp') && !(r.race_type || '').toLowerCase().includes('non')) ||
        (raceTypeFilter === 'non-competitive' && ((r.race_type || '').toLowerCase().includes('non') || (r.race_type || '').toLowerCase().includes('joy')));

      const matchCategory =
        categoryFilter === 'all' ||
        (categoryFilter === 'male' && genCat === 'Male') ||
        (categoryFilter === 'female' && genCat === 'Female') ||
        (categoryFilter === 'senior' && genCat === 'Senior Adult (50+)');

      return matchSearch && matchStatus && matchRaceType && matchCategory;
    });
  }, [generalRegistrations, searchQuery, statusFilter, raceTypeFilter, categoryFilter]);

  // ─── CSV Export for NST ───
  const exportNSTCSV = () => {
    if (filteredNST.length === 0) return alert('No NST records to export.');
    const headers = ['BIB Number', 'Chest #', 'Student Name', 'URN Number', 'Study Year', 'Gender', 'Race Type', 'Amount (INR)', 'T-Shirt Size', 'Weight', 'Height', 'Email', 'Phone', 'Customer ID', 'Transaction ID', 'Payment Proof Drive Link', 'Payment Status'];
    const rows = filteredNST.map(r => [
      `"${r.bib_number || ''}"`,
      `"${r.chest_number || ''}"`,
      `"${r.first_name} ${r.last_name}"`,
      `"${getStudentURN(r)}"`,
      `"${getStudentYear(r)}"`,
      `"${r.gender || 'Male'}"`,
      `"${r.race_type || 'Competitive 5K'}"`,
      r.amount || 0,
      `"${r.t_shirt_size || 'M'}"`,
      `"${r.weight || ''}"`,
      `"${r.height || ''}"`,
      `"${r.email}"`,
      `"${r.phone}"`,
      `"${r.razorpay_order_id || 'unknown'}"`,
      `"${r.razorpay_payment_id || 'unknown'}"`,
      `"${r.emergency_name && r.emergency_name.startsWith('http') ? r.emergency_name : ''}"`,
      `"${r.payment_status}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `nst_students_miles4smiles_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ─── CSV Export for General Audience ───
  const exportGeneralCSV = () => {
    if (filteredGeneral.length === 0) return alert('No general records to export.');
    const headers = ['BIB Number', 'Chest #', 'Runner Name', 'Gender', 'DOB', 'City', 'Phone', 'Email', 'T-Shirt Size', 'Blood Group', 'Race Type', 'Customer ID', 'Transaction ID', 'Amount (INR)', 'Payment Status', 'Emergency Contact'];
    const rows = filteredGeneral.map(r => [
      `"${r.bib_number || ''}"`,
      `"${r.chest_number || ''}"`,
      `"${r.first_name} ${r.last_name}"`,
      `"${r.gender || ''}"`,
      `"${r.dob || ''}"`,
      `"${r.city || ''}"`,
      `"${r.phone}"`,
      `"${r.email}"`,
      `"${r.t_shirt_size || 'M'}"`,
      `"${r.blood_group || ''}"`,
      `"${r.race_type || 'Competitive 5K'}"`,
      `"${r.razorpay_order_id || 'unknown'}"`,
      `"${r.razorpay_payment_id || 'unknown'}"`,
      r.amount || 0,
      `"${r.payment_status}"`,
      `"${r.emergency_phone || ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `general_runners_miles4smiles_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ─── Loading Screen during Initial Session Check ───
  if (isCheckingAuth && !isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #070d1e 0%, #0b1a4a 50%, #0a1128 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', fontFamily: 'var(--font-heading)' }}>
        <div style={{ background: 'rgba(255,255,255,0.06)', padding: '12px 24px', borderRadius: '16px', display: 'inline-flex', alignItems: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
          <Image src="/images/logo.png" alt="Miles for Smiles" width={160} height={40} style={{ height: '36px', width: 'auto', objectFit: 'contain' }} priority />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#94a3b8', fontSize: '13px', fontWeight: 700 }}>
          <RefreshCw size={16} className="animate-spin" style={{ color: '#00d2ff' }} />
          Loading Console...
        </div>
      </div>
    );
  }

  // ─── Unauthenticated Login Screen ───
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #070d1e 0%, #0b1a4a 50%, #0a1128 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'var(--font-heading)' }}>
        <div style={{ background: '#ffffff', borderRadius: '24px', maxWidth: '440px', width: '100%', padding: '40px 36px', boxShadow: '0 25px 60px -15px rgba(0,0,0,0.6)', textAlign: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
          {/* Logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <div style={{ background: '#0b1a4a', padding: '10px 20px', borderRadius: '14px', display: 'inline-flex', alignItems: 'center', boxShadow: '0 4px 12px rgba(11,26,74,0.3)' }}>
              <Image src="/images/logo.png" alt="Miles for Smiles" width={140} height={36} style={{ height: '30px', width: 'auto', objectFit: 'contain' }} priority />
            </div>
          </div>

          <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', marginBottom: '6px' }}>Organizer Admin Access</h1>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '28px' }}>Enter your security passcode to access the central operations console.</p>

          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type={showPasscode ? 'text' : 'password'}
                placeholder="Enter admin passcode"
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

            <button type="submit" disabled={isVerifying} style={{ width: '100%', background: '#0b1a4a', color: '#fff', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: 800, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(11,26,74,0.35)' }}>
              {isVerifying ? <RefreshCw size={18} className="animate-spin" /> : 'Unlock Organizer Console'}
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
          background: #0b1a4a !important;
          color: #ffffff !important;
          border-color: #0b1a4a !important;
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
              <div style={{ background: '#0b1a4a', padding: '6px 10px', borderRadius: '10px', display: 'inline-flex', alignItems: 'center' }}>
                <Image src="/images/logo.png" alt="Miles for Smiles" width={110} height={28} style={{ height: '22px', width: 'auto', objectFit: 'contain' }} priority />
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 900, color: '#0b1a4a', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Miles for Smiles <span style={{ fontSize: '10px', background: '#0b1a4a', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>ADMIN</span>
                </div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>5K Charity Run Operations Console</div>
              </div>
            </Link>

            {/* Quick Analytics Link */}
            <Link
              href="/admin/analytics"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#eff6ff',
                color: '#1d4ed8',
                border: '1px solid #bfdbfe',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <BarChart3 size={14} /> Analytics
            </Link>

            {/* Quick Volunteer Desk Link */}
            <Link
              href="/desk"
              target="_blank"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#f8fafc',
                color: '#475569',
                border: '1px solid #cbd5e1',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <Globe size={14} /> Volunteer Desk <ExternalLink size={11} />
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#ecfdf5',
                color: '#065f46',
                border: '1px solid #a7f3d0',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 800,
              }}
            >
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              Live Sheets Auto-Sync (20s)
            </div>

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
              <ShieldAlert size={14} /> Logout
            </button>
          </div>
        </div>

        {/* ─── Top Main Section Tabs (2 Clean Dedicated Views) ─── */}
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
            <GraduationCap size={16} /> NST Students & Faculty
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
              borderBottom: activeSection === 'general' ? '3px solid #0b1a4a' : '3px solid transparent',
              color: activeSection === 'general' ? '#0b1a4a' : '#64748b',
              transition: 'all 0.15s',
            }}
          >
            <Users size={16} /> General Public Audience
            <span style={{ background: activeSection === 'general' ? '#eff6ff' : '#f1f5f9', color: activeSection === 'general' ? '#1d4ed8' : '#64748b', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 800 }}>
              {generalMetrics.total}
            </span>
          </button>
        </div>
      </header>

      {/* ─── Main Content Area ─── */}
      <main style={{ maxWidth: '1600px', margin: '0 auto', padding: '24px' }}>
        {/* ========================================================= */}
        {/* VIEW 1: NST STUDENTS & FACULTY                            */}
        {/* ========================================================= */}
        {activeSection === 'nst' && (
          <div>
            {/* Top Stat Overview Cards for NST */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              <div style={{ background: '#fff', padding: '16px', borderRadius: '16px', border: '1px solid #fde68a', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#b45309', textTransform: 'uppercase' }}>NST Students</span>
                  <GraduationCap size={18} color="#b45309" />
                </div>
                <div style={{ fontSize: '26px', fontWeight: 900, color: '#b45309' }}>{nstMetrics.total}</div>
                <div style={{ fontSize: '12px', color: '#78350f', marginTop: '4px' }}>{nstMetrics.paid} Paid • {nstMetrics.pending} Pending</div>
              </div>

              <div style={{ background: '#fff', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Race Tier (Competitive vs Joy)</span>
                  <Award size={18} color="#64748b" />
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '4px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Comp (₹149): </span>
                    <strong style={{ fontSize: '18px', color: '#16a34a' }}>{nstMetrics.competitive}</strong>
                  </div>
                  <div style={{ width: '1px', height: '24px', background: '#e2e8f0' }} />
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Joy (₹99): </span>
                    <strong style={{ fontSize: '18px', color: '#0284c7' }}>{nstMetrics.joy}</strong>
                  </div>
                </div>
              </div>

              <div style={{ background: '#fff', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Study Year Batch</span>
                  <Users size={18} color="#64748b" />
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '4px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>1st Year: </span>
                    <strong style={{ fontSize: '18px', color: '#0f172a' }}>{nstMetrics.firstYear}</strong>
                  </div>
                  <div style={{ width: '1px', height: '24px', background: '#e2e8f0' }} />
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>2nd Year: </span>
                    <strong style={{ fontSize: '18px', color: '#0f172a' }}>{nstMetrics.secondYear}</strong>
                  </div>
                </div>
              </div>

              <div style={{ background: '#fff', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Revenue Collected</span>
                  <IndianRupee size={18} color="#16a34a" />
                </div>
                <div style={{ fontSize: '24px', fontWeight: 900, color: '#16a34a' }}>₹{nstMetrics.revenue.toLocaleString('en-IN')}</div>
                <div style={{ fontSize: '12px', color: '#15803d', marginTop: '4px' }}>{nstMetrics.paid} Confirmed Payments</div>
              </div>
            </div>

            {/* NST Search & Action Bar */}
            <div style={{ background: '#fff', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '16px', display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flex: 1, minWidth: '280px' }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                  <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Search by URN, Name, Phone, Email..."
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
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Status:</span>
                <button className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`} onClick={() => setStatusFilter('all')}>
                  All ({nstMetrics.total})
                </button>
                <button className={`filter-btn ${statusFilter === 'paid' ? 'active' : ''}`} onClick={() => setStatusFilter('paid')}>
                  Paid ({nstMetrics.paid})
                </button>
                <button className={`filter-btn ${statusFilter === 'pending' ? 'active' : ''}`} onClick={() => setStatusFilter('pending')}>
                  Pending ({nstMetrics.pending})
                </button>

                <div style={{ width: '1px', height: '20px', background: '#e2e8f0', margin: '0 4px' }} />

                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Tier:</span>
                <button className={`filter-btn ${raceTypeFilter === 'all' ? 'active' : ''}`} onClick={() => setRaceTypeFilter('all')}>
                  All ({nstMetrics.total})
                </button>
                <button className={`filter-btn ${raceTypeFilter === 'competitive' ? 'active' : ''}`} onClick={() => setRaceTypeFilter('competitive')}>
                  Comp ({nstMetrics.competitive})
                </button>
                <button className={`filter-btn ${raceTypeFilter === 'non-competitive' ? 'active' : ''}`} onClick={() => setRaceTypeFilter('non-competitive')}>
                  Joy ({nstMetrics.joy})
                </button>

                <div style={{ width: '1px', height: '20px', background: '#e2e8f0', margin: '0 4px' }} />

                <button
                  onClick={exportNSTCSV}
                  style={{ background: '#b45309', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '12.5px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                >
                  <Download size={13} /> Export NST CSV
                </button>
              </div>
            </div>

            {/* NST Dedicated Table */}
            <div className="table-shell" style={{ overflowX: 'auto', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <table style={{ width: '100%', minWidth: '1450px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#fffbeb', borderBottom: '1px solid #fde68a', color: '#92400e', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.06em' }}>
                    <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>BIB / Chest</th>
                    <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Student Name</th>
                    <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>URN & Batch</th>
                    <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Race Tier</th>
                    <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Email & Contact</th>
                    <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>T-Shirt Size</th>
                    <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Weight</th>
                    <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Height</th>
                    <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Payment Proof</th>
                    <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Gateway Ref</th>
                    <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Status</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNST.length === 0 ? (
                    <tr>
                      <td colSpan={12} style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
                        No NST students matched your search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredNST.map((student, idx) => (
                      <tr key={student.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }} className="table-row-hover">
                        {/* BIB & Chest */}
                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                          <span style={{ fontWeight: 800, color: '#b45309', fontSize: '13.5px' }}>
                            {student.bib_number || `M4S-NST-${101 + idx}`}
                          </span>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>Chest #{student.chest_number || `NST-${101 + idx}`}</div>
                        </td>

                        {/* Student Name */}
                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>
                            {student.first_name} {student.last_name}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>
                            {student.gender || 'Male'}
                          </div>
                        </td>

                        {/* URN & Batch */}
                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                          <span style={{ background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '6px', fontWeight: 800, fontSize: '12px', border: '1px solid #fde68a' }}>
                            {getStudentURN(student)}
                          </span>
                          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '3px' }}>
                            {getStudentYear(student)}
                          </div>
                        </td>

                        {/* Race Tier */}
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
                          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', fontWeight: 700 }}>
                            Fee: ₹{student.amount || 0}
                          </div>
                        </td>

                        {/* Email & Phone */}
                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {student.phone && student.phone !== '—' ? (
                              <>
                                <a href={`tel:${student.phone}`} style={{ color: '#0f172a', textDecoration: 'none', fontWeight: 600 }}>
                                  {student.phone}
                                </a>
                                <a
                                  href={`https://wa.me/91${student.phone.replace(/[^0-9]/g, '').slice(-10)}?text=${encodeURIComponent(`Hi ${student.first_name}, regarding your Miles for Smiles NST student registration (BIB: ${student.bib_number}).`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ background: '#dcfce7', color: '#15803d', padding: '2px 6px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 700, textDecoration: 'none' }}
                                >
                                  WA
                                </a>
                              </>
                            ) : (
                              <span style={{ color: '#94a3b8', fontSize: '12px' }}>Not Provided</span>
                            )}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{student.email}</div>
                        </td>

                        {/* T-Shirt Size */}
                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                          <span style={{ background: '#f1f5f9', color: '#0f172a', padding: '3px 8px', borderRadius: '6px', fontWeight: 800, fontSize: '12px', border: '1px solid #cbd5e1' }}>
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

                        {/* Payment Proof Google Drive Link */}
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
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontSize: '11.5px',
                                fontWeight: 700,
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                            >
                              View Drive Proof <ExternalLink size={11} />
                            </a>
                          ) : (
                            <span style={{ fontSize: '11px', color: '#94a3b8', fontStyle: 'italic' }}>No Proof Provided</span>
                          )}
                        </td>

                        {/* Gateway Customer & Txn ID */}
                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>
                            Cust: <strong style={{ color: '#0f172a' }}>{student.razorpay_order_id && student.razorpay_order_id !== 'unknown' ? student.razorpay_order_id : '—'}</strong>
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>
                            Txn: <strong style={{ color: '#0f172a' }}>{student.razorpay_payment_id && student.razorpay_payment_id !== 'unknown' ? student.razorpay_payment_id : '—'}</strong>
                          </div>
                        </td>

                        {/* Status Toggle */}
                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                          <button
                            onClick={() => handleStatusToggle(student.id, student.payment_status)}
                            disabled={updatingId === student.id}
                            style={{
                              background: student.payment_status === 'paid' ? '#dcfce7' : '#fee2e2',
                              color: student.payment_status === 'paid' ? '#15803d' : '#b91c1c',
                              border: '1px solid transparent',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 800,
                              cursor: 'pointer',
                            }}
                          >
                            {student.payment_status === 'paid' ? `PAID (₹${student.amount || 149})` : 'PENDING'}
                          </button>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '12px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <button
                            onClick={() => handleDeleteRecord(student.id, `${student.first_name} ${student.last_name}`)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                            title="Delete Record"
                          >
                            <Trash2 size={14} />
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
        {/* VIEW 2: GENERAL PUBLIC AUDIENCE                           */}
        {/* ========================================================= */}
        {activeSection === 'general' && (
          <div>
            {/* Top Stat Overview Cards for General Public */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              <div style={{ background: '#fff', padding: '16px', borderRadius: '16px', border: '1px solid #bfdbfe', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase' }}>Public Queue</span>
                  <Users size={18} color="#0284c7" />
                </div>
                <div style={{ fontSize: '26px', fontWeight: 900, color: '#0284c7' }}>{generalMetrics.total}</div>
                <div style={{ fontSize: '12px', color: '#0369a1', marginTop: '4px' }}>{generalMetrics.paid} Paid • {generalMetrics.pending} Pending</div>
              </div>

              <div style={{ background: '#fff', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Race Tier (Competitive vs Joy)</span>
                  <Award size={18} color="#64748b" />
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '4px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Comp (₹249): </span>
                    <strong style={{ fontSize: '18px', color: '#16a34a' }}>{generalMetrics.competitive}</strong>
                  </div>
                  <div style={{ width: '1px', height: '24px', background: '#e2e8f0' }} />
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Joy (₹149): </span>
                    <strong style={{ fontSize: '18px', color: '#0284c7' }}>{generalMetrics.joy}</strong>
                  </div>
                </div>
              </div>

              <div style={{ background: '#fff', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Category Demographics</span>
                  <Users size={18} color="#64748b" />
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '4px', flexWrap: 'wrap' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Male: </span>
                    <strong style={{ fontSize: '16px', color: '#0f172a' }}>{generalMetrics.male}</strong>
                  </div>
                  <div style={{ width: '1px', height: '20px', background: '#e2e8f0' }} />
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Female: </span>
                    <strong style={{ fontSize: '16px', color: '#db2777' }}>{generalMetrics.female}</strong>
                  </div>
                  <div style={{ width: '1px', height: '20px', background: '#e2e8f0' }} />
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Senior (50+): </span>
                    <strong style={{ fontSize: '16px', color: '#d97706' }}>{generalMetrics.senior}</strong>
                  </div>
                </div>
              </div>

              <div style={{ background: '#fff', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Revenue Collected</span>
                  <IndianRupee size={18} color="#16a34a" />
                </div>
                <div style={{ fontSize: '24px', fontWeight: 900, color: '#16a34a' }}>₹{generalMetrics.revenue.toLocaleString('en-IN')}</div>
                <div style={{ fontSize: '12px', color: '#15803d', marginTop: '4px' }}>{generalMetrics.paid} Confirmed Payments</div>
              </div>
            </div>

            {/* General Public Search & Action Bar */}
            <div style={{ background: '#fff', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '16px', display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flex: 1, minWidth: '280px' }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
                  <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Search by Name, Phone, Email, BIB, City..."
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
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Status:</span>
                <button className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`} onClick={() => setStatusFilter('all')}>
                  All ({generalMetrics.total})
                </button>
                <button className={`filter-btn ${statusFilter === 'paid' ? 'active' : ''}`} onClick={() => setStatusFilter('paid')}>
                  Paid ({generalMetrics.paid})
                </button>
                <button className={`filter-btn ${statusFilter === 'pending' ? 'active' : ''}`} onClick={() => setStatusFilter('pending')}>
                  Pending ({generalMetrics.pending})
                </button>

                <div style={{ width: '1px', height: '20px', background: '#e2e8f0', margin: '0 4px' }} />

                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Category:</span>
                <button className={`filter-btn ${categoryFilter === 'all' ? 'active' : ''}`} onClick={() => setCategoryFilter('all')}>
                  All ({generalMetrics.total})
                </button>
                <button className={`filter-btn ${categoryFilter === 'male' ? 'active' : ''}`} onClick={() => setCategoryFilter('male')}>
                  Male ({generalMetrics.male})
                </button>
                <button className={`filter-btn ${categoryFilter === 'female' ? 'active' : ''}`} onClick={() => setCategoryFilter('female')}>
                  Female ({generalMetrics.female})
                </button>
                <button className={`filter-btn ${categoryFilter === 'senior' ? 'active' : ''}`} onClick={() => setCategoryFilter('senior')}>
                  Senior ({generalMetrics.senior})
                </button>

                <div style={{ width: '1px', height: '20px', background: '#e2e8f0', margin: '0 4px' }} />

                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Tier:</span>
                <button className={`filter-btn ${raceTypeFilter === 'all' ? 'active' : ''}`} onClick={() => setRaceTypeFilter('all')}>
                  All ({generalMetrics.total})
                </button>
                <button className={`filter-btn ${raceTypeFilter === 'competitive' ? 'active' : ''}`} onClick={() => setRaceTypeFilter('competitive')}>
                  Comp ({generalMetrics.competitive})
                </button>
                <button className={`filter-btn ${raceTypeFilter === 'non-competitive' ? 'active' : ''}`} onClick={() => setRaceTypeFilter('non-competitive')}>
                  Joy ({generalMetrics.joy})
                </button>

                <div style={{ width: '1px', height: '20px', background: '#e2e8f0', margin: '0 4px' }} />

                <button
                  onClick={exportGeneralCSV}
                  style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '12.5px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                >
                  <Download size={13} /> Export General CSV
                </button>
              </div>
            </div>

            {/* General Public Table */}
            <div className="table-shell" style={{ overflowX: 'auto', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <table style={{ width: '100%', minWidth: '1450px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.06em' }}>
                    <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>BIB / Chest</th>
                    <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Participant Name</th>
                    <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Category</th>
                    <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Age</th>
                    <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>City & Location</th>
                    <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Contact (Phone / WA)</th>
                    <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Race Tier</th>
                    <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>T-Shirt Size</th>
                    <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Weight</th>
                    <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Height</th>
                    <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Gateway Ref</th>
                    <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Payment Status</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGeneral.length === 0 ? (
                    <tr>
                      <td colSpan={13} style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
                        No general participants matched your search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredGeneral.map((runner, idx) => {
                      const genCat = getGeneralCategory(runner);
                      const runnerAge = calculateAge(runner.dob);
                      return (
                        <tr key={runner.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }} className="table-row-hover">
                          {/* BIB & Chest */}
                          <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                            <span style={{ fontWeight: 800, color: '#0284c7', fontSize: '13.5px' }}>
                              {runner.bib_number || `M4S-GEN-${101 + idx}`}
                            </span>
                            <div style={{ fontSize: '11px', color: '#64748b' }}>Chest #{runner.chest_number || (101 + idx)}</div>
                          </td>

                          {/* Participant Name */}
                          <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>
                              {runner.first_name} {runner.last_name}
                            </div>
                            <div style={{ fontSize: '11px', color: '#64748b' }}>
                              {runner.gender || 'Male'}
                            </div>
                          </td>

                          {/* Category Badge */}
                          <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                            <span
                              style={{
                                background: genCat === 'Senior Adult (50+)' ? '#fef3c7' : genCat === 'Female' ? '#fce7f3' : '#e0f2fe',
                                color: genCat === 'Senior Adult (50+)' ? '#b45309' : genCat === 'Female' ? '#be185d' : '#0369a1',
                                border: genCat === 'Senior Adult (50+)' ? '1px solid #fde68a' : genCat === 'Female' ? '1px solid #fbcfe8' : '1px solid #bae6fd',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: 800,
                              }}
                            >
                              {genCat}
                            </span>
                          </td>

                          {/* Age */}
                          <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                            <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '13px' }}>
                              {runnerAge}
                            </span>
                            <div style={{ fontSize: '10.5px', color: '#64748b' }}>
                              {runner.dob && runner.dob !== '—' ? runner.dob : 'DOB: —'}
                            </div>
                          </td>

                          {/* City & Location */}
                          <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                            <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '3px 8px', borderRadius: '6px', fontWeight: 800, fontSize: '12px', border: '1px solid #bfdbfe' }}>
                              {runner.city || 'Pune'}
                            </span>
                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                              Emerg: {runner.emergency_phone || '—'}
                            </div>
                          </td>

                          {/* Contact (Phone / WA) */}
                          <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <a href={`tel:${runner.phone}`} style={{ color: '#0f172a', textDecoration: 'none', fontWeight: 600 }}>
                                {runner.phone && runner.phone !== '—' ? runner.phone : 'Not Provided'}
                              </a>
                              {runner.phone && runner.phone !== '—' && (
                                <a
                                  href={`https://wa.me/91${runner.phone.replace(/[^0-9]/g, '').slice(-10)}?text=${encodeURIComponent(`Hi ${runner.first_name}, regarding your Miles for Smiles registration (BIB: ${runner.bib_number}).`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ background: '#dcfce7', color: '#15803d', padding: '2px 6px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 700, textDecoration: 'none' }}
                                >
                                  WA
                                </a>
                              )}
                            </div>
                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{runner.email}</div>
                          </td>

                          {/* Race Tier */}
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

                          {/* T-Shirt Size */}
                          <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                            <span style={{ background: '#0b1a4a', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontWeight: 900, fontSize: '13px' }}>
                              {runner.t_shirt_size || 'M'}
                            </span>
                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                              Blood: {runner.blood_group || '—'}
                            </div>
                          </td>

                          {/* Weight */}
                          <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                            <span style={{ fontWeight: 600, color: runner.weight ? '#0f172a' : '#94a3b8' }}>
                              {runner.weight ? (runner.weight.toString().toLowerCase().includes('kg') ? runner.weight : `${runner.weight} kg`) : '—'}
                            </span>
                          </td>

                          {/* Height */}
                          <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                            <span style={{ fontWeight: 600, color: runner.height ? '#0f172a' : '#94a3b8' }}>
                              {runner.height || '—'}
                            </span>
                          </td>

                          {/* Gateway Ref */}
                          <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                            <div style={{ fontSize: '11px', color: '#64748b' }}>
                              Cust: <strong style={{ color: '#0f172a' }}>{runner.razorpay_order_id && runner.razorpay_order_id !== 'unknown' ? runner.razorpay_order_id : '—'}</strong>
                            </div>
                            <div style={{ fontSize: '11px', color: '#64748b' }}>
                              Txn: <strong style={{ color: '#0f172a' }}>{runner.razorpay_payment_id && runner.razorpay_payment_id !== 'unknown' ? runner.razorpay_payment_id : '—'}</strong>
                            </div>
                          </td>

                          {/* Status */}
                          <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                            <button
                              onClick={() => handleStatusToggle(runner.id, runner.payment_status)}
                              disabled={updatingId === runner.id}
                              style={{
                                background: runner.payment_status === 'paid' ? '#dcfce7' : '#fee2e2',
                                color: runner.payment_status === 'paid' ? '#15803d' : '#b91c1c',
                                border: '1px solid transparent',
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: 800,
                                cursor: 'pointer',
                              }}
                            >
                              {runner.payment_status === 'paid' ? `PAID (₹${runner.amount || 249})` : 'PENDING'}
                            </button>
                          </td>

                          {/* Actions */}
                          <td style={{ padding: '12px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <button
                              onClick={() => handleDeleteRecord(runner.id, `${runner.first_name} ${runner.last_name}`)}
                              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                              title="Delete Record"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

