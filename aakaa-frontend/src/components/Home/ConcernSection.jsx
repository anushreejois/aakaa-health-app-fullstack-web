import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, Briefcase, Heart, Smile, ArrowLeft, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const concerns = [
  { label: "Anxiety & Panic", icon: Brain, color: "bg-blue-50/50" },
  { label: "Work Stress", icon: Briefcase, color: "bg-orange-50/50" },
  { label: "Emotional Burnout", icon: Heart, color: "bg-rose-50/50" },
  { label: "Self Confidence", icon: Smile, color: "bg-amber-50/50" },
];

export default function ConcernSection() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");

  const selectedConcern = selected !== null ? concerns[selected].label : "";
  const [bgColor, setBgColor] = useState("bg-white");

  useEffect(() => {
    if (selected !== null) {
      setBgColor(concerns[selected].color);
    } else {
      setBgColor("bg-white");
    }
  }, [selected]);

  return (
    <section className={`py-32 transition-colors duration-700 relative overflow-hidden ${bgColor}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center relative z-10">
        <AnimatePresence mode="wait">

        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
          >
            {/* Heading */}
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
              What’s Your Primary Concern?
            </h2>

            <p className="mt-5 text-gray-600 max-w-xl mx-auto text-lg">
              Choose what best describes how you’re feeling right now.
            </p>

            {/* Cards */}
            <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {concerns.map((item, index) => {
                const Icon = item.icon;
                const isActive = selected === index;

                return (
                  <motion.div
                    key={index}
                    whileHover={{ y: -10, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelected(index)}
                    className={`
                      cursor-pointer rounded-[2.5rem] p-10 text-center transition-all duration-500
                      backdrop-blur-xl border
                      ${
                        isActive
                          ? "bg-white border-aakaa-green shadow-[0_30px_60px_rgba(30,77,54,0.15)] ring-4 ring-aakaa-green/5"
                          : "bg-white/40 border-white/80 hover:border-aakaa-green/30 shadow-[0_15px_40px_rgba(0,0,0,0.04)]"
                      }
                    `}
                  >
                    <div className={`mx-auto w-16 h-16 flex items-center justify-center rounded-2xl mb-8 transition-colors duration-500 ${
                      isActive ? "bg-aakaa-green text-white" : "bg-aakaa-green/10 text-aakaa-green hover:bg-aakaa-green hover:text-white"
                    }`}>
                      <Icon size={30} />
                    </div>

                    <h3 className={`font-bold text-lg transition-colors duration-500 ${isActive ? "text-aakaa-green" : "text-gray-800"}`}>
                      {item.label}
                    </h3>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA */}
            <button
              onClick={() => {
                if (selected !== null) navigate("/professional-care");
              }}
              disabled={selected === null}
              className={`
                mt-20 px-12 py-4 rounded-full font-bold text-lg transition-all duration-500 transform
                ${
                  selected !== null
                    ? "bg-aakaa-green text-white hover:bg-aakaa-green/90 shadow-[0_20px_40px_rgba(30,77,54,0.35)] hover:-translate-y-1 active:scale-95"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed opacity-70"
                }
              `}
            >
              Continue My Journey
            </button>
          </motion.div>
        )}

        </AnimatePresence>
      </div>

      {/* Decorative blurred blobs for background (animated with Framer Motion) */}
      <motion.div 
        animate={{ 
          y: [0, 40, 0], 
          x: [0, 20, 0],
          scale: [1, 1.1, 1] 
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-10 w-80 h-80 bg-aakaa-green/10 rounded-full filter blur-3xl opacity-50 pointer-events-none"
      ></motion.div>
      <motion.div 
        animate={{ 
          y: [0, -40, 0], 
          x: [0, -20, 0],
          scale: [1, 1.2, 1] 
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-0 right-10 w-96 h-96 bg-aakaa-gold/15 rounded-full filter blur-3xl opacity-40 pointer-events-none"
      ></motion.div>
    </section>
  );
}
