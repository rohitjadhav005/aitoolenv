export type Pricing = 'free' | 'paid' | 'freemium';

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  toolCount: number;
  color: string;
}

export interface Tool {
  id: string;
  name: string;
  tagline: string;
  description: string;
  website: string;
  pricing: Pricing;
  logo: string;
  category: string;
  categoryId: string;
  tags: string[];
  upvotes: number;
  views: number;
  isFeatured: boolean;
  isNew: boolean;
  rating: number;
  reviewCount: number;
  screenshots: string[];
  features: string[];
  submittedBy: string;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  toolId: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpful: number;
}

export interface Collection {
  id: string;
  title: string;
  description: string;
  emoji: string;
  toolIds: string[];
  toolCount: number;
  gradient: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bookmarks: string[];
  submittedTools: string[];
  bio: string;
  createdAt: string;
}

export interface CompareFeature {
  name: string;
  toolA: boolean | string;
  toolB: boolean | string;
}

export interface AdminStats {
  totalUsers: number;
  totalTools: number;
  totalReviews: number;
  totalBookmarks: number;
  monthlyGrowth: number[];
  topCategories: { name: string; count: number }[];
  mostBookmarked: Tool[];
}
