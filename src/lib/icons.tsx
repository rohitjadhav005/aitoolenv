import {
  PenLine, Code2, Palette, Video, ImageIcon, Zap,
  BarChart2, GraduationCap, MessageSquare, Search,
  Mic, Headphones, Workflow, Bot, MonitorPlay,
  Users, VolumeX, type LucideProps,
} from 'lucide-react';
import type { FC } from 'react';

type IconComponent = FC<LucideProps>;

/** Maps a category slug to its Lucide icon component */
export const CATEGORY_ICONS: Record<string, IconComponent> = {
  writing: PenLine,
  coding: Code2,
  design: Palette,
  video: Video,
  'image-generation': ImageIcon,
  productivity: Zap,
  marketing: BarChart2,
  education: GraduationCap,
  chatbot: MessageSquare,
  search: Search,
  voice: Mic,
  audio: Headphones,
  automation: Workflow,
  agents: Bot,
  presentation: MonitorPlay,
  meeting: Users,
  'noise-cancellation': VolumeX,
};

export function getCategoryIcon(slug: string): IconComponent {
  return CATEGORY_ICONS[slug] ?? Zap;
}
