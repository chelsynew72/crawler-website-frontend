import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrandIcon, Icons } from '../components/ui';

// ── Responsive hook ───────────────────────────────────────────────────────────
function useWidth() {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return w;
}

// ── Shared button ─────────────────────────────────────────────────────────────
function OBtn({ children, onClick, outline, small }: { children: React.ReactNode; onClick?: () => void; outline?: boolean; small?: boolean }) {
  return (
    <button onClick={onClick} style={{
      background: outline ? 'var(--white)' : 'var(--orange)',
      color: outline ? 'var(--text)' : '#fff',
      border: outline ? '1px solid var(--border-dark)' : 'none',
      padding: small ? '9px 18px' : '11px 26px',
      borderRadius: 8, fontSize: small ? 14 : 15,
      fontWeight: outline ? 400 : 500,
      fontFamily: 'var(--ff-sans)', cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', gap: 6,
      transition: 'all .15s', whiteSpace: 'nowrap',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; if (!outline) e.currentTarget.style.background = 'var(--orange-light)'; else e.currentTarget.style.borderColor = 'var(--text-2)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = ''; if (!outline) e.currentTarget.style.background = 'var(--orange)'; else e.currentTarget.style.borderColor = 'var(--border-dark)'; }}>
      {children}
    </button>
  );
}

const Chev = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>;

const FEATURES = [
  { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>, name: 'Deep Crawling', desc: 'Traverse complex site architectures automatically, reaching hidden pages and dynamically loaded content. Never leaves your target domain.' },
  { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, name: 'AI Analysis', desc: 'Semantic understanding of every page reached. Extract intent, tone, and data points tailored to your goals — not generic summaries.' },
  { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>, name: 'Structured Output', desc: 'Export high-quality insights in clean formats — JSON, CSV, or detailed reports. Every finding traced to its exact source URL.' },
];

const STEPS = [
  { n: '01', title: 'Create a Campaign', desc: 'Define your goal in plain language. Choose your output format and crawl schedule.' },
  { n: '02', title: 'Add Websites',      desc: 'Paste any number of target URLs. Add more to the same campaign at any time.' },
  { n: '03', title: 'Auto Deep-Crawl',   desc: 'A scheduled job crawls every page within each website — as deep as it can go.' },
  { n: '04', title: 'Get Insights',      desc: 'AI returns raw data plus a full summary — every point traced back to its source.' },
];

const FORMATS = [
  { tag: 'PDF / DOCX', name: 'Report',          desc: 'Structured document with executive summary, findings by theme, and full source list.' },
  { tag: 'JSON',       name: 'Structured Data', desc: 'Machine-readable. Full raw data plus AI findings. Pipe directly into your stack.' },
  { tag: 'CSV',        name: 'Spreadsheet',     desc: 'One row per finding or page crawled. Source URL as a column. Ready for Sheets.' },
  { tag: 'IN-APP',     name: 'Dashboard',       desc: 'Visual view inside the product. Browse findings, filter by source, read AI summary.' },
];

const MOCK_ROWS = [
  { tag: 'done',     url: 'https://competitor.com/pricing',              extra: '843 words' },
  { tag: 'done',     url: 'https://competitor.com/features/enterprise',  extra: '1,204 words' },
  { tag: 'crawling', url: 'https://competitor.com/solutions/growth',     extra: 'depth 2' },
  { tag: 'skipped',  url: 'https://competitor.com/assets/hero.png',      extra: 'non-html' },
];

const TAG_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  done:     { color: '#166534', bg: '#F0FDF4', border: '#BBF7D0' },
  crawling: { color: 'var(--orange)', bg: '#FFF7ED', border: '#FED7AA' },
  skipped:  { color: 'var(--text-3)', bg: 'var(--bg-2)', border: 'var(--border)' },
};

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Landing() {
  const navigate = useNavigate();
  const w = useWidth();
  const isMobile = w < 640;
  const isTablet = w < 900;
  const [menuOpen, setMenuOpen] = useState(false);

  const rule = <div style={{ height: 1, background: 'var(--border)', position: 'relative', zIndex: 1 }} />;

  const sectionNum = (n: string, label: string) => (
    <div style={{ fontFamily: 'var(--ff-mono)', fontSize: 11, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
      <span style={{ color: 'var(--orange)' }}>{n}</span> / 04 · {label}
      <div style={{ flex: '0 0 24px', height: 1, background: 'var(--border-dark)' }} />
    </div>
  );

  const sectionTitle = (line1: string, line2italic: string) => (
    <h2 style={{ fontFamily: 'var(--ff-serif)', fontSize: isMobile ? 32 : isTablet ? 42 : 54, fontWeight: 400, lineHeight: 1.1, letterSpacing: '-.02em', color: 'var(--text)', marginBottom: isMobile ? 32 : 48 }}>
      {line1}<br /><em style={{ fontStyle: 'italic', color: 'var(--orange)' }}>{line2italic}</em>
    </h2>
  );

  return (
    <div style={{ position: 'relative', overflowX: 'hidden' }}>

      {/* ── BANNER ── */}
      <div style={{ background: 'var(--orange)', color: '#fff', textAlign: 'center', padding: '10px 16px', fontSize: isMobile ? 12 : 13.5, lineHeight: 1.5 }}>
        Campaign Intelligence now supports scheduled auto-crawl with AI analysis.{' '}
        <button onClick={() => navigate('/auth?tab=signup')} style={{ background: 'none', border: 'none', color: '#fff', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer', fontSize: 'inherit', fontFamily: 'var(--ff-sans)' }}>
          Try it now →
        </button>
      </div>

      {/* ── NAV ── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(247,246,242,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border)', height: 60, display: 'flex', alignItems: 'center', padding: isMobile ? '0 16px' : '0 32px', gap: 0 }}>
        {/* Brand */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'var(--text)', fontWeight: 600, fontSize: 14, flexShrink: 0, marginRight: isTablet ? 0 : 28 }}>
          <BrandIcon size={26} /> {!isMobile && 'Campaign Intelligence'}
        </a>

        {/* Desktop nav links */}
        {!isTablet && (
          <>
            <div style={{ width: 1, height: 20, background: 'var(--border-dark)', marginRight: 28, flexShrink: 0 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
              {['Products', 'Docs', 'Pricing', 'Blog'].map(l => (
                <button key={l} style={{ fontSize: 14, color: 'var(--text-2)', background: 'none', border: 'none', padding: '6px 10px', borderRadius: 6, cursor: 'pointer', fontFamily: 'var(--ff-sans)', display: 'inline-flex', alignItems: 'center', gap: 3 }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'var(--bg-2)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-2)'; e.currentTarget.style.background = 'transparent'; }}>
                  {l}{l === 'Products' ? <Chev /> : null}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Right side */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          {!isMobile && (
            <button onClick={() => navigate('/auth')} style={{ fontSize: 14, color: 'var(--text-2)', background: 'none', border: 'none', padding: '7px 12px', borderRadius: 6, cursor: 'pointer', fontFamily: 'var(--ff-sans)' }}>
              Log in
            </button>
          )}
          <OBtn onClick={() => navigate('/auth?tab=signup')} small>Sign up</OBtn>

          {/* Mobile hamburger */}
          {isTablet && (
            <button onClick={() => setMenuOpen(v => !v)} style={{ background: 'none', border: '1px solid var(--border-dark)', borderRadius: 6, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-2)', marginLeft: 4 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          )}
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      {isTablet && menuOpen && (
        <div style={{ position: 'fixed', top: 60, left: 0, right: 0, background: 'var(--white)', borderBottom: '1px solid var(--border)', zIndex: 99, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {['Products', 'Docs', 'Pricing', 'Blog', 'Log in'].map(l => (
            <button key={l} onClick={() => { setMenuOpen(false); if (l === 'Log in') navigate('/auth'); }}
              style={{ fontSize: 14, color: 'var(--text-2)', background: 'none', border: 'none', padding: '10px 12px', borderRadius: 6, cursor: 'pointer', fontFamily: 'var(--ff-sans)', textAlign: 'left', width: '100%' }}>
              {l}
            </button>
          ))}
        </div>
      )}

      {/* ── HERO ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: isMobile ? '48px 0 0' : '80px 0 0', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden' }}>
        {/* Corner labels — hide on mobile */}
        {!isTablet && <span style={{ position: 'absolute', top: 32, left: 40, fontFamily: 'var(--ff-mono)', fontSize: 11, color: 'var(--text-3)' }}>[ 200 OK ]</span>}
        {!isTablet && <span style={{ position: 'absolute', top: 32, right: 40, fontFamily: 'var(--ff-mono)', fontSize: 11, color: 'var(--text-3)' }}>[ SCRAPE ]</span>}
        {!isMobile && <span style={{ position: 'absolute', top: 200, left: '12%', color: 'var(--orange)' }}><Icons.Spark /></span>}
        {!isMobile && <span style={{ position: 'absolute', top: 200, right: '12%', color: 'var(--orange)' }}><Icons.Spark /></span>}

        {/* Pill */}
        <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--white)', border: '1px solid var(--border-dark)', borderRadius: 100, padding: '5px 14px 5px 5px', fontSize: 13, color: 'var(--text)', marginBottom: 28, textDecoration: 'none' }}>
          <span style={{ background: 'var(--text)', color: 'var(--bg)', fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 100 }}>2 Months Free</span>
          Annually
          <span style={{ width: 20, height: 20, background: 'var(--text)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icons.ArrowR />
          </span>
        </a>

        {/* Headline */}
        <h1 style={{ fontFamily: 'var(--ff-serif)', fontSize: isMobile ? 'clamp(38px,11vw,52px)' : 'clamp(52px,8vw,88px)', fontWeight: 400, lineHeight: 1.0, letterSpacing: '-.02em', color: 'var(--text)', maxWidth: isMobile ? '90%' : 820, margin: '0 auto 20px', padding: '0 16px' }}>
          Turn websites into<br /><em style={{ fontStyle: 'italic', color: 'var(--orange)' }}>campaign-ready</em> data
        </h1>

        {/* Sub */}
        <p style={{ fontSize: isMobile ? 15 : 17, fontWeight: 300, color: 'var(--text-2)', maxWidth: 400, margin: '0 auto 32px', lineHeight: 1.65, padding: '0 24px' }}>
          Power your campaigns with deep web intelligence from any website.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: isMobile ? 48 : 72, flexWrap: 'wrap', padding: '0 16px' }}>
          <OBtn onClick={() => navigate('/auth')}>Start Crawling →</OBtn>
          <OBtn outline onClick={() => navigate('/auth')}>View Demo</OBtn>
        </div>

        {/* Window mock */}
        <div style={{ width: '100%', maxWidth: 900, margin: '0 auto', padding: isMobile ? '0 16px' : '0 40px' }}>
          <div style={{ background: 'var(--white)', border: '1px solid var(--border-dark)', borderBottom: 'none', borderRadius: '12px 12px 0 0', overflow: 'hidden', boxShadow: '0 2px 32px rgba(0,0,0,0.06)' }}>
            {/* Window bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '11px 14px', borderBottom: '1px solid var(--border)', background: 'var(--bg-2)' }}>
              {['#FF5F57','#FFBD2E','#28CA41'].map((c, i) => <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
              {!isMobile && <div style={{ flex: 1, background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 5, padding: '4px 10px', fontFamily: 'var(--ff-mono)', fontSize: 11, color: 'var(--text-3)', margin: '0 10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                campaign-intelligence.workers.dev/campaigns/pricing-research/pages
              </div>}
            </div>
            {/* Window body */}
            <div style={{ padding: isMobile ? 14 : 20 }}>
              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: isMobile ? 8 : 10, marginBottom: 12 }}>
                {[{ label: 'Pages Crawled', val: '1,284', orange: true }, { label: 'AI Insights', val: '47' }, { label: 'Websites', val: '3' }].map(s => (
                  <div key={s.label} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: isMobile ? 10 : 14 }}>
                    <div style={{ fontSize: isMobile ? 9 : 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.06em', fontFamily: 'var(--ff-mono)', marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 600, fontFamily: 'var(--ff-mono)', color: s.orange ? 'var(--orange)' : 'var(--text)' }}>{s.val}</div>
                  </div>
                ))}
              </div>
              {/* Progress */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--text-3)', marginBottom: 5 }}><span>Crawl Progress</span><span>78%</span></div>
              <div style={{ height: 4, background: 'var(--bg-2)', borderRadius: 100, marginBottom: 12, overflow: 'hidden' }}><div style={{ height: '100%', width: '78%', background: 'var(--orange)', borderRadius: 100 }} /></div>
              {/* Rows — show fewer on mobile */}
              {MOCK_ROWS.slice(0, isMobile ? 3 : 4).map((r, i) => {
                const tc = TAG_COLORS[r.tag];
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 9px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, marginBottom: 5, fontSize: 11, fontFamily: 'var(--ff-mono)' }}>
                    <span style={{ padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 500, border: `1px solid ${tc.border}`, color: tc.color, background: tc.bg, flexShrink: 0 }}>{r.tag}</span>
                    <span style={{ flex: 1, color: 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.url}</span>
                    {!isMobile && <span style={{ color: 'var(--text-3)', flexShrink: 0 }}>{r.extra}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {rule}

      {/* ── FEATURES ── */}
      <section style={{ padding: isMobile ? '56px 0' : '80px 0', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '0 16px' : '0 40px' }}>
          {sectionNum('01', 'CAPABILITIES')}
          {sectionTitle('Unmatched intelligence', 'for every campaign goal')}
          <p style={{ fontSize: isMobile ? 14 : 16, color: 'var(--text-2)', fontWeight: 300, maxWidth: 480, lineHeight: 1.65, marginBottom: isMobile ? 24 : 40 }}>
            Built for growth teams who need real web data, not surface-level snapshots.
          </p>
          {/* Cards — stacked on mobile, grid on desktop */}
          <div style={{ display: 'grid', gridTemplateColumns: isTablet ? '1fr' : 'repeat(3,1fr)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'var(--white)' }}>
            {FEATURES.map((f, i) => (
              <div key={f.name} style={{ padding: isMobile ? '24px 20px' : '32px 28px', borderRight: (!isTablet && i < 2) ? '1px solid var(--border)' : 'none', borderBottom: (isTablet && i < 2) ? '1px solid var(--border)' : 'none', transition: 'background .2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--white)')}>
                <div style={{ width: 38, height: 38, border: '1px solid var(--border-dark)', borderRadius: 8, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>{f.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>{f.name}</div>
                <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.65, fontWeight: 300, marginBottom: 16 }}>{f.desc}</p>
                <a href="#" style={{ fontSize: 13, color: 'var(--text-2)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>Learn more →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {rule}

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: isMobile ? '56px 0' : '80px 0', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '0 16px' : '0 40px' }}>
          {sectionNum('02', 'HOW IT WORKS')}
          {sectionTitle('From goal to insight', 'in four steps')}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(4,1fr)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'var(--white)' }}>
            {STEPS.map((s, i) => (
              <div key={s.n} style={{
                padding: isMobile ? '20px 16px' : '28px 24px',
                borderRight: isMobile ? (i % 2 === 0 ? '1px solid var(--border)' : 'none') : (!isTablet && i < 3 ? '1px solid var(--border)' : (isTablet && i % 2 === 0 ? '1px solid var(--border)' : 'none')),
                borderBottom: isMobile ? (i < 2 ? '1px solid var(--border)' : 'none') : (isTablet && i < 2 ? '1px solid var(--border)' : 'none'),
              }}>
                <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 11, color: 'var(--orange)', display: 'block', marginBottom: 14 }}>[ {s.n} ]</span>
                <div style={{ fontSize: isMobile ? 13 : 14, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>{s.title}</div>
                <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6, fontWeight: 300 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {rule}

      {/* ── OUTPUT FORMATS ── */}
      <section style={{ padding: isMobile ? '56px 0' : '80px 0', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '0 16px' : '0 40px' }}>
          {sectionNum('03', 'OUTPUT')}
          {sectionTitle('Data delivered', 'how you need it')}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 10 }}>
            {FORMATS.map(f => (
              <div key={f.tag} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 10, padding: isMobile ? '18px 16px' : '24px 24px', display: 'flex', alignItems: 'flex-start', gap: 14, transition: 'border-color .2s, transform .2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-dark)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = ''; }}>
                <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 10, fontWeight: 500, padding: '4px 8px', borderRadius: 4, border: '1px solid var(--border-dark)', color: 'var(--text-2)', background: 'var(--bg)', flexShrink: 0, marginTop: 2, whiteSpace: 'nowrap' }}>{f.tag}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{f.name}</div>
                  <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.55, fontWeight: 300 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {rule}

      {/* ── CTA ── */}
      <section style={{ padding: isMobile ? '56px 0 72px' : '80px 0 100px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '0 16px' : '0 40px' }}>
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, padding: isMobile ? '48px 24px' : '72px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />
            <h2 style={{ fontFamily: 'var(--ff-serif)', fontSize: isMobile ? 32 : 'clamp(32px,5vw,52px)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-.02em', color: 'var(--text)', marginBottom: 14, position: 'relative', zIndex: 1 }}>
              Ready to gain<br /><em style={{ fontStyle: 'italic', color: 'var(--orange)' }}>deeper insights?</em>
            </h2>
            <p style={{ fontSize: isMobile ? 14 : 16, color: 'var(--text-2)', fontWeight: 300, marginBottom: 32, position: 'relative', zIndex: 1 }}>
              Join the next generation of campaign intelligence.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12, position: 'relative', zIndex: 1, flexWrap: 'wrap' }}>
              <OBtn onClick={() => navigate('/auth?tab=signup')}>Get Started for Free</OBtn>
              <OBtn outline onClick={() => navigate('/auth')}>Book a Demo</OBtn>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-3)', position: 'relative', zIndex: 1 }}>No credit card required · 14-day free trial</p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: isMobile ? '24px 16px' : '28px 40px', position: 'relative', zIndex: 1, background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, flexDirection: isMobile ? 'column' : 'row' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <BrandIcon size={22} />
            <span style={{ fontSize: 13, color: 'var(--text-2)' }}>Campaign Intelligence</span>
          </a>
          <div style={{ display: 'flex', gap: isMobile ? 16 : 20, flexWrap: 'wrap' }}>
            {['Privacy Policy', 'Terms of Service', 'API Reference'].map(l => (
              <a key={l} href="#" style={{ fontSize: 13, color: 'var(--text-3)', textDecoration: 'none' }}>{l}</a>
            ))}
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-3)' }}>© 2026 Campaign Intelligence. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}