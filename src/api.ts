const BASE = import.meta.env.VITE_API_URL || 'https://my-crawler.campaign-crawler.workers.dev';

async function req<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error((err as any).error || 'Request failed');
  }
  return res.json();
}

export const api = {
  // Campaigns
  getCampaigns: () => req<Campaign[]>('/campaigns'),
  getCampaign:  (id: string) => req<CampaignDetail>(`/campaigns/${id}`),
  createCampaign: (body: CreateCampaignBody) =>
    req<{ campaign: Campaign }>('/campaigns', { method: 'POST', body: JSON.stringify(body) }),

  // Websites
  addWebsite: (campaignId: string, url: string) =>
    req<{ website: Website }>(`/campaigns/${campaignId}/websites`, {
      method: 'POST', body: JSON.stringify({ url }),
    }),

  // Crawl
  triggerCrawl: (campaignId: string) =>
    req<{ message: string }>(`/campaigns/${campaignId}/crawl`, { method: 'POST' }),
  getPages: (campaignId: string) =>
    req<PagesResponse>(`/campaigns/${campaignId}/pages`),

  // AI
  analyze: (campaignId: string) =>
    req<AnalysisResponse>(`/campaigns/${campaignId}/analyze`, { method: 'POST' }),
  getSummary: (campaignId: string) =>
    req<SummaryResponse>(`/campaigns/${campaignId}/summary`, { method: 'POST' }),
  getInsights: (campaignId: string) =>
    req<InsightsResponse>(`/campaigns/${campaignId}/insights`),
};

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Campaign {
  id: string;
  name: string;
  goal: string;
  output_format: string;
  schedule_hours: number;
  status: string;
  created_at: string;
}

export interface Website {
  id: string;
  campaign_id: string;
  url: string;
  status: string;
  pages_found: number;
  last_crawled_at: string | null;
  created_at: string;
}

export interface CampaignDetail extends Campaign {
  websites: Website[];
}

export interface CrawlPage {
  id: string;
  campaign_id: string;
  website_id: string;
  url: string;
  depth: number;
  status: string;
  word_count: number;
  crawled_at: string | null;
}

export interface PagesResponse {
  total: number;
  pages: CrawlPage[];
}

export interface PageFinding {
  url: string;
  relevant: boolean;
  findings: string[];
  summary: string;
}

export interface KeyFinding {
  point: string;
  sources: string[];
}

export interface Summary {
  headline: string;
  key_findings: KeyFinding[];
  recommendation: string;
}

export interface AnalysisResponse {
  campaign: string;
  goal: string;
  pages_analyzed: number;
  relevant_pages: number;
  summary: Summary | null;
  page_findings: PageFinding[];
}

export interface SummaryResponse {
  campaign: string;
  goal: string;
  summary: Summary;
}

export interface InsightsResponse {
  summary: Summary | null;
  page_findings: PageFinding[];
}

export interface CreateCampaignBody {
  name: string;
  goal: string;
  output_format: string;
  schedule_hours: number;
}