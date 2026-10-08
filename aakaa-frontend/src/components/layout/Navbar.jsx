import React, { useState, useEffect } from "react";
import { User, Menu, X, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { name: "About Aakaa", href: "/#about" },
    { name: "Our Services", href: "/#services" },
    { name: "Yoga Classes", href: "/yoga" },
    { name: "Testimonials", href: "/#testimonials" },
    { name: "FAQ’s", href: "/#faq" },
    { name: "Blogs", href: "/blogs" },
    { name: "Book Session", href: "/booking", highlight: true },
  ];

  return (
    <nav className="fixed top-4 left-0 right-0 z-50 flex flex-col items-center px-4 md:px-8 pointer-events-none">
      {/* Main Navbar */}
      <div
        className={`
          pointer-events-auto
          w-full max-w-6xl px-6 md:px-8
          flex items-center justify-between
          transition-all duration-500 ease-out
          ${scrolled 
            ? "py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.12)] bg-gradient-to-br from-white/50 to-white/20 backdrop-blur-3xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]" 
            : "py-4 shadow-[0_8px_32px_rgba(0,0,0,0.06)] bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]"}
          border border-white/50
          rounded-full
        `}
      >
        {/* INTERACTIVE LOGO */}
        <motion.a 
          href="/" 
          initial="hidden"
          whileHover="hover"
          className="text-3xl md:text-4xl font-light tracking-tight font-josefin relative group inline-flex"
        >
          {['A', 'a', 'k', 'a', 'A'].map((letter, i) => (
            <motion.span
              key={i}
              variants={{
                hidden: { y: 0, color: '#1E4D36' },
                hover: { y: -4, color: '#9C9E8E' }
              }}
              transition={{ duration: 0.2, delay: i * 0.05, type: "spring", stiffness: 300 }}
              className="inline-block"
            >
              {letter}
            </motion.span>
          ))}
          <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-aakaa-gold transition-all duration-500 ease-out group-hover:w-full rounded-full"></span>
        </motion.a>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-8 text-[14px] font-bold text-aakaa-green">
          {menuItems.map((item) => (
            <li key={item.name}>
              <HashLink
                to={item.href}
                smooth
                className={`
                  inline-flex items-center transition-all duration-200
                  ${item.highlight
                    ? "text-white bg-aakaa-green px-5 py-2 rounded-full shadow-[0_10px_25px_rgba(30,77,54,0.2)] hover:shadow-[0_15px_30px_rgba(30,77,54,0.3)] hover:-translate-y-0.5 transition-all"
                    : "px-1 py-1 hover:text-aakaa-green hover:bg-white/40 hover:backdrop-blur-xl hover:rounded-full"
                  }
                `}
              >
                {item.name}
              </HashLink>
            </li>
          ))}
        </ul>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* User Icon Link to Admin */}
          <Link 
            to={isAuthenticated ? "/admin/dashboard" : "/admin"} 
            className={`hidden md:flex w-9 h-9 items-center justify-center rounded-full border border-aakaa-green/40 transition-all duration-300 ${
              isAuthenticated 
                ? "bg-aakaa-green text-white shadow-[0_6px_18px_rgba(30,77,54,0.3)]" 
                : "text-aakaa-green bg-white/40 backdrop-blur-xl shadow-[0_6px_18px_rgba(0,0,0,0.08)] hover:bg-aakaa-green hover:text-white"
            }`}
            title={isAuthenticated ? "Admin Dashboard" : "Admin Login"}
          >
            {isAuthenticated ? <LayoutDashboard size={18} /> : <User size={18} />}
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full bg-white/50 border border-white/70 shadow-[0_6px_16px_rgba(0,0,0,0.08)] backdrop-blur-md"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-aakaa-gold" />
            ) : (
              <Menu className="w-5 h-5 text-aakaa-gold" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="md:hidden pointer-events-auto w-full max-w-6xl mt-3 bg-white/80 backdrop-blur-2xl border border-white/80 shadow-[0_12px_30px_rgba(0,0,0,0.10)] rounded-3xl overflow-hidden"
          >
            <div className="px-6 py-4 space-y-2">
              {menuItems.map((item) => (
                <HashLink
                  key={item.name}
                  to={item.href}
                  smooth
                  className={`
                    block text-sm font-bold rounded-2xl px-4 py-3
                    text-aakaa-green
                    ${item.highlight
                      ? "bg-aakaa-green text-white text-center shadow-[0_10px_25px_rgba(30,77,54,0.35)]"
                      : "bg-white/40 hover:bg-white/70"
                    }
                  `}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </HashLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
