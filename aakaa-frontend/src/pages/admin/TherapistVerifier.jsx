import React, { useState, useEffect } from 'react';
import { ShieldCheck, UserCheck, UserX, FileText, CheckCircle, AlertCircle, Download, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../../config';

const TherapistVerifier = () => {
  const { token } = useAuth();
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(null);

  const fetchPendingTherapists = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/admin/therapists/pending`, {
        headers: {
          'x-auth-token': token
        }
      });
      if (res.ok) {
        const data = await res.json();
        setTherapists(data.therapists || []);
      } else {
        showNotification({ type: 'error', text: 'Failed to fetch pending verifications.' });
      }
    } catch (err) {
      console.error(err);
      showNotification({ type: 'error', text: 'Network connection failed.' });
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPendingTherapists(true);
      const interval = setInterval(() => fetchPendingTherapists(false), 10000);
      return () => clearInterval(interval);
    }
  }, [token]);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleVerification = async (id, status) => {
    try {
      setActionInProgress(id);
      const res = await fetch(`${API_BASE_URL}/api/admin/therapists/${id}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        showNotification({
          type: 'success',
          text: `Therapist application successfully ${status === 'approved' ? 'authorized' : 'declined'}.`
        });
        // Remove item from UI state
        setTherapists(prev => prev.filter(t => t._id !== id));
      } else {
        showNotification({ type: 'error', text: 'Failed to update verification status.' });
      }
    } catch (err) {
      console.error(err);
      showNotification({ type: 'error', text: 'Network request error.' });
    } finally {
      setActionInProgress(null);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-aakaa-green tracking-tight">Caregiver Approvals</h1>
          <p className="text-aakaa-gold text-sm font-medium mt-1">
            Review and authorize credentials of professional therapists applying to the platform.
          </p>
        </div>
      </div>

      {/* Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`fixed top-24 right-8 text-white px-8 py-4 rounded-[1.5rem] shadow-2xl z-50 flex items-center gap-3 font-bold text-sm border border-white/10 ${
              notification.type === 'error' ? 'bg-red-500' : 'bg-aakaa-green'
            }`}
          >
            {notification.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
            {notification.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pending Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="col-span-full py-24 text-center">
              <div className="animate-spin w-10 h-10 border-4 border-aakaa-green border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-aakaa-gold font-black">Syncing credential ledger...</p>
            </div>
          ) : therapists.length > 0 ? (
            therapists.map((therapist, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                key={therapist._id}
                className="bg-white rounded-[2.5rem] border border-aakaa-green/5 premium-shadow overflow-hidden group hover:scale-[1.02] transition-all duration-500 flex flex-col justify-between"
              >
                <div className="p-8">
                  {/* Top Meta info */}
                  <div className="flex items-center gap-4 mb-6">
                    <img
                      src={therapist.userId?.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop'}
                      alt={therapist.userId?.fullName || 'Therapist'}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-aakaa-green/5 shadow-sm"
                    />
                    <div>
                      <h3 className="font-black text-aakaa-green text-lg leading-tight">
                        {therapist.userId?.fullName || 'Professional'}
                      </h3>
                      <p className="text-aakaa-gold text-xs font-semibold">{therapist.userId?.email || 'N/A'}</p>
                    </div>
                  </div>

                  {/* License and Specialties */}
                  <div className="space-y-4 pt-4 border-t border-aakaa-green/5">
                    <div>
                      <p className="text-[10px] text-aakaa-gold font-black uppercase tracking-widest opacity-60">License ID</p>
                      <p className="text-sm font-bold text-aakaa-green mt-0.5">{therapist.licenseNumber}</p>
                    </div>

                    <div>
                      <p className="text-[10px] text-aakaa-gold font-black uppercase tracking-widest opacity-60 mb-1.5">Specialties</p>
                      <div className="flex flex-wrap gap-1.5">
                        {therapist.specialties && therapist.specialties.length > 0 ? (
                          therapist.specialties.map((spec, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 bg-aakaa-cream/35 border border-aakaa-green/5 rounded-lg text-[10px] font-bold text-aakaa-green"
                            >
                              {spec}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs italic text-aakaa-gold/60">No specialties listed</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Document Link & Verification Buttons */}
                <div className="p-8 bg-aakaa-cream/10 border-t border-aakaa-green/5 flex flex-col gap-4">
                  {therapist.licenseFileUrl ? (
                    <a
                      href={therapist.licenseFileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-3 bg-white text-aakaa-green border border-aakaa-green/10 hover:border-aakaa-green/20 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                    >
                      <FileText size={14} />
                      <span>Licensure Credential PDF</span>
                      <ExternalLink size={12} className="opacity-50" />
                    </a>
                  ) : (
                    <div className="py-3 text-center border border-dashed border-aakaa-gold/20 rounded-xl text-[10px] font-black text-aakaa-gold uppercase tracking-wider">
                      No document uploaded
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      disabled={actionInProgress !== null}
                      onClick={() => handleVerification(therapist._id, 'rejected')}
                      className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-red-50 text-red-600 hover:bg-red-100/70 rounded-xl text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50"
                    >
                      <UserX size={14} />
                      <span>Decline</span>
                    </button>
                    <button
                      disabled={actionInProgress !== null}
                      onClick={() => handleVerification(therapist._id, 'approved')}
                      className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-aakaa-green text-white hover:bg-aakaa-green/90 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-aakaa-green/10 disabled:opacity-50"
                    >
                      <UserCheck size={14} />
                      <span>Approve</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full py-24 text-center">
              <div className="flex flex-col items-center gap-4">
                <ShieldCheck size={64} className="text-aakaa-gold/20" />
                <p className="text-aakaa-gold font-black text-xl">Verification ledger is fully clear.</p>
                <p className="text-aakaa-gold/60 text-sm">No pending caregiver approvals require reviews.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TherapistVerifier;
