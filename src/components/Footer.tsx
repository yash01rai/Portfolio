import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { HlsVideo } from './ui/HlsVideo';
import { ArrowUpRight } from 'lucide-react';

const HLS_URL = "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8";

export default function Footer() {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Marquee animation
      gsap.to(".marquee-inner", {
        xPercent: -50,
        duration: 20,
        ease: "none",
        repeat: -1,
      });
    }, marqueeRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer id="resume" className="relative bg-bg pt-16 md:pt-20 pb-8 md:pb-12 overflow-hidden border-t border-white/5 mt-24">
      
      {/* Background Video (Flipped Vertically) */}
      <div className="absolute inset-0 z-0 scale-y-[-1]">
        <HlsVideo 
          src={HLS_URL}
          className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 opacity-50"
        />
        <div className="absolute inset-0 bg-black/60" />
        {/* Fade to bg color at top (which is visually bottom due to flip) */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-bg to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[50vh]">
        
        <div className="text-center mb-16">
          <p className="text-xs text-muted uppercase tracking-[0.3em] mb-8">
            Got an idea?
          </p>
          <a href="mailto:yashhr01@gmail.com" className="group relative inline-block">
             <div className="absolute inset-[-4px] rounded-full accent-gradient opacity-0 transition-opacity duration-300 group-hover:opacity-100 animate-gradient-shift -z-10 blur-[2px]"></div>
             <h2 className="text-5xl md:text-7xl lg:text-9xl font-display italic text-text-primary tracking-tight transition-transform duration-300 group-hover:scale-[1.02]">
               Let's talk
             </h2>
          </a>
        </div>

      </div>

      {/* GSAP Marquee */}
      <div ref={marqueeRef} className="relative z-10 w-full overflow-hidden py-10 flex items-center border-y border-white/5 bg-bg/50 backdrop-blur-md">
        <div className="marquee-inner flex whitespace-nowrap will-change-transform">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="text-4xl md:text-6xl font-display text-text-primary/80 uppercase px-8">
              BUILDING THE FUTURE •
            </span>
          ))}
        </div>
      </div>

      {/* Footer Bar */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 mt-12 flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted">
          {[
            { name: 'LinkedIn', url: 'https://www.linkedin.com/in/paintedincodebyyashrai/' },
            { name: 'GitHub', url: 'https://github.com/yash01rai' },
            { name: 'Twitter', url: 'https://x.com/herecomeyashrai' }
          ].map(link => (
             <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-text-primary transition-colors flex items-center gap-1 group">
               {link.name}
               <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
             </a>
          ))}
        </div>

        <div className="flex items-center gap-3 bg-surface/50 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </div>
          <span className="text-sm text-text-primary">Available for projects</span>
        </div>

        <div className="text-sm text-muted">
          © {new Date().getFullYear()} Yash Rai
        </div>
        
      </div>
    </footer>
  );
}
