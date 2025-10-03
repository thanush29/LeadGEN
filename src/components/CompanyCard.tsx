import { motion } from 'framer-motion';
import { Building2, Mail, Phone, TrendingUp, Linkedin, Briefcase, DollarSign, Users, Code } from 'lucide-react';
import { Company } from '../types';

interface CompanyCardProps {
  company: Company;
  index: number;
}

export default function CompanyCard({ company, index }: CompanyCardProps) {
  const getScoreColorClass = (scoreColor: string) => {
    switch (scoreColor) {
      case 'high':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] p-6 relative overflow-hidden"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 ${getScoreColorClass(company.score_color)} opacity-10 rounded-bl-full`} />

      <div className="flex items-start gap-4">
        {company.logo_url && (
          <img
            src={company.logo_url}
            alt={company.title}
            className="w-16 h-16 rounded-lg object-cover"
          />
        )}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{company.domain}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{company.meta || company.title}</p>

          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getScoreColorClass(company.score_color)} text-white`}>
              Score: {company.score}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {company.company_type}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              {company.growth_level} Growth
            </span>
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-gray-600">
            {company.emails.length > 0 && (
              <motion.div whileHover={{ scale: 1.1 }} className="flex items-center gap-1">
                <Mail size={14} />
                <span>{company.emails.length}</span>
              </motion.div>
            )}
            {company.phones.length > 0 && (
              <motion.div whileHover={{ scale: 1.1 }} className="flex items-center gap-1">
                <Phone size={14} />
                <span>{company.phones.length}</span>
              </motion.div>
            )}
            {company.linkedin && (
              <motion.div whileHover={{ scale: 1.1 }} className="flex items-center gap-1 text-blue-600">
                <Linkedin size={14} />
              </motion.div>
            )}
            {company.has_careers_page && (
              <motion.div whileHover={{ scale: 1.1 }} className="flex items-center gap-1 text-green-600">
                <TrendingUp size={14} />
                <span>Hiring</span>
              </motion.div>
            )}
            {company.job_count && company.job_count > 0 && (
              <motion.div whileHover={{ scale: 1.1 }} className="flex items-center gap-1 text-emerald-600">
                <Briefcase size={14} />
                <span>{company.job_count} jobs</span>
              </motion.div>
            )}
            {company.funding_info && (
              <motion.div whileHover={{ scale: 1.1 }} className="flex items-center gap-1 text-amber-600">
                <DollarSign size={14} />
                <span>Funded</span>
              </motion.div>
            )}
            {company.employee_count && (
              <motion.div whileHover={{ scale: 1.1 }} className="flex items-center gap-1 text-violet-600">
                <Users size={14} />
                <span>{company.employee_count}</span>
              </motion.div>
            )}
            {company.technologies && company.technologies.length > 0 && (
              <motion.div whileHover={{ scale: 1.1 }} className="flex items-center gap-1 text-cyan-600">
                <Code size={14} />
                <span>{company.technologies.length} techs</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
