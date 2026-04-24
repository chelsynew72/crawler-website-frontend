import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api, type Campaign } from '../api';
import SidebarLayout from '../components/SidebarLayout';
import { Btn, Card, StatusPill, ProgressBar, Icons, IconBtn, Input, Textarea, Spinner } from '../components/ui';

function useWidth() {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return w;
}

// ── Create Campaign Modal ─────────────────────────────────────────────────────
function CreateModal({ onClose, onCreated }: { onClose: () => void; onCreated: (c: Campaign) => void }) {
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [format, setFormat] = useState('report');
  const [schedule, setSchedule] = useState(24);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const w = useWidth();
  const isMobile = w < 600;

  const formats = [
    { value: 'report', label: 'Report', desc: 'PDF / Word document' },
    { value: 'json', label: 'JSON', desc: 'Machine-readable data' },
    { value: 'csv', label: 'CSV', desc: 'Spreadsheet with sources' },
    { value: 'dashboard', label: 'Dashboard', desc: 'Visual in-app view' },
  ];
  const schedules = [
    { label: '6h', value: 6 },
    { label: '12h', value: 12 },
    { label: 'Daily', value: 24 },
    { label: '2d', value: 48 },
  ];

  async function submit() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Campaign name is required';
    if (!goal.trim()) errs.goal = 'Campaign goal is required';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await api.createCampaign({ name: name.trim(), goal: goal.trim(), output_format: format, schedule_hours: schedule });
      onCreated(res.campaign);
      onClose();
    } catch (e: any) {
      setErrors({ submit: e.message });
    } finally { setLoading(false); }
  }

  useEffect(() => {
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => {
      document.removeEventListener('keydown', h);
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    };
  }, [onClose]);

  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: isMobile ? '20px 12px' : '60px 24px', backdropFilter: 'blur(4px)', overflowY: 'auto' }}>
      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, width: '100%', maxWidth: 520, padding: isMobile ? '20px 16px' : 32, animation: 'slideUp .3s cubic-bezier(.22,1,.36,1)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'var(--ff-serif)', fontSize: isMobile ? 20 : 24, fontWeight: 400 }}>
            New <em style={{ fontStyle: 'italic', color: 'var(--orange)' }}>campaign</em>
          </h2>
          <IconBtn onClick={onClose}><Icons.Close /></IconBtn>
        </div>
        {errors.submit && <div style={{ background: 'var(--red-bg)', border: '1px solid var(--red-border)', borderRadius: 8, padding: '10px 13px', fontSize: 13, color: 'var(--red)', marginBottom: 14 }}>{errors.submit}</div>}
        <Input label="Campaign name" hint="required" placeholder="e.g. Competitor Pricing Research" value={name} onChange={e => setName(e.target.value)} error={errors.name} />
        <Textarea label="Campaign goal" hint="what should AI look for?" placeholder="e.g. Find all pricing pages, product tiers, and discount offers." value={goal} onChange={e => setGoal(e.target.value)} error={errors.goal} />

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Output format</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {formats.map(f => (
              <label key={f.value} style={{ border: `1px solid ${format === f.value ? 'var(--orange)' : 'var(--border-dark)'}`, background: format === f.value ? 'var(--orange-bg)' : 'var(--white)', borderRadius: 8, padding: '10px 12px', cursor: 'pointer' }}>
                <input type="radio" name="fmt" value={f.value} checked={format === f.value} onChange={() => setFormat(f.value)} style={{ display: 'none' }} />
                <div style={{ fontSize: 13, fontWeight: 500, color: format === f.value ? 'var(--orange)' : 'var(--text)', marginBottom: 1 }}>{f.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 300 }}>{f.desc}</div>
              </label>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Crawl schedule</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {schedules.map(s => (
              <button key={s.value} onClick={() => setSchedule(s.value)} style={{ flex: 1, border: `1px solid ${schedule === s.value ? 'var(--orange)' : 'var(--border-dark)'}`, background: schedule === s.value ? 'var(--orange-bg)' : 'var(--white)', color: schedule === s.value ? 'var(--orange)' : 'var(--text-2)', borderRadius: 7, padding: '8px 4px', fontSize: 12, fontFamily: 'var(--ff-mono)', cursor: 'pointer' }}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20, paddingTop: 18, borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
          <button onClick={onClose} style={{ background: 'var(--white)', border: '1px solid var(--border-dark)', color: 'var(--text-2)', fontFamily: 'var(--ff-sans)', fontSize: 13, padding: '8px 14px', borderRadius: 7, cursor: 'pointer' }}>Cancel</button>
          <Btn onClick={submit} loading={loading} style={{ fontSize: 13, padding: '8px 18px' }}>{!loading && <Icons.Plus />} Create Campaign</Btn>
        </div>
      </div>
    </div>
  );
}

// ── Campaign Card ─────────────────────────────────────────────────────────────
type EnrichedCampaign = Campaign & { website_count: number; pages_crawled: number; insights_count: number };

function CampaignCard({ campaign, onDelete, onTrigger, delay }: { campaign: EnrichedCampaign; onDelete: (id: string) => void; onTrigger: (id: string) => void; delay: number }) {
  const navigate = useNavigate();
  const w = useWidth();
  const isMobile = w < 600;

  return (
    <div style={{ animation: `fadeUp .4s cubic-bezier(.22,1,.36,1) ${delay}ms both` }}>
      <Card onClick={() => navigate(`/campaign/${campaign.id}`)} style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: isMobile ? 14 : 15, fontWeight: 600, marginBottom: 4 }}>{campaign.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{campaign.goal}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <StatusPill status={campaign.status} />
            {!isMobile && (
              <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
                <IconBtn title="Trigger crawl" onClick={() => onTrigger(campaign.id)}><Icons.Play /></IconBtn>
                <IconBtn title="Delete" danger onClick={() => onDelete(campaign.id)}><Icons.Trash /></IconBtn>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 16, flexWrap: 'wrap' }}>
          {[
            { icon: <Icons.Globe />, text: `${campaign.website_count} site${campaign.website_count !== 1 ? 's' : ''}` },
            { icon: <Icons.File />,  text: `${campaign.pages_crawled.toLocaleString()} pages` },
            { icon: <Icons.Insight />, text: `${campaign.insights_count} insights` },
            ...(!isMobile ? [{ icon: <Icons.Cal />, text: new Date(campaign.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }] : []),
          ].map((m, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--ff-mono)' }}>{m.icon}{m.text}</span>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: 10, fontFamily: 'var(--ff-mono)', color: 'var(--text-3)' }}>{campaign.output_format.toUpperCase()}</span>
        </div>

        {/* Mobile action buttons */}
        {isMobile && (
          <div style={{ display: 'flex', gap: 8, marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border)' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => onTrigger(campaign.id)} style={{ flex: 1, padding: '7px 0', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12, color: 'var(--text-2)', cursor: 'pointer', fontFamily: 'var(--ff-sans)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
              <Icons.Play /> Run Crawl
            </button>
            <button onClick={() => onDelete(campaign.id)} style={{ flex: 1, padding: '7px 0', background: 'var(--red-bg)', border: '1px solid var(--red-border)', borderRadius: 6, fontSize: 12, color: 'var(--red)', cursor: 'pointer', fontFamily: 'var(--ff-sans)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
              <Icons.Trash /> Delete
            </button>
          </div>
        )}

        {campaign.status === 'crawling' && <ProgressBar value={50} label="Crawl in progress" />}
      </Card>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [campaigns, setCampaigns] = useState<EnrichedCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const w = useWidth();
  const isMobile = w < 600;

  const totalCampaigns = campaigns.length;
  const totalWebsites  = campaigns.reduce((s, c) => s + c.website_count, 0);
  const totalPages     = campaigns.reduce((s, c) => s + c.pages_crawled, 0);
  const totalInsights  = campaigns.reduce((s, c) => s + c.insights_count, 0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await api.getCampaigns();
      const enriched = await Promise.all(
        (Array.isArray(list) ? list : []).map(async (c) => {
          try {
            const detail = await api.getCampaign(c.id);
            const websiteCount = (detail.websites ?? []).length;
            const pagesCrawled = (detail.websites ?? []).reduce((s: number, w: any) => s + (w.pages_found ?? 0), 0);
            let insightCount = 0;
            try {
              const ins = await api.getInsights(c.id);
              insightCount = (ins.page_findings ?? []).length;
            } catch { /* */ }
            return { ...c, website_count: websiteCount, pages_crawled: pagesCrawled, insights_count: insightCount };
          } catch {
            return { ...c, website_count: 0, pages_crawled: 0, insights_count: 0 };
          }
        })
      );
      setCampaigns(enriched);
    } catch { setCampaigns([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (searchParams.get('new') === '1') {
      setShowModal(true);
      searchParams.delete('new');
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  const filtered = campaigns.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.goal.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete(id: string) {
    if (!confirm('Delete this campaign? This cannot be undone.')) return;
    try {
      await api.deleteCampaign(id);
      setCampaigns(prev => prev.filter(c => c.id !== id));
    } catch (e: any) { alert('Failed to delete: ' + e.message); }
  }

  async function handleTrigger(id: string) {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: 'crawling' } : c));
    try { await api.triggerCrawl(id); }
    catch (e: any) {
      alert(e.message);
      setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: 'active' } : c));
    }
  }

  const statCards = [
    { label: 'Campaigns',  value: totalCampaigns, delta: totalCampaigns > 0 ? `${totalCampaigns} active` : 'None yet', up: totalCampaigns > 0, color: 'var(--orange)' },
    { label: 'Pages',      value: totalPages.toLocaleString(), delta: totalPages > 0 ? 'Crawled' : 'No crawls yet', up: totalPages > 0, color: 'var(--text)' },
    { label: 'Websites',   value: totalWebsites, delta: 'Tracked', up: false, color: 'var(--text)' },
    { label: 'Insights',   value: totalInsights, delta: totalInsights > 0 ? 'Generated' : 'Run analysis', up: totalInsights > 0, color: 'var(--text)' },
  ];

  return (
    <SidebarLayout
      title={<>Your <em style={{ fontStyle: 'italic', color: 'var(--orange)' }}>campaigns</em></>}
      topbarRight={
        !isMobile ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--white)', border: '1px solid var(--border-dark)', borderRadius: 7, padding: '0 10px', height: 32 }}>
              <Icons.Search />
              <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ border: 'none', outline: 'none', fontSize: 13, color: 'var(--text)', background: 'transparent', width: 150 }} />
            </div>
            <button onClick={load} title="Refresh" style={{ width: 32, height: 32, border: '1px solid var(--border-dark)', borderRadius: 7, background: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-2)' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
              </svg>
            </button>
          </>
        ) : (
          <button onClick={() => setShowModal(true)} style={{ background: 'var(--orange)', color: '#fff', border: 'none', borderRadius: 7, padding: '6px 12px', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--ff-sans)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Icons.Plus /> New
          </button>
        )
      }
    >
      {/* Mobile search */}
      {isMobile && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--white)', border: '1px solid var(--border-dark)', borderRadius: 8, padding: '0 12px', height: 38, marginBottom: 16 }}>
          <Icons.Search />
          <input placeholder="Search campaigns..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', fontSize: 14, color: 'var(--text)', background: 'transparent', flex: 1 }} />
        </div>
      )}

      {/* Stats — 2 cols on mobile, 4 on desktop */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)', gap: isMobile ? 8 : 12, marginBottom: isMobile ? 20 : 28 }}>
        {statCards.map(s => (
          <div key={s.label} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 10, padding: isMobile ? '14px 12px' : '18px 20px' }}>
            <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.08em', fontFamily: 'var(--ff-mono)', marginBottom: 5 }}>{s.label}</div>
            <div style={{ fontSize: isMobile ? 22 : 26, fontWeight: 600, fontFamily: 'var(--ff-mono)', color: s.color, lineHeight: 1 }}>{loading ? '—' : s.value}</div>
            <div style={{ fontSize: 10, color: s.up ? 'var(--green)' : 'var(--text-3)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
              {s.up && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>}
              {s.delta}
            </div>
          </div>
        ))}
      </div>

      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>All campaigns</span>
          <span style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--ff-mono)', background: 'var(--bg-2)', border: '1px solid var(--border)', padding: '2px 7px', borderRadius: 100 }}>{filtered.length}</span>
        </div>
        {!isMobile && (
          <Btn size="sm" onClick={() => setShowModal(true)} style={{ fontSize: 12, padding: '6px 12px', borderRadius: 6 }}>
            <Icons.Plus /> New Campaign
          </Btn>
        )}
      </div>

      {/* List */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 180, gap: 10, color: 'var(--text-3)' }}>
          <Spinner color="var(--text-3)" size={18} /> Loading campaigns...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 12, padding: isMobile ? '40px 20px' : '60px 40px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--ff-serif)', fontSize: 18, color: 'var(--text)', marginBottom: 6 }}>
            {search ? 'No campaigns found' : 'No campaigns yet'}
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 300, marginBottom: 20 }}>
            {search ? 'Try a different search term.' : 'Create your first campaign to start crawling.'}
          </p>
          {!search && <Btn size="sm" onClick={() => setShowModal(true)} style={{ fontSize: 13, padding: '8px 16px', borderRadius: 7 }}><Icons.Plus /> New Campaign</Btn>}
        </div>
      ) : (
        filtered.map((c, i) => <CampaignCard key={c.id} campaign={c} onDelete={handleDelete} onTrigger={handleTrigger} delay={i * 60} />)
      )}

      {showModal && (
        <CreateModal onClose={() => setShowModal(false)} onCreated={c => setCampaigns(prev => [{ ...c, website_count: 0, pages_crawled: 0, insights_count: 0 }, ...prev])} />
      )}
    </SidebarLayout>
  );
}