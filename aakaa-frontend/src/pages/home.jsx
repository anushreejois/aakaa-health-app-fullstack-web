import HeroSection from "../components/Home/HeroSection";
import StatsSection from "../components/Home/StatsSection";
import ConcernSection from "../components/Home/ConcernSection";

import SupportSection from "../components/Home/SupportSection";
import TestimonialsSection from "../components/Home/TestimonialsSection";
import FAQSection from "../components/Home/FAQSection";
import ContactSection from "../components/Home/ContactSection";

import Footer from "../components/Home/Footer";
import JourneySection from "../components/Home/JourneySection";
import TherapyPreviewSection from "../components/Home/TherapyPreviewSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ConcernSection />
      <JourneySection />
      <TherapyPreviewSection />

      <SupportSection />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />

      <Footer />
    </>
  );
}
