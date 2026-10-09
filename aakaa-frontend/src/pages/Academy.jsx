import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, Presentation, Video, Briefcase, ArrowRight, Star } from "lucide-react";
import Footer from "../components/Home/Footer";
import { HashLink } from "react-router-hash-link";

const Academy = () => {
  const programs = [
    {
      title: "Mentorship Program",
      description: "A comprehensive mentorship designed to guide budding professionals and individuals seeking profound personal growth through structured, 1-on-1 expert support.",
      icon: Users,
      tag: "Intensive",
      image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2940&auto=format&fit=crop"
    },
    {
      title: "Self-Paced Courses",
      description: "Dive deep into mental wellness, somatic healing, and psychological frameworks at your own pace with our premium video modules and worksheets.",
      icon: BookOpen,
      tag: "Flexible",
      image: "https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?q=80&w=2936&auto=format&fit=crop"
    },
    {
      title: "Interactive Workshops",
      description: "Join our intensive weekend workshops focused on specialized topics like trauma release, emotional regulation, and mindfulness practices.",
      icon: Presentation,
      tag: "Live",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2920&auto=format&fit=crop"
    },
    {
      title: "Expert Webinars",
      description: "Monthly digital seminars hosted by leading therapists and wellness coaches discussing modern mental health challenges and actionable solutions.",
      icon: Video,
      tag: "Digital",
      image: "https://images.unsplash.com/photo-1616469829581-73993eb86b02?q=80&w=2940&auto=format&fit=crop"
    },
    {
      title: "Psychology Career Guidance",
      description: "Tailored consulting for students and graduates aiming to build a successful, ethical, and impactful career in the field of psychology and therapy.",
      icon: Briefcase,
      tag: "Professional",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2940&auto=format&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F6F3E6] font-sans selection:bg-aakaa-green selection:text-white pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-aakaa-gold/20 text-aakaa-gold text-sm font-bold tracking-widest uppercase mb-6 shadow-sm">
            Learn & Grow
          </span>
          <h1 className="text-4xl md:text-6xl font-light text-aakaa-green mb-6 font-josefin tracking-tight">
            Aakaa <span className="font-bold">Academy</span>
          </h1>
          <p className="text-aakaa-green/70 text-lg md:text-xl leading-relaxed">
            Elevate your understanding of mental wellness, advance your psychology career, and master therapeutic frameworks with our expert-led programs.
          </p>
        </motion.div>

        {/* Featured Program (Mentorship) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(30,77,54,0.05)] border border-white mb-20 flex flex-col md:flex-row relative"
        >
          <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <Star className="text-aakaa-gold fill-aakaa-gold w-5 h-5" />
              <span className="text-aakaa-gold font-bold uppercase tracking-widest text-xs">Flagship Program</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-aakaa-green mb-6 font-josefin">
              {programs[0].title}
            </h2>
            <p className="text-aakaa-green/70 leading-relaxed mb-8 text-lg">
              {programs[0].description}
            </p>
            <div className="flex flex-wrap gap-4">
              <button disabled className="px-8 py-3.5 bg-gray-300 text-gray-500 font-bold rounded-full cursor-not-allowed shadow-inner transition-all duration-300 flex items-center gap-2">
                Coming Soon
              </button>
            </div>
          </div>
          <div className="md:w-1/2 min-h-[300px] relative">
            <div className="absolute inset-0 bg-aakaa-green/20 mix-blend-multiply z-10"></div>
            <img 
              src={programs[0].image} 
              alt={programs[0].title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </motion.div>

        {/* Other Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {programs.slice(1).map((program, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white/50 backdrop-blur-xl border border-white rounded-[2rem] overflow-hidden shadow-[0_10px_40px_rgba(30,77,54,0.03)] hover:shadow-[0_20px_50px_rgba(30,77,54,0.08)] transition-all duration-500"
            >
              <div className="h-48 relative overflow-hidden">
                <div className="absolute inset-0 bg-aakaa-green/10 mix-blend-multiply z-10 transition-opacity duration-300 group-hover:opacity-0"></div>
                <img 
                  src={program.image} 
                  alt={program.title}
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full">
                  <span className="text-[10px] font-black uppercase tracking-widest text-aakaa-green">
                    {program.tag}
                  </span>
                </div>
              </div>
              <div className="p-8">
                <div className="w-12 h-12 rounded-2xl bg-aakaa-green/5 flex items-center justify-center mb-6">
                  <program.icon className="w-6 h-6 text-aakaa-green" />
                </div>
                <h3 className="text-2xl font-bold text-aakaa-green mb-3 font-josefin group-hover:text-aakaa-gold transition-colors duration-300">
                  {program.title}
                </h3>
                <p className="text-aakaa-green/60 text-sm leading-relaxed mb-6">
                  {program.description}
                </p>
                <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
                  Coming Soon <ArrowRight size={16} className="opacity-50" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-aakaa-green rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden mb-16 shadow-[0_30px_60px_rgba(30,77,54,0.2)]"
        >
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-light text-white mb-6 font-josefin tracking-tight">
              Ready to <span className="font-bold text-aakaa-gold">transform</span> your journey?
            </h2>
            <p className="text-white/70 text-lg mb-10 leading-relaxed">
              Join thousands of students, professionals, and individuals who have elevated their understanding of mental wellness with Aakaa Academy.
            </p>
            <button 
              disabled
              className="inline-flex items-center gap-3 px-8 py-4 bg-gray-300 text-gray-500 cursor-not-allowed font-black rounded-full shadow-inner transition-all duration-300"
            >
              Admissions Opening Soon
            </button>
          </div>
        </motion.div>

      </div>
      <Footer />
    </div>
  );
};

export default Academy;
