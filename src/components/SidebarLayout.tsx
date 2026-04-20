import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BrandIcon, Icons } from './ui';
import { api, type User } from '../api';

interface SidebarLayoutProps {
  children: React.ReactNode;
  title: React.ReactNode;
  topbarRight?: React.ReactNode;
}

export default function SidebarLayout({ children, title, topbarRight }: SidebarLayoutProps) {
  const navigate = useNavigate();
  const loc = useLocation();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    api.me()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('auth_token');
        navigate('/auth');
      });
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem('auth_token');
    navigate('/auth');
  }

  const navItems = [
    { icon: <Icons.Grid />, label: 'Campaigns', path: '/dashboard', badge: null },
    { icon: <Icons.Search />, label: 'All Pages',  path: '/pages',    badge: null },
    { icon: <Icons.Insight />,label: 'Insights',   path: '/insights', badge: null },
    { icon: <Icons.Settings />,label: 'Settings',  path: '/settings', badge: null },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative', zIndex: 1 }}>

      {/* SIDEBAR */}
      <aside style={{
        width: 220, flexShrink: 0, background: 'var(--white)',
        borderRight: '1px solid var(--border)', display: 'flex',
        flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
      }}>
        {/* Top */}
        <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid var(--border)' }}>
          <div
            onClick={() => navigate('/dashboard')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, cursor: 'pointer', textDecoration: 'none' }}
          >
            <BrandIcon size={26} />
            <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>Campaign Intel</span>
          </div>
          <button
            onClick={() => navigate('/dashboard?new=1')}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 7, padding: '8px 12px', background: 'var(--orange)', color: '#fff',
              border: 'none', borderRadius: 7, fontSize: 13, fontWeight: 500,
              cursor: 'pointer', fontFamily: 'var(--ff-sans)', transition: 'background .15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--orange-light)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--orange)')}
          >
            <Icons.Plus /> New Campaign
          </button>
        </div>

        {/* Nav */}
        <nav style={{ padding: '12px 8px', flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-3)', letterSpacing: '.1em', textTransform: 'uppercase', fontFamily: 'var(--ff-mono)', padding: '0 8px', marginBottom: 4 }}>
            Workspace
          </div>
          {navItems.map(item => {
            const active = loc.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '7px 8px',
                  borderRadius: 7, color: active ? 'var(--text)' : 'var(--text-2)',
                  fontSize: 13, fontWeight: active ? 500 : 400, cursor: 'pointer',
                  border: 'none', background: active ? 'var(--bg-2)' : 'transparent',
                  width: '100%', textAlign: 'left', fontFamily: 'var(--ff-sans)',
                  transition: 'all .15s', marginBottom: 2,
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.color = 'var(--text)'; }}}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-2)'; }}}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border)' }}>
          <div style={{ position: 'relative' }}>
            <div
              onClick={() => {
                if (confirm('Are you sure you want to log out?')) handleLogout();
              }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, borderRadius: 7, cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'linear-gradient(135deg,#1D4ED8,#7C3AED)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 600, color: '#fff', flexShrink: 0,
              }}>{user ? `${user.first_name[0]}${user.last_name[0]}` : '--'}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user ? `${user.first_name} ${user.last_name}` : 'Loading...'}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--ff-mono)' }}>
                  {user ? user.plan : '...'} plan
                </div>
              </div>
              <Icons.Dots />
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ marginLeft: 220, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Topbar */}
        <div style={{
          height: 56, background: 'rgba(247,246,242,0.9)', backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center',
          padding: '0 28px', gap: 16, position: 'sticky', top: 0, zIndex: 40,
        }}>
          <h1 style={{ fontFamily: 'var(--ff-serif)', fontSize: 18, fontWeight: 400, color: 'var(--text)' }}>
            {title}
          </h1>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            {topbarRight}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: 28, flex: 1 }}>
          {children}
        </div>
      </main>
    </div>
  );
}