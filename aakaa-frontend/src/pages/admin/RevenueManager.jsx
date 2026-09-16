import React, { useState, useEffect } from 'react';
import { TrendingUp, ShoppingBag, Download, Landmark, CreditCard, Sparkles } from 'lucide-react';
import { exportToCSV } from '../../utils/csvUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

import { API_BASE_URL } from '../../config';

const API_BASE = `${API_BASE_URL}/api/bookings/stats`;

const RevenueManager = () => {
  const [mode, setMode] = useState('app'); // 'app' or 'website'
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState(null);
  const [isChanging, setIsChanging] = useState(false);
  const { token } = useAuth();

  const fetchStats = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      const response = await fetch(API_BASE, {
        headers: { 'x-auth-token': token }
      });
      const data = await response.json();
      setStatsData(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchStats(true);
      const interval = setInterval(() => fetchStats(false), 10000);
      return () => clearInterval(interval);
    }
  }, [token]);

  const handleModeChange = (newMode) => {
    setIsChanging(true);
    setMode(newMode);
    setTimeout(() => setIsChanging(false), 300);
  };

  const handleExport = () => {
    if (statsData && statsData[mode]) {
      exportToCSV(statsData[mode].transactions, `${mode}_revenue_report.csv`);
    }
  };

  const currentModeData = statsData ? statsData[mode] : null;

  const stats = currentModeData ? [
    { 
      label: `${mode === 'app' ? 'App' : 'Website'} Gross Revenue`, 
      value: `₹${currentModeData.revenue.toLocaleString()}`, 
      change: currentModeData.revenueChange, 
      icon: ShoppingBag, 
      color: 'text-emerald-600', 
      bgColor: 'bg-emerald-50' 
    },
    { 
      label: `${mode === 'app' ? 'Consultation Sessions' : 'Website Bookings'}`, 
      value: `${currentModeData.growth}`, 
      change: currentModeData.growthChange, 
      icon: TrendingUp, 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-50' 
    },
  ] : [];

  return (
    <div className="space-y-8 pb-12">
      {/* Header section with Toggles */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-aakaa-green tracking-tight">Revenue Dashboard</h1>
          <p className="text-aakaa-gold text-sm font-medium mt-1">
            Compare and analyze financial logs from both the patient website and therapist app ecosystem.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          {/* App / Website Mode Selector */}
          <div className="bg-white/80 backdrop-blur-sm border border-aakaa-green/5 rounded-2xl p-1.5 flex gap-1 shadow-sm premium-shadow">
            <button
              onClick={() => handleModeChange('app')}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                mode === 'app' 
                  ? 'bg-aakaa-green text-white shadow-lg shadow-aakaa-green/20' 
                  : 'text-aakaa-gold hover:text-aakaa-green hover:bg-aakaa-green/5'
              }`}
            >
              <Sparkles size={14} />
              App Revenues
            </button>
            <button
              onClick={() => handleModeChange('website')}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                mode === 'website' 
                  ? 'bg-aakaa-green text-white shadow-lg shadow-aakaa-green/20' 
                  : 'text-aakaa-gold hover:text-aakaa-green hover:bg-aakaa-green/5'
              }`}
            >
              <Landmark size={14} />
              Website Revenues
            </button>
          </div>

          <button 
            onClick={handleExport}
            className="flex items-center gap-2 bg-white text-aakaa-green border border-aakaa-green/10 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-aakaa-green hover:text-white transition-all shadow-sm"
          >
            <Download size={15} />
            <span>Export {mode === 'app' ? 'App' : 'Web'} Ledger</span>
          </button>
        </div>
      </div>

      {/* Stats Cards Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 py-20 text-center bg-white rounded-[2.5rem] premium-shadow border border-aakaa-green/5">
            <div className="animate-spin w-8 h-8 border-4 border-aakaa-green border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-aakaa-gold font-bold">Calculating Financial Metrics...</p>
          </div>
        ) : (
          stats.map((stat, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={i} 
              className={`bg-white p-8 rounded-[2.5rem] border border-aakaa-green/5 premium-shadow hover:scale-[1.01] transition-all duration-300 ${
                isChanging ? 'opacity-50 scale-[0.98]' : 'opacity-100'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className={`p-5 rounded-[1.5rem] ${stat.bgColor} ${stat.color} shadow-sm`}>
                  <stat.icon size={28} />
                </div>
                <div className={`text-[10px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-widest ${
                  stat.change.startsWith('+') ? 'text-green-600 bg-green-50 border border-green-100' : 'text-red-600 bg-red-50 border border-red-100'
                }`}>
                  {stat.change} (m-o-m)
                </div>
              </div>
              <div className="mt-8">
                <p className="text-aakaa-gold text-xs font-black uppercase tracking-[0.2em]">{stat.label}</p>
                <h3 className="text-4xl font-black text-aakaa-green mt-2 tabular-nums tracking-tight">
                  {stat.value}
                </h3>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Dynamic Ledger History Table */}
      <div className="bg-white rounded-[2.5rem] border border-aakaa-green/5 premium-shadow overflow-hidden">
        <div className="p-8 border-b border-aakaa-green/5 bg-aakaa-cream/5 flex items-center justify-between">
          <h3 className="font-bold text-xl text-aakaa-green">
            {mode === 'app' ? 'Caregiver Consultation Ledger' : 'Website Booking Ledger'}
          </h3>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-aakaa-gold">
            <CreditCard size={12} className="text-green-500 animate-pulse" />
            <span>Audited Logs</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
             <div className="py-20 text-center">
                <p className="text-aakaa-gold font-bold">Synchronizing financial records...</p>
             </div>
          ) : currentModeData && currentModeData.transactions.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-aakaa-cream/25 text-aakaa-gold text-[10px] uppercase tracking-[0.2em] font-black border-b border-aakaa-green/5">
                  <th className="px-8 py-5">Reference ID</th>
                  <th className="px-8 py-5">Beneficiary/Client</th>
                  {mode === 'app' && <th className="px-8 py-5">Assigned Caregiver</th>}
                  <th className="px-8 py-5">Gross Amount</th>
                  <th className="px-8 py-5">Payment Status</th>
                  <th className="px-8 py-5">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-aakaa-green/5">
                {currentModeData.transactions.map((txn) => (
                  <tr key={txn._id} className="hover:bg-aakaa-cream/10 transition-colors group">
                    <td className="px-8 py-5 text-[11px] font-black text-aakaa-gold/60 font-mono tracking-tighter">
                      #{txn._id.toString().substring(0, 8).toUpperCase()}
                    </td>
                    <td className="px-8 py-5">
                      <div className="font-bold text-sm text-aakaa-green">{txn.userName}</div>
                      <div className="text-[10px] text-aakaa-gold font-semibold">{txn.userEmail}</div>
                    </td>
                    {mode === 'app' && (
                      <td className="px-8 py-5 text-sm font-bold text-aakaa-green">
                        {txn.therapistName || 'Caregiver'}
                      </td>
                    )}
                    <td className="px-8 py-5 text-sm font-black text-aakaa-green">
                      ₹{txn.amount.toLocaleString()}
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        txn.status === 'confirmed' ? 'bg-green-50 text-green-600 border-green-100' :
                        txn.status === 'rescheduled' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                        'bg-red-50 text-red-600 border-red-100'
                      }`}>
                        {txn.status === 'confirmed' ? 'settled' : txn.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-xs font-bold text-aakaa-gold/60">
                      {new Date(txn.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-20 text-center">
              <p className="text-aakaa-gold font-black">No transaction records found for this section.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RevenueManager;
