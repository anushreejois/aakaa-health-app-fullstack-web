import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

import { API_BASE_URL } from '../config';

const BlogContext = createContext();

const API_BASE = `${API_BASE_URL}/api/blogs`;

export const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const fetchBlogs = async () => {
    try {
      const response = await fetch(API_BASE);
      const data = await response.json();
      setBlogs(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const addBlog = async (newBlog) => {
    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(newBlog)
      });
      if (response.ok) {
        const savedBlog = await response.json();
        setBlogs(prev => [savedBlog, ...prev]);
        return true;
      }
    } catch (error) {
      console.error("Error adding blog:", error);
    }
    return false;
  };

  const updateBlog = async (id, updatedData) => {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(updatedData)
      });
      if (response.ok) {
        const updatedBlog = await response.json();
        setBlogs(prev => prev.map(blog => blog._id === id ? updatedBlog : blog));
        return true;
      }
    } catch (error) {
      console.error("Error updating blog:", error);
    }
    return false;
  };

  const deleteBlog = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/${id}`, { 
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        }
      });
      if (response.ok) {
        setBlogs(prev => prev.filter(blog => blog._id !== id));
        return true;
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
    return false;
  };

  return (
    <BlogContext.Provider value={{ blogs, loading, addBlog, updateBlog, deleteBlog }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlogs = () => {
  const context = useContext(BlogContext);
  if (!context) throw new Error('useBlogs must be used within a BlogProvider');
  return context;
};
