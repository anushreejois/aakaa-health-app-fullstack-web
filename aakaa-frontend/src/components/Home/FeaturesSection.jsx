import secondaryImage from "../../assets/feature-image-2.jpg";
import { Heart, BarChart2, Wind, Edit3 } from "lucide-react";
import ScrollReveal from "../ui/ScrollReveal";

export default function FeaturesSection() {
  const features = [
    {
      title: "Guided Meditation",
      desc: "Access a library of guided meditation sessions tailored to your needs, from stress relief to better sleep.",
      icon: Heart,
    },
    {
      title: "Mood Tracking",
      desc: "Monitor your emotional patterns over time with intuitive mood tracking and gain insights into your mental health.",
      icon: BarChart2,
    },
    {
      title: "Breathing Exercises",
      desc: "Learn powerful breathing techniques to calm your mind, reduce anxiety, and regain focus in moments of stress.",
      icon: Wind,
    },
    {
      title: "Digital Journaling",
      desc: "Express your thoughts and feelings in a private, secure space. Reflect on your journey and track your growth.",
      icon: Edit3,
    },
  ];

  return (
    <section
      id="features"
      className="scroll-mt-24 py-28 bg-aakaa-cream"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Heading */}
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Meet Aakaa: Your Mental Wellness Companion
            </h2>
            <p className="mt-4 text-gray-600">
              Everything you need to master your mental well-being in one
              beautifully designed app.
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
