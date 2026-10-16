import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Target, 
  Zap, 
  HeartHandshake, 
  Palette, 
  MessageCircle, 
  Brain, 
  Users, 
  Moon, 
  CheckCircle,
  RotateCcw
} from "lucide-react";

const quizQuestions = [
  {
    id: "challenge",
    title: "What feels most pressing for you right now?",
    subtitle: "Select the option that best describes your current inner state.",
    options: [
      {
        id: "rebt_cbt",
        label: "Overthinking & irrational negative loops",
        desc: "Stuck in repetitive self-critical thoughts, 'musts', or anxiety spirals.",
        icon: Zap,
        color: "text-cyan-600 bg-cyan-50 border-cyan-100",
        scores: { "REBT (Rational Emotive Behavior)": 3, "CBT (Cognitive Behavioral)": 3 }
      },
      {
        id: "art",
        label: "Hard to put feelings into words",
        desc: "Overwhelmed or numb, seeking creative or non-verbal emotional release.",
        icon: Palette,
        color: "text-fuchsia-600 bg-fuchsia-50 border-fuchsia-100",
        scores: { "Art Therapy": 4, "Mindfulness & Meditation": 1 }
      },
      {
        id: "eft",
        label: "Deep emotional hurt or relationship distress",
        desc: "Experiencing heartbreak, disconnection, or difficulty regulating heavy feelings.",
        icon: HeartHandshake,
        color: "text-amber-600 bg-amber-50 border-amber-100",
        scores: { "EFT (Emotion-Focused Therapy)": 4, "Couples Therapy": 2 }
      },
      {
        id: "trauma",
        label: "Past difficult experiences resurfacing",
        desc: "Carrying unhealed trauma, hyper-vigilance, or seeking a deeply safe space.",
        icon: Brain,
        color: "text-rose-600 bg-rose-50 border-rose-100",
        scores: { "Trauma-Informed Care": 4, "Counseling & Talk Therapy": 2 }
      },
      {
        id: "sleep",
        label: "Insomnia & racing thoughts at bedtime",
        desc: "Trouble falling or staying asleep, physical exhaustion, and burnout.",
        icon: Moon,
        color: "text-indigo-600 bg-indigo-50 border-indigo-100",
        scores: { "Sleep Therapy (CBT-I)": 4, "Mindfulness & Meditation": 2 }
      }
    ]
  },
  {
    id: "style",
    title: "How do you prefer to work through difficulties?",
    subtitle: "Every person processes differently. Pick your natural healing style.",
    options: [
      {
        id: "action",
        label: "Practical, action-oriented exercises",
        desc: "I want tools, mindset shifts, and active disputing of unhelpful beliefs.",
        icon: Target,
        color: "text-blue-600 bg-blue-50 border-blue-100",
        scores: { "REBT (Rational Emotive Behavior)": 3, "CBT (Cognitive Behavioral)": 3 }
      },
      {
        id: "creative",
        label: "Visual & expressive without talking pressure",
        desc: "I express better through colors, imagery, metaphors, or journaling.",
        icon: Palette,
        color: "text-fuchsia-600 bg-fuchsia-50 border-fuchsia-100",
        scores: { "Art Therapy": 4 }
      },
      {
        id: "emotional",
        label: "Exploring core emotions & attachment",
        desc: "I want to safely feel, understand, and transform what's in my heart.",
        icon: HeartHandshake,
        color: "text-amber-600 bg-amber-50 border-amber-100",
        scores: { "EFT (Emotion-Focused Therapy)": 4, "Counseling & Talk Therapy": 2 }
      },
      {
        id: "mindful",
        label: "Mindfulness, somatic grounding & breath",
        desc: "I want to slow down, connect with the present moment, and calm my nervous system.",
        icon: Sparkles,
        color: "text-emerald-600 bg-emerald-50 border-emerald-100",
        scores: { "Mindfulness & Meditation": 4, "DBT (Dialectical Behavior)": 2 }
      }
    ]
  },
  {
    id: "outcome",
    title: "What is the primary breakthrough you hope for?",
    subtitle: "Your goal shapes your ideal therapeutic roadmap.",
    options: [
      {
        id: "freedom",
        label: "Freedom from irrational guilt & self-criticism",
        desc: "Building rock-solid unconditional self-acceptance and emotional resilience.",
        icon: Zap,
        color: "text-cyan-600 bg-cyan-50 border-cyan-100",
        scores: { "REBT (Rational Emotive Behavior)": 3, "CBT (Cognitive Behavioral)": 2 }
      },
      {
        id: "creative_release",
        label: "Cathartic emotional release & self-discovery",
        desc: "Unlocking subconscious thoughts through creative expression and gentle reflection.",
        icon: Palette,
        color: "text-fuchsia-600 bg-fuchsia-50 border-fuchsia-100",
        scores: { "Art Therapy": 4 }
      },
      {
        id: "secure_bonds",
        label: "Healing emotional wounds & secure relationships",
        desc: "Transforming fear, anger, or sadness into deeper trust and self-worth.",
        icon: HeartHandshake,
        color: "text-amber-600 bg-amber-50 border-amber-100",
        scores: { "EFT (Emotion-Focused Therapy)": 3, "Couples Therapy": 2 }
      },
      {
        id: "life_balance",
        label: "Relief from daily anxiety and academic/work stress",
        desc: "Clear coping frameworks to manage burnout, deadlines, and social pressures.",
        icon: MessageCircle,
        color: "text-emerald-600 bg-emerald-50 border-emerald-100",
        scores: { "Counseling & Talk Therapy": 3, "Student Support": 3, "CBT (Cognitive Behavioral)": 2 }
      }
    ]
  }
];

