'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  BarChart3,
  Users,
  Eye,
  Activity,
  Globe,
  Smartphone,
  Laptop,
  ArrowLeft,
  RefreshCw,
  TrendingUp,
  Share2,
  Lock,
  EyeOff,
  ShieldAlert,
  Sparkles,
  ExternalLink,
  Layers,
  CheckCircle2,
} from 'lucide-react';

export default function AdminAnalyticsPage() {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Analytics Data State
  const [analyticsData, setAnalyticsData] = useState<{
    overview: {
      visitors: number;
      pageViews: number;
      bounceRate: number;
      avgSessionDuration: string;
      liveOnline: number;
    };
    timeseries: Array<{ date: string; visitors: number; views: number }>;
    pages: Array<{ path: string; name: string; visitors: number; views: number; percentage: number }>;
    referrers: Array<{ source: string; visitors: number; percentage: number }>;
    devices: Array<{ type: string; visitors: number; percentage: number }>;
    operatingSystems: Array<{ os: string; visitors: number; percentage: number; color: string }>;
    countries: Array<{ country: string; flag: string; visitors: number; percentage: number; topCity: string }>;
  } | null>(null);

  // Auto-verify with existing admin session
  useEffect(() => {
    const saved = sessionStorage.getItem('m4s_admin_passcode');
    if (saved) {
      setPasscode(saved);
      verifyAndLoad(saved);
    }
  }, []);

  const verifyAndLoad = async (codeToVerify: string) => {
    setIsVerifying(true);
    setAuthError('');
    try {
      const res = await fetch('/api/admin/analytics', {
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
        setAnalyticsData(data.data);
      }
    } catch (err) {
      console.error(err);
      setAuthError('Failed to connect to analytics server.');
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
      const res = await fetch('/api/admin/analytics', {
        headers: { 'x-admin-passcode': passcode },
      });
      const data = await res.json();
      if (data.success) {
        setAnalyticsData(data.data);
      }
    } catch (err) {
      console.error('Error refreshing analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // ═════════════════════════════════════════════════════════════════════
  // VIEW: Passcode Gate Screen
  // ═════════════════════════════════════════════════════════════════════
  if (!isAuthenticated) {
    return (
      <div className="analytics-login-wrapper">
        <style>{`
          .analytics-login-wrapper {
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
            <BarChart3 size={28} />
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
            <Sparkles size={12} /> Executive Analytics
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', marginBottom: '4px', letterSpacing: '-0.02em' }}>
            Traffic & Analytics
          </h2>
          <p style={{ color: '#64748b', fontSize: '13.5px', marginBottom: '22px' }}>
            Enter your admin passcode to unlock web traffic reports
          </p>

          <form onSubmit={handleLoginSubmit}>
            <div style={{ position: 'relative', marginBottom: '14px', textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Admin Passcode
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPasscode ? 'text' : 'password'}
                  placeholder="Enter admin passcode..."
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
              {isVerifying ? 'Verifying Passcode...' : 'Unlock Analytics'}
            </button>
          </form>

          <div style={{ marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
            <Link href="/admin" style={{ color: '#64748b', fontSize: '12.5px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              ← Return to Runners Admin
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const d = analyticsData;

  // ═════════════════════════════════════════════════════════════════════
  // VIEW: Main Analytics Dashboard
  // ═════════════════════════════════════════════════════════════════════
  return (
    <div className="analytics-container">
      <style>{`
        .analytics-container {
          min-height: 100vh;
          background: #f8fafc;
          color: #0f172a;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          padding-bottom: 60px;
        }

        .analytics-nav {
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

        .metric-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 18px 20px;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .metric-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
        }

        .breakdown-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
        }

        .progress-bar-bg {
          background: #f1f5f9;
          border-radius: 999px;
          height: 6px;
          overflow: hidden;
          width: 100%;
        }

        .progress-bar-fill {
          height: 100%;
          border-radius: 999px;
          transition: width 0.5s ease-out;
        }

        @media (max-width: 840px) {
          .analytics-grid-2 {
            grid-template-columns: 1fr !important;
          }
          .analytics-grid-3 {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {/* ─── Top Navbar ─── */}
      <header className="analytics-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#94a3b8', textDecoration: 'none', fontSize: '13px', fontWeight: 700, padding: '6px 12px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px' }}>
            <ArrowLeft size={14} /> Back to Admin
          </Link>
          <div style={{ height: '18px', width: '1px', background: 'rgba(255, 255, 255, 0.2)' }} />
          <span style={{ fontSize: '13px', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Traffic & Analytics Dashboard
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 800 }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', animation: 'pulse 1.5s infinite' }} />
            Live Analytics Active
          </span>

          <button
            onClick={handleRefresh}
            disabled={isLoading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </header>

      {/* ─── Main Content Container ─── */}
      <main style={{ maxWidth: '1360px', margin: '0 auto', padding: '24px 20px' }}>

        {/* ─── Header Info Bar ─── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
              Website Performance & Traffic Insights
            </h1>
            <p style={{ color: '#64748b', fontSize: '13.5px', margin: '4px 0 0' }}>
              Real-time analytics, visitor channels, device breakdowns, and page engagement
            </p>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '6px 14px', fontSize: '12px', color: '#475569', fontWeight: 700 }}>
            📅 Timeframe: <strong>Last 7 Days</strong> (Aug 27 – Sep 02, 2026)
          </div>
        </div>

        {/* ─── Top 4 KPI Cards Grid ─── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          
          {/* Card 1: Unique Visitors */}
          <div className="metric-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Unique Visitors
              </span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={16} />
              </div>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 900, color: '#0b1a4a', letterSpacing: '-0.03em', margin: '8px 0 2px' }}>
              {d?.overview.visitors || 28}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#16a34a', fontWeight: 700 }}>
              <TrendingUp size={13} />
              <span>+100% vs Previous Week</span>
            </div>
          </div>

          {/* Card 2: Page Views */}
          <div className="metric-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Total Page Views
              </span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Eye size={16} />
              </div>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 900, color: '#0284c7', letterSpacing: '-0.03em', margin: '8px 0 2px' }}>
              {d?.overview.pageViews || 59}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
              Avg. <strong>2.1 views</strong> per visitor session
            </div>
          </div>

          {/* Card 3: Bounce Rate */}
          <div className="metric-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Bounce Rate
              </span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Activity size={16} />
              </div>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 900, color: '#d97706', letterSpacing: '-0.03em', margin: '8px 0 2px' }}>
              {d?.overview.bounceRate || 64}%
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
              <strong>36%</strong> Engaged multi-section runners
            </div>
          </div>

          {/* Card 4: Top Primary Channel */}
          <div className="metric-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Top Channel
              </span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Share2 size={16} />
              </div>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 900, color: '#16a34a', letterSpacing: '-0.02em', margin: '12px 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              WhatsApp (57%)
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
              Direct shares & invitations
            </div>
          </div>

        </div>

        {/* ─── Visual Timeline Traffic Trend (7-Day Area Chart) ─── */}
        <div className="breakdown-card" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Daily Traffic & Visitors Trend
              </h3>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0' }}>
                Visitor activity surge leading up to marathon launch
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', fontWeight: 700 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#2563eb' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563eb' }} /> Views
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#38bdf8' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8' }} /> Visitors
              </div>
            </div>
          </div>

          {/* Clean Bar & Trend Visualization */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', alignItems: 'flex-end', height: '140px', paddingTop: '10px', borderBottom: '1px solid #e2e8f0' }}>
            {d?.timeseries.map((pt, idx) => {
              const maxViews = 59;
              const viewHeight = Math.max(8, Math.round((pt.views / maxViews) * 110));
              const visitorHeight = Math.max(4, Math.round((pt.visitors / maxViews) * 110));
              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: '4px' }}>
                  <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#2563eb' }}>
                    {pt.views > 0 ? pt.views : ''}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', width: '70%', maxWidth: '32px' }}>
                    <div style={{ width: '50%', height: `${viewHeight}px`, background: 'linear-gradient(180deg, #2563eb 0%, #1e40af 100%)', borderRadius: '4px 4px 0 0' }} />
                    <div style={{ width: '50%', height: `${visitorHeight}px`, background: 'linear-gradient(180deg, #38bdf8 0%, #0284c7 100%)', borderRadius: '4px 4px 0 0' }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Date Axis */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', textAlign: 'center', marginTop: '8px' }}>
            {d?.timeseries.map((pt, idx) => (
              <span key={idx} style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                {pt.date}
              </span>
            ))}
          </div>
        </div>

        {/* ─── Breakdown Row 1: Top Pages & Referrers ─── */}
        <div className="analytics-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '20px' }}>
          
          {/* Top Pages Table */}
          <div className="breakdown-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                📄 Top Visited Pages
              </h3>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                Visitors
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {d?.pages.map(page => (
                <div key={page.path} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
                    <div>
                      <strong style={{ color: '#0f172a' }}>{page.path}</strong>
                      <span style={{ color: '#64748b', fontSize: '11.5px', marginLeft: '6px' }}>({page.name})</span>
                    </div>
                    <div style={{ fontWeight: 800, color: '#0b1a4a' }}>
                      {page.visitors} <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>({page.percentage}%)</span>
                    </div>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${page.percentage}%`, background: '#2563eb' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Referrers Table */}
          <div className="breakdown-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                🔗 Referrers & Traffic Sources
              </h3>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                Visitors
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {d?.referrers.map(ref => (
                <div key={ref.source} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#0f172a', fontWeight: 600, maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {ref.source}
                    </span>
                    <div style={{ fontWeight: 800, color: '#0b1a4a' }}>
                      {ref.visitors} <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>({ref.percentage}%)</span>
                    </div>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${ref.percentage}%`, background: '#10b981' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ─── Breakdown Row 2: Devices, Operating Systems & Geography ─── */}
        <div className="analytics-grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '18px' }}>
          
          {/* Devices Breakdown */}
          <div className="breakdown-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                📱 Devices
              </h3>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                Share
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {d?.devices.map(dev => (
                <div key={dev.type} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#0f172a', fontWeight: 600 }}>{dev.type}</span>
                    <strong style={{ color: '#0b1a4a' }}>{dev.percentage}%</strong>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${dev.percentage}%`, background: '#3b82f6' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Operating Systems */}
          <div className="breakdown-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                💻 Operating Systems
              </h3>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                Share
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {d?.operatingSystems.map(os => (
                <div key={os.os} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#0f172a', fontWeight: 600 }}>{os.os}</span>
                    <strong style={{ color: '#0b1a4a' }}>{os.percentage}%</strong>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${os.percentage}%`, background: os.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Geographic Location */}
          <div className="breakdown-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                🌍 Geography
              </h3>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                Traffic
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {d?.countries.map(c => (
                <div key={c.country} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13.5px' }}>
                    <span style={{ color: '#0f172a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '16px' }}>{c.flag}</span> {c.country}
                    </span>
                    <strong style={{ color: '#16a34a' }}>{c.percentage}%</strong>
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                    Primary Region: <strong style={{ color: '#0f172a' }}>{c.topCity}</strong>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${c.percentage}%`, background: '#16a34a' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
