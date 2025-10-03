import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import { Company } from '../types';
import LeadTable from '../components/LeadTable';

const API_URL = import.meta.env.VITE_API_URL;



export default function Scraper() {
  const [urls, setUrls] = useState('');
  const [leads, setLeads] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleScrape = async () => {
    const urlList = urls.split('\n').filter(url => url.trim());

    if (urlList.length === 0) {
      setError('Please enter at least one URL');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/scrape`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ urls: urlList }),
      });

      if (!response.ok) throw new Error('Failed to scrape leads');

      const results = await response.json();
      setLeads(results);
    } catch (err) {
      setError('Failed to scrape leads. Make sure the backend is running on http://localhost:8000');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">Custom Lead Scraper</h2>
        <p className="text-lg text-gray-600">Enter company URLs to scrape and analyze in real-time</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-lg p-6 mb-6"
      >
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter URLs (one per line)
        </label>
        <textarea
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          placeholder="https://example.com&#10;https://another-company.com&#10;https://startup.io"
          className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          disabled={loading}
        />

        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleScrape}
          disabled={loading}
          className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 font-medium text-lg hover:scale-[1.02]"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={24} />
              Scraping Leads...
            </>
          ) : (
            <>
              <Search size={24} />
              Scrape Leads
            </>
          )}
        </button>
      </motion.div>

      {leads.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <LeadTable leads={leads} minScore={0} />
        </motion.div>
      )}
    </div>
  );
}
