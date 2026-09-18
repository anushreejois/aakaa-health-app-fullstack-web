import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, PhoneCall, MessageCircle, X } from 'lucide-react';

const MockPaymentModal = ({ isOpen, onClose, amount, orderId }) => {
  if (!isOpen) return null;

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Hi! I'd like to confirm my booking. Amount: ₹${amount}`);
    window.open(`https://wa.me/918075009937?text=${text}`, '_blank');
    onClose(); // Auto close the modal after they click
  };

  const handleCall = () => {
    window.open('tel:+919380879586', '_self');
  };

  return (
    <div className="fixed inset-0 bg-aakaa-green/40 backdrop-blur-md z-[100] flex items-center justify-center p-6 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[3rem] w-full max-w-md overflow-hidden shadow-2xl border border-white/20 my-auto relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 bg-gray-50 text-gray-500 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="bg-[#1e1e1e] p-8 text-white text-center pt-12 pb-10">
          <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={40} />
          </div>
          <h3 className="text-2xl font-black mb-2 tracking-tight">Booking Saved!</h3>
          <p className="text-gray-400 text-sm font-medium px-4">
            Your slot is temporarily reserved. We are in early access, so please contact us directly to confirm your payment and booking.
          </p>
        </div>

        <div className="p-8">
          <div className="flex flex-col gap-4">
            <button 
              onClick={handleWhatsApp}
              className="w-full p-5 rounded-2xl bg-[#25D366] text-white flex items-center justify-center gap-3 font-bold hover:bg-[#20bd5a] transition-all hover:-translate-y-1 shadow-lg shadow-green-200"
            >
              <MessageCircle size={22} />
              Confirm via WhatsApp
            </button>
            
            <button 
              onClick={handleCall}
              className="w-full p-5 rounded-2xl bg-aakaa-green text-white flex items-center justify-center gap-3 font-bold hover:bg-aakaa-green/90 transition-all hover:-translate-y-1 shadow-lg shadow-aakaa-green/20"
            >
              <PhoneCall size={22} />
              Call Us
            </button>

            <button 
              onClick={onClose}
              className="w-full p-4 mt-2 text-gray-400 font-bold hover:text-gray-600 transition-colors text-sm"
            >
              I'll do this later
            </button>
          </div>
        </div>

        <div className="p-6 bg-gray-50 text-center border-t border-gray-100">
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <span className="text-[10px] font-black uppercase tracking-widest">Aakaa Health Early Access</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MockPaymentModal;
