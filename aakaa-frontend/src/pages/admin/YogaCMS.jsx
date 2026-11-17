import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Users, 
  DollarSign, 
  Award, 
  X, 
  BookOpen, 
  Layers,
  Video,
  MessageSquare,
  ExternalLink,
  Copy,
  Check,
  Send,
  Phone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { createPortal } from 'react-dom';
import { API_BASE_URL } from '../../config';

const YogaCMS = () => {
  const [classes, setClasses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const { token } = useAuth();

  // Google Meet Dispatch State
  const [showMeetModal, setShowMeetModal] = useState(false);
  const [selectedMeetBooking, setSelectedMeetBooking] = useState(null);
  const [meetLinkInput, setMeetLinkInput] = useState('');
  const [isSavingMeet, setIsSavingMeet] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    instructorName: '',
    instructorTitle: 'Certified Yoga Instructor',
    date: '',
    time: '',
    duration: '60 mins',
    price: 499,
    capacity: 15,
    description: '',
    level: 'All Levels',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2000&auto=format&fit=crop'
  });

  const [formLoading, setFormLoading] = useState(false);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch classes
      const classesRes = await fetch(`${API_BASE_URL}/api/yoga/classes`);
      const classesData = await classesRes.json();
      setClasses(classesData);

      // Fetch bookings
      const bookingsRes = await fetch(`${API_BASE_URL}/api/yoga/bookings`, {
        headers: { 'x-auth-token': token }
      });
      const bookingsData = await bookingsRes.json();
      setBookings(bookingsData);
    } catch (err) {
      console.error("Error fetching yoga CMS data:", err);
    } finally {
      setLoading(false);
    }
  };

  const openMeetModal = (booking) => {
    setSelectedMeetBooking(booking);
    setMeetLinkInput(booking.meetLink || '');
    setShowMeetModal(true);
    setCopiedLink(false);
  };

  const handleSaveMeetLink = async (andDispatch = false) => {
    if (!selectedMeetBooking) return;
    setIsSavingMeet(true);
    try {
      const cleanLink = meetLinkInput.trim();
      const res = await fetch(`${API_BASE_URL}/api/yoga/bookings/${selectedMeetBooking._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ meetLink: cleanLink })
      });
      if (res.ok) {
        setBookings(prev => prev.map(b => b._id === selectedMeetBooking._id ? { ...b, meetLink: cleanLink } : b));
        showToast("Google Meet link saved successfully!");
        if (andDispatch) {
          handleWhatsAppDispatch(selectedMeetBooking, cleanLink);
          setShowMeetModal(false);
        }
      } else {
        alert("Failed to save link on server.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving link.");
    } finally {
      setIsSavingMeet(false);
    }
  };

  const handleWhatsAppDispatch = (booking, linkOverride = null) => {
    const phone = (booking.userPhone || '').replace(/[^0-9]/g, '');
    const link = linkOverride !== null ? linkOverride : (booking.meetLink || '');
    const sessionName = booking.bookingType === 'private' ? 'Private Somatic Session' : booking.bookingType === 'monthly' ? 'Monthly Somatics Batch' : (booking.classId?.title || 'Yoga Class');
    const scheduleInfo = booking.date ? `\n• Date: ${booking.date}\n• Time: ${booking.time || ''}` : '';

    let message = `Hi ${booking.userName}! Reaching out from AakaA Yoga & Somatics.\n\n`;
    message += `Your spot for "${sessionName}" is confirmed!${scheduleInfo}\n`;
    if (link && link.trim() !== '') {
      message += `\n🔗 Google Meet Session Link:\n${link}\n`;
      message += `\nPlease join 5 minutes early with your mat ready.`;
    } else {
      message += `\nYour direct session link will be shared here shortly.`;
    }
    message += `\n\nIf you have any questions, reply right here!\n\nWarm regards,\nTeam AakaA\nhttps://www.aakaa.co.in`;

    const text = encodeURIComponent(message);
    if (phone) {
      window.open(`https://wa.me/${phone.startsWith('91') ? phone : '91' + phone}?text=${text}`, '_blank');
    } else {
      window.open(`https://wa.me/918075009937?text=${text}`, '_blank');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprovePayment = async (bookingId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/payments/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ bookingId, category: 'yoga' })
      });
      if (response.ok) {
        showToast("Payment received and confirmed!");
        fetchData();
      } else {
        alert("Failed to approve payment");
      }
    } catch (err) {
      console.error("Failed to approve payment", err);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/yoga/classes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        showToast("Class created successfully!");
        setShowAddModal(false);
        // Reset form
        setFormData({
          title: '',
          instructorName: '',
          instructorTitle: 'Certified Yoga Instructor',
          date: '',
          time: '',
          duration: '60 mins',
          price: 499,
          capacity: 15,
          description: '',
          level: 'All Levels',
          image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2000&auto=format&fit=crop'
        });
        fetchData();
      } else {
        const errorData = await res.json();
        alert(errorData.msg || "Failed to create class");
      }
    } catch (err) {
      console.error(err);
      alert("Server error occurred");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteClass = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/yoga/classes/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });

      if (res.ok) {
        showToast(`Successfully deleted ${title}`);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Notification */}
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-aakaa-green tracking-tight font-heading">Yoga & Mindfulness Class CMS</h1>
          <p className="text-aakaa-gold text-sm font-medium mt-1">Manage live virtual schedules, classes, and view student list.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-aakaa-green text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-aakaa-green/90 transition-all shadow-md shadow-aakaa-green/10"
        >
          <Plus size={16} />
          Create New Class
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-aakaa-green border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-aakaa-gold font-bold">Fetching Yoga CMS details...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Class List */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-aakaa-green flex items-center gap-2 font-heading">
              <BookOpen className="w-5 h-5" /> Current Classes
            </h2>

            {classes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {classes.map((cls) => (
                  <div key={cls._id} className="bg-white rounded-3xl p-6 border border-aakaa-green/5 premium-shadow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 bg-aakaa-green/10 text-aakaa-green rounded-full text-xs font-bold">
                          {cls.level}
                        </span>
                        <span className="text-sm font-bold text-aakaa-green">₹{cls.price}</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 mb-2">{cls.title}</h3>
                      <p className="text-gray-500 text-xs line-clamp-2 mb-4">{cls.description}</p>
                      
                      <div className="space-y-2 text-xs text-gray-600 mb-4 border-t border-gray-50 pt-3">
                        <div className="flex items-center gap-2">
                          <Calendar size={12} className="text-aakaa-gold" />
                          <span>{cls.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={12} className="text-aakaa-gold" />
                          <span>{cls.time} ({cls.duration})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users size={12} className="text-aakaa-gold" />
                          <span className="font-semibold">{cls.bookedSpots} / {cls.capacity} spots filled</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-auto">
                      <div className="text-xs text-gray-400">
                        Instructor: <strong className="text-gray-700 font-semibold">{cls.instructorName}</strong>
                      </div>
                      <button
                        onClick={() => handleDeleteClass(cls._id, cls.title)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="Delete Class"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-10 text-center border border-aakaa-green/5 premium-shadow">
                <p className="text-aakaa-gold font-bold">No classes defined yet. Click "Create New Class" to begin.</p>
              </div>
            )}
          </div>

          {/* Registrations List */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-aakaa-green flex items-center gap-2 font-heading">
              <Users className="w-5 h-5" /> Live Registrations
            </h2>

            <div className="bg-white rounded-3xl border border-aakaa-green/5 premium-shadow p-6 max-h-[600px] overflow-y-auto space-y-4">
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <div key={booking._id} className="border-b border-gray-50 pb-3 last:border-b-0 last:pb-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-bold text-gray-800">{booking.userName}</p>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">{booking.userEmail}</p>
                        {booking.userPhone && (
                          <p className="text-xs text-emerald-700 font-bold mt-0.5">{booking.userPhone}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          booking.status === 'confirmed' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {booking.status === 'confirmed' ? 'Paid / Confirmed' : 'Pending Payment'}
                        </span>
                        <div className="flex flex-col items-end">
                          <span className="text-[9px] font-black uppercase tracking-wider text-gray-400 mb-1">
                            {booking.bookingType === 'private' ? 'Private' : booking.bookingType === 'monthly' ? 'Package' : 'Single'}
                          </span>
                          <span className="px-2 py-0.5 bg-gray-50 text-gray-500 rounded-full text-[9px] font-black uppercase tracking-wider font-mono">
                            ₹{booking.amountPaid || booking.amount || '0'}
                          </span>
                        </div>
                        {booking.status === 'Pending Verification' && (
                          <button 
                            onClick={() => handleApprovePayment(booking._id)}
                            className="px-3 py-1.5 mt-1 bg-aakaa-green text-white text-[9px] rounded-lg font-bold hover:bg-aakaa-green/90 transition-colors uppercase tracking-widest shadow-sm"
                          >
                            Mark as Received
                          </button>
                        )}
                      </div>
                    </div>

                    {booking.date && (
                      <div className="mt-2 text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                        <Calendar size={12} className="text-aakaa-gold" />
                        <span>{booking.date} {booking.time ? `@ ${booking.time}` : ''}</span>
                      </div>
                    )}

                    {booking.bookingType === "monthly" && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-aakaa-gold font-bold">
                        <Layers size={11} />
                        <span className="capitalize">{booking.classCount} Classes ({booking.pricingTier})</span>
                      </div>
                    )}
                    {booking.bookingType === "private" && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-aakaa-gold font-bold">
                        <Layers size={11} />
                        <span>{booking.classCount} Private Sessions {booking.instructorName ? `(${booking.instructorName})` : ''}</span>
                      </div>
                    )}
                    {booking.bookingType === "class" && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
                        <Layers size={11} />
                        <span className="truncate max-w-[200px]" title={booking.classId?.title || "Deleted Class"}>
                          {booking.classId?.title || "Deleted Class"}
                        </span>
                      </div>
                    )}

                    {/* Google Meet & WhatsApp Action Row */}
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {booking.meetLink && booking.meetLink.trim() !== '' && !booking.meetLink.includes('mock-') ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Video size={10} className="text-emerald-600" /> Link Ready
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            No Link Set
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openMeetModal(booking)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-sm transition cursor-pointer"
                          title="Dispatch Google Meet on WhatsApp"
                        >
                          <Video size={12} /> Meet Link
                        </button>
                        <button
                          onClick={() => handleWhatsAppDispatch(booking)}
                          className="p-1 text-[#25D366] hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                          title="Quick WhatsApp message"
                        >
                          <MessageSquare size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-aakaa-gold font-bold text-sm">No registrations yet.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* Add Class Modal */}
      <AnimatePresence>
        {showAddModal && createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            ></motion.div>

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative z-10 border border-gray-100 max-h-[90vh] flex flex-col"
            >
              <div className="bg-aakaa-green text-white px-8 py-5 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold font-heading">Schedule New Yoga Class</h3>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="p-8 space-y-5 overflow-y-auto flex-1 text-sm text-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">Class Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vinyasa Flow"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-aakaa-green outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">Level</label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-aakaa-green outline-none"
                    >
                      <option value="All Levels">All Levels</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">Instructor Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Elena Rostova"
                      value={formData.instructorName}
                      onChange={(e) => setFormData({ ...formData, instructorName: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-aakaa-green outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">Instructor Designation</label>
                    <input
                      type="text"
                      placeholder="e.g. Certified Coach"
                      value={formData.instructorTitle}
                      onChange={(e) => setFormData({ ...formData, instructorTitle: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-aakaa-green outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">Date (or Day Info)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Every Saturday"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-aakaa-green outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">Time (e.g. 08:30 AM)</label>
                    <input
                      type="text"
                      required
                      placeholder="08:30 AM"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-aakaa-green outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">Duration</label>
                    <input
                      type="text"
                      placeholder="60 mins"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-aakaa-green outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">Price (INR)</label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-aakaa-green outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">Capacity (Spots)</label>
                    <input
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-aakaa-green outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">Banner Image URL</label>
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-aakaa-green outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">Class Description</label>
                  <textarea
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-aakaa-green outline-none resize-none"
                    placeholder="Provide description of benefits, somatic focuses..."
                  ></textarea>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="px-6 py-3 bg-aakaa-green text-white rounded-xl font-bold hover:bg-aakaa-green/90 shadow-md transition-all"
                  >
                    {formLoading ? "Saving Class..." : "Save Class"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>,
          document.body
        )}
      </AnimatePresence>

      {/* GOOGLE MEET DISPATCH MODAL FOR YOGA */}
      <AnimatePresence>
        {showMeetModal && selectedMeetBooking && createPortal(
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
                    Yoga & Somatics Concierge
                  </span>
                  <h3 className="text-2xl font-black text-aakaa-green tracking-tight">
                    Dispatch Google Meet Link
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
                  <span className="text-gray-500 font-medium">Participant:</span>
                  <span className="font-bold text-gray-900">{selectedMeetBooking.userName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Phone:</span>
                  <span className="font-bold text-emerald-700">{selectedMeetBooking.userPhone || "Not provided"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Type:</span>
                  <span className="font-bold text-gray-900 capitalize">
                    {selectedMeetBooking.bookingType === 'private' ? 'Private Session' : selectedMeetBooking.bookingType === 'monthly' ? 'Monthly Pass' : (selectedMeetBooking.classId?.title || 'Group Class')}
                  </span>
                </div>
                {selectedMeetBooking.date && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Slot:</span>
                    <span className="font-bold text-gray-900">{selectedMeetBooking.date} {selectedMeetBooking.time ? `@ ${selectedMeetBooking.time}` : ''}</span>
                  </div>
                )}
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
          </div>,
          document.body
        )}
      </AnimatePresence>
    </div>
  );
};

export default YogaCMS;
