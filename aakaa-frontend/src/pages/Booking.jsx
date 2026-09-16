import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  Search, 
  ArrowLeft, 
  Video, 
  Star, 
  ChevronRight,
  Sparkles,
  ArrowRight,
  CreditCard,
  Smartphone,
  ShieldCheck,
  Receipt,
  Download,
  Lock
} from "lucide-react";
import Footer from "../components/Home/Footer";
import BookingQuiz from "../components/Booking/BookingQuiz";
import TherapistProfileView from "../components/Booking/TherapistProfileView";
import MockPaymentModal from "../components/Booking/MockPaymentModal";

const STEPS = {
  CHOICE: "choice",
  QUIZ: "quiz",
  MATCHMAKING: "matchmaking",
  RESULTS: "results",
  SCHEDULING: "scheduling",
  CHECKOUT: "checkout",
  PROCESSING: "processing",
  SUCCESS: "success"
};

export default function Booking() {
  const [step, setStep] = useState(STEPS.CHOICE);
  const [quizAnswers, setQuizAnswers] = useState(null);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [viewingProfile, setViewingProfile] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({ date: null, time: null });
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState("upi");
  
  // Availability states
  const [occupiedSlots, setOccupiedSlots] = useState([]);

  // Payment states
  const [currentOrder, setCurrentOrder] = useState(null);
  const [userData, setUserData] = useState({ name: "", email: "" });
  const [isMockPaymentOpen, setIsMockPaymentOpen] = useState(false);

  // Filter states

  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch real therapists from backend
  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/therapists");
        const data = await response.json();
        setTherapists(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching therapists:", error);
        setLoading(false);
      }
    };
    fetchTherapists();
  }, []);

  // Fetch occupied slots when therapist is selected (or when entering scheduling for Path A)
  useEffect(() => {
    if (step === STEPS.SCHEDULING) {
      setBookingDetails({ date: null, time: null });
      
      const fetchOccupiedSlots = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/bookings`);
          const allBookings = await response.json();
          
          let slots = [];
          if (selectedTherapist) {
            // Path B: Filter for the selected therapist
            const therapistBookings = allBookings.filter(b => {
              const bId = b.therapistId?._id || b.therapistId;
              return bId === selectedTherapist._id;
            });
            slots = therapistBookings.map(b => `${b.date}|${b.time}`);
          } else {
            // Path A: Mark slot as occupied if all therapists are booked at that time
            const bookingCounts = {};
            allBookings.forEach(b => {
              const key = `${b.date}|${b.time}`;
              bookingCounts[key] = (bookingCounts[key] || 0) + 1;
            });
            // Assuming max 3 therapists for demo
            slots = Object.keys(bookingCounts).filter(key => bookingCounts[key] >= 3);
          }
          
          setOccupiedSlots(slots);
        } catch (error) {
          console.error("Error fetching occupied slots:", error);
        }
      };
      fetchOccupiedSlots();
    }
  }, [step, selectedTherapist]);

  // Handle Quiz Completion
  const handleQuizComplete = (answers) => {
    setQuizAnswers(answers);
    if (answers.sessions) {
      setSelectedSessionType(answers.sessions);
    }
    setStep(STEPS.MATCHMAKING);
  };

  // Simulate "Matchmaking" logic
  useEffect(() => {
    if (step === STEPS.MATCHMAKING) {
      const timer = setTimeout(() => {
        setStep(STEPS.RESULTS);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Initiate Payment Gateway
  const handleInitiatePayment = async () => {
    try {
      const amount = selectedTherapist ? parseInt(selectedTherapist.price.replace(/[^0-9]/g, '')) : 850;
      
      const bookingData = {
          userName: userData.name || "Anonymous", 
          userEmail: userData.email || "guest@example.com",
          therapistId: selectedTherapist ? selectedTherapist._id : null,
          date: bookingDetails.date,
          time: bookingDetails.time
      };

      // 1. Create order on backend
      const response = await fetch(`http://localhost:5000/api/payments/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, bookingData, category: 'therapy' }) 
      });
      const order = await response.json();
      setCurrentOrder(order);

      // If backend returned a mock order (due to mock mode or API key failure)
      if (order.mock) {
        setIsMockPaymentOpen(true);
        return;
      }

      setStep(STEPS.PROCESSING);

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

    } catch (error) {
      console.error("Payment initiation failed:", error);
      alert("Payment service unavailable. Try again.");
      setStep(STEPS.CHECKOUT);
    }
  };

  // Verify and Finalize Booking
  const handlePaymentSuccess = async (paymentResponse) => {
    try {
      // Verify signature on backend
      const verifyRes = await fetch("http://localhost:5000/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...paymentResponse,
          orderId: currentOrder.orderId,
          pendingBookingId: currentOrder.pendingBookingId,
          category: 'therapy'
        })
      });
      const verifyData = await verifyRes.json();

      if (verifyData.status === 'success') {
        // Booking is already confirmed in backend verify route
        setStep(STEPS.SUCCESS);
      } else {
        alert("Payment verification failed.");
        setStep(STEPS.CHECKOUT);
      }
    } catch (error) {
      console.error("Verification failed:", error);
      setStep(STEPS.CHECKOUT);
    }
  };

  // Generate next 8 available dates (excluding Sundays)
  const availableDates = (() => {
    const dates = [];
    let current = new Date();
    // Start from today or tomorrow if today is Sunday
    if (current.getDay() === 0) current.setDate(current.getDate() + 1);
    
    while (dates.length < 8) {
      const dayName = current.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = current.getDate();
      const monthName = current.toLocaleDateString('en-US', { month: 'short' });
      
      if (current.getDay() !== 0) { // Skip Sundays
        dates.push({ 
          label: `${dayName} ${dayNum}`, 
          full: `${dayName} ${dayNum}, ${monthName}`,
          month: monthName,
          year: current.getFullYear()
        });
      }
      current.setDate(current.getDate() + 1);
    }
    return dates;
  })();

  const currentMonth = availableDates[0]?.month;
  const currentYear = availableDates[0]?.year;

  const checkAvailabilityBeforePayment = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings`);
      const allBookings = await response.json();
      
      let currentOccupied = [];
      if (selectedTherapist) {
        const therapistBookings = allBookings.filter(b => 
          (b.therapistId?._id || b.therapistId) === selectedTherapist._id
        );
        currentOccupied = therapistBookings.map(b => `${b.date}|${b.time}`);
      } else {
        const bookingCounts = {};
        allBookings.forEach(b => {
          const key = `${b.date}|${b.time}`;
          bookingCounts[key] = (bookingCounts[key] || 0) + 1;
        });
        currentOccupied = Object.keys(bookingCounts).filter(key => bookingCounts[key] >= 3);
      }
      
      const selection = `${bookingDetails.date}|${bookingDetails.time}`;
      if (currentOccupied.includes(selection)) {
        alert("Wait! Someone just booked this slot. Please choose another time.");
        setOccupiedSlots(currentOccupied); // Update UI to show it's taken
        setBookingDetails({ ...bookingDetails, time: null }); // Reset their time selection
        return false;
      }
      return true;
    } catch (error) {
      console.error("Availability check failed:", error);
      return true; // Proceed anyway, backend will catch it if it's really taken
    }
  };

  const handleSaveBooking = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: userData.name || "Anonymous", 
          userEmail: userData.email || "guest@example.com",
          therapistId: selectedTherapist ? selectedTherapist._id : null,
          date: bookingDetails.date,
          time: bookingDetails.time,
          status: selectedTherapist ? "confirmed" : "Pending Assignment"
        }),
      });

      if (response.ok) {
        setStep(STEPS.SUCCESS);
      } else {
        const errorData = await response.json();
        alert(errorData.msg || "Failed to save booking. Please try again.");
        setStep(STEPS.SCHEDULING); // Send them back to pick a new slot
      }
    } catch (error) {
      console.error("Error saving booking:", error);
      setStep(STEPS.CHECKOUT);
    }
  };

  // Framer Motion Variants
  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  const filteredTherapists = therapists.filter((therapist) => {

    // 2. Specialties filter (if any are selected)
    if (selectedSpecialties.length > 0) {
      const hasMatchingSpecialty = therapist.specialties.some((s) =>
        selectedSpecialties.includes(s)
      );
      if (!hasMatchingSpecialty) return false;
    }

    // 3. Availability filter (if any are selected)
    if (selectedAvailability.length > 0) {
      const hasMatchingDay = therapist.availability.some((day) =>
        selectedAvailability.includes(day)
      );
      if (!hasMatchingDay) return false;
    }

    // 4. Search query filter (if name or title matches)
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      if (!therapist.name.toLowerCase().includes(query) && !therapist.title.toLowerCase().includes(query)) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="bg-[#fdfdfc] min-h-screen">
      
      {/* Dynamic Header */}
      <div className="pt-28 pb-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <AnimatePresence mode="wait">
              {step === STEPS.CHOICE && (
                <motion.div key="header-choice" {...pageVariants}>
                  <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-4">
                    How would you like to <span className="text-aakaa-green">proceed?</span>
                  </h1>
                  <p className="text-lg text-gray-500 font-medium">Choose to browse our experts or let us find the perfect match for you.</p>
                </motion.div>
              )}
              {step === STEPS.RESULTS && (
                <motion.div key="header-results" {...pageVariants}>
                  <button 
                    onClick={() => setStep(STEPS.CHOICE)}
                    className="flex items-center gap-2 text-aakaa-green font-bold text-sm mb-4 hover:-translate-x-1 transition-transform"
                  >
                    <ArrowLeft size={16} /> Back to Options
                  </button>
                  <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-4">
                    Book a <span className="text-aakaa-green">Consultation</span>
                  </h1>
                  <p className="text-lg text-gray-500 font-medium">Filter by price, specialties, or availability to match with our certified therapists.</p>
                </motion.div>
              )}
              {step === STEPS.SCHEDULING && (
                <motion.div key="header-scheduling" {...pageVariants}>
                  <button 
                    onClick={() => setStep(selectedTherapist ? STEPS.RESULTS : STEPS.CHOICE)}
                    className="flex items-center gap-2 text-aakaa-green font-bold text-sm mb-4 hover:-translate-x-1 transition-transform"
                  >
                    <ArrowLeft size={16} /> Back to {selectedTherapist ? "Directory" : "Options"}
                  </button>
                  <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                    Pick a <span className="text-aakaa-green">convenient time</span>
                  </h1>
                </motion.div>
              )}
              {step === STEPS.CHECKOUT && (
                <motion.div key="header-checkout" {...pageVariants}>
                  <button 
                    onClick={() => setStep(STEPS.SCHEDULING)}
                    className="flex items-center gap-2 text-aakaa-green font-bold text-sm mb-4 hover:-translate-x-1 transition-transform"
                  >
                    <ArrowLeft size={16} /> Back to Schedule
                  </button>
                  <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                    Review & <span className="text-aakaa-green">Pay</span>
                  </h1>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {step === STEPS.RESULTS && (
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Search by name..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl w-full md:w-80 focus:ring-2 focus:ring-aakaa-green/20 transition-all font-medium text-sm"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
          )}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 lg:px-10 py-16 min-h-[600px]">
        <AnimatePresence mode="wait">
          
          {step === STEPS.CHOICE && (
            <motion.div key="step-choice" {...pageVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div 
                onClick={() => {
                  setSelectedTherapist(null);
                  setStep(STEPS.SCHEDULING);
                }}
                className="bg-white p-10 rounded-[2.5rem] border-2 border-transparent hover:border-aakaa-green cursor-pointer shadow-lg hover:shadow-2xl transition-all group flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 bg-aakaa-green/10 text-aakaa-green rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Sparkles size={32} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">Match me with an expert</h3>
                <p className="text-gray-500 font-medium">Skip the search. Pick a time that works for you and our team will assign the best therapist for your needs.</p>
              </div>

              <div 
                onClick={() => {
                  setStep(STEPS.RESULTS);
                }}
                className="bg-white p-10 rounded-[2.5rem] border-2 border-transparent hover:border-aakaa-green cursor-pointer shadow-lg hover:shadow-2xl transition-all group flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Search size={32} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">Browse therapists</h3>
                <p className="text-gray-500 font-medium">View our directory of certified professionals, filter by specialty, and pick the one you prefer.</p>
              </div>
            </motion.div>
          )}

          {/* STEP 3: RESULTS */}
          {step === STEPS.RESULTS && (
            <motion.div key="step-results" {...pageVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              
              {/* Left Column: Filter Sidebar */}
              <div className="lg:col-span-3 bg-white p-8 rounded-[2rem] border border-gray-100/60 shadow-[0_15px_40px_rgba(0,0,0,0.02)] space-y-8 sticky top-32">
                
                {/* 2. Specialties Filters */}
                <div className="space-y-4 pt-6 border-t border-gray-50">
                  <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">Specialties</h4>
                  <div className="space-y-2.5">
                    {["Anxiety", "Depression", "Relationships", "Work Stress", "Trauma", "Self Confidence", "Child Therapy"].map((spec) => {
                      const isChecked = selectedSpecialties.includes(spec);
                      return (
                        <label key={spec} className="flex items-center gap-3 cursor-pointer group text-xs text-gray-500 font-medium hover:text-aakaa-green transition-colors">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setSelectedSpecialties(selectedSpecialties.filter((s) => s !== spec));
                              } else {
                                setSelectedSpecialties([...selectedSpecialties, spec]);
                              }
                            }}
                            className="w-4.5 h-4.5 rounded-lg border-gray-200 text-aakaa-green focus:ring-aakaa-green/20 accent-aakaa-green cursor-pointer"
                          />
                          <span>{spec}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Availability Filters */}
                <div className="space-y-4 pt-6 border-t border-gray-50">
                  <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">Availability</h4>
                  <div className="space-y-2.5">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => {
                      const isChecked = selectedAvailability.includes(day);
                      return (
                        <label key={day} className="flex items-center gap-3 cursor-pointer group text-xs text-gray-500 font-medium hover:text-aakaa-green transition-colors">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setSelectedAvailability(selectedAvailability.filter((d) => d !== day));
                              } else {
                                setSelectedAvailability([...selectedAvailability, day]);
                              }
                            }}
                            className="w-4.5 h-4.5 rounded-lg border-gray-200 text-aakaa-green focus:ring-aakaa-green/20 accent-aakaa-green cursor-pointer"
                          />
                          <span>{day}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Reset Filters Button */}
                <button
                  onClick={() => {
                    setSelectedSpecialties([]);
                    setSelectedAvailability([]);
                    setSearchQuery("");
                  }}
                  className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-700 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all"
                >
                  Reset All Filters
                </button>
              </div>

              {/* Right Column: Therapist Grid */}
              <div className="lg:col-span-9">
                {filteredTherapists.length === 0 ? (
                  <div className="py-24 text-center bg-white rounded-[2rem] border border-gray-100 shadow-sm">
                    <p className="text-aakaa-gold text-lg font-bold">No specialists match your criteria.</p>
                    <p className="text-gray-400 text-xs mt-2">Try widening your price range or clearing some filters.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredTherapists.map((therapist, index) => (
                      <motion.div 
                        key={therapist.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100/60 hover:shadow-[0_20px_50px_rgba(30,77,54,0.06)] hover:border-aakaa-green/10 transition-all duration-500 flex flex-col justify-between"
                      >
                        <div>
                          <div className="relative h-60 overflow-hidden">
                            <img src={therapist.image} alt={therapist.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl flex items-center gap-1 shadow-sm border border-gray-50">
                              <Star size={14} className="text-amber-500 fill-amber-500" />
                              <span className="text-sm font-black text-gray-900">{therapist.rating}</span>
                            </div>
                          </div>
                          
                          <div className="p-8">
                            <div className="mb-5">
                              <h3 className="text-xl font-bold text-gray-900 group-hover:text-aakaa-green transition-colors font-heading leading-tight tracking-tight">{therapist.name}</h3>
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{therapist.title}</p>
                            </div>
                            
                            <div className="flex flex-wrap gap-1.5 mb-6">
                              {therapist.specialties.slice(0, 2).map(s => (
                                <span key={s} className="px-2.5 py-1 bg-gray-50 text-gray-500 text-[10px] font-bold rounded-lg border border-gray-100">{s}</span>
                              ))}
                              {therapist.specialties.length > 2 && (
                                <span className="px-2.5 py-1 bg-gray-50 text-gray-400 text-[10px] font-bold rounded-lg border border-gray-100">+{therapist.specialties.length - 2} more</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="px-8 pb-8">
                          <div className="flex items-center justify-between pt-5 border-t border-gray-50">
                            <div>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Session Fee</p>
                              <p className="text-xl font-black text-gray-900 mt-0.5">{therapist.price}</p>
                            </div>
                            <button 
                              onClick={() => setViewingProfile(therapist)}
                              className="w-12 h-12 flex items-center justify-center bg-gray-900 hover:bg-aakaa-green text-white rounded-2xl transition-all shadow-md hover:-translate-y-0.5"
                            >
                              <ChevronRight size={20} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

            </motion.div>
          )}

          {/* STEP 4: SCHEDULING */}
          {step === STEPS.SCHEDULING && (
            <motion.div key="step-scheduling" {...pageVariants} className="max-w-4xl mx-auto">
              <div className="bg-white rounded-[3rem] p-12 border border-gray-100 shadow-2xl">
                {selectedTherapist ? (
                  <div className="flex items-center gap-6 mb-12 pb-8 border-b border-gray-50">
                    <img src={selectedTherapist.image} alt={selectedTherapist.name} className="w-20 h-20 rounded-3xl object-cover shadow-lg" />
                    <div>
                      <p className="text-sm font-bold text-aakaa-green uppercase tracking-widest mb-1">Your selection</p>
                      <h3 className="text-3xl font-black text-gray-900">{selectedTherapist.name}</h3>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-6 mb-12 pb-8 border-b border-gray-50">
                    <div className="w-20 h-20 rounded-3xl bg-aakaa-green/10 text-aakaa-green flex items-center justify-center shadow-lg">
                      <Sparkles size={32} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-aakaa-green uppercase tracking-widest mb-1">Automated Match</p>
                      <h3 className="text-3xl font-black text-gray-900">Let us find the right expert</h3>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <h4 className="flex items-center gap-3 text-lg font-bold text-gray-900">
                        <Calendar size={20} className="text-aakaa-green" /> Select a date
                      </h4>
                      <span className="text-sm font-black text-aakaa-gold uppercase tracking-[0.2em] bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                        {currentMonth} {currentYear}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-4 gap-4">
                      {availableDates.map((d, i) => (
                        <button 
                          key={d.label}
                          onClick={() => setBookingDetails({ ...bookingDetails, date: d.full })}
                          className={`p-5 rounded-[2rem] border-2 transition-all flex flex-col items-center justify-center gap-1.5 ${bookingDetails.date === d.full ? "border-aakaa-green bg-aakaa-green/5 text-aakaa-green ring-4 ring-aakaa-green/10" : "border-gray-50 hover:border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50/50"}`}
                        >
                          <span className="text-[10px] font-black uppercase tracking-widest">{d.label.split(' ')[0]}</span>
                          <span className="text-xl font-black">{d.label.split(' ')[1]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="flex items-center gap-3 text-lg font-bold text-gray-900 mb-8">
                      <Clock size={20} className="text-aakaa-green" /> Available slots
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      {["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM", "06:00 PM"].map((t) => {
                        const isOccupied = occupiedSlots.includes(`${bookingDetails.date}|${t}`);
                        return (
                          <button 
                            key={t}
                            disabled={isOccupied}
                            onClick={() => setBookingDetails({ ...bookingDetails, time: t })}
                            className={`w-full p-6 rounded-[1.5rem] border-2 transition-all flex items-center justify-between ${
                              isOccupied 
                                ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed" 
                                : bookingDetails.time === t 
                                  ? "border-aakaa-green bg-aakaa-green/5 text-aakaa-green ring-4 ring-aakaa-green/10" 
                                  : "border-gray-50 hover:border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50/50"
                            }`}
                          >
                            <div className="flex flex-col items-start">
                              <span className="font-black">{t}</span>
                              {isOccupied && <span className="text-[10px] font-bold uppercase text-red-400">Already Booked</span>}
                            </div>
                            {bookingDetails.time === t && !isOccupied && <CheckCircle size={20} />}
                            {isOccupied && <Lock size={18} className="opacity-40" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-12">
                  <button 
                    disabled={!bookingDetails.date || !bookingDetails.time}
                    onClick={async () => {
                      const isAvailable = await checkAvailabilityBeforePayment();
                      if (isAvailable) setStep(STEPS.CHECKOUT);
                    }}
                    className="w-full bg-aakaa-green text-white py-5 rounded-[1.5rem] font-black text-lg shadow-[0_20px_50px_rgba(30,77,54,0.3)] hover:shadow-[0_25px_60px_rgba(30,77,54,0.4)] disabled:opacity-30 disabled:translate-y-0 hover:-translate-y-1 transition-all flex items-center justify-center gap-4"
                  >
                    Continue to Payment <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 5: CHECKOUT */}
          {step === STEPS.CHECKOUT && (
            <motion.div key="step-checkout" {...pageVariants} className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Payment Methods */}
              <div className="space-y-8">
                <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-xl">
                  <h4 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                    <CheckCircle size={24} className="text-aakaa-green" /> Personal Information
                  </h4>
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black text-aakaa-gold uppercase tracking-widest mb-2 block">Full Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Aman Gupta"
                        value={userData.name}
                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                        className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-aakaa-green focus:bg-white rounded-2xl transition-all font-bold outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-aakaa-gold uppercase tracking-widest mb-2 block">Email Address</label>
                      <input 
                        type="email" 
                        placeholder="aman@example.com"
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-aakaa-green focus:bg-white rounded-2xl transition-all font-bold outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-xl">
                  <h4 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                    <ShieldCheck size={24} className="text-aakaa-green" /> Select Payment Method
                  </h4>
                  
                  <div className="space-y-4">
                    {[
                      { id: "upi", label: "UPI (Google Pay, PhonePe)", icon: Smartphone },
                      { id: "card", label: "Credit / Debit Card", icon: CreditCard },
                      { id: "net", label: "Net Banking", icon: Sparkles }
                    ].map((method) => (
                      <button 
                        key={method.id}
                        onClick={() => setSelectedPayment(method.id)}
                        className={`w-full p-6 rounded-2xl border-2 flex items-center justify-between transition-all ${selectedPayment === method.id ? "border-aakaa-green bg-aakaa-green/5 ring-4 ring-aakaa-green/10" : "border-gray-50 hover:border-gray-200"}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${selectedPayment === method.id ? "bg-aakaa-green text-white" : "bg-gray-50 text-gray-400"}`}>
                            <method.icon size={20} />
                          </div>
                          <span className={`font-bold ${selectedPayment === method.id ? "text-gray-900" : "text-gray-500"}`}>{method.label}</span>
                        </div>
                        {selectedPayment === method.id && <div className="w-6 h-6 bg-aakaa-green rounded-full flex items-center justify-center text-white"><CheckCircle size={14} /></div>}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 p-6 bg-blue-50/50 rounded-3xl border border-blue-100">
                  <Lock size={20} className="text-blue-500" />
                  <p className="text-sm font-medium text-blue-700">All transactions are encrypted with 256-bit SSL security. Your session is 100% confidential.</p>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-aakaa-green/5 rounded-full -translate-y-16 translate-x-16" />
                  
                  <h4 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                    <Receipt size={24} className="text-aakaa-green" /> Order Summary
                  </h4>

                  <div className="space-y-6 mb-10 pb-10 border-b border-gray-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-black text-gray-900 text-lg">{selectedTherapist ? selectedTherapist.name : "Assigned Expert"}</p>
                        <p className="text-sm text-gray-400 font-bold uppercase">{selectedTherapist ? selectedTherapist.title : "To be matched"}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-gray-900">{bookingDetails.date}</p>
                        <p className="text-sm text-gray-500 font-bold">{bookingDetails.time}</p>
                      </div>
                    </div>

                    <div className="space-y-4 pt-6">
                      <div className="flex justify-between text-gray-500 font-medium">
                        <span>Consultation Fee</span>
                        <span>{selectedTherapist ? selectedTherapist.price : "₹850"}</span>
                      </div>
                      <div className="flex justify-between text-gray-500 font-medium">
                        <span>Platform Fee</span>
                        <span className="text-emerald-500">FREE</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-end mb-12">
                    <div>
                      <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                      <h3 className="text-4xl font-black text-gray-900 leading-none">{selectedTherapist ? selectedTherapist.price : "₹850"}</h3>
                    </div>
                    <ShieldCheck size={40} className="text-gray-100" />
                  </div>

                  <button 
                    disabled={!userData.name || !userData.email}
                    onClick={handleInitiatePayment}
                    className="w-full bg-aakaa-green text-white py-6 rounded-[2rem] font-black text-xl shadow-[0_20px_50px_rgba(30,77,54,0.3)] hover:shadow-[0_25px_60px_rgba(30,77,54,0.4)] hover:-translate-y-1 transition-all flex items-center justify-center gap-4 disabled:opacity-30 disabled:translate-y-0"
                  >
                    Pay & Confirm <ArrowRight size={24} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 6: PROCESSING */}
          {step === STEPS.PROCESSING && (
            <motion.div 
              key="step-processing" 
              {...pageVariants}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="relative w-40 h-40 mb-12">
                <motion.div 
                  animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-[6px] border-aakaa-green/5 border-t-aakaa-green rounded-full"
                />
                <motion.div 
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-8 bg-aakaa-green/10 rounded-full flex items-center justify-center text-aakaa-green shadow-inner"
                >
                  <Lock size={40} />
                </motion.div>
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Securing your session...</h3>
              <p className="text-gray-500 font-medium text-lg">We are encrypting your transaction and notifying the therapist.</p>
            </motion.div>
          )}

          {/* STEP 7: SUCCESS */}
          {step === STEPS.SUCCESS && (
            <motion.div 
              key="step-success" 
              {...pageVariants}
              className="flex flex-col items-center justify-center py-16 text-center max-w-2xl mx-auto"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12, stiffness: 200 }}
                className="w-32 h-32 bg-aakaa-green/10 text-aakaa-green rounded-full flex items-center justify-center mb-10 shadow-2xl shadow-aakaa-green/20"
              >
                <CheckCircle size={64} />
              </motion.div>
              
              <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tight">Booking Confirmed!</h2>
              
              <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 w-full mb-12 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-aakaa-green" />
                <div className="grid grid-cols-2 gap-8 text-left mb-8">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Patient Details</p>
                    <p className="font-black text-gray-900">{userData.name}</p>
                    <p className="text-sm text-gray-500 font-medium">{userData.email}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Session Receipt</p>
                    <p className="font-black text-gray-900">#AK-984421</p>
                    <p className="text-sm text-emerald-500 font-bold uppercase tracking-tighter">Status: Paid</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                  <Video size={20} className="text-aakaa-green" />
                  <p className="text-sm font-bold text-gray-700">Google Meet link sent to your email.</p>
                </div>
              </div>

              <div className="flex gap-4 w-full">
                <button className="flex-1 py-5 bg-gray-900 text-white rounded-2xl font-bold shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3">
                  <Download size={20} /> Get Receipt
                </button>
                <button 
                  onClick={() => setStep(STEPS.RESULTS)}
                  className="flex-1 py-5 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                >
                  Return Home
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

        {viewingProfile && (
          <TherapistProfileView 
            therapist={viewingProfile} 
            onClose={() => setViewingProfile(null)} 
            onBook={() => {
              setSelectedTherapist(viewingProfile);
              setViewingProfile(null);
              setStep(STEPS.SCHEDULING);
            }}
          />
        )}

        <MockPaymentModal 
          isOpen={isMockPaymentOpen}
          onClose={() => setIsMockPaymentOpen(false)}
          amount={1003}
          orderId={currentOrder?.id}
          onPaymentSuccess={async (paymentResponse) => {
            setIsMockPaymentOpen(false);
            setStep(STEPS.PROCESSING);
            await handlePaymentSuccess(paymentResponse);
          }}
        />

      <Footer />
    </div>
  );
}
