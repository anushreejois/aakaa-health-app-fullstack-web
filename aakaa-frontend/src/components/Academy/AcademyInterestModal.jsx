import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, GraduationCap, ArrowRight, Sparkles, MessageCircle, Mail, User, Phone, Briefcase } from "lucide-react";
import { API_BASE_URL } from "../../config";

export default function AcademyInterestModal({
  isOpen,
  onClose,
  initialProgram = "Mentorship Program",
  allPrograms = [
    "Mentorship Program",
    "Self-Paced Courses",
    "Interactive Workshops",
    "Expert Webinars",
    "Psychology Career Guidance"
  ]
}) {
  const [selectedProgram, setSelectedProgram] = useState(initialProgram);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Psychology / Therapy Student"
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialProgram) {
      setSelectedProgram(initialProgram);
    }
  }, [initialProgram]);

  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      setError("Please fill in your name and email.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/waitlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          role: formData.role,
          concern: `Academy: ${selectedProgram}`
        })
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
      } else {
        // If already on waitlist or duplicate, we still count them and show success with their status
        if (data.message && data.message.toLowerCase().includes("already")) {
          setSubmitted(true);
        } else {
          setError(data.message || "Something went wrong. Please try again.");
        }
      }
    } catch (err) {
      console.error("Academy waitlist error:", err);
      // Graceful fallback: let them proceed to WhatsApp
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppRedirect = () => {
    const text = encodeURIComponent(
      `Hi AakaA Academy Team! I'm interested in joining the priority cohort for "${selectedProgram}".\n\n` +
      `• Name: ${formData.name || "Student"}\n` +
      (formData.phone ? `• Phone: ${formData.phone}\n` : "") +
      `• Background: ${formData.role}\n\n` +
      `Could you please share details on upcoming cohort dates, syllabus, and enrollment? Thank you!`
    );
    window.open(`https://wa.me/918075009937?text=${text}`, "_blank");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-[#FAF8F5] rounded-[2.5rem] shadow-2xl border border-white overflow-hidden z-10 my-8"
        >
          {/* Header Banner */}
          <div className="bg-aakaa-green text-white p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
              <GraduationCap size={160} />
            </div>

            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-aakaa-gold" />
              <span className="text-xs uppercase tracking-widest font-black text-aakaa-gold">
                Priority Cohort Access
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-light font-josefin text-white tracking-tight">
              Aakaa <span className="font-bold text-aakaa-gold">Academy</span>
            </h2>
            <p className="text-white/70 text-xs sm:text-sm mt-1 leading-relaxed">
              Reserve your spot before public release. Early applicants receive curriculum previews and mentor pairing.
            </p>
          </div>

          <div className="p-6 sm:p-8">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                    {error}
                  </div>
                )}

                {/* Program Selector */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-aakaa-green mb-1.5">
                    Selected Program
                  </label>
                  <select
                    value={selectedProgram}
                    onChange={(e) => setSelectedProgram(e.target.value)}
                    className="w-full bg-white border border-aakaa-green/15 rounded-2xl px-4 py-3 text-sm text-aakaa-green font-bold focus:outline-none focus:ring-2 focus:ring-aakaa-gold/50 cursor-pointer shadow-sm"
                  >
                    {allPrograms.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-aakaa-green mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white border border-aakaa-green/15 rounded-2xl pl-11 pr-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-aakaa-gold/50 shadow-sm font-medium"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-aakaa-green mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white border border-aakaa-green/15 rounded-2xl pl-11 pr-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-aakaa-gold/50 shadow-sm font-medium"
                    />
                  </div>
                </div>

                {/* Phone / WhatsApp */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-aakaa-green mb-1.5">
                    WhatsApp / Phone <span className="text-gray-400 font-normal lowercase">(optional, for cohort notifications)</span>
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white border border-aakaa-green/15 rounded-2xl pl-11 pr-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-aakaa-gold/50 shadow-sm font-medium"
                    />
                  </div>
                </div>

                {/* Role / Background */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-aakaa-green mb-1.5">
                    Your Background / Focus
                  </label>
                  <div className="relative">
                    <Briefcase size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full bg-white border border-aakaa-green/15 rounded-2xl pl-11 pr-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-aakaa-gold/50 cursor-pointer shadow-sm font-medium"
                    >
                      <option value="Psychology / Therapy Student">Psychology / Therapy Student</option>
                      <option value="Practicing Mental Health Professional">Practicing Mental Health Professional</option>
                      <option value="Wellness Seeker / Personal Growth">Wellness Seeker / Personal Growth</option>
                      <option value="Caregiver / Healthcare Professional">Caregiver / Healthcare Professional</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-aakaa-green hover:bg-aakaa-green/90 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Join Priority Waitlist</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                  <p className="text-center text-[11px] text-gray-400 mt-2 font-medium">
                    No spam ever. You will only be notified when cohort seats unlock.
                  </p>
                </div>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4 space-y-6"
              >
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle size={36} />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-aakaa-green font-josefin mb-2">
                    You're On The Priority List!
                  </h3>
                  <p className="text-gray-600 text-sm max-w-sm mx-auto leading-relaxed">
                    Thank you for expressing interest in{" "}
                    <strong className="text-aakaa-green">{selectedProgram}</strong>.
                    You will be among the first to receive syllabus access and enrollment priority.
                  </p>
                </div>

                <div className="bg-aakaa-gold/10 border border-aakaa-gold/20 rounded-2xl p-4 text-xs text-aakaa-green/80 text-left space-y-1">
                  <p className="font-bold text-aakaa-green flex items-center gap-1.5">
                    <Sparkles size={14} className="text-aakaa-gold" /> Fast-Track Cohort Inquiries:
                  </p>
                  <p>
                    Have specific questions regarding prerequisites, mentor match, or schedules? Speak directly with our Academy team.
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleWhatsAppRedirect}
                    className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={18} />
                    <span>Inquire via WhatsApp</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-2xl transition-all text-sm"
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
