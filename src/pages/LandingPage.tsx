import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Sparkles, ChevronRight, ChevronLeft, Zap, Star, Mail } from 'lucide-react';
import ToolCard from '../components/ToolCard';
import CategoryCard from '../components/CategoryCard';
import { categories, getTrendingTools, getNewTools, getFeaturedTools } from '../data/mockData';
import VariableProximity from '../components/VariableProximity';
import GlassSurface from '../components/GlassSurface';
import GradualBlur from '../components/GradualBlur';
const featureCards = [
  {
    title: 'Discover 50+ Curated AI Tools',
    desc: 'Hand-tested and carefully selected tools across writing, coding, design, video, and more. No noise — just the best.',
    gradient: 'linear-gradient(135deg, rgba(139,92,246,0.18) 0%, rgba(6,182,212,0.08) 100%)',
    border: 'rgba(139,92,246,0.3)',
  },
  {
    title: 'Find What You Need Instantly',
    desc: 'Powerful search and category filters let you zero in on the right tool for your workflow in seconds.',
    gradient: 'linear-gradient(135deg, rgba(6,182,212,0.18) 0%, rgba(139,92,246,0.08) 100%)',
    border: 'rgba(6,182,212,0.3)',
  },
  {
    title: 'Trusted by 24K+ Users',
    desc: 'Join a growing community of builders, creators, and developers who rely on AI Tools Directory every day.',
    gradient: 'linear-gradient(135deg, rgba(251,191,36,0.15) 0%, rgba(139,92,246,0.08) 100%)',
    border: 'rgba(251,191,36,0.25)',
  },
  {
    title: 'Always Up to Date',
    desc: 'New tools added weekly. Subscribe and never miss the next breakthrough AI tool.',
    gradient: 'linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(6,182,212,0.08) 100%)',
    border: 'rgba(34,197,94,0.25)',
  },
];

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const trendingTools = getTrendingTools();


  const newTools = getNewTools();
  const featuredTools = getFeaturedTools();

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -600 : 600;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };


  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Ambient background glow orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        {/* Hero-to-Trending Orbs */}
        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[10%] left-[5%] w-[450px] h-[450px] rounded-full bg-accent/10 blur-[130px]"
        />
        <motion.div
          animate={{
            x: [0, -30, 0],
            y: [0, 40, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[25%] right-[5%] w-[500px] h-[500px] rounded-full bg-cyan-500/8 blur-[150px]"
        />

        {/* Categories-to-Editor's Picks Orbs */}
        <motion.div
          animate={{
            x: [0, 25, 0],
            y: [0, -35, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[45%] left-[-5%] w-[500px] h-[500px] rounded-full bg-violet-600/8 blur-[140px]"
        />
        <motion.div
          animate={{
            x: [0, -25, 0],
            y: [0, 25, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[60%] right-[8%] w-[450px] h-[450px] rounded-full bg-accent/8 blur-[130px]"
        />

        {/* New Launches-to-Footer Orbs */}
        <motion.div
          animate={{
            x: [0, 35, 0],
            y: [0, 35, 0],
            scale: [1, 1.12, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[18%] left-[10%] w-[550px] h-[550px] rounded-full bg-cyan-500/8 blur-[160px]"
        />
        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, -25, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 19,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[5%] right-[-5%] w-[450px] h-[450px] rounded-full bg-accent/10 blur-[130px]"
        />
      </div>



      {/* ─────── Hero Section ─────── */}
      <div>
        <section className="relative pt-32 pb-20 px-4">
          {/* Background orbs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-accent/20 via-cyan-500/5 to-transparent rounded-full pointer-events-none" />
          <div className="absolute top-40 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-60 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
          <div ref={containerRef} className="max-w-4xl mx-auto text-center relative z-10">

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1] text-balance font-display"
            >
              <div className="block mb-1">
                <VariableProximity
                  label="Supercharge Your"
                  fromFontVariationSettings="'wght' 400, 'opsz' 9"
                  toFontVariationSettings="'wght' 900, 'opsz' 40"
                  containerRef={containerRef}
                  radius={200}
                  falloff="linear"
                />
              </div>
              <div className="block text-[1.25em] leading-[1.1] mb-1 gradient-text">
                <VariableProximity
                  label="Workflow"
                  fromFontVariationSettings="'wght' 400, 'opsz' 9"
                  toFontVariationSettings="'wght' 900, 'opsz' 40"
                  containerRef={containerRef}
                  radius={200}
                  falloff="linear"
                />
              </div>
              <div className="block">
                <VariableProximity
                  label="With AI"
                  fromFontVariationSettings="'wght' 400, 'opsz' 9"
                  toFontVariationSettings="'wght' 900, 'opsz' 40"
                  containerRef={containerRef}
                  radius={200}
                  falloff="linear"
                />
              </div>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-white/60 max-w-xl mx-auto mb-10 leading-relaxed italic text-balance font-medium"
            >
              "Premium, hand-picked AI tools to 10x your productivity."
            </motion.p>


          </div>
        </section>
        {/* Fixed gradual blur at the bottom of the viewport */}
        <GradualBlur
          target="page"
          position="bottom"
          height="1em"
          strength={1.5}
          divCount={5}
          curve="bezier"
          zIndex={40}
        />
      </div>


      {/* ─────── Trending Tools ─────── */}
      <div>
        <section className="px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp size={18} className="text-accent" />
                  <h2 className="section-title">Trending Today</h2>
                </div>
                <p className="section-subtitle">What the community is loving right now.</p>
              </div>
              <Link to="/explore?sort=trending" className="btn-ghost text-sm flex items-center gap-1.5">
                View all <ChevronRight size={14} />
              </Link>
            </div>
            <div className="flex overflow-x-auto gap-4 pt-2 px-2 pb-6 -mx-2 snap-x no-scrollbar">
              {trendingTools.map((tool, i) => (
                <div key={tool.id} className="snap-start shrink-0 w-[136px]">
                  <ToolCard tool={tool} index={i} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ─────── Categories ─────── */}
      <div>
        <section className="px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={18} className="text-accent" />
                  <h2 className="section-title">Browse by Category</h2>
                </div>
                <p className="section-subtitle">Jump straight to what you need.</p>
              </div>
              <div className="flex items-center gap-2 md:gap-4">
                <div className="hidden md:flex items-center gap-1.5 mr-2">
                  <button
                    onClick={() => scroll(categoriesRef, 'left')}
                    className="p-2 rounded-full bg-white/[0.03] border border-white/[0.08] text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all shadow-sm"
                    aria-label="Scroll left"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => scroll(categoriesRef, 'right')}
                    className="p-2 rounded-full bg-white/[0.03] border border-white/[0.08] text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all shadow-sm"
                    aria-label="Scroll right"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
                <Link to="/explore" className="btn-ghost text-sm flex items-center gap-1.5">
                  All categories <ChevronRight size={14} />
                </Link>
              </div>
            </div>
            <div ref={categoriesRef} className="flex overflow-x-auto gap-4 pt-2 px-2 pb-6 -mx-2 snap-x no-scrollbar scroll-smooth">
              {categories.map((cat, i) => (
                <div key={cat.id} className="snap-start shrink-0 w-[240px] h-[180px] md:w-[280px] md:h-[200px]">
                  <CategoryCard category={cat} index={i} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ─────── Editor's Picks ─────── */}
      <div>
        <section className="px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Star size={18} className="text-amber-400" fill="currentColor" />
                  <h2 className="section-title">Editor's Picks</h2>
                </div>
                <p className="section-subtitle">Tools we think are genuinely changing the game.</p>
              </div>
            </div>
            <div className="flex overflow-x-auto gap-4 pt-2 px-2 pb-6 -mx-2 snap-x no-scrollbar">
              {featuredTools.map((tool, i) => (
                <div key={tool.id} className="snap-start shrink-0 w-[136px]">
                  <ToolCard tool={tool} index={i} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ─────── New Launches ─────── */}
      <div>
        <section className="px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Zap size={18} className="text-accent" />
                  <h2 className="section-title">Just Launched</h2>
                </div>
                <p className="section-subtitle">The freshest additions to our library.</p>
              </div>
              <Link to="/explore?sort=newest" className="btn-ghost text-sm flex items-center gap-1.5">
                See all new <ChevronRight size={14} />
              </Link>
            </div>
            <div className="flex overflow-x-auto gap-4 pt-2 px-2 pb-6 -mx-2 snap-x no-scrollbar">
              {newTools.slice(0, 10).map((tool, i) => (
                <div key={tool.id} className="snap-start shrink-0 w-[136px]">
                  <ToolCard tool={tool} index={i} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ─────── Why AI Tools Directory? (Features Grid) ─────── */}
      <div>
        <section className="px-4 pb-32">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={18} className="text-accent" />
                <h2 className="section-title">Why AI Tools Directory?</h2>
              </div>
              <p className="section-subtitle">Everything you need to find the right AI tool, faster.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featureCards.map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="glass p-8 flex flex-col justify-between transition-all duration-300 relative overflow-hidden group cursor-default"
                  style={{
                    background: card.gradient,
                    borderColor: card.border,
                  }}
                >
                  {/* Glow element on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  <div>
                    <span className="text-xs font-bold text-accent-light opacity-50 block mb-4 uppercase tracking-widest">Feature 0{i + 1}</span>
                    <h3 className="text-xl font-bold text-white mb-3 leading-snug">{card.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed font-sans">{card.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
      {/* ─────── Newsletter ─────── */}
      <div>
        <section id="newsletter" className="px-4 pb-24">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <GlassSurface
                width="100%"
                height="auto"
                borderRadius={24}
                backgroundOpacity={0.03}
                className="relative overflow-hidden"
                contentClassName="p-10 text-center"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent/5 pointer-events-none" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-accent/15 border border-accent/20 flex items-center justify-center mx-auto mb-5">
                    <Mail size={24} className="text-accent-light" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3">Stay Ahead of AI</h2>
                  <p className="text-white/50 mb-6 text-sm leading-relaxed">
                    Get weekly curated AI tool roundups, tutorials, and exclusive early access to new listings.
                  </p>
                  <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="input-glass flex-1 w-full"
                    />
                    <button type="submit" className="btn-accent shrink-0 w-full sm:w-auto">
                      Subscribe
                    </button>
                  </form>
                  <p className="text-white/25 text-xs mt-3">No spam, unsubscribe anytime. 5,000+ subscribers.</p>
                </div>
              </GlassSurface>
            </motion.div>
          </div>
        </section>
      </div>


      {/* ─────── Footer ─────── */}
      <footer className="border-t border-white/5 px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center">
                  <img src="/logo.png" alt="AI Tools Logo" className="w-full h-full object-cover" />
                </div>
                <span className="font-bold text-white">AI<span className="text-accent-light">Tools</span></span>
              </div>
              <p className="text-white/40 text-sm leading-relaxed">
                The most comprehensive directory of AI tools for every workflow.
              </p>
            </div>
            {[
              {
                title: 'Directory',
                links: [
                  { label: 'Trending', to: '/explore?sort=trending' },
                  { label: 'New Tools', to: '/explore?sort=newest' },
                  { label: 'Collections', to: '/collections' },
                  { label: 'Compare', to: '/compare' }
                ]
              },
              {
                title: 'Categories',
                links: [
                  { label: 'AI Writing', to: '/explore?category=writing' },
                  { label: 'AI Coding', to: '/explore?category=coding' },
                  { label: 'AI Design', to: '/explore?category=design' },
                  { label: 'AI Video', to: '/explore?category=video' }
                ]
              },
              {
                title: 'Community',
                links: [
                  { label: 'Submit Tool', to: '/submit' },
                  { label: 'Newsletter', to: '#newsletter' },
                  { label: 'Blog', to: '#' },
                  { label: 'About', to: '#' }
                ]
              }
            ].map(section => (
              <div key={section.title}>
                <h4 className="text-sm font-semibold text-white mb-3">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map(link => (
                    <li key={link.label}>
                      {link.to.startsWith('#') ? (
                        <a href={link.to} className="text-sm text-white/40 hover:text-white/70 transition-colors">
                          {link.label}
                        </a>
                      ) : (
                        <Link to={link.to} className="text-sm text-white/40 hover:text-white/70 transition-colors">
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
            <p className="text-white/30 text-xs">© 2024 AI Tools Directory. Built for the AI community.</p>
            <div className="flex items-center gap-4">
              <Link to="#" className="text-white/30 text-xs hover:text-white/60 transition-colors">Privacy</Link>
              <Link to="#" className="text-white/30 text-xs hover:text-white/60 transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
