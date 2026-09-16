import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Trash2, CheckCircle, Users, DollarSign, Award, X, BookOpen, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { createPortal } from 'react-dom';

const YogaCMS = () => {
  const [classes, setClasses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const { token } = useAuth();

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
      const classesRes = await fetch('http://localhost:5000/api/yoga/classes');
      const classesData = await classesRes.json();
      setClasses(classesData);

      // Fetch bookings
      const bookingsRes = await fetch('http://localhost:5000/api/yoga/bookings', {
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

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/yoga/classes', {
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
      const res = await fetch(`http://localhost:5000/api/yoga/classes/${id}`, {
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
                      </div>
                      <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded-full text-[9px] font-black uppercase tracking-wider">
                        Paid
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-aakaa-gold">
                      <Layers size={11} />
                      <span className="truncate max-w-[200px]" title={booking.classId?.title || "Deleted Class"}>
                        {booking.classId?.title || "Deleted Class"}
                      </span>
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
    </div>
  );
};

export default YogaCMS;
