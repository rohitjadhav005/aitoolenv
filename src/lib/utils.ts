import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 1) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} days ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

export function pricingColor(pricing: string): string {
  switch (pricing) {
    case 'free': return 'badge-free';
    case 'paid': return 'badge-paid';
    case 'freemium': return 'badge-freemium';
    default: return 'badge-free';
  }
}

export function pricingLabel(pricing: string): string {
  switch (pricing) {
    case 'free': return '🟢 Free';
    case 'paid': return '💳 Paid';
    case 'freemium': return '⚡ Free + Paid Plans';
    default: return pricing;
  }
}

export function pricingTooltip(pricing: string): string {
  switch (pricing) {
    case 'free': return 'Completely free to use — no credit card needed';
    case 'paid': return 'Requires a paid subscription to use';
    case 'freemium': return 'Free basic features available; premium features require a paid plan';
    default: return '';
  }
}
