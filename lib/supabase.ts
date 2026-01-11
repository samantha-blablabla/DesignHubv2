import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// TypeScript interfaces for database tables
export interface MotionAsset {
  id: number;
  title: string;
  duration: string;
  thumb: string;
  video: string;
  link: string;
  description?: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Resource {
  id: number;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  link: string;
  tags?: string[];
  created_at?: string;
}

export interface Video {
  id: number;
  title: string;
  thumb: string;
  video: string;
}
