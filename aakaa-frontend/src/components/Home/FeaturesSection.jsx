import secondaryImage from "../../assets/feature-image-2.jpg";
import { Heart, BarChart2, Wind, Edit3 } from "lucide-react";
import ScrollReveal from "../ui/ScrollReveal";

export default function FeaturesSection() {
  const features = [
    {
      title: "Curated Meditation",
      desc: "Access an elite library of guided sessions tailored to your precise emotional state, from deep stress relief to restorative sleep.",
      icon: Heart,
    },
    {
      title: "Emotional Cartography",
      desc: "Map your emotional landscape over time with intuitive, private tracking. Uncover profound insights into your cognitive patterns.",
      icon: BarChart2,
    },
    {
      title: "Breathwork Mastery",
      desc: "Harness ancient breathing techniques backed by modern neuroscience to instantly ground your mind and neutralize anxiety.",
      icon: Wind,
    },
    {
      title: "Reflective Journaling",
      desc: "A secure, serene space to articulate your deepest thoughts. Reflect on your daily journey and visualize your personal evolution.",
      icon: Edit3,
    },
  ];

  return (
    <section
      id="features"
      className="scroll-mt-24 py-28 "
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Heading */}
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              The Aakaa Experience: Holistic Mental Wellness
            </h2>
            <p className="mt-4 text-gray-600">
              Curated practices and profound insights to help you master your mental well-being in one beautifully integrated platform.
            </p>
          </div>
        </ScrollReveal>

        {/* Content */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT FEATURES */}
          <div className="space-y-6">
            {features.map((item, index) => {
              const Icon = item.icon;
              return (
                <ScrollReveal key={index} delay={index * 120}>
                  <div
                    className="
                      flex gap-4 items-start
                      bg-white
                      rounded-2xl
                      p-6
                      shadow-sm
                      border
                      border-gray-100
                      hover:shadow-md
                      transition
                    "
                  >
                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-aakaa-green/10 text-aakaa-green">
                      <Icon size={22} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {/* RIGHT IMAGE */}
          <ScrollReveal delay={150}>
            <div className="flex justify-center lg:justify-end">
              <div className="w-[420px] h-[520px] rounded-[2.2rem] overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.2)]">
                <img
                  src={secondaryImage}
                  alt="Wellness"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
}
