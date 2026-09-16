import { Instagram, Twitter, Linkedin, Github, Mail, Globe } from "lucide-react";

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
                <li><a href="#" className="hover:text-aakaa-gold transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-aakaa-gold transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-aakaa-gold transition-colors">Cookie Settings</a></li>
                <li><a href="#" className="hover:text-aakaa-gold transition-colors">Contact Help</a></li>
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

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
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
