import React from 'react';
import { Twitter, Instagram, Dribbble, ArrowRight } from 'lucide-react';
import { useCursor } from './CursorContext';

interface FooterLinkProps {
  href: string;
}

const FooterLink: React.FC<React.PropsWithChildren<FooterLinkProps>> = ({ href, children }) => {
  const { setCursor } = useCursor();
  return (
    <a 
        href={href} 
        className="block text-slate-400 hover:text-white transition-colors duration-300 text-sm w-fit"
        onMouseEnter={() => setCursor('text', 'VISIT')}
        onMouseLeave={() => setCursor('default')}
    >
        {children}
    </a>
  );
};

const BigFooter = () => {
    const { setCursor } = useCursor();

  return (
    <footer className="relative bg-[#060606] pt-20 md:pt-32 pb-0 overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 pb-32 md:pb-48">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-12 text-center md:text-left">
          
          {/* Brand/Newsletter Column - Centered on mobile */}
          <div className="md:col-span-5 space-y-6 md:space-y-8 flex flex-col items-center md:items-start">
             <div>
                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">DesignHub Labs.</h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                    Join 40,000+ designers getting the future of UI delivered to their inbox. No spam, just raw assets.
                </p>
             </div>
             
             <form className="flex flex-col sm:flex-row gap-2 w-full max-w-md" onSubmit={(e) => e.preventDefault()}>
                <input 
                    type="email" 
                    placeholder="ENTER EMAIL"
                    className="flex-1 bg-white/5 border border-white/10 rounded-none px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-yellow-500 transition-colors w-full"
                />
                <button 
                    type="submit"
                    className="bg-yellow-500 text-black px-6 py-3 font-bold text-sm hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                    onMouseEnter={() => setCursor('text', 'JOIN')}
                    onMouseLeave={() => setCursor('default')}
                >
                    JOIN THE LAB <ArrowRight className="w-4 h-4" />
                </button>
             </form>
          </div>

          {/* Spacer - Hidden on mobile */}
          <div className="hidden md:block md:col-span-1" />

          {/* Links Columns - Stacked on mobile */}
          <div className="md:col-span-2 space-y-6 flex flex-col items-center md:items-start">
             <h4 className="text-white font-bold tracking-widest text-xs uppercase opacity-50">Sitemap</h4>
             <div className="space-y-3 flex flex-col items-center md:items-start">
                <FooterLink href="#">Home</FooterLink>
                <FooterLink href="#">Resources</FooterLink>
                <FooterLink href="#">About</FooterLink>
                <FooterLink href="#">License</FooterLink>
             </div>
          </div>

          <div className="md:col-span-2 space-y-6 flex flex-col items-center md:items-start">
             <h4 className="text-white font-bold tracking-widest text-xs uppercase opacity-50">Categories</h4>
             <div className="space-y-3 flex flex-col items-center md:items-start">
                <FooterLink href="#">UI Kits</FooterLink>
                <FooterLink href="#">Icons</FooterLink>
                <FooterLink href="#">3D Models</FooterLink>
                <FooterLink href="#">Motion</FooterLink>
             </div>
          </div>

          <div className="md:col-span-2 space-y-6 flex flex-col items-center md:items-start">
             <h4 className="text-white font-bold tracking-widest text-xs uppercase opacity-50">Social</h4>
             <div className="flex gap-4">
                <a href="#" className="text-slate-400 hover:text-white transition-colors" onMouseEnter={() => setCursor('text', 'TW')} onMouseLeave={() => setCursor('default')}>
                    <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors" onMouseEnter={() => setCursor('text', 'IG')} onMouseLeave={() => setCursor('default')}>
                    <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors" onMouseEnter={() => setCursor('text', 'DR')} onMouseLeave={() => setCursor('default')}>
                    <Dribbble className="w-5 h-5" />
                </a>
             </div>
          </div>
        </div>
      </div>

      {/* Scrolling Massive Text */}
      <div className="absolute bottom-12 left-0 w-full overflow-hidden leading-none select-none pointer-events-none z-0">
          <div className="flex animate-marquee whitespace-nowrap">
            <h1
              className="text-[16vw] md:text-[12vw] font-black text-white/[0.03] inline-block"
              style={{
                  fontFamily: '"Bricolage Grotesque", sans-serif'
              }}
            >
              DISCOVER • CREATE • INSPIRE •&nbsp;
            </h1>
            <h1
              className="text-[16vw] md:text-[12vw] font-black text-white/[0.03] inline-block"
              style={{
                  fontFamily: '"Bricolage Grotesque", sans-serif'
              }}
            >
              DISCOVER • CREATE • INSPIRE •&nbsp;
            </h1>
          </div>
      </div>
      
      {/* Copyright */}
      <div className="relative z-10 py-8 text-center bg-[#060606]/50 backdrop-blur-sm">
         <p className="text-slate-600 text-xs">© 2026 DesignHub. Built for the community.</p>
      </div>
    </footer>
  );
};

export default BigFooter;