import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { PROJECTS, type Project } from '../data/projects';

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
              A selection of scalable frontend platforms, high-performance applications and interactive 3D experiences I've engineered.
            </p>
          </div>

          <a
            href="https://github.com/yash01rai"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex group relative items-center justify-center text-sm"
          >
            <span className="absolute inset-[-2px] rounded-full accent-gradient opacity-0 transition-opacity duration-300 group-hover:opacity-100 animate-gradient-shift -z-10"></span>
            <div className="relative flex items-center gap-2 bg-surface border border-stroke rounded-full px-6 py-3 text-text-primary transition-colors group-hover:bg-bg group-hover:border-transparent">
              View all work
              <ArrowRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
          </a>
        </motion.div>

        {/* Bento Grid */}
        <ul className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6" aria-label="Featured projects">
          {PROJECTS.map((project) => (
            <li key={project.title} className={project.spanClass}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>

      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const content = (
    <>
      <div className={`relative w-full overflow-hidden rounded-3xl border border-stroke bg-surface ${project.imageClass}`}>
        <img
          src={project.image}
          alt={project.imageAlt}
          width={project.width}
          height={project.height}
          loading="lazy"
          decoding="async"
          style={project.objectPosition ? { objectPosition: project.objectPosition } : undefined}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Halftone Overlay (pure-black dots, so normal blending looks the same as multiply and is cheaper) */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
            backgroundSize: "4px 4px"
          }}
        />

        {project.badge && (
          <span className="absolute top-4 left-4 rounded-full bg-bg/70 backdrop-blur-md border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-text-primary">
            {project.badge}
          </span>
        )}

        {project.link && (
          <>
            {/* Hover Dark Overlay */}
            <div className="absolute inset-0 bg-bg/70 opacity-0 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:backdrop-blur-lg" />

            {/* Hover Label */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 scale-95 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-100">
              <div className="relative p-[1.5px] rounded-full accent-gradient animate-gradient-shift shadow-xl">
                <div className="bg-white text-bg px-6 py-2.5 rounded-full flex items-center gap-2">
                  <span className="text-sm font-medium">View —</span>
                  <span className="font-display italic text-lg">{project.title}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="pt-5 px-1">
        <h3 className="flex items-center gap-2 text-xl md:text-2xl text-text-primary tracking-tight mb-2">
          {project.title}
          {project.link && (
            <ArrowUpRight className="w-4 h-4 opacity-50 transition-all group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          )}
        </h3>
        <p className="text-muted text-sm leading-relaxed mb-4 max-w-2xl">{project.description}</p>
        <ul className="flex flex-wrap gap-2" aria-label={`${project.title} tech stack`}>
          {project.tech.map((t) => (
            <li key={t} className="text-[11px] text-muted border border-stroke rounded-full px-3 py-1">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </>
  );

  const cardClass = "group flex flex-col h-full";

  return project.link ? (
    <a href={project.link} target="_blank" rel="noopener" className={cardClass}>
      {content}
    </a>
  ) : (
    <article className={cardClass}>{content}</article>
  );
}
