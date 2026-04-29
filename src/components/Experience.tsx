import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeader } from './ui/SectionHeader';

const EXPERIENCE = [
  {
    role: "Software Development Engineer 2",
    company: "Livspace",
    period: "Jan 2025 – Present",
    location: "Bengaluru",
    current: true,
    color: "#4E85BF",
    logo: "L",
    tagline: "Interior design & home renovation platform",
    highlights: ["~82% production regression reduction", "₹11.6 Cr business value unlocked", "+70% feature delivery velocity"],
    skills: ["React", "Module Federation", "MFEs", "LLMs", "TypeScript"],
    bullets: [
      "Re-architected core UI modules across shared frontend platform",
      "Built end-to-end Request–Response workflow eliminating manual dependencies",
      "Worked with nested Micro Frontends via Webpack Module Federation",
      "Leveraged AI-assisted scaffolding (Claude, Copilot) to accelerate delivery"
    ]
  },
  {
    role: "Software Engineer",
    company: "Aionos (Indigo)",
    period: "Jul 2024 – Jan 2025",
    location: "Hyderabad",
    current: false,
    color: "#89AACC",
    logo: "A",
    tagline: "AI-powered enterprise workflow platform",
    highlights: ["-50% feature dev time", "+40% operational efficiency", "+30% app responsiveness"],
    skills: ["React", "TypeScript", "Tailwind", "OpenAI APIs", "Node.js"],
    bullets: [
      "Architected reusable type-safe UI component libraries",
      "Designed LLM-driven automation workflows with OpenAI APIs",
      "Led end-to-end UI–API integration with optimized REST contracts"
    ]
  },
  {
    role: "Software Developer",
    company: "Skillgigs",
    period: "Mar 2021 – Nov 2023",
    location: "Delhi",
    current: false,
    color: "#7A9EBB",
    logo: "S",
    tagline: "Freelance talent marketplace",
    highlights: ["+79% user adoption", "-900ms API latency", "+91% login success"],
    skills: ["React", "Node.js", "WebSockets", "OAuth 2.0", "AWS Amplify"],
    bullets: [
      "Built scalable marketplace features with React and REST APIs",
      "Implemented secure OAuth 2.0 authentication flow",
      "Developed real-time chat with WebSockets (Socket.io)",
      "Designed CI/CD pipelines reducing deployment time by 47%"
    ]
  },
  {
    role: "Software Developer",
    company: "Wipro",
    period: "Aug 2019 – Dec 2019",
    location: "Delhi",
    current: false,
    color: "#556677",
    logo: "W",
    tagline: "Global IT services leader",
    highlights: ["Platform stability", "Cross-team debugging"],
    skills: ["Engineering", "Debugging", "Collaboration"],
    bullets: [
      "Collaborated with engineering teams to debug complex technical issues",
      "Ensured platform stability across multiple product lines"
    ]
  }
];

