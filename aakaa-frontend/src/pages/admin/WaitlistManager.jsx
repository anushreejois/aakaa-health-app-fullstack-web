import React, { useState, useMemo, useEffect } from 'react';
import { Mail, MessageSquare, Calendar, Download, Search, Filter, Trash2, CheckCircle, ChevronDown } from 'lucide-react';
import { exportToCSV } from '../../utils/csvUtils';

import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

import { API_BASE_URL } from '../../config';

const API_BASE = `${API_BASE_URL}/api/waitlist`;

const WaitlistManager = () => {
  const [waitlist, setWaitlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [concernFilter, setConcernFilter] = useState('All');
  const [notification, setNotification] = useState(null);
  const { token } = useAuth();

  const fetchWaitlist = async () => {
    try {
      const response = await fetch(API_BASE, {
        headers: { 'x-auth-token': token }
      });
      const data = await response.json();
      setWaitlist(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching waitlist:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaitlist();
  }, []);

  const concerns = useMemo(() => {
    return ['All', ...new Set(waitlist.map(item => item.concern))];
  }, [waitlist]);

  const handleExport = () => {
    exportToCSV(waitlist, 'waitlist_entries.csv');
  };

  const handleApprove = async (id, name) => {
    try {
      const response = await fetch(`${API_BASE}/${id}`, { 
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      if (response.ok) {
        setWaitlist(prev => prev.filter(item => item._id !== id));
        showNotification(`Successfully approved ${name}!`);
      }
    } catch (error) {
      console.error("Error approving access:", error);
    }
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredWaitlist = useMemo(() => {
    return waitlist.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = concernFilter === 'All' || item.concern === concernFilter;
      return matchesSearch && matchesFilter;
    });
  }, [waitlist, searchQuery, concernFilter]);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-aakaa-green tracking-tight">Waitlist Manager</h1>
          <p className="text-aakaa-gold text-sm font-medium mt-1">Review and approve incoming platform access requests.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 bg-white text-aakaa-green border border-aakaa-green/10 px-5 py-2.5 rounded-2xl text-sm font-bold hover:bg-aakaa-green hover:text-white transition-all shadow-sm"
          >
            <Download size={16} />
            <span className="hidden md:inline">Export CSV</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-24 right-8 bg-aakaa-green text-white px-8 py-4 rounded-[1.5rem] shadow-2xl z-50 flex items-center gap-3 font-bold text-sm border border-white/10"
          >
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <CheckCircle size={18} />
            </div>
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-aakaa-gold group-focus-within:text-aakaa-green transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white border border-aakaa-green/5 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-aakaa-green/5 focus:border-aakaa-green/20 transition-all premium-shadow"
          />
        </div>
        <div className="relative min-w-[240px]">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-aakaa-gold" size={18} />
          <select
            value={concernFilter}
            onChange={(e) => setConcernFilter(e.target.value)}
            className="w-full pl-12 pr-10 py-4 bg-white border border-aakaa-green/5 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-aakaa-green/5 appearance-none transition-all cursor-pointer text-aakaa-green font-bold premium-shadow"
          >
            {concerns.map(c => <option key={c} value={c}>{c === 'All' ? 'All Primary Concerns' : c}</option>)}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-aakaa-gold pointer-events-none" size={16} />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-aakaa-green/5 premium-shadow overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-aakaa-green border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-aakaa-gold font-bold">Retrieving Waitlist...</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-aakaa-cream/20 text-aakaa-gold text-[10px] uppercase tracking-[0.2em] font-black">
                  <th className="px-8 py-6">User Identity</th>
                  <th className="px-8 py-6">Contact Info</th>
                  <th className="px-8 py-6">Primary Focus</th>
                  <th className="px-8 py-6">Requested On</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-aakaa-green/5">
                <AnimatePresence mode="popLayout">
                  {Array.isArray(waitlist) && filteredWaitlist.length > 0 ? (
                    filteredWaitlist.map((entry) => (
                      <motion.tr 
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: -20 }}
                        key={entry._id} 
                        className="hover:bg-aakaa-cream/10 transition-colors group"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-aakaa-green/5 flex items-center justify-center text-aakaa-green font-bold text-xs">
                              {entry.name.charAt(0)}
                            </div>
                            <span className="text-sm font-bold text-aakaa-green">{entry.name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-sm text-aakaa-gold font-medium">
                          <div className="flex items-center gap-2">
                            <Mail size={14} className="opacity-40" />
                            {entry.email}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="px-4 py-1.5 bg-aakaa-green/5 text-aakaa-green rounded-full text-[10px] font-black uppercase tracking-wider border border-aakaa-green/10">
                            {entry.concern}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-sm text-aakaa-gold font-medium">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="opacity-40" />
                            {new Date(entry.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              className="p-2.5 text-aakaa-gold hover:text-aakaa-green hover:bg-aakaa-green/5 rounded-xl transition-all" 
                              title="Message User"
                              onClick={() => showNotification(`Secure messenger for ${entry.name} coming soon!`)}
                            >
                              <MessageSquare size={18} />
                            </button>
                            <button 
                              onClick={() => handleApprove(entry._id, entry.name)}
                              className="bg-aakaa-green text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-aakaa-green/90 hover:scale-105 active:scale-95 transition-all shadow-md shadow-aakaa-green/10"
                            >
                              Approve Access
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <td colSpan="5" className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <Search size={40} className="text-aakaa-gold/20" />
                          <p className="text-aakaa-gold font-bold">No results match your search criteria.</p>
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
};

export default WaitlistManager;
