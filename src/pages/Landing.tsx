import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BrandIcon, Icons } from '../components/ui';

function NavLink({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} style={{ fontSize: 14, color: 'var(--text-2)', background: 'none', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontFamily: 'var(--ff-sans)', display: 'inline-flex', alignItems: 'center', gap: 3, transition: 'color .15s, background .15s' }}
      onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'var(--bg-2)'; }}
      onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-2)'; e.currentTarget.style.background = 'transparent'; }}>
      {children}
    </button>
  );
}

function OrangeBtn({ children, onClick, outline }: { children: React.ReactNode; onClick?: () => void; outline?: boolean }) {
  return (
    <button onClick={onClick} style={{
      background: outline ? 'var(--white)' : 'var(--orange)',
      color: outline ? 'var(--text)' : '#fff',
      border: outline ? '1px solid var(--border-dark)' : 'none',
      padding: '11px 28px', borderRadius: 8,
      fontSize: 15, fontWeight: outline ? 400 : 500,
      fontFamily: 'var(--ff-sans)', cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', gap: 6,
      transition: 'all .15s',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; if (!outline) e.currentTarget.style.background = 'var(--orange-light)'; else e.currentTarget.style.borderColor = 'var(--text-2)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = ''; if (!outline) e.currentTarget.style.background = 'var(--orange)'; else e.currentTarget.style.borderColor = 'var(--border-dark)'; }}>
      {children}
    </button>
  );
}

const ChevronDown = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>;

const features = [
  {
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
    name: 'Deep Crawling',
    desc: 'Traverse complex site architectures automatically, reaching hidden pages and dynamically loaded content. Never leaves your target domain.',
  },
  {
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    name: 'AI Analysis',
    desc: 'Semantic understanding of every page reached. Extract intent, tone, and specific data points tailored to your goals — not generic summaries.',
  },
  {
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
    name: 'Structured Output',
    desc: 'Export high-quality insights in clean, structured formats — JSON, CSV, or detailed reports. Every finding traced to its exact source URL.',
  },
];

const steps = [
  { n: '01', title: 'Create a Campaign', desc: 'Define your goal in plain language. Choose your output format and crawl schedule.' },
  { n: '02', title: 'Add Websites',      desc: 'Paste any number of target URLs. Add more to the same campaign at any time.' },
  { n: '03', title: 'Auto Deep-Crawl',   desc: 'A scheduled job crawls every page within each website — as deep as it can go.' },
  { n: '04', title: 'Get Insights',      desc: 'AI returns raw data plus a full summary — every point traced back to its source.' },
];

const formats = [
  { tag: 'PDF / DOCX', name: 'Report',          desc: 'Structured document with executive summary, findings by theme, and full source list.' },
  { tag: 'JSON',       name: 'Structured Data', desc: 'Machine-readable. Full raw data plus AI findings. Pipe directly into your stack.' },
  { tag: 'CSV',        name: 'Spreadsheet',     desc: 'One row per finding or page crawled. Source URL as a column. Ready for Sheets.' },
  { tag: 'IN-APP',     name: 'Dashboard',       desc: 'Visual view inside the product. Browse findings, filter by source, read AI summary.' },
];

export default function Landing() {
  const navigate = useNavigate();

  const rule = <div style={{ height: 1, background: 'var(--border)', position: 'relative', zIndex: 1 }} />;

  return (
    <div style={{ position: 'relative' }}>
      {/* Banner */}
      <div style={{ background: 'var(--orange)', color: '#fff', textAlign: 'center', padding: '11px 24px', fontSize: 13.5, position: 'relative', zIndex: 10 }}>
        Campaign Intelligence now supports scheduled auto-crawl with AI analysis.{' '}
        <button onClick={() => navigate('/auth?tab=signup')} style={{ background: 'none', border: 'none', color: '#fff', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer', fontSize: 13.5, fontFamily: 'var(--ff-sans)' }}>Try it now →</button>
      </div>

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(247,246,242,0.9)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border)', height: 60, display: 'flex', alignItems: 'center', padding: '0 32px', gap: 0 }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'var(--text)', fontWeight: 600, fontSize: 15, marginRight: 28, flexShrink: 0 }}>
          <BrandIcon size={28} /> Campaign Intelligence
        </a>
        <div style={{ width: 1, height: 20, background: 'var(--border-dark)', marginRight: 28, flexShrink: 0 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
          {['Products', 'Playground', 'Docs', 'Pricing', 'Blog'].map(l => (
            <NavLink key={l}>{l}{['Products'].includes(l) ? <ChevronDown /> : null}</NavLink>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>

          <OrangeBtn onClick={() => navigate('/auth')}>Sign up</OrangeBtn>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 0 0', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ position: 'absolute', top: 32, left: 40, fontFamily: 'var(--ff-mono)', fontSize: 11, color: 'var(--text-3)' }}>[ 200 OK ]</span>
        <span style={{ position: 'absolute', top: 32, right: 40, fontFamily: 'var(--ff-mono)', fontSize: 11, color: 'var(--text-3)' }}>[ SCRAPE ]</span>
        <span style={{ position: 'absolute', top: 200, left: '20%', color: 'var(--orange)' }}><Icons.Spark /></span>
        <span style={{ position: 'absolute', top: 200, right: '20%', color: 'var(--orange)' }}><Icons.Spark /></span>

        <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--white)', border: '1px solid var(--border-dark)', borderRadius: 100, padding: '5px 16px 5px 5px', fontSize: 13, color: 'var(--text)', marginBottom: 32, textDecoration: 'none' }}>
          <span style={{ background: 'var(--text)', color: 'var(--bg)', fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 100 }}>2 Months Free</span>
          Annually
          <span style={{ width: 22, height: 22, background: 'var(--text)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icons.ArrowR />
          </span>
        </a>

        <h1 style={{ fontFamily: 'var(--ff-serif)', fontSize: 'clamp(52px,8vw,92px)', fontWeight: 400, lineHeight: 1.0, letterSpacing: '-.02em', color: 'var(--text)', maxWidth: 820, margin: '0 auto 20px' }}>
          Turn websites into<br /><em style={{ fontStyle: 'italic', color: 'var(--orange)' }}>campaign-ready</em> data
        </h1>
        <p style={{ fontSize: 17, fontWeight: 300, color: 'var(--text-2)', maxWidth: 400, margin: '0 auto 36px', lineHeight: 1.65 }}>
          Power your campaigns with deep web intelligence from any website.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 72 }}>
          <OrangeBtn onClick={() => navigate('/auth')}>Start Crawling →</OrangeBtn>
          <OrangeBtn outline onClick={() => navigate('/auth')}>View Demo</OrangeBtn>
        </div>

        {/* Window mock */}
        <div style={{ width: '100%', maxWidth: 900, margin: '0 auto', padding: '0 40px' }}>
          <div style={{ background: 'var(--white)', border: '1px solid var(--border-dark)', borderBottom: 'none', borderRadius: '12px 12px 0 0', overflow: 'hidden', boxShadow: '0 2px 32px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg-2)' }}>
              {[['#FF5F57'],['#FFBD2E'],['#28CA41']].map(([c], i) => <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
              <div style={{ flex: 1, background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 5, padding: '4px 10px', fontFamily: 'var(--ff-mono)', fontSize: 11, color: 'var(--text-3)', margin: '0 10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                campaign-intelligence.workers.dev/campaigns/pricing-research/pages
              </div>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 14 }}>
                {[{ label: 'Pages Crawled', val: '1,284', orange: true }, { label: 'AI Insights', val: '47' }, { label: 'Websites', val: '3' }].map(s => (
                  <div key={s.label} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: 14 }}>
                    <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.08em', fontFamily: 'var(--ff-mono)', marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 22, fontWeight: 600, fontFamily: 'var(--ff-mono)', color: s.orange ? 'var(--orange)' : 'var(--text)' }}>{s.val}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--text-3)', marginBottom: 5 }}><span>Crawl Progress</span><span>78%</span></div>
              <div style={{ height: 4, background: 'var(--bg-2)', borderRadius: 100, marginBottom: 14, overflow: 'hidden' }}><div style={{ height: '100%', width: '78%', background: 'var(--orange)', borderRadius: 100 }} /></div>
              {[
                { tag: 'done',     url: 'https://competitor.com/pricing',                  extra: '843 words' },
                { tag: 'done',     url: 'https://competitor.com/features/enterprise',      extra: '1,204 words' },
                { tag: 'crawling', url: 'https://competitor.com/solutions/growth-teams',   extra: 'depth 2' },
                { tag: 'skipped',  url: 'https://competitor.com/assets/hero-banner.png',   extra: 'non-html' },
              ].map((r, i) => {
                const tagColors: Record<string, { color: string; bg: string; border: string }> = {
                  done:     { color: '#166534', bg: '#F0FDF4', border: '#BBF7D0' },
                  crawling: { color: 'var(--orange)', bg: '#FFF7ED', border: '#FED7AA' },
                  skipped:  { color: 'var(--text-3)', bg: 'var(--bg-2)', border: 'var(--border)' },
                };
                const tc = tagColors[r.tag];
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, marginBottom: 5, fontSize: 11, fontFamily: 'var(--ff-mono)' }}>
                    <span style={{ padding: '2px 7px', borderRadius: 4, fontSize: 10, fontWeight: 500, border: `1px solid ${tc.border}`, color: tc.color, background: tc.bg, flexShrink: 0 }}>{r.tag}</span>
                    <span style={{ flex: 1, color: 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.url}</span>
                    <span style={{ color: 'var(--text-3)', flexShrink: 0 }}>{r.extra}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {rule}

      {/* Features */}
      <section style={{ padding: '80px 0', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 40px' }}>
          <div style={{ fontFamily: 'var(--ff-mono)', fontSize: 11, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <span style={{ color: 'var(--orange)' }}>01</span> / 04 · CAPABILITIES
            <div style={{ flex: '0 0 24px', height: 1, background: 'var(--border-dark)' }} />
          </div>
          <h2 style={{ fontFamily: 'var(--ff-serif)', fontSize: 'clamp(36px,5vw,58px)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-.02em', color: 'var(--text)', marginBottom: 12 }}>
            Unmatched intelligence<br />for every <em style={{ fontStyle: 'italic', color: 'var(--orange)' }}>campaign goal</em>
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-2)', fontWeight: 300, maxWidth: 480, lineHeight: 1.65, marginBottom: 48 }}>Built for growth teams who need real web data, not surface-level snapshots.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'var(--white)' }}>
            {features.map((f, i) => (
              <div key={f.name} style={{ padding: '36px 32px', borderRight: i < 2 ? '1px solid var(--border)' : 'none', transition: 'background .2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--white)')}>
                <div style={{ width: 40, height: 40, border: '1px solid var(--border-dark)', borderRadius: 8, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>{f.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>{f.name}</div>
                <p style={{ fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.65, fontWeight: 300, marginBottom: 20 }}>{f.desc}</p>
                <a href="#" style={{ fontSize: 13, color: 'var(--text-2)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, transition: 'color .15s, gap .15s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--orange)'; e.currentTarget.style.gap = '8px'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-2)'; e.currentTarget.style.gap = '4px'; }}>
                  Learn more →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {rule}

      {/* How it works */}
      <section style={{ padding: '80px 0', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 40px' }}>
          <div style={{ fontFamily: 'var(--ff-mono)', fontSize: 11, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <span style={{ color: 'var(--orange)' }}>02</span> / 04 · HOW IT WORKS
            <div style={{ flex: '0 0 24px', height: 1, background: 'var(--border-dark)' }} />
          </div>
          <h2 style={{ fontFamily: 'var(--ff-serif)', fontSize: 'clamp(36px,5vw,58px)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-.02em', color: 'var(--text)', marginBottom: 48 }}>
            From goal to insight<br />in <em style={{ fontStyle: 'italic', color: 'var(--orange)' }}>four steps</em>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'var(--white)' }}>
            {steps.map((s, i) => (
              <div key={s.n} style={{ padding: '32px 28px', borderRight: i < 3 ? '1px solid var(--border)' : 'none' }}>
                <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 11, color: 'var(--orange)', display: 'block', marginBottom: 20 }}>[ {s.n} ]</span>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>{s.title}</div>
                <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, fontWeight: 300 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {rule}

      {/* Formats */}
      <section style={{ padding: '80px 0', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 40px' }}>
          <div style={{ fontFamily: 'var(--ff-mono)', fontSize: 11, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <span style={{ color: 'var(--orange)' }}>03</span> / 04 · OUTPUT
            <div style={{ flex: '0 0 24px', height: 1, background: 'var(--border-dark)' }} />
          </div>
          <h2 style={{ fontFamily: 'var(--ff-serif)', fontSize: 'clamp(36px,5vw,58px)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-.02em', color: 'var(--text)', marginBottom: 48 }}>
            Data delivered<br />how <em style={{ fontStyle: 'italic', color: 'var(--orange)' }}>you need it</em>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {formats.map(f => (
              <div key={f.tag} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 10, padding: 28, display: 'flex', alignItems: 'flex-start', gap: 16, transition: 'border-color .2s, transform .2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-dark)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = ''; }}>
                <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 11, fontWeight: 500, padding: '4px 10px', borderRadius: 4, border: '1px solid var(--border-dark)', color: 'var(--text-2)', background: 'var(--bg)', flexShrink: 0, marginTop: 2 }}>{f.tag}</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{f.name}</div>
                  <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.55, fontWeight: 300 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {rule}

      {/* CTA */}
      <section style={{ padding: '80px 0 100px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 40px' }}>
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, padding: '72px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />
            <h2 style={{ fontFamily: 'var(--ff-serif)', fontSize: 'clamp(32px,5vw,56px)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-.02em', color: 'var(--text)', marginBottom: 16, position: 'relative', zIndex: 1 }}>
              Ready to gain<br /><em style={{ fontStyle: 'italic', color: 'var(--orange)' }}>deeper insights?</em>
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text-2)', fontWeight: 300, marginBottom: 36, position: 'relative', zIndex: 1 }}>
              Join the next generation of campaign intelligence.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 14, position: 'relative', zIndex: 1 }}>
              <OrangeBtn onClick={() => navigate('/auth?tab=signup')}>Get Started for Free</OrangeBtn>
              <OrangeBtn outline onClick={() => navigate('/auth')}>Book a Demo</OrangeBtn>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-3)', position: 'relative', zIndex: 1 }}>No credit card required · </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '28px 40px', position: 'relative', zIndex: 1, background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'var(--text)' }}>
            <BrandIcon size={22} />
            <span style={{ fontSize: 13, color: 'var(--text-2)' }}>Campaign Intelligence</span>
          </a>
          <div style={{ display: 'flex', gap: 20 }}>
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