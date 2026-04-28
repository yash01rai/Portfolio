import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { HlsVideo } from './ui/HlsVideo';
import { Button } from './ui/Button';

const ROLES = ["Frontend Engineer", "UI Architect", "React Developer", "Innovator"];
const HLS_URL = "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8";

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        ".name-reveal",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, delay: 0.1 }
      );

      tl.fromTo(
        ".blur-in",
        { opacity: 0, filter: "blur(10px)", y: 20 },
        { opacity: 1, filter: "blur(0px)", y: 0, duration: 1, stagger: 0.1 },
        "-=0.8" // Overlap with the previous animation
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="home" ref={containerRef} className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <HlsVideo 
          src={HLS_URL}
          className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 opacity-70"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-bg to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 mt-20 md:mt-0">
        <p className="blur-in text-xs text-muted uppercase tracking-[0.3em] mb-6 md:mb-8">
          COLLECTION '26
        </p>
        
        <h1 className="name-reveal text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-display italic leading-[0.9] tracking-tight text-text-primary mb-6">
          Yash Rai
        </h1>
        
        <div className="blur-in text-lg md:text-2xl text-text-primary mb-6 flex flex-wrap justify-center items-center gap-1.5 md:gap-2">
          <span>A</span>
          <span 
            key={roleIndex} 
            className="font-display italic text-text-primary animate-role-fade-in inline-block"
          >
            {ROLES[roleIndex]}
          </span>
          <span>lives in Bengaluru.</span>
        </div>

        <p className="blur-in text-sm md:text-base text-muted max-w-md mb-10 md:mb-12">
          Designing seamless digital interactions by focusing on the unique nuances which bring systems to life.
        </p>

        <div className="blur-in flex flex-col sm:flex-row items-center gap-4">
          <Button variant="solid" onClick={() => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })}>See Works</Button>
          <Button variant="outline" onClick={() => window.location.href = 'mailto:yashhr01@gmail.com'}>Reach out...</Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10">
        <span className="text-[10px] sm:text-xs text-muted uppercase tracking-[0.2em]">Scroll</span>
        <div className="w-px h-10 bg-stroke relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-text-primary animate-scroll-down" />
        </div>
      </div>
    </section>
  );
}
