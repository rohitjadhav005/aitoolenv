import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, X, Plus, Star, ArrowUp, Globe, Sparkles } from 'lucide-react';
import { tools } from '../data/mockData';
import type { Tool } from '../types';
import { pricingColor, pricingLabel, formatNumber } from '../lib/utils';

const FEATURES = [
  'Free Plan',
  'API Access',
  'Mobile App',
  'Browser Extension',
  'Team Collaboration',
  'Custom Training',
  'Export Options',
  'Priority Support',
  'White Labeling',
  'Analytics Dashboard',
];

function getFeatureValue(tool: Tool, feature: string): boolean {
  const featureMap: Record<string, Record<string, boolean>> = {
    'Free Plan': { 'tool-1': true, 'tool-2': false, 'tool-3': false, 'tool-4': true, 'tool-9': true, 'tool-10': true, 'tool-12': true },
    'API Access': { 'tool-1': true, 'tool-2': true, 'tool-3': true, 'tool-4': true, 'tool-9': true, 'tool-10': true, 'tool-12': false },
    'Mobile App': { 'tool-1': true, 'tool-2': false, 'tool-3': true, 'tool-4': false, 'tool-9': false, 'tool-10': true, 'tool-12': true },
    'Browser Extension': { 'tool-1': false, 'tool-2': true, 'tool-3': false, 'tool-4': false, 'tool-9': false, 'tool-10': false, 'tool-12': true },
    'Team Collaboration': { 'tool-1': true, 'tool-2': true, 'tool-3': false, 'tool-4': true, 'tool-9': false, 'tool-10': false, 'tool-12': false },
    'Custom Training': { 'tool-1': false, 'tool-2': false, 'tool-3': false, 'tool-4': false, 'tool-9': true, 'tool-10': false, 'tool-12': false },
    'Export Options': { 'tool-1': true, 'tool-2': true, 'tool-3': true, 'tool-4': true, 'tool-9': true, 'tool-10': true, 'tool-12': true },
    'Priority Support': { 'tool-1': false, 'tool-2': true, 'tool-3': false, 'tool-4': false, 'tool-9': false, 'tool-10': false, 'tool-12': false },
    'White Labeling': { 'tool-1': false, 'tool-2': false, 'tool-3': false, 'tool-4': false, 'tool-9': true, 'tool-10': false, 'tool-12': false },
    'Analytics Dashboard': { 'tool-1': false, 'tool-2': true, 'tool-3': false, 'tool-4': false, 'tool-9': false, 'tool-10': false, 'tool-12': false },
  };
  return featureMap[feature]?.[tool.id] ?? (tool.features.some(f => f.toLowerCase().includes(feature.split(' ')[0].toLowerCase())));
}

