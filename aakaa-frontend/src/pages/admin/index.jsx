import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import DashboardOverview from './DashboardOverview';
import TherapistLeaderboard from './TherapistLeaderboard';
import WaitlistManager from './WaitlistManager';
import BlogCMS from './BlogCMS';
import BookingRescheduler from './BookingRescheduler';
import RevenueManager from './RevenueManager';
import YogaCMS from './YogaCMS';
import TherapistVerifier from './TherapistVerifier';
import PayoutSettler from './PayoutSettler';
import { useAuth } from '../../context/AuthContext';

import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { logout } = useAuth();

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <DashboardOverview onNavigate={setActiveTab} />;
      case 'therapists': return <TherapistLeaderboard />;
      case 'waitlist': return <WaitlistManager />;
      case 'blogs': return <BlogCMS />;
      case 'bookings': return <BookingRescheduler />;
      case 'payments': return <RevenueManager />;
      case 'yoga': return <YogaCMS />;
      case 'verifier': return <TherapistVerifier />;
      case 'payouts': return <PayoutSettler />;
      default: return <DashboardOverview />;
    }
  };

  return (
    <AdminLayout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      onLogout={logout}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="w-full"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminDashboard;
