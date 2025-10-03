import re
import requests
from bs4 import BeautifulSoup
from typing import List, Dict, Any, Optional
import tldextract
import json

def extract_emails(text: str) -> List[str]:
    """Extract email addresses from text"""
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    emails = re.findall(email_pattern, text)
    return list(set(emails))

def extract_phones(text: str) -> List[str]:
    """Extract phone numbers from text"""
    phone_patterns = [
        r'\+?\d{1,3}?[-.\s]?\(?\d{1,4}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}',
        r'\(\d{3}\)\s*\d{3}[-.\s]?\d{4}',
        r'\d{3}[-.\s]?\d{3}[-.\s]?\d{4}'
    ]
    phones = []
    for pattern in phone_patterns:
        phones.extend(re.findall(pattern, text))
    return list(set([p.strip() for p in phones if len(p.replace('-', '').replace('.', '').replace(' ', '').replace('(', '').replace(')', '')) >= 10]))

def has_contact_page(html: str) -> bool:
    """Check if the page has a contact link"""
    soup = BeautifulSoup(html, 'html.parser')
    links = soup.find_all('a', href=True)
    contact_keywords = ['contact', 'contact-us', 'get-in-touch', 'reach-us']

    for link in links:
        href = link.get('href', '').lower()
        text = link.get_text().lower()
        if any(keyword in href or keyword in text for keyword in contact_keywords):
            return True
    return False

def find_linkedin_profile(html: str, soup: BeautifulSoup) -> str:
    """Extract LinkedIn profile URL if available"""
    links = soup.find_all('a', href=True)
    for link in links:
        href = link.get('href', '')
        if 'linkedin.com/company' in href:
            return href
    return ''

def detect_company_type(title: str, meta: str, html: str) -> str:
    """Heuristic to determine if company is B2B or B2C"""
    text = (title + ' ' + meta).lower()

    b2b_keywords = ['enterprise', 'business', 'b2b', 'saas', 'platform', 'api', 'solution', 'professional', 'workflow', 'automation', 'erp', 'crm']
    b2c_keywords = ['consumer', 'shop', 'store', 'retail', 'buy', 'b2c', 'personal', 'individual', 'ecommerce', 'marketplace']

    b2b_score = sum(1 for kw in b2b_keywords if kw in text)
    b2c_score = sum(1 for kw in b2c_keywords if kw in text)

    if b2b_score > b2c_score:
        return 'B2B'
    elif b2c_score > b2b_score:
        return 'B2C'
    else:
        return 'Unknown'

def extract_job_openings(html: str, soup: BeautifulSoup) -> List[Dict[str, str]]:
    """Extract job openings information"""
    jobs = []
    text = html.lower()

    job_keywords = {
        'engineer': ['engineer', 'developer', 'programmer'],
        'designer': ['designer', 'ui', 'ux'],
        'marketing': ['marketing', 'growth', 'seo'],
        'sales': ['sales', 'business development', 'account'],
        'product': ['product manager', 'product owner'],
        'data': ['data scientist', 'analyst', 'ml engineer']
    }

    for category, keywords in job_keywords.items():
        for keyword in keywords:
            if keyword in text:
                jobs.append({'category': category, 'keyword': keyword})
                break

    return jobs

def extract_funding_info(text: str) -> Optional[str]:
    """Extract funding information"""
    funding_patterns = [
        r'\$\d+[MBK]? (raised|funding|investment)',
        r'(series [A-D]|seed round|pre-seed)',
        r'(funded by|backed by|investors include)'
    ]

    for pattern in funding_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            start = max(0, match.start() - 50)
            end = min(len(text), match.end() + 50)
            return text[start:end].strip()

    return None

def extract_employee_count(text: str) -> Optional[str]:
    """Extract employee count information"""
    patterns = [
        r'(\d+[\+]?)\s*(employees|people|team members)',
        r'team of (\d+[\+]?)',
        r'(\d+-\d+) employees'
    ]

    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return match.group(0)

    size_indicators = {
        '1-10': ['startup', 'small team'],
        '11-50': ['growing team', 'medium team'],
        '51-200': ['established company'],
        '200+': ['enterprise', 'large company', '500+', '1000+']
    }

    for size, indicators in size_indicators.items():
        if any(indicator in text.lower() for indicator in indicators):
            return size

    return None

def extract_technologies(html: str, soup: BeautifulSoup) -> List[str]:
    """Extract technologies and tools used"""
    tech_stack = []
    text = html.lower()

    technologies = {
        'languages': ['python', 'javascript', 'typescript', 'java', 'go', 'rust', 'ruby', 'php'],
        'frameworks': ['react', 'vue', 'angular', 'django', 'flask', 'rails', 'laravel', 'node.js', 'next.js'],
        'cloud': ['aws', 'azure', 'gcp', 'google cloud', 'kubernetes', 'docker'],
        'databases': ['postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch'],
        'tools': ['github', 'gitlab', 'jira', 'slack', 'figma', 'stripe', 'supabase']
    }

    for category, techs in technologies.items():
        for tech in techs:
            if tech in text:
                tech_stack.append(tech)

    return list(set(tech_stack))[:10]

