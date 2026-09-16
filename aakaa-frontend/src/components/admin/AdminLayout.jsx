import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { Bell, Search, User } from 'lucide-react';

const AdminLayout = ({ children, activeTab, setActiveTab, onLogout }) => {
  return (
    <div className="flex min-h-screen bg-aakaa-cream/30">
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={onLogout} 
      />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-aakaa-green/5 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4 bg-aakaa-cream/50 px-4 py-2 rounded-full border border-aakaa-green/5 w-96">
            <Search size={16} className="text-aakaa-gold" />
            <input 
              type="text" 
              placeholder="Search data..." 
              className="bg-transparent border-none outline-none text-sm text-aakaa-green w-full placeholder:text-aakaa-gold"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-aakaa-gold hover:text-aakaa-green transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-aakaa-green/10"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-aakaa-green leading-none">Admin User</p>
                <p className="text-[10px] text-aakaa-gold font-medium mt-1 uppercase tracking-wider">Super Admin</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-aakaa-green text-white flex items-center justify-center shadow-md">
                <User size={18} />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#F8F7F3]">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
