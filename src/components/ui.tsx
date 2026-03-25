import React from 'react';

// ── Brand Icon ────────────────────────────────────────────────────────────────
export function BrandIcon({ size = 28 }: { size?: number }) {
  return (
    <div style={{
      width: size, height: size,
      background: 'var(--orange)', borderRadius: 6,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <svg width={size * 0.54} height={size * 0.54} viewBox="0 0 24 24"
        fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    </div>
  );
}

// ── Status Pill ───────────────────────────────────────────────────────────────
const statusMap: Record<string, { label: string; cls: string }> = {
  active:   { label: 'Active',    cls: 'active' },
  crawling: { label: 'Crawling',  cls: 'crawling' },
  paused:   { label: 'Paused',    cls: 'paused' },
  done:     { label: 'Done',      cls: 'done' },
  pending:  { label: 'Pending',   cls: 'pending' },
  failed:   { label: 'Failed',    cls: 'failed' },
  skipped:  { label: 'Skipped',   cls: 'skipped' },
};

export function StatusPill({ status }: { status: string }) {
  const s = statusMap[status] ?? { label: status, cls: 'active' };
  const colors: Record<string, React.CSSProperties> = {
    active:   { color: 'var(--green)',  background: 'var(--green-bg)',  border: '1px solid var(--green-border)' },
    crawling: { color: 'var(--orange)', background: 'var(--orange-bg)', border: '1px solid var(--orange-border)' },
    paused:   { color: 'var(--text-3)', background: 'var(--bg-2)',      border: '1px solid var(--border)' },
    done:     { color: 'var(--blue)',   background: 'var(--blue-bg)',   border: '1px solid var(--blue-border)' },
    pending:  { color: 'var(--text-3)', background: 'var(--bg-2)',      border: '1px solid var(--border)' },
    failed:   { color: 'var(--red)',    background: 'var(--red-bg)',    border: '1px solid var(--red-border)' },
    skipped:  { color: 'var(--text-3)', background: 'var(--bg-2)',      border: '1px solid var(--border)' },
  };
  const dotAnim = ['active', 'crawling'].includes(s.cls)
    ? { animation: `pulse ${s.cls === 'crawling' ? '1s' : '2s'} ease-in-out infinite` }
    : {};
  const dotColor: Record<string, string> = {
    active: 'var(--green)', crawling: 'var(--orange)', paused: 'var(--text-3)',
    done: 'var(--blue)', pending: 'var(--text-3)', failed: 'var(--red)', skipped: 'var(--text-3)',
  };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 100,
      fontSize: 11, fontWeight: 500, fontFamily: 'var(--ff-mono)',
      flexShrink: 0, whiteSpace: 'nowrap',
      ...colors[s.cls],
    }}>
      <span style={{
        width: 5, height: 5, borderRadius: '50%',
        background: dotColor[s.cls] ?? 'var(--text-3)',
        flexShrink: 0, ...dotAnim,
      }} />
      {s.label}
    </span>
  );
}

// ── Spinner ───────────────────────────────────────────────────────────────────
export function Spinner({ size = 16, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <span style={{
      width: size, height: size,
      border: `2px solid ${color}33`,
      borderTopColor: color,
      borderRadius: '50%',
      display: 'inline-block',
      animation: 'spin .7s linear infinite',
      flexShrink: 0,
    }} />
  );
}

// ── Button ────────────────────────────────────────────────────────────────────
interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export function Btn({ variant = 'primary', size = 'md', loading, children, style, disabled, ...rest }: BtnProps) {
  const base: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: 6, border: 'none', borderRadius: 7, fontFamily: 'var(--ff-sans)',
    fontWeight: 500, cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.7 : 1, transition: 'all .15s',
    whiteSpace: 'nowrap',
  };
  const sizes: Record<string, React.CSSProperties> = {
    sm: { fontSize: 12, padding: '6px 12px' },
    md: { fontSize: 14, padding: '9px 18px' },
    lg: { fontSize: 15, padding: '11px 28px' },
  };
  const variants: Record<string, React.CSSProperties> = {
    primary: { background: 'var(--orange)', color: '#fff', border: 'none' },
    outline: { background: 'var(--white)', color: 'var(--text)', border: '1px solid var(--border-dark)' },
    ghost:   { background: 'transparent', color: 'var(--text-2)', border: 'none' },
    danger:  { background: 'var(--red)', color: '#fff', border: 'none' },
  };
  return (
    <button style={{ ...base, ...sizes[size], ...variants[variant], ...style }} disabled={disabled || loading} {...rest}>
      {loading ? <Spinner size={14} color={variant === 'primary' || variant === 'danger' ? '#fff' : 'var(--text-2)'} /> : children}
    </button>
  );
}

// ── Input ─────────────────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}
export function Input({ label, error, hint, style, ...rest }: InputProps) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{label}</label>
          {hint && <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{hint}</span>}
        </div>
      )}
      <input style={{
        width: '100%', padding: '10px 13px',
        border: `1px solid ${error ? 'var(--red)' : 'var(--border-dark)'}`,
        borderRadius: 8, background: 'var(--white)', color: 'var(--text)',
        fontSize: 14, fontWeight: 300, outline: 'none',
        transition: 'border-color .15s, box-shadow .15s',
        boxShadow: error ? '0 0 0 3px rgba(220,38,38,0.08)' : 'none',
        ...style,
      }}
      onFocus={e => { e.currentTarget.style.borderColor = error ? 'var(--red)' : 'var(--orange)'; e.currentTarget.style.boxShadow = `0 0 0 3px ${error ? 'rgba(220,38,38,0.08)' : 'rgba(229,81,10,0.1)'}`; }}
      onBlur={e => { e.currentTarget.style.borderColor = error ? 'var(--red)' : 'var(--border-dark)'; e.currentTarget.style.boxShadow = error ? '0 0 0 3px rgba(220,38,38,0.08)' : 'none'; }}
      {...rest} />
      {error && <p style={{ fontSize: 12, color: 'var(--red)', marginTop: 4 }}>{error}</p>}
    </div>
  );
}

