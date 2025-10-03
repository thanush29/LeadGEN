import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Filter, Download } from 'lucide-react';
import { Company } from '../types';

const API_URL = import.meta.env.VITE_API_URL;


export default function Analysis() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    companyType: 'All',
    growthLevel: 'All',
    minScore: 0,
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch(`${API_URL}/companies`);
      if (!response.ok) throw new Error('Failed to fetch companies');
      const data = await response.json();
      setCompanies(data);
    } catch (err) {
      setError('Failed to load companies. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter(company => {
    if (filters.companyType !== 'All' && company.company_type !== filters.companyType) return false;
    if (filters.growthLevel !== 'All' && company.growth_level !== filters.growthLevel) return false;
    if (company.score < filters.minScore) return false;
    return true;
  });

  const exportToCSV = () => {
    const headers = ['Domain', 'Type', 'Growth', 'LinkedIn', 'Emails', 'Phones', 'Score', 'Title', 'URL'];
    const rows = filteredCompanies.map(company => [
      company.domain,
      company.company_type,
      company.growth_level,
      company.linkedin,
      company.emails.join('; '),
      company.phones.join('; '),
      company.score.toString(),
      company.title,
      company.url,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leadgen-analysis-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const stats = {
    total: filteredCompanies.length,
    avgScore: Math.round(filteredCompanies.reduce((sum, c) => sum + c.score, 0) / filteredCompanies.length || 0),
    withEmail: filteredCompanies.filter(c => c.emails.length > 0).length,
    withPhone: filteredCompanies.filter(c => c.phones.length > 0).length,
    withLinkedIn: filteredCompanies.filter(c => c.linkedin).length,
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
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">Analysis & Insights</h2>
        <p className="text-lg text-gray-600">Detailed company data with advanced filtering and export</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Leads</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-3xl font-bold text-green-600">{stats.avgScore}</div>
          <div className="text-sm text-gray-600">Avg Score</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-3xl font-bold text-purple-600">{stats.withEmail}</div>
          <div className="text-sm text-gray-600">With Email</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="text-3xl font-bold text-yellow-600">{stats.withPhone}</div>
          <div className="text-sm text-gray-600">With Phone</div>
        </div>
        <div className="bg-pink-50 rounded-lg p-4">
          <div className="text-3xl font-bold text-pink-600">{stats.withLinkedIn}</div>
          <div className="text-sm text-gray-600">With LinkedIn</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} />
          <h3 className="text-lg font-bold text-gray-900">Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Type</label>
            <select
              value={filters.companyType}
              onChange={(e) => setFilters({ ...filters, companyType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option>All</option>
              <option>B2B</option>
              <option>B2C</option>
              <option>Unknown</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Growth Level</label>
            <select
              value={filters.growthLevel}
              onChange={(e) => setFilters({ ...filters, growthLevel: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option>All</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Score: {filters.minScore}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={filters.minScore}
              onChange={(e) => setFilters({ ...filters, minScore: Number(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">
            Company Details ({filteredCompanies.length} results)
          </h3>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Download size={20} />
            Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Growth</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">LinkedIn</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Emails</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phones</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCompanies.map((company, index) => (
                <motion.tr
                  key={company.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a
                      href={company.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {company.domain}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {company.company_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      company.growth_level === 'High' ? 'bg-green-100 text-green-800' :
                      company.growth_level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {company.growth_level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {company.linkedin ? (
                      <a
                        href={company.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm max-w-xs truncate">
                      {company.emails.length > 0 ? company.emails.join(', ') : '—'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {company.phones.length > 0 ? company.phones[0] : '—'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      company.score_color === 'high' ? 'bg-green-100 text-green-800' :
                      company.score_color === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {company.score}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
