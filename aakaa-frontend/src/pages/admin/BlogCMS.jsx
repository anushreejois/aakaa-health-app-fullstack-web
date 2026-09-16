import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, FileText, Download, X, CheckCircle, AlertCircle, Search, Globe, Image as ImageIcon } from 'lucide-react';
import { useBlogs } from '../../context/BlogContext';
import { exportToCSV } from '../../utils/csvUtils';
import { createPortal } from 'react-dom';

import { motion, AnimatePresence } from 'framer-motion';

const BlogCMS = () => {
  const { blogs, loading, addBlog, updateBlog, deleteBlog } = useBlogs();
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [notification, setNotification] = useState(null);
  const [formData, setFormData] = useState({ 
    title: '', 
    author: '', 
    status: 'Draft',
    content: '',
    snippet: '',
    seoTitle: '',
    seoDescription: '',
    slug: '',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop',
    imageAlt: ''
  });

  const handleExport = () => {
    exportToCSV(blogs, 'blog_posts_inventory.csv');
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Confirm permanent deletion? This will remove the article from the live ecosystem.')) {
      const success = await deleteBlog(id);
      if (success) showNotification('Article purged from live site');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalSlug = formData.slug || formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    
    if (editingBlog) {
      const success = await updateBlog(editingBlog._id, { ...formData, slug: finalSlug });
      if (success) showNotification('Manifest updated on production!');
    } else {
      const newPost = {
        ...formData,
        slug: finalSlug,
        views: 0,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        readTime: `${Math.ceil(formData.content.split(' ').length / 200)} min read`
      };
      const success = await addBlog(newPost);
      if (success) showNotification('New manifest published live!');
    }
    closeModal();
  };

  const openModal = (blog = null) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({ 
        title: blog.title || '', 
        author: blog.author || '', 
        status: blog.status || 'Draft',
        content: blog.content || '',
        snippet: blog.snippet || '',
        seoTitle: blog.seoTitle || '',
        seoDescription: blog.seoDescription || '',
        slug: blog.slug || '',
        image: blog.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop',
        imageAlt: blog.imageAlt || ''
      });
    } else {
      setEditingBlog(null);
      setFormData({ 
        title: '', 
        author: '', 
        status: 'Draft',
        content: '',
        snippet: '',
        seoTitle: '',
        seoDescription: '',
        slug: '',
        image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop',
        imageAlt: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBlog(null);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-aakaa-green tracking-tight">Editorial Hub</h1>
          <p className="text-aakaa-gold text-sm font-medium mt-1">Orchestrate and deploy clinical insights and wellness content.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 bg-white text-aakaa-green border border-aakaa-green/10 px-5 py-2.5 rounded-2xl text-sm font-bold hover:bg-aakaa-green/5 transition-all shadow-sm"
          >
            <Download size={16} />
            <span className="hidden md:inline">Export Inventory</span>
          </button>
          <button 
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-aakaa-green text-white px-5 py-2.5 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-aakaa-green/90 transition-all shadow-xl shadow-aakaa-green/20"
          >
            <Plus size={16} />
            Draft Article
          </button>
        </div>
      </div>

      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-24 right-8 bg-aakaa-green text-white px-8 py-4 rounded-[1.5rem] shadow-2xl z-50 flex items-center gap-3 font-bold text-sm border border-white/10"
          >
            <CheckCircle size={18} />
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="col-span-full py-24 text-center">
              <div className="animate-spin w-10 h-10 border-4 border-aakaa-green border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-aakaa-gold font-black">Syncing with Editorial Vault...</p>
            </div>
          ) : blogs.length > 0 ? (
            blogs.map((blog, index) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                key={blog._id} 
                className="bg-white rounded-[2.5rem] border border-aakaa-green/5 premium-shadow overflow-hidden group hover:scale-[1.02] transition-all duration-500"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <button 
                      onClick={() => openModal(blog)}
                      className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border border-white/20 hover:bg-white hover:text-aakaa-green transition-all"
                    >
                      Quick Edit
                    </button>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      blog.status === 'Published' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                    }`}>
                      {blog.status}
                    </span>
                    <div className="flex items-center gap-2 text-aakaa-gold text-xs font-black">
                      <Eye size={16} className="opacity-30" />
                      {blog.views}
                    </div>
                  </div>
                  <h3 className="font-black text-aakaa-green text-xl mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-aakaa-gold transition-colors">{blog.title}</h3>
                  <div className="flex items-center gap-2 text-aakaa-gold text-xs font-bold mb-8">
                    <FileText size={14} className="opacity-40" />
                    {blog.author}
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-aakaa-green/5">
                    <p className="text-[10px] text-aakaa-gold font-black uppercase tracking-widest opacity-60">{blog.date}</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => openModal(blog)}
                        className="p-3 text-aakaa-green hover:bg-aakaa-green/5 rounded-2xl transition-all"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(blog._id)}
                        className="p-3 text-red-400 hover:bg-red-50 rounded-2xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full py-24 text-center">
              <div className="flex flex-col items-center gap-4">
                <AlertCircle size={64} className="text-aakaa-gold/20" />
                <p className="text-aakaa-gold font-black text-xl">The editorial ledger is currently empty.</p>
                <button onClick={() => openModal()} className="text-aakaa-green font-bold hover:underline">Draft your first masterpiece</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>


      {/* Unified Full-Screen Editorial Modal */}
      <AnimatePresence>
        {showModal && createPortal(
          <div className="fixed inset-0 bg-aakaa-green/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[3rem] w-full max-w-6xl h-[90vh] overflow-hidden shadow-2xl flex flex-col premium-shadow border border-white/20"
            >
              <div className="p-8 border-b border-aakaa-green/5 flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                <div>
                  <h2 className="text-2xl font-black text-aakaa-green tracking-tight">{editingBlog ? 'Editorial Mode' : 'New Manifest'}</h2>
                  <p className="text-aakaa-gold text-[10px] font-black uppercase tracking-[0.2em] mt-1">Clinical CMS & SEO Pipeline</p>
                </div>
                <button onClick={closeModal} className="p-3 hover:bg-aakaa-cream/50 rounded-full transition-colors text-aakaa-gold group">
                  <X size={28} className="group-hover:rotate-90 transition-transform" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-12 scrollbar-hide">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  
                  {/* Main Content Area */}
                  <div className="lg:col-span-8 space-y-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-aakaa-gold uppercase tracking-[0.2em]">Primary Headline</label>
                      <input
                        required
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full text-3xl font-black px-0 py-2 bg-transparent border-b-2 border-aakaa-green/10 focus:border-aakaa-green focus:outline-none transition-all placeholder:text-gray-200 tracking-tight"
                        placeholder="Enter title here..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-aakaa-gold uppercase tracking-[0.2em]">Contributor</label>
                        <input
                          required
                          type="text"
                          value={formData.author}
                          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                          className="w-full px-6 py-4 bg-aakaa-cream/10 border border-aakaa-green/5 rounded-2xl focus:ring-4 focus:ring-aakaa-green/5 focus:outline-none transition-all font-bold text-aakaa-green"
                          placeholder="Dr. John Doe"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-aakaa-gold uppercase tracking-[0.2em]">Lifecycle Status</label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          className="w-full px-6 py-4 bg-aakaa-cream/10 border border-aakaa-green/5 rounded-2xl focus:ring-4 focus:ring-aakaa-green/5 focus:outline-none transition-all appearance-none font-bold text-aakaa-green cursor-pointer"
                        >
                          <option value="Draft">Draft Stage</option>
                          <option value="Published">Live Ecosystem</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-aakaa-gold uppercase tracking-[0.2em]">Abstract (Card Excerpt)</label>
                      <textarea
                        required
                        rows={3}
                        value={formData.snippet}
                        onChange={(e) => setFormData({ ...formData, snippet: e.target.value })}
                        className="w-full px-6 py-4 bg-aakaa-cream/10 border border-aakaa-green/5 rounded-2xl focus:ring-4 focus:ring-aakaa-green/5 focus:outline-none transition-all text-sm font-medium leading-relaxed text-aakaa-gold"
                        placeholder="Brief summary for discovery listings..."
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black text-aakaa-gold uppercase tracking-[0.2em]">Manifest Body</label>
                        <span className="text-[9px] font-black text-aakaa-gold/40 uppercase tracking-widest italic">Supports Markdown Rendering</span>
                      </div>
                      <textarea
                        required
                        rows={15}
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="w-full px-8 py-8 bg-aakaa-cream/10 border border-aakaa-green/5 rounded-[2rem] focus:ring-4 focus:ring-aakaa-green/5 focus:outline-none transition-all font-mono text-sm leading-loose text-aakaa-green scrollbar-hide"
                        placeholder="# Start writing..."
                      />
                    </div>
                  </div>

                  {/* Sidebar Area: SEO & Media */}
                  <div className="lg:col-span-4 space-y-10">
                    <div className="bg-aakaa-cream/10 p-8 rounded-[2.5rem] border border-aakaa-green/5 space-y-8">
                      {/* SEO Hub */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-xl shadow-sm text-aakaa-green">
                            <Globe size={18} />
                          </div>
                          <h4 className="font-black text-aakaa-green text-sm uppercase tracking-widest">Search Engine Core</h4>
                        </div>

                        <div className="space-y-3">
                          <label className="text-[9px] font-black text-aakaa-gold uppercase tracking-widest opacity-60">Identity Slug</label>
                          <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            className="w-full px-5 py-3 bg-white border border-aakaa-green/5 rounded-xl focus:outline-none transition-all text-xs font-mono font-black text-aakaa-green"
                            placeholder="url-friendly-slug"
                          />
                        </div>

                        <div className="space-y-3">
                          <label className="text-[9px] font-black text-aakaa-gold uppercase tracking-widest opacity-60">Metadata Title</label>
                          <input
                            type="text"
                            value={formData.seoTitle}
                            onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                            className="w-full px-5 py-3 bg-white border border-aakaa-green/5 rounded-xl focus:outline-none transition-all text-xs font-bold"
                            placeholder="Optimized for search indexing..."
                          />
                        </div>

                        <div className="space-y-3">
                          <label className="text-[9px] font-black text-aakaa-gold uppercase tracking-widest opacity-60">Manifest Summary</label>
                          <textarea
                            rows={4}
                            value={formData.seoDescription}
                            onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                            className="w-full px-5 py-3 bg-white border border-aakaa-green/5 rounded-xl focus:outline-none transition-all text-xs font-medium leading-relaxed"
                            placeholder="160-character search snippet..."
                          />
                        </div>
                      </div>

                      {/* Asset Hub */}
                      <div className="space-y-6 pt-8 border-t border-aakaa-green/10">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-xl shadow-sm text-aakaa-green">
                            <ImageIcon size={18} />
                          </div>
                          <h4 className="font-black text-aakaa-green text-sm uppercase tracking-widest">Visual Assets</h4>
                        </div>

                        <div className="space-y-3">
                          <label className="text-[9px] font-black text-aakaa-gold uppercase tracking-widest opacity-60">Hero Image URL</label>
                          <input
                            type="text"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            className="w-full px-5 py-3 bg-white border border-aakaa-green/5 rounded-xl focus:outline-none transition-all text-xs font-mono"
                            placeholder="Source URL..."
                          />
                          {formData.image && (
                            <div className="mt-4 rounded-2xl overflow-hidden aspect-video border border-aakaa-green/5">
                              <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>

                        <div className="space-y-3">
                          <label className="text-[9px] font-black text-aakaa-gold uppercase tracking-widest opacity-60">Accessibility Alt Text</label>
                          <input
                            type="text"
                            value={formData.imageAlt}
                            onChange={(e) => setFormData({ ...formData, imageAlt: e.target.value })}
                            className="w-full px-5 py-3 bg-white border border-aakaa-green/5 rounded-xl focus:outline-none transition-all text-xs font-medium"
                            placeholder="Descriptive text for screen readers..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
                
                <div className="mt-16 flex flex-col sm:flex-row gap-4 pt-10 border-t border-aakaa-green/10">
                  <button type="button" onClick={closeModal} className="px-12 py-5 border border-aakaa-green/10 rounded-2xl text-xs font-black text-aakaa-gold hover:bg-aakaa-cream transition-all uppercase tracking-[0.2em]">
                    Discard
                  </button>
                  <button type="submit" className="flex-1 px-12 py-5 bg-aakaa-green text-white rounded-2xl text-lg font-black hover:bg-aakaa-green/90 transition-all shadow-2xl shadow-aakaa-green/20 uppercase tracking-widest">
                    {editingBlog ? 'Update Production Manifest' : 'Deploy to Production'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>,
          document.body
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogCMS;
