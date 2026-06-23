import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { Category } from '../types';
import { getCategoryIcon } from '../lib/icons';

interface CategoryCardProps {
  category: Category;
  index?: number;
}

export default function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  const Icon = getCategoryIcon(category.slug);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="h-full"
    >
      <Link to={`/explore?category=${category.slug}`} className="block h-full group">
        <div className={`w-full h-full rounded-[24px] p-6 bg-gradient-to-br ${category.color} relative overflow-hidden isolate transform-gpu border border-white/[0.08] transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.15] flex flex-col`}>

          {/* AI Generated Thematic Background */}
          <div 
            className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500 bg-cover bg-center mix-blend-overlay pointer-events-none"
            style={{ backgroundImage: `url('https://image.pollinations.ai/prompt/Abstract%20aesthetic%20dark%20background%20representing%20${encodeURIComponent(category.name)}%20technology?width=600&height=400&nologo=true')` }}
          />

          <div className="relative z-10 flex-1 flex flex-col">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm">
              <Icon size={22} className="text-white/90" />
            </div>
            <h3 className="font-semibold text-white mb-1.5 text-base tracking-tight">{category.name}</h3>
            <p className="text-[13px] text-white/60 leading-relaxed mb-4 flex-1 line-clamp-2">{category.description}</p>
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/[0.05]">
              <span className="text-[13px] text-white/50">{category.toolCount} tools</span>
              <ArrowRight size={16} className="text-white/30 group-hover:text-white/80 group-hover:translate-x-1.5 transition-all duration-300" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
