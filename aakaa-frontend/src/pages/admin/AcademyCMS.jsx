import React, { useState } from 'react';
import { BookOpen, Users, Clock, Calendar, CheckCircle, GraduationCap, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AcademyCMS = () => {
  const [activeSubTab, setActiveSubTab] = useState('programs');

  // Dummy data to show how it will look when fully functional
  const programs = [
    { id: 1, title: 'Mentorship Program', type: 'Intensive', students: 0, capacity: 20, status: 'Coming Soon' },
    { id: 2, title: 'Self-Paced Courses', type: 'Flexible', students: 0, capacity: 'Unlimited', status: 'Coming Soon' },
    { id: 3, title: 'Interactive Workshops', type: 'Live', students: 0, capacity: 50, status: 'Coming Soon' },
    { id: 4, title: 'Expert Webinars', type: 'Digital', students: 0, capacity: 500, status: 'Coming Soon' },
    { id: 5, title: 'Psychology Career Guidance', type: 'Professional', students: 0, capacity: 15, status: 'Coming Soon' },
  ];

  const waitlist = [
    // This will be populated when you hook up the waitlist API
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-aakaa-green tracking-tight font-josefin">Aakaa Academy CMS</h1>
          <p className="text-aakaa-gold text-sm font-bold mt-1 uppercase tracking-widest">Manage Programs & Waitlists</p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex gap-4 border-b border-aakaa-green/10 mb-8">
        <button
          onClick={() => setActiveSubTab('programs')}
          className={`pb-4 px-2 text-sm font-bold transition-all relative ${
            activeSubTab === 'programs' ? 'text-aakaa-green' : 'text-gray-400 hover:text-aakaa-gold'
          }`}
        >
          Active Programs
          {activeSubTab === 'programs' && (
            <motion.div layoutId="academyTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-aakaa-green" />
          )}
        </button>
        <button
          onClick={() => setActiveSubTab('waitlist')}
          className={`pb-4 px-2 text-sm font-bold transition-all relative ${
            activeSubTab === 'waitlist' ? 'text-aakaa-green' : 'text-gray-400 hover:text-aakaa-gold'
          }`}
        >
          Waitlist Signups
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
            {programs.map((program) => (
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
                    <Users size={16} className="text-gray-400" />
                    <span className="text-sm font-bold text-gray-600">{program.students} / {program.capacity}</span>
                  </div>
                  <button disabled className="text-xs font-bold text-gray-400 uppercase tracking-widest cursor-not-allowed">
                    Manage
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
              <p className="text-sm text-aakaa-green/60">Available upon launch</p>
            </div>
          </motion.div>
        )}

        {activeSubTab === 'waitlist' && (
          <motion.div
            key="waitlist"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 text-center py-20">
              <Users size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">No waitlist entries yet</h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                Once the waitlist forms are embedded on the Academy page, signups will appear here automatically.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AcademyCMS;
