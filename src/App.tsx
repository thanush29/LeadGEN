import { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Search, BarChart3 } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Scraper from './pages/Scraper';
import Analysis from './pages/Analysis';
import Footer from './components/Footer';

type Page = 'dashboard' | 'scraper' | 'analysis';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const navItems = [
    { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'scraper' as Page, label: 'Custom Scraper', icon: Search },
    { id: 'analysis' as Page, label: 'Analysis', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-slate-50 to-cyan-50">
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                LEADGEN.ai
              </h1>
            </motion.div>

            <nav className="flex gap-2">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setCurrentPage(item.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="hidden md:inline">{item.label}</span>
                  </motion.button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'scraper' && <Scraper />}
        {currentPage === 'analysis' && <Analysis />}
      </main>

      <Footer />
    </div>
  );
}

export default App;
