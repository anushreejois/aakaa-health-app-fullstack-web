import React, { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useBlogs } from "../context/BlogContext";
import Footer from "../components/Home/Footer";
import CTASection from "../components/Home/CTASection";

// Simple Markdown parser to safely render basic our mock blog markdown to HTML
function renderMarkdown(content) {
  let html = content
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\n\n/gim, '<br/><br/>');
  return html;
}

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { blogs, loading } = useBlogs();
  
  const blog = blogs.find(b => b.slug === slug);

  // Dynamic SEO Injection
  useEffect(() => {
    if (blog) {
      // Update Page Title
      document.title = `${blog.seoTitle || blog.title} | Aakaapsy`;
      
      // Update Meta Description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        document.head.appendChild(metaDescription);
      }
      metaDescription.content = blog.seoDescription || blog.snippet;
    }
  }, [blog, slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-aakaa-cream flex flex-col pt-32">
        <main className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="animate-spin w-10 h-10 border-4 border-aakaa-green border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-500 font-medium">Opening Article...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-aakaa-cream flex flex-col pt-32">
        <main className="flex-1 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Article not found</h1>
          <p className="text-gray-600 mb-8">The blog post you are looking for doesn't exist.</p>
          <button onClick={() => navigate('/blogs')} className="bg-aakaa-green text-white px-8 py-3 rounded-full font-semibold">
            Back to blogs
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-aakaa-cream flex flex-col pt-24 md:pt-32">
      
      <main className="flex-1">
        {/* Article Header */}
        <div className="max-w-3xl mx-auto px-6 lg:px-10 pb-8 text-center pt-8">
          <Link to="/blogs" className="inline-block mb-8 text-aakaa-green font-semibold hover:underline text-sm">
            &larr; Back to all articles
          </Link>
          <div className="flex items-center justify-center gap-3 text-sm font-semibold text-aakaa-gold uppercase tracking-wider mb-6">
            <span>{blog.date}</span>
            <span>•</span>
            <span>{blog.readTime}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-8">
            {blog.title}
          </h1>
        </div>

        {/* Hero Image */}
        <div className="max-w-5xl mx-auto px-6 lg:px-10 mb-16">
          <div className="w-full h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden shadow-xl">
            <img 
              src={blog.image} 
              alt={blog.title} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Article Body */}
        <article className="max-w-3xl mx-auto px-6 lg:px-10 pb-24 prose prose-lg prose-headings:text-gray-900 prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-aakaa-green hover:prose-a:underline">
          <div dangerouslySetInnerHTML={{ __html: renderMarkdown(blog.content) }} />
        </article>

        {/* Ready to join? CTA */}
        <div className="max-w-4xl mx-auto px-6 lg:px-10 pb-28">
           <div className="bg-white rounded-[2rem] p-10 md:p-16 text-center shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
             <h2 className="text-3xl font-bold text-gray-900 mb-4">Start your wellness journey.</h2>
             <p className="text-gray-600 mb-8 max-w-lg mx-auto">Don't miss out on early access to Aakaapsy. Join our waitlist today to be the first to know when we launch.</p>
             <a href="/#waitlist" className="inline-block bg-aakaa-green text-white px-8 py-4 rounded-full font-semibold hover:bg-aakaa-green/90 transition shadow-[0_12px_30px_rgba(30,77,54,0.45)]">
               Join the Waitlist
             </a>
           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
