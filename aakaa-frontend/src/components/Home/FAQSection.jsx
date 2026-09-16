import { useState } from "react";
import { Plus, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "../ui/ScrollReveal";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: "What is Aakaa?",
      a: "Aakaa is a mental wellness platform designed to help you manage stress, anxiety, and emotional well-being through guided tools and personalized support.",
    },
    {
      q: "Who can use Aakaa?",
      a: "Aakaa is designed for students, working professionals, and anyone looking to improve their mental and emotional well-being.",
    },
    {
      q: "Is Aakaa suitable for beginners?",
      a: "Yes. Aakaa is beginner-friendly and guides you step by step, whether you are new to mindfulness or already practicing mental wellness.",
    },
    {
      q: "Is my data safe on Aakaa?",
      a: "Absolutely. Your privacy is our top priority. All personal data is securely handled and never shared without your consent.",
    },
    {
      q: "Can I use Aakaa anonymously?",
      a: "Yes. You can explore several features without sharing personal information, allowing you to feel safe and comfortable.",
    },
    {
      q: "Is Aakaa free to use?",
      a: "Aakaa offers both free and premium features. You can start with free tools and upgrade anytime based on your needs.",
    },
    {
      q: "Will Aakaa replace therapy?",
      a: "No. Aakaa is designed to support your mental wellness journey, not replace professional therapy. We encourage seeking professional help when needed.",
    },
    {
      q: "Is Aakaa available on mobile?",
      a: "Yes. Aakaa will be available on both iOS and Android devices, designed with a mobile-first experience.",
    },
    {
      q: "How often should I use Aakaa?",
      a: "You can use Aakaa daily or whenever you feel the need. Even a few minutes a day can make a meaningful difference.",
    },
    {
      q: "How do I join the waitlist?",
      a: "You can join the waitlist by clicking the ‘Join Waitlist’ button and subscribing with your email to receive early access updates.",
    },
  ];

  return (
    <section
      id="faq"
      className="scroll-mt-24 py-28 bg-aakaa-cream"
    >
      <div className="max-w-4xl mx-auto px-6 lg:px-10">

        {/* Badge */}
        <ScrollReveal>
          <div className="flex justify-center mb-10">
            <span className="bg-aakaa-green text-white px-8 py-3 rounded-full font-semibold shadow-[0_12px_30px_rgba(30,77,54,0.45)]">
              FAQs
            </span>
          </div>
        </ScrollReveal>

        {/* Heading */}
        <ScrollReveal delay={100}>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-gray-600">
              Everything you need to know about Aakaa and how it supports your
              mental wellness journey.
            </p>
          </div>
        </ScrollReveal>

        {/* FAQ Items */}
        <div className="mt-20 space-y-6">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <ScrollReveal key={index} delay={index * 80}>
                <motion.div 
                  layout
                  className="bg-white rounded-[2rem] shadow-[0_15px_40px_rgba(0,0,0,0.06)] border border-white overflow-hidden transition-shadow hover:shadow-[0_20px_50px_rgba(30,77,54,0.08)]"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full flex justify-between items-center px-10 py-7 text-left transition-colors"
                  >
                    <span className={`text-base font-bold tracking-tight transition-colors duration-300 ${isOpen ? 'text-aakaa-green' : 'text-gray-900'}`}>
                      {item.q}
                    </span>

                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0, color: isOpen ? "#1E4D36" : "#4B5563" }}
                      className="text-gray-400"
                    >
                      <ChevronDown size={24} />
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                      >
                        <div className="px-10 pb-7 text-gray-500 leading-relaxed text-[15px] font-medium max-w-2xl">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}
