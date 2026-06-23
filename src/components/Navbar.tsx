import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Search, Menu, X, Bookmark, Plus, User, LogOut, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/explore', label: 'Explore' },
    { href: '/collections', label: 'Collections' },
    { href: '/compare', label: 'Compare' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 flex flex-col items-center justify-start pointer-events-none transition-all duration-300 ${isScrolled ? 'pt-4 px-4' : 'pt-0 px-0'}`}>
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className={`pointer-events-auto h-[60px] grid grid-cols-2 md:grid-cols-[1fr_auto_1fr] items-center transition-all duration-500 w-full max-w-7xl mx-auto rounded-full ${
            isScrolled
              ? 'px-6 bg-white/[0.03] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-2xl'
              : 'px-4 bg-transparent border border-transparent shadow-none backdrop-blur-none'
          }`}
        >
          {/* Logo */}
            <div className="flex justify-start">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shadow-accent-sm group-hover:shadow-accent transition-all duration-300">
                  <img src="/logo.png" alt="AI Tools Logo" className="w-full h-full object-cover" />
                </div>
                <span className="font-bold text-white text-lg hidden sm:block">
                  AI<span className="gradient-text-accent">Tools</span>
                </span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center justify-center gap-4 lg:gap-8 flex-shrink-0">
              {navLinks.map(link => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`group relative text-base transition-colors whitespace-nowrap shrink-0 ${
                      isActive ? 'text-white font-bold' : 'text-white/60 font-medium'
                    }`}
                  >
                    <span className="relative inline-flex overflow-hidden">
                      <div className="translate-y-0 skew-y-0 transform-gpu transition-transform duration-500 group-hover:-translate-y-[110%] group-hover:skew-y-12">
                        {link.label}
                      </div>
                      <div className="absolute translate-y-[110%] skew-y-12 transform-gpu transition-transform duration-500 group-hover:translate-y-0 group-hover:skew-y-0 text-white">
                        {link.label}
                      </div>
                    </span>
                    {isActive && (
                      <motion.div 
                        layoutId="activeNavDot"
                        className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent shadow-[0_0_8px_rgba(209,0,209,0.8)]"
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Actions */}
            <div className="flex justify-end items-center gap-2 md:gap-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="btn-ghost !p-2.5 flex items-center justify-center text-sm"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Search button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="btn-ghost !p-2.5 sm:!px-4 sm:!py-2.5 flex items-center gap-2 text-sm whitespace-nowrap shrink-0"
              >
                <Search size={18} className="sm:w-[15px] sm:h-[15px] shrink-0" />
                <span className="hidden lg:block text-white/40 whitespace-nowrap">Search tools...</span>
                <span className="hidden lg:block text-xs text-white/25 border border-white/10 px-1.5 py-0.5 rounded whitespace-nowrap shrink-0">⌘K</span>
              </button>
              
              {/* Submit Tool */}
              <Link
                to="/submit"
                className="hidden sm:flex items-center justify-center gap-2.5 px-4 py-2 rounded-full bg-black/40 border border-white/10 hover:bg-white/5 transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] text-sm font-medium text-white whitespace-nowrap shrink-0"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                <span className="hidden sm:block">Submit Tool</span>
              </Link>

              {/* User Menu / Login */}
              <div className="hidden sm:block">
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-white/5 transition-colors"
                    >
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-8 h-8 rounded-full object-cover" 
                        onError={e => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=7c3aed&color=fff&size=32`;
                        }}
                      />
                    </button>

                    <AnimatePresence>
                      {profileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          className="absolute right-0 top-full mt-2 w-52 glass-sm py-2 z-50"
                          onMouseLeave={() => setProfileOpen(false)}
                        >
                          <div className="px-3 py-2 border-b border-white/8 mb-1">
                            <p className="text-sm font-medium text-white">{user.name}</p>
                            <p className="text-xs text-white/40">{user.email}</p>
                          </div>
                          <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                            <User size={14} /> Profile
                          </Link>
                          <Link to="/profile?tab=bookmarks" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                            <Bookmark size={14} /> Bookmarks
                          </Link>
                          <Link to="/admin" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                            <LayoutDashboard size={14} /> Admin
                          </Link>
                          <div className="border-t border-white/8 mt-1 pt-1">
                            <button
                              onClick={() => { logout(); setProfileOpen(false); }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                              <LogOut size={14} /> Sign Out
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link to="/login" className="btn-ghost text-sm py-2">Sign In</Link>
                )}
              </div>

              <button
                className="md:hidden btn-ghost p-2"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
        </motion.div>

        {/* Mobile nav (moved outside the h-[60px] flex container but inside the nav container) */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className={`md:hidden pointer-events-auto transition-all duration-300 w-full overflow-hidden ${
                isScrolled
                  ? 'mt-2 rounded-2xl border border-white/10 bg-white/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-2xl'
                  : 'border-b border-white/10 bg-white/[0.03] backdrop-blur-2xl'
              }`}
            >
              {/* Background ambient glowing orbs */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-[64px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-[64px] pointer-events-none" />

              <div className="relative z-10 px-4 py-4 flex flex-col gap-2">
                {navLinks.map(link => {
                  const isActive = location.pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={`relative text-base py-2.5 px-4 block rounded-xl transition-all duration-200 ${
                        isActive ? 'text-cyan-400 font-semibold' : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                      onClick={() => setMenuOpen(false)}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeMobileNav"
                          className="absolute inset-0 bg-cyan-500/10 border border-cyan-500/20 rounded-xl z-0"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{link.label}</span>
                    </Link>
                  );
                })}
                
                {/* Auth profile / links inside mobile drawer */}
                <div className="border-t border-white/10 mt-2 pt-3 flex flex-col gap-2">
                  {user ? (
                    <>
                      <div className="px-3.5 py-2.5 flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl mb-2 relative overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="w-10 h-10 rounded-full object-cover" 
                          onError={e => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=7c3aed&color=fff&size=40`;
                          }}
                        />
                        <div>
                          <p className="text-sm font-semibold text-white">{user.name}</p>
                          <p className="text-xs text-white/40">{user.email}</p>
                        </div>
                      </div>
                      
                      <Link 
                        to="/profile" 
                        onClick={() => setMenuOpen(false)} 
                        className="group flex items-center gap-2.5 px-3 py-2.5 text-sm text-white/70 hover:text-cyan-400 hover:bg-cyan-500/5 transition-all rounded-xl"
                      >
                        <User size={15} className="text-white/40 group-hover:text-cyan-400 transition-colors" /> Profile
                      </Link>
                      <Link 
                        to="/profile?tab=bookmarks" 
                        onClick={() => setMenuOpen(false)} 
                        className="group flex items-center gap-2.5 px-3 py-2.5 text-sm text-white/70 hover:text-cyan-400 hover:bg-cyan-500/5 transition-all rounded-xl"
                      >
                        <Bookmark size={15} className="text-white/40 group-hover:text-cyan-400 transition-colors" /> Bookmarks
                      </Link>
                      <Link 
                        to="/admin" 
                        onClick={() => setMenuOpen(false)} 
                        className="group flex items-center gap-2.5 px-3 py-2.5 text-sm text-white/70 hover:text-cyan-400 hover:bg-cyan-500/5 transition-all rounded-xl"
                      >
                        <LayoutDashboard size={15} className="text-white/40 group-hover:text-cyan-400 transition-colors" /> Admin
                      </Link>
                      
                      <button
                        onClick={() => { logout(); setMenuOpen(false); }}
                        className="group w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-all text-left rounded-xl mt-1"
                      >
                        <LogOut size={15} className="text-red-400/60 group-hover:text-red-400 transition-colors" /> Sign Out
                      </button>
                    </>
                  ) : (
                    <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-ghost text-sm py-2.5 text-center w-full block rounded-xl hover:text-white transition-all">
                      Sign In
                    </Link>
                  )}
                  
                  <button
                    onClick={toggleTheme}
                    className="btn-ghost flex items-center justify-center gap-2.5 text-sm py-2.5 w-full mt-1 rounded-xl"
                  >
                    {theme === 'dark' ? (
                      <>
                        <Sun size={15} className="text-white/40" />
                        <span>Light Mode</span>
                      </>
                    ) : (
                      <>
                        <Moon size={15} className="text-white/40" />
                        <span>Dark Mode</span>
                      </>
                    )}
                  </button>

                  <Link
                    to="/submit"
                    className="btn-accent flex items-center justify-center text-sm py-2.5 w-full mt-1 rounded-xl"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Plus size={18} className="mr-1.5" />
                    <span className="font-semibold">Submit Tool</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4"
            onClick={() => setSearchOpen(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="relative w-full max-w-2xl glass-sm overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <form onSubmit={handleSearch} className="flex items-center gap-3 p-4">
                <Search size={20} className="text-white/40 shrink-0" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search AI tools..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-white text-lg placeholder-white/30 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </form>
              <div className="px-4 pb-3 flex gap-2 flex-wrap">
                {['ChatGPT', 'Midjourney', 'Cursor', 'Claude', 'Runway'].map(q => (
                  <button
                    key={q}
                    onClick={() => {
                      setSearchQuery(q);
                      navigate(`/explore?q=${encodeURIComponent(q)}`);
                      setSearchOpen(false);
                    }}
                    className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
