from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import pandas as pd

from scraper import scrape_url
from enrich import get_domain_age, find_keywords
from scoring import calculate_score, get_score_color
from sample_data import SAMPLE_COMPANIES
from top_companies import TOP_20_URLS

app = FastAPI(title="LEADGEN.ai API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ScrapeRequest(BaseModel):
    urls: List[str]

class LeadResult(BaseModel):
    url: str
    domain: str
    title: str
    meta: str
    emails: List[str]
    phones: List[str]
    domain_age: int | None
    keywords_found: List[str]
    has_contact: bool
    linkedin: str
    company_type: str
    growth_level: str
    has_careers_page: bool
    score: int
    score_color: str
    error: str | None

@app.get("/")
def read_root():
    return {"message": "LEADGEN.ai API - Smart Lead Generation Tool"}

@app.post("/scrape", response_model=List[LeadResult])
async def scrape_leads(request: ScrapeRequest):
    """
    Scrape URLs, enrich data, and score leads
    """
    if not request.urls:
        raise HTTPException(status_code=400, detail="No URLs provided")

    results = []
    seen_domains = set()

    for url in request.urls:
        url = url.strip()
        if not url:
            continue

        # Scrape
        lead = scrape_url(url)

        # Deduplicate by domain
        if lead['domain'] in seen_domains:
            continue
        seen_domains.add(lead['domain'])

        # Enrich
        if not lead['error']:
            lead['domain_age'] = get_domain_age(lead['domain'])
            lead['keywords_found'] = find_keywords(lead['title'], lead['meta'])
        else:
            lead['domain_age'] = None
            lead['keywords_found'] = []
            if 'linkedin' not in lead:
                lead['linkedin'] = ''
            if 'company_type' not in lead:
                lead['company_type'] = 'Unknown'
            if 'growth_level' not in lead:
                lead['growth_level'] = 'Low'
            if 'has_careers_page' not in lead:
                lead['has_careers_page'] = False

        # Score
        lead['score'] = calculate_score(lead)
        lead['score_color'] = get_score_color(lead['score'])

        results.append(lead)

    # Sort by score (highest first)
    results.sort(key=lambda x: x['score'], reverse=True)

    return results

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/companies")
def get_companies():
    """
    Get sample companies data for dashboard
    """
    return SAMPLE_COMPANIES

@app.post("/scrape-top-companies")
async def scrape_top_companies():
    """
    Scrape top 20 companies with real-time data
    """
    results = []
    seen_domains = set()

    for url in TOP_20_URLS:
        # Scrape
        lead = scrape_url(url)

        # Deduplicate by domain
        if lead['domain'] in seen_domains:
            continue
        seen_domains.add(lead['domain'])

        # Enrich
        if not lead['error']:
            lead['domain_age'] = get_domain_age(lead['domain'])
            lead['keywords_found'] = find_keywords(lead['title'], lead['meta'])
        else:
            lead['domain_age'] = None
            lead['keywords_found'] = []

        # Score
        lead['score'] = calculate_score(lead)
        lead['score_color'] = get_score_color(lead['score'])

        # Add ID
        lead['id'] = len(results) + 1

        results.append(lead)

    # Sort by score (highest first)
    results.sort(key=lambda x: x['score'], reverse=True)

    return results
