import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HlsVideo } from './ui/HlsVideo';
import { ArrowUpRight, ArrowUp } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const HLS_URL = "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8";

export default function Footer() {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const scrollBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".marquee-inner", {
        xPercent: -50,
        duration: 20,
        ease: "none",
        repeat: -1,
      });
    }, marqueeRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const btn = scrollBtnRef.current;
    const footer = footerRef.current;
    if (!btn || !footer) return;

    gsap.set(btn, { opacity: 0, y: 24, pointerEvents: 'none' });

    const trigger = ScrollTrigger.create({
      trigger: footer,
      start: 'top 80%',
      onEnter: () => {
        gsap.to(btn, { opacity: 1, y: 0, pointerEvents: 'auto', duration: 0.5, ease: 'power3.out' });
      },
      onLeaveBack: () => {
        gsap.to(btn, { opacity: 0, y: 24, pointerEvents: 'none', duration: 0.35, ease: 'power2.in' });
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <footer ref={footerRef} id="resume" className="relative bg-bg pt-16 md:pt-20 pb-8 md:pb-12 overflow-hidden border-t border-white/5 mt-24">

      {/* Background Video (Flipped Vertically) */}
      <div className="absolute inset-0 z-0 scale-y-[-1]">
        <HlsVideo
          src={HLS_URL}
          className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 opacity-50"
        />
        <div className="absolute inset-0 bg-black/60" />
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

      {/* Floating Scroll-to-Top Button */}
      <button
        ref={scrollBtnRef}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
        className="group fixed bottom-30 right-8 z-50 flex items-center gap-2.5 bg-surface/70 backdrop-blur-md border border-white/10 rounded-full px-5 py-3.5 text-sm text-muted hover:text-text-primary transition-colors duration-300 overflow-hidden"
      >
        <span className="absolute inset-0 rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient-shift -z-10" />
        <ArrowUp className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:-translate-y-0.5" />
        <span className="relative z-10 font-medium tracking-wide">Back to top</span>
      </button>

    </footer>
  );
}
