import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const ENTRIES = [
  {
    title: "Scaling Micro Frontends with Module Federation",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=200&auto=format&fit=crop",
    readTime: "5 min read",
    date: "Oct 12, 2025"
  },
  {
    title: "Leveraging Agentic AI for Developer Velocity",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=200&auto=format&fit=crop",
    readTime: "8 min read",
    date: "Sep 28, 2025"
  },
  {
    title: "Advanced React Performance Optimization Patterns",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=200&auto=format&fit=crop",
    readTime: "6 min read",
    date: "Aug 15, 2025"
  },
  {
    title: "Building Type-Safe UI Component Libraries",
    image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?q=80&w=200&auto=format&fit=crop",
    readTime: "4 min read",
    date: "Jul 02, 2025"
  }
];

export default function Journal() {
  return (
    <section className="bg-bg py-16 md:py-24">
      <div className="max-w-[1000px] mx-auto px-6 md:px-10">
        
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
              <span className="text-xs text-muted uppercase tracking-[0.3em]">Journal</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-text-primary tracking-tight mb-4">
              Recent <span className="font-display italic">thoughts</span>
            </h2>
            
            <p className="text-muted text-sm md:text-base">
              Writings on frontend architecture, performance optimization, and engineering leadership.
            </p>
          </div>

          <button className="hidden md:inline-flex group relative items-center justify-center text-sm shrink-0">
            <span className="absolute inset-[-2px] rounded-full accent-gradient opacity-0 transition-opacity duration-300 group-hover:opacity-100 animate-gradient-shift -z-10"></span>
            <div className="relative flex items-center gap-2 bg-surface border border-stroke rounded-full px-6 py-3 backdrop-blur-md text-text-primary transition-colors group-hover:bg-bg group-hover:border-transparent">
              View all articles
              <ArrowRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
          </button>
        </motion.div>

        {/* Entries List */}
        <div className="flex flex-col gap-4">
          {ENTRIES.map((entry, idx) => (
            <motion.a
              href="#"
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 rounded-[32px] sm:rounded-full bg-surface/30 hover:bg-surface border border-stroke transition-colors duration-300"
            >
              <div className="w-full sm:w-24 h-48 sm:h-24 shrink-0 rounded-[24px] sm:rounded-full overflow-hidden">
                <img 
                  src={entry.image} 
                  alt={entry.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              
              <div className="flex-1 px-2 sm:px-0">
                <h3 className="text-lg md:text-xl text-text-primary mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#89AACC] group-hover:to-[#4E85BF] transition-all">
                  {entry.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-muted">
                  <span>{entry.date}</span>
                  <span className="w-1 h-1 rounded-full bg-stroke" />
                  <span>{entry.readTime}</span>
                </div>
              </div>

              <div className="hidden sm:flex w-12 h-12 shrink-0 rounded-full border border-stroke items-center justify-center mr-2 transition-colors group-hover:bg-text-primary group-hover:border-transparent">
                <ArrowRight className="w-5 h-5 text-text-primary group-hover:text-bg -rotate-45 group-hover:rotate-0 transition-all duration-300" />
              </div>
            </motion.a>
          ))}
        </div>

      </div>
    </section>
  );
}
