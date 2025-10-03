import { Download } from 'lucide-react';
import { LeadResult } from '../api';

interface LeadTableProps {
  leads: LeadResult[];
  minScore: number;
}

export default function LeadTable({ leads, minScore }: LeadTableProps) {
  const filteredLeads = leads.filter(lead => lead.score >= minScore);

  const getScoreColorClass = (scoreColor: string) => {
    switch (scoreColor) {
      case 'high':
        return 'bg-green-100 text-green-800 font-semibold';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 font-semibold';
      case 'low':
        return 'bg-red-100 text-red-800 font-semibold';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const exportToCSV = () => {
    const headers = ['Domain', 'Email(s)', 'Phone(s)', 'Domain Age', 'Keywords', 'Contact Page', 'Score', 'Title', 'URL'];
    const rows = filteredLeads.map(lead => [
      lead.domain,
      lead.emails.join('; '),
      lead.phones.join('; '),
      lead.domain_age?.toString() || 'N/A',
      lead.keywords_found.join('; '),
      lead.has_contact ? 'Yes' : 'No',
      lead.score.toString(),
      lead.title,
      lead.url,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (leads.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Results ({filteredLeads.length} leads)
        </h2>
        <button
          onClick={exportToCSV}
          disabled={filteredLeads.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <Download size={20} />
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Domain
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email(s)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone(s)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Domain Age
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Keywords
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeads.map((lead, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <a
                        href={lead.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        {lead.domain}
                      </a>
                      {lead.error && (
                        <span className="text-xs text-red-500 mt-1">Error: {lead.error}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {lead.emails.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {lead.emails.map((email, i) => (
                            <span key={i} className="break-all">{email}</span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {lead.phones.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {lead.phones.map((phone, i) => (
                            <span key={i}>{phone}</span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {lead.domain_age !== null ? (
                      <span>{lead.domain_age} years</span>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {lead.keywords_found.length > 0 ? (
                        lead.keywords_found.map((keyword, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {keyword}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-sm leading-5 rounded-full ${getScoreColorClass(lead.score_color)}`}>
                      {lead.score}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
