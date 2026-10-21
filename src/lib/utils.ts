import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { WorkCategory, Visibility } from '@/lib/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const WORK_CATEGORIES: Record<WorkCategory, string> = {
  software: 'Software & Engineering',
  research: 'Academic & Research',
  certification: 'Certificates & Credentials',
  art: 'Visual Art & Design',
  photography: 'Photography',
  music: 'Music & Audio',
  dance: 'Dance & Performing Arts',
  video: 'Video & Media Production',
  writing: 'Technical & Creative Writing',
};

export const VISIBILITY_OPTIONS: Record<Visibility, string> = {
  worldwide: 'Public (Worldwide)',
  campus: 'Campus Only (Institutional Domain)',
  connections: 'Connections Only',
  selected_users: 'Selected Users',
  only_me: 'Private (Only Me)',
};

export function getCategoryLabel(category: string): string {
  return WORK_CATEGORIES[category as WorkCategory] || category.charAt(0).toUpperCase() + category.slice(1);
}
