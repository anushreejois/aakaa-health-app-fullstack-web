import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useBlogs } from "../context/BlogContext";
import Footer from "../components/Home/Footer";
import { Search, Clock, Calendar, ArrowRight, BookOpen, Sparkles, X, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Helper to determine category if not explicitly provided in the database
function getBlogCategory(blog) {
  if (blog.category) return blog.category;
  const text = `${blog.title} ${blog.snippet || ""} ${blog.slug || ""}`.toLowerCase();
  if (text.includes("mindful") || text.includes("meditat")) return "Mindfulness";
  if (text.includes("anxiety") || text.includes("stress") || text.includes("burnout")) return "Anxiety & Stress";
  if (text.includes("routine") || text.includes("habit") || text.includes("daily") || text.includes("academic")) return "Daily Habits";
  if (text.includes("therap") || text.includes("cbt") || text.includes("psycholog")) return "Therapy & Science";
  if (text.includes("somatic") || text.includes("body") || text.includes("breath")) return "Somatics & Body";
  return "Wellness & Growth";
}

const CATEGORIES = [
  "All",
  "Mindfulness",
  "Anxiety & Stress",
  "Daily Habits",
  "Therapy & Science",
  "Somatics & Body"
];

export default function BlogList() {
  const { blogs, loading } = useBlogs();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Only show published posts to users
  const publishedBlogs = useMemo(() => {
    return blogs.filter((b) => b.status === "Published" || !b.status);
  }, [blogs]);

  // Filtered blogs based on search query and category
  const filteredBlogs = useMemo(() => {
    return publishedBlogs.filter((blog) => {
      const category = getBlogCategory(blog);
      const matchesCategory = selectedCategory === "All" || category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        blog.title?.toLowerCase().includes(q) ||
        blog.snippet?.toLowerCase().includes(q) ||
        blog.author?.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [publishedBlogs, selectedCategory, searchQuery]);

  // Featured article is the first published one when on "All" without search
  const isDefaultView = selectedCategory === "All" && !searchQuery.trim();
  const featuredBlog = isDefaultView && filteredBlogs.length > 0 ? filteredBlogs[0] : null;
  const standardBlogs = featuredBlog ? filteredBlogs.slice(1) : filteredBlogs;

  return (
    <div className="min-h-screen bg-aakaa-cream flex flex-col pt-28 md:pt-36">
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 lg:px-10 pb-24">
        
        {/* Header Hero */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 mb-4 bg-aakaa-green/10 text-aakaa-green px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
            <BookOpen size={14} />
            <span>Journal & Clinical Insights</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.1] tracking-tight">
            Reflections for mind, <br className="hidden sm:inline" />
            <span className="text-aakaa-green">body & emotional clarity.</span>
          </h1>
          <p className="mt-5 text-gray-600 text-base md:text-lg leading-relaxed">
            Evidence-based perspectives, practical guidance, and therapeutic tools written by certified mental health practitioners and somatic guides.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="mb-12 space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics, anxiety, routines, mindfulness..."
              className="w-full pl-12 pr-10 py-3.5 bg-white/90 backdrop-blur-md rounded-2xl border border-gray-200/80 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-aakaa-green/20 focus:border-aakaa-green transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all duration-300 cursor-pointer ${
                    active
                      ? "bg-aakaa-green text-white shadow-lg shadow-aakaa-green/20 scale-102"
                      : "bg-white/80 text-gray-600 border border-gray-200/60 hover:bg-white hover:text-gray-900 hover:border-gray-300"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="animate-spin w-10 h-10 border-4 border-aakaa-green border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500 font-semibold text-sm">Curating your wellness readings...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          /* Empty Search State */
          <div className="bg-white rounded-3xl p-12 text-center max-w-lg mx-auto border border-gray-100 shadow-sm my-12">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No articles match your search</h3>
            <p className="text-gray-500 text-sm mb-6">
              We couldn't find any articles matching "{searchQuery}". Try selecting another category or clear your keywords.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="px-6 py-2.5 bg-aakaa-green text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-aakaa-green/90 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* FEATURED STORY SPOTLIGHT (Visible on All without search) */}
            {featuredBlog && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link
                  to={`/blogs/${featuredBlog.slug}`}
                  className="group block bg-white rounded-[2.5rem] overflow-hidden border border-gray-100/80 shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_25px_60px_rgba(30,77,54,0.12)] transition-all duration-500"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
                    <div className="lg:col-span-7 h-72 sm:h-96 lg:h-full min-h-[320px] overflow-hidden relative">
                      <img
                        src={featuredBlog.image}
                        alt={featuredBlog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute top-6 left-6">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-aakaa-green text-white rounded-full text-[11px] font-black uppercase tracking-widest shadow-md">
                          <Sparkles size={12} /> Featured Insight
                        </span>
                      </div>
                    </div>

                    <div className="lg:col-span-5 p-8 sm:p-10 lg:p-12 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3 text-xs font-bold text-aakaa-gold uppercase tracking-wider mb-4">
                          <span className="px-2.5 py-0.5 bg-amber-50 rounded-full border border-amber-200/50">
                            {getBlogCategory(featuredBlog)}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} /> {featuredBlog.readTime}
                          </span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 group-hover:text-aakaa-green transition-colors leading-tight mb-4">
                          {featuredBlog.title}
                        </h2>

                        <p className="text-gray-600 text-sm sm:text-base leading-relaxed line-clamp-3 mb-6">
                          {featuredBlog.snippet}
                        </p>
                      </div>

                      <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-aakaa-green/10 text-aakaa-green font-bold flex items-center justify-center text-xs">
                            {featuredBlog.author ? featuredBlog.author[0] : "A"}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-900">{featuredBlog.author || "Clinical Team"}</p>
                            <p className="text-[10px] text-gray-400 font-medium">{featuredBlog.date}</p>
                          </div>
                        </div>

                        <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-aakaa-green group-hover:translate-x-1 transition-transform">
                          <span>Read Full Story</span>
                          <ArrowRight size={14} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* STANDARD GRID ARTICLES */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {standardBlogs.map((blog, idx) => {
                const category = getBlogCategory(blog);
                return (
                  <motion.div
                    key={blog._id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                  >
                    <Link
                      to={`/blogs/${blog.slug}`}
                      className="group flex flex-col h-full bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-300"
                    >
                      <div className="h-56 overflow-hidden relative">
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-gray-800 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">
                            {category}
                          </span>
                        </div>
                      </div>

                      <div className="p-7 flex flex-col flex-1">
                        <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-400 mb-3">
                          <Calendar size={12} />
                          <span>{blog.date}</span>
                          <span>•</span>
                          <Clock size={12} />
                          <span>{blog.readTime}</span>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-aakaa-green transition-colors leading-snug mb-3 line-clamp-2">
                          {blog.title}
                        </h3>

                        <p className="text-gray-500 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-6">
                          {blog.snippet}
                        </p>

                        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-500">
                            By {blog.author || "AakaA Care"}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-aakaa-green group-hover:translate-x-1 transition-transform">
                            Read <ArrowRight size={13} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* BOTTOM CARE PROMO */}
        <div className="mt-20 bg-gradient-to-br from-aakaa-green to-[#133524] rounded-[2.5rem] p-8 md:p-14 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
          <div className="max-w-2xl relative z-10">
            <span className="text-aakaa-gold text-xs font-black uppercase tracking-[0.25em] block mb-3">
              Holistic Mental Healthcare
            </span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight mb-4">
              Looking for personalized support on your path?
            </h2>
            <p className="text-white/80 text-sm md:text-base leading-relaxed mb-8">
              Connect with verified clinical psychologists and certified somatic guides for one-on-one sessions tailored specifically to your needs.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/booking"
                className="px-8 py-3.5 bg-white text-aakaa-green font-bold rounded-2xl text-xs uppercase tracking-widest hover:bg-aakaa-cream transition-all shadow-lg shadow-black/10"
              >
                Book 1-on-1 Consultation
              </Link>
              <Link
                to="/yoga"
                className="px-8 py-3.5 bg-white/10 border border-white/20 text-white font-bold rounded-2xl text-xs uppercase tracking-widest hover:bg-white/20 transition-all"
              >
                Join Guided Somatics
              </Link>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
