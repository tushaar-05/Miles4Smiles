'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Users,
  CheckCircle2,
  Clock,
  IndianRupee,
  Search,
  Download,
  RefreshCw,
  Lock,
  Eye,
  EyeOff,
  ShieldAlert,
  Phone,
  Mail,
  Shirt,
  X,
  Trash2,
  Edit3,
  UserPlus,
  MessageCircle,
  Copy,
  Check,
  Save,
  Award,
  Globe,
  ArrowUpRight,
  BarChart3,
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
  category: string; // 'Male' | 'Female' | 'Senior Adult'
  race_type?: string; // 'Competitive 5K' | 'Non-Competitive 5K' | 'Unknown'
  amount: number;
  chest_number: string;
  bib_number: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  payment_status: 'paid' | 'pending';
  created_at: string;
}

export default function AdminDashboardPage() {
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
    totalViews: 0,
    homeViews: 0,
    bounceRate: 0,
  });

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [raceTypeFilter, setRaceTypeFilter] = useState<string>('all');
  const [sizeFilter, setSizeFilter] = useState<string>('all');

  // Modals & Forms
  const [selectedRunner, setSelectedRunner] = useState<RegistrationRecord | null>(null);
  const [editingRunner, setEditingRunner] = useState<RegistrationRecord | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Lock background scroll when any modal is open
  useEffect(() => {
    if (editingRunner || isAddingNew || selectedRunner) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [editingRunner, isAddingNew, selectedRunner]);

  // New Participant Form State
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

  // Check saved session on mount
  useEffect(() => {
    const saved = sessionStorage.getItem('m4s_admin_passcode');
    if (saved) {
      setPasscode(saved);
      verifyAndLoad(saved);
    }
    fetchPageViews();
  }, []);

  const verifyAndLoad = async (codeToVerify: string) => {
    setIsVerifying(true);
    setAuthError('');
    try {
      const res = await fetch(`/api/admin/registrations`, {
        headers: { 'x-admin-passcode': codeToVerify },
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setAuthError(data.error || 'Invalid passcode');
        setIsAuthenticated(false);
        sessionStorage.removeItem('m4s_admin_passcode');
      } else {
        setIsAuthenticated(true);
        sessionStorage.setItem('m4s_admin_passcode', codeToVerify);
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
          headers: { 'x-admin-passcode': passcode },
        }),
        fetchPageViews(),
      ]);
      const data = await regRes.json();
      if (data.success) {
        setRegistrations(data.registrations || []);
      }
    } catch (err) {
      console.error('Error refreshing data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Update Existing Runner ───
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRunner) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/registrations', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': passcode,
        },
        body: JSON.stringify(editingRunner),
      });
      const data = await res.json();
      if (data.success) {
        setRegistrations(prev =>
          prev.map(r => (r.id === editingRunner.id ? { ...r, ...data.registration } : r))
        );
        if (selectedRunner?.id === editingRunner.id) {
          setSelectedRunner(data.registration);
        }
        setEditingRunner(null);
        alert('Runner information updated successfully!');
      } else {
        alert(`Failed to update: ${data.error}`);
      }
    } catch (err) {
      alert('Network error while saving changes.');
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Create New Runner (Manual / On-Spot) ───
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
          'x-admin-passcode': passcode,
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
        alert(`Runner registered successfully with BIB: ${data.registration.bib_number}!`);
      } else {
        alert(`Failed to create registration: ${data.error}`);
      }
    } catch (err) {
      alert('Network error while creating registration.');
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Quick Payment Status Toggle ───
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
        if (selectedRunner?.id === id) {
          setSelectedRunner(prev => (prev ? { ...prev, payment_status: newStatus as 'paid' | 'pending' } : null));
        }
      } else {
        alert(`Failed to update status: ${data.error}`);
      }
    } catch (err) {
      alert('Network error while updating status.');
    } finally {
      setUpdatingId(null);
    }
  };

  // ─── Delete Runner ───
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
        if (selectedRunner?.id === id) setSelectedRunner(null);
      } else {
        alert(`Failed to delete: ${data.error}`);
      }
    } catch (err) {
      alert('Network error while deleting record.');
    } finally {
      setUpdatingId(null);
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
    sessionStorage.removeItem('m4s_admin_passcode');
  };

  // ─── Analytics Metrics ───
  const metrics = useMemo(() => {
    const total = registrations.length;
    const paidList = registrations.filter(r => r.payment_status === 'paid');
    const pendingList = registrations.filter(r => r.payment_status === 'pending');
    const totalRevenue = paidList.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

    const maleCount = registrations.filter(r => (r.category || '').toLowerCase() === 'male').length;
    const femaleCount = registrations.filter(r => (r.category || '').toLowerCase() === 'female').length;
    const seniorCount = registrations.filter(r => (r.category || '').toLowerCase().includes('senior')).length;

    const compCount = registrations.filter(r => (r.race_type || '').toLowerCase().includes('comp')).length;
    const joyCount = registrations.filter(r => (r.race_type || '').toLowerCase().includes('non') || (r.race_type || '').toLowerCase().includes('joy')).length;
    const unknownCount = registrations.filter(r => !r.race_type || r.race_type === 'Unknown').length;

    const tShirtCounts: Record<string, number> = { S: 0, M: 0, L: 0, XL: 0, XXL: 0 };
    registrations.forEach(r => {
      const size = (r.t_shirt_size || 'M').toUpperCase().trim();
      if (tShirtCounts[size] !== undefined) {
        tShirtCounts[size]++;
      } else {
        tShirtCounts[size] = (tShirtCounts[size] || 0) + 1;
      }
    });

    const paidRate = total > 0 ? Math.round((paidList.length / total) * 100) : 0;
    const malePercent = total > 0 ? Math.round((maleCount / total) * 100) : 0;
    const femalePercent = total > 0 ? Math.round((femaleCount / total) * 100) : 0;
    const seniorPercent = total > 0 ? Math.round((seniorCount / total) * 100) : 0;
    const compPercent = total > 0 ? Math.round((compCount / total) * 100) : 0;
    const joyPercent = total > 0 ? Math.round((joyCount / total) * 100) : 0;

    return {
      total,
      paid: paidList.length,
      pending: pendingList.length,
      revenue: totalRevenue,
      paidRate,
      male: maleCount,
      female: femaleCount,
      senior: seniorCount,
      malePercent,
      femalePercent,
      seniorPercent,
      competitive: compCount,
      joy: joyCount,
      compPercent,
      joyPercent,
      unknownRaceType: unknownCount,
      tShirts: tShirtCounts,
    };
  }, [registrations]);

  // ─── Filtered Runners ───
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
        (raceTypeFilter === 'non-competitive' && ((runner.race_type || '').toLowerCase().includes('non') || (runner.race_type || '').toLowerCase().includes('joy'))) ||
        (raceTypeFilter === 'unknown' && (!runner.race_type || runner.race_type === 'Unknown'));

      const matchSize = sizeFilter === 'all' || (runner.t_shirt_size || '').toUpperCase().trim() === sizeFilter;

      return matchSearch && matchStatus && matchCategory && matchRaceType && matchSize;
    });
  }, [registrations, searchQuery, statusFilter, categoryFilter, raceTypeFilter, sizeFilter]);

  // ─── CSV Export ───
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
      'Order ID',
      'Payment ID',
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
      `"${r.race_type || 'Unknown'}"`,
      `"${r.amount || 0}"`,
      `"${r.payment_status || 'pending'}"`,
      `"${r.emergency_name || ''}"`,
      `"${r.emergency_phone || ''}"`,
      `"${r.razorpay_order_id || ''}"`,
      `"${r.razorpay_payment_id || ''}"`,
      `"${new Date(r.created_at).toLocaleString()}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `miles4smiles_runners_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ═════════════════════════════════════════════════════════════════════
  // VIEW: Passcode Gate Screen
  // ═════════════════════════════════════════════════════════════════════
  if (!isAuthenticated) {
    return (
      <div className="admin-login-wrapper">
        <style>{`
          .admin-login-wrapper {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f1f5f9;
            font-family: 'Inter', system-ui, sans-serif;
            padding: 24px;
            color: #0f172a;
          }
          .login-card {
            width: 100%;
            max-width: 420px;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 20px;
            padding: 36px 30px;
            box-shadow: 0 10px 35px rgba(0, 0, 0, 0.08);
            text-align: center;
          }
          .login-icon {
            width: 60px;
            height: 60px;
            border-radius: 16px;
            background: #0b1a4a;
            color: #C8FF3D;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 18px;
            box-shadow: 0 8px 24px rgba(11, 26, 74, 0.2);
          }
          .login-input {
            width: 100%;
            padding: 12px 16px;
            background: #f8fafc;
            border: 1.5px solid #cbd5e1;
            border-radius: 10px;
            color: #0f172a;
            font-size: 15px;
            outline: none;
            transition: all 0.2s;
          }
          .login-input:focus {
            border-color: #12318b;
            background: #ffffff;
            box-shadow: 0 0 0 3px rgba(18, 49, 139, 0.12);
          }
          .login-btn {
            width: 100%;
            padding: 13px;
            background: #0b1a4a;
            color: #C8FF3D;
            font-weight: 800;
            font-size: 14px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.2s;
            margin-top: 16px;
          }
          .login-btn:hover:not(:disabled) {
            background: #12318b;
            transform: translateY(-1px);
            box-shadow: 0 8px 20px rgba(11, 26, 74, 0.25);
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

          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '4px', letterSpacing: '-0.02em' }}>
            Organizer Command Center
          </h2>
          <p style={{ color: '#64748b', fontSize: '13.5px', marginBottom: '24px' }}>
            Miles for Smiles — 5K Charity Run
          </p>

          <form onSubmit={handleLoginSubmit}>
            <div style={{ position: 'relative', marginBottom: '14px', textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Admin Passcode
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPasscode ? 'text' : 'password'}
                  placeholder="Enter organizer passcode..."
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
              <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', padding: '9px 12px', borderRadius: '8px', color: '#b91c1c', fontSize: '13px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert size={16} />
                <span>{authError}</span>
              </div>
            )}

            <button type="submit" disabled={isVerifying || !passcode.trim()} className="login-btn">
              {isVerifying ? 'Authenticating...' : 'Unlock Dashboard'}
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
  // VIEW: Main Dashboard (Royal Blue Navbar + Light Content Theme)
  // ═════════════════════════════════════════════════════════════════════
  return (
    <div className="admin-container">
      <style>{`
        .admin-container {
          min-height: 100vh;
          background: #f8fafc;
          color: #0f172a;
          font-family: 'Inter', system-ui, sans-serif;
          padding-bottom: 60px;
        }

        /* Royal Blue Navbar */
        .admin-nav {
          background: #0b1a4a;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          padding: 14px 28px;
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

        .metric-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .metric-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
        }

        .table-shell {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
        }

        .table-row-hover:hover {
          background: #f8fafc;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
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

        .action-btn-mini {
          padding: 5px 9px;
          border-radius: 6px;
          font-size: 11.5px;
          font-weight: 700;
          cursor: pointer;
          border: 1px solid transparent;
          transition: all 0.15s;
          display: inline-flex;
          align-items: center;
          gap: 4px;
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
          overflow-y: auto;
        }
        .runner-modal {
          width: 100%;
          max-width: 640px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 25px 60px rgba(15, 23, 42, 0.35);
          display: flex;
          flex-direction: column;
          max-height: 88vh;
          position: relative;
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
        /* Custom Clean Scrollbar */
        .modal-body-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .modal-body-scroll::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .modal-body-scroll::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .modal-body-scroll::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        .form-input {
          width: 100%;
          padding: 9px 12px;
          background: #f8fafc;
          border: 1.5px solid #cbd5e1;
          border-radius: 8px;
          color: #0f172a;
          font-size: 13.5px;
          outline: none;
        }
        .form-input:focus {
          border-color: #12318b;
          background: #ffffff;
          box-shadow: 0 0 0 2px rgba(18, 49, 139, 0.1);
        }
        .form-input-locked {
          background: #f1f5f9 !important;
          color: #334155 !important;
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

        @media (max-width: 768px) {
          .admin-nav { padding: 12px 16px; }
          .metrics-grid { grid-template-columns: 1fr 1fr !important; }
          .modal-body-scroll { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ─── Top Navbar (Royal Blue) ─── */}
      <header className="admin-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
            <Image src="/images/logo.png" alt="Miles for Smiles" width={130} height={34} style={{ height: '28px', width: 'auto' }} />
          </Link>
          <div style={{ height: '20px', width: '1px', background: 'rgba(255, 255, 255, 0.25)' }} />
          <span style={{ fontSize: '13px', fontWeight: 800, color: '#C8FF3D', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Admin Dashboard
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Analytics Page Link */}
          <Link
            href="/admin/analytics"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#38bdf8',
              fontSize: '13px',
              fontWeight: 800,
              textDecoration: 'none',
            }}
          >
            <BarChart3 size={15} />
            <span>Traffic & Analytics</span>
          </Link>

          {/* Add On-Spot Runner Button */}
          <button
            onClick={() => setIsAddingNew(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              background: '#38bdf8',
              border: 'none',
              color: '#081333',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
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
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>

          <button
            onClick={exportToCSV}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              background: '#C8FF3D',
              border: 'none',
              color: '#0b1a4a',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleLogout}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              color: '#fca5a5',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* ─── Main Content Container (Light Theme) ─── */}
      <main style={{ maxWidth: '1360px', margin: '0 auto', padding: '24px 20px' }}>

        {/* ─── Executive Metric KPI Grid ─── */}
        <div className="metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '14px', marginBottom: '18px' }}>
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
                Live DB
              </span>
              <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                General Participants
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

          {/* Card 3: Pending Payment */}
          <div className="exec-stat-card">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#92400e', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Pending Payment
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
                Gateway / Spot
              </span>
              <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                Awaiting Payment
              </span>
            </div>
          </div>

          {/* Card 4: Total Revenue */}
          <div className="exec-stat-card">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#0b1a4a', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Total Revenue
                </span>
                <div style={{ fontSize: '28px', fontWeight: 900, color: '#0b1a4a', letterSpacing: '-0.03em', lineHeight: 1.1, marginTop: '4px' }}>
                  ₹{metrics.revenue.toLocaleString()}
                </div>
              </div>

              <div className="stat-icon-bubble" style={{ background: '#eff6ff', color: '#0b1a4a' }}>
                <IndianRupee size={16} />
              </div>
            </div>

            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', background: '#f1f5f9', color: '#0f172a', padding: '2px 7px', borderRadius: '6px', fontSize: '11px', fontWeight: 800 }}>
                Verified
              </span>
              <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                Paid Collections
              </span>
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

            <Link
              href="/admin/analytics"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: '#38bdf8',
                color: '#081333',
                padding: '9px 16px',
                borderRadius: '10px',
                fontSize: '12.5px',
                fontWeight: 800,
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(56, 189, 248, 0.3)',
                whiteSpace: 'nowrap',
              }}
            >
              <span>Full Analytics →</span>
            </Link>
          </div>
        </div>

        {/* ─── Breakdown Row (Divisions, Race Types, T-Shirt Sizes) ─── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '18px' }}>
          
          {/* Card: Demographic Divisions */}
          <div className="exec-stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Category Divisions
              </span>
              <div className="stat-icon-bubble" style={{ background: '#f1f5f9', color: '#475569' }}>
                <Users size={15} />
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

          {/* Card: Race Tier Breakdown */}
          <div className="exec-stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Race Tier Selected
              </span>
              <div className="stat-icon-bubble" style={{ background: '#f1f5f9', color: '#475569' }}>
                <Award size={15} />
              </div>
            </div>

            {/* 3 Proportional Micro Stat Boxes */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginTop: '2px' }}>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '5px 4px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>COMP</div>
                <div style={{ fontSize: '15px', fontWeight: 900, color: '#16a34a' }}>{metrics.competitive}</div>
              </div>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '5px 4px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>JOY</div>
                <div style={{ fontSize: '15px', fontWeight: 900, color: '#0284c7' }}>{metrics.joy}</div>
              </div>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '5px 4px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>OTHER</div>
                <div style={{ fontSize: '15px', fontWeight: 900, color: '#64748b' }}>{metrics.unknownRaceType}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Search & Filters Bar ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px 20px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Live Search Input */}
            <div style={{ position: 'relative', flex: '1 1 300px', minWidth: '240px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search by Name, BIB, Phone, Email, City..."
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

            {/* Showing Count */}
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
              Showing <strong style={{ color: '#0f172a' }}>{filteredRegistrations.length}</strong> of {registrations.length} runners
            </div>
          </div>

          {/* Filter Chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginRight: '4px' }}>
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

            <div style={{ width: '1px', height: '20px', background: '#cbd5e1', margin: '0 4px' }} />

            <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginRight: '4px' }}>
              Division:
            </span>
            <button className={`filter-btn ${categoryFilter === 'all' ? 'active' : ''}`} onClick={() => setCategoryFilter('all')}>
              All
            </button>
            <button className={`filter-btn ${categoryFilter === 'male' ? 'active' : ''}`} onClick={() => setCategoryFilter('male')}>
              Male ({metrics.male})
            </button>
            <button className={`filter-btn ${categoryFilter === 'female' ? 'active' : ''}`} onClick={() => setCategoryFilter('female')}>
              Female ({metrics.female})
            </button>
            <button className={`filter-btn ${categoryFilter === 'senior' ? 'active' : ''}`} onClick={() => setCategoryFilter('senior')}>
              Senior 40+ ({metrics.senior})
            </button>
          </div>
        </div>

        {/* ─── Main Registrations Table ─── */}
        <div className="table-shell">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.08em' }}>
                  <th style={{ padding: '14px 16px' }}>BIB / Chest</th>
                  <th style={{ padding: '14px 16px' }}>Runner Details</th>
                  <th style={{ padding: '14px 16px' }}>Contact & Actions</th>
                  <th style={{ padding: '14px 16px' }}>Category & Kit</th>
                  <th style={{ padding: '14px 16px' }}>Race Type</th>
                  <th style={{ padding: '14px 16px' }}>Amount</th>
                  <th style={{ padding: '14px 16px' }}>Status</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right' }}>Manage</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
                      No registrations match your search and filter criteria.
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

                          {/* 1-Click WhatsApp Link */}
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
                          {runner.race_type || 'Unknown'}
                        </span>
                      </td>

                      {/* Amount Paid */}
                      <td style={{ padding: '12px 16px', fontWeight: 700 }}>
                        {runner.amount > 0 ? (
                          <span style={{ color: '#0b1a4a' }}>₹{runner.amount}</span>
                        ) : (
                          <span style={{ color: '#94a3b8' }}>—</span>
                        )}
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

                      {/* Action Buttons */}
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          {/* Quick Toggle Status */}
                          <button
                            onClick={() => handleStatusToggle(runner.id, runner.payment_status)}
                            disabled={updatingId === runner.id}
                            className="action-btn-mini"
                            style={{
                              background: runner.payment_status === 'paid' ? '#fef3c7' : '#dcfce7',
                              color: runner.payment_status === 'paid' ? '#b45309' : '#15803d',
                              border: runner.payment_status === 'paid' ? '1px solid #fde68a' : '1px solid #bbf7d0',
                            }}
                            title={runner.payment_status === 'paid' ? 'Mark as Pending' : 'Mark as Paid'}
                          >
                            {runner.payment_status === 'paid' ? 'Set Pending' : 'Mark Paid'}
                          </button>

                          {/* Edit Full Profile */}
                          <button
                            onClick={() => setEditingRunner({ ...runner })}
                            className="action-btn-mini"
                            style={{ background: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd' }}
                            title="Edit User Profile"
                          >
                            <Edit3 size={12} /> Edit
                          </button>

                          {/* View Modal */}
                          <button
                            onClick={() => setSelectedRunner(runner)}
                            className="action-btn-mini"
                            style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1' }}
                            title="View Details"
                          >
                            Details
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteRecord(runner.id, `${runner.first_name} ${runner.last_name}`)}
                            disabled={updatingId === runner.id}
                            className="action-btn-mini"
                            style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5' }}
                            title="Delete Record"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ═════════════════════════════════════════════════════════════════
          MODAL 1: EDIT RUNNER INFORMATION (ROBUST SCROLL + LOCKED BG)
         ═════════════════════════════════════════════════════════════════ */}
      {editingRunner && (
        <div className="runner-modal-backdrop" onClick={() => setEditingRunner(null)}>
          <div className="runner-modal" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '88vh', overflow: 'hidden' }}>
              {/* Pinned Header */}
              <div style={{ padding: '18px 24px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Edit3 size={18} color="#0b1a4a" />
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Edit Participant Information
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingRunner(null)}
                  style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <div className="modal-body-scroll">
                {/* Name */}
                <div>
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    required
                    value={editingRunner.first_name}
                    onChange={e => setEditingRunner({ ...editingRunner, first_name: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    required
                    value={editingRunner.last_name}
                    onChange={e => setEditingRunner({ ...editingRunner, last_name: e.target.value })}
                    className="form-input"
                  />
                </div>

                {/* Contact */}
                <div>
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={editingRunner.phone}
                    onChange={e => setEditingRunner({ ...editingRunner, phone: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    required
                    value={editingRunner.email}
                    onChange={e => setEditingRunner({ ...editingRunner, email: e.target.value })}
                    className="form-input"
                  />
                </div>

                {/* Gender & DOB */}
                <div>
                  <label className="form-label">Gender</label>
                  <select
                    value={editingRunner.gender}
                    onChange={e => setEditingRunner({ ...editingRunner, gender: e.target.value })}
                    className="form-input"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Date of Birth (YYYY-MM-DD)</label>
                  <input
                    type="date"
                    value={editingRunner.dob}
                    onChange={e => setEditingRunner({ ...editingRunner, dob: e.target.value })}
                    className="form-input"
                  />
                </div>

                {/* T-Shirt & Blood Group */}
                <div>
                  <label className="form-label">T-Shirt Size</label>
                  <select
                    value={editingRunner.t_shirt_size}
                    onChange={e => setEditingRunner({ ...editingRunner, t_shirt_size: e.target.value })}
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
                    value={editingRunner.blood_group}
                    onChange={e => setEditingRunner({ ...editingRunner, blood_group: e.target.value })}
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

                {/* City & Physical */}
                <div>
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    value={editingRunner.city}
                    onChange={e => setEditingRunner({ ...editingRunner, city: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Height (cm) / Weight (kg)</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="Height"
                      value={editingRunner.height || ''}
                      onChange={e => setEditingRunner({ ...editingRunner, height: e.target.value })}
                      className="form-input"
                    />
                    <input
                      type="text"
                      placeholder="Weight"
                      value={editingRunner.weight || ''}
                      onChange={e => setEditingRunner({ ...editingRunner, weight: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Race Division & Race Type */}
                <div>
                  <label className="form-label">Division Category</label>
                  <select
                    value={editingRunner.category}
                    onChange={e => setEditingRunner({ ...editingRunner, category: e.target.value })}
                    className="form-input"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Senior Adult">Senior Adult (40+)</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Race Tier</label>
                  <select
                    value={editingRunner.race_type || 'Competitive 5K'}
                    onChange={e => setEditingRunner({ ...editingRunner, race_type: e.target.value })}
                    className="form-input"
                  >
                    <option value="Competitive 5K">Competitive 5K</option>
                    <option value="Non-Competitive 5K">Non-Competitive 5K (Joy Run)</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>

                {/* BIB & Chest */}
                <div>
                  <label className="form-label">BIB Number</label>
                  <input
                    type="text"
                    value={editingRunner.bib_number || ''}
                    onChange={e => setEditingRunner({ ...editingRunner, bib_number: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Chest Number</label>
                  <input
                    type="text"
                    value={editingRunner.chest_number || ''}
                    onChange={e => setEditingRunner({ ...editingRunner, chest_number: e.target.value })}
                    className="form-input"
                  />
                </div>

                {/* Payment Status & Amount */}
                <div>
                  <label className="form-label">Payment Status</label>
                  <select
                    value={editingRunner.payment_status}
                    onChange={e => setEditingRunner({ ...editingRunner, payment_status: e.target.value as 'paid' | 'pending' })}
                    className="form-input"
                  >
                    <option value="paid">PAID</option>
                    <option value="pending">PENDING</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Amount Paid (₹)</label>
                  <input
                    type="number"
                    value={editingRunner.amount}
                    onChange={e => setEditingRunner({ ...editingRunner, amount: Number(e.target.value) })}
                    className="form-input"
                  />
                </div>

                {/* Emergency Contact */}
                <div>
                  <label className="form-label">Emergency Contact Person</label>
                  <input
                    type="text"
                    value={editingRunner.emergency_name || ''}
                    onChange={e => setEditingRunner({ ...editingRunner, emergency_name: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Emergency Contact Phone</label>
                  <input
                    type="tel"
                    value={editingRunner.emergency_phone || ''}
                    onChange={e => setEditingRunner({ ...editingRunner, emergency_phone: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Pinned Footer */}
              <div style={{ padding: '16px 24px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '10px', flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => setEditingRunner(null)}
                  style={{ padding: '9px 18px', borderRadius: '8px', background: '#e2e8f0', color: '#334155', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  style={{ padding: '9px 22px', borderRadius: '8px', background: '#0b1a4a', color: '#C8FF3D', border: 'none', cursor: 'pointer', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Save size={15} />
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════
          MODAL 2: ADD NEW PARTICIPANT (ROBUST SCROLL + LOCKED BG)
         ═════════════════════════════════════════════════════════════════ */}
      {isAddingNew && (
        <div className="runner-modal-backdrop" onClick={() => setIsAddingNew(false)}>
          <div className="runner-modal" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSaveNewRunner} style={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '88vh', overflow: 'hidden' }}>
              <div style={{ padding: '18px 24px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <UserPlus size={18} color="#0b1a4a" />
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Add On-Spot Participant
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
                    placeholder="10-digit mobile"
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

                <div>
                  <label className="form-label">Race Tier</label>
                  <select
                    value={newRunnerData.race_type}
                    onChange={e => setNewRunnerData({ ...newRunnerData, race_type: e.target.value, amount: e.target.value === 'Competitive 5K' ? 249 : 149 })}
                    className="form-input"
                  >
                    <option value="Competitive 5K">Competitive 5K (₹249)</option>
                    <option value="Non-Competitive 5K">Non-Competitive 5K (₹149)</option>
                  </select>
                </div>
                <div>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Amount Collected (₹)</span>
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
                  <label className="form-label">Payment Status</label>
                  <select
                    value={newRunnerData.payment_status}
                    onChange={e => setNewRunnerData({ ...newRunnerData, payment_status: e.target.value as 'paid' | 'pending' })}
                    className="form-input"
                  >
                    <option value="paid">PAID (Cash / Spot UPI)</option>
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
                    value={newRunnerData.emergency_name}
                    onChange={e => setNewRunnerData({ ...newRunnerData, emergency_name: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Emergency Contact Phone</label>
                  <input
                    type="tel"
                    value={newRunnerData.emergency_phone}
                    onChange={e => setNewRunnerData({ ...newRunnerData, emergency_phone: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ padding: '16px 24px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '10px', flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  style={{ padding: '9px 18px', borderRadius: '8px', background: '#e2e8f0', color: '#334155', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  style={{ padding: '9px 22px', borderRadius: '8px', background: '#0b1a4a', color: '#C8FF3D', border: 'none', cursor: 'pointer', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
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
          MODAL 3: RUNNER PROFILE DETAILS (ROBUST SCROLL + LOCKED BG)
         ═════════════════════════════════════════════════════════════════ */}
      {selectedRunner && (
        <div className="runner-modal-backdrop" onClick={() => setSelectedRunner(null)}>
          <div className="runner-modal" onClick={e => e.stopPropagation()}>
            {/* Pinned Header */}
            <div style={{ padding: '20px 24px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#0b1a4a', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Runner Details
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '2px 0 0' }}>
                  {selectedRunner.first_name} {selectedRunner.last_name}
                </h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => {
                    setEditingRunner({ ...selectedRunner });
                    setSelectedRunner(null);
                  }}
                  style={{ background: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Edit3 size={13} /> Edit
                </button>
                <button
                  onClick={() => setSelectedRunner(null)}
                  style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Scrollable Modal Body */}
            <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13px', overflowY: 'auto', overscrollBehavior: 'contain', flex: 1, minHeight: 0 }}>
              <div>
                <div style={{ color: '#64748b', fontSize: '11.5px', fontWeight: 600 }}>BIB NUMBER</div>
                <div style={{ fontWeight: 800, color: '#0b1a4a', fontSize: '16px' }}>{selectedRunner.bib_number || 'Pending'}</div>
              </div>

              <div>
                <div style={{ color: '#64748b', fontSize: '11.5px', fontWeight: 600 }}>CHEST NUMBER</div>
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '16px' }}>#{selectedRunner.chest_number || '—'}</div>
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
                <div style={{ color: '#0f172a', fontWeight: 600 }}>{selectedRunner.phone}</div>
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
                <div style={{ color: '#64748b', fontSize: '11.5px', fontWeight: 600 }}>CITY & PHYSICAL</div>
                <div style={{ color: '#0f172a' }}>{selectedRunner.city} {selectedRunner.height ? `(${selectedRunner.height}cm, ${selectedRunner.weight}kg)` : ''}</div>
              </div>

              <div style={{ gridColumn: 'span 2', background: '#fee2e2', padding: '12px', borderRadius: '10px', border: '1px solid #fca5a5' }}>
                <div style={{ color: '#b91c1c', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>EMERGENCY CONTACT</div>
                <div style={{ color: '#7f1d1d', fontWeight: 700, marginTop: '2px' }}>
                  {selectedRunner.emergency_name} — {selectedRunner.emergency_phone}
                </div>
              </div>

              <div style={{ gridColumn: 'span 2', fontSize: '11.5px', color: '#64748b' }}>
                <div>Order Ref: {selectedRunner.razorpay_order_id || '—'}</div>
                <div>Payment Ref: {selectedRunner.razorpay_payment_id || '—'}</div>
                <div>Registered: {new Date(selectedRunner.created_at).toLocaleString()}</div>
              </div>
            </div>

            {/* Pinned Footer */}
            <div style={{ padding: '14px 24px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <button
                onClick={() => handleStatusToggle(selectedRunner.id, selectedRunner.payment_status)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontWeight: 800,
                  fontSize: '12.5px',
                  border: 'none',
                  cursor: 'pointer',
                  background: selectedRunner.payment_status === 'paid' ? '#f59e0b' : '#16a34a',
                  color: '#ffffff',
                }}
              >
                {selectedRunner.payment_status === 'paid' ? 'Mark as Pending' : 'Mark as Paid'}
              </button>

              <button
                onClick={() => setSelectedRunner(null)}
                style={{ padding: '8px 16px', borderRadius: '8px', background: '#e2e8f0', color: '#334155', border: 'none', cursor: 'pointer', fontSize: '12.5px', fontWeight: 600 }}
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
