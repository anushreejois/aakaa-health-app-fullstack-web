import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import mindfulnessImage from "../../assets/mindfulness.jpg";

export default function HeroSection() {
  const [index, setIndex] = useState(0);
  const words = ["Mind", "Anxiety", "Stress", "Peace"];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative pt-36 pb-32 bg-aakaa-cream overflow-hidden">
      {/* Animated Background Blobs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
          y: [0, 50, 0] 
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-24 -left-24 w-96 h-96 bg-aakaa-green/5 rounded-full blur-[100px]"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          x: [0, -40, 0],
          y: [0, -60, 0] 
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-24 -right-24 w-[500px] h-[500px] bg-aakaa-gold/10 rounded-full blur-[120px]"
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-[56px] lg:text-[72px] xl:text-[80px] font-bold leading-[1.05] text-gray-900 tracking-tight">
            Master your <br />
            <span className="relative inline-block min-w-[280px]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={words[index]}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="text-aakaa-green inline-block"
                >
                  {words[index]}
                </motion.span>
              </AnimatePresence>
            </span>
            <br />
            with us
          </h1>


          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="mt-8 text-lg lg:text-xl text-gray-600 max-w-md leading-relaxed"
          >
            Aakaa is your personal mental wellness companion, designed to help you
            navigate life's challenges with guided support, mindfulness, and
            self-care tools.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-12 flex flex-wrap gap-5"
          >
            <a href="#waitlist" className="bg-aakaa-green text-white px-10 py-4 rounded-full hover:bg-aakaa-green/90 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(30,77,54,0.25)] transition-all duration-500 shadow-[0_12px_25px_rgba(30,77,54,0.15)] text-[13px] font-bold tracking-widest uppercase">
              Join Waitlist
            </a>

            <a href="/booking" className="inline-flex items-center border border-aakaa-green/10 text-aakaa-green px-10 py-4 rounded-full bg-white/40 backdrop-blur-md hover:bg-white/80 hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(0,0,0,0.03)] transition-all duration-500 text-[13px] font-bold tracking-widest uppercase">
              Book a Session
            </a>
          </motion.div>
        </motion.div>

        {/* RIGHT IMAGE CARD */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex justify-center md:justify-end"
        >
          <div className="relative group">
            {/* Pulsing Glow behind card */}
            <motion.div 
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -inset-10 bg-gradient-to-tr from-aakaa-green/20 via-aakaa-gold/20 to-transparent rounded-[3rem] blur-3xl" 
            />

            {/* Main Interactive Card */}
            <motion.div 
              whileHover={{ rotateY: 3, rotateX: -3, scale: 1.02 }}
              className="relative w-[340px] sm:w-[400px] h-[480px] sm:h-[560px] rounded-[2.8rem] overflow-hidden bg-white/60 backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,0.15)] border border-white/80 transition-shadow duration-500 group-hover:shadow-[0_45px_100px_rgba(0,0,0,0.2)]"
            >
              <img
                src={mindfulnessImage}
                alt="Mindfulness"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </motion.div>

            {/* Floating Element 1 */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-8 top-1/4 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Experts Available</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
