import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useBlogs } from "../context/BlogContext";
import Footer from "../components/Home/Footer";
import { 
  Clock, 
  Calendar, 
  ArrowLeft, 
  Share2, 
  Check, 
  Copy, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck,
  Heart
} from "lucide-react";
import { motion } from "framer-motion";

// Markdown parser to safely render blog headings, quotes, bold, and lists
function renderMarkdown(content) {
  if (!content) return "";
  let html = content
    // Headings
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-gray-900 mt-8 mb-3">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-black text-gray-900 mt-10 mb-4 tracking-tight">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-black text-gray-900 mt-12 mb-6 tracking-tight">$1</h1>')
    // Bold & Italic
    .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold text-gray-900">$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
    // Blockquotes
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-aakaa-green bg-aakaa-cream/60 pl-5 py-3 my-6 rounded-r-2xl text-gray-800 italic font-medium">$1</blockquote>')
    // Unordered lists
    .replace(/^\s*-\s+(.*$)/gim, '<li class="ml-6 list-disc text-gray-700 leading-relaxed mb-2">$1</li>')
    // Paragraph breaks
    .replace(/\n\n/gim, '</p><p class="text-gray-700 text-base md:text-lg leading-relaxed mb-6">');

  return `<p class="text-gray-700 text-base md:text-lg leading-relaxed mb-6">${html}</p>`;
}

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { blogs, loading } = useBlogs();
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const blog = blogs.find((b) => b.slug === slug);

  // Related articles (other published articles)
  const relatedArticles = useMemo(() => {
    return blogs
      .filter((b) => b.slug !== slug && (b.status === "Published" || !b.status))
      .slice(0, 3);
  }, [blogs, slug]);

  // Track scroll progress for reading indicator bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dynamic SEO Injection
  useEffect(() => {
    if (blog) {
      document.title = `${blog.seoTitle || blog.title} | AakaA`;

      const setMetaTag = (attrName, attrValue, content) => {
        let meta = document.querySelector(`meta[${attrName}="${attrValue}"]`);
        if (!meta) {
          meta = document.createElement("meta");
          meta.setAttribute(attrName, attrValue);
          document.head.appendChild(meta);
        }
        meta.setAttribute("content", content);
      };

      setMetaTag("name", "description", blog.seoDescription || blog.snippet);
      setMetaTag("property", "og:title", blog.seoTitle || blog.title);
      setMetaTag("property", "og:description", blog.seoDescription || blog.snippet);
      if (blog.image) setMetaTag("property", "og:image", blog.image);
      setMetaTag("property", "og:type", "article");
    }
  }, [blog, slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`Read this insight on AakaA: "${blog?.title}"\n${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`"${blog?.title}" via @AakaAHealth\n${window.location.href}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  const handleShareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-aakaa-cream flex flex-col pt-36">
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <div className="animate-spin w-10 h-10 border-4 border-aakaa-green border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-500 font-semibold text-sm">Opening article...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-aakaa-cream flex flex-col pt-36">
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
            <Sparkles size={28} />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">Article not found</h1>
          <p className="text-gray-500 text-sm max-w-sm mb-8">
            The wellness article you are looking for has been moved or updated.
          </p>
          <button
            onClick={() => navigate("/blogs")}
            className="px-8 py-3.5 bg-aakaa-green text-white rounded-full font-bold text-xs uppercase tracking-widest shadow-md hover:bg-aakaa-green/90 transition"
          >
            Return to Journal
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-aakaa-cream flex flex-col">
      {/* Sticky Top Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1.5 bg-aakaa-green z-50 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

      <main className="flex-1 pt-28 md:pt-36">
        
        {/* Article Header & Meta */}
        <div className="max-w-3xl mx-auto px-6 lg:px-8 pb-8">
          
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 mb-8 text-xs font-bold uppercase tracking-wider text-aakaa-green hover:underline"
          >
            <ArrowLeft size={14} /> Back to all articles
          </Link>

          <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-aakaa-gold uppercase tracking-wider mb-6">
            <span className="px-3 py-1 bg-white/80 border border-gray-200/60 rounded-full text-gray-800">
              {blog.category || "Mental Wellness"}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-gray-500 font-semibold">
              <Calendar size={13} /> {blog.date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-gray-500 font-semibold">
              <Clock size={13} /> {blog.readTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 leading-[1.15] tracking-tight mb-8">
            {blog.title}
          </h1>

          {/* Author Badge & Share Controls */}
          <div className="pt-6 border-t border-gray-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-aakaa-green/10 text-aakaa-green font-bold flex items-center justify-center text-sm shadow-sm">
                {blog.author ? blog.author[0] : "A"}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  {blog.author || "AakaA Clinical Team"}
                  <ShieldCheck size={15} className="text-aakaa-green" />
                </p>
                <p className="text-xs text-gray-400 font-medium">Verified Contributor</p>
              </div>
            </div>

            {/* Social Sharing Pills */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 mr-1 hidden sm:inline">Share:</span>
              <button
                onClick={handleShareWhatsApp}
                title="Share via WhatsApp"
                className="w-9 h-9 rounded-full bg-white border border-gray-200/80 flex items-center justify-center text-emerald-600 hover:bg-emerald-50 transition shadow-sm cursor-pointer"
              >
                <Share2 size={15} />
              </button>
              <button
                onClick={handleShareLinkedIn}
                title="Share on LinkedIn"
                className="w-9 h-9 rounded-full bg-white border border-gray-200/80 flex items-center justify-center text-blue-600 hover:bg-blue-50 transition shadow-sm cursor-pointer"
              >
                <span className="font-bold text-xs">in</span>
              </button>
              <button
                onClick={handleShareTwitter}
                title="Share on X"
                className="w-9 h-9 rounded-full bg-white border border-gray-200/80 flex items-center justify-center text-gray-800 hover:bg-gray-100 transition shadow-sm cursor-pointer"
              >
                <span className="font-bold text-xs">𝕏</span>
              </button>
              <button
                onClick={handleCopyLink}
                title="Copy link to clipboard"
                className="w-9 h-9 rounded-full bg-white border border-gray-200/80 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition shadow-sm cursor-pointer relative"
              >
                {copied ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} />}
                {copied && (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold py-1 px-2 rounded-md whitespace-nowrap shadow-lg">
                    Copied!
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Hero Featured Article Image */}
        <div className="max-w-4xl mx-auto px-6 lg:px-8 mb-14">
          <div className="w-full h-[320px] sm:h-[440px] md:h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/60">
            <img
              src={blog.image}
              alt={blog.imageAlt || blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Article Body Content */}
        <article className="max-w-3xl mx-auto px-6 lg:px-8 pb-16 font-inter">
          <div 
            className="prose prose-lg max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(blog.content) }} 
          />
        </article>

        {/* Clinical Disclaimer & Reflection Card */}
        <div className="max-w-3xl mx-auto px-6 lg:px-8 pb-20">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 flex items-start gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-aakaa-green/10 text-aakaa-green flex items-center justify-center shrink-0">
              <Heart size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-1">A Note From Our Clinical Team</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                The perspectives shared in this journal are designed for informational and educational support. They do not substitute for customized clinical psychological assessment. If you are experiencing acute distress, reach out to our team or access our <Link to="/crisis-resources" className="text-aakaa-green font-bold hover:underline">Crisis Support Directory</Link>.
              </p>
            </div>
          </div>
        </div>

        {/* RELATED ARTICLES SECTION */}
        {relatedArticles.length > 0 && (
          <div className="bg-white py-20 border-y border-gray-100">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-aakaa-gold block mb-1">
                    Continue Exploring
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                    Related Wellness Reads
                  </h3>
                </div>
                <Link
                  to="/blogs"
                  className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-aakaa-green hover:underline"
                >
                  View All <ArrowRight size={14} />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedArticles.map((relBlog) => (
                  <Link
                    key={relBlog._id || relBlog.slug}
                    to={`/blogs/${relBlog.slug}`}
                    className="group bg-aakaa-cream/50 rounded-3xl overflow-hidden border border-gray-100 p-4 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col"
                  >
                    <div className="h-44 rounded-2xl overflow-hidden mb-4">
                      <img
                        src={relBlog.image}
                        alt={relBlog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                      <span>{relBlog.date}</span>
                      <span>•</span>
                      <span>{relBlog.readTime}</span>
                    </div>
                    <h4 className="font-bold text-gray-900 group-hover:text-aakaa-green transition-colors text-base line-clamp-2 mb-2">
                      {relBlog.title}
                    </h4>
                    <p className="text-gray-500 text-xs line-clamp-2 mt-auto">
                      {relBlog.snippet}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM CALL TO ACTION */}
        <div className="max-w-4xl mx-auto px-6 lg:px-10 py-24">
          <div className="bg-gradient-to-br from-aakaa-green to-[#123825] rounded-[3rem] p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
            <span className="inline-block px-4 py-1.5 bg-white/10 rounded-full text-[11px] font-black uppercase tracking-widest text-aakaa-gold mb-6 border border-white/10">
              Start Your Healing Journey
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
              Ready to take the next mindful step?
            </h2>
            <p className="text-white/80 text-sm sm:text-base mb-10 max-w-xl mx-auto leading-relaxed">
              Book a private consultation with our verified clinical psychologists or join a guided somatic yoga batch to regulate your nervous system.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/booking"
                className="w-full sm:w-auto px-8 py-4 bg-white text-aakaa-green font-bold rounded-2xl text-xs uppercase tracking-widest hover:bg-aakaa-cream transition shadow-xl"
              >
                Book 1-on-1 Therapy
              </Link>
              <Link
                to="/yoga"
                className="w-full sm:w-auto px-8 py-4 bg-white/10 border border-white/20 text-white font-bold rounded-2xl text-xs uppercase tracking-widest hover:bg-white/20 transition"
              >
                Explore Somatics & Yoga
              </Link>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
