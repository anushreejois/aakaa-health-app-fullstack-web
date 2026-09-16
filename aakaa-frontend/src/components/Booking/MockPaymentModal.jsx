import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, CreditCard, Smartphone, CheckCircle, XCircle, Lock, ArrowRight } from 'lucide-react';

const MockPaymentModal = ({ isOpen, onClose, amount, orderId, onPaymentSuccess }) => {
  const [step, setStep] = useState('selection'); // selection, processing, success
  
  if (!isOpen) return null;

  const handleSimulatePayment = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onPaymentSuccess({
          mock: true,
          status: 'success',
          orderId: orderId
        });
      }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-aakaa-green/40 backdrop-blur-md z-[100] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[3rem] w-full max-w-md overflow-hidden shadow-2xl border border-white/20"
      >
        {/* Razorpay-style Header */}
        <div className="bg-[#1e1e1e] p-8 text-white flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Mock Payment Mode</p>
            <h3 className="text-xl font-bold mt-1">Aakaa Health</h3>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Amount</p>
            <p className="text-xl font-black">₹{amount}</p>
          </div>
        </div>

        <div className="p-10">
          <AnimatePresence mode="wait">
            {step === 'selection' && (
              <motion.div 
                key="selection"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                  <Lock size={20} className="text-amber-600" />
                  <p className="text-xs font-bold text-amber-700 leading-tight">
                    This is a <span className="underline">secure simulation</span>. No real money will be charged.
                  </p>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black text-aakaa-gold uppercase tracking-widest">Select Simulation Logic</p>
                  <button 
                    onClick={handleSimulatePayment}
                    className="w-full p-6 rounded-2xl border-2 border-aakaa-green bg-aakaa-green/5 flex items-center justify-between hover:bg-aakaa-green/10 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-aakaa-green text-white rounded-xl">
                        <CheckCircle size={20} />
                      </div>
                      <div className="text-left">
                        <span className="block font-black text-aakaa-green uppercase text-[10px] tracking-widest">Success Flow</span>
                        <span className="text-sm font-bold text-gray-900">Confirm Order & Notify Doctor</span>
                      </div>
                    </div>
                    <ArrowRight size={18} className="text-aakaa-green group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button 
                    onClick={onClose}
                    className="w-full p-6 rounded-2xl border-2 border-gray-50 flex items-center justify-between hover:bg-red-50 hover:border-red-100 transition-all group"
                  >
                    <div className="flex items-center gap-4 text-gray-400 group-hover:text-red-500">
                      <div className="p-3 bg-gray-50 group-hover:bg-red-500 group-hover:text-white rounded-xl transition-colors">
                        <XCircle size={20} />
                      </div>
                      <div className="text-left">
                        <span className="block font-black uppercase text-[10px] tracking-widest">Abort Flow</span>
                        <span className="text-sm font-bold">Simulate Payment Failure</span>
                      </div>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'processing' && (
              <motion.div 
                key="processing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 border-4 border-aakaa-green/10 border-t-aakaa-green rounded-full animate-spin mb-8" />
                <h3 className="text-xl font-black text-gray-900">Validating Token...</h3>
                <p className="text-sm text-gray-500 font-medium mt-2">Communicating with mock central bank.</p>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mb-8 shadow-xl shadow-green-200">
                  <CheckCircle size={40} />
                </div>
                <h3 className="text-xl font-black text-gray-900">Mock Payment Successful!</h3>
                <p className="text-sm text-gray-500 font-medium mt-2">Signature generated and verified.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-8 bg-gray-50 text-center border-t border-gray-100">
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <ShieldCheck size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">PCI DSS Compliant Sandbox</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MockPaymentModal;
