import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Heart, ShieldCheck, Sparkles } from "lucide-react";
import journeyImage from "../../assets/journey.jpg";
import ScrollReveal from "../ui/ScrollReveal";

export default function JourneySection() {
  const [isExpanded, setIsExpanded] = useState(false);

  const pillars = [
    {
      icon: Heart,
      title: "Personalized Guidance",
      desc: "Our algorithms and experts understand your unique mood patterns to suggest tailored mental exercises.",
      color: "bg-rose-50 text-rose-600"
    },
    {
      icon: ShieldCheck,
      title: "Trusted Professionals",
      desc: "Direct access to certified therapists across multiple specialties in a 100% private, secure environment.",
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: Sparkles,
      title: "Evidence-Based Tools",
      desc: "Methods rooted in Cognitive Behavioral Therapy (CBT) and Mindfulness to ensure measurable progress.",
      color: "bg-amber-50 text-amber-600"
    }
  ];

  return (
    <section
      id="about"
      className="scroll-mt-24 py-28 bg-aakaa-cream"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Top Badge */}
        <ScrollReveal>
          <div className="flex justify-center mb-16">
            <span className="bg-aakaa-green text-white px-8 py-3 rounded-full font-semibold shadow-[0_12px_30px_rgba(30,77,54,0.45)]">
              About Aakaa
            </span>
          </div>
        </ScrollReveal>

        {/* Content */}
        <ScrollReveal delay={120}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* LEFT IMAGE */}
            <div className="flex justify-center lg:justify-start">
              <div className="w-full max-w-md rounded-[2rem] overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.18)]">
                <img
                  src={journeyImage}
                  alt="Mental wellness journey"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* RIGHT CONTENT */}
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Your journey to mental wellness starts here.
              </h2>

              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed max-w-xl">
                  At Aakaa, we believe mental wellness is a journey, not a destination.
                  Our tools are designed to help you understand yourself better,
                  develop healthy habits, and find calm in everyday life.
                </p>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
                      className="overflow-hidden"
                    >
                      <p className="text-gray-600 leading-relaxed max-w-xl pb-6">
                        Whether you're feeling overwhelmed or simply want to improve your
                        emotional well-being, Aakaa is here to support you every step of
                        the way. We combine ancient wisdom with modern technology to create 
                        a sanctuary for your mind.
                      </p>

                      <div className="grid grid-cols-1 gap-4 pt-4 border-t border-gray-100">
                        {pillars.map((pillar, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 * idx + 0.2 }}
                            className="flex items-start gap-4 p-4 rounded-2xl bg-white/50 border border-white hover:border-aakaa-green/10 hover:bg-white transition-all group"
                          >
                            <div className={`p-3 rounded-xl ${pillar.color} transition-transform group-hover:scale-110`}>
                              <pillar.icon size={20} />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900 text-sm italic">{pillar.title}</h4>
                              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{pillar.desc}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-8 flex items-center gap-3 bg-aakaa-green text-white px-8 py-3.5 rounded-full font-bold hover:shadow-[0_20px_40px_rgba(30,77,54,0.3)] transition-all duration-300 group"
              >
                <span>{isExpanded ? "Show less" : "Learn more"}</span>
                <ChevronDown 
                  size={18} 
                  className={`transition-transform duration-500 ${isExpanded ? "rotate-180" : ""}`} 
                />
              </button>
            </div>

          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
