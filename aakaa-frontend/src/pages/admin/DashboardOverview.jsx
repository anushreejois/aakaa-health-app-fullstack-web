import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  ShoppingBag, 
  Download, 
  ArrowRight, 
  UserCheck, 
  Star, 
  Activity, 
  Clock, 
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { mockRevenueData, mockWaitlist, mockBookings, mockTherapists } from '../../data/mockAdminData';
import { exportToCSV } from '../../utils/csvUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

import { API_BASE_URL } from '../../config';

// Sparkline Component for premium visual trends
const Sparkline = ({ color }) => (
  <svg className="absolute bottom-0 left-0 w-full h-12 opacity-20" viewBox="0 0 100 40">
    <motion.path
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 2, ease: "easeInOut" }}
      d="M0 35 Q 20 10, 40 25 T 80 5 T 100 20"
      fill="none"
      stroke={color}
      strokeWidth="2"
    />
  </svg>
);

const DashboardOverview = ({ onNavigate }) => {
  const [timeRange, setTimeRange] = useState('30D');
  const [isChanging, setIsChanging] = useState(false);
  const [liveUsers, setLiveUsers] = useState(42);
  const [showRevenue, setShowRevenue] = useState(false);
  const { token } = useAuth();
  
  // Real Data States
  const [realWaitlist, setRealWaitlist] = useState([]);
  const [realBookings, setRealBookings] = useState([]);
  const [realTherapists, setRealTherapists] = useState([]);
  const [rawStatsData, setRawStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const ranges = ['Today', '7D', '30D', 'All Time'];

  // Fetch all data from backend (with 10-second real-time polling)
  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      try {
        const [waitlistRes, bookingsRes, therapistsRes, statsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/waitlist`, { headers: { 'x-auth-token': token } }),
          fetch(`${API_BASE_URL}/api/bookings`, { headers: { 'x-auth-token': token } }),
          fetch(`${API_BASE_URL}/api/therapists`), // Therapist list is public
          fetch(`${API_BASE_URL}/api/bookings/stats`, { headers: { 'x-auth-token': token } })
        ]);

        const [waitlistData, bookingsData, therapistsData, statsData] = await Promise.all([
          waitlistRes.json(),
          bookingsRes.json(),
          therapistsRes.json(),
          statsRes.json()
        ]);

        setRealWaitlist(Array.isArray(waitlistData) ? waitlistData : []);
        setRealBookings(Array.isArray(bookingsData) ? bookingsData : []);
        setRealTherapists(Array.isArray(therapistsData) ? therapistsData : []);
        setRawStatsData(statsData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching admin data:", error);
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [token]);

  // Dynamically compute metrics based on selected timeRange
  const filteredMetrics = useMemo(() => {
    const allTxns = [
      ...(rawStatsData?.app?.transactions || []),
      ...(rawStatsData?.website?.transactions || [])
    ];

    const allBookings = Array.isArray(realBookings) ? realBookings : [];
    const allWaitlist = Array.isArray(realWaitlist) ? realWaitlist : [];

    const now = new Date();
    let rangeStart = null;
    let rangePrevStart = null;
    let rangePrevEnd = null;

    if (timeRange === 'Today') {
      rangeStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      rangePrevStart = new Date(rangeStart.getTime() - 24 * 60 * 60 * 1000);
      rangePrevEnd = rangeStart;
    } else if (timeRange === '7D') {
      rangeStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      rangePrevStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
      rangePrevEnd = rangeStart;
    } else if (timeRange === '30D') {
      rangeStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      rangePrevStart = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
      rangePrevEnd = rangeStart;
    } else {
      // All Time
      rangeStart = new Date(0);
      rangePrevStart = null;
      rangePrevEnd = null;
    }

    const isConfirmed = (t) => {
      const s = (t.status || '').toLowerCase();
      return s === 'confirmed' || s === 'completed' || s === 'active' || s === 'settled';
    };

    // Filter transactions for current range
    const currentTxns = allTxns.filter((t) => {
      if (!isConfirmed(t)) return false;
      const d = new Date(t.createdAt);
      return isNaN(d.getTime()) || d >= rangeStart;
    });

    // Filter transactions for previous range (for growth %)
    const prevTxns = rangePrevStart ? allTxns.filter((t) => {
      if (!isConfirmed(t)) return false;
      const d = new Date(t.createdAt);
      return d >= rangePrevStart && d < rangePrevEnd;
    }) : [];

    // Calculate revenue
    const currentRevenue = currentTxns.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const prevRevenue = prevTxns.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    let revenueChange = "+0%";
    if (prevRevenue > 0) {
      const pct = ((currentRevenue - prevRevenue) / prevRevenue) * 100;
      revenueChange = `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`;
    } else if (currentRevenue > 0) {
      revenueChange = "+100%";
    }

    // Filter sessions / bookings
    const currentSessionsList = allBookings.filter((b) => {
      const d = new Date(b.createdAt);
      return isNaN(d.getTime()) || d >= rangeStart;
    });
    const prevSessionsList = rangePrevStart ? allBookings.filter((b) => {
      const d = new Date(b.createdAt);
      return d >= rangePrevStart && d < rangePrevEnd;
    }) : [];

    const currentSessionsCount = currentSessionsList.length;
    const prevSessionsCount = prevSessionsList.length;

    let sessionsChange = "+0%";
    if (prevSessionsCount > 0) {
      const pct = ((currentSessionsCount - prevSessionsCount) / prevSessionsCount) * 100;
      sessionsChange = `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`;
    } else if (currentSessionsCount > 0) {
      sessionsChange = "+100%";
    }

    // Filter waitlist
    const currentWaitlistCount = timeRange === 'All Time'
      ? allWaitlist.length
      : allWaitlist.filter((w) => {
          const d = new Date(w.createdAt || w.date);
          return isNaN(d.getTime()) || d >= rangeStart;
        }).length;

    const prevWaitlistCount = rangePrevStart ? allWaitlist.filter((w) => {
      const d = new Date(w.createdAt || w.date);
      return d >= rangePrevStart && d < rangePrevEnd;
    }).length : 0;

    let waitlistChange = "+0%";
    if (prevWaitlistCount > 0) {
      const pct = ((currentWaitlistCount - prevWaitlistCount) / prevWaitlistCount) * 100;
      waitlistChange = `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`;
    } else if (currentWaitlistCount > 0) {
      waitlistChange = "+100%";
    }

    return {
      revenue: currentRevenue,
      revenueChange,
      sessions: currentSessionsCount,
      sessionsChange,
      waitlist: currentWaitlistCount,
      waitlistChange,
      growth: sessionsChange,
      growthChange: sessionsChange,
      filteredBookings: currentSessionsList
    };
  }, [rawStatsData, realBookings, realWaitlist, timeRange]);

  // Live pulse simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveUsers(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { 
      label: 'Total Revenue', 
      value: `₹${filteredMetrics.revenue.toLocaleString()}`, 
      change: filteredMetrics.revenueChange, 
      icon: ShoppingBag, 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-50', 
      stroke: '#2563eb', 
      isRevenue: true 
    },
    { 
      label: 'Growth', 
      value: filteredMetrics.growth, 
      change: filteredMetrics.growthChange, 
      icon: TrendingUp, 
      color: 'text-emerald-600', 
      bgColor: 'bg-emerald-50', 
      stroke: '#10b981' 
    },
    { 
      label: 'Sessions', 
      value: filteredMetrics.sessions, 
      change: filteredMetrics.sessionsChange, 
      icon: Calendar, 
      color: 'text-purple-600', 
      bgColor: 'bg-purple-50', 
      stroke: '#8b5cf6' 
    },
    { 
      label: 'Waitlist', 
      value: filteredMetrics.waitlist, 
      change: filteredMetrics.waitlistChange, 
      icon: Users, 
      color: 'text-orange-600', 
      bgColor: 'bg-orange-50', 
      stroke: '#f97316' 
    },
  ];

  return (
    <div className="space-y-10 pb-16">
      
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-aakaa-green tracking-tight leading-none mb-2">
            Platform <span className="text-aakaa-gold/60">Pulse</span>
          </h1>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Live Now
            </span>
            <p className="text-gray-400 text-sm font-medium">{liveUsers} users currently exploring</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-1.5 flex gap-1 shadow-sm">
            {ranges.map((range) => (
              <button
                key={range}
                onClick={() => {
                  setIsChanging(true);
                  setTimeRange(range);
                  setTimeout(() => setIsChanging(false), 300);
                }}
                className={`px-5 py-2.5 rounded-xl text-xs font-black tracking-tighter transition-all ${
                  timeRange === range 
                    ? 'bg-aakaa-green text-white shadow-xl shadow-aakaa-green/20' 
                    : 'text-gray-400 hover:text-aakaa-green hover:bg-gray-50'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <button 
            onClick={() => exportToCSV(filteredMetrics.filteredBookings, `bookings_${timeRange.toLowerCase().replace(' ', '_')}.csv`)}
            className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-black transition-all shadow-xl"
          >
            <Download size={18} />
            <span>Export Reports</span>
          </button>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => {
              if (stat.isRevenue) setShowRevenue(!showRevenue);
            }}
            className={`relative bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden group ${
              stat.isRevenue ? 'cursor-pointer select-none' : ''
            } ${
              isChanging ? 'opacity-50 scale-[0.98]' : 'opacity-100'
            }`}
          >
            <Sparkline color={stat.stroke} />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-8">
                <div className={`p-4 rounded-2xl ${stat.bgColor} ${stat.color} group-hover:rotate-6 transition-transform`}>
                  <stat.icon size={24} />
                </div>
                <div className="flex items-center gap-2">
                  {stat.isRevenue && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowRevenue(!showRevenue);
                      }}
                      className="p-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-aakaa-green transition-all shadow-sm"
                      title={showRevenue ? "Hide revenue" : "Show revenue"}
                    >
                      {showRevenue ? <Eye size={15} /> : <EyeOff size={15} />}
                    </button>
                  )}
                  <div className={`flex items-center gap-1 text-[11px] font-black px-3 py-1.5 rounded-full ${
                    stat.change?.startsWith('+') ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'
                  }`}>
                    {stat.change?.startsWith('+') ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {stat.change}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-1">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">{stat.label}</p>
                {stat.isRevenue && (
                  <span className="text-[10px] font-bold text-gray-400 group-hover:text-aakaa-green transition-colors">
                    {showRevenue ? "Click to hide" : "Click to view"}
                  </span>
                )}
              </div>

              <h3 className="text-4xl font-black text-gray-900 tracking-tighter">
                {stat.isRevenue ? (
                  showRevenue ? (
                    stat.value
                  ) : (
                    <span className="tracking-[0.2em] text-gray-400 font-mono text-3xl">₹••••••</span>
                  )
                ) : (
                  stat.value
                )}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Advanced Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Matchmaking Efficiency */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900 text-white rounded-[3rem] p-10 shadow-2xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-aakaa-gold">
                <Clock size={24} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Efficiency</span>
            </div>
            <h3 className="text-3xl font-black tracking-tight mb-2">Matchmaking Speed</h3>
            <p className="text-white/50 text-sm font-medium leading-relaxed">Average time it takes for a user to be matched with their ideal therapist.</p>
          </div>
          
          <div className="mt-12">
            <div className="flex items-end gap-3 mb-4">
              <span className="text-5xl font-black leading-none">4.2m</span>
              <span className="text-emerald-400 text-sm font-bold flex items-center gap-1 mb-1">
                <ArrowDownRight size={16} className="rotate-180" /> -12%
              </span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '85%' }}
                transition={{ duration: 1.5, delay: 1 }}
                className="h-full bg-aakaa-gold"
              />
            </div>
          </div>
        </motion.div>

        {/* Waitlist Overview */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] border border-gray-100 shadow-xl p-10">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">Waitlist Queue</h3>
              <p className="text-gray-400 text-sm font-medium mt-1">High-priority users awaiting platform access.</p>
            </div>
            <button 
              onClick={() => onNavigate('waitlist')}
              className="px-6 py-3 bg-gray-50 text-gray-900 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-100 transition-all"
            >
              Manage Full Queue
            </button>
          </div>
          
          <div className="space-y-4">
            {Array.isArray(realWaitlist) && realWaitlist.slice(0, 3).map((user) => (
              <div key={user._id} className="flex items-center justify-between p-6 rounded-[2rem] bg-gray-50/50 border border-gray-50 group hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-aakaa-green group-hover:bg-aakaa-green group-hover:text-white transition-all">
                    <UserCheck size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 text-lg">{user.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{user.concern}</span>
                      <span className="w-1 h-1 bg-gray-200 rounded-full" />
                      <span className="text-[10px] font-bold text-emerald-500">New Request</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-gray-900">Score: 92%</p>
                  <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">{user.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Therapist Spotlight - Wide */}
        <div className="lg:col-span-3 bg-white rounded-[3rem] border border-gray-100 shadow-xl p-10 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Star size={200} />
          </div>
          
          <div className="flex items-center justify-between mb-10 relative z-10">
            <div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">Therapist Leaderboard</h3>
              <p className="text-gray-400 text-sm font-medium mt-1">Top performers based on patient feedback and booking volume.</p>
            </div>
            <button 
              onClick={() => onNavigate('therapists')}
              className="px-6 py-3 border border-gray-100 text-gray-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all"
            >
              Full Analytics <ArrowRight size={14} className="inline ml-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {Array.isArray(realTherapists) && realTherapists.slice(0, 3).map((therapist, i) => (
              <div key={therapist._id} className="group relative p-8 rounded-[2.5rem] bg-gray-50/50 border border-transparent hover:bg-white hover:border-gray-100 hover:shadow-2xl transition-all duration-500">
                {i === 0 && (
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-aakaa-gold text-white rounded-2xl flex items-center justify-center shadow-xl rotate-12">
                    <Star size={24} fill="currentColor" />
                  </div>
                )}
                
                <div className="mb-8">
                  <h4 className="text-2xl font-black text-gray-900 mb-1 group-hover:text-aakaa-green transition-colors">{therapist.name}</h4>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{therapist.specialty}</p>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Bookings</p>
                    <p className="text-lg font-black text-gray-900">{therapist.bookings}</p>
                  </div>
                  <div className="text-center border-x border-gray-100 px-2">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Rating</p>
                    <p className="text-lg font-black text-gray-900 flex items-center justify-center gap-1">
                      {therapist.rating} <Star size={12} fill="#D4AF37" className="text-aakaa-gold" />
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Growth</p>
                    <p className="text-lg font-black text-emerald-500">+{Math.floor(Math.random() * 15) + 5}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardOverview;