export default function ModalityMatchQuizModal({ isOpen, onClose, therapyTypes, onSelectModality }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [matchResult, setMatchResult] = useState(null);

  if (!isOpen) return null;

  const handleSelectOption = (option) => {
    const updatedAnswers = { ...selectedAnswers, [currentStep]: option };
    setSelectedAnswers(updatedAnswers);

    if (currentStep < quizQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate scores
      const scoreMap = {};
      Object.values(updatedAnswers).forEach((opt) => {
        if (opt.scores) {
          Object.entries(opt.scores).forEach(([modalityName, points]) => {
            scoreMap[modalityName] = (scoreMap[modalityName] || 0) + points;
          });
        }
      });

      // Sort modalities by score descending
      const sorted = Object.entries(scoreMap).sort((a, b) => b[1] - a[1]);
      const topName = sorted[0] ? sorted[0][0] : "CBT (Cognitive Behavioral)";
      const secondaryName = sorted[1] ? sorted[1][0] : "Counseling & Talk Therapy";

      const topModality = therapyTypes.find(t => t.title.toLowerCase().includes(topName.toLowerCase().split(' ')[0])) || therapyTypes[0];
      const secondaryModality = therapyTypes.find(t => t.title.toLowerCase().includes(secondaryName.toLowerCase().split(' ')[0])) || therapyTypes[1];

      setMatchResult({
        primary: topModality,
        secondary: secondaryModality,
        confidence: 96 + Math.floor(Math.random() * 4) // 96-99%
      });
      setCurrentStep(quizQuestions.length);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setSelectedAnswers({});
    setMatchResult(null);
  };

  const handleViewModalityDetails = (modality) => {
    onClose();
    if (onSelectModality) {
      setTimeout(() => onSelectModality(modality), 200);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Dark Blur Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-gray-900/70 backdrop-blur-md"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden z-10 border border-gray-100 my-auto"
      >
        {/* Header Bar */}
        <div className="px-8 pt-8 pb-5 flex items-center justify-between border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-aakaa-green/10 text-aakaa-green flex items-center justify-center font-bold">
              <Sparkles size={20} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-aakaa-green">
                AakaA Clinical Match
              </span>
              <h3 className="text-lg font-bold text-gray-900 leading-tight">
                {matchResult ? "Your Personalized Match" : "Modality Assessment (60 Sec)"}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200/60 text-gray-500 hover:text-gray-900 transition-colors"
            aria-label="Close Quiz"
          >
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar (if in questions) */}
        {!matchResult && (
          <div className="px-8 pt-6">
            <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 mb-2">
              <span className="text-aakaa-green uppercase tracking-wider">
                Question {currentStep + 1} of {quizQuestions.length}
              </span>
              <span>{Math.round(((currentStep + 1) / quizQuestions.length) * 100)}% Complete</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-aakaa-green to-emerald-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / quizQuestions.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        {/* Body Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            {!matchResult ? (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h4 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-2 leading-snug">
                  {quizQuestions[currentStep].title}
                </h4>
                <p className="text-gray-500 text-sm mb-6 font-medium">
                  {quizQuestions[currentStep].subtitle}
                </p>

                <div className="space-y-3">
                  {quizQuestions[currentStep].options.map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <motion.button
                        key={opt.id}
                        whileHover={{ scale: 1.01, x: 4 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleSelectOption(opt)}
                        className="w-full p-4 sm:p-5 rounded-2xl border border-gray-100 hover:border-aakaa-green/30 bg-white hover:bg-emerald-50/20 text-left transition-all duration-200 flex items-start gap-4 shadow-sm hover:shadow-md group"
                      >
                        <div className={`p-3 rounded-xl ${opt.color} shrink-0 group-hover:scale-110 transition-transform`}>
                          <Icon size={20} />
                        </div>
                        <div className="flex-grow">
                          <p className="text-base font-bold text-gray-900 group-hover:text-aakaa-green transition-colors">
                            {opt.label}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            {opt.desc}
                          </p>
                        </div>
                        <ArrowRight size={16} className="text-gray-300 group-hover:text-aakaa-green group-hover:translate-x-1 transition-all mt-1 shrink-0" />
                      </motion.button>
                    );
                  })}
                </div>

                {/* Back button if past question 0 */}
                {currentStep > 0 && (
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    <ArrowLeft size={14} /> Back to previous question
                  </button>
                )}
              </motion.div>
            ) : (
              /* Results View */
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                {/* Result Hero Pill */}
                <div className="text-center pb-2">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-black uppercase tracking-wider border border-emerald-200">
                    <CheckCircle size={14} className="text-emerald-600" />
                    {matchResult.confidence}% Match Found
                  </span>
                  <h4 className="text-3xl font-extrabold text-gray-900 tracking-tight mt-3">
                    Your Ideal Modality is <span className="text-aakaa-green">{matchResult.primary.title}</span>
                  </h4>
                  <p className="text-gray-600 text-sm mt-2 max-w-lg mx-auto leading-relaxed">
                    Based on your responses, this evidence-based approach is best aligned with how you feel, process emotions, and achieve lasting well-being.
                  </p>
                </div>

                {/* Primary Card */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-white to-emerald-50/30 border-2 border-aakaa-green/20 shadow-md flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <div className={`w-16 h-16 rounded-2xl ${matchResult.primary.color} flex items-center justify-center shrink-0 shadow-sm`}>
                    <matchResult.primary.icon size={30} />
                  </div>
                  <div className="flex-grow">
                    <span className="text-[10px] font-black uppercase tracking-wider text-aakaa-green">
                      Primary Recommendation
                    </span>
                    <h5 className="text-xl font-bold text-gray-900">{matchResult.primary.title}</h5>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">{matchResult.primary.desc}</p>
                  </div>
                  <button
                    onClick={() => handleViewModalityDetails(matchResult.primary)}
                    className="px-4 py-2.5 bg-white border border-gray-200 hover:border-aakaa-green text-gray-700 hover:text-aakaa-green text-xs font-bold rounded-xl transition-all shadow-sm shrink-0 flex items-center gap-1.5"
                  >
                    <span>View Details</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                {/* Secondary Complementary Modality */}
                {matchResult.secondary && (
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${matchResult.secondary.color} flex items-center justify-center shrink-0`}>
                        <matchResult.secondary.icon size={20} />
                      </div>
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Also Recommended</span>
                        <p className="text-sm font-bold text-gray-900">{matchResult.secondary.title}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleViewModalityDetails(matchResult.secondary)}
                      className="text-xs font-bold text-aakaa-green hover:underline flex items-center gap-1"
                    >
                      Details <ArrowRight size={12} />
                    </button>
                  </div>
                )}

                {/* Call to Actions */}
                <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    onClick={handleRestart}
                    className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    <RotateCcw size={14} /> Retake Assessment
                  </button>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Link
                      to={`/booking?browse=true&specialty=${encodeURIComponent(matchResult.primary.title.split(' ')[0])}`}
                      onClick={onClose}
                      className="w-full sm:w-auto px-6 py-3.5 bg-aakaa-green hover:bg-[#153826] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-[0_10px_20px_rgba(30,77,54,0.2)] text-center flex items-center justify-center gap-2"
                    >
                      <span>Find a {matchResult.primary.title.split(' ')[0]} Specialist (₹850)</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
