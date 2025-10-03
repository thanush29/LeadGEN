import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import CompanyCard from '../components/CompanyCard';
import Charts from '../components/Charts';
import { Company } from '../types';

const API_URL = import.meta.env.VITE_API_URL;



export default function Dashboard() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRealTime, setIsRealTime] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async (realTime = false) => {
    setLoading(true);
    setError('');
    try {
      const endpoint = realTime ? '/scrape-top-companies' : '/companies';
      const options = realTime ? { method: 'POST' } : {};
      const response = await fetch(`${API_URL}${endpoint}`, options);
      if (!response.ok) throw new Error('Failed to fetch companies');
      const data = await response.json();
      setCompanies(data);
      setIsRealTime(realTime);
    } catch (err) {
      setError('Failed to load companies. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-3">Dashboard Overview</h2>
        <p className="text-lg text-gray-600 mb-4">Top 20 companies with enriched data and comprehensive scoring</p>
        <div className="flex justify-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fetchCompanies(false)}
            disabled={loading}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              !isRealTime ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Sample Data
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fetchCompanies(true)}
            disabled={loading}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              isRealTime ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {loading && isRealTime ? 'Scraping...' : 'Real-Time Scrape'}
          </motion.button>
        </div>
      </motion.div>

      <Charts companies={companies} />

      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Company Leads</h3>
        <p className="text-gray-600">Click on any company to learn more</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {companies.map((company, index) => (
          <CompanyCard key={company.id} company={company} index={index} />
        ))}
      </div>
    </div>
  );
}
