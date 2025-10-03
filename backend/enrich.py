import whois
from datetime import datetime
from typing import Optional, List

SAAS_KEYWORDS = [
    'saas', 'software', 'platform', 'enterprise', 'cloud', 'api',
    'solution', 'service', 'analytics', 'automation', 'crm', 'erp'
]

def get_domain_age(domain: str) -> Optional[int]:
    """Get domain age in years using WHOIS"""
    try:
        w = whois.whois(domain)
        creation_date = w.creation_date

        if isinstance(creation_date, list):
            creation_date = creation_date[0]

        if creation_date:
            if isinstance(creation_date, datetime):
                age = (datetime.now() - creation_date).days / 365.25
                return int(age)
    except Exception:
        pass

    return None

def find_keywords(title: str, meta: str) -> List[str]:
    """Find SaaS-related keywords in title and meta description"""
    text = (title + ' ' + meta).lower()
    found = []

    for keyword in SAAS_KEYWORDS:
        if keyword in text:
            found.append(keyword)

    return found
