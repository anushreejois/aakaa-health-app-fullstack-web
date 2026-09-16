import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, CheckCircle, XCircle, Download, X, AlertCircle } from 'lucide-react';
import { exportToCSV } from '../../utils/csvUtils';
import { createPortal } from 'react-dom';

import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

import { API_BASE_URL } from '../../config';

const API_BASE = `${API_BASE_URL}/api/bookings`;

const BookingRescheduler = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [notification, setNotification] = useState(null);
  const [newTime, setNewTime] = useState('');
  const { token } = useAuth();

  const fetchBookings = async () => {
    try {
      const response = await fetch(API_BASE, {
        headers: { 'x-auth-token': token }
      });
      const data = await response.json();
      setBookings(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleExport = () => {
    exportToCSV(bookings, 'upcoming_bookings.csv');
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ status: status.toLowerCase() })
      });
      
      if (response.ok) {
        setBookings(prev => prev.map(b => b._id === id ? { ...b, status: status.toLowerCase() } : b));
        showNotification(`Booking updated to ${status}`);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const openRescheduleModal = (booking) => {
    setSelectedBooking(booking);
    setNewTime(booking.time);
    setShowModal(true);
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/${selectedBooking._id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ time: newTime, status: 'rescheduled' })
      });

      if (response.ok) {
        setBookings(prev => prev.map(b => 
          b._id === selectedBooking._id ? { ...b, time: newTime, status: 'rescheduled' } : b
        ));
        showNotification(`Rescheduled to ${newTime}`);
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error rescheduling:", error);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-aakaa-green tracking-tight">Manual Booking Engine</h1>
          <p className="text-aakaa-gold text-sm font-medium mt-1">Direct intervention for rescheduling and session management.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 bg-white text-aakaa-green border border-aakaa-green/10 px-5 py-2.5 rounded-2xl text-sm font-bold hover:bg-aakaa-green hover:text-white transition-all shadow-sm"
          >
            <Download size={16} />
            <span className="hidden md:inline">Export Schedule</span>
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
            <CheckCircle size={18} />
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-[2.5rem] border border-aakaa-green/5 premium-shadow overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-aakaa-green border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-aakaa-gold font-bold">Synchronizing Ledger...</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-aakaa-cream/20 text-aakaa-gold text-[10px] uppercase tracking-[0.2em] font-black">
                  <th className="px-8 py-6">Identity ID</th>
                  <th className="px-8 py-6">Beneficiary</th>
                  <th className="px-8 py-6">Practitioner</th>
                  <th className="px-8 py-6">Scheduled Slot</th>
                  <th className="px-8 py-6">Live Status</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-aakaa-green/5">
                {Array.isArray(bookings) && bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <tr key={booking._id} className={`${booking.status === 'cancelled' ? 'opacity-40 grayscale' : ''} hover:bg-aakaa-cream/10 transition-all group`}>
                      <td className="px-8 py-6 text-[10px] font-black text-aakaa-gold/60 font-mono tracking-tighter">{booking._id.substring(0, 8)}...</td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-aakaa-green/10 flex items-center justify-center text-aakaa-green">
                            <User size={14} />
                          </div>
                          <span className="text-sm font-bold text-aakaa-green">{booking.userName}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm font-medium text-aakaa-gold/80">{booking.therapistId?.name || "Unassigned"}</td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-sm text-aakaa-green font-black">
                          <Clock size={14} className="text-aakaa-gold" />
                          {booking.time}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          booking.status === 'confirmed' ? 'bg-green-50 text-green-600 border-green-100' : 
                          booking.status === 'cancelled' ? 'bg-red-50 text-red-600 border-red-100' :
                          'bg-orange-50 text-orange-600 border-orange-100'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right space-x-2">
                        {booking.status !== 'cancelled' && (
                          <div className="flex items-center justify-end gap-3">
                            <button 
                              onClick={() => openRescheduleModal(booking)}
                              className="text-[10px] font-black uppercase tracking-widest text-aakaa-green hover:scale-105 transition-transform"
                            >
                              Reschedule
                            </button>
                            <div className="h-4 w-px bg-aakaa-green/10" />
                            <button 
                              onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                              className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:scale-105 transition-transform"
                            >
                              Terminate
                            </button>
                          </div>
                        )}
                        {booking.status === 'cancelled' && (
                          <button 
                            onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                            className="text-[10px] font-black uppercase tracking-widest text-aakaa-green border border-aakaa-green/20 px-4 py-1.5 rounded-lg hover:bg-aakaa-green hover:text-white transition-all"
                          >
                            Restore Session
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-8 py-20 text-center text-aakaa-gold font-bold">
                      No active bookings in the ledger.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      
      {/* Calendar Note */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-aakaa-green/5 border border-aakaa-green/10 p-8 rounded-[2.5rem] flex items-start gap-5 premium-shadow"
      >
        <div className="p-4 bg-white rounded-2xl text-aakaa-green shadow-lg shadow-aakaa-green/10">
          <Calendar size={32} />
        </div>
        <div>
          <h4 className="font-black text-aakaa-green uppercase text-xs tracking-[0.2em]">Administrative Directive</h4>
          <p className="text-sm text-aakaa-gold font-medium mt-2 leading-relaxed max-w-2xl">
            Manual interventions are logged and trigger automatic synchronization with the therapist's external calendar. 
            Ensure availability verification is completed before confirming slot transitions.
          </p>
        </div>
      </motion.div>

      {/* Reschedule Modal */}
      <AnimatePresence>
        {showModal && createPortal(
          <div className="fixed inset-0 bg-aakaa-green/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl premium-shadow"
            >
              <div className="p-8 border-b border-aakaa-green/5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-aakaa-green">Slot Transition</h2>
                  <p className="text-[10px] text-aakaa-gold font-black uppercase tracking-widest mt-1">Manual Schedule Override</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-aakaa-cream/50 rounded-full transition-colors text-aakaa-gold">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleRescheduleSubmit} className="p-10 space-y-8">
                <div className="flex items-center gap-4 p-5 bg-aakaa-cream/20 rounded-[1.5rem] border border-aakaa-green/5">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-aakaa-green/10 flex items-center justify-center text-aakaa-green shadow-sm">
                    <User size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-aakaa-gold uppercase tracking-tighter opacity-60">{selectedBooking?._id.substring(0, 8)}</p>
                    <p className="text-lg font-bold text-aakaa-green">{selectedBooking?.userName}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-aakaa-gold uppercase tracking-widest">Target Date & Time</label>
                  <div className="relative group">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-aakaa-gold group-focus-within:text-aakaa-green transition-colors" size={18} />
                    <input
                      required
                      type="text"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="w-full pl-12 pr-6 py-4 bg-aakaa-cream/10 border border-aakaa-green/5 rounded-2xl focus:outline-none focus:ring-4 focus:ring-aakaa-green/5 focus:border-aakaa-green/20 font-bold text-aakaa-green transition-all"
                      placeholder="YYYY-MM-DD HH:MM AM/PM"
                    />
                  </div>
                  <p className="text-[9px] text-aakaa-gold font-bold uppercase tracking-tighter opacity-40">System will notify all parties upon confirmation</p>
                </div>

                <div className="pt-4 flex gap-4">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-8 py-4 border border-aakaa-green/10 rounded-2xl text-sm font-black text-aakaa-gold hover:bg-aakaa-cream transition-colors uppercase tracking-widest">
                    Abort
                  </button>
                  <button type="submit" className="flex-1 px-8 py-4 bg-aakaa-green text-white rounded-2xl text-sm font-black hover:bg-aakaa-green/90 transition-all shadow-xl shadow-aakaa-green/20 uppercase tracking-widest">
                    Confirm Slot
                  </button>
                </div>
              </form>
            </motion.div>
          </div>,
          document.body
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingRescheduler;
