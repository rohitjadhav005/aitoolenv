import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { collections, tools } from '../data/mockData';
import ToolCard from '../components/ToolCard';
import { getCategoryIcon } from '../lib/icons';

function CollectionRow({ collection, collIdx }: { collection: typeof collections[0], collIdx: number }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -500 : 500;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const collectionTools = collection.toolIds
    .map(id => tools.find(t => t.id === id))
    .filter(Boolean) as typeof tools;

  const CollectionIcon = getCategoryIcon(collection.emoji);

  return (
    <div>
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: collIdx * 0.1 }}
        className="relative"
      >
        {/* Collection header */}
        <div className={`glass p-6 mb-6 bg-gradient-to-br ${collection.gradient} relative overflow-hidden rounded-[24px]`}>
          {/* AI Generated Thematic Background */}
          <div 
            className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-overlay pointer-events-none"
            style={{ backgroundImage: `url('https://image.pollinations.ai/prompt/Abstract%20aesthetic%20dark%20background%20representing%20${encodeURIComponent(collection.title)}?width=1000&height=200&nologo=true')` }}
          />
          <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
                  <CollectionIcon size={20} className="text-white/80" />
                </div>
                <h2 className="text-2xl font-bold text-white">{collection.title}</h2>
              </div>
              <p className="text-white/50 text-sm max-w-lg">{collection.description}</p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Scroll Arrows */}
              <div className="hidden md:flex items-center gap-1.5">
                <button 
                  onClick={() => scroll('left')} 
                  className="p-2 rounded-full bg-white/[0.05] border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-colors shadow-sm"
                >
                  <ChevronLeft size={16} />
                </button>
                <button 
                  onClick={() => scroll('right')} 
                  className="p-2 rounded-full bg-white/[0.05] border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-colors shadow-sm"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
              <Link
                to="/explore"
                className="btn-ghost text-sm flex items-center gap-1.5"
              >
                View all <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* Tools Carousel */}
        <div ref={scrollRef} className="flex overflow-x-auto gap-4 pt-2 pb-6 px-2 -mx-2 snap-x no-scrollbar scroll-smooth">
          {collectionTools.map((tool, i) => (
            <div key={`${collection.id}-${tool.id}`} className="snap-start shrink-0 w-[136px]">
              <ToolCard tool={tool} index={i} />
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}

export default function CollectionsPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-white mb-3">
              Curated <span className="gradient-text-accent">Collections</span>
            </h1>
            <p className="text-white/40 max-w-xl mx-auto">
              Hand-picked sets of AI tools organized by use case, making it easier to find the right tool for your workflow.
            </p>
          </div>
        </div>

        {/* Collections grid */}
        <div className="space-y-16">
          {collections.map((collection, collIdx) => (
            <CollectionRow key={collection.id} collection={collection} collIdx={collIdx} />
          ))}
        </div>

        {/* Submit CTA */}
        <div>
          <div className="mt-16 text-center glass p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-transparent to-purple-600/10 pointer-events-none" />
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-2">Suggest a Collection</h3>
              <p className="text-white/50 text-sm mb-6">Think we're missing a great curated list? Submit a tool to get started.</p>
              <Link to="/submit" className="btn-accent">
                Submit a Tool
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
