import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import type { CampaignDetail, Website, CrawlPage, PageFinding, Summary } from '../api';
import SidebarLayout from '../components/SidebarLayout';
import { Btn, StatusPill, Icons, IconBtn, Input, Spinner, Card } from '../components/ui';

type Tab = 'websites' | 'pages' | 'insights';

// ── Add Website Modal ─────────────────────────────────────────────────────────
function AddWebsiteModal({ campaignId, onClose, onAdded }: {
  campaignId: string; onClose: () => void; onAdded: (w: Website) => void;
}) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit() {
    if (!url.trim()) { setError('URL is required'); return; }
    try { new URL(url.trim()); } catch { setError('Please enter a valid URL including https://'); return; }
    setLoading(true);
    try {
      const res = await api.addWebsite(campaignId, url.trim());
      onAdded(res.website);
      onClose();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 200, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '80px 24px', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 14, width: '100%', maxWidth: 440, padding: 28, animation: 'slideUp .3s cubic-bezier(.22,1,.36,1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'var(--ff-serif)', fontSize: 20, fontWeight: 400, color: 'var(--text)' }}>
            Add <em style={{ fontStyle: 'italic', color: 'var(--orange)' }}>website</em>
          </h3>
          <IconBtn onClick={onClose}><Icons.Close /></IconBtn>
        </div>
        <Input label="Website URL" placeholder="https://competitor.com" value={url}
          onChange={e => setUrl(e.target.value)} error={error}
          onKeyDown={e => e.key === 'Enter' && submit()} />
        <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 20, lineHeight: 1.55 }}>
          The crawler will deep-crawl this entire website — following every internal link it can find.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={onClose} style={{ background: 'var(--white)', border: '1px solid var(--border-dark)', color: 'var(--text-2)', fontFamily: 'var(--ff-sans)', fontSize: 13, padding: '8px 14px', borderRadius: 7, cursor: 'pointer' }}>Cancel</button>
          <Btn onClick={submit} loading={loading} style={{ fontSize: 13, padding: '8px 18px' }}>
            {!loading && <Icons.Globe />} Add Website
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ── Insights Panel ────────────────────────────────────────────────────────────
function InsightsPanel({ campaignId }: { campaignId: string }) {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [findings, setFindings] = useState<PageFinding[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [summarizing, setSummarizing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api.getInsights(campaignId);
      setSummary(data.summary);
      setFindings(data.page_findings);
    } catch { /* empty */ }
    finally { setLoading(false); }
  }, [campaignId]);

  useEffect(() => { load(); }, [load]);

  async function runAnalysis() {
    setAnalyzing(true);
    try {
      const res = await api.analyze(campaignId);
      setFindings(res.page_findings);
      if (res.summary) setSummary(res.summary);
    } catch (e: any) { alert(e.message); }
    finally { setAnalyzing(false); }
  }

  async function runSummary() {
    setSummarizing(true);
    try {
      const res = await api.getSummary(campaignId);
      setSummary(res.summary);
    } catch (e: any) { alert(e.message); }
    finally { setSummarizing(false); }
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, gap: 10, color: 'var(--text-3)' }}>
      <Spinner color="var(--text-3)" size={18} /> Loading insights...
    </div>
  );

  return (
    <div>
      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <Btn onClick={runAnalysis} loading={analyzing} style={{ fontSize: 13, padding: '8px 16px' }}>
          {!analyzing && <Icons.Search />} Run AI Analysis
        </Btn>
        {findings.length > 0 && !summary && (
          <Btn variant="outline" onClick={runSummary} loading={summarizing} style={{ fontSize: 13, padding: '8px 16px' }}>
            {!summarizing && <Icons.Insight />} Generate Summary
          </Btn>
        )}
      </div>

      {findings.length === 0 && !summary ? (
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 12, padding: '48px 32px', textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, background: 'var(--bg)', border: '1px solid var(--border-dark)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
            <Icons.Insight />
          </div>
          <div style={{ fontFamily: 'var(--ff-serif)', fontSize: 18, color: 'var(--text)', marginBottom: 6 }}>No insights yet</div>
          <p style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 300 }}>Run a crawl first, then click "Run AI Analysis" to generate insights.</p>
        </div>
      ) : (
        <>
          {/* Summary */}
          {summary && (
            <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--orange)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 12 }}>Executive Summary</div>
              <p style={{ fontSize: 16, fontWeight: 500, color: 'var(--text)', marginBottom: 16, lineHeight: 1.5 }}>{summary.headline}</p>

              {summary.key_findings?.map((f, i) => (
                <div key={i} style={{ marginBottom: 14, paddingLeft: 16, borderLeft: '2px solid var(--orange-border)' }}>
                  <p style={{ fontSize: 14, color: 'var(--text)', marginBottom: 6, fontWeight: 400 }}>{f.point}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {f.sources?.map((s, j) => (
                      <a key={j} href={s} target="_blank" rel="noreferrer" style={{
                        fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--blue)',
                        background: 'var(--blue-bg)', border: '1px solid var(--blue-border)',
                        padding: '2px 8px', borderRadius: 4, display: 'inline-flex', alignItems: 'center', gap: 4,
                      }}>
                        <Icons.Link />{new URL(s).hostname}
                      </a>
                    ))}
                  </div>
                </div>
              ))}

              {summary.recommendation && (
                <div style={{ background: 'var(--orange-bg)', border: '1px solid var(--orange-border)', borderRadius: 8, padding: '12px 14px', marginTop: 16 }}>
                  <div style={{ fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--orange)', marginBottom: 4 }}>RECOMMENDATION</div>
                  <p style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 300, lineHeight: 1.6 }}>{summary.recommendation}</p>
                </div>
              )}
            </div>
          )}

          {/* Per-page findings */}
          {findings.length > 0 && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>
                Page findings <span style={{ fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--text-3)', fontWeight: 400, marginLeft: 6 }}>{findings.length} relevant pages</span>
              </div>
              {findings.map((f, i) => (
                <div key={i} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px 18px', marginBottom: 10 }}>
                  <a href={f.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, fontFamily: 'var(--ff-mono)', color: 'var(--blue)', display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
                    <Icons.Link />{f.url}
                  </a>
                  <p style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 300, marginBottom: 10, lineHeight: 1.55 }}>{f.summary}</p>
                  <ul style={{ paddingLeft: 16 }}>
                    {f.findings?.map((item, j) => (
                      <li key={j} style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 300, lineHeight: 1.65, marginBottom: 3 }}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Campaign Detail Page ──────────────────────────────────────────────────────
export default function CampaignPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<CampaignDetail | null>(null);
  const [pages, setPages] = useState<CrawlPage[]>([]);
  const [tab, setTab] = useState<Tab>('websites');
  const [loading, setLoading] = useState(true);
  const [crawling, setCrawling] = useState(false);
  const [showAddUrl, setShowAddUrl] = useState(false);
  const [pagesLoading, setPagesLoading] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      const data = await api.getCampaign(id);
      setCampaign(data);
    } catch { navigate('/dashboard'); }
    finally { setLoading(false); }
  }, [id, navigate]);

  useEffect(() => { load(); }, [load]);

  async function loadPages() {
    if (!id) return;
    setPagesLoading(true);
    try {
      const data = await api.getPages(id);
      setPages(data.pages);
    } catch { /* */ }
    finally { setPagesLoading(false); }
  }

  async function triggerCrawl() {
    if (!id) return;
    setCrawling(true);
    try {
      await api.triggerCrawl(id);
      setCampaign(prev => prev ? { ...prev, status: 'crawling' } : prev);
    } catch (e: any) { alert(e.message); }
    finally { setCrawling(false); }
  }

  if (loading) return (
    <SidebarLayout title="Loading...">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, gap: 10, color: 'var(--text-3)' }}>
        <Spinner color="var(--text-3)" size={20} /> Loading campaign...
      </div>
    </SidebarLayout>
  );

  if (!campaign) return null;

  const tabs: { key: Tab; label: string }[] = [
    { key: 'websites', label: 'Websites' },
    { key: 'pages',    label: `Pages${pages.length ? ` (${pages.length})` : ''}` },
    { key: 'insights', label: 'AI Insights' },
  ];

  return (
    <SidebarLayout
      title={<>
        <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'flex', alignItems: 'center', marginRight: 8 }}>
          <Icons.Back />
        </button>
        <em style={{ fontStyle: 'italic', color: 'var(--orange)' }}>{campaign.name}</em>
      </>}
      topbarRight={
        <Btn onClick={triggerCrawl} loading={crawling} size="sm" style={{ fontSize: 13, padding: '7px 14px', borderRadius: 7 }}>
          {!crawling && <Icons.Play />} Run Crawl
        </Btn>
      }
    >
      {/* Campaign meta */}
      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 22px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>{campaign.name}</div>
            <p style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 300, lineHeight: 1.6, maxWidth: 600 }}>{campaign.goal}</p>
          </div>
          <StatusPill status={campaign.status} />
        </div>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {[
            { label: 'Format', value: campaign.output_format.toUpperCase() },
            { label: 'Schedule', value: `Every ${campaign.schedule_hours}h` },
            { label: 'Created', value: new Date(campaign.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
          ].map(m => (
            <div key={m.label}>
              <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.08em', fontFamily: 'var(--ff-mono)', marginBottom: 2 }}>{m.label}</div>
              <div style={{ fontSize: 12, fontFamily: 'var(--ff-mono)', color: 'var(--text-2)' }}>{m.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: 4 }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => { setTab(t.key); if (t.key === 'pages' && pages.length === 0) loadPages(); }} style={{
            flex: 1, padding: '8px 12px', borderRadius: 7,
            border: tab === t.key ? '1px solid var(--border)' : '1px solid transparent',
            background: tab === t.key ? 'var(--white)' : 'transparent',
            fontSize: 13, fontWeight: tab === t.key ? 500 : 400,
            color: tab === t.key ? 'var(--text)' : 'var(--text-2)',
            cursor: 'pointer', transition: 'all .15s', fontFamily: 'var(--ff-sans)',
            boxShadow: tab === t.key ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
          }}>{t.label}</button>
        ))}
      </div>

      {/* WEBSITES TAB */}
      {tab === 'websites' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
            <Btn size="sm" onClick={() => setShowAddUrl(true)} style={{ fontSize: 12, padding: '6px 12px', borderRadius: 6 }}>
              <Icons.Plus /> Add Website
            </Btn>
          </div>
          {campaign.websites.length === 0 ? (
            <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 12, padding: '48px 32px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--ff-serif)', fontSize: 18, color: 'var(--text)', marginBottom: 6 }}>No websites added yet</div>
              <p style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 300, marginBottom: 20 }}>Add a website to start crawling.</p>
              <Btn size="sm" onClick={() => setShowAddUrl(true)} style={{ fontSize: 13, padding: '8px 16px', borderRadius: 7 }}><Icons.Plus /> Add Website</Btn>
            </div>
          ) : (
            campaign.websites.map(w => (
              <div key={w.id} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 18px', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontFamily: 'var(--ff-mono)', color: 'var(--text)', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{w.url}</div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <span style={{ fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--text-3)' }}>{w.pages_found} pages found</span>
                    {w.last_crawled_at && <span style={{ fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--text-3)' }}>Last crawled {new Date(w.last_crawled_at).toLocaleDateString()}</span>}
                  </div>
                </div>
                <StatusPill status={w.status} />
              </div>
            ))
          )}
        </div>
      )}

      {/* PAGES TAB */}
      {tab === 'pages' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{pages.length} pages crawled</span>
            <Btn variant="outline" size="sm" onClick={loadPages} loading={pagesLoading} style={{ fontSize: 12, padding: '6px 12px', borderRadius: 6 }}>Refresh</Btn>
          </div>

          {pagesLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, gap: 10, color: 'var(--text-3)' }}>
              <Spinner color="var(--text-3)" size={18} /> Loading pages...
            </div>
          ) : pages.length === 0 ? (
            <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 12, padding: '48px 32px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--ff-serif)', fontSize: 18, color: 'var(--text)', marginBottom: 6 }}>No pages crawled yet</div>
              <p style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 300 }}>Trigger a crawl from the Websites tab to start.</p>
            </div>
          ) : (
            <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 80px 90px 90px', gap: 0, borderBottom: '1px solid var(--border)', padding: '10px 16px', background: 'var(--bg)' }}>
                {['Status', 'URL', 'Depth', 'Words', 'Crawled'].map(h => (
                  <span key={h} style={{ fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</span>
                ))}
              </div>
              {pages.map((p, i) => (
                <div key={p.id} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 80px 90px 90px', gap: 0, padding: '10px 16px', borderBottom: i < pages.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'center', background: i % 2 === 0 ? 'var(--white)' : 'var(--bg)', transition: 'background .15s' }}>
                  <StatusPill status={p.status} />
                  <a href={p.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, fontFamily: 'var(--ff-mono)', color: 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: 10, maxWidth: 400 }}>{p.url}</a>
                  <span style={{ fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--text-3)' }}>{p.depth}</span>
                  <span style={{ fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--text-3)' }}>{p.word_count.toLocaleString()}</span>
                  <span style={{ fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--text-3)' }}>{p.crawled_at ? new Date(p.crawled_at).toLocaleDateString() : '—'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* INSIGHTS TAB */}
      {tab === 'insights' && id && <InsightsPanel campaignId={id} />}

      {showAddUrl && (
        <AddWebsiteModal
          campaignId={campaign.id}
          onClose={() => setShowAddUrl(false)}
          onAdded={w => setCampaign(prev => prev ? { ...prev, websites: [...prev.websites, w] } : prev)}
        />
      )}
    </SidebarLayout>
  );
}