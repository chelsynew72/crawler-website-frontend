import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BrandIcon, Icons } from './ui';

interface SidebarLayoutProps {
  children: React.ReactNode;
  title: React.ReactNode;
  topbarRight?: React.ReactNode;
}


function decodeToken(token: string): { id: string; exp: number } | null {
  try {
    const raw = token.replace('ci.', '');
    const payload = JSON.parse(atob(raw));
    if (!payload.id || !payload.exp) return null;
    if (payload.exp < Date.now()) return null; // expired
    return payload;
  } catch {
    return null;
  }
}

// ── Width hook ────────────────────────────────────────────────────────────────
function useWidth() {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return w;
}

// ── Logout modal ──────────────────────────────────────────────────────────────
function LogoutModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div onClick={e => { if (e.target === e.currentTarget) onCancel(); }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}>
      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 14, width: '100%', maxWidth: 360, padding: 28, animation: 'slideUp .25s cubic-bezier(.22,1,.36,1)', boxShadow: '0 8px 40px rgba(0,0,0,0.1)' }}>
        <div style={{ width: 44, height: 44, background: 'var(--bg)', border: '1px solid var(--border-dark)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-2)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </div>
        <h3 style={{ fontFamily: 'var(--ff-serif)', fontSize: 20, fontWeight: 400, color: 'var(--text)', marginBottom: 8 }}>Log out?</h3>
        <p style={{ fontSize: 14, color: 'var(--text-2)', fontWeight: 300, lineHeight: 1.6, marginBottom: 24 }}>
          You'll need to sign back in to access your campaigns and insights.
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: '10px 0', background: 'var(--white)', border: '1px solid var(--border-dark)', borderRadius: 8, fontSize: 14, color: 'var(--text-2)', cursor: 'pointer', fontFamily: 'var(--ff-sans)', transition: 'all .15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.color = 'var(--text)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--white)'; e.currentTarget.style.color = 'var(--text-2)'; }}>
            Cancel
          </button>
          <button onClick={onConfirm} style={{ flex: 1, padding: '10px 0', background: 'var(--text)', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500, color: '#fff', cursor: 'pointer', fontFamily: 'var(--ff-sans)', transition: 'background .15s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#2a2a2a'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--text)'}>
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}

// ── SidebarLayout ─────────────────────────────────────────────────────────────
export default function SidebarLayout({ children, title, topbarRight }: SidebarLayoutProps) {
  const navigate = useNavigate();
  const loc = useLocation();
  const w = useWidth();
  const isMobile = w < 768;

  const [userName, setUserName]   = useState('');
  const [userPlan, setUserPlan]   = useState('free');
  const [userInitials, setUserInitials] = useState('--');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) { navigate('/auth'); return; }

    const decoded = decodeToken(token);
    if (!decoded) {
      // Token invalid or expired
      localStorage.removeItem('auth_token');
      navigate('/auth');
      return;
    }

    // Token is valid — try to get user name from localStorage cache
    const cached = localStorage.getItem('user_info');
    if (cached) {
      try {
        const u = JSON.parse(cached);
        setUserName(`${u.first_name} ${u.last_name}`.trim());
        setUserPlan(u.plan || 'free');
        setUserInitials(`${u.first_name?.[0] ?? ''}${u.last_name?.[0] ?? ''}`.toUpperCase() || '?');
      } catch { /* use defaults */ }
    }
  }, [navigate]);

  useEffect(() => { setMobileOpen(false); }, [loc.pathname]);

  function handleLogout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    navigate('/auth');
  }

  const navItems = [
    { icon: <Icons.Grid />,    label: 'Campaigns', path: '/dashboard' },
    { icon: <Icons.Search />,  label: 'All Pages', path: '/pages' },
    { icon: <Icons.Insight />, label: 'Insights',  path: '/insights' },
    { icon: <Icons.Settings />,label: 'Settings',  path: '/settings' },
  ];

  const sidebarContent = (
    <>
      <div style={{ padding: '18px 14px 14px', borderBottom: '1px solid var(--border)' }}>
        <div onClick={() => navigate('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, cursor: 'pointer' }}>
          <BrandIcon size={26} />
          <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>Campaign Intel</span>
        </div>
        <button onClick={() => { navigate('/dashboard?new=1'); setMobileOpen(false); }} style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 6, padding: '8px 12px', background: 'var(--orange)', color: '#fff',
          border: 'none', borderRadius: 7, fontSize: 13, fontWeight: 500,
          cursor: 'pointer', fontFamily: 'var(--ff-sans)', transition: 'background .15s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--orange-light)'}
        onMouseLeave={e => e.currentTarget.style.background = 'var(--orange)'}>
          <Icons.Plus /> New Campaign
        </button>
      </div>

      <nav style={{ padding: '10px 8px', flex: 1 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-3)', letterSpacing: '.1em', textTransform: 'uppercase', fontFamily: 'var(--ff-mono)', padding: '0 8px', marginBottom: 4 }}>
          Workspace
        </div>
        {navItems.map(item => {
          const active = loc.pathname === item.path;
          return (
            <button key={item.path} onClick={() => navigate(item.path)} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '7px 8px',
              borderRadius: 7, color: active ? 'var(--text)' : 'var(--text-2)',
              fontSize: 13, fontWeight: active ? 500 : 400, cursor: 'pointer',
              border: 'none', background: active ? 'var(--bg-2)' : 'transparent',
              width: '100%', textAlign: 'left', fontFamily: 'var(--ff-sans)',
              transition: 'all .15s', marginBottom: 2,
            }}
            onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.color = 'var(--text)'; }}}
            onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-2)'; }}}>
              {item.icon}<span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div style={{ padding: '10px 8px', borderTop: '1px solid var(--border)' }}>
        <div onClick={() => setShowLogout(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, borderRadius: 7, cursor: 'pointer', transition: 'background .15s' }}
          onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'var(--bg)'}
          onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#1D4ED8,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: '#fff', flexShrink: 0 }}>
            {userInitials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {userName || 'My Account'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--ff-mono)' }}>{userPlan} plan</div>
          </div>
          <Icons.Dots />
        </div>
      </div>
    </>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      {!isMobile && (
        <aside style={{ width: 220, flexShrink: 0, background: 'var(--white)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50 }}>
          {sidebarContent}
        </aside>
      )}

      {isMobile && mobileOpen && (
        <div onClick={() => setMobileOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 60, backdropFilter: 'blur(2px)' }} />
      )}

      {isMobile && (
        <aside style={{ width: 260, background: 'var(--white)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 70, transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform .25s cubic-bezier(.22,1,.36,1)', boxShadow: mobileOpen ? '4px 0 24px rgba(0,0,0,0.12)' : 'none' }}>
          {sidebarContent}
        </aside>
      )}

      <main style={{ marginLeft: isMobile ? 0 : 220, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', minWidth: 0 }}>
        <div style={{ height: 56, background: 'rgba(247,246,242,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: isMobile ? '0 16px' : '0 24px', gap: 12, position: 'sticky', top: 0, zIndex: 40 }}>
          {isMobile && (
            <button onClick={() => setMobileOpen(v => !v)} style={{ background: 'none', border: '1px solid var(--border-dark)', borderRadius: 6, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-2)', flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          )}
          <h1 style={{ fontFamily: 'var(--ff-serif)', fontSize: isMobile ? 16 : 18, fontWeight: 400, color: 'var(--text)', flex: isMobile ? 1 : 'none', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {title}
          </h1>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {topbarRight}
          </div>
        </div>

        <div style={{ padding: isMobile ? 16 : 28, flex: 1, minWidth: 0 }}>
          {children}
        </div>
      </main>

      {showLogout && (
        <LogoutModal onConfirm={handleLogout} onCancel={() => setShowLogout(false)} />
      )}
    </div>
  );
}