import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowUp, Bookmark, ExternalLink, Star, Check, Globe, Tag,
  Share2, ChevronRight, MessageSquare, ThumbsUp, Bot, Zap
} from 'lucide-react';
import { tools, reviews } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import ToolCard from '../components/ToolCard';
import { cn, formatNumber, pricingColor, pricingLabel, timeAgo } from '../lib/utils';

export default function ToolDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isBookmarked, toggleBookmark, toggleLike, user } = useAuth();
  const [upvoted, setUpvoted] = useState(false);
  const [localUpvotes, setLocalUpvotes] = useState(0);

  const tool = tools.find(t => t.id === id);
  if (!tool) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center">
        <div>
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5">
            <Bot size={28} className="text-white/30" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Tool not found</h1>
          <Link to="/explore" className="btn-accent mt-4">Browse Tools</Link>
        </div>
      </div>
    );
  }

  const toolReviews = reviews.filter(r => r.toolId === tool.id);
  const similarTools = tools
    .filter(t => t.categoryId === tool.categoryId && t.id !== tool.id)
    .slice(0, 3);

  const handleUpvote = () => {
    if (upvoted) {
      setLocalUpvotes(v => v - 1);
    } else {
      setLocalUpvotes(v => v + 1);
    }
    setUpvoted(!upvoted);
    toggleLike(tool.id);
  };

  const bookmarked = isBookmarked(tool.id);

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div>
          <nav className="flex items-center gap-1.5 text-sm text-white/40 mb-8">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to="/explore" className="hover:text-white transition-colors">Explore</Link>
            <ChevronRight size={14} />
            <Link to={`/explore?category=${tool.categoryId}`} className="hover:text-white transition-colors">{tool.category}</Link>
            <ChevronRight size={14} />
            <span className="text-white">{tool.name}</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Main Content ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-6"
              >
                <div className="flex items-start gap-4">
                  {/* Logo */}
                  <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm p-2">
                    <img
                      src={tool.logo}
                      alt={tool.name}
                      className="w-full h-full object-contain"
                      onError={e => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tool.name)}&background=7c3aed&color=fff&size=64`;
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h1 className="text-2xl font-bold text-white">{tool.name}</h1>
                          {tool.isFeatured && (
                            <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20 font-medium">
                              <Star size={10} fill="currentColor" /> Featured
                            </span>
                          )}
                          {tool.isNew && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/20 font-medium">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-white/60">{tool.tagline}</p>
                      </div>
                      <span className={pricingColor(tool.pricing)}>{pricingLabel(tool.pricing)}</span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {tool.tags.map(tag => (
                        <span key={tag} className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-white/5 border border-white/8 text-white/40">
                          <Tag size={10} /> #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <Star size={15} className="text-amber-400" fill="currentColor" />
                    <span className="font-semibold text-white">{tool.rating}</span>
                    <span className="text-white/40 text-sm">({formatNumber(tool.reviewCount)} reviews)</span>
                  </div>
                  <span className="text-white/20">·</span>
                  <span className="text-sm text-white/40">{formatNumber(tool.views)} views</span>
                  <span className="text-white/20">·</span>
                  <span className="text-sm text-white/40">{tool.category}</span>
                  <span className="text-white/20">·</span>
                  <span className="text-sm text-white/40">Launched {timeAgo(tool.createdAt)}</span>
                </div>
              </motion.div>
            </div>

            {/* Description */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass p-6"
              >
                <h2 className="text-lg font-semibold text-white mb-4">About {tool.name}</h2>
                <p className="text-white/60 leading-relaxed">{tool.description}</p>
              </motion.div>
            </div>

            {/* Features */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="glass p-6"
              >
                <h2 className="text-lg font-semibold text-white mb-4">Key Features</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tool.features.map(feature => (
                    <div key={feature} className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shrink-0">
                        <Check size={11} className="text-violet-400" />
                      </div>
                      <span className="text-sm text-white/70">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Reviews */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass p-6"
              >
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <MessageSquare size={18} className="text-violet-400" />
                    User Reviews
                  </h2>
                  {/* Rating summary */}
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-black text-white">{tool.rating}</div>
                    <div>
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(star => (
                          <Star
                            key={star}
                            size={12}
                            className={star <= Math.round(tool.rating) ? 'text-amber-400' : 'text-white/20'}
                            fill={star <= Math.round(tool.rating) ? 'currentColor' : 'none'}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-white/40">{formatNumber(tool.reviewCount)} reviews</p>
                    </div>
                  </div>
                </div>

                {toolReviews.length > 0 ? (
                  <div className="space-y-4">
                    {toolReviews.map(review => (
                      <div key={review.id} className="p-4 rounded-xl bg-white/3 border border-white/5">
                        <div className="flex items-start gap-3">
                          <img src={review.userAvatar} alt={review.userName} className="w-9 h-9 rounded-full object-cover shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="font-medium text-white text-sm">{review.userName}</span>
                              <div className="flex gap-0.5">
                                {[1,2,3,4,5].map(s => (
                                  <Star key={s} size={11} className={s <= review.rating ? 'text-amber-400' : 'text-white/20'} fill={s <= review.rating ? 'currentColor' : 'none'} />
                                ))}
                              </div>
                              <span className="text-xs text-white/30">{timeAgo(review.createdAt)}</span>
                            </div>
                            <p className="text-sm text-white/60 leading-relaxed">{review.comment}</p>
                            <button className="flex items-center gap-1 mt-2 text-xs text-white/30 hover:text-white/60 transition-colors">
                              <ThumbsUp size={11} /> Helpful ({review.helpful})
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/40 text-sm">No reviews yet. Be the first to review!</p>
                )}

                {user && (
                  <button className="btn-ghost w-full mt-4 text-sm">Write a Review</button>
                )}
              </motion.div>
            </div>

            {/* Similar Tools */}
            {similarTools.length > 0 && (
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <h2 className="text-lg font-semibold text-white mb-4">Similar Tools</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3">
                    {similarTools.map((t, i) => (
                      <ToolCard key={t.id} tool={t} index={i} />
                    ))}
                  </div>
                </motion.div>
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-4">
            {/* Action buttons */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass p-5 space-y-3"
              >
                <a
                  href={tool.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-accent flex items-center justify-center gap-2 w-full"
                >
                  <Globe size={16} />
                  Visit Website
                  <ExternalLink size={14} />
                </a>

                <button
                  onClick={handleUpvote}
                  className={cn(
                    'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border font-semibold transition-all',
                    upvoted
                      ? 'border-violet-500/50 bg-violet-500/15 text-violet-400'
                      : 'border-white/15 bg-white/5 text-white/70 hover:border-violet-500/30 hover:text-violet-400'
                  )}
                >
                  <ArrowUp size={16} />
                  Upvote · {formatNumber(tool.upvotes + localUpvotes)}
                </button>

                <div className="flex gap-2">
                  {user && (
                    <button
                      onClick={() => toggleBookmark(tool.id)}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all',
                        bookmarked
                          ? 'border-amber-500/50 bg-amber-500/15 text-amber-400'
                          : 'border-white/10 text-white/50 hover:text-amber-400 hover:border-amber-500/30'
                      )}
                    >
                      <Bookmark size={15} fill={bookmarked ? 'currentColor' : 'none'} />
                      {bookmarked ? 'Saved' : 'Save'}
                    </button>
                  )}
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-white/10 text-white/50 text-sm hover:text-white hover:bg-white/5 transition-all">
                    <Share2 size={15} /> Share
                  </button>
                  <Link
                    to={`/compare?a=${tool.id}`}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl border border-white/10 text-white/50 text-sm hover:text-white hover:bg-white/5 transition-all whitespace-nowrap"
                  >
                    Compare
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Tool Info */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="glass p-5"
              >
                <h3 className="text-sm font-semibold text-white mb-4">Tool Info</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Category', value: tool.category },
                    { label: 'Pricing', value: pricingLabel(tool.pricing) },
                    { label: 'Submitted by', value: tool.submittedBy },
                    { label: 'Launch date', value: new Date(tool.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between items-center">
                      <span className="text-xs text-white/40">{item.label}</span>
                      <span className="text-xs text-white font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Quick Compare CTA */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="glass p-5 bg-gradient-to-br from-violet-600/10 to-purple-600/5"
              >
                <div className="w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center mb-3">
                  <Zap size={16} className="text-violet-400" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">Compare Tools</h3>
                <p className="text-xs text-white/40 mb-3 leading-relaxed">
                  See how {tool.name} stacks up against alternatives
                </p>
                <Link to={`/compare?a=${tool.id}`} className="btn-ghost text-sm w-full flex items-center justify-center gap-1">
                  Open Comparison <ChevronRight size={14} />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
