import { Users, Brain, HeartPulse } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import ScrollReveal from "../ui/ScrollReveal";

function StatCard({ icon: Icon, value, label, delay = 0 }) {
  const [count, setCount] = useState(0);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      viewport={{ once: true }}
      className="
        group
        bg-white/60
        backdrop-blur-xl
        border border-white/80
        rounded-[2.5rem]
        p-12
        text-center
        shadow-[0_20px_50px_rgba(30,77,54,0.05)]
        transition-all
        hover:-translate-y-3
        hover:shadow-[0_40px_80px_rgba(30,77,54,0.12)]
      "
    >
      <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-2xl bg-aakaa-green text-white mb-8 shadow-lg shadow-aakaa-green/20 group-hover:scale-110 transition-transform duration-500">
        <Icon size={30} />
      </div>

      <h3 className="text-6xl font-extrabold text-aakaa-green tabular-nums tracking-tighter">
        {count}%
      </h3>

      <p className="mt-6 text-gray-700 font-bold text-lg leading-snug">
        {label}
      </p>
    </motion.div>
  );
}

export default function StatsSection() {
  return (
    <section className="py-28 bg-aakaa-cream">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Heading */}
        <ScrollReveal>
          <div className="text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              The Mental Health Crisis is Real
            </h2>

            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Mental health is now widely recognized as the world’s most concerning health issue. It has become a global crisis affecting people of all ages and communities.
            </p>
          </div>
        </ScrollReveal>

        {/* Cards */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12">
          <StatCard
            icon={Users}
            value={72}
            label="Students experience high stress levels"
            delay={0}
          />

          <StatCard
            icon={Brain}
            value={61}
            label="Adults report anxiety and burnout"
            delay={0.2}
          />

          <StatCard
            icon={HeartPulse}
            value={48}
            label="Feel emotionally overwhelmed"
            delay={0.4}
          />
        </div>

      </div>
    </section>
  );
}
