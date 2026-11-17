import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  CheckCircle, 
  XCircle, 
  Download, 
  X, 
  AlertCircle, 
  MessageSquare, 
  Phone, 
  Mail, 
  Video, 
  ExternalLink, 
  Copy, 
  Check, 
  Send,
  Plus
} from 'lucide-react';
import { exportToCSV } from '../../utils/csvUtils';
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
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  
  // Google Meet Dispatch State
  const [showMeetModal, setShowMeetModal] = useState(false);
  const [selectedMeetBooking, setSelectedMeetBooking] = useState(null);
  const [meetLinkInput, setMeetLinkInput] = useState('');
  const [isSavingMeet, setIsSavingMeet] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const { token } = useAuth();

  const fetchBookings = async () => {
    try {
      const response = await fetch(API_BASE, {
        headers: { 'x-auth-token': token }
      });
      const data = await response.json();
      setBookings(Array.isArray(data) ? data : []);
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

  // Open Google Meet Modal
  const openMeetModal = (booking) => {
    setSelectedMeetBooking(booking);
    setMeetLinkInput(booking.meetLink || '');
    setShowMeetModal(true);
    setCopiedLink(false);
  };

  // Save Meet Link to Backend
  const handleSaveMeetLink = async (andDispatch = false) => {
    if (!selectedMeetBooking) return;
    setIsSavingMeet(true);
    try {
      const cleanLink = meetLinkInput.trim();
      const response = await fetch(`${API_BASE}/${selectedMeetBooking._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ meetLink: cleanLink })
      });

      if (response.ok) {
        setBookings(prev => prev.map(b => 
          b._id === selectedMeetBooking._id ? { ...b, meetLink: cleanLink } : b
        ));
        showNotification("Google Meet link saved successfully!");
        
        if (andDispatch) {
          handleWhatsAppDispatch(selectedMeetBooking, cleanLink);
          setShowMeetModal(false);
        }
      } else {
        alert("Failed to save link on server.");
      }
    } catch (error) {
      console.error("Error saving meet link:", error);
      alert("Error saving link.");
    } finally {
      setIsSavingMeet(false);
    }
  };

  // Send WhatsApp message with Meet link
  const handleWhatsAppDispatch = (booking, linkOverride = null) => {
    const phone = (booking.userPhone || '').replace(/[^0-9]/g, '');
    const practitioner = booking.therapistId?.name || booking.therapistName || 'an assigned clinical specialist';
    const link = linkOverride !== null ? linkOverride : (booking.meetLink || '');

    let message = `Hi ${booking.userName}! Reaching out from AakaA Clinical Care.\n\n`;
    message += `Your therapy consultation with ${practitioner} is confirmed:\n`;
    message += `• Date: ${booking.date}\n`;
    message += `• Time: ${booking.time}\n`;
    
    if (link && link.trim() !== '') {
      message += `\n🔗 Your Google Meet Session Link:\n${link}\n`;
      message += `\nPlease join 5 minutes early from a quiet, private space.`;
    } else {
      message += `\nYour direct session link will be shared here shortly.`;
    }

    message += `\n\nIf you have any questions or need to adjust your slot, feel free to reply right here.\n\nWarm regards,\nTeam AakaA\nhttps://www.aakaa.co.in`;

    const text = encodeURIComponent(message);
    if (phone) {
      window.open(`https://wa.me/${phone.startsWith('91') ? phone : '91' + phone}?text=${text}`, '_blank');
    } else {
      window.open(`https://wa.me/918075009937?text=${text}`, '_blank');
    }
  };

  const openRescheduleModal = (booking) => {
    setSelectedBooking(booking);
    setNewDate(booking.date || '');
    setNewTime(booking.time || '');
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
        body: JSON.stringify({ date: newDate, time: newTime, status: 'rescheduled' })
      });

      if (response.ok) {
        setBookings(prev => prev.map(b => 
          b._id === selectedBooking._id ? { ...b, date: newDate, time: newTime, status: 'rescheduled' } : b
        ));
        showNotification(`Rescheduled to ${newDate} at ${newTime}`);
        setShowModal(false);
      } else {
        const errorData = await response.json();
        alert(`Failed to reschedule: ${errorData.msg || 'Server Error'}`);
      }
    } catch (error) {
      console.error("Error rescheduling:", error);
      alert("Error: Could not connect to server");
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-aakaa-green tracking-tight">Manual Booking Engine</h1>
          <p className="text-aakaa-gold text-sm font-medium mt-1">Direct intervention for Google Meet dispatch, rescheduling, and session management.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 bg-white text-aakaa-green border border-aakaa-green/10 px-5 py-2.5 rounded-2xl text-sm font-bold hover:bg-aakaa-green hover:text-white transition-all shadow-sm cursor-pointer"
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
            exit={{ opacity: 0, y: -20, x: 20 }}
            className="fixed top-8 right-8 z-50 bg-aakaa-green text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10"
          >
            <CheckCircle className="text-aakaa-gold shrink-0" size={18} />
            <span className="font-bold text-sm tracking-wide">{notification}</span>
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
                  <th className="px-6 py-6">ID</th>
                  <th className="px-6 py-6">Beneficiary</th>
                  <th className="px-6 py-6">Practitioner</th>
                  <th className="px-6 py-6">Scheduled Slot</th>
                  <th className="px-6 py-6">Google Meet Link</th>
                  <th className="px-6 py-6">Live Status</th>
                  <th className="px-6 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-aakaa-green/5">
                {Array.isArray(bookings) && bookings.length > 0 ? (
                  bookings.map((booking) => {
                    const hasLink = booking.meetLink && booking.meetLink.trim() !== '' && !booking.meetLink.includes('mock-');
                    return (
                      <tr key={booking._id} className={`${booking.status === 'cancelled' ? 'opacity-40 grayscale' : ''} hover:bg-aakaa-cream/10 transition-all group`}>
                        <td className="px-6 py-6 text-[10px] font-black text-aakaa-gold/60 font-mono tracking-tighter">
                          {booking._id.substring(0, 8)}...
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-aakaa-green/10 flex items-center justify-center text-aakaa-green font-bold text-xs shrink-0">
                              {booking.userName ? booking.userName.charAt(0).toUpperCase() : <User size={14} />}
                            </div>
                            <div>
                              <span className="text-sm font-bold text-aakaa-green block">{booking.userName}</span>
                              <span className="text-[11px] text-gray-500 block">{booking.userEmail}</span>
                              {booking.userPhone && (
                                <span className="text-[11px] text-emerald-700 font-bold block">{booking.userPhone}</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6 text-sm font-medium text-aakaa-gold/80">
                          {booking.therapistId?.name || booking.therapistName || "Unassigned"}
                        </td>
                        <td className="px-6 py-6">
                          <div className="text-xs font-bold text-gray-800">
                            {booking.date}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-aakaa-green font-black mt-0.5">
                            <Clock size={12} className="text-aakaa-gold" />
                            {booking.time}
                          </div>
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap">
                          {hasLink ? (
                            <button
                              onClick={() => openMeetModal(booking)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition cursor-pointer"
                              title={booking.meetLink}
                            >
                              <Video size={12} className="text-emerald-600" />
                              <span>Meet Ready</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => openMeetModal(booking)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition cursor-pointer"
                            >
                              <Plus size={12} />
                              <span>Add Link</span>
                            </button>
                          )}
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap border ${
                            booking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                            booking.status === 'cancelled' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                            booking.status.toLowerCase() === 'pending verification' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-orange-50 text-orange-700 border-orange-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              booking.status === 'confirmed' ? 'bg-emerald-500' :
                              booking.status === 'cancelled' ? 'bg-rose-500' :
                              booking.status.toLowerCase() === 'pending verification' ? 'bg-amber-500 animate-pulse' :
                              'bg-orange-500'
                            }`} />
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-6 text-right space-x-2">
                          {booking.status !== 'cancelled' && (
                            <div className="flex items-center justify-end gap-2.5">
                              {/* 1-Click WhatsApp Meet Dispatch */}
                              <button
                                onClick={() => openMeetModal(booking)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                                title="Dispatch Google Meet via WhatsApp"
                              >
                                <Video size={13} />
                                <span className="hidden lg:inline">Dispatch Meet</span>
                              </button>
                              
                              <button
                                onClick={() => handleWhatsAppDispatch(booking)}
                                className="p-2 text-[#25D366] hover:bg-emerald-50 rounded-xl transition-all cursor-pointer hover:scale-105"
                                title="Quick WhatsApp Message"
                              >
                                <MessageSquare size={16} />
                              </button>

                              <button 
                                onClick={() => openRescheduleModal(booking)}
                                className="text-[10px] font-black uppercase tracking-widest text-aakaa-green hover:underline cursor-pointer"
                              >
                                Reschedule
                              </button>
                              
                              <button 
                                onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                                className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:underline cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="py-20 text-center text-aakaa-gold font-bold">
                      No active bookings found in the archive.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* GOOGLE MEET DISPATCH MODAL */}
      <AnimatePresence>
        {showMeetModal && selectedMeetBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMeetModal(false)}
              className="absolute inset-0 bg-aakaa-green/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-[2.5rem] p-8 md:p-10 max-w-lg w-full relative z-10 shadow-2xl border border-aakaa-green/10"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <span className="text-[10px] font-black text-aakaa-gold uppercase tracking-[0.25em] block mb-1">
                    Concierge Dispatch
                  </span>
                  <h3 className="text-2xl font-black text-aakaa-green tracking-tight">
                    Google Meet Session Link
                  </h3>
                </div>
                <button 
                  onClick={() => setShowMeetModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Booking Summary Box */}
              <div className="bg-aakaa-cream/40 rounded-2xl p-4 mb-6 border border-gray-100 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Beneficiary:</span>
                  <span className="font-bold text-gray-900">{selectedMeetBooking.userName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Phone:</span>
                  <span className="font-bold text-emerald-700">{selectedMeetBooking.userPhone || "Not provided"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Practitioner:</span>
                  <span className="font-bold text-gray-900">{selectedMeetBooking.therapistId?.name || "Assigned Specialist"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Slot:</span>
                  <span className="font-bold text-gray-900">{selectedMeetBooking.date} @ {selectedMeetBooking.time}</span>
                </div>
              </div>

              {/* Google Meet Input */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-gray-700 uppercase tracking-wider">
                    Google Meet URL
                  </label>
                  <a
                    href="https://meet.google.com/new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline"
                  >
                    <ExternalLink size={12} /> Create new link in Google Meet
                  </a>
                </div>

                <div className="relative">
                  <Video className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="url"
                    value={meetLinkInput}
                    onChange={(e) => setMeetLinkInput(e.target.value)}
                    placeholder="https://meet.google.com/xxx-yyyy-zzz"
                    className="w-full pl-12 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-mono font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-aakaa-green/20 focus:border-aakaa-green transition"
                  />
                  {meetLinkInput && (
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(meetLinkInput);
                        setCopiedLink(true);
                        setTimeout(() => setCopiedLink(false), 2000);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                      title="Copy link"
                    >
                      {copiedLink ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Enter the Google Meet link. Saving will link it permanently to this patient's profile and make it available in their live session view.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  type="button"
                  disabled={isSavingMeet}
                  onClick={() => handleSaveMeetLink(true)}
                  className="w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
                >
                  <Send size={15} /> Save & Dispatch on WhatsApp
                </button>

                <div className="flex gap-3">
                  <button
                    type="button"
                    disabled={isSavingMeet}
                    onClick={() => handleSaveMeetLink(false)}
                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-2xl font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                  >
                    Save Only
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowMeetModal(false)}
                    className="flex-1 py-3 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-2xl font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RESCHEDULE MODAL */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-aakaa-green/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-[2.5rem] p-10 max-w-lg w-full relative z-10 shadow-2xl border border-aakaa-green/10"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-aakaa-green tracking-tight">Modify Schedule</h3>
                  <p className="text-aakaa-gold text-xs font-bold uppercase tracking-widest mt-1">Beneficiary: {selectedBooking?.userName}</p>
                </div>
                <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-full bg-aakaa-cream/40 flex items-center justify-center text-aakaa-gold hover:bg-aakaa-cream transition-colors">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleRescheduleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-aakaa-gold uppercase tracking-widest mb-2">New Operational Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-aakaa-gold/40" size={18} />
                      <input 
                        type="date"
                        required
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-aakaa-cream/10 border border-aakaa-green/5 rounded-2xl focus:outline-none focus:ring-4 focus:ring-aakaa-green/5 focus:border-aakaa-green/20 font-bold text-aakaa-green transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-aakaa-gold uppercase tracking-widest mb-2">New Time Coordinate</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-aakaa-gold/40" size={18} />
                      <select
                        required
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-aakaa-cream/10 border border-aakaa-green/5 rounded-2xl focus:outline-none focus:ring-4 focus:ring-aakaa-green/5 focus:border-aakaa-green/20 font-bold text-aakaa-green transition-all cursor-pointer"
                      >
                        <option value="" disabled>Select Time</option>
                        <option value="08:00 AM">08:00 AM</option>
                        <option value="09:00 AM">09:00 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="12:00 PM">12:00 PM</option>
                        <option value="01:00 PM">01:00 PM</option>
                        <option value="02:00 PM">02:00 PM</option>
                        <option value="03:00 PM">03:00 PM</option>
                        <option value="04:00 PM">04:00 PM</option>
                        <option value="05:00 PM">05:00 PM</option>
                        <option value="06:00 PM">06:00 PM</option>
                        <option value="07:00 PM">07:00 PM</option>
                        <option value="08:00 PM">08:00 PM</option>
                      </select>
                    </div>
                  </div>
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
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingRescheduler;
