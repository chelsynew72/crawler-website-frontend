import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api';
import type { Campaign } from '../api';
import SidebarLayout from '../components/SidebarLayout';
import { Btn, Card, StatusPill, ProgressBar, Icons, IconBtn, Input, Textarea, Spinner } from '../components/ui';

// ── Create Campaign Modal ─────────────────────────────────────────────────────
function CreateModal({ onClose, onCreated }: { onClose: () => void; onCreated: (c: Campaign) => void }) {
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [format, setFormat] = useState('report');
  const [schedule, setSchedule] = useState(24);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formats = [
    { value: 'report',    label: 'Report',    desc: 'PDF / Word document' },
    { value: 'json',      label: 'JSON',      desc: 'Machine-readable data' },
    { value: 'csv',       label: 'CSV',       desc: 'Spreadsheet with sources' },
    { value: 'dashboard', label: 'Dashboard', desc: 'Visual in-app view' },
  ];
  const schedules = [
    { label: 'Every 6h',  value: 6 },
    { label: 'Every 12h', value: 12 },
    { label: 'Daily',     value: 24 },
    { label: 'Every 2d',  value: 48 },
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
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
        zIndex: 200, display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '80px 24px', backdropFilter: 'blur(4px)',
      }}
    >
      <div style={{
        background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16,
        width: '100%', maxWidth: 520, padding: 32,
        animation: 'slideUp .3s cubic-bezier(.22,1,.36,1)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'var(--ff-serif)', fontSize: 24, fontWeight: 400, color: 'var(--text)' }}>
            New <em style={{ fontStyle: 'italic', color: 'var(--orange)' }}>campaign</em>
          </h2>
          <IconBtn title="Close" onClick={onClose}><Icons.Close /></IconBtn>
        </div>

        {errors.submit && (
          <div style={{ background: 'var(--red-bg)', border: '1px solid var(--red-border)', borderRadius: 8, padding: '10px 13px', fontSize: 13, color: 'var(--red)', marginBottom: 14 }}>
            {errors.submit}
          </div>
        )}

        <Input label="Campaign name" hint="required" placeholder="e.g. Competitor Pricing Research"
          value={name} onChange={e => setName(e.target.value)} error={errors.name} />
        <Textarea label="Campaign goal" hint="what should AI look for?"
          placeholder="e.g. Find all pricing pages, product tiers, and discount offers across competitor websites."
          value={goal} onChange={e => setGoal(e.target.value)} error={errors.goal} />

        {/* Output format */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 8 }}>Output format</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {formats.map(f => (
              <label key={f.value} style={{
                border: `1px solid ${format === f.value ? 'var(--orange)' : 'var(--border-dark)'}`,
                background: format === f.value ? 'var(--orange-bg)' : 'var(--white)',
                borderRadius: 8, padding: 12, cursor: 'pointer', transition: 'all .15s',
              }}>
                <input type="radio" name="fmt" value={f.value} checked={format === f.value}
                  onChange={() => setFormat(f.value)} style={{ display: 'none' }} />
                <div style={{ fontSize: 13, fontWeight: 500, color: format === f.value ? 'var(--orange)' : 'var(--text)', marginBottom: 2 }}>{f.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 300 }}>{f.desc}</div>
              </label>
            ))}
          </div>
        </div>

        {/* Schedule */}
        <div style={{ marginBottom: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 8 }}>Crawl schedule</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {schedules.map(s => (
              <button key={s.value} onClick={() => setSchedule(s.value)} style={{
                flex: 1, border: `1px solid ${schedule === s.value ? 'var(--orange)' : 'var(--border-dark)'}`,
                background: schedule === s.value ? 'var(--orange-bg)' : 'var(--white)',
                color: schedule === s.value ? 'var(--orange)' : 'var(--text-2)',
                borderRadius: 7, padding: '9px 6px', fontSize: 12, fontFamily: 'var(--ff-mono)',
                cursor: 'pointer', transition: 'all .15s',
              }}>{s.label}</button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
          <button onClick={onClose} style={{ background: 'var(--white)', border: '1px solid var(--border-dark)', color: 'var(--text-2)', fontFamily: 'var(--ff-sans)', fontSize: 13, padding: '8px 16px', borderRadius: 7, cursor: 'pointer' }}>
            Cancel
          </button>
          <Btn onClick={submit} loading={loading} style={{ fontSize: 13, padding: '8px 20px' }}>
            {!loading && <Icons.Plus />} Create Campaign
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ── Campaign Card ─────────────────────────────────────────────────────────────
function CampaignCard({ campaign, onDelete, onTrigger, delay }: {
  campaign: Campaign; onDelete: (id: string) => void; onTrigger: (id: string) => void; delay: number;
}) {
  const navigate = useNavigate();
  const isCrawling = campaign.status === 'crawling';

  return (
    <div
      style={{ animation: `fadeUp .4s cubic-bezier(.22,1,.36,1) ${delay}ms both` }}
    >
      <Card onClick={() => navigate(`/campaign/${campaign.id}`)} style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{campaign.name}</div>
            <div style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 520 }}>
              {campaign.goal}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <StatusPill status={campaign.status} />
            <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
              <IconBtn title="Trigger crawl" onClick={() => onTrigger(campaign.id)}><Icons.Play /></IconBtn>
              <IconBtn title="Edit"><Icons.Edit /></IconBtn>
              <IconBtn title="Delete" danger onClick={() => onDelete(campaign.id)}><Icons.Trash /></IconBtn>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          {[
            { icon: <Icons.Globe />, text: `${(campaign as any).website_count ?? 0} website${(campaign as any).website_count !== 1 ? 's' : ''}` },
            { icon: <Icons.File />,  text: `${(campaign as any).pages_crawled ?? 0} pages` },
            { icon: <Icons.Insight />, text: `${(campaign as any).insights_count ?? 0} insights` },
            { icon: <Icons.Cal />,  text: new Date(campaign.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
          ].map((m, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-3)', fontFamily: 'var(--ff-mono)' }}>
              {m.icon}{m.text}
            </span>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--text-3)' }}>
            {campaign.output_format.toUpperCase()}
          </span>
        </div>

        {isCrawling && <ProgressBar value={Math.floor(Math.random() * 60) + 20} label="Crawl progress" />}
      </Card>
    </div>
  );
}

// ── Dashboard Page ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const load = useCallback(async () => {
    try {
      const data = await api.getCampaigns();
      setCampaigns(Array.isArray(data) ? data : []);
    } catch (e) {
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
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

  function handleDelete(id: string) {
    if (!confirm('Delete this campaign? This cannot be undone.')) return;
    setCampaigns(prev => prev.filter(c => c.id !== id));
  }

  function handleTrigger(id: string) {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: 'crawling' } : c));
    api.triggerCrawl(id).catch(() => {});
  }

  const stats = [
    { label: 'Total Campaigns', value: campaigns.length, delta: '+1 this week', up: true },
    { label: 'Pages Crawled',   value: '1,847',          delta: '+312 today',   up: true },
    { label: 'Websites Tracked',value: campaigns.length * 2, delta: 'Across all', up: false },
    { label: 'AI Insights',     value: '94',             delta: '+47 last run',  up: true },
  ];

  return (
    <SidebarLayout
      title={<>Your <em style={{ fontStyle: 'italic', color: 'var(--orange)' }}>campaigns</em></>}
      topbarRight={
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--white)', border: '1px solid var(--border-dark)', borderRadius: 7, padding: '0 12px', height: 32 }}>
            <Icons.Search />
            <input
              placeholder="Search campaigns..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ border: 'none', outline: 'none', fontSize: 13, color: 'var(--text)', background: 'transparent', width: 180 }}
            />
          </div>
          <button style={{ width: 32, height: 32, border: '1px solid var(--border-dark)', borderRadius: 7, background: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-2)' }}>
            <Icons.Bell />
          </button>
        </>
      }
    >
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 28 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 10, padding: '18px 20px' }}>
            <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.08em', fontFamily: 'var(--ff-mono)', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 26, fontWeight: 600, fontFamily: 'var(--ff-mono)', color: s.label === 'Total Campaigns' ? 'var(--orange)' : 'var(--text)', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: s.up ? 'var(--green)' : 'var(--text-3)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
              {s.up && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>}
              {s.delta}
            </div>
          </div>
        ))}
      </div>

      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>All campaigns</span>
          <span style={{ fontSize: 12, color: 'var(--text-3)', fontFamily: 'var(--ff-mono)', background: 'var(--bg-2)', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: 100 }}>{filtered.length}</span>
        </div>
        <Btn size="sm" onClick={() => setShowModal(true)} style={{ fontSize: 12, padding: '6px 12px', borderRadius: 6 }}>
          <Icons.Plus /> New Campaign
        </Btn>
      </div>

      {/* List */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, gap: 10, color: 'var(--text-3)' }}>
          <Spinner color="var(--text-3)" size={18} /> Loading campaigns...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 12, padding: '60px 40px', textAlign: 'center' }}>
          <div style={{ width: 52, height: 52, background: 'var(--bg)', border: '1px solid var(--border-dark)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Icons.Search />
          </div>
          <div style={{ fontFamily: 'var(--ff-serif)', fontSize: 20, fontWeight: 400, color: 'var(--text)', marginBottom: 6 }}>
            {search ? 'No campaigns found' : 'No campaigns yet'}
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-2)', fontWeight: 300, marginBottom: 24 }}>
            {search ? 'Try a different search term.' : 'Create your first campaign to start crawling.'}
          </p>
          {!search && (
            <Btn size="sm" onClick={() => setShowModal(true)} style={{ fontSize: 13, padding: '8px 16px', borderRadius: 7 }}>
              <Icons.Plus /> New Campaign
            </Btn>
          )}
        </div>
      ) : (
        <div>
          {filtered.map((c, i) => (
            <CampaignCard key={c.id} campaign={c} onDelete={handleDelete} onTrigger={handleTrigger} delay={i * 60} />
          ))}
        </div>
      )}

      {showModal && (
        <CreateModal
          onClose={() => setShowModal(false)}
          onCreated={c => { setCampaigns(prev => [c, ...prev]); }}
        />
      )}
    </SidebarLayout>
  );
}