export default function ComparePage() {
  const [searchParams] = useSearchParams();
  const [toolA, setToolA] = useState<Tool | null>(null);
  const [toolB, setToolB] = useState<Tool | null>(null);
  const [selectingSlot, setSelectingSlot] = useState<'A' | 'B' | null>(null);

  useEffect(() => {
    const aId = searchParams.get('a');
    const bId = searchParams.get('b');
    if (aId) setToolA(tools.find(t => t.id === aId) || null);
    if (bId) setToolB(tools.find(t => t.id === bId) || null);
    if (aId && !bId) {
      // Auto-pick a similar tool as B
      const toolAFound = tools.find(t => t.id === aId);
      if (toolAFound) {
        const similar = tools.find(t => t.categoryId === toolAFound.categoryId && t.id !== aId);
        if (similar) setToolB(similar);
      }
    }
  }, [searchParams]);

  const scoreA = toolA ? toolA.rating * 10 + toolA.upvotes / 2000 : 0;
  const scoreB = toolB ? toolB.rating * 10 + toolB.upvotes / 2000 : 0;
  const winner = toolA && toolB ? (scoreA >= scoreB ? toolA : toolB) : null;

  const [searchQuery, setSearchQuery] = useState('');

  // Filter tools for the dropdown
  const filteredTools = tools.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div>
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Compare AI Tools</h1>
            <p className="text-white/40">Side-by-side feature comparison to find the best tool for you</p>
          </div>
        </div>

        {/* Tool Selectors */}
        <div>
          <div className="grid grid-cols-2 gap-4 mb-8">
            {([['A', toolA, setToolA], ['B', toolB, setToolB]] as const).map(([slot, tool, setTool]) => (
              <div key={slot}>
                {tool ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass p-4 sm:p-5 relative"
                  >
                    <button
                      onClick={() => setTool(null)}
                      className="absolute top-3 right-3 text-white/30 hover:text-white/70 transition-colors"
                    >
                      <X size={16} />
                    </button>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm p-1.5">
                        <img
                          src={tool.logo}
                          alt={tool.name}
                          className="w-full h-full object-contain"
                          onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tool.name)}&background=7c3aed&color=fff&size=64`; }}
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-white truncate">{tool.name}</h3>
                        <span className={`${pricingColor(tool.pricing)} inline-flex mt-1`}>{pricingLabel(tool.pricing)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="flex items-center gap-1 text-amber-400">
                        <Star size={13} fill="currentColor" /> {tool.rating}
                      </span>
                      <span className="text-white/40 flex items-center gap-1">
                        <ArrowUp size={13} /> {formatNumber(tool.upvotes)}
                      </span>
                    </div>
                    {winner && winner.id === tool.id && (
                      <div className="mt-3 flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30 w-fit">
                        <Sparkles size={11} /> Winner
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <button
                    onClick={() => {
                      setSelectingSlot(slot as 'A' | 'B');
                      setSearchQuery('');
                    }}
                    className="glass glass-hover w-full h-full min-h-[120px] flex flex-col items-center justify-center gap-2 border-dashed border-white/20 text-white/40 hover:text-white/70"
                  >
                    <Plus size={20} />
                    <span className="text-sm">Select Tool {slot}</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tool selector dropdown */}
        {selectingSlot && (
          <div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-4 mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-white">Select Tool {selectingSlot}</p>
                <button onClick={() => setSelectingSlot(null)} className="text-white/40 hover:text-white/70">
                  <X size={16} />
                </button>
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search tools..."
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="input-glass w-full h-10 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-60 overflow-y-auto pr-1">
                {filteredTools.length > 0 ? filteredTools.map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      if (selectingSlot === 'A') setToolA(t);
                      else setToolB(t);
                      setSelectingSlot(null);
                    }}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-white/3 border border-white/8 hover:border-violet-500/30 hover:bg-violet-500/10 transition-all text-left"
                  >
                    <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm p-0.5">
                      <img
                        src={t.logo}
                        alt={t.name}
                        className="w-full h-full object-contain"
                        onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=7c3aed&color=fff&size=28`; }}
                      />
                    </div>
                    <span className="text-xs text-white/70 truncate">{t.name}</span>
                  </button>
                )) : (
                  <div className="col-span-full text-center py-6 text-white/40 text-sm">
                    No tools found for "{searchQuery}"
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Comparison Table */}
        {toolA && toolB && (
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass overflow-hidden"
            >
              <div className="overflow-x-auto">
                <div className="min-w-[600px] md:min-w-0">
                {/* Header */}
                <div className="grid grid-cols-3 border-b border-white/8">
                  <div className="px-6 py-4 text-sm font-semibold text-white/40 uppercase tracking-wider">Feature</div>
                  {[toolA, toolB].map(tool => (
                    <div key={tool.id} className="px-6 py-4 flex items-center gap-2 border-l border-white/8">
                      <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center shrink-0 shadow-sm p-0.5">
                        <img
                          src={tool.logo}
                          alt={tool.name}
                          className="w-full h-full object-contain"
                          onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tool.name)}&background=7c3aed&color=fff&size=24`; }}
                        />
                      </div>
                      <span className="font-bold text-white text-sm">{tool.name}</span>
                      {winner?.id === tool.id && <Sparkles size={12} className="text-violet-400" />}
                    </div>
                  ))}
                </div>

                {/* Rows */}
                {[
                  { feature: 'Rating', render: (t: Tool) => <span className="flex items-center gap-1 text-amber-400"><Star size={13} fill="currentColor" /> {t.rating}</span> },
                  { feature: 'Upvotes', render: (t: Tool) => <span className="text-white/70">{formatNumber(t.upvotes)}</span> },
                  { feature: 'Pricing', render: (t: Tool) => <span className={pricingColor(t.pricing)}>{pricingLabel(t.pricing)}</span> },
                  { feature: 'Category', render: (t: Tool) => <span className="text-white/60 text-sm">{t.category}</span> },
                  ...FEATURES.map(f => ({
                    feature: f,
                    render: (t: Tool) => {
                      const has = getFeatureValue(t, f);
                      return has
                        ? <Check size={16} className="text-emerald-400" />
                        : <X size={16} className="text-red-400/60" />;
                    },
                  })),
                  {
                    feature: 'Website', render: (t: Tool) => (
                      <a href={t.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-violet-400 hover:text-violet-300 text-xs">
                        <Globe size={12} /> Visit
                      </a>
                    )
                  },
                ].map(({ feature, render }, i) => (
                  <div key={feature} className={`grid grid-cols-3 border-b border-white/5 ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                    <div className="px-6 py-3.5 text-sm text-white/50">{feature}</div>
                    {[toolA, toolB].map(tool => (
                      <div key={tool.id} className="px-6 py-3.5 border-l border-white/5">
                        {render(tool)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}

        {/* Empty state */}
        {!toolA && !toolB && (
          <div>
            <div className="text-center py-16 glass rounded-2xl">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-white mb-2">Choose tools to compare</h3>
              <p className="text-white/40 text-sm mb-6">Select two AI tools above to see a side-by-side comparison</p>
              <Link to="/explore" className="btn-accent">Browse Tools</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
