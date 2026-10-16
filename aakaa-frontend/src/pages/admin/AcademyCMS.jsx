import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen, Users, Clock, Calendar, CheckCircle, GraduationCap, X, Mail, Phone, MessageSquare, Search, Filter, Download, Trash2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config';
import { exportToCSV } from '../../utils/csvUtils';

const AcademyCMS = () => {
  const [activeSubTab, setActiveSubTab] = useState('programs');
  const [waitlist, setWaitlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgramFilter, setSelectedProgramFilter] = useState('All');
  const [notification, setNotification] = useState(null);
  const { token } = useAuth();

  const programList = [
    { id: 1, title: 'Mentorship Program', type: 'Intensive', capacity: 20, status: 'Coming Soon' },
    { id: 2, title: 'Self-Paced Courses', type: 'Flexible', capacity: 'Unlimited', status: 'Coming Soon' },
    { id: 3, title: 'Interactive Workshops', type: 'Live', capacity: 50, status: 'Coming Soon' },
    { id: 4, title: 'Expert Webinars', type: 'Digital', capacity: 500, status: 'Coming Soon' },
    { id: 5, title: 'Psychology Career Guidance', type: 'Professional', capacity: 15, status: 'Coming Soon' },
  ];

  const fetchWaitlist = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/waitlist`, {
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        const data = await res.json();
        setWaitlist(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error fetching waitlist in Academy CMS:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchWaitlist();
    }
  }, [token]);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Filter all entries specifically for Academy
  const academyEntries = useMemo(() => {
    return waitlist.filter((item) => {
      const concern = (item.concern || '').toLowerCase();
      return concern.includes('academy') || programList.some(p => concern.includes(p.title.toLowerCase()));
    });
  }, [waitlist]);

  // Program signup counts
  const programsWithCounts = useMemo(() => {
    return programList.map((p) => {
      const count = waitlist.filter((w) => {
        const c = (w.concern || '').toLowerCase();
        return c.includes(p.title.toLowerCase());
      }).length;
      return { ...p, students: count };
    });
  }, [waitlist]);

  // Filtered entries for the table
  const filteredWaitlist = useMemo(() => {
    return academyEntries.filter((item) => {
      const nameMatch = (item.name || '').toLowerCase().includes(searchQuery.toLowerCase());
      const emailMatch = (item.email || '').toLowerCase().includes(searchQuery.toLowerCase());
      const phoneMatch = (item.phone || '').toLowerCase().includes(searchQuery.toLowerCase());
      const programMatch = selectedProgramFilter === 'All' || (item.concern || '').toLowerCase().includes(selectedProgramFilter.toLowerCase());
      return (nameMatch || emailMatch || phoneMatch) && programMatch;
    });
  }, [academyEntries, searchQuery, selectedProgramFilter]);

  const handleExport = () => {
    exportToCSV(academyEntries, 'academy_waitlist_signups.csv');
  };

  const handleRemove = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from the Academy waitlist?`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/waitlist/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        setWaitlist(prev => prev.filter(w => w._id !== id));
        showNotification(`Removed ${name} from waitlist.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleContactWhatsApp = (item) => {
    const phone = (item.phone || '').replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Hi ${item.name}! Reaching out from AakaA Academy regarding your interest in our programs (${item.concern}). ` +
      `We'd love to share upcoming cohort details and reserve your priority seat!`
    );
    if (phone) {
      window.open(`https://wa.me/${phone.startsWith('91') ? phone : '91' + phone}?text=${text}`, '_blank');
    } else {
      window.open(`https://wa.me/918075009937?text=${text}`, '_blank');
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-aakaa-green tracking-tight font-josefin">Aakaa Academy CMS</h1>
          <p className="text-aakaa-gold text-sm font-bold mt-1 uppercase tracking-widest">
            Manage Programs & Real-Time Waitlist Signups
          </p>
        </div>

        {activeSubTab === 'waitlist' && (
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-white text-aakaa-green border border-aakaa-green/10 px-5 py-2.5 rounded-2xl text-sm font-bold hover:bg-aakaa-green hover:text-white transition-all shadow-sm w-fit"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        )}
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

      {/* Sub Tabs */}
      <div className="flex gap-4 border-b border-aakaa-green/10 mb-8">
        <button
          onClick={() => setActiveSubTab('programs')}
          className={`pb-4 px-2 text-sm font-bold transition-all relative flex items-center gap-2 ${
            activeSubTab === 'programs' ? 'text-aakaa-green' : 'text-gray-400 hover:text-aakaa-gold'
          }`}
        >
          <span>Active Programs</span>
          {activeSubTab === 'programs' && (
            <motion.div layoutId="academyTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-aakaa-green" />
          )}
        </button>
        <button
          onClick={() => setActiveSubTab('waitlist')}
          className={`pb-4 px-2 text-sm font-bold transition-all relative flex items-center gap-2 ${
            activeSubTab === 'waitlist' ? 'text-aakaa-green' : 'text-gray-400 hover:text-aakaa-gold'
          }`}
        >
          <span>Waitlist Signups</span>
          {academyEntries.length > 0 && (
            <span className="px-2 py-0.5 bg-aakaa-gold text-aakaa-green text-xs font-black rounded-full">
              {academyEntries.length}
            </span>
          )}
          {activeSubTab === 'waitlist' && (
            <motion.div layoutId="academyTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-aakaa-green" />
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeSubTab === 'programs' && (
          <motion.div
            key="programs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {programsWithCounts.map((program) => (
              <div key={program.id} className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col relative overflow-hidden group">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-aakaa-green">
                    <GraduationCap size={24} />
                  </div>
                  <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-[10px] font-black uppercase tracking-wider">
                    {program.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-aakaa-green mb-2">{program.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                  <BookOpen size={14} />
                  <span>Type: {program.type}</span>
                </div>
                <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users size={16} className={program.students > 0 ? "text-aakaa-green" : "text-gray-400"} />
                    <span className="text-sm font-bold text-gray-700">
                      {program.students} {program.students === 1 ? 'applicant' : 'applicants'} / {program.capacity}
                    </span>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedProgramFilter(program.title);
                      setActiveSubTab('waitlist');
                    }}
                    className="text-xs font-bold text-aakaa-gold hover:text-aakaa-green uppercase tracking-widest cursor-pointer flex items-center gap-1"
                  >
                    View <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            ))}

            {/* Add New Card */}
            <div className="bg-aakaa-cream/30 border-2 border-dashed border-aakaa-gold/30 rounded-[2rem] p-6 flex flex-col items-center justify-center text-center cursor-not-allowed min-h-[250px] opacity-70">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-aakaa-gold shadow-sm mb-4">
                <X size={20} className="rotate-45" />
              </div>
              <h3 className="text-aakaa-green font-bold mb-1">Add New Program</h3>
              <p className="text-sm text-aakaa-green/60">Available upon cohort launch</p>
            </div>
          </motion.div>
        )}

        {activeSubTab === 'waitlist' && (
          <motion.div
            key="waitlist"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-aakaa-gold group-focus-within:text-aakaa-green transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Search by student name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-6 py-3.5 bg-white border border-aakaa-green/10 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-aakaa-green/5 focus:border-aakaa-green/30 transition-all shadow-sm"
                />
              </div>

              <div className="relative min-w-[240px]">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-aakaa-gold" size={18} />
                <select
                  value={selectedProgramFilter}
                  onChange={(e) => setSelectedProgramFilter(e.target.value)}
                  className="w-full pl-12 pr-10 py-3.5 bg-white border border-aakaa-green/10 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-aakaa-green/5 transition-all cursor-pointer text-aakaa-green font-bold shadow-sm"
                >
                  <option value="All">All Academy Programs</option>
                  {programList.map(p => (
                    <option key={p.id} value={p.title}>{p.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="py-20 text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-aakaa-green border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-aakaa-gold font-bold">Retrieving Academy waitlist entries...</p>
                  </div>
                ) : filteredWaitlist.length === 0 ? (
                  <div className="text-center py-20 px-4">
                    <Users size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-bold text-gray-700 mb-2">No waitlist entries found</h3>
                    <p className="text-gray-500 max-w-sm mx-auto text-sm">
                      {searchQuery || selectedProgramFilter !== 'All' 
                        ? 'Try clearing your search filters to view all entries.'
                        : 'Signups submitted from the Academy page will appear here instantly.'}
                    </p>
                  </div>
                ) : (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-aakaa-cream/20 text-aakaa-gold text-[10px] uppercase tracking-[0.2em] font-black border-b border-gray-100">
                        <th className="px-6 py-4">Student Identity</th>
                        <th className="px-6 py-4">Contact Details</th>
                        <th className="px-6 py-4">Target Program</th>
                        <th className="px-6 py-4">Background</th>
                        <th className="px-6 py-4">Date Registered</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredWaitlist.map((entry) => (
                        <tr key={entry._id} className="hover:bg-aakaa-cream/10 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-aakaa-green/5 text-aakaa-green font-bold text-xs flex items-center justify-center">
                                {entry.name?.charAt(0) || 'U'}
                              </div>
                              <span className="font-bold text-sm text-aakaa-green">{entry.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs text-gray-600 space-y-1">
                            <div className="flex items-center gap-1.5">
                              <Mail size={13} className="text-gray-400" />
                              <span>{entry.email}</span>
                            </div>
                            {entry.phone && (
                              <div className="flex items-center gap-1.5 text-aakaa-green font-medium">
                                <Phone size={13} className="text-aakaa-gold" />
                                <span>{entry.phone}</span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-aakaa-green/5 text-aakaa-green border border-aakaa-green/10 rounded-full text-xs font-bold inline-block">
                              {entry.concern?.replace(/^Academy:\s*/i, '') || 'Academy Program'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-gray-600 font-medium">
                            {entry.role || 'General Interest'}
                          </td>
                          <td className="px-6 py-4 text-xs text-gray-400">
                            {new Date(entry.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleContactWhatsApp(entry)}
                                className="p-2 text-[#25D366] hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer"
                                title="Contact via WhatsApp"
                              >
                                <MessageSquare size={16} />
                              </button>
                              <button
                                onClick={() => handleRemove(entry._id, entry.name)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                                title="Remove Entry"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AcademyCMS;
