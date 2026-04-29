import { useEffect, useState } from 'react';

import { ArrowUpRight } from 'lucide-react';
import { cn } from '../lib/utils';

const NAV_LINKS = ["Home", "Experience", "Work", "Resume"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("Home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4 pointer-events-none">
      <div
        className={cn(
          "pointer-events-auto inline-flex items-center rounded-full backdrop-blur-md border border-white/10 bg-surface/80 px-1.5 py-1.5 sm:px-2 sm:py-2 transition-shadow duration-300",
          scrolled ? "shadow-md shadow-black/20" : "shadow-none"
        )}
      >
        {/* Logo */}
        <a
          href="#"
          className="group relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-transform duration-300 hover:scale-110 ml-0.5 sm:ml-1"
        >
          {/* Accent Gradient Border */}
          <div className="absolute inset-0 rounded-full accent-gradient animate-gradient-shift [animation-direction:normal] group-hover:[animation-direction:reverse] p-[1.5px]">
            <div className="w-full h-full bg-bg rounded-full flex items-center justify-center">
              <span className="font-display italic text-[13px] text-text-primary mt-0.5">YR</span>
            </div>
          </div>
        </a>

        {/* Divider */}
        <div className="hidden sm:block w-px h-5 bg-stroke mx-3" />

        {/* Links */}
        <div className="flex items-center gap-0.5 sm:gap-2 ml-1 sm:ml-0">
          {NAV_LINKS.map((link) => (
            <button
              key={link}
              onClick={() => {
                setActive(link);
                const element = document.getElementById(link.toLowerCase());
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={cn(
                "text-[11px] sm:text-sm rounded-full px-2 sm:px-4 py-1 sm:py-2 transition-colors duration-200",
                active === link
                  ? "text-text-primary bg-stroke/50"
                  : "text-muted hover:text-text-primary hover:bg-stroke/50"
              )}
            >
              {link}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-5 bg-stroke mx-3" />

        {/* Say Hi Button */}
        <a
          href="mailto:yashhr01@gmail.com"
          className="group relative inline-flex items-center justify-center text-xs sm:text-sm text-text-primary mr-0.5 sm:mr-1 ml-1 sm:ml-0"
        >
          <span className="absolute inset-[-2px] rounded-full accent-gradient opacity-0 transition-opacity duration-300 group-hover:opacity-100 animate-gradient-shift"></span>
          <div className="relative flex items-center gap-1 sm:gap-1.5 bg-surface rounded-full px-2 sm:px-4 py-1 sm:py-2 backdrop-blur-md">
            <span className="hidden sm:inline">Say hi</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
          </div>
        </a>
      </div>
    </nav>
  );
}
