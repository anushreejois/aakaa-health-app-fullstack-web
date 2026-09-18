import React, { useState, useEffect } from "react";
import { User, Menu, X, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";

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
    { name: "Feature", href: "/#features" },
    { name: "Our Services", href: "/#services" },
    { name: "Yoga Classes", href: "/yoga" },
    { name: "Testimonials", href: "/#testimonials" },
    { name: "FAQ’s", href: "/#faq" },
    { name: "Blogs", href: "/blogs" },
    { name: "Book Session", href: "/booking", highlight: true },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50">
      {/* Main Navbar */}
      <div
        className={`
          w-full px-6 lg:px-16
          flex items-center justify-between
          transition-all duration-500 ease-out
          ${scrolled ? "py-3" : "py-4"}
          ${scrolled
            ? "bg-gradient-to-r from-aakaa-cream/80 via-aakaa-cream/80 to-aakaa-cream/80 backdrop-blur-xl shadow-[0_12px_35px_rgba(0,0,0,0.12)]"
            : "bg-transparent"
          }
          border-b border-white/60
          rounded-b-3xl lg:rounded-b-[2.5rem]
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
        <ul className="hidden md:flex items-center gap-8 text-[14px] font-medium text-aakaa-gold">
          {menuItems.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className={`
                  inline-flex items-center transition-all duration-200
                  ${item.highlight
                    ? "text-white bg-aakaa-green px-5 py-2 rounded-full shadow-[0_10px_25px_rgba(30,77,54,0.2)] hover:shadow-[0_15px_30px_rgba(30,77,54,0.3)] hover:-translate-y-0.5 transition-all"
                    : "px-1 py-1 hover:text-aakaa-green hover:bg-white/40 hover:backdrop-blur-xl hover:rounded-full"
                  }
                `}
              >
                {item.name}
              </a>
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
      {isMobileMenuOpen && (
        <div className="md:hidden w-full bg-aakaa-cream/80 backdrop-blur-xl border-b border-white/50 shadow-[0_12px_30px_rgba(0,0,0,0.10)] rounded-b-3xl">
          <div className="px-6 py-4 space-y-2">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`
                  block text-sm font-medium rounded-full px-4 py-2
                  text-aakaa-gold
                  ${item.highlight
                    ? "bg-aakaa-green text-white text-center shadow-[0_10px_25px_rgba(30,77,54,0.35)]"
                    : "bg-white/40 hover:bg-white/70"
                  }
                `}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
