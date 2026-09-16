import { Users, Headphones, FileText, BadgeCheck } from "lucide-react";
import ScrollReveal from "../ui/ScrollReveal";

export default function SupportSection() {
  const services = [
    {
      title: "Community Support",
      desc: "Connect with others on similar journeys in a safe, moderated community where you can share experiences and find encouragement.",
      icon: Users,
    },
    {
      title: "Expert Resources",
      desc: "Access content created by mental health professionals, including articles, videos, and audio guides tailored to various challenges.",
      icon: Headphones,
    },
    {
      title: "Personalized Plans",
      desc: "Receive customized wellness plans based on your unique needs, goals, and progress to keep you on track.",
      icon: FileText,
    },
    {
      title: "1-on-1 Therapy",
      desc: (
        <>
          Connect with licensed professionals for personalized sessions. 
          <a href="/booking" className="block mt-2 text-aakaa-green font-bold hover:underline">Book Your First Session →</a>
        </>
      ),
      icon: BadgeCheck,
    },
  ];

  return (
    <section
      id="services"
      className="scroll-mt-24 py-28 bg-aakaa-cream"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-10">

        {/* Badge */}
        <ScrollReveal>
          <div className="flex justify-center mb-10">
            <span className="bg-aakaa-green text-white px-8 py-3 rounded-full font-semibold shadow-[0_12px_30px_rgba(30,77,54,0.45)]">
              Our Services
            </span>
          </div>
        </ScrollReveal>

        {/* Heading */}
        <ScrollReveal delay={100}>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Comprehensive mental health support
            </h2>
            <p className="mt-4 text-gray-600">
              We provide holistic support to ensure you have everything you need
              for your mental wellness journey.
            </p>
          </div>
        </ScrollReveal>

        {/* Services */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-14">
          {services.map((item, index) => {
            const Icon = item.icon;
            return (
              <ScrollReveal key={index} delay={index * 120}>
                <div className="flex gap-5 items-start">

                  <div className="w-12 h-12 rounded-xl bg-aakaa-green flex items-center justify-center text-white shadow-md">
                    <Icon size={22} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 leading-relaxed max-w-md">
                      {item.desc}
                    </p>
                  </div>

                </div>
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}
