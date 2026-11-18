import React from "react";
import { Instagram, Twitter, Linkedin, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

export default function Footer() {
  return (
    <footer className="bg-aakaa-green text-white relative pt-8 pb-5 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-6 lg:gap-10 pb-5">
          
          {/* Brand & Mission */}
          <div className="col-span-2 md:col-span-4 lg:col-span-5">
            <h3 className="text-2xl font-bold tracking-tight text-white mb-2 font-josefin">AakaA</h3>
            <p className="text-white/60 text-xs leading-relaxed max-w-sm mb-3">
              Empowering your journey towards mental clarity and emotional balance with evidence-based therapy and guided somatics.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-2.5">
              {[
                { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
                { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
                { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" }
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-all"
                >
                  <item.icon size={13} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 md:col-span-3 lg:col-span-2">
            <h4 className="font-bold text-aakaa-gold uppercase tracking-widest text-[10px] mb-2.5">Explore</h4>
            <ul className="space-y-1.5 text-white/60 text-xs font-medium">
              <li><HashLink to="/#therapy" smooth className="hover:text-white transition-colors">Our Services</HashLink></li>
              <li><Link to="/booking" className="hover:text-white transition-colors">Book Therapy</Link></li>
              <li><Link to="/yoga" className="hover:text-white transition-colors">Yoga & Somatics</Link></li>
              <li><Link to="/blogs" className="hover:text-white transition-colors">Journal & Insights</Link></li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="col-span-1 md:col-span-3 lg:col-span-3">
            <h4 className="font-bold text-aakaa-gold uppercase tracking-widest text-[10px] mb-2.5">Care & Support</h4>
            <ul className="space-y-1.5 text-white/60 text-xs font-medium">
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-and-conditions" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/refund-cancellation" className="hover:text-white transition-colors">Refund Policy</Link></li>
              <li><Link to="/crisis-resources" className="text-rose-300 hover:text-rose-200 font-bold transition-colors">Crisis Directory</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 sm:col-span-1 md:col-span-2 lg:col-span-2">
            <h4 className="font-bold text-aakaa-gold uppercase tracking-widest text-[10px] mb-2.5">Reach Us</h4>
            <ul className="space-y-1.5 text-white/60 text-xs font-medium">
              <li className="flex items-center gap-1.5"><Mail size={12} className="shrink-0" /> hello@aakaa.app</li>
              <li className="flex items-center gap-1.5"><MapPin size={12} className="shrink-0" /> Bengaluru, India</li>
            </ul>
          </div>
        </div>

        {/* Compact Medical Disclaimer */}
        <div className="py-2 px-4 bg-white/5 rounded-xl border border-white/5 text-center mb-4">
          <p className="text-white/50 text-[10px] leading-relaxed">
            <span className="font-bold text-white/70 uppercase">Medical Notice:</span> AakaA does not provide emergency crisis intervention. If you are experiencing acute distress or thoughts of self-harm, please contact 112, Tele-MANAS (14416), or your nearest emergency center immediately.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-white/40 text-[11px] font-medium">
            © {new Date().getFullYear()} AakaA. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-[9px] uppercase tracking-widest text-white/30 font-bold">
            <span className="hover:text-white transition-colors">Confidential</span>
            <span>•</span>
            <span className="hover:text-white transition-colors">Encrypted</span>
            <span>•</span>
            <span className="hover:text-white transition-colors">Evidence-Based</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
