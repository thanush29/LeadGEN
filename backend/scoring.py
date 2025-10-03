from typing import Dict, Any

def calculate_score(lead: Dict[str, Any]) -> int:
    """
    Calculate lead score based on multiple factors

    Enhanced Scoring breakdown:
    - Email found: 25 points (multiple emails: +5)
    - Phone found: 10 points (multiple phones: +5)
    - LinkedIn profile: 15 points
    - Domain age: up to 15 points (proportional, max at 5+ years)
    - Keyword match: 10 points
    - Contact page: 5 points
    - Active hiring/careers page: 10 points
    - Technologies detected: 5 points
    - Funding information: 5 points
    - Employee count known: 5 points
    - Social media presence: 5 points

    Max score: 100+ points (capped at 100)
    """
    score = 0

    # Email found (25-30 pts)
    emails = lead.get('emails', [])
    if len(emails) > 0:
        score += 25
        if len(emails) > 1:
            score += 5

    # Phone found (10-15 pts)
    phones = lead.get('phones', [])
    if len(phones) > 0:
        score += 10
        if len(phones) > 1:
            score += 5

    # LinkedIn profile (15 pts)
    if lead.get('linkedin'):
        score += 15

    # Domain age (up to 15 pts)
    domain_age = lead.get('domain_age')
    if domain_age is not None:
        if domain_age >= 5:
            score += 15
        else:
            score += int((domain_age / 5) * 15)

    # Keywords found (10 pts)
    if lead.get('keywords_found') and len(lead['keywords_found']) > 0:
        score += 10

    # Contact page (5 pts)
    if lead.get('has_contact'):
        score += 5

    # Active hiring/careers page (10 pts)
    if lead.get('has_careers_page'):
        score += 10

    # Technologies detected (5 pts)
    if lead.get('technologies') and len(lead['technologies']) > 0:
        score += 5

    # Funding information (5 pts)
    if lead.get('funding_info'):
        score += 5

    # Employee count known (5 pts)
    if lead.get('employee_count'):
        score += 5

    # Social media presence (up to 5 pts)
    social_count = sum(1 for key in ['twitter', 'facebook', 'instagram', 'github']
                      if lead.get(key))
    if social_count > 0:
        score += min(social_count * 2, 5)

    return min(score, 100)

def get_score_color(score: int) -> str:
    """Get color classification for score"""
    if score >= 70:
        return 'high'
    elif score >= 40:
        return 'medium'
    else:
        return 'low'