// ── Textarea ──────────────────────────────────────────────────────────────────
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}
export function Textarea({ label, hint, error, style, ...rest }: TextareaProps) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{label}</label>
          {hint && <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{hint}</span>}
        </div>
      )}
      <textarea style={{
        width: '100%', padding: '10px 13px', minHeight: 90,
        border: `1px solid ${error ? 'var(--red)' : 'var(--border-dark)'}`,
        borderRadius: 8, background: 'var(--white)', color: 'var(--text)',
        fontSize: 14, fontWeight: 300, outline: 'none', resize: 'vertical', lineHeight: 1.55,
        transition: 'border-color .15s, box-shadow .15s',
        ...style,
      }}
      onFocus={e => { e.currentTarget.style.borderColor = 'var(--orange)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(229,81,10,0.1)'; }}
      onBlur={e => { e.currentTarget.style.borderColor = 'var(--border-dark)'; e.currentTarget.style.boxShadow = 'none'; }}
      {...rest} />
      {error && <p style={{ fontSize: 12, color: 'var(--red)', marginTop: 4 }}>{error}</p>}
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
export function Card({ children, style, onClick }: { children: React.ReactNode; style?: React.CSSProperties; onClick?: () => void }) {
  return (
    <div onClick={onClick} style={{
      background: 'var(--white)', border: '1px solid var(--border)',
      borderRadius: 12, padding: '20px 22px',
      transition: 'border-color .2s, transform .15s, box-shadow .15s',
      cursor: onClick ? 'pointer' : 'default',
      ...style,
    }}
    onMouseEnter={onClick ? e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-dark)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.05)'; } : undefined}
    onMouseLeave={onClick ? e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = ''; } : undefined}
    >
      {children}
    </div>
  );
}

// ── Icon button ───────────────────────────────────────────────────────────────
export function IconBtn({ children, title, danger, onClick }: { children: React.ReactNode; title?: string; danger?: boolean; onClick?: (e: React.MouseEvent) => void }) {
  return (
    <button title={title} onClick={onClick} style={{
      width: 28, height: 28, border: '1px solid var(--border)',
      borderRadius: 6, background: 'var(--white)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', color: 'var(--text-3)', flexShrink: 0, transition: 'all .15s',
    }}
    onMouseEnter={e => { const el = e.currentTarget; el.style.background = danger ? 'var(--red-bg)' : 'var(--bg)'; el.style.borderColor = danger ? 'var(--red-border)' : 'var(--border-dark)'; el.style.color = danger ? 'var(--red)' : 'var(--text-2)'; }}
    onMouseLeave={e => { const el = e.currentTarget; el.style.background = 'var(--white)'; el.style.borderColor = 'var(--border)'; el.style.color = 'var(--text-3)'; }}
    >
      {children}
    </button>
  );
}

// ── Progress bar ──────────────────────────────────────────────────────────────
export function ProgressBar({ value, label }: { value: number; label?: string }) {
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--ff-mono)', marginBottom: 5 }}>
        <span>{label ?? 'Progress'}</span><span>{value}%</span>
      </div>
      <div style={{ height: 3, background: 'var(--bg-2)', borderRadius: 100, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${value}%`, background: 'var(--orange)', borderRadius: 100, transition: 'width .5s ease' }} />
      </div>
    </div>
  );
}

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const iconProps = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

export const Icons = {
  Globe: () => <svg width="15" height="15" viewBox="0 0 24 24" {...iconProps}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Plus: () => <svg width="14" height="14" viewBox="0 0 24 24" {...iconProps}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Search: () => <svg width="13" height="13" viewBox="0 0 24 24" {...iconProps}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  Grid: () => <svg width="15" height="15" viewBox="0 0 24 24" {...iconProps}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  Insight: () => <svg width="15" height="15" viewBox="0 0 24 24" {...iconProps}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Settings: () => <svg width="15" height="15" viewBox="0 0 24 24" {...iconProps}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  File: () => <svg width="12" height="12" viewBox="0 0 24 24" {...iconProps}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Play: () => <svg width="13" height="13" viewBox="0 0 24 24" {...iconProps}><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  Edit: () => <svg width="13" height="13" viewBox="0 0 24 24" {...iconProps}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Trash: () => <svg width="13" height="13" viewBox="0 0 24 24" {...iconProps}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
  Back: () => <svg width="14" height="14" viewBox="0 0 24 24" {...iconProps}><polyline points="15 18 9 12 15 6"/></svg>,
  Check: () => <svg width="22" height="22" viewBox="0 0 24 24" {...iconProps}><polyline points="20 6 9 17 4 12"/></svg>,
  Bell: () => <svg width="15" height="15" viewBox="0 0 24 24" {...iconProps}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Cal: () => <svg width="12" height="12" viewBox="0 0 24 24" {...iconProps}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Close: () => <svg width="13" height="13" viewBox="0 0 24 24" {...iconProps}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Dots: () => <svg width="14" height="14" viewBox="0 0 24 24" {...iconProps}><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>,
  Link: () => <svg width="12" height="12" viewBox="0 0 24 24" {...iconProps}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  Spark: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="var(--orange)"><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z"/></svg>,
  ArrowR: () => <svg width="11" height="11" viewBox="0 0 24 24" {...iconProps}><polyline points="9 18 15 12 9 6"/></svg>,
};