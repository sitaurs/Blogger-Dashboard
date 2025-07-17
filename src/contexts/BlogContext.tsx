import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

interface Blog {
  id: string;
  name: string;
  description: string;
  url: string;
  status: string;
  posts: {
    totalItems: number;
  };
  pages: {
    totalItems: number;
  };
}

interface BlogContextType {
  blogs: Blog[];
  currentBlog: Blog | null;
  setCurrentBlog: (blog: Blog) => void;
  loading: boolean;
  refreshBlogs: () => Promise<void>;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [currentBlog, setCurrentBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/blogs');
      setBlogs(response.data);
      if (response.data.length > 0 && !currentBlog) {
        setCurrentBlog(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBlogs();
    }
  }, [isAuthenticated]);

  const refreshBlogs = async () => {
    await fetchBlogs();
  };

  return (
    <BlogContext.Provider value={{
      blogs,
      currentBlog,
      setCurrentBlog,
      loading,
      refreshBlogs
    }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};