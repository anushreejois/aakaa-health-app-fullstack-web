import React, { useState, useEffect } from "react";
import { Calendar, Clock, User, Award, CheckCircle, Info, Sparkles, X, Brain, Heart, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../components/Home/Footer";
import MockPaymentModal from "../components/Booking/MockPaymentModal";

export default function Yoga() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");
  
  // Booking Modal State
  const [bookingType, setBookingType] = useState("class"); // class, monthly, private
  const [bookingClass, setBookingClass] = useState(null);
  
  // Private Session Form inputs
  const [privateInstructor, setPrivateInstructor] = useState("Elena Rostova");
  const [privateDate, setPrivateDate] = useState("");
  const [privateTime, setPrivateTime] = useState("10:00 AM");

  const [formData, setFormData] = useState({ name: "", email: "" });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [bookingError, setBookingError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Payment states
  const [currentOrder, setCurrentOrder] = useState(null);
  const [isMockPaymentOpen, setIsMockPaymentOpen] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/yoga/classes");
      if (res.ok) {
        const data = await res.json();
        setClasses(data);
      } else {
        setError("Failed to load yoga classes. Please try again later.");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const getSelectedAmount = () => {
    if (bookingType === "class") return bookingClass?.price || 399;
    if (bookingType === "monthly") return 2499;
    if (bookingType === "private") return 850;
    return 0;
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setBookingError("");
    setBookingSuccess(null);

    const amount = getSelectedAmount();

    const bookingData = {
      userName: formData.name,
      userEmail: formData.email,
      bookingType: bookingType,
    };
    if (bookingType === "class") {
      bookingData.classId = bookingClass._id;
    } else if (bookingType === "private") {
      bookingData.instructorName = privateInstructor;
      bookingData.date = privateDate;
      bookingData.time = privateTime;
    }

    try {
      // 1. Create order on backend
      const orderRes = await fetch("http://localhost:5000/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, bookingData, category: 'yoga' })
      });

      if (!orderRes.ok) {
        throw new Error("Unable to initialize payment transaction.");
      }

      const order = await orderRes.json();
      setCurrentOrder(order);

      // If backend returned a mock order (due to mock fallback on invalid credentials)
      if (order.mock) {
        setIsMockPaymentOpen(true);
        setBookingLoading(false);
        return;
      }

      // 2. Create Kotak Hidden Form and Submit
      const form = document.createElement("form");
      form.method = "POST";
      form.action = order.actionUrl;

      // Add all formData fields provided by backend
      Object.keys(order.formData).forEach((key) => {
        const hiddenField = document.createElement("input");
        hiddenField.type = "hidden";
        hiddenField.name = key;
        hiddenField.value = order.formData[key];
        form.appendChild(hiddenField);
      });

      document.body.appendChild(form);
      form.submit();

    } catch (err) {
      console.error(err);
      setBookingError(err.message || "Payment service unavailable. Please try again.");
      setBookingLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentResponse) => {
    setBookingLoading(true);
    setBookingError("");
    try {
      // 1. Verify signature on backend
      const verifyRes = await fetch("http://localhost:5000/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...paymentResponse,
          orderId: currentOrder.orderId,
          pendingBookingId: currentOrder.pendingBookingId,
          category: 'yoga'
        })
      });
      const verifyData = await verifyRes.json();

      if (verifyData.status === 'success') {
        // 2. Proceed to save booking
        setBookingSuccess(verifyData.booking);
        fetchClasses();
        setFormData({ name: "", email: "" });
      } else {
        setBookingError("Payment verification failed. Please contact support.");
        setBookingLoading(false);
      }
    } catch (error) {
      console.error("Verification failed:", error);
      setBookingError("Unable to verify payment signature.");
      setBookingLoading(false);
    }
  };

  const executeBookingSave = async () => {
    const payload = {
      userName: formData.name,
      userEmail: formData.email,
      bookingType: bookingType,
    };

    if (bookingType === "class") {
      payload.classId = bookingClass._id;
    } else if (bookingType === "private") {
      payload.instructorName = privateInstructor;
      payload.date = privateDate;
      payload.time = privateTime;
    }

    try {
      const res = await fetch("http://localhost:5000/api/yoga/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setBookingSuccess(data);
        fetchClasses();
        setFormData({ name: "", email: "" });
      } else {
        setBookingError(data.msg || "Failed to complete your booking.");
      }
    } catch (err) {
      console.error(err);
      setBookingError("Server connection failed. Your payment was processed; please contact support.");
    } finally {
      setBookingLoading(false);
    }
  };

  const openClassBooking = (yogaClass) => {
    setBookingType("class");
    setBookingClass(yogaClass);
    setBookingSuccess(null);
    setBookingError("");
    setIsModalOpen(true);
  };

  const openMonthlyBooking = () => {
    setBookingType("monthly");
    setBookingClass(null);
    setBookingSuccess(null);
    setBookingError("");
    setIsModalOpen(true);
  };

  const openPrivateBooking = () => {
    setBookingType("private");
    setBookingClass(null);
    setBookingSuccess(null);
    setBookingError("");
    setIsModalOpen(true);
  };

  const filteredClasses = selectedLevel === "All"
    ? classes
    : classes.filter(c => c.level === selectedLevel);

  return (
    <div className="min-h-screen bg-aakaa-cream flex flex-col pt-32 overflow-hidden">
      
      {/* Decorative floating animated orbs for premium visual feel */}
      <div className="absolute top-40 right-[-10%] w-96 h-96 bg-aakaa-green/5 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse"></div>
      <div className="absolute top-[800px] left-[-10%] w-[500px] h-[500px] bg-aakaa-gold/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 lg:px-10 pb-24 space-y-28">
        
        {/* Hero Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl relative"
        >
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-gradient-to-tr from-aakaa-green/10 to-transparent rounded-full blur-3xl -z-10"></div>
          
          <span className="inline-flex items-center gap-2 mb-5 bg-aakaa-green/10 text-aakaa-green px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest border border-aakaa-green/15">
            <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} /> Somatic Wellness
          </span>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] font-heading tracking-tight">
            Somatic Yoga & <br />
            <span className="text-aakaa-green bg-gradient-to-r from-aakaa-green to-[#2E734E] bg-clip-text text-transparent">Mindful Movement</span>
          </h1>
          <p className="mt-6 text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl font-medium">
            Nurture your nervous system, release deeply stored stress, and connect with your physical self. Join our expert-led online live classes tailored for mental health integration.
          </p>
        </motion.div>

        {/* Healer Focus Section - Two-Column Balanced Layout */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Therapist Focus Content Card */}
          <div className="w-full bg-gradient-to-br from-[#1E4D36] via-[#173E2B] to-[#0F291C] text-white rounded-[2.5rem] p-8 lg:p-12 shadow-2xl relative overflow-hidden border border-white/5">
            
            {/* Soft decorative light leaks */}
            <div className="absolute -top-32 -right-32 w-[400px] h-[400px] bg-aakaa-gold/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Text Column */}
              <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-8">
                <div>
                  <span className="inline-block text-[9px] uppercase tracking-[0.25em] font-black bg-white/10 px-6 py-2.5 rounded-full border border-white/15 mb-6">
                    Specialized Therapist Care
                  </span>
                  
                  <h2 className="text-3xl lg:text-5xl font-black font-heading mb-6 leading-tight tracking-tight">
                    Holding Space for <br />
                    <span className="bg-gradient-to-r from-aakaa-gold via-white to-aakaa-gold bg-clip-text text-transparent">the Healers</span>
                  </h2>
                  <p className="text-white/80 text-xs md:text-sm leading-relaxed mb-4 font-medium">
                    Clinical therapists, psychologists, and counselors hold space for clients' heavy emotional challenges daily. Without active physical release, this vicarious trauma accumulates as chronic tension, leading to compassion fatigue and emotional burnout.
                  </p>
                  <p className="text-white/80 text-xs md:text-sm leading-relaxed font-medium">
                    Somatic yoga offers therapists a clinical tool of self preservation. By integrating body based mindfulness, you release stored energy from your psoas and shoulders, settle your nervous system, and return to center ensuring you can continue to hold space safely.
                  </p>
                </div>
                
                {/* Clean, Modern Left-Border Quote Accent Block */}
                <div className="border-l-4 border-aakaa-gold bg-white/5 pl-5 py-3 rounded-r-2xl max-w-xl">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-white/90 font-black leading-relaxed font-sans">
                    "To create space for others, you must first create space within yourself."
                  </span>
                </div>
              </div>

              {/* Image Column */}
              <div className="lg:col-span-5 relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-aakaa-green/20 to-transparent rounded-[2rem] -z-10 group-hover:scale-105 transition-transform duration-700"></div>
                <img 
                  src="https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?q=80&w=1000&auto=format&fit=crop" 
                  alt="Restorative somatic yoga stretch in a peaceful setting" 
                  className="w-full h-[280px] lg:h-[360px] object-cover rounded-[2rem] shadow-2xl border border-white/10 group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>

            </div>
          </div>
        </motion.section>

        {/* Pricing Tiers Section: Monthly Pass & Private Sessions separated */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="space-y-12"
        >
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-extrabold text-gray-900 font-heading tracking-tight">Flexible Somatic Programs</h2>
            <p className="text-gray-500 text-xs md:text-sm font-semibold">Choose between unlimited group access or individual custom alignment sessions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Monthly Pass Card */}
            <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 lg:p-10 border border-white hover:shadow-xl hover:shadow-aakaa-green/5 transition-all duration-500 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-aakaa-green/5 rounded-full blur-2xl"></div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="px-5 py-1.5 bg-aakaa-green/10 text-aakaa-green rounded-full text-[10px] font-black uppercase tracking-wider">
                    Unlimited Access
                  </span>
                  <span className="text-xs text-gray-400 font-bold">Group Classes</span>
                </div>
                
                <div>
                  <h3 className="text-2xl font-black text-gray-800 font-heading">Monthly Unlimited Pass</h3>
                  <p className="text-gray-500 text-xs mt-2 leading-relaxed">
                    Gain full access to all 6 scheduled weekly live classes. Perfect for maintaining a consistent, daily somatic routine to keep stress at bay.
                  </p>
                </div>

                <div className="pt-4 flex items-baseline gap-1.5 border-t border-gray-100">
                  <span className="text-4xl font-black text-aakaa-green">₹2,499</span>
                  <span className="text-xs text-gray-400 font-bold">/ Month</span>
                </div>

                <ul className="space-y-2.5 text-xs text-gray-600 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-aakaa-green shrink-0" />
                    Access to all 6 live yoga classes weekly
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-aakaa-green shrink-0" />
                    Recording library of previous classes
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-aakaa-green shrink-0" />
                    Cancel or pause membership anytime
                  </li>
                </ul>
              </div>

              <button
                onClick={openMonthlyBooking}
                className="w-full mt-8 py-4 bg-aakaa-green text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-aakaa-green/90 transition-all shadow-md"
              >
                Purchase Monthly Pass
              </button>
            </div>

            {/* 1-on-1 Private Session Card */}
            <div className="bg-gradient-to-br from-[#1E4D36] to-[#0F291C] text-white rounded-[2.5rem] p-8 lg:p-10 hover:shadow-xl hover:shadow-aakaa-green/10 transition-all duration-500 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="px-5 py-1.5 bg-white/10 text-aakaa-gold rounded-full text-[10px] font-black uppercase tracking-wider border border-white/10">
                    Bespoke Somatics
                  </span>
                  <span className="text-xs text-white/50 font-bold">1-on-1 Guidance</span>
                </div>
                
                <div>
                  <h3 className="text-2xl font-black text-white font-heading">Private Somatic Session</h3>
                  <p className="text-white/70 text-xs mt-2 leading-relaxed">
                    Book a dedicated 60 minute, 1-on-1 alignment session. Get custom physical posturing and breath mapping designed for your specific nervous system goals.
                  </p>
                </div>

                <div className="pt-4 flex items-baseline gap-1.5 border-t border-white/10">
                  <span className="text-4xl font-black text-aakaa-gold">₹850</span>
                  <span className="text-xs text-white/40 font-bold">/ Session</span>
                </div>

                <ul className="space-y-2.5 text-xs text-white/70 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-aakaa-gold shrink-0" />
                    Personalized attention to physical tension blocks
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-aakaa-gold shrink-0" />
                    Flexible timing based on your availability
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-aakaa-gold shrink-0" />
                    Choice of certified yoga therapist
                  </li>
                </ul>
              </div>

              <button
                onClick={openPrivateBooking}
                className="w-full mt-8 py-4 bg-white text-aakaa-green font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-white/95 transition-all shadow-md shadow-white/5"
              >
                Book Private Session
              </button>
            </div>

          </div>
        </motion.section>

        {/* The Science of Somatic Healing Section */}
        <motion.section 
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="space-y-12"
        >
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-extrabold text-gray-900 font-heading tracking-tight">The Science of Somatic Healing</h2>
            <p className="text-gray-500 text-xs md:text-sm font-semibold">Discover how intentional movement bridges physiological regulation and mental clarity.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white/75 backdrop-blur-sm rounded-3xl p-8 border border-white/60 hover:bg-white hover:border-aakaa-green/10 hover:shadow-[0_20px_50px_rgba(30,77,54,0.06)] hover:-translate-y-1.5 transition-all duration-500 space-y-4">
              <div className="w-12 h-12 bg-aakaa-green/5 rounded-2xl flex items-center justify-center text-aakaa-green">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 font-heading">Nervous System Calibration</h3>
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed font-medium">
                Yoga exercises stimulate the Vagus nerve, triggering a shift from the sympathetic nervous system (fight-or-flight) to the parasympathetic mode (rest-and-digest). This lowers heart rate and blood pressure, physically shutting down panic cycles.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white/75 backdrop-blur-sm rounded-3xl p-8 border border-white/60 hover:bg-white hover:border-aakaa-green/10 hover:shadow-[0_20px_50px_rgba(30,77,54,0.06)] hover:-translate-y-1.5 transition-all duration-500 space-y-4">
              <div className="w-12 h-12 bg-aakaa-green/5 rounded-2xl flex items-center justify-center text-aakaa-green">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 font-heading">Trauma & Somatic Release</h3>
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed font-medium">
                Emotional trauma and stress manifest physically, causing tightness in muscle groups like the psoas (hip flexors), shoulders, and jaw. Focused postures stretch the myofascial tissues, helping release trapped somatic tension.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white/75 backdrop-blur-sm rounded-3xl p-8 border border-white/60 hover:bg-white hover:border-aakaa-green/10 hover:shadow-[0_20px_50px_rgba(30,77,54,0.06)] hover:-translate-y-1.5 transition-all duration-500 space-y-4">
              <div className="w-12 h-12 bg-aakaa-green/5 rounded-2xl flex items-center justify-center text-aakaa-green">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 font-heading">Interoceptive Focus</h3>
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed font-medium">
                Interoception is the brain's ability to sense inner physical signals. Practicing yoga trains minds to observe sensations without judgment, teaching individuals that anxiety symptoms (like racing chest) are transient physical states.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Classes Catalog Grid */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="space-y-12"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200/60 pb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 font-heading tracking-tight">Upcoming Wellness Sessions</h2>
              <p className="text-gray-500 text-xs md:text-sm font-semibold mt-1">Book individual online classes led by somatic instructors.</p>
            </div>
            
            {/* Level Filters */}
            <div className="flex flex-wrap gap-2.5">
              {["All", "Beginner", "Intermediate", "All Levels"].map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                    selectedLevel === level
                      ? "bg-aakaa-green text-white shadow-lg shadow-aakaa-green/20"
                      : "bg-white text-gray-600 border border-gray-100 hover:border-aakaa-green/30"
                  }`}
                >
                  {level === "All" ? "All Classes" : level}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <div className="animate-spin w-10 h-10 border-4 border-aakaa-green border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500 font-bold">Gathering our schedules...</p>
            </div>
          ) : error ? (
            <div className="py-16 text-center max-w-md mx-auto">
              <div className="bg-red-50 text-red-500 rounded-3xl p-8 shadow-sm">
                <p className="font-semibold text-lg mb-2">Oops!</p>
                <p className="text-sm opacity-90">{error}</p>
              </div>
            </div>
          ) : filteredClasses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredClasses.map((yogaClass) => {
                const spotsLeft = yogaClass.capacity - yogaClass.bookedSpots;
                const isFull = spotsLeft <= 0;

                return (
                  <div
                    key={yogaClass._id}
                    className="group bg-white rounded-[2rem] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_rgba(30,77,54,0.08)] hover:-translate-y-2 transition-all duration-500 flex flex-col border border-white"
                  >
                    {/* Class Banner Image */}
                    <div className="h-56 overflow-hidden relative">
                      <img
                        src={yogaClass.image}
                        alt={yogaClass.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider text-aakaa-green shadow-sm border border-aakaa-green/5">
                        {yogaClass.level}
                      </div>
                    </div>

                    {/* Class Info */}
                    <div className="p-8 flex flex-col flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 leading-snug group-hover:text-aakaa-green transition-colors font-heading tracking-tight">
                        {yogaClass.title}
                      </h3>
                      <p className="text-gray-500 text-xs mb-6 line-clamp-3 leading-relaxed font-medium">
                        {yogaClass.description}
                      </p>

                      {/* Meta stats */}
                      <div className="space-y-4 mb-6 text-xs text-gray-600 font-medium">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-aakaa-green/5 flex items-center justify-center text-aakaa-green">
                            <Calendar className="w-3.5 h-3.5" />
                          </div>
                          <span>{yogaClass.date}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-aakaa-green/5 flex items-center justify-center text-aakaa-green">
                            <Clock className="w-3.5 h-3.5" />
                          </div>
                          <span>{yogaClass.time} ({yogaClass.duration})</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-aakaa-green/5 flex items-center justify-center text-aakaa-green">
                            <User className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="font-bold text-gray-800">{yogaClass.instructorName}</span>
                            <span className="text-[10px] text-gray-400 block font-semibold">{yogaClass.instructorTitle}</span>
                          </div>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-gray-100 my-4 pt-4 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-semibold">Price</span>
                          <span className="text-2xl font-black text-aakaa-green">₹{yogaClass.price} / Class</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-semibold">Availability</span>
                          {isFull ? (
                            <span className="text-red-500 font-black text-xs uppercase tracking-wider">Class Full</span>
                          ) : (
                            <span className="text-gray-700 font-bold text-xs">{spotsLeft} / {yogaClass.capacity} Spots Left</span>
                          )}
                        </div>
                      </div>

                      {/* Book Now Button */}
                      <button
                        disabled={isFull}
                        onClick={() => openClassBooking(yogaClass)}
                        className={`w-full mt-4 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] text-center transition-all duration-300 ${
                          isFull
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-aakaa-green text-white hover:bg-aakaa-green/90 shadow-md hover:shadow-lg shadow-aakaa-green/10"
                        }`}
                      >
                        {isFull ? "Fully Booked" : "Book Class"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-20 text-center max-w-md mx-auto">
              <p className="text-gray-500 font-medium text-lg">No classes found in this category.</p>
              <p className="text-gray-400 text-sm mt-2">Check back later or view all categories.</p>
            </div>
          )}
        </motion.section>

      </main>

      {/* Booking Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            ></motion.div>

            {/* Content Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10 border border-gray-100"
            >
              {/* Header */}
              <div className="bg-aakaa-green text-white px-8 py-6 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/70 block font-bold">
                    {bookingType === "class" ? "Class Booking" : bookingType === "monthly" ? "Monthly Program" : "1-on-1 Booking"}
                  </span>
                  <h3 className="text-xl font-bold font-heading">
                    {bookingType === "class" ? bookingClass?.title : bookingType === "monthly" ? "Monthly Unlimited Pass" : "Private Somatic Session"}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-8 text-sm text-gray-700">
                {bookingSuccess ? (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 animate-bounce" />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-2 font-heading">Booking Confirmed!</h4>
                    <p className="text-gray-600 mb-6 text-sm">
                      We've reserved your spot. A confirmation email has been simulated and sent to <span className="font-semibold">{bookingSuccess.userEmail}</span>.
                    </p>

                    <div className="bg-aakaa-cream p-5 rounded-2xl border border-gray-100 text-left mb-8">
                      <div className="flex items-start gap-3.5">
                        <Info className="w-5 h-5 text-aakaa-green mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-gray-800">Your Streaming Link / Details</p>
                          {bookingType === "private" && (
                            <p className="text-xs text-gray-600 mt-1">
                              Instructor: <strong className="text-gray-800">{bookingSuccess.instructorName}</strong><br />
                              Schedule: <strong className="text-gray-800">{bookingSuccess.date} @ {bookingSuccess.time}</strong>
                            </p>
                          )}
                          <a
                            href={bookingSuccess.meetLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-aakaa-green font-mono break-all underline hover:text-aakaa-green/80 mt-2 block font-semibold"
                          >
                            {bookingSuccess.meetLink}
                          </a>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-8 py-3.5 bg-aakaa-green text-white rounded-2xl font-bold shadow-md hover:shadow-lg transition-all text-xs uppercase tracking-widest"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="space-y-5">
                    {/* Error Banner */}
                    {bookingError && (
                      <div className="bg-red-50 text-red-500 text-sm p-4 rounded-xl font-medium">
                        {bookingError}
                      </div>
                    )}

                    {/* Booking Details Summary */}
                    <div className="bg-aakaa-cream/50 p-4 rounded-2xl space-y-2 border border-gray-100/60 font-semibold text-gray-600">
                      {bookingType === "class" && bookingClass && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400 font-semibold">Instructor:</span>
                            <span className="font-bold text-gray-800">{bookingClass.instructorName}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400 font-semibold">Schedule:</span>
                            <span className="font-bold text-gray-800">{bookingClass.date} @ {bookingClass.time}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400 font-semibold">Amount Due:</span>
                            <span className="font-extrabold text-aakaa-green text-lg">₹{bookingClass.price}</span>
                          </div>
                        </>
                      )}
                      
                      {bookingType === "monthly" && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400 font-semibold">Program:</span>
                            <span className="font-bold text-gray-800">Monthly Unlimited Pass</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400 font-semibold">Validity:</span>
                            <span className="font-bold text-gray-800">30 Days (Group Sessions)</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400 font-semibold">Amount Due:</span>
                            <span className="font-extrabold text-aakaa-green text-lg">₹2,499</span>
                          </div>
                        </>
                      )}

                      {bookingType === "private" && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400 font-semibold">Program:</span>
                            <span className="font-bold text-gray-800">1-on-1 Somatic Guidance</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400 font-semibold">Amount Due:</span>
                            <span className="font-extrabold text-aakaa-green text-lg">₹850</span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Inputs */}
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Your Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl outline-none focus:border-aakaa-green transition-all text-sm text-gray-800 font-medium"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl outline-none focus:border-aakaa-green transition-all text-sm text-gray-800 font-medium"
                        placeholder="john@example.com"
                      />
                    </div>

                    {/* Extra fields for Private Sessions */}
                    {bookingType === "private" && (
                      <div className="space-y-4 border-t border-gray-100 pt-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Choose Somatic Guide</label>
                          <select
                            value={privateInstructor}
                            onChange={(e) => setPrivateInstructor(e.target.value)}
                            className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-aakaa-green text-sm text-gray-800 font-medium cursor-pointer"
                          >
                            <option value="Elena Rostova">Elena Rostova (Yoga & Breathwork)</option>
                            <option value="Swami Dhyan">Swami Dhyan (Meditation & Sound)</option>
                            <option value="Yogi Amrit">Yogi Amrit (Kundalini)</option>
                            <option value="Dr. Sarah Jenkins">Dr. Sarah Jenkins (Somatic Psychologist)</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Preferred Date</label>
                            <input
                              type="date"
                              required
                              value={privateDate}
                              onChange={(e) => setPrivateDate(e.target.value)}
                              className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-aakaa-green text-sm text-gray-800 font-medium"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Preferred Time</label>
                            <select
                              value={privateTime}
                              onChange={(e) => setPrivateTime(e.target.value)}
                              className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-aakaa-green text-sm text-gray-800 font-medium cursor-pointer"
                            >
                              <option value="08:00 AM">08:00 AM</option>
                              <option value="10:00 AM">10:00 AM</option>
                              <option value="12:00 PM">12:00 PM</option>
                              <option value="03:00 PM">03:00 PM</option>
                              <option value="05:00 PM">05:00 PM</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={bookingLoading}
                      className="w-full py-4 bg-aakaa-green text-white font-bold rounded-2xl shadow-lg shadow-aakaa-green/20 hover:bg-aakaa-green/95 transition-all text-center text-xs uppercase tracking-widest"
                    >
                      {bookingLoading 
                        ? "Processing Booking..." 
                        : bookingType === "class" 
                          ? `Confirm & Pay ₹${bookingClass?.price}` 
                          : bookingType === "monthly" 
                            ? "Confirm & Pay ₹2,499" 
                            : "Confirm & Pay ₹850"}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <MockPaymentModal 
        isOpen={isMockPaymentOpen}
        onClose={() => setIsMockPaymentOpen(false)}
        amount={getSelectedAmount()}
        orderId={currentOrder?.id}
        onPaymentSuccess={async (paymentResponse) => {
          setIsMockPaymentOpen(false);
          await handlePaymentSuccess(paymentResponse);
        }}
      />

      <Footer />
    </div>
  );
}
