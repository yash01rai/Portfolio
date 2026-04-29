import { useLayoutEffect, useRef, type ComponentType } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';

import ParticleConstellation from './experiments/ParticleConstellation';
import FluidGradient from './experiments/FluidGradient';
import MatrixRain from './experiments/MatrixRain';
import WaveInterference from './experiments/WaveInterference';
import GeometricTessellation from './experiments/GeometricTessellation';
import GravityDots from './experiments/GravityDots';

gsap.registerPlugin(ScrollTrigger);

interface ExperimentItem {
  component: ComponentType;
  label: string;
  rotation: number;
}

const ITEMS: ExperimentItem[] = [
  { component: ParticleConstellation, label: 'Particle Constellation', rotation: -2 },
  { component: FluidGradient, label: 'Fluid Gradient', rotation: 3 },
  { component: MatrixRain, label: 'Matrix Rain', rotation: 1 },
  { component: WaveInterference, label: 'Wave Interference', rotation: -4 },
  { component: GeometricTessellation, label: 'Geometric Tessellation', rotation: 2 },
  { component: GravityDots, label: 'Gravity Dots', rotation: -1 },
];

export default function Explorations() {
  const containerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Pin the card for the full section scroll (start: top top → end: bottom top = 280vh)
      ScrollTrigger.create({
        trigger: containerRef.current,
        pin: contentRef.current,
        start: "top top",
        end: "bottom bottom",
        pinSpacing: false,
        invalidateOnRefresh: true,
      });

      const opacitySetter = gsap.quickSetter(contentRef.current, "autoAlpha");
      opacitySetter(0);

      const setCardVisibility = (opacity: number) => opacitySetter(Math.max(0, Math.min(1, opacity)));

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        invalidateOnRefresh: true,
        onLeave: () => setCardVisibility(0),
        onLeaveBack: () => setCardVisibility(0),
        onUpdate: (self) => {
          const p = self.progress;
          // invisible 0→0.15, fade-in 0.15→0.22, hold 0.22→0.88, fade-out 0.88→0.94, invisible 0.94→1
          let opacity: number;
          if (p <= 0.15) opacity = 0;
          else if (p < 0.22) opacity = (p - 0.15) / 0.07;
          else if (p < 0.88) opacity = 1;
          else if (p < 0.94) opacity = 1 - (p - 0.88) / 0.06;
          else opacity = 0;
          setCardVisibility(opacity);
        },
      });

      // Parallax for Column 1 (moves faster upwards)
      gsap.to(col1Ref.current, {
        yPercent: -25,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      });

      // Parallax for Column 2 (moves slower upwards)
      gsap.to(col2Ref.current, {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      });

    }, containerRef);

    // Refresh after Notion/image hydration so parallax/fade thresholds use final layout.
    const refresh = () => ScrollTrigger.refresh();
    const t1 = setTimeout(refresh, 500);
    const t2 = setTimeout(refresh, 2000);
    window.addEventListener("load", refresh);

    return () => {
      ctx.revert();
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("load", refresh);
    };
  }, []);

  return (
    <section ref={containerRef} className="relative isolate min-h-[280vh] bg-bg overflow-x-clip">
      
      {/* Section-bounded sticky center content */}
      <div
        ref={contentRef}
        className="h-screen w-full flex flex-col items-center justify-center pointer-events-none z-30"
      >
        <div className="text-center px-4 max-w-2xl mx-auto backdrop-blur-md bg-bg/60 p-8 rounded-3xl border border-white/5 pointer-events-auto">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-8 h-px bg-stroke" />
            <span className="text-xs text-muted uppercase tracking-[0.3em]">Explorations</span>
            <div className="w-8 h-px bg-stroke" />
          </div>
          
          <h2 className="text-5xl md:text-7xl lg:text-8xl text-text-primary tracking-tight mb-6">
            Visual <span className="font-display italic">playground</span>
          </h2>
          
          <p className="text-muted text-sm md:text-base mb-8 max-w-md mx-auto">
            Interactive code experiments — canvas animations, physics simulations, and generative art, all built from scratch.
          </p>

          <a
            href="https://github.com/yash01rai"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center text-sm shrink-0 mx-auto"
          >
            <span className="absolute inset-[-2px] rounded-full accent-gradient opacity-0 transition-opacity duration-300 group-hover:opacity-100 animate-gradient-shift -z-10"></span>
            <div className="relative flex items-center gap-2 bg-surface border border-stroke rounded-full px-6 py-3 backdrop-blur-md text-text-primary transition-colors group-hover:bg-bg group-hover:border-transparent">
              View source on GitHub
              <ArrowUpRight className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
            </div>
          </a>
        </div>
      </div>

      {/* Parallax Columns */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 overflow-hidden">
        <div className="max-w-[1400px] mx-auto h-full grid grid-cols-2 gap-12 md:gap-40 px-4 sm:px-10">
          
          {/* Column 1 */}
          <div ref={col1Ref} className="flex flex-col gap-32 md:gap-64 pt-[50vh] pb-[40vh] pointer-events-auto">
            {ITEMS.slice(0, 3).map((item, idx) => (
              <div 
                key={idx} 
                className="group relative aspect-square w-full max-w-[320px] mx-auto rounded-3xl overflow-hidden border border-stroke/50 cursor-pointer transition-transform duration-500 hover:z-50 hover:scale-105"
                style={{ transform: `rotate(${item.rotation}deg)` }}
              >
                <item.component />
                {/* Hover label overlay */}
                <div className="absolute inset-0 bg-bg/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center backdrop-blur-[2px] pointer-events-none">
                  <div className="mb-6 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                    <span className="text-xs text-text-primary tracking-wide font-medium">{item.label}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Column 2 */}
          <div ref={col2Ref} className="flex flex-col gap-32 md:gap-64 pt-[110vh] pb-[40vh] pointer-events-auto">
            {ITEMS.slice(3, 6).map((item, idx) => (
              <div 
                key={idx + 3} 
                className="group relative aspect-square w-full max-w-[320px] mx-auto rounded-3xl overflow-hidden border border-stroke/50 cursor-pointer transition-transform duration-500 hover:z-50 hover:scale-105"
                style={{ transform: `rotate(${item.rotation}deg)` }}
              >
                <item.component />
                {/* Hover label overlay */}
                <div className="absolute inset-0 bg-bg/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center backdrop-blur-[2px] pointer-events-none">
                  <div className="mb-6 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                    <span className="text-xs text-text-primary tracking-wide font-medium">{item.label}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

    </section>
  );
}
