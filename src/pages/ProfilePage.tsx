import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bookmark, Settings, LogOut, Wrench, Star, LayoutGrid, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { tools } from '../data/mockData';
import ToolCard from '../components/ToolCard';
import { timeAgo } from '../lib/utils';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'bookmarks');
  const [dbTools, setDbTools] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/tools')
      .then(res => res.json())
      .then(data => {
        if (data.tools) {
          const formatted = data.tools.map((t: any) => ({
            id: t.id,
            name: t.name,
            tagline: t.tagline || '',
            description: t.description || '',
            website: t.website,
            pricing: t.pricing,
            logo: t.logo || 'https://via.placeholder.com/150',
            category: t.category,
            categoryId: t.category,
            tags: [],
            upvotes: 0,
            views: 0,
            isFeatured: false,
            isNew: true,
            rating: 5,
            reviewCount: 0,
            screenshots: [],
            features: [],
            submittedBy: t.user_id,
            createdAt: t.created_at,
          }));
          setDbTools(formatted);
        }
      })
      .catch(console.error);
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center px-4 text-center">
        <div>
          <div className="w-16 h-16 rounded-2xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center mx-auto mb-5">
            <User size={28} className="text-violet-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Sign in to view profile</h1>
          <Link to="/login" className="btn-accent mt-4">Sign In</Link>
        </div>
      </div>
    );
  }

  // Combine mock data and db tools for UI fullness, but filter submitted properly
  const allTools = [...dbTools, ...tools];
  const bookmarkedTools = allTools.filter(t => user.bookmarks.includes(t.id));
  const submittedTools = dbTools.filter(t => t.submittedBy === user.id);

  const tabs = [
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark, count: bookmarkedTools.length },
    { id: 'submitted', label: 'Submitted', icon: Wrench, count: submittedTools.length },
    { id: 'reviews', label: 'Reviews', icon: Star, count: 0 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Profile header */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-6 mb-6 flex items-start gap-5 flex-wrap"
          >
            <div className="relative">
              <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-violet-500/30" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-background" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                  <p className="text-white/50 text-sm">{user.email}</p>
                  {user.bio && <p className="text-white/60 text-sm mt-1">{user.bio}</p>}
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors text-sm"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>

              <div className="flex items-center gap-5 mt-4">
                {[
                  { label: 'Bookmarks', value: bookmarkedTools.length },
                  { label: 'Reviews', value: 0 },
                  { label: 'Member since', value: timeAgo(user.createdAt) },
                ].map(({ label, value }) => (
                  <div key={label} className="text-center">
                    <div className="font-bold text-white">{value}</div>
                    <div className="text-xs text-white/40">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs and Tab Content Workspace */}
        <div>
          <div className="flex gap-1 overflow-x-auto no-scrollbar mb-6 glass-sm p-1.5">
            {tabs.map(({ id, label, icon: Icon, count }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex-1 justify-center ${
                  activeTab === id
                    ? 'bg-violet-600 text-white shadow-accent-sm'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={15} />
                {label}
                {count !== undefined && count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === id ? 'bg-white/20' : 'bg-white/10'}`}>
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {activeTab === 'bookmarks' && (
              <div>
                {bookmarkedTools.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {bookmarkedTools.map((tool, i) => (
                      <div key={tool.id}>
                        <ToolCard tool={tool} index={i} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 glass rounded-2xl">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                      <Bookmark size={24} className="text-white/30" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">No bookmarks yet</h3>
                    <p className="text-white/40 text-sm mb-4">Save tools to access them quickly later</p>
                    <Link to="/explore" className="btn-accent">Browse Tools</Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'submitted' && (
              <div className="text-center py-16 glass rounded-2xl">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <LayoutGrid size={24} className="text-white/30" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No tools submitted yet</h3>
                <p className="text-white/40 text-sm mb-4">Share an AI tool with the community</p>
                <Link to="/submit" className="btn-accent">Submit a Tool</Link>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="text-center py-16 glass rounded-2xl">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <Star size={24} className="text-white/30" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No reviews yet</h3>
                <p className="text-white/40 text-sm mb-4">Review the tools you've used to help others</p>
                <Link to="/explore" className="btn-accent">Explore Tools</Link>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="glass p-6 space-y-5">
                <h3 className="text-lg font-semibold text-white">Account Settings</h3>
                {[
                  { label: 'Display Name', value: user.name, type: 'text' },
                  { label: 'Email Address', value: user.email, type: 'email' },
                  { label: 'Bio', value: user.bio, type: 'text' },
                ].map(field => (
                  <div key={field.label}>
                    <label className="block text-sm font-medium text-white/60 mb-2">{field.label}</label>
                    <input
                      type={field.type}
                      defaultValue={field.value}
                      className="input-glass"
                    />
                  </div>
                ))}
                <button className="btn-accent">Save Changes</button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
