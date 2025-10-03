const API_URL = 'https://smart-lead-new.vercel.app/api';

export interface LeadResult {
  url: string;
  domain: string;
  title: string;
  meta: string;
  emails: string[];
  phones: string[];
  domain_age: number | null;
  keywords_found: string[];
  has_contact: boolean;
  linkedin: string;
  company_type: string;
  growth_level: string;
  has_careers_page: boolean;
  score: number;
  score_color: string;
  error: string | null;
}

export const scrapeLeads = async (urls: string[]): Promise<LeadResult[]> => {
  const response = await fetch(`${API_URL}/scrape`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ urls }),
  });

  if (!response.ok) {
    throw new Error('Failed to scrape leads');
  }

  return response.json();
};
