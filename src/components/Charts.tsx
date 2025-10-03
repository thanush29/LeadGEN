import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Company } from '../types';

interface ChartsProps {
  companies: Company[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Charts({ companies }: ChartsProps) {
  const companyTypeData = [
    { name: 'B2B', value: companies.filter(c => c.company_type === 'B2B').length },
    { name: 'B2C', value: companies.filter(c => c.company_type === 'B2C').length },
    { name: 'Unknown', value: companies.filter(c => c.company_type === 'Unknown').length },
  ].filter(d => d.value > 0);

  const growthData = [
    { name: 'High Growth', count: companies.filter(c => c.growth_level === 'High').length },
    { name: 'Medium Growth', count: companies.filter(c => c.growth_level === 'Medium').length },
    { name: 'Low Growth', count: companies.filter(c => c.growth_level === 'Low').length },
  ];

  const scoreDistribution = [
    { range: '90-100', count: companies.filter(c => c.score >= 90).length },
    { range: '80-89', count: companies.filter(c => c.score >= 80 && c.score < 90).length },
    { range: '70-79', count: companies.filter(c => c.score >= 70 && c.score < 80).length },
    { range: '60-69', count: companies.filter(c => c.score >= 60 && c.score < 70).length },
    { range: '0-59', count: companies.filter(c => c.score < 60).length },
  ].filter(d => d.count > 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Company Type Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={companyTypeData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {companyTypeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Growth Level</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={growthData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-15} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Lead Score Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={scoreDistribution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
