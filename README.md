# LEADGEN.ai — Smart Lead Generation Tool online https://smart-lead-new-4p9z.vercel.app/

A modern, animated full-stack web application that scrapes, enriches, and scores leads automatically with beautiful dashboards and analytics. Built with FastAPI (Python) backend and React (Vite) + Framer Motion frontend.

**Made by Thanush**

## Features

### Dashboard (Default View)
- View top 20 pre-loaded companies with enriched data
- Interactive company cards with logos, scores, and key metrics
- Beautiful charts and graphs:
  - Pie chart: B2B vs B2C distribution
  - Bar chart: Growth level trends
  - Score distribution visualization

### Custom Scraper
- Scrape any company URLs on demand
- Real-time scraping with loading animations
- Extract comprehensive data including LinkedIn profiles, B2B/B2C classification, and growth signals

### Analysis Page
- Detailed table view with all company data
- Advanced filtering by company type, growth level, and score
- Interactive statistics dashboard
- CSV export functionality

### Modern UI/UX
- Smooth animations with Framer Motion
- Responsive design for all devices
- Clean, professional interface
- Color-coded scoring system

## Lead Scoring Algorithm

| Factor | Points | Description |
|--------|--------|-------------|
| Email found | 35 pts | Contact email available |
| Phone found | 15 pts | Phone number available |
| Domain age | 20 pts | 5+ years = full points |
| Keywords matched | 20 pts | SaaS, platform, enterprise, etc. |
| Contact page | 10 pts | Dedicated contact page exists |

**Maximum Score**: 100 points

## Tech Stack

### Backend
- Python 3.11+, FastAPI, BeautifulSoup4, python-whois

### Frontend  
- React 18 with TypeScript, Vite, Tailwind CSS, Framer Motion, Recharts

## Setup Instructions

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv/Scripts/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

### Frontend Setup

```bash
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

## How to Use

1. **Dashboard**: View top 20 companies with charts and analytics
2. **Custom Scraper**: Scrape any URLs on demand
3. **Analysis**: Filter and export data with advanced options

## Credits

**Made by Thanush**

## License