def find_social_media(html: str, soup: BeautifulSoup) -> Dict[str, str]:
    """Find social media profiles"""
    social = {'twitter': '', 'facebook': '', 'instagram': '', 'github': ''}

    links = soup.find_all('a', href=True)
    for link in links:
        href = link.get('href', '')
        if 'twitter.com' in href or 'x.com' in href:
            social['twitter'] = href
        elif 'facebook.com' in href:
            social['facebook'] = href
        elif 'instagram.com' in href:
            social['instagram'] = href
        elif 'github.com' in href:
            social['github'] = href

    return social

def detect_growth_signals(html: str, soup: BeautifulSoup) -> Dict[str, Any]:
    """Detect company growth signals"""
    text = html.lower()

    has_careers_page = any(keyword in text for keyword in ['careers', 'jobs', 'join our team', 'we are hiring', 'work with us', 'open positions'])

    growth_keywords = ['growing', 'expanding', 'hiring', 'funded', 'series', 'raised', 'investment', 'acquired', 'ipo']
    has_growth_keywords = any(keyword in text for keyword in growth_keywords)

    employee_indicators = ['team of', 'employees', 'staff members', '100+', '500+', '1000+']
    has_employee_info = any(indicator in text for indicator in employee_indicators)

    job_count = len(extract_job_openings(html, soup))

    growth_level = 'Low'
    if has_careers_page and has_growth_keywords and job_count >= 3:
        growth_level = 'High'
    elif (has_careers_page and job_count >= 2) or (has_growth_keywords and has_employee_info):
        growth_level = 'Medium'
    elif has_careers_page or has_growth_keywords:
        growth_level = 'Medium'

    return {
        'has_careers_page': has_careers_page,
        'has_growth_keywords': has_growth_keywords,
        'has_employee_info': has_employee_info,
        'growth_level': growth_level,
        'job_count': job_count
    }

def scrape_url(url: str) -> Dict[str, Any]:
    """Scrape a single URL and extract relevant information"""
    try:
        if not url.startswith('http'):
            url = 'https://' + url

        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }

        response = requests.get(url, headers=headers, timeout=10, allow_redirects=True)
        response.raise_for_status()

        html = response.text
        soup = BeautifulSoup(html, 'html.parser')

        # Extract domain
        extracted = tldextract.extract(url)
        domain = f"{extracted.domain}.{extracted.suffix}"

        # Extract title
        title_tag = soup.find('title')
        title = title_tag.get_text().strip() if title_tag else ''

        # Extract meta description
        meta_desc = ''
        meta_tag = soup.find('meta', attrs={'name': 'description'}) or soup.find('meta', attrs={'property': 'og:description'})
        if meta_tag:
            meta_desc = meta_tag.get('content', '').strip()

        # Extract emails and phones
        page_text = soup.get_text()
        emails = extract_emails(page_text)
        phones = extract_phones(page_text)

        # Check for contact page
        has_contact = has_contact_page(html)

        # Find LinkedIn profile
        linkedin = find_linkedin_profile(html, soup)

        # Detect company type
        company_type = detect_company_type(title, meta_desc, html)

        # Detect growth signals
        growth = detect_growth_signals(html, soup)

        # Extract additional data
        job_openings = extract_job_openings(html, soup)
        funding_info = extract_funding_info(page_text)
        employee_count = extract_employee_count(page_text)
        technologies = extract_technologies(html, soup)
        social_media = find_social_media(html, soup)

        return {
            'url': url,
            'domain': domain,
            'title': title,
            'meta': meta_desc,
            'emails': emails,
            'phones': phones,
            'has_contact': has_contact,
            'linkedin': linkedin,
            'company_type': company_type,
            'growth_level': growth['growth_level'],
            'has_careers_page': growth['has_careers_page'],
            'job_openings': job_openings,
            'job_count': growth['job_count'],
            'funding_info': funding_info,
            'employee_count': employee_count,
            'technologies': technologies,
            'twitter': social_media['twitter'],
            'facebook': social_media['facebook'],
            'instagram': social_media['instagram'],
            'github': social_media['github'],
            'error': None
        }

    except Exception as e:
        extracted = tldextract.extract(url)
        domain = f"{extracted.domain}.{extracted.suffix}"
        return {
            'url': url,
            'domain': domain,
            'title': '',
            'meta': '',
            'emails': [],
            'phones': [],
            'has_contact': False,
            'linkedin': '',
            'company_type': 'Unknown',
            'growth_level': 'Low',
            'has_careers_page': False,
            'job_openings': [],
            'job_count': 0,
            'funding_info': None,
            'employee_count': None,
            'technologies': [],
            'twitter': '',
            'facebook': '',
            'instagram': '',
            'github': '',
            'error': str(e)
        }
