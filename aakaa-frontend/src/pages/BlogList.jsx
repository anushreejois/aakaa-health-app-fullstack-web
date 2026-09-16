import React from "react";
import { Link } from "react-router-dom";
import { useBlogs } from "../context/BlogContext";
import Footer from "../components/Home/Footer";

export default function BlogList() {
  const { blogs, loading } = useBlogs();
  
  // Only show published posts to users
  const publishedBlogs = blogs.filter(b => b.status === "Published");

  return (
    <div className="min-h-screen bg-aakaa-cream flex flex-col pt-32">
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 lg:px-10 pb-24">
        <div className="mb-16 max-w-2xl">
          <span className="inline-block mb-4 bg-aakaa-green/10 text-aakaa-green px-4 py-1 rounded-full text-sm font-medium">
            Our Journal
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Insights for your mental wellness journey.
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            Practical advice, research, and stories to help you manage stress and live mindfully.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {loading ? (
            <div className="col-span-full py-20 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-aakaa-green border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500 font-medium">Fetching articles...</p>
            </div>
          ) : publishedBlogs.length > 0 ? (
            publishedBlogs.map((blog) => (
              <Link 
                key={blog._id} 
                to={`/blogs/${blog.slug}`}
                className="group bg-white rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="h-56 overflow-hidden">
                  <img 
                    src={blog.image} 
                    alt={blog.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-3 text-xs font-semibold text-aakaa-gold uppercase tracking-wider mb-4">
                    <span>{blog.date}</span>
                    <span>•</span>
                    <span>{blog.readTime}</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-aakaa-green transition-colors">
                    {blog.title}
                  </h2>
                  <p className="text-gray-600 mb-6 text-sm line-clamp-3">
                    {blog.snippet}
                  </p>
                  <div className="mt-auto inline-flex font-semibold text-aakaa-green text-sm group-hover:underline">
                    Read article &rarr;
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-gray-500 font-medium">No articles published yet. Check back soon!</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
