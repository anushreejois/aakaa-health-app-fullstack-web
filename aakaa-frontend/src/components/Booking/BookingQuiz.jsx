import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Brain, Heart, Sparkles, MessageCircle, Zap } from "lucide-react";

const questions = [
  {
    id: "need",
    question: "What brings you to Aakaa today?",
    options: [
      { id: "anxiety", label: "Managing Anxiety", icon: Zap, color: "text-amber-500 bg-amber-50" },
      { id: "stress", label: "Work or Life Stress", icon: Brain, color: "text-blue-500 bg-blue-50" },
      { id: "relationships", label: "Relationship Support", icon: Heart, color: "text-rose-500 bg-rose-50" },
      { id: "growth", label: "Personal Growth", icon: Sparkles, color: "text-purple-500 bg-purple-50" },
    ]
  },
  {
    id: "style",
    question: "What's your preferred therapy style?",
    options: [
      { id: "structured", label: "Structured & Practical", icon: MessageCircle, color: "text-emerald-500 bg-emerald-50" },
      { id: "empathetic", label: "Empathetic & Listening", icon: Heart, color: "text-pink-500 bg-pink-50" },
      { id: "analytical", label: "Analytical & Deep Dive", icon: Brain, color: "text-indigo-500 bg-indigo-50" },
    ]
  },
  {
    id: "sessions",
    question: "How many sessions are you looking for?",
    options: [
      { id: "single", label: "Single Session Triage (₹499)", icon: Zap, color: "text-amber-500 bg-amber-50" },
      { id: "ongoing", label: "Ongoing Therapy (₹850)", icon: Heart, color: "text-emerald-500 bg-emerald-50" }
    ]
  }
];

export default function BookingQuiz({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const handleSelect = (optionId) => {
    const newAnswers = { ...answers, [questions[currentStep].id]: optionId };
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <div className="mb-12">
        <div className="flex gap-2 mb-4">
          {questions.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= currentStep ? "bg-aakaa-green" : "bg-gray-200"}`}
            />
          ))}
        </div>
        <p className="text-[11px] font-bold text-aakaa-green uppercase tracking-[0.2em]">Step {currentStep + 1} of {questions.length}</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-8 tracking-tight leading-tight">
            {questions[currentStep].question}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {questions[currentStep].options.map((option) => (
              <motion.button
                key={option.id}
                whileHover={{ x: 10 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(option.id)}
                className="group flex items-center justify-between p-6 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl hover:border-aakaa-green/20 transition-all duration-300 text-left"
              >
                <div className="flex items-center gap-6">
                  <div className={`p-4 rounded-2xl ${option.color} group-hover:scale-110 transition-transform duration-300`}>
                    <option.icon size={24} />
                  </div>
                  <span className="text-xl font-bold text-gray-800">{option.label}</span>
                </div>
                <ArrowRight size={20} className="text-gray-300 group-hover:text-aakaa-green group-hover:translate-x-2 transition-all" />
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-12 text-center">
        <p className="text-sm text-gray-400">Your privacy is our priority. All answers are encrypted and confidential.</p>
      </div>
    </div>
  );
}
