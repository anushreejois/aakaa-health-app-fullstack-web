import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, 
  MessageCircle, 
  Target, 
  ShieldCheck, 
  Clock, 
  GraduationCap, 
  Activity,
  ArrowRight,
  Sparkles,
  X,
  CheckCircle
} from "lucide-react";
import ScrollReveal from "../ui/ScrollReveal";

const therapyTypes = [
  {
    title: "CBT (Cognitive Behavioral)",
    desc: "Evidence-based approach to identify and change negative thought patterns and behaviors.",
    fullDesc: "Cognitive Behavioral Therapy (CBT) is a highly effective, evidence-based psychological treatment that focuses on identifying, understanding, and changing destructive or disturbing thought patterns that have a negative influence on behavior and emotions.",
    benefits: ["Identify negative thoughts", "Develop coping strategies", "Problem-solving skills", "Goal-oriented approach"],
    icon: Target,
    color: "bg-blue-50 text-blue-600",
    glow: "group-hover:shadow-blue-500/20"
  },
  {
    title: "Counseling & Talk Therapy",
    desc: "Safe space to express your feelings and work through life's challenges with a professional.",
    fullDesc: "Talk therapy provides a supportive, non-judgmental environment where you can speak openly about your feelings and experiences. It helps you process emotions, resolve past traumas, and develop a deeper understanding of yourself.",
    benefits: ["Emotional release", "Improved self-awareness", "Better communication", "Stress reduction"],
    icon: MessageCircle,
    color: "bg-emerald-50 text-emerald-600",
    glow: "group-hover:shadow-emerald-500/20"
  },
  {
    title: "DBT (Dialectical Behavior)",
    desc: "Focuses on emotional regulation, mindfulness, and healthy relationship management.",
    fullDesc: "Dialectical Behavior Therapy (DBT) is specifically designed to help people who experience intense emotions. It teaches you how to live in the moment, develop healthy ways to cope with stress, regulate emotions, and improve relationships.",
    benefits: ["Mindfulness practice", "Distress tolerance", "Emotional regulation", "Interpersonal effectiveness"],
    icon: Activity,
    color: "bg-purple-50 text-purple-600",
    glow: "group-hover:shadow-purple-500/20"
  },
  {
    title: "Student Support",
    desc: "Specialized guidance for academic stress, peer pressure, and career anxiety.",
    fullDesc: "Our Student Support therapy is tailored to the unique pressures faced by young adults in academic environments. We address issues ranging from exam anxiety and peer pressure to career uncertainty and identity development.",
    benefits: ["Anxiety management", "Time management skills", "Career clarity", "Confidence building"],
    icon: GraduationCap,
    color: "bg-amber-50 text-amber-600",
    glow: "group-hover:shadow-amber-500/20"
  },
  {
    title: "Trauma-Informed Care",
    desc: "Gentle, specialized support to help you process and heal from past difficult experiences.",
    fullDesc: "Trauma-Informed Care assumes that an individual is more likely than not to have a history of trauma. It shifts the focus from 'What's wrong with you?' to 'What happened to you?' to create a safe, supportive path to healing.",
    benefits: ["Safe environment", "Empowerment & choice", "Trust building", "Gentle processing"],
    icon: Brain,
    color: "bg-rose-50 text-rose-600",
    glow: "group-hover:shadow-rose-500/20"
  }
];

