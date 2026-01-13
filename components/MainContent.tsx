import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionValueEvent, useScroll } from 'framer-motion';
import { Search, ArrowUpRight, Heart } from 'lucide-react';
import { useCursor } from './CursorContext';
import SmartVideoGallery from './SmartVideoGallery';
import BigFooter from './BigFooter';
import ResourceModal from './ResourceModal';

// --- Types & Data ---

type Category = 'All' | 'Favorites' | 'Icons' | 'Colors' | 'Fonts' | 'Illustrations' | 'UI Kits' | 'Utilities';

interface Resource {
  id: string | number;
  title: string;
  category: Category;
  image: string;
  thumbnail?: string; // For modal compatibility
  description: string;
  color: string;
  link?: string; // For modal
  tags?: string[]; // For modal
}

const CATEGORIES: Category[] = ['All', 'Favorites', 'UI Kits', 'Icons', 'Fonts', 'Illustrations', 'Colors', 'Utilities'];

const RESOURCES: Resource[] = [
  // === UI KITS === (10 items)
  { id: '1', title: 'Tailwind UI Pro', category: 'UI Kits', image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800', description: 'Premium component library with 500+ professionally designed Tailwind CSS components.', color: '#3b82f6', tags: ['tailwind', 'react', 'vue'], link: 'https://tailwindui.com' },
  { id: '2', title: 'Shadcn UI', category: 'UI Kits', image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=800', description: 'Beautifully designed components built with Radix UI and Tailwind CSS.', color: '#14b8a6', tags: ['radix', 'accessible', 'modern'], link: 'https://ui.shadcn.com' },
  { id: '3', title: 'MUI (Material-UI)', category: 'UI Kits', image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=800', description: 'React components implementing Googles Material Design system.', color: '#2196f3', tags: ['material', 'react', 'production'], link: 'https://mui.com' },
  { id: '4', title: 'Chakra UI', category: 'UI Kits', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800', description: 'Simple, modular and accessible component library for React applications.', color: '#319795', tags: ['accessible', 'themeable', 'composable'], link: 'https://chakra-ui.com' },
  { id: '5', title: 'Ant Design', category: 'UI Kits', image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=800', description: 'Enterprise-class UI design system for web applications.', color: '#1890ff', tags: ['enterprise', 'complete', 'react'], link: 'https://ant.design' },
  { id: '6', title: 'Headless UI', category: 'UI Kits', image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800', description: 'Completely unstyled, fully accessible UI components for Tailwind CSS.', color: '#06b6d4', tags: ['headless', 'accessible', 'tailwind'], link: 'https://headlessui.com' },
  { id: '7', title: 'DaisyUI', category: 'UI Kits', image: 'https://images.unsplash.com/photo-1618556450991-2f1af64e8191?auto=format&fit=crop&q=80&w=800', description: 'The most popular component library for Tailwind CSS with 50+ components.', color: '#570df8', tags: ['tailwind', 'themes', 'easy'], link: 'https://daisyui.com' },
  { id: '8', title: 'Radix UI', category: 'UI Kits', image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&q=80&w=800', description: 'Unstyled, accessible components for building high-quality design systems.', color: '#8b5cf6', tags: ['primitives', 'accessible', 'unstyled'], link: 'https://radix-ui.com' },
  { id: '9', title: 'Mantine', category: 'UI Kits', image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&q=80&w=800', description: 'React components library with native dark theme support and hooks.', color: '#228be6', tags: ['react', 'dark-mode', 'hooks'], link: 'https://mantine.dev' },
  { id: '10', title: 'NextUI', category: 'UI Kits', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800', description: 'Beautiful, fast and modern React UI library for Next.js applications.', color: '#f31260', tags: ['nextjs', 'fast', 'beautiful'], link: 'https://nextui.org' },

  // === ICONS === (12 items)
  { id: '11', title: 'Lucide Icons', category: 'Icons', image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&q=80&w=800', description: 'Beautiful & consistent icon toolkit made by the community with 1000+ icons.', color: '#f97316', tags: ['open-source', 'consistent', 'svg'], link: 'https://lucide.dev' },
  { id: '12', title: 'Heroicons', category: 'Icons', image: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&q=80&w=800', description: 'Beautiful hand-crafted SVG icons by the makers of Tailwind CSS.', color: '#06b6d4', tags: ['tailwind', 'svg', 'free'], link: 'https://heroicons.com' },
  { id: '13', title: 'Phosphor Icons', category: 'Icons', image: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&q=80&w=800', description: 'Flexible icon family with 6 styles and 7,000+ icons for interfaces.', color: '#a3e635', tags: ['flexible', 'styles', 'large'], link: 'https://phosphoricons.com' },
  { id: '14', title: 'Tabler Icons', category: 'Icons', image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&q=80&w=800', description: 'Over 4,500 pixel-perfect icons for web design with React, Vue, Svelte.', color: '#0054a6', tags: ['pixel-perfect', 'free', 'frameworks'], link: 'https://tabler-icons.io' },
  { id: '15', title: 'Remix Icon', category: 'Icons', image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800', description: 'Open-source neutral-style icon system with 2,800+ icons.', color: '#6366f1', tags: ['neutral', 'open-source', 'system'], link: 'https://remixicon.com' },
  { id: '16', title: 'Feather Icons', category: 'Icons', image: 'https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?auto=format&fit=crop&q=80&w=800', description: 'Simply beautiful open source icons with 24x24 grid.', color: '#ec4899', tags: ['simple', 'clean', 'open-source'], link: 'https://feathericons.com' },
  { id: '17', title: 'Iconoir', category: 'Icons', image: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&q=80&w=800', description: 'Simple yet elegant icon library with 1,500+ SVG icons.', color: '#22c55e', tags: ['elegant', 'svg', 'free'], link: 'https://iconoir.com' },
  { id: '18', title: 'Radix Icons', category: 'Icons', image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&q=80&w=800', description: 'Crisp set of 15×15 icons designed by Modulz for React and Radix UI.', color: '#8b5cf6', tags: ['radix', 'react', 'crisp'], link: 'https://icons.radix-ui.com' },
  { id: '19', title: 'Bootstrap Icons', category: 'Icons', image: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&q=80&w=800', description: 'Free, high quality, open source icon library with 1,800+ icons.', color: '#7952b3', tags: ['bootstrap', 'free', 'quality'], link: 'https://icons.getbootstrap.com' },
  { id: '20', title: 'Simple Icons', category: 'Icons', image: 'https://images.unsplash.com/photo-1618556450991-2f1af64e8191?auto=format&fit=crop&q=80&w=800', description: '2,800+ free SVG icons for popular brands with official colors.', color: '#111111', tags: ['brands', 'official', 'colors'], link: 'https://simpleicons.org' },
  { id: '21', title: 'Boxicons', category: 'Icons', image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&q=80&w=800', description: 'High quality web-friendly icons with 1,600+ icons in regular and solid styles.', color: '#0acf83', tags: ['web-friendly', 'styles', 'quality'], link: 'https://boxicons.com' },
  { id: '22', title: 'Material Symbols', category: 'Icons', image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&q=80&w=800', description: 'Googles latest icon font with 2,500+ symbols in 3 styles.', color: '#4285f4', tags: ['google', 'material', 'variable'], link: 'https://fonts.google.com/icons' },

  // === FONTS === (10 items)
  { id: '23', title: 'Inter', category: 'Fonts', image: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&q=80&w=800', description: 'Designed for computer screens with excellent legibility in small sizes.', color: '#111111', tags: ['ui', 'legible', 'variable'], link: 'https://rsms.me/inter' },
  { id: '24', title: 'Geist Sans', category: 'Fonts', image: 'https://images.unsplash.com/photo-1461958508236-9a742665a0d5?auto=format&fit=crop&q=80&w=800', description: 'Vercels font family designed for clarity and readability.', color: '#000000', tags: ['vercel', 'modern', 'clean'], link: 'https://vercel.com/font' },
  { id: '25', title: 'Satoshi', category: 'Fonts', image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&q=80&w=800', description: 'Geometric sans-serif with 9 weights for modern interfaces.', color: '#8b5cf6', tags: ['geometric', 'weights', 'modern'], link: 'https://www.fontshare.com/fonts/satoshi' },
  { id: '26', title: 'Cal Sans', category: 'Fonts', image: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&q=80&w=800', description: 'Warm and friendly sans-serif by Cal.com for headings.', color: '#292929', tags: ['friendly', 'headings', 'unique'], link: 'https://github.com/calcom/font' },
  { id: '27', title: 'JetBrains Mono', category: 'Fonts', image: 'https://images.unsplash.com/photo-1461958508236-9a742665a0d5?auto=format&fit=crop&q=80&w=800', description: 'Monospace font for developers with increased height and ligatures.', color: '#000000', tags: ['monospace', 'code', 'ligatures'], link: 'https://www.jetbrains.com/lp/mono' },
  { id: '28', title: 'Poppins', category: 'Fonts', image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&q=80&w=800', description: 'Geometric sans-serif with international support and 18 styles.', color: '#ea4c89', tags: ['geometric', 'international', 'popular'], link: 'https://fonts.google.com/specimen/Poppins' },
  { id: '29', title: 'DM Sans', category: 'Fonts', image: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&q=80&w=800', description: 'Low-contrast geometric sans-serif optimized for UI design.', color: '#1a1a1a', tags: ['ui', 'geometric', 'readable'], link: 'https://fonts.google.com/specimen/DM+Sans' },
  { id: '30', title: 'Manrope', category: 'Fonts', image: 'https://images.unsplash.com/photo-1461958508236-9a742665a0d5?auto=format&fit=crop&q=80&w=800', description: 'Modern geometric sans-serif with variable font support.', color: '#000000', tags: ['geometric', 'variable', 'modern'], link: 'https://fonts.google.com/specimen/Manrope' },
  { id: '31', title: 'Work Sans', category: 'Fonts', image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&q=80&w=800', description: 'Sans-serif optimized for screen text with 9 weights.', color: '#4a5568', tags: ['screen', 'weights', 'versatile'], link: 'https://fonts.google.com/specimen/Work+Sans' },
  { id: '32', title: 'Space Grotesk', category: 'Fonts', image: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&q=80&w=800', description: 'Proportional variant of Space Mono with geometric forms.', color: '#6366f1', tags: ['geometric', 'modern', 'display'], link: 'https://fonts.google.com/specimen/Space+Grotesk' },

  // === ILLUSTRATIONS === (8 items)
  { id: '33', title: 'unDraw', category: 'Illustrations', image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=800', description: 'Open-source illustrations for every project with customizable colors.', color: '#6c63ff', tags: ['open-source', 'customizable', 'free'], link: 'https://undraw.co' },
  { id: '34', title: 'Storyset', category: 'Illustrations', image: 'https://images.unsplash.com/photo-1604533038676-e82df491c10d?auto=format&fit=crop&q=80&w=800', description: 'Awesome free customizable illustrations for your next project.', color: '#ff6250', tags: ['animated', 'customizable', 'stories'], link: 'https://storyset.com' },
  { id: '35', title: 'Blush', category: 'Illustrations', image: 'https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?auto=format&fit=crop&q=80&w=800', description: 'Create, mix and customize illustrations made by artists worldwide.', color: '#ff4785', tags: ['mix-match', 'customizable', 'artists'], link: 'https://blush.design' },
  { id: '36', title: 'Humaaans', category: 'Illustrations', image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=800', description: 'Mix-and-match illustrations of people with design library.', color: '#ffd33d', tags: ['people', 'mix-match', 'figma'], link: 'https://humaaans.com' },
  { id: '37', title: 'Open Doodles', category: 'Illustrations', image: 'https://images.unsplash.com/photo-1604533038676-e82df491c10d?auto=format&fit=crop&q=80&w=800', description: 'Free sketchy illustrations for diverse websites and products.', color: '#fd9900', tags: ['sketchy', 'diverse', 'free'], link: 'https://opendoodles.com' },
  { id: '38', title: 'Drawkit', category: 'Illustrations', image: 'https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?auto=format&fit=crop&q=80&w=800', description: 'Hand-drawn vector illustration and icon resources.', color: '#3d5afe', tags: ['hand-drawn', 'vector', 'quality'], link: 'https://drawkit.com' },
  { id: '39', title: 'Absurd Illustrations', category: 'Illustrations', image: 'https://images.unsplash.com/photo-1619762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800', description: 'Surreal illustrations for landing pages and apps.', color: '#1e3a8a', tags: ['surreal', 'unique', 'modern'], link: 'https://absurd.design' },
  { id: '40', title: 'Ouch! by Icons8', category: 'Illustrations', image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&q=80&w=800', description: 'Free vector illustrations to class up your project.', color: '#9333ea', tags: ['vector', 'quality', 'diverse'], link: 'https://icons8.com/illustrations' },

  // === COLORS === (8 items)
  { id: '41', title: 'Coolors', category: 'Colors', image: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&q=80&w=800', description: 'Super fast color palette generator with thousands of combinations.', color: '#0066ff', tags: ['generator', 'palettes', 'fast'], link: 'https://coolors.co' },
  { id: '42', title: 'Color Hunt', category: 'Colors', image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=800', description: 'Curated collection of beautiful color palettes updated daily.', color: '#ea4c89', tags: ['curated', 'daily', 'beautiful'], link: 'https://colorhunt.co' },
  { id: '43', title: 'Tailwind Colors', category: 'Colors', image: 'https://images.unsplash.com/photo-1541411438265-4cb4687110f2?auto=format&fit=crop&q=80&w=800', description: 'Expert-crafted color palette with shades for all Tailwind CSS.', color: '#06b6d4', tags: ['tailwind', 'shades', 'professional'], link: 'https://tailwindcss.com/docs/customizing-colors' },
  { id: '44', title: 'Gradient Hunt', category: 'Colors', image: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&q=80&w=800', description: 'Thousands of trendy hand-made color gradients.', color: '#ff6b6b', tags: ['gradients', 'trendy', 'collection'], link: 'https://gradienthunt.com' },
  { id: '45', title: 'ColorSpace', category: 'Colors', image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=800', description: 'Never waste hours on finding the perfect color palette again.', color: '#8b5cf6', tags: ['generator', 'harmony', 'tools'], link: 'https://mycolor.space' },
  { id: '46', title: 'Adobe Color', category: 'Colors', image: 'https://images.unsplash.com/photo-1541411438265-4cb4687110f2?auto=format&fit=crop&q=80&w=800', description: 'Create color schemes with the color wheel or image, extract themes.', color: '#ff0000', tags: ['adobe', 'professional', 'extraction'], link: 'https://color.adobe.com' },
  { id: '47', title: 'Picular', category: 'Colors', image: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&q=80&w=800', description: 'Google but for colors - search any word to get color results.', color: '#4285f4', tags: ['search', 'unique', 'discovery'], link: 'https://picular.co' },
  { id: '48', title: 'Happy Hues', category: 'Colors', image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=800', description: 'Curated colors in context showing real website examples.', color: '#ffcc00', tags: ['context', 'examples', 'inspiration'], link: 'https://happyhues.co' },

  // === UTILITIES === (6 items)
  { id: '49', title: 'Neumorphism.io', category: 'Utilities', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800', description: 'Generate soft-UI CSS code for neumorphic design elements.', color: '#e0e0e0', tags: ['neumorphism', 'css', 'generator'], link: 'https://neumorphism.io' },
  { id: '50', title: 'Get Waves', category: 'Utilities', image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800', description: 'Generate SVG waves for your next design with customization.', color: '#0099ff', tags: ['svg', 'waves', 'backgrounds'], link: 'https://getwaves.io' },
  { id: '51', title: 'CSS Gradient', category: 'Utilities', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800', description: 'Free CSS gradient generator tool with presets and editor.', color: '#667eea', tags: ['css', 'gradients', 'tool'], link: 'https://cssgradient.io' },
  { id: '52', title: 'Shadow Generator', category: 'Utilities', image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800', description: 'Generate smooth, layered box-shadows with visual editor.', color: '#10b981', tags: ['shadows', 'css', 'visual'], link: 'https://shadows.brumm.af' },
  { id: '53', title: 'Haikei', category: 'Utilities', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800', description: 'Generate unique SVG design assets including backgrounds and patterns.', color: '#ec4899', tags: ['svg', 'backgrounds', 'patterns'], link: 'https://haikei.app' },
  { id: '54', title: 'BGJar', category: 'Utilities', image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800', description: 'Free SVG background generator for websites with 200+ designs.', color: '#f59e0b', tags: ['svg', 'backgrounds', 'free'], link: 'https://bgjar.com' },
];

// --- Components ---

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({ children, className = "", onClick }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (window.innerWidth < 768) return; // Disable on mobile
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((e.clientX - centerX) * 0.5);
    y.set((e.clientY - centerY) * 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0); y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ x: springX, y: springY }}
    >
      {children}
    </motion.button>
  );
};

interface TiltCardProps {
  resource: Resource;
  index: number;
  onClick?: (resource: Resource) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string | number) => void;
}

const TiltCard: React.FC<TiltCardProps> = React.memo(({ resource, index, onClick, isFavorite, onToggleFavorite }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });
  const { setCursor } = useCursor();

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 768) return; // Disable on mobile
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXVal = e.clientX - rect.left;
    const mouseYVal = e.clientY - rect.top;
    x.set(mouseXVal / width - 0.5);
    y.set(mouseYVal / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setCursor('default');
  };

  const handleMouseEnter = () => {
    if (window.innerWidth >= 768) {
        setCursor('text', 'VIEW');
    }
  };

  // Pattern: 3 regular + 1 wide (indexes 3, 7, 11, 15, 19...)
  const isFeatured = (index + 1) % 4 === 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className={`relative group ${isFeatured ? 'md:col-span-2 lg:col-span-3' : 'col-span-1'} h-[340px] perspective-1000`}
      style={{ perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {/* Border Beam Effect Container - Slightly larger than content */}
      <div className="absolute -inset-[1px] rounded-3xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0">
          <div 
             className="absolute inset-[-100%] animate-[spin_4s_linear_infinite]"
             style={{
               background: `conic-gradient(from 90deg at 50% 50%, #0000 0%, ${resource.color} 50%, #0000 100%)`
             }}
          />
      </div>

      <motion.div
        className="w-full h-full relative rounded-3xl bg-[#111111] border border-white/5 overflow-hidden z-10"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-2xl z-0"
          style={{ background: resource.color }}
        />
        
        <div className="w-full h-[65%] overflow-hidden relative z-10">
          <img 
            src={resource.image} 
            alt={resource.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#111111]" />
        </div>

        <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 pointer-events-none">
          <div className="pointer-events-auto transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
             <span style={{ color: resource.color }} className="text-[10px] font-bold uppercase tracking-widest mb-2 block">{resource.category}</span>
             <h3 className="text-white text-xl font-bold leading-tight mb-1">{resource.title}</h3>
             <p className="text-slate-500 text-sm line-clamp-1">{resource.description}</p>
          </div>
        </div>

        {/* Favorite Button - Top Left */}
        <div className="absolute top-4 left-4 z-30">
          <motion.button
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 pointer-events-auto ${
              isFavorite ? 'bg-red-500 text-white' : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(resource.id);
            }}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </motion.button>
        </div>

        {/* View Button - Top Right */}
        <div className="absolute top-4 right-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
           <MagneticButton
             className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:bg-slate-200 transition-colors cursor-pointer"
             onClick={() => onClick?.(resource)}
           >
              <ArrowUpRight className="w-5 h-5" />
           </MagneticButton>
        </div>
      </motion.div>
    </motion.div>
  );
});

const MainContent = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayCount, setDisplayCount] = useState(12); // Start with 12 items
  const [searchQuery, setSearchQuery] = useState(''); // Search state
  const [favorites, setFavorites] = useState<Set<string | number>>(() => {
    // Load favorites from localStorage on mount
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('designhub-favorites');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    }
    return new Set();
  });
  const { scrollY } = useScroll();
  const { setCursor } = useCursor();

  const handleOpenModal = (resource: Resource) => {
    // Convert to modal format
    const modalResource = {
      id: typeof resource.id === 'string' ? parseInt(resource.id) : resource.id,
      title: resource.title,
      description: resource.description,
      category: resource.category,
      thumbnail: resource.thumbnail || resource.image,
      link: resource.link || '#',
      tags: resource.tags || [resource.category.toLowerCase()]
    };
    setSelectedResource(modalResource as any);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedResource(null), 300); // Delay clearing to allow exit animation
  };

  const toggleFavorite = (resourceId: string | number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(resourceId)) {
        newFavorites.delete(resourceId);
      } else {
        newFavorites.add(resourceId);
      }
      // Save to localStorage
      localStorage.setItem('designhub-favorites', JSON.stringify([...newFavorites]));
      return newFavorites;
    });
  };

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 100);
  });

  // Filter by category
  const categoryFiltered =
    activeCategory === 'All' ? RESOURCES :
    activeCategory === 'Favorites' ? RESOURCES.filter(r => favorites.has(r.id)) :
    RESOURCES.filter(r => r.category === activeCategory);

  // Filter by search query
  const filteredResources = searchQuery.trim() === ''
    ? categoryFiltered
    : categoryFiltered.filter(resource => {
        const query = searchQuery.toLowerCase();
        return (
          resource.title.toLowerCase().includes(query) ||
          resource.description.toLowerCase().includes(query) ||
          resource.tags.some(tag => tag.toLowerCase().includes(query))
        );
      });

  // Reset display count when category or search changes
  useEffect(() => {
    setDisplayCount(12);
  }, [activeCategory, searchQuery]);

  // Slice resources for pagination
  const displayedResources = filteredResources.slice(0, displayCount);
  const hasMore = displayCount < filteredResources.length;

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 12);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#060606] text-white selection:bg-yellow-500 selection:text-black pb-0">
       
       {/* Sticky Filter Navigation */}
       <div className={`sticky top-0 z-40 w-full transition-all duration-300 ${isScrolled ? 'bg-[#060606]/80 backdrop-blur-md border-b border-white/5 py-3' : 'bg-transparent py-6'}`}>
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
           {/* Filters */}
           <div className="relative w-full md:w-auto min-w-0">
             {/* Gradient Mask for Scroll Hint (Mobile) */}
             <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#060606] via-[#060606]/80 to-transparent pointer-events-none z-20 md:hidden" />
             
             <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto items-center pr-12 md:pr-0">
               {CATEGORIES.map(cat => (
                 <button 
                   key={cat}
                   onClick={() => setActiveCategory(cat)}
                   className={`relative px-4 py-2 rounded-full text-sm font-bold transition-colors whitespace-nowrap flex-shrink-0 ${activeCategory === cat ? 'text-black' : 'text-slate-400 hover:text-white'}`}
                   onMouseEnter={() => setCursor('default')}
                 >
                   {activeCategory === cat && (
                     <motion.div 
                       layoutId="activeFilter"
                       className="absolute inset-0 bg-white rounded-full"
                       transition={{ type: "spring", stiffness: 300, damping: 30 }}
                     />
                   )}
                   <span className="relative z-10">{cat}</span>
                 </button>
               ))}
             </div>
           </div>
           
           {/* Search */}
           <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-full px-4 py-2 w-full md:w-auto">
              <Search className="w-4 h-4 text-slate-500" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resources..."
                className="bg-transparent border-none outline-none text-sm text-white placeholder-slate-500 w-full md:w-48"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-slate-400 hover:text-white transition-colors"
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
           </div>
         </div>
       </div>

       {/* Gallery Grid */}
       <div className="max-w-7xl mx-auto px-6 mt-8 mb-32">
         {filteredResources.length === 0 ? (
           /* No Results Message */
           <motion.div
             className="text-center py-20"
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
           >
             <div className="text-6xl mb-4">🔍</div>
             <h3 className="text-2xl font-bold text-white mb-2">No results found</h3>
             <p className="text-slate-400 mb-6">
               Try adjusting your search or filters
             </p>
             {searchQuery && (
               <button
                 onClick={() => setSearchQuery('')}
                 className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
               >
                 Clear Search
               </button>
             )}
           </motion.div>
         ) : (
           <>
             <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
               <AnimatePresence mode='popLayout'>
                 {displayedResources.map((resource, i) => (
                   <TiltCard
                     key={resource.id}
                     resource={resource}
                     index={i}
                     onClick={handleOpenModal}
                     isFavorite={favorites.has(resource.id)}
                     onToggleFavorite={toggleFavorite}
                   />
                 ))}
               </AnimatePresence>
             </motion.div>

             {/* Load More Button */}
             {hasMore && (
               <motion.div
                 className="flex justify-center mt-12"
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2 }}
               >
                 <MagneticButton onClick={handleLoadMore}>
                   <span className="relative z-10 text-lg font-semibold">
                     Load More ({filteredResources.length - displayCount} remaining)
                   </span>
                 </MagneticButton>
               </motion.div>
             )}
           </>
         )}
       </div>
       
       {/* Smart Video Showcase */}
       <SmartVideoGallery />

       {/* Big Urban Footer */}
       <BigFooter />

       {/* Resource Modal */}
       <ResourceModal
         resource={selectedResource}
         isOpen={isModalOpen}
         onClose={handleCloseModal}
       />
    </div>
  );
};

export default MainContent;