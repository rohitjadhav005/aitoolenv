import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import ToolCard from '../components/ToolCard';
import { tools, categories } from '../data/mockData';
import type { Tool, Pricing } from '../types';
import { cn } from '../lib/utils';
import { getCategoryIcon } from '../lib/icons';

const SORT_OPTIONS = [
  { value: 'trending', label: 'Trending' },
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'most-viewed', label: 'Most Viewed' },
];

const PRICING_OPTIONS: { value: Pricing | 'all'; label: string; class: string }[] = [
  { value: 'all', label: 'All', class: '' },
  { value: 'free', label: 'Free', class: 'badge-free' },
  { value: 'freemium', label: 'Freemium', class: 'badge-freemium' },
  { value: 'paid', label: 'Paid', class: 'badge-paid' },
];

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedPricing, setSelectedPricing] = useState<Pricing | 'all'>('all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'trending');
  const [showFilters, setShowFilters] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [allTools, setAllTools] = useState<Tool[]>(tools);
  const [filteredTools, setFilteredTools] = useState<Tool[]>(tools);

  useEffect(() => {
    fetch('http://localhost:5000/api/tools')
      .then(res => res.json())
      .then(data => {
        if (data.tools) {
          const formatTool = (t: any) => ({
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
          });
          const dbTools = data.tools.map(formatTool);
          setAllTools([...dbTools, ...tools]);
        }
      })
      .catch(console.error);

    import('socket.io-client').then(({ io }) => {
      const socket = io('http://localhost:5000');
      socket.on('tool_added', (newTool: any) => {
        const formatted = {
          id: newTool.id,
          name: newTool.name,
          tagline: newTool.tagline || '',
          description: newTool.description || '',
          website: newTool.website,
          pricing: newTool.pricing,
          logo: newTool.logo || 'https://via.placeholder.com/150',
          category: newTool.category,
          categoryId: newTool.category,
          tags: [],
          upvotes: 0,
          views: 0,
          isFeatured: false,
          isNew: true,
          rating: 5,
          reviewCount: 0,
          screenshots: [],
          features: [],
          submittedBy: newTool.user_id,
          createdAt: newTool.created_at,
        };
        setAllTools(prev => [formatted, ...prev]);
      });
      return () => { socket.disconnect(); };
    });
  }, []);

  useEffect(() => {
    let result = [...allTools];

    // Search
    if (query) {
      result = result.filter(t =>
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.tagline.toLowerCase().includes(query.toLowerCase()) ||
        t.category.toLowerCase().includes(query.toLowerCase()) ||
        t.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      const cat = categories.find(c => c.slug === selectedCategory);
      if (cat) result = result.filter(t => t.categoryId === cat.id);
    }

    // Pricing filter
    if (selectedPricing !== 'all') {
      result = result.filter(t => t.pricing === selectedPricing);
    }

    // Sort
    switch (sortBy) {
      case 'trending': result.sort((a, b) => b.upvotes - a.upvotes); break;
      case 'newest': result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'most-viewed': result.sort((a, b) => b.views - a.views); break;
    }

    setFilteredTools(result);
  }, [allTools, query, selectedCategory, selectedPricing, sortBy]);

  useEffect(() => {
    const q = searchParams.get('q');
    const cat = searchParams.get('category');
    const sort = searchParams.get('sort');
    if (q) setQuery(q);
    if (cat) setSelectedCategory(cat);
    if (sort) setSortBy(sort);
  }, [searchParams]);

  const clearFilters = () => {
    setQuery('');
    setSelectedCategory('all');
    setSelectedPricing('all');
    setSortBy('trending');
    setSearchParams({});
  };

  const hasActiveFilters = query || selectedCategory !== 'all' || selectedPricing !== 'all';

  return (
    <div className="min-h-screen pt-28 px-4 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Explore AI Tools</h1>
            <p className="text-white/40">Browse {tools.length}+ AI tools across all categories</p>
          </div>
        </div>

        {/* Search + Filters bar */}
        <div>
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Search AI tools..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="input-glass pl-11 h-11"
              />
              {query && (
                <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Sort Custom Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="input-glass flex items-center justify-between gap-3 h-11 px-4 cursor-pointer min-w-[140px] text-white/80 select-none hover:border-white/20 transition-all text-left"
              >
                <span>{SORT_OPTIONS.find(o => o.value === sortBy)?.label}</span>
                <ChevronDown size={16} className={`text-white/40 transition-transform duration-200 shrink-0 ${isSortOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isSortOpen && (
                  <>
                    {/* Backdrop click closer */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsSortOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute right-0 top-full mt-2 w-48 bg-[#0f0f1a]/95 backdrop-blur-xl border border-white/10 rounded-xl py-1.5 z-50 shadow-2xl focus:outline-none overflow-hidden"
                    >
                      {SORT_OPTIONS.map(o => (
                        <button
                          key={o.value}
                          type="button"
                          onClick={() => {
                            setSortBy(o.value);
                            setIsSortOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-150 cursor-pointer block select-none ${
                            sortBy === o.value
                              ? 'bg-violet-500/20 text-violet-300 font-semibold'
                              : 'text-white/70 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          {o.label}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn('btn-ghost h-11 flex items-center gap-2', showFilters && 'border-violet-500/40 text-violet-400')}
            >
              <SlidersHorizontal size={16} />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-violet-500" />
              )}
            </button>
          </div>

          {/* Filter panels */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="glass p-5 mb-6"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Category */}
                  <div className="flex-1">
                    <p className="text-xs text-white/40 font-medium mb-3 uppercase tracking-wider">Category</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedCategory('all')}
                        className={cn('text-sm px-3 py-1.5 rounded-full border transition-all',
                          selectedCategory === 'all'
                            ? 'border-violet-500/50 bg-violet-500/15 text-violet-400'
                            : 'border-white/10 text-white/50 hover:border-white/20 hover:text-white'
                        )}
                      >
                        All
                      </button>
                      {categories.map(cat => {
                        const CatIcon = getCategoryIcon(cat.slug);
                        return (
                          <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.slug)}
                            className={cn('text-sm px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5',
                              selectedCategory === cat.slug
                                ? 'border-violet-500/50 bg-violet-500/15 text-violet-400'
                                : 'border-white/10 text-white/50 hover:border-white/20 hover:text-white'
                            )}
                          >
                            <CatIcon size={14} /> {cat.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Pricing */}
                  <div>
                    <p className="text-xs text-white/40 font-medium mb-3 uppercase tracking-wider">Pricing</p>
                    <div className="flex gap-2">
                      {PRICING_OPTIONS.map(p => (
                        <button
                          key={p.value}
                          onClick={() => setSelectedPricing(p.value)}
                          className={cn('text-sm px-3 py-1.5 rounded-full border transition-all',
                            selectedPricing === p.value
                              ? 'border-violet-500/50 bg-violet-500/15 text-violet-400'
                              : 'border-white/10 text-white/50 hover:border-white/20 hover:text-white'
                          )}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {hasActiveFilters && (
                  <button onClick={clearFilters} className="mt-4 text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                    <X size={12} /> Clear all filters
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Category tabs (quick nav) */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={cn('shrink-0 text-sm px-4 py-2 rounded-full border transition-all flex items-center gap-1.5',
                selectedCategory === 'all'
                  ? 'border-violet-500/50 bg-violet-500/15 text-violet-400'
                  : 'border-white/10 text-white/50 hover:text-white'
              )}
            >
              All Tools
            </button>
            {categories.map(cat => {
              const CatIcon = getCategoryIcon(cat.slug);
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={cn('shrink-0 text-sm px-4 py-2 rounded-full border transition-all flex items-center gap-1.5',
                    selectedCategory === cat.slug
                      ? 'border-violet-500/50 bg-violet-500/15 text-violet-400'
                      : 'border-white/10 text-white/50 hover:text-white'
                  )}
                >
                  <CatIcon size={13} /> {cat.name}
                </button>
              );
            })}
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-white/40 whitespace-nowrap">
              {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''} found
              {query && <> for "<span className="text-violet-400">{query}</span>"</>}
            </p>
          </div>
        </div>

        {/* Tool Grid */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredTools.map((tool, i) => (
              <div key={tool.id}>
                <ToolCard tool={tool} index={i} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 glass rounded-2xl">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">No tools found</h3>
            <p className="text-white/40 text-sm mb-6">Try adjusting your search or filters</p>
            <button onClick={clearFilters} className="btn-accent">Clear filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