export default function TherapyPreviewSection() {
  const [selectedTherapy, setSelectedTherapy] = useState(null);

  return (
    <section id="therapy" className="py-28 bg-[#fafaf8] relative overflow-hidden">
      {/* Premium Background Blooms */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-aakaa-green/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-aakaa-gold/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* Left Side: Content */}
          <div className="lg:w-5/12 lg:sticky lg:top-36">
            <ScrollReveal>
              <div className="flex items-center gap-2 mb-8 animate-fade-in">
                <div className="w-10 h-[1px] bg-aakaa-gold/40" />
                <span className="text-aakaa-gold text-[11px] font-bold uppercase tracking-[0.3em]">
                  Professional Care
                </span>
              </div>
              
              <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.05] tracking-tight mb-8">
                Guidance from <br />
                <span className="text-aakaa-green pr-2">Certified</span> 
                Experts
              </h2>
              
              <p className="text-gray-600 text-xl leading-relaxed mb-10 max-w-md">
                Connect with expert therapists who truly understand your journey. We offer specialized support tailored to your unique needs and goals.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white shadow-sm text-aakaa-green">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 uppercase tracking-wider">Secure</p>
                    <p className="text-xs text-gray-500 mt-0.5">100% Private</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white shadow-sm text-aakaa-green">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 uppercase tracking-wider">Flexible</p>
                    <p className="text-xs text-gray-500 mt-0.5">24/7 Access</p>
                  </div>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link 
                  to="/booking" 
                  className="inline-flex items-center gap-4 bg-aakaa-green text-white px-10 py-5 rounded-full font-bold shadow-[0_15px_40px_rgba(30,77,54,0.3)] hover:shadow-[0_20px_50px_rgba(30,77,54,0.4)] transition-all"
                >
                  Find Your Match <ArrowRight size={20} />
                </Link>
              </motion.div>
            </ScrollReveal>
          </div>

          {/* Right Side: Therapy Types Grid */}
          <div className="lg:w-7/12 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 lg:pt-0">
            {therapyTypes.map((type, index) => (
              <ScrollReveal key={index} delay={index * 80}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className={`group bg-white/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-white hover:border-aakaa-green/10 hover:bg-white transition-all duration-500 shadow-sm ${type.glow} hover:shadow-2xl`}
                >
                  <div className={`w-16 h-16 ${type.color} rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm`}>
                    <type.icon size={30} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight group-hover:text-aakaa-green transition-colors">
                    {type.title}
                  </h3>
                  <p className="text-gray-600 text-[15px] leading-relaxed mb-8 min-h-[4.5rem]">
                    {type.desc}
                  </p>
                  <button 
                    onClick={() => setSelectedTherapy(type)}
                    className="inline-flex items-center gap-2 text-aakaa-green font-bold text-[11px] uppercase tracking-[0.2em] group/link bg-aakaa-green/5 hover:bg-aakaa-green hover:text-white px-5 py-2.5 rounded-xl transition-all duration-300"
                  >
                    Details <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              </ScrollReveal>
            ))}
            
            {/* View All Card - Premium Style */}
            <ScrollReveal delay={400}>
              <Link 
                to="/booking" 
                className="group relative bg-aakaa-green p-10 rounded-[2.5rem] flex flex-col justify-between items-start text-white hover:shadow-[0_25px_60px_rgba(30,77,54,0.4)] hover:-translate-y-2 transition-all duration-500 h-full overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700">
                  <Sparkles size={120} />
                </div>
                
                <div>
                  <h3 className="text-3xl font-bold mb-4 tracking-tight">Expand Your Care</h3>
                  <p className="text-white/70 text-base leading-relaxed">Discover 20+ specialized approaches crafted for your well-being.</p>
                </div>
                
                <div className="mt-8 px-6 py-3 bg-white text-aakaa-green rounded-full font-bold flex items-center gap-2 group-hover:gap-4 transition-all shadow-xl">
                  Explore Catalogue <ArrowRight size={20} />
                </div>
              </Link>
            </ScrollReveal>
          </div>

        </div>
      </div>

      {/* Therapy Details Modal */}
      <AnimatePresence>
        {selectedTherapy && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTherapy(null)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden z-[101]"
            >
              <div className={`p-8 sm:p-10 ${selectedTherapy.color.split(' ')[0]} border-b border-white/20`}>
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm ${selectedTherapy.color.split(' ')[1]}`}>
                    <selectedTherapy.icon size={30} />
                  </div>
                  <button 
                    onClick={() => setSelectedTherapy(null)}
                    className="p-2 bg-white/50 hover:bg-white rounded-full transition-colors text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{selectedTherapy.title}</h3>
              </div>
              
              <div className="p-8 sm:p-10">
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  {selectedTherapy.fullDesc}
                </p>
                
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Key Benefits</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                  {selectedTherapy.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle size={18} className="text-aakaa-green shrink-0" />
                      <span className="text-gray-700 font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col sm:flex-row justify-end gap-4">
                  <button 
                    onClick={() => setSelectedTherapy(null)}
                    className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    Close
                  </button>
                  <Link 
                    to="/booking"
                    className="px-8 py-3 bg-aakaa-green text-white rounded-xl font-bold shadow-[0_10px_20px_rgba(30,77,54,0.2)] hover:shadow-[0_15px_30px_rgba(30,77,54,0.3)] transition-all text-center"
                  >
                    Find a Specialist
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