function ExperienceCard({ job, idx, isLast }: { job: typeof EXPERIENCE[0]; idx: number; isLast: boolean }) {
  const [open, setOpen] = useState(idx === 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.9, delay: Math.min(idx * 0.1 + 0.1, 0.4), ease: [0.25, 0.1, 0.25, 1] }}
      className="flex gap-3 md:gap-6 relative"
    >
      {/* Timeline spine */}
      <div className="flex flex-col items-center shrink-0 w-8 min-w-[32px] md:w-10 md:min-w-[40px]">
        {/* Node */}
        <div
          onClick={() => setOpen(!open)}
          className="w-8 h-8 min-w-[32px] min-h-[32px] md:w-10 md:h-10 md:min-w-[40px] md:min-h-[40px] flex items-center justify-center shrink-0 cursor-pointer overflow-visible leading-none text-[13px] md:text-[15px] font-semibold font-display italic transition-all duration-300"
          style={{
            borderRadius: open ? "50%" : "0px",
            background: open ? `linear-gradient(135deg, ${job.color}33, ${job.color}11)` : "var(--surface)",
            border: `1px solid ${open ? job.color + "55" : "var(--stroke)"}`,
            color: open ? job.color : "var(--muted)",
            boxShadow: open ? `0 0 16px ${job.color}22` : "none"
          }}
        >
          {job.logo}
        </div>
        {/* Line down */}
        {!isLast && (
          <div 
            className="w-px flex-1 min-h-[24px] mt-2 mb-2 transition-colors duration-500"
            style={{
              background: `linear-gradient(to bottom, ${open ? job.color + "44" : "var(--stroke)"}, var(--stroke))`
            }}
          />
        )}
      </div>

      {/* Card */}
      <div className={`flex-1 ${isLast ? 'mb-0' : 'mb-4'}`}>
        <div
          onClick={() => setOpen(!open)}
          className="overflow-hidden cursor-pointer transition-all duration-300"
          style={{
            background: open ? "var(--surface)" : "transparent",
            border: `1px solid ${open ? "var(--stroke)" : "transparent"}`,
            borderRadius: open ? 20 : 0
          }}
        >
          {/* Card header (always visible) */}
          <div
            className={`flex flex-col md:flex-row md:items-start md:justify-between gap-1 md:gap-3 transition-all duration-300 ${open ? "px-4 md:px-6 pt-5 pb-4" : "pb-2"}`}
          >
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <span className="text-base font-semibold text-text-primary">{job.company}</span>
                {job.current && (
                  <span className="inline-flex items-center gap-1.5 text-[10px] px-2 py-[2px] rounded-full bg-green-700/20 border border-green-700/40 text-green-400 tracking-[0.1em] uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Current
                  </span>
                )}
              </div>
              <div className="text-[13px] text-muted">
                {job.role}
              </div>
            </div>
            <div className="text-left md:text-right shrink-0 flex md:block items-center gap-2 md:gap-0">
              <div className="text-xs text-muted md:mb-0.5">{job.period}</div>
              <span className="text-[11px] text-muted opacity-60 md:hidden">·</span>
              <div className="text-[11px] text-muted opacity-60">{job.location}</div>
            </div>
          </div>

          {/* Expanded content */}
          <AnimatePresence>
            {open && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="px-4 md:px-6 pb-5 md:pb-6 pt-2">
                  <p className="text-xs text-muted mb-4 italic">{job.tagline}</p>

                  {/* Metrics chips */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.highlights.map((h, i) => (
                      <span 
                        key={i} 
                        className="text-[11px] px-3 py-1 rounded-full font-medium"
                        style={{
                          background: `linear-gradient(90deg, ${job.color}18, ${job.color}0a)`,
                          border: `1px solid ${job.color}33`,
                          color: job.color
                        }}
                      >
                        {h}
                      </span>
                    ))}
                  </div>

                  {/* Bullets */}
                  <ul className="flex flex-col gap-2 mb-4">
                    {job.bullets.map((b, i) => (
                      <li key={i} className="flex gap-2.5 items-start">
                        <span 
                          className="w-1 h-1 rounded-full shrink-0 mt-[7px]" 
                          style={{ background: job.color }}
                        />
                        <span className="text-[13px] text-muted leading-[1.6]">{b}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5">
                    {job.skills.map((s, i) => (
                      <span 
                        key={i} 
                        className="text-[11px] px-2.5 py-1 rounded-md bg-[#1c1c1c] border border-stroke text-muted"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="bg-bg py-24 border-t border-white/5">
      <div className="max-w-[900px] mx-auto px-4 md:px-6">
        <SectionHeader
          eyebrow="Career"
          heading="Where I've"
          italic="worked"
          sub="5+ years building high-performance web applications across startups and scale-ups."
        />
        <div className="flex flex-col">
          {EXPERIENCE.map((job, idx) => (
            <ExperienceCard 
              key={idx} 
              job={job} 
              idx={idx} 
              isLast={idx === EXPERIENCE.length - 1} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
