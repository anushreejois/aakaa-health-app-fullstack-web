import React, { useState } from 'react';
import { Lock, AlertCircle, ArrowLeft, Mail, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-aakaa-cream flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-aakaa-green/5 blur-3xl" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-aakaa-gold/5 blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        {/* Notice Section */}
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-white text-aakaa-green mb-6 shadow-xl shadow-aakaa-green/10 border border-aakaa-green/5"
          >
            <Lock size={32} />
          </motion.div>
          <h1 className="text-4xl font-black text-aakaa-green mb-2 tracking-tight">Access Gate</h1>
          <p className="text-aakaa-gold font-bold uppercase text-[10px] tracking-[0.3em]">
            Restricted Administrator Zone
          </p>
        </div>

        {/* Login Form */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-aakaa-green/5 premium-shadow"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-aakaa-gold uppercase tracking-widest ml-1">
                Admin Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-aakaa-gold/40 group-focus-within:text-aakaa-green transition-colors" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 rounded-2xl bg-aakaa-cream/10 border-2 border-aakaa-green/5 focus:border-aakaa-green/20 focus:outline-none focus:ring-4 focus:ring-aakaa-green/5 transition-all font-bold text-aakaa-green"
                  placeholder="admin@aakaa.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-aakaa-gold uppercase tracking-widest ml-1">
                Security Key
              </label>
              <div className="relative group">
                <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-aakaa-gold/40 group-focus-within:text-aakaa-green transition-colors" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-12 pr-6 py-4 rounded-2xl bg-aakaa-cream/10 border-2 ${
                    error ? 'border-red-400' : 'border-aakaa-green/5 focus:border-aakaa-green/20'
                  } focus:outline-none focus:ring-4 focus:ring-aakaa-green/5 transition-all font-bold text-aakaa-green`}
                  placeholder="••••••••"
                  required
                />
              </div>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mt-2 flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest"
                >
                  <AlertCircle size={14} />
                  <span>{error}</span>
                </motion.div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-aakaa-green text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-aakaa-green/20 hover:bg-aakaa-green/90 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:transform-none"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying...</span>
                </div>
              ) : "Verify Identity"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <a href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-aakaa-gold hover:text-aakaa-green transition-all">
              <ArrowLeft size={16} />
              Return to Website
            </a>
          </div>
        </motion.div>

        {/* Footer Note */}
        <p className="mt-10 text-center text-[10px] font-black text-aakaa-gold/40 uppercase tracking-widest">
          Unauthorized access attempts are cryptographically logged.
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;
