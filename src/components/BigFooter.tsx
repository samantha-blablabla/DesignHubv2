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
    <footer className="relative bg-[#060606] pt-20 pb-0 overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 relative z-10 pb-40">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand/Newsletter Column */}
          <div className="md:col-span-5 space-y-8">
             <div>
                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">DesignHub Labs.</h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                    Join 40,000+ designers getting the future of UI delivered to their inbox. No spam, just raw assets.
                </p>
             </div>

             <form className="flex gap-2 max-w-md" onSubmit={(e) => e.preventDefault()}>
                <input
                    type="email"
                    placeholder="ENTER EMAIL"
                    className="flex-1 bg-white/5 border border-white/10 rounded-none px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-yellow-500 transition-colors"
                />
                <button
                    type="submit"
                    className="bg-yellow-500 text-black px-6 py-3 font-bold text-sm hover:bg-yellow-400 transition-colors flex items-center gap-2"
                    onMouseEnter={() => setCursor('text', 'JOIN')}
                    onMouseLeave={() => setCursor('default')}
                >
                    JOIN THE LAB <ArrowRight className="w-4 h-4" />
                </button>
             </form>
          </div>

          {/* Spacer */}
          <div className="hidden md:block md:col-span-1" />

          {/* Links Columns */}
          <div className="md:col-span-2 space-y-6">
             <h4 className="text-white font-bold tracking-widest text-xs uppercase opacity-50">Sitemap</h4>
             <div className="space-y-3">
                <FooterLink href="#">Home</FooterLink>
                <FooterLink href="#">Resources</FooterLink>
                <FooterLink href="#">About</FooterLink>
                <FooterLink href="#">License</FooterLink>
             </div>
          </div>

          <div className="md:col-span-2 space-y-6">
             <h4 className="text-white font-bold tracking-widest text-xs uppercase opacity-50">Categories</h4>
             <div className="space-y-3">
                <FooterLink href="#">UI Kits</FooterLink>
                <FooterLink href="#">Icons</FooterLink>
                <FooterLink href="#">3D Models</FooterLink>
                <FooterLink href="#">Motion</FooterLink>
             </div>
          </div>

          <div className="md:col-span-2 space-y-6">
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

      {/* Massive Text */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none select-none pointer-events-none z-0 opacity-10">
          <h1
            className="text-[15.5vw] font-black text-transparent w-full text-center whitespace-nowrap translate-y-[10%]"
            style={{
                WebkitTextStroke: '1px rgba(255,255,255,0.2)',
                fontFamily: '"Bricolage Grotesque", sans-serif'
            }}
          >
            DESIGNHUB
          </h1>
      </div>

      {/* Copyright */}
      <div className="relative z-10 border-t border-white/5 py-6 text-center bg-[#060606]/50 backdrop-blur-sm">
         <p className="text-slate-600 text-xs">© 2026 DesignHub. Built for the community.</p>
      </div>
    </footer>
  );
};

export default BigFooter;
