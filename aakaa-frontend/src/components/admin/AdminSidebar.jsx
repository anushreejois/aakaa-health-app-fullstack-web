import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  FileText, 
  Calendar, 
  LogOut,
  ChevronRight,
  Layers,
  ShieldCheck,
  Coins
} from 'lucide-react';

import { motion } from 'framer-motion';

const AdminSidebar = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'overview', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'therapists', name: 'Therapists', icon: Users },
    { id: 'verifier', name: 'Caregiver Approval', icon: ShieldCheck },
    { id: 'payouts', name: 'Withdrawal Payouts', icon: Coins },
    { id: 'payments', name: 'Revenue', icon: CreditCard },
    { id: 'waitlist', name: 'Waitlist', icon: Users },
    { id: 'blogs', name: 'Blog CMS', icon: FileText },
    { id: 'bookings', name: 'Bookings', icon: Calendar },
    { id: 'yoga', name: 'Yoga Manager', icon: Layers },
  ];

  return (
    <div className="w-64 bg-white border-r border-aakaa-green/5 h-screen sticky top-0 flex flex-col premium-shadow z-20">
      <div className="p-8 border-b border-aakaa-green/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-aakaa-green rounded-xl flex items-center justify-center text-white shadow-lg shadow-aakaa-green/20">
            <LayoutDashboard size={18} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-aakaa-green tracking-tight leading-none">Aakaa</h2>
            <p className="text-[10px] text-aakaa-gold font-bold mt-1 uppercase tracking-wider">Admin Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all relative group overflow-hidden ${
              activeTab === item.id 
              ? 'text-white' 
              : 'text-aakaa-gold hover:text-aakaa-green'
            }`}
          >
            {activeTab === item.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-aakaa-green shadow-lg shadow-aakaa-green/20 z-0"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            
            <div className="flex items-center gap-3 relative z-10 transition-transform group-active:scale-95">
              <item.icon size={18} className={`${activeTab === item.id ? 'text-white' : 'text-aakaa-gold/60 group-hover:text-aakaa-green'}`} />
              <span className="font-bold text-sm tracking-tight">{item.name}</span>
            </div>
            
            {activeTab === item.id && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative z-10"
              >
                <ChevronRight size={14} />
              </motion.div>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-aakaa-green/5">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-4 text-red-500/70 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all font-bold text-sm group"
        >
          <div className="p-2 bg-red-50 group-hover:bg-red-100 rounded-lg transition-colors">
            <LogOut size={16} />
          </div>
          <span>Logout Session</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
