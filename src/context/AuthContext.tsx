import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  googleLoginHandler: (credential: string) => Promise<void>;
  githubLoginHandler: (code: string) => Promise<void>;
  logout: () => void;
  toggleBookmark: (toolId: string) => void;
  isBookmarked: (toolId: string) => boolean;
  toggleLike: (toolId: string) => void;
  likes: string[];
}

const AuthContext = createContext<AuthContextType | null>(null);



export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [likes, setLikes] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('ai-tools-user');
    if (stored) setUser(JSON.parse(stored));
    
    // Optional: fetch to /api/auth/me using token to verify
    
    const storedLikes = localStorage.getItem('ai-tools-likes');
    if (storedLikes) setLikes(JSON.parse(storedLikes));
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Login failed');
      
      const loggedInUser: User = { ...data.user, bookmarks: [], submittedTools: [], avatar: 'https://ui-avatars.com/api/?name='+encodeURIComponent(data.user.name), bio: '', createdAt: new Date().toISOString() };
      setUser(loggedInUser);
      localStorage.setItem('ai-tools-user', JSON.stringify(loggedInUser));
      localStorage.setItem('ai-tools-token', data.token);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const googleLoginHandler = async (credential: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Google login failed`);
      finishLogin(data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const githubLoginHandler = async (code: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/github`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `GitHub login failed`);
      finishLogin(data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const finishLogin = (data: any) => {
    const loggedInUser: User = { 
      ...data.user, 
      bookmarks: [], 
      submittedTools: [], 
      avatar: data.user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(data.user.name), 
      bio: '', 
      createdAt: new Date().toISOString() 
    };
    setUser(loggedInUser);
    localStorage.setItem('ai-tools-user', JSON.stringify(loggedInUser));
    localStorage.setItem('ai-tools-token', data.token);
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      
      const newUser: User = {
        ...data.user,
        avatar: 'https://ui-avatars.com/api/?name='+encodeURIComponent(data.user.name),
        bookmarks: [],
        submittedTools: [],
        bio: '',
        createdAt: new Date().toISOString(),
      };
      setUser(newUser);
      localStorage.setItem('ai-tools-user', JSON.stringify(newUser));
      localStorage.setItem('ai-tools-token', data.token);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ai-tools-user');
    localStorage.removeItem('ai-tools-token');
  };

  const toggleBookmark = (toolId: string) => {
    if (!user) return;
    const updated = user.bookmarks.includes(toolId)
      ? user.bookmarks.filter(id => id !== toolId)
      : [...user.bookmarks, toolId];
    const updatedUser = { ...user, bookmarks: updated };
    setUser(updatedUser);
    localStorage.setItem('ai-tools-user', JSON.stringify(updatedUser));
  };

  const isBookmarked = (toolId: string) => {
    return user?.bookmarks.includes(toolId) ?? false;
  };

  const toggleLike = (toolId: string) => {
    const updated = likes.includes(toolId)
      ? likes.filter(id => id !== toolId)
      : [...likes, toolId];
    setLikes(updated);
    localStorage.setItem('ai-tools-likes', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, googleLoginHandler, githubLoginHandler, logout, toggleBookmark, isBookmarked, toggleLike, likes }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
