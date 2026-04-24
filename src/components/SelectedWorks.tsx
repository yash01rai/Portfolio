import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const PROJECTS = [
  {
    title: "Promptu",
    image: "/promptu.png",
    link: "https://chromewebstore.google.com/detail/promptu/gaafidhicjnpkdpcacfgehiafmliajah",
    spanClass: "md:col-span-7 aspect-[4/3] md:aspect-[16/9]",
  },
  {
    title: "Tour With Yash",
    image: "/tourwithyash.png",
    link: "https://tourwithyash.onrender.com/",
    spanClass: "md:col-span-5 aspect-[4/3] md:aspect-[4/5]",
  },
  {
    title: "Skillgigs Marketplace",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
    spanClass: "md:col-span-5 aspect-[4/3] md:aspect-[4/5]",
  },
  {
    title: "Platform Integration",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
    spanClass: "md:col-span-7 aspect-[4/3] md:aspect-[16/9]",
  }
];

export default function SelectedWorks() {
  return (
    <section id="work" className="bg-bg py-12 md:py-16">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 md:mb-16"
        >
          <div className="max-w-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-px bg-stroke" />
              <span className="text-xs text-muted uppercase tracking-[0.3em]">Selected Work</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-text-primary tracking-tight mb-4">
              Featured <span className="font-display italic">projects</span>
            </h2>
            
            <p className="text-muted text-sm md:text-base">
              A selection of scalable frontend platforms and high-performance applications I've engineered.
            </p>
          </div>

          <button className="hidden md:inline-flex group relative items-center justify-center text-sm">
            <span className="absolute inset-[-2px] rounded-full accent-gradient opacity-0 transition-opacity duration-300 group-hover:opacity-100 animate-gradient-shift -z-10"></span>
            <div className="relative flex items-center gap-2 bg-surface border border-stroke rounded-full px-6 py-3 backdrop-blur-md text-text-primary transition-colors group-hover:bg-bg group-hover:border-transparent">
              View all work
              <ArrowRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
          </button>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
          {PROJECTS.map((project, idx) => (
            <div 
              key={idx}
              onClick={() => project.link && window.open(project.link, '_blank')}
              className={`group relative bg-surface border border-stroke rounded-3xl overflow-hidden cursor-pointer ${project.spanClass}`}
            >
              {/* Background Image */}
              <div className="absolute inset-0 w-full h-full">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>

              {/* Halftone Overlay */}
              <div 
                className="absolute inset-0 opacity-20 mix-blend-multiply pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
                  backgroundSize: "4px 4px"
                }}
              />

              {/* Hover Dark Overlay */}
              <div className="absolute inset-0 bg-bg/70 opacity-0 backdrop-blur-sm transition-all duration-500 ease-out group-hover:opacity-100 group-hover:backdrop-blur-lg" />

              {/* Hover Label */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 scale-95 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-100">
                <div className="relative p-[1.5px] rounded-full accent-gradient animate-gradient-shift shadow-xl">
                  <div className="bg-white text-bg px-6 py-2.5 rounded-full flex items-center gap-2">
                    <span className="text-sm font-medium">View —</span>
                    <span className="font-display italic text-lg">{project.title}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
