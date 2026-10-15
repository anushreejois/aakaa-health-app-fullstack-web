import React from "react";
import { motion } from "framer-motion";
import { X, Star, Award, BookOpen, Heart, Calendar, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function TherapistProfileView({ therapist, onClose, onBook }) {
  if (!therapist) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-end">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
      />
      
      <motion.div 
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
        className="relative w-full max-w-2xl h-full bg-[#fdfdfc] shadow-2xl overflow-y-auto scrollbar-hide"
      >
        {/* Header Image */}
        <div className="relative h-[380px] sm:h-[440px] bg-gradient-to-br from-aakaa-green/15 via-aakaa-cream/60 to-aakaa-gold/20 flex items-center justify-center overflow-hidden">
          {therapist.image ? (
            <img 
              src={therapist.image} 
              alt={therapist.name} 
              className="w-full h-full object-cover object-top" 
            />
          ) : (
            <div className="w-36 h-36 rounded-full bg-white/70 shadow-lg flex items-center justify-center text-aakaa-green font-black text-5xl border-4 border-white mb-10">
              {therapist.name?.charAt(0) || "P"}
            </div>
          )}
          
          {/* Subtle top shade for buttons */}
          <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/50 via-black/10 to-transparent pointer-events-none" />
          
          {/* Top Left Badges */}
          <div className="absolute top-6 left-6 z-10 flex items-center gap-2">
            <span className="px-4 py-1.5 bg-aakaa-green text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-aakaa-green/30 backdrop-blur-md">
              Verified Practitioner
            </span>
            <div className="flex items-center gap-1 px-3 py-1.5 bg-black/40 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-black shadow-md">
              <Star size={13} className="fill-amber-400 text-amber-400" />
              <span>{therapist.rating}</span>
            </div>
          </div>
          
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-11 h-11 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 shadow-xl hover:bg-white hover:text-gray-900 transition-all active:scale-90 z-10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Section */}
        <div className="px-8 sm:px-12 pt-8 pb-40">
          {/* Name & Role Header */}
          <div className="mb-10 pb-8 border-b border-gray-100">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight mb-2">
              {therapist.name}
            </h2>
            <p className="text-sm sm:text-base font-bold text-aakaa-green uppercase tracking-widest">
              {therapist.title}
            </p>
            {therapist.availability && therapist.availability.length > 0 && (
              <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 bg-aakaa-green/5 text-aakaa-green text-xs font-bold rounded-xl border border-aakaa-green/10">
                <Calendar size={13} />
                <span>Available: {therapist.availability.join(', ')}</span>
              </div>
            )}
          </div>
          <div className="space-y-16">
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Experience', value: '10+ Years', icon: Award, color: 'text-amber-500' },
                { label: 'Sessions', value: `${therapist.bookings}+`, icon: Calendar, color: 'text-blue-500' },
                { label: 'Reviews', value: `${therapist.reviews}`, icon: CheckCircle2, color: 'text-green-500' }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm text-center">
                  <div className={`w-10 h-10 ${stat.color} bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <stat.icon size={20} />
                  </div>
                  <p className="text-lg font-black text-gray-900">{stat.value}</p>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Specialties */}
            <section>
              <h4 className="text-[10px] font-black text-aakaa-gold uppercase tracking-[0.3em] mb-6">Clinical Focus</h4>
              <div className="flex flex-wrap gap-2">
                {(therapist.specialties || []).map(spec => (
                  <span key={spec} className="px-6 py-3 bg-white text-gray-600 rounded-2xl text-sm font-bold border border-gray-100 shadow-sm hover:border-aakaa-green/30 transition-colors">
                    {spec}
                  </span>
                ))}
              </div>
            </section>

            {/* Philosophy / Bio */}
            <section className="relative">
              <div className="absolute -left-12 top-0 w-1.5 h-full bg-aakaa-green/10 rounded-full overflow-hidden">
                <div className="w-full h-1/3 bg-aakaa-green" />
              </div>
              <h4 className="flex items-center gap-3 text-xl font-black text-gray-900 mb-6">
                <Heart size={24} className="text-rose-500" /> Therapeutic Journey
              </h4>
              <p className="text-xl text-gray-600 leading-relaxed font-medium">
                {therapist.bio || "As a practitioner at Aakaa, I am committed to providing a compassionate and judgment-free space for your healing journey. My approach is holistic, focusing on both your immediate well-being and long-term emotional growth."}
              </p>
            </section>

            {/* Trust Badges */}
            <div className="p-8 bg-aakaa-green/5 rounded-[2.5rem] border border-aakaa-green/10 flex items-center gap-6">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-aakaa-green shadow-sm">
                <ShieldCheck size={32} />
              </div>
              <div>
                <h5 className="font-black text-gray-900 uppercase text-xs tracking-widest mb-1">Confidential & Secure</h5>
                <p className="text-sm text-gray-500 font-medium">Your sessions are protected by 256-bit encryption and strict medical confidentiality standards.</p>
              </div>
            </div>

          </div>
        </div>

        {/* Sticky Action Button */}
        <div className="fixed bottom-0 w-full max-w-2xl bg-white/80 backdrop-blur-2xl border-t border-gray-100 p-8 flex items-center justify-between z-20">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Session Fee</p>
            <p className="text-3xl font-black text-gray-900">{therapist.price}<span className="text-base font-normal text-gray-500 ml-1">/ 50m</span></p>
          </div>
          <button 
            onClick={onBook}
            className="flex items-center gap-3 bg-aakaa-green text-white px-12 py-5 rounded-[1.5rem] font-black text-lg shadow-[0_20px_50px_rgba(30,77,54,0.3)] hover:shadow-[0_25px_60px_rgba(30,77,54,0.4)] hover:-translate-y-1 transition-all active:scale-95"
          >
            <Calendar size={20} /> Reserve Slot
          </button>
        </div>
      </motion.div>
    </div>
  );
}

