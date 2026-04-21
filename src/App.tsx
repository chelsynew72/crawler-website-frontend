import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import Landing   from './pages/Landing';
import Auth      from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Campaign  from './pages/Campaign';
import SidebarLayout from './components/SidebarLayout';

function ComingSoon({ title }: { title: string }) {
  return (
    <SidebarLayout title={<>{title}</>}>
      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 12, padding: '60px 40px', textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, background: 'var(--bg)', border: '1px solid var(--border-dark)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <div style={{ fontFamily: 'var(--ff-serif)', fontSize: 22, fontWeight: 400, color: 'var(--text)', marginBottom: 8 }}>
          {title} — <em style={{ fontStyle: 'italic', color: 'var(--orange)' }}>coming soon</em>
        </div>
        <p style={{ fontSize: 14, color: 'var(--text-2)', fontWeight: 300 }}>
          This section is under construction. Check back soon.
        </p>
      </div>
    </SidebarLayout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="grid-bg" />
      <Routes>
        <Route path="/"              element={<Landing />} />
        <Route path="/auth"          element={<Auth />} />
        <Route path="/dashboard"     element={<Dashboard />} />
        <Route path="/campaign/:id"  element={<Campaign />} />
        <Route path="/pages"         element={<ComingSoon title="All Pages" />} />
        <Route path="/insights"      element={<ComingSoon title="Insights" />} />
        <Route path="/settings"      element={<ComingSoon title="Settings" />} />
        <Route path="*"              element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
