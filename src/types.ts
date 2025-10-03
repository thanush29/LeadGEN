export interface JobOpening {
  category: string;
  keyword: string;
}

export interface Company {
  id: number;
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
  job_openings?: JobOpening[];
  job_count?: number;
  funding_info?: string | null;
  employee_count?: string | null;
  technologies?: string[];
  twitter?: string;
  facebook?: string;
  instagram?: string;
  github?: string;
  score: number;
  score_color: string;
  logo_url?: string;
}
