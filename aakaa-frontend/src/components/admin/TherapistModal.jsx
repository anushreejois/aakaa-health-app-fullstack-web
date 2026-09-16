import React, { useState, useEffect } from 'react';
import { X, Save, Upload, User, Award, DollarSign, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

const TherapistModal = ({ isOpen, onClose, therapist, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    email: '',
    specialties: '',
    price: '₹850',
    image: '',
    bio: '',
    rating: 4.5,
    bookings: 0,
    views: 0
  });

  useEffect(() => {
    if (therapist) {
      setFormData({
        ...therapist,
        specialties: therapist.specialties ? therapist.specialties.join(', ') : ''
      });
    } else {
      setFormData({
        name: '',
        title: '',
        email: '',
        specialties: '',
        price: '₹850',
        image: '',
        bio: '',
        rating: 4.5,
        bookings: 0,
        views: 0
      });
    }
  }, [therapist, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const processedData = {
      ...formData,
      specialties: formData.specialties.split(',').map(s => s.trim()).filter(s => s !== '')
    };
    onSave(processedData);
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-aakaa-green/40 backdrop-blur-md z-[150] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-[3rem] w-full max-w-4xl h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-white/20"
      >
        <div className="p-8 border-b border-aakaa-green/5 flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-black text-aakaa-green tracking-tight">
              {therapist ? 'Edit Practitioner' : 'Add New Practitioner'}
            </h2>
            <p className="text-aakaa-gold text-[10px] font-black uppercase tracking-[0.2em] mt-1">Practitioner Management Portal</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-aakaa-cream/50 rounded-full transition-colors text-aakaa-gold group">
            <X size={28} className="group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-12 space-y-10 scrollbar-hide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Identity Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <User size={18} className="text-aakaa-green" />
                <h4 className="font-black text-aakaa-green text-sm uppercase tracking-widest">Identity & Role</h4>
              </div>
              
              <div className="space-y-4">
                <label className="text-[10px] font-black text-aakaa-gold uppercase tracking-widest">Full Name</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-6 py-4 bg-aakaa-cream/10 border border-aakaa-green/5 rounded-2xl focus:ring-4 focus:ring-aakaa-green/5 focus:outline-none transition-all font-bold text-aakaa-green"
                  placeholder="e.g. Dr. Jane Smith"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-aakaa-gold uppercase tracking-widest">Professional Title</label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-6 py-4 bg-aakaa-cream/10 border border-aakaa-green/5 rounded-2xl focus:ring-4 focus:ring-aakaa-green/5 focus:outline-none transition-all font-bold text-aakaa-green"
                  placeholder="e.g. Clinical Psychologist"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-aakaa-gold uppercase tracking-widest">Email Address</label>
                <input
                  required
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-6 py-4 bg-aakaa-cream/10 border border-aakaa-green/5 rounded-2xl focus:ring-4 focus:ring-aakaa-green/5 focus:outline-none transition-all font-bold text-aakaa-green"
                  placeholder="e.g. jane.smith@aakaa.com"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-aakaa-gold uppercase tracking-widest">Specialties (Comma separated)</label>
                <input
                  required
                  type="text"
                  value={formData.specialties}
                  onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                  className="w-full px-6 py-4 bg-aakaa-cream/10 border border-aakaa-green/5 rounded-2xl focus:ring-4 focus:ring-aakaa-green/5 focus:outline-none transition-all font-bold text-aakaa-green"
                  placeholder="Anxiety, Depression, Trauma"
                />
              </div>
            </div>

            {/* Financials & Assets */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <ImageIcon size={18} className="text-aakaa-green" />
                <h4 className="font-black text-aakaa-green text-sm uppercase tracking-widest">Assets & Pricing</h4>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-aakaa-gold uppercase tracking-widest">Profile Photo</label>
                <div className="flex flex-col gap-4">
                  {formData.image && (
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-aakaa-green/10 shadow-lg">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <label className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-aakaa-green text-white rounded-2xl cursor-pointer hover:bg-aakaa-green/90 transition-all font-bold text-sm shadow-xl shadow-aakaa-green/10">
                      <Upload size={18} />
                      Upload File
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFormData({ ...formData, image: reader.result });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    <div className="flex-[2]">
                      <input
                        type="text"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="w-full px-6 py-4 bg-aakaa-cream/10 border border-aakaa-green/5 rounded-2xl focus:ring-4 focus:ring-aakaa-green/5 focus:outline-none transition-all font-mono text-xs text-aakaa-green h-full"
                        placeholder="Or paste Image URL..."
                      />
                    </div>
                  </div>
                  <p className="text-[9px] text-aakaa-gold/60 font-medium">Tip: Use small JPG/PNG files to keep the database efficient.</p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-aakaa-gold uppercase tracking-widest">Session Fee (Display text)</label>
                <input
                  required
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-6 py-4 bg-aakaa-cream/10 border border-aakaa-green/5 rounded-2xl focus:ring-4 focus:ring-aakaa-green/5 focus:outline-none transition-all font-bold text-aakaa-green"
                  placeholder="₹850"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-aakaa-gold uppercase tracking-widest">Rating (0-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                    className="w-full px-6 py-4 bg-aakaa-cream/10 border border-aakaa-green/5 rounded-2xl focus:ring-4 focus:ring-aakaa-green/5 focus:outline-none transition-all font-bold text-aakaa-green"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-aakaa-gold uppercase tracking-widest">Initial Bookings</label>
                  <input
                    type="number"
                    value={formData.bookings}
                    onChange={(e) => setFormData({ ...formData, bookings: parseInt(e.target.value) })}
                    className="w-full px-6 py-4 bg-aakaa-cream/10 border border-aakaa-green/5 rounded-2xl focus:ring-4 focus:ring-aakaa-green/5 focus:outline-none transition-all font-bold text-aakaa-green"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-aakaa-gold uppercase tracking-widest">Practitioner Biography</label>
            <textarea
              rows={5}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-8 py-8 bg-aakaa-cream/10 border border-aakaa-green/5 rounded-[2rem] focus:ring-4 focus:ring-aakaa-green/5 focus:outline-none transition-all font-medium text-aakaa-green leading-relaxed"
              placeholder="Tell patients about your clinical philosophy and background..."
            />
          </div>

          <div className="pt-8 border-t border-aakaa-green/10 flex flex-col sm:flex-row gap-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-12 py-5 border border-aakaa-green/10 rounded-2xl text-xs font-black text-aakaa-gold hover:bg-aakaa-cream transition-all uppercase tracking-[0.2em]"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 px-12 py-5 bg-aakaa-green text-white rounded-2xl text-lg font-black hover:bg-aakaa-green/90 transition-all shadow-2xl shadow-aakaa-green/20 uppercase tracking-widest flex items-center justify-center gap-3"
            >
              <Save size={20} />
              {therapist ? 'Update Practitioner' : 'Onboard Practitioner'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>,
    document.body
  );
};

export default TherapistModal;
