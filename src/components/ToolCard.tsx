import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Zap } from 'lucide-react';
import type { Tool } from '../types';

interface ToolCardProps {
  tool: Tool;
  index?: number;
}

export default function ToolCard({ tool, index = 0 }: ToolCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.15), duration: 0.3 }}
      className="h-full"
    >
      <Link to={`/tool/${tool.id}`} className="block h-full">
        <div className="w-full h-full bg-gradient-to-br from-[#9D00A0]/90 to-[#5B0060]/90 rounded-[20px] p-2 flex flex-col gap-2 relative group overflow-hidden border border-white/10 hover:border-white/20 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
          {/* Top: Large Logo */}
          <div className="w-full aspect-square rounded-[14px] bg-white flex items-center justify-center overflow-hidden relative">
            <img
              src={tool.logo}
              alt={tool.name}
              className="w-[85%] h-[85%] object-contain"
              onError={e => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tool.name)}&background=7c3aed&color=fff&size=256`;
              }}
            />
            {tool.isNew && (
              <div className="absolute top-0 left-0 bg-accent text-white text-[9px] font-bold px-1.5 py-0.5 rounded-br-lg z-10">
                NEW
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col flex-1 px-1 pb-1 justify-center">
            <h3 className="font-semibold text-white text-[13px] leading-tight truncate mb-1">
              {tool.name}
            </h3>
            
            <div className="flex items-center gap-1.5 text-[11px] text-white/70">
              <span className="flex items-center gap-0.5 font-medium">
                {tool.rating}
                <Star size={9} className="text-white/70" fill="currentColor" />
              </span>
              {tool.pricing !== 'free' && (
                <span className="flex items-center gap-1 opacity-90 truncate">
                  <span>•</span>
                  <Zap size={9} className="text-amber-400" fill="currentColor" />
                  {tool.pricing === 'freemium' ? 'Free + Paid Plans' : 'Paid'}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
