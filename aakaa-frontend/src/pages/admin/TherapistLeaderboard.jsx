import React, { useState, useMemo, useEffect } from 'react';
import { Award, Eye, Calendar, Download, Search, ArrowUpDown, ArrowUp, ArrowDown, Star, Plus, Edit2, Trash2, CheckCircle } from 'lucide-react';
import { exportToCSV } from '../../utils/csvUtils';
import TherapistModal from '../../components/admin/TherapistModal';
import { useAuth } from '../../context/AuthContext';

import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = "http://localhost:5000/api/therapists";

const TherapistLeaderboard = () => {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'bookings', direction: 'desc' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTherapist, setEditingTherapist] = useState(null);
  const [notification, setNotification] = useState(null);
  const { token } = useAuth();

  const fetchTherapists = async () => {
    try {
      const response = await fetch(API_BASE);
      const data = await response.json();
      setTherapists(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching therapists:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTherapists();
  }, []);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleExport = () => {
    exportToCSV(therapists, 'practitioner_performance.csv');
  };

  const handleSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name}? This action cannot be undone.`)) return;

    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      if (response.ok) {
        setTherapists(prev => prev.filter(t => t._id !== id));
        showNotification(`${name} has been removed from the directory.`);
      }
    } catch (error) {
      console.error("Error deleting therapist:", error);
    }
  };

  const handleSave = async (data) => {
    try {
      const url = editingTherapist ? `${API_BASE}/${editingTherapist._id}` : API_BASE;
      const method = editingTherapist ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const savedTherapist = await response.json();
        if (editingTherapist) {
          setTherapists(prev => prev.map(t => t._id === savedTherapist._id ? savedTherapist : t));
          showNotification('Practitioner profile updated successfully.');
        } else {
          setTherapists(prev => [...prev, savedTherapist]);
          showNotification('New practitioner successfully onboarded.');
        }
        setIsModalOpen(false);
        setEditingTherapist(null);
      }
    } catch (error) {
      console.error("Error saving therapist:", error);
    }
  };

  const filteredAndSortedTherapists = useMemo(() => {
    let items = [...therapists].filter(t => 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.specialties.join(' ').toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortConfig.key) {
      items.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return items;
  }, [therapists, searchQuery, sortConfig]);

  const topThree = useMemo(() => {
    return [...therapists].sort((a, b) => b.bookings - a.bookings).slice(0, 3);
  }, [therapists]);

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) return <ArrowUpDown size={12} className="opacity-30" />;
    return sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />;
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-aakaa-green tracking-tight">Practitioner Insights</h1>
          <p className="text-aakaa-gold text-sm font-medium mt-1">Measuring practitioner engagement and patient satisfaction.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-aakaa-gold group-focus-within:text-aakaa-green transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search practitioners..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-6 py-3 bg-white border border-aakaa-green/5 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-aakaa-green/5 w-full sm:w-64 premium-shadow"
            />
          </div>
          <button 
            onClick={() => {
              setEditingTherapist(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-aakaa-green text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-aakaa-green/90 transition-all shadow-xl shadow-aakaa-green/20"
          >
            <Plus size={16} />
            Onboard
          </button>
          <button 
            onClick={handleExport}
            className="p-3 bg-white text-aakaa-green border border-aakaa-green/10 rounded-2xl hover:bg-aakaa-green/5 transition-all shadow-sm"
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-24 right-8 bg-aakaa-green text-white px-8 py-4 rounded-[1.5rem] shadow-2xl z-[200] flex items-center gap-3 font-bold text-sm border border-white/10"
          >
            <CheckCircle size={18} />
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-3 py-20 text-center bg-white rounded-[2.5rem] premium-shadow border border-aakaa-green/5">
            <div className="animate-spin w-8 h-8 border-4 border-aakaa-green border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-aakaa-gold font-bold">Analyzing Performance Metrics...</p>
          </div>
        ) : (
          topThree.map((therapist, index) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              key={therapist._id} 
              className="bg-white p-8 rounded-[2.5rem] border border-aakaa-green/5 premium-shadow text-center relative overflow-hidden group hover:scale-[1.02] transition-all duration-500"
            >
              <div className={`absolute top-0 right-0 p-6 transition-all duration-500 group-hover:rotate-12 group-hover:scale-125 ${
                index === 0 ? 'text-aakaa-gold' : index === 1 ? 'text-gray-400' : 'text-orange-400'
              }`}>
                <Award size={48} className="opacity-20 group-hover:opacity-100" />
              </div>
              
              <div className="w-24 h-24 rounded-[2rem] bg-aakaa-cream mx-auto flex items-center justify-center text-aakaa-green border-4 border-white shadow-xl overflow-hidden mb-6 group-hover:rotate-3 transition-transform">
                <img src={therapist.image} alt={therapist.name} className="w-full h-full object-cover" />
              </div>
              
              <h3 className="text-xl font-black text-aakaa-green">{therapist.name}</h3>
              <p className="text-[10px] text-aakaa-gold font-black uppercase tracking-widest mt-1 mb-8">{therapist.title}</p>
              
              <div className="grid grid-cols-2 gap-4 pt-8 border-t border-aakaa-green/5">
                <div>
                  <p className="text-[10px] text-aakaa-gold uppercase font-black tracking-widest">Sessions</p>
                  <p className="text-2xl font-black text-aakaa-green tabular-nums">{therapist.bookings}</p>
                </div>
                <div className="border-l border-aakaa-green/5">
                  <p className="text-[10px] text-aakaa-gold uppercase font-black tracking-widest">Rating</p>
                  <p className="text-2xl font-black text-aakaa-green flex items-center justify-center gap-1">
                    {therapist.rating} <Star size={18} fill="currentColor" className="text-aakaa-gold" />
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-aakaa-green/5 premium-shadow overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
             <div className="py-20 text-center">
                <p className="text-aakaa-gold font-bold">Synchronizing Performance Data...</p>
             </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-aakaa-cream/20 text-aakaa-gold text-[10px] uppercase tracking-[0.2em] font-black">
                  <th className="px-8 py-6 cursor-pointer hover:text-aakaa-green transition-colors group" onClick={() => handleSort('name')}>
                    <div className="flex items-center gap-2">Practitioner <SortIcon column="name" /></div>
                  </th>
                  <th className="px-8 py-6">
                    <div className="flex items-center gap-2">Specialization</div>
                  </th>
                  <th className="px-8 py-6 text-center">Bookings</th>
                  <th className="px-8 py-6 text-center">Rating</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-aakaa-green/5">
                {filteredAndSortedTherapists.length > 0 ? (
                  filteredAndSortedTherapists.map((therapist) => (
                    <tr key={therapist._id} className="hover:bg-aakaa-cream/10 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <img src={therapist.image} alt="" className="w-10 h-10 rounded-2xl object-cover shadow-inner" />
                          <span className="text-sm font-bold text-aakaa-green group-hover:translate-x-1 transition-transform">{therapist.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm text-aakaa-gold font-medium">{therapist.specialties.slice(0, 2).join(', ')}</td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex items-center justify-center gap-2 text-aakaa-green font-black">
                          <Calendar size={16} className="opacity-30" />
                          <span className="text-sm tabular-nums">{therapist.bookings}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex items-center justify-center gap-1.5 font-black text-aakaa-green">
                          <span className="text-sm">{therapist.rating}</span>
                          <Star size={14} fill="currentColor" className="text-aakaa-gold" />
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => {
                              setEditingTherapist(therapist);
                              setIsModalOpen(true);
                            }}
                            className="p-3 text-aakaa-gold hover:text-aakaa-green hover:bg-aakaa-green/5 rounded-xl transition-all"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(therapist._id, therapist.name)}
                            className="p-3 text-red-400 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Search size={40} className="text-aakaa-gold/20" />
                        <p className="text-aakaa-gold font-bold">No practitioners found matching "{searchQuery}"</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <TherapistModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        therapist={editingTherapist} 
        onSave={handleSave} 
      />

    </div>
  );
};

export default TherapistLeaderboard;

