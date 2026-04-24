import { useEffect, useRef, type ComponentType } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Opacity driven directly from scroll progress via onUpdate.
      // No scrub lag, no competing tweens, no y-transform conflict with pin.
      // Reversible cleanly in both scroll directions.
      gsap.set(contentRef.current, { opacity: 0 });
      const setOpacity = gsap.quickSetter(contentRef.current, "opacity");

      // Scroll range: "top center" → "bottom top" = 50vh entry + 280vh (full section) = 330vh
      // Pin fires at scrollY = sectionTop → progress = 50/330 ≈ 0.15
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top center",
        end: "bottom top",     // track until section has fully scrolled past (Stats takes over)
        onUpdate: (self) => {
          const p = self.progress;
          // p<0.15: invisible while section enters (~50vh, before pin fires)
          // p=0.15–0.22: fade in (~23vh, right as pin fires)
          // p=0.22–0.96: hold visible (~244vh of the 280vh pin = 87% of pin)
          // p=0.96–1.00: fade out as section exits top of viewport (~13vh)
          let opacity: number;
          if (p < 0.15)       opacity = 0;
          else if (p < 0.22)  opacity = (p - 0.15) / 0.07;
          else if (p < 0.88)  opacity = 1;
          else if (p < 0.94)  opacity = 1 - (p - 0.88) / 0.06;
          else                opacity = 0;
          setOpacity(opacity);
        },
      });

      // Pin extends for the ENTIRE section — card stays centered until Stats appears
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",    // release only when section has fully scrolled past
        pin: contentRef.current,
        pinSpacing: false,
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

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-[280vh] bg-bg overflow-hidden">
      
      {/* Pinned Center Content (z-10) */}
      <div 
        ref={contentRef} 
        className="h-screen w-full flex flex-col items-center justify-center pointer-events-none z-30"
      >
        <div className="text-center px-4 max-w-2xl mx-auto backdrop-blur-md bg-bg/30 p-8 rounded-3xl border border-white/5 pointer-events-auto">
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
