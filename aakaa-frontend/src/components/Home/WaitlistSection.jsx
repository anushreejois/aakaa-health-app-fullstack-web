import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import waitlistImage from "../../assets/waitlist.jpg";
import { Smartphone, Mail, CheckCircle, ArrowRight } from "lucide-react";
import ScrollReveal from "../ui/ScrollReveal";

export default function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email) {
      try {
        const response = await fetch("http://localhost:5000/api/waitlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "New User", // Default for now, we can add a name field later
            email: email,
            concern: "General Mental Wellness", // Default for waitlist
          }),
        });

        if (response.ok) {
          setIsSubmitted(true);
        } else {
          const data = await response.json();
          alert(data.message || "Something went wrong. Please try again.");
        }
      } catch (error) {
        console.error("Error joining waitlist:", error);
        alert("Server is not responding. Please check your connection.");
      }
    }
  };

  return (
    <section
      id="waitlist"
      className="scroll-mt-24 pt-28 pb-4 bg-white relative overflow-hidden"
    >
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-0 w-1/3 h-1/2 bg-aakaa-gold/5 blur-[100px] -translate-y-1/2 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT CONTENT */}
          <ScrollReveal>
            <div>
              {/* Coming Soon Badge */}
              <div className="flex items-center gap-2 mb-6">
                <span className="bg-aakaa-gold/20 text-aakaa-green px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  Coming soon
                </span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
                Get ready to transform <br /> your mental wellness
              </h2>

              <p className="mt-6 text-gray-600 max-w-lg text-lg leading-relaxed">
                Aakaa is launching soon on iOS and Android. Join our waitlist now
                to secure your spot and receive exclusive benefits when we launch.
              </p>

              {/* Features */}
              <div className="mt-10 space-y-6">
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-aakaa-green/10 flex items-center justify-center text-aakaa-green transition-transform group-hover:scale-110">
                    <Smartphone size={22} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Available on iOS & Android</p>
                    <p className="text-sm text-gray-500">Global release coming soon</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-aakaa-green/10 flex items-center justify-center text-aakaa-green transition-transform group-hover:scale-110">
                    <Mail size={22} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Get Notified First</p>
                    <p className="text-sm text-gray-500">Early access and exclusive insights</p>
                  </div>
                </div>
              </div>

              {/* INTERACTIVE CTA */}
              <div className="mt-12">
                <AnimatePresence mode="wait">
                  {!isSubmitted ? (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onSubmit={handleSubmit}
                      className="flex flex-col sm:flex-row items-center gap-3 max-w-lg"
                    >
                      <div className="relative w-full">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-100 bg-white shadow-sm focus:outline-none focus:ring-4 focus:ring-aakaa-green/10 focus:border-aakaa-green transition-all"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full sm:w-auto shrink-0 bg-aakaa-green text-white px-8 py-4 rounded-full font-bold shadow-[0_12px_25px_rgba(30,77,54,0.3)] hover:shadow-[0_15px_35px_rgba(30,77,54,0.4)] transition-all hover:-translate-y-0.5"
                      >
                        Join Now
                      </button>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-4 bg-white p-6 rounded-3xl border border-aakaa-green/20 shadow-xl shadow-aakaa-green/5 max-w-md"
                    >
                      <div className="w-12 h-12 bg-aakaa-green text-white rounded-full flex items-center justify-center shrink-0">
                        <CheckCircle size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg">You're on the list!</p>
                        <p className="text-gray-500 text-sm">We'll reach out to you at {email} soon.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </ScrollReveal>

          {/* RIGHT IMAGE */}
          <ScrollReveal delay={150}>
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.15)] ring-1 ring-gray-100">
                <img
                  src={waitlistImage}
                  alt="Mental wellness app"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
