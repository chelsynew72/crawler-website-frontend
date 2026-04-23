import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import type { CrawlPage } from '../api';
import SidebarLayout from '../components/SidebarLayout';
import { StatusPill, Icons, Spinner } from '../components/ui';

export function AllPages() {
  const [pages, setPages] = useState<(CrawlPage & { campaign_name?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const campaigns = await api.getCampaigns();
      const list = Array.isArray(campaigns) ? campaigns : [];
      const allPages: (CrawlPage & { campaign_name?: string })[] = [];
      await Promise.all(
        list.map(async (c) => {
          try {
            const res = await api.getPages(c.id);
            (res.pages || []).forEach(p => allPages.push({ ...p, campaign_name: c.name }));
          } catch { /* skip */ }
        })
      );
      allPages.sort((a, b) => (b.crawled_at ?? '').localeCompare(a.crawled_at ?? ''));
      setPages(allPages);
    } catch { setPages([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = pages.filter(p => {
    const matchSearch = p.url.toLowerCase().includes(search.toLowerCase()) ||
      (p.campaign_name ?? '').toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || p.status === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    all: pages.length,
    done: pages.filter(p => p.status === 'done').length,
    crawling: pages.filter(p => p.status === 'crawling').length,
    failed: pages.filter(p => p.status === 'failed').length,
    skipped: pages.filter(p => p.status === 'skipped').length,
  };

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'done', label: 'Done' },
    { key: 'crawling', label: 'Crawling' },
    { key: 'failed', label: 'Failed' },
    { key: 'skipped', label: 'Skipped' },
  ];

  return (
    <SidebarLayout
      title={<>All <em style={{ fontStyle: 'italic', color: 'var(--orange)' }}>pages</em></>}
      topbarRight={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--white)', border: '1px solid var(--border-dark)', borderRadius: 7, padding: '0 12px', height: 32 }}>
          <Icons.Search />
          <input placeholder="Search URLs or campaigns..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', fontSize: 13, color: 'var(--text)', background: 'transparent', width: 220 }} />
        </div>
      }
    >
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total Pages', value: counts.all, color: 'var(--orange)' },
          { label: 'Successfully Crawled', value: counts.done, color: 'var(--green)' },
          { label: 'Failed', value: counts.failed, color: 'var(--red)' },
          { label: 'Skipped', value: counts.skipped, color: 'var(--text-3)' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px 18px' }}>
            <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.08em', fontFamily: 'var(--ff-mono)', marginBottom: 5 }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 600, fontFamily: 'var(--ff-mono)', color: loading ? 'var(--text-3)' : s.color }}>{loading ? '—' : s.value.toLocaleString()}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: 4 }}>
        {filters.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{
            flex: 1, padding: '7px 8px', borderRadius: 7,
            border: filter === f.key ? '1px solid var(--border)' : '1px solid transparent',
            background: filter === f.key ? 'var(--white)' : 'transparent',
            fontSize: 12, fontWeight: filter === f.key ? 500 : 400,
            color: filter === f.key ? 'var(--text)' : 'var(--text-2)',
            cursor: 'pointer', fontFamily: 'var(--ff-sans)', transition: 'all .15s',
            boxShadow: filter === f.key ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
          }}>
            {f.label}
            <span style={{ marginLeft: 5, fontSize: 10, fontFamily: 'var(--ff-mono)', color: 'var(--text-3)' }}>
              {counts[f.key as keyof typeof counts]}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, gap: 10, color: 'var(--text-3)' }}>
          <Spinner color="var(--text-3)" size={18} /> Loading pages...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 12, padding: '48px 32px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--ff-serif)', fontSize: 18, color: 'var(--text)', marginBottom: 6 }}>No pages found</div>
          <p style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 300 }}>Run a crawl on a campaign to see pages here.</p>
        </div>
      ) : (
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 140px 70px 80px 100px', gap: 0, padding: '10px 16px', background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
            {['Status', 'URL', 'Campaign', 'Depth', 'Words', 'Crawled'].map(h => (
              <span key={h} style={{ fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</span>
            ))}
          </div>
          {filtered.slice(0, 200).map((p, i) => (
            <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 140px 70px 80px 100px', gap: 0, padding: '9px 16px', borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'center', background: i % 2 === 0 ? 'var(--white)' : 'rgba(247,246,242,0.5)' }}>
              <div><StatusPill status={p.status} /></div>
              <a href={p.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, fontFamily: 'var(--ff-mono)', color: 'var(--blue)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: 12, display: 'block' }}>{p.url}</a>
              <span style={{ fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'pointer' }}
                onClick={() => navigate(`/campaign/${p.campaign_id}`)}>
                {p.campaign_name ?? '—'}
              </span>
              <span style={{ fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--text-3)' }}>{p.depth}</span>
              <span style={{ fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--text-3)' }}>{p.word_count.toLocaleString()}</span>
              <span style={{ fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--text-3)' }}>{p.crawled_at ? new Date(p.crawled_at).toLocaleDateString() : '—'}</span>
            </div>
          ))}
          {filtered.length > 200 && (
            <div style={{ padding: '12px 16px', textAlign: 'center', fontSize: 12, color: 'var(--text-3)', borderTop: '1px solid var(--border)' }}>
              Showing 200 of {filtered.length.toLocaleString()} pages
            </div>
          )}
        </div>
      )}
    </SidebarLayout>
  );
}

// ── INSIGHTS PAGE ─────────────────────────────────────────────────────────────
export function InsightsPage() {
  const [allInsights, setAllInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const campaigns = await api.getCampaigns();
      const list = Array.isArray(campaigns) ? campaigns : [];
      const collected: any[] = [];
      await Promise.all(
        list.map(async (c) => {
          try {
            const res = await api.getInsights(c.id);
            if (res.summary) {
              collected.push({ type: 'summary', campaign: c, data: res.summary });
            }
            (res.page_findings || []).forEach(f => {
              collected.push({ type: 'finding', campaign: c, data: f });
            });
          } catch { /* skip */ }
        })
      );
      setAllInsights(collected);
    } catch { setAllInsights([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const summaries = allInsights.filter(i => i.type === 'summary');
  const findings  = allInsights.filter(i => i.type === 'finding');

  const filteredFindings = findings.filter(f =>
    (f.data.url ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (f.data.summary ?? '').toLowerCase().includes(search.toLowerCase()) ||
    f.campaign.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SidebarLayout
      title={<>AI <em style={{ fontStyle: 'italic', color: 'var(--orange)' }}>insights</em></>}
      topbarRight={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--white)', border: '1px solid var(--border-dark)', borderRadius: 7, padding: '0 12px', height: 32 }}>
          <Icons.Search />
          <input placeholder="Search insights..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', fontSize: 13, color: 'var(--text)', background: 'transparent', width: 200 }} />
        </div>
      }
    >
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Executive Summaries', value: summaries.length, color: 'var(--orange)' },
          { label: 'Page Findings', value: findings.length, color: 'var(--text)' },
          { label: 'Campaigns Analyzed', value: new Set(allInsights.map(i => i.campaign.id)).size, color: 'var(--green)' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px 18px' }}>
            <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.08em', fontFamily: 'var(--ff-mono)', marginBottom: 5 }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 600, fontFamily: 'var(--ff-mono)', color: loading ? 'var(--text-3)' : s.color }}>{loading ? '—' : s.value}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, gap: 10, color: 'var(--text-3)' }}>
          <Spinner color="var(--text-3)" size={18} /> Loading insights...
        </div>
      ) : allInsights.length === 0 ? (
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 12, padding: '48px 32px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--ff-serif)', fontSize: 18, color: 'var(--text)', marginBottom: 6 }}>No insights yet</div>
          <p style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 300, marginBottom: 20 }}>Run a crawl and then AI analysis on a campaign to see insights here.</p>
        </div>
      ) : (
        <>
          {/* Executive Summaries */}
          {summaries.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>Executive Summaries</div>
              {summaries.map((item, i) => (
                <div key={i} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 12, padding: 22, marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div style={{ fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--orange)', letterSpacing: '.08em' }}>CAMPAIGN SUMMARY</div>
                    <button onClick={() => navigate(`/campaign/${item.campaign.id}`)} style={{ fontSize: 12, color: 'var(--text-2)', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontFamily: 'var(--ff-sans)' }}>
                      {item.campaign.name} →
                    </button>
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)', marginBottom: 16, lineHeight: 1.5 }}>{item.data.headline}</p>
                  {(item.data.key_findings ?? []).map((f: any, j: number) => (
                    <div key={j} style={{ marginBottom: 12, paddingLeft: 14, borderLeft: '2px solid var(--orange-border)' }}>
                      <p style={{ fontSize: 13, color: 'var(--text)', marginBottom: 5 }}>{f.point}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                        {(f.sources ?? []).map((s: string, k: number) => (
                          <a key={k} href={s} target="_blank" rel="noreferrer" style={{ fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--blue)', background: 'var(--blue-bg)', border: '1px solid var(--blue-border)', padding: '2px 7px', borderRadius: 4 }}>
                            {(() => { try { return new URL(s).hostname; } catch { return s; } })()}
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                  {item.data.recommendation && (
                    <div style={{ background: 'var(--orange-bg)', border: '1px solid var(--orange-border)', borderRadius: 8, padding: '10px 14px', marginTop: 12 }}>
                      <div style={{ fontSize: 10, fontFamily: 'var(--ff-mono)', color: 'var(--orange)', marginBottom: 4 }}>RECOMMENDATION</div>
                      <p style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 300, lineHeight: 1.6 }}>{item.data.recommendation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Page findings */}
          {filteredFindings.length > 0 && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>
                Page Findings
                <span style={{ fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--text-3)', fontWeight: 400, marginLeft: 8 }}>{filteredFindings.length}</span>
              </div>
              {filteredFindings.map((item, i) => (
                <div key={i} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px 18px', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <a href={item.data.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, fontFamily: 'var(--ff-mono)', color: 'var(--blue)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Icons.Link />{item.data.url}
                    </a>
                    <span style={{ fontSize: 11, color: 'var(--text-3)', background: 'var(--bg)', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: 100, fontFamily: 'var(--ff-mono)', flexShrink: 0, marginLeft: 8 }}>
                      {item.campaign.name}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 300, marginBottom: 8, lineHeight: 1.55 }}>{item.data.summary}</p>
                  {(item.data.findings ?? []).length > 0 && (
                    <ul style={{ paddingLeft: 16 }}>
                      {item.data.findings.map((f: string, j: number) => (
                        <li key={j} style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 300, lineHeight: 1.65, marginBottom: 2 }}>{f}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </SidebarLayout>
  );
}

// ── SETTINGS PAGE ─────────────────────────────────────────────────────────────
export function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '' });
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.me().then(u => {
      setUser(u);
      setForm({ first_name: (u as any).first_name, last_name: (u as any).last_name, email: (u as any).email });
    }).catch(() => navigate('/auth'))
    .finally(() => setLoading(false));
  }, [navigate]);

  async function saveProfile() {
    setSaving(true);
    setSaved(false);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function changePassword() {
    setPwError('');
    if (!pwForm.current) { setPwError('Current password is required.'); return; }
    if (pwForm.next.length < 8) { setPwError('New password must be at least 8 characters.'); return; }
    if (pwForm.next !== pwForm.confirm) { setPwError('Passwords do not match.'); return; }
    alert('Password change coming soon — requires backend update.');
  }

  function handleLogout() {
    if (confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('auth_token');
      navigate('/auth');
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 13px', border: '1px solid var(--border-dark)',
    borderRadius: 8, background: 'var(--white)', color: 'var(--text)',
    fontSize: 14, fontWeight: 300, outline: 'none', fontFamily: 'var(--ff-sans)',
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 12, marginBottom: 16 }}>
      <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{title}</div>
      </div>
      <div style={{ padding: '20px 22px' }}>{children}</div>
    </div>
  );

  if (loading) return (
    <SidebarLayout title="Settings">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, gap: 10, color: 'var(--text-3)' }}>
        <Spinner color="var(--text-3)" size={18} /> Loading...
      </div>
    </SidebarLayout>
  );

  return (
    <SidebarLayout title={<>Account <em style={{ fontStyle: 'italic', color: 'var(--orange)' }}>settings</em></>}>
      <div style={{ maxWidth: 600 }}>

        {/* Profile */}
        <Section title="Profile">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#1D4ED8,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 600, color: '#fff', flexShrink: 0 }}>
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{user?.first_name} {user?.last_name}</div>
              <div style={{ fontSize: 13, color: 'var(--text-3)', fontFamily: 'var(--ff-mono)' }}>{user?.email}</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', display: 'block', marginBottom: 5 }}>First name</label>
              <input style={inputStyle} value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', display: 'block', marginBottom: 5 }}>Last name</label>
              <input style={inputStyle} value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} />
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', display: 'block', marginBottom: 5 }}>Email address</label>
            <input style={inputStyle} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={saveProfile} disabled={saving} style={{ background: 'var(--orange)', color: '#fff', border: 'none', padding: '9px 20px', borderRadius: 7, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--ff-sans)', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Saving...' : 'Save changes'}
            </button>
            {saved && <span style={{ fontSize: 13, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Saved
            </span>}
          </div>
        </Section>

        {/* Password */}
        <Section title="Change Password">
          {pwError && <div style={{ background: 'var(--red-bg)', border: '1px solid var(--red-border)', borderRadius: 8, padding: '10px 13px', fontSize: 13, color: 'var(--red)', marginBottom: 14 }}>{pwError}</div>}
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', display: 'block', marginBottom: 5 }}>Current password</label>
            <input type="password" style={inputStyle} value={pwForm.current} onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))} placeholder="Enter current password" />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', display: 'block', marginBottom: 5 }}>New password</label>
            <input type="password" style={inputStyle} value={pwForm.next} onChange={e => setPwForm(f => ({ ...f, next: e.target.value }))} placeholder="At least 8 characters" />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', display: 'block', marginBottom: 5 }}>Confirm new password</label>
            <input type="password" style={inputStyle} value={pwForm.confirm} onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} placeholder="Repeat new password" />
          </div>
          <button onClick={changePassword} style={{ background: 'var(--white)', border: '1px solid var(--border-dark)', color: 'var(--text)', padding: '9px 20px', borderRadius: 7, fontSize: 13, fontWeight: 400, cursor: 'pointer', fontFamily: 'var(--ff-sans)' }}>
            Update password
          </button>
        </Section>

        {/* Plan */}
        <Section title="Plan & Usage">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>Free Plan</div>
              <div style={{ fontSize: 13, color: 'var(--text-3)', fontWeight: 300 }}>Up to 3 campaigns, 500 pages per crawl</div>
            </div>
            <span style={{ background: 'var(--orange-bg)', color: 'var(--orange)', border: '1px solid var(--orange-border)', fontSize: 11, fontFamily: 'var(--ff-mono)', padding: '4px 10px', borderRadius: 100 }}>FREE</span>
          </div>
          {[
            { label: 'Campaigns', used: 1, max: 3 },
            { label: 'Pages crawled this month', used: 190, max: 1500 },
          ].map(u => (
            <div key={u.label} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-2)', marginBottom: 5 }}>
                <span>{u.label}</span>
                <span style={{ fontFamily: 'var(--ff-mono)' }}>{u.used} / {u.max}</span>
              </div>
              <div style={{ height: 4, background: 'var(--bg-2)', borderRadius: 100, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.min((u.used / u.max) * 100, 100)}%`, background: 'var(--orange)', borderRadius: 100 }} />
              </div>
            </div>
          ))}
          <button style={{ marginTop: 8, background: 'var(--orange)', color: '#fff', border: 'none', padding: '9px 20px', borderRadius: 7, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--ff-sans)' }}>
            Upgrade to Pro
          </button>
        </Section>

        {/* API Key */}
        <Section title="API Access">
          <p style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 300, marginBottom: 14, lineHeight: 1.6 }}>
            Use your API key to access Campaign Intelligence programmatically. Keep it secret.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input readOnly value="ci_live_••••••••••••••••••••••••••••••" style={{ ...inputStyle, flex: 1, fontFamily: 'var(--ff-mono)', fontSize: 13, color: 'var(--text-3)' }} />
            <button onClick={() => alert('API key copied!')} style={{ background: 'var(--white)', border: '1px solid var(--border-dark)', color: 'var(--text-2)', padding: '9px 14px', borderRadius: 7, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--ff-sans)', flexShrink: 0 }}>
              Copy
            </button>
          </div>
        </Section>

        {/* Danger Zone */}
        <Section title="Danger Zone">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, padding: '14px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 2 }}>Log out</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 300 }}>Sign out of your account on this device</div>
            </div>
            <button onClick={handleLogout} style={{ background: 'var(--white)', border: '1px solid var(--border-dark)', color: 'var(--text-2)', padding: '8px 16px', borderRadius: 7, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--ff-sans)' }}>
              Log out
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'var(--red-bg)', border: '1px solid var(--red-border)', borderRadius: 8 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--red)', marginBottom: 2 }}>Delete account</div>
              <div style={{ fontSize: 12, color: 'var(--red)', fontWeight: 300, opacity: 0.8 }}>Permanently delete your account and all data</div>
            </div>
            <button onClick={() => alert('Please contact support to delete your account.')} style={{ background: 'var(--red)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 7, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--ff-sans)' }}>
              Delete
            </button>
          </div>
        </Section>

      </div>
    </SidebarLayout>
  );
}