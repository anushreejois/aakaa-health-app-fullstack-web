import HeroSection from "../components/Home/HeroSection";
import StatsSection from "../components/Home/StatsSection";
import ConcernSection from "../components/Home/ConcernSection";

import SupportSection from "../components/Home/SupportSection";
import TestimonialsSection from "../components/Home/TestimonialsSection";
import FAQSection from "../components/Home/FAQSection";
import ContactSection from "../components/Home/ContactSection";
import WaitlistSection from "../components/Home/WaitlistSection";

import Footer from "../components/Home/Footer";
import JourneySection from "../components/Home/JourneySection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ConcernSection />
      <JourneySection />

      <SupportSection />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
      <WaitlistSection />
      <Footer />
    </>
  );
}
