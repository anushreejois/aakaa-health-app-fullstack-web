import { Star } from "lucide-react";
import ScrollReveal from "../ui/ScrollReveal";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah John",
      role: "Graduate Student",
      text: "Aakaa has been a game-changer for managing my anxiety during finals. The breathing exercises help me stay calm and focused.",
    },
    {
      name: "Sonia Manohar",
      role: "Software Developer",
      text: "As someone who works long hours, the guided meditations have helped me disconnect and recharge. I sleep so much better now!",
    },
    {
      name: "Divya Verma",
      role: "Marketing Manager",
      text: "The mood tracking feature helped me identify patterns I never noticed before. It's like having a personal wellness coach in my pocket.",
    },
  ];

  return (
    <section
      id="testimonials"
      className="scroll-mt-24 py-28 bg-aakaa-cream"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Badge */}
        <ScrollReveal>
          <div className="flex justify-center mb-10">
            <span className="bg-aakaa-green text-white px-8 py-3 rounded-full font-semibold shadow-[0_12px_30px_rgba(30,77,54,0.45)]">
              Testimonials
            </span>
          </div>
        </ScrollReveal>

        {/* Heading */}
        <ScrollReveal delay={100}>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              What our users say
            </h2>
            <p className="mt-4 text-gray-600">
              Real stories from people who’ve transformed their mental wellness
              journey with Aakaa
            </p>
          </div>
        </ScrollReveal>

        {/* Cards */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-10">
          {testimonials.map((item, index) => (
            <ScrollReveal key={index} delay={index * 120}>
              <div
                className="
                  bg-white
                  rounded-2xl
                  p-8
                  shadow-[0_20px_50px_rgba(80,70,140,0.25)]
                  transition
                  hover:-translate-y-1
                "
              >
                {/* Stars */}
                <div className="flex gap-1 text-aakaa-green">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill="#1E4D36" />
                  ))}
                </div>

                {/* Quote */}
                <p className="mt-6 text-gray-700 leading-relaxed text-sm">
                  “{item.text}”
                </p>

                <hr className="my-6 border-gray-200" />

                {/* Author */}
                <div>
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.role}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
