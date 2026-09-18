import { Instagram, Twitter, Linkedin, Github, Mail, Globe } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-aakaa-green text-white relative py-8 overflow-hidden border-t border-white/5">
      
      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16">

          {/* Brand & Description */}
          <div className="md:col-span-4 lg:col-span-5">
            <h3 className="text-2xl font-bold tracking-tight text-white mb-4">Aakaa</h3>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs mb-6">
              Empowering your journey towards mental clarity and emotional balance with evidence-based support.
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-4">
              {[
                { icon: Instagram, label: "Instagram" },
                { icon: Twitter, label: "Twitter" },
                { icon: Linkedin, label: "LinkedIn" }
              ].map((item, i) => (
                <a 
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-all duration-300"
                >
                  <item.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          <div className="md:col-span-8 lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Explore</h4>
              <ul className="space-y-4 text-white/60 text-sm font-medium">
                <li><a href="#therapy" className="hover:text-aakaa-gold transition-colors">Our Services</a></li>
                <li><a href="/blogs" className="hover:text-aakaa-gold transition-colors">Journal & Insights</a></li>
                <li><a href="#waitlist" className="hover:text-aakaa-gold transition-colors">Join Waitlist</a></li>
                <li><a href="#faq" className="hover:text-aakaa-gold transition-colors">Common Questions</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Support</h4>
              <ul className="space-y-4 text-white/60 text-sm font-medium">
                <li><Link to="/privacy-policy" className="hover:text-aakaa-gold transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms-of-service" className="hover:text-aakaa-gold transition-colors">Terms of Service</Link></li>
                <li><Link to="/refund-cancellation" className="hover:text-aakaa-gold transition-colors">Refund & Cancellation</Link></li>
                <li><Link to="/crisis-resources" className="hover:text-rose-300 transition-colors">Crisis Resources</Link></li>
                <li><a href="mailto:hello@aakaa.app" className="hover:text-aakaa-gold transition-colors">Contact Help</a></li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Contact</h4>
              <ul className="space-y-4 text-white/60 text-sm font-medium">
                <li className="flex items-center gap-2"><Mail size={14} /> hello@aakaa.app</li>
                <li className="flex items-center gap-2"><Globe size={14} /> Mumbai, India</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Medical Disclaimer */}
        <div className="mt-12 p-4 bg-red-900/10 border border-red-500/20 rounded-xl text-center">
          <p className="text-red-200/70 text-[11px] leading-relaxed max-w-4xl mx-auto">
            <strong className="text-red-200/90 font-bold uppercase tracking-wider">Medical Disclaimer:</strong> Aakaa Health does not provide emergency medical services. If you are in a life-threatening situation, experiencing a mental health crisis, or having thoughts of self-harm, please do not use this site. Call your local emergency services or a crisis helpline immediately.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-white/40 text-xs font-medium tracking-wide">
            © {new Date().getFullYear()} Aakaa Psy. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">
            <span className="hover:text-white transition-colors cursor-pointer">Security</span>
            <span className="hover:text-white transition-colors cursor-pointer">Transparency</span>
            <span className="hover:text-white transition-colors cursor-pointer">Ethics</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
