import { motion } from 'framer-motion';
import { SectionHeader } from './ui/SectionHeader';

const RESUME_SKILLS = [
  { group: "Frontend", items: ["React", "TypeScript", "Next.js", "Redux Toolkit", "Tailwind"] },
  { group: "Architecture", items: ["Micro Frontends", "Module Federation", "Atomic Design", "Design Systems"] },
  { group: "Backend & Cloud", items: ["Node.js", "AWS", "WebSockets", "OAuth 2.0", "Serverless"] },
  { group: "AI & Tooling", items: ["Claude", "Copilot", "Prompt Engineering", "LLM Workflows"] }
];

function ResumePreview() {
  return (
    <div className="w-full aspect-[210/297] max-w-[260px] bg-surface border border-stroke rounded-xl overflow-hidden relative shrink-0">
      {/* Top bar */}
      <div className="bg-surface border-b border-stroke h-12 flex items-center px-4 gap-2.5">
        <div className="w-2 h-2 rounded-full bg-stroke" />
        <div className="flex-1 h-1.5 bg-stroke rounded-full max-w-[100px]" />
      </div>
      {/* Content skeleton */}
      <div className="p-4 flex flex-col gap-3">
        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <div className="h-3.5 bg-stroke rounded w-[70%]" />
          <div className="h-2 bg-stroke/50 rounded w-[50%]" />
        </div>
        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-[#89AACC]/30 to-transparent" />
        {/* Sections */}
        {[80, 60, 90, 50, 75, 55, 85, 65, 45].map((w, i) => (
          <div 
            key={i} 
            className={`rounded-full ${i % 3 === 0 ? 'h-2.5 bg-stroke/80' : 'h-[7px] bg-stroke/40'}`} 
            style={{ width: `${w}%` }} 
          />
        ))}
        {/* Gradient accent strip */}
        <div className="h-[3px] bg-gradient-to-r from-[#89AACC] to-[#4E85BF] rounded-full mt-1" />
        {[70, 55, 80, 45].map((w, i) => (
          <div 
            key={i} 
            className="h-[7px] bg-stroke/40 rounded-full" 
            style={{ width: `${w}%` }} 
          />
        ))}
      </div>
      {/* Shimmer overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[rgba(137,170,204,0.03)] to-transparent" />
    </div>
  );
}

export default function Resume() {
  return (
    <section id="resume" className="bg-bg py-24 border-t border-white/5 relative">
      <div className="max-w-[900px] mx-auto px-6">
        <SectionHeader
          eyebrow="Resume"
          heading="Download my"
          italic="credentials"
          sub="5+ years of frontend engineering experience, distilled into one document."
        />

        {/* Main card */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="bg-surface border border-stroke rounded-[28px] overflow-hidden relative"
        >
          {/* Top gradient line */}
          <div className="h-[2px] w-full bg-gradient-to-r from-[#89AACC] via-[#4E85BF] to-[#89AACC] bg-[length:200%_100%] animate-gradient-shift" />

          <div className="p-8 md:p-10 flex flex-col md:flex-row gap-10 md:gap-12 items-center md:items-start">
            {/* Left: Preview + CTA */}
            <div className="flex flex-col items-center gap-6 w-full md:w-auto shrink-0">
              <div className="relative">
                <ResumePreview />
                {/* Updated badge */}
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-surface border border-stroke rounded-full px-3.5 py-1 text-[10px] text-muted whitespace-nowrap tracking-[0.1em] shadow-lg">
                  Updated Apr 2026
                </div>
              </div>

              {/* Download CTA */}
              <div className="flex flex-col gap-3 w-full min-w-[200px] mt-2">
                <a 
                  href="/YashRai_Resume.pdf"
                  download
                  className="relative px-6 py-3.5 rounded-full bg-gradient-to-r from-[#89AACC] to-[#4E85BF] text-bg text-[13px] font-semibold flex items-center justify-center gap-2 hover:scale-[1.03] transition-all shadow-[0_4px_24px_rgba(78,133,191,0.2)] hover:shadow-[0_8px_32px_rgba(78,133,191,0.3)] group"
                >
                  <span className="group-hover:animate-bounce">↓</span> Download Resume
                </a>

              </div>
            </div>

            {/* Right: Details */}
            <div className="flex-1 w-full min-w-[260px]">
              {/* Name + title */}
              <div className="mb-8 text-center md:text-left">
                <h3 className="text-3xl font-display italic text-text-primary mb-1">
                  Yash Rai
                </h3>
                <p className="text-[13px] text-muted">Frontend Engineer · SDE 2 @ Livspace</p>
                <div className="flex gap-2.5 mt-3 flex-wrap justify-center md:justify-start">
                  {["Bengaluru, IN", "yashhr01@gmail.com", "LinkedIn"].map((c, i) => (
                    <span 
                      key={i} 
                      className="text-[11px] px-2.5 py-1 rounded-md bg-[#1c1c1c] border border-stroke text-muted"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Skills grid */}
              <div className="flex flex-col gap-5">
                {RESUME_SKILLS.map(({ group, items }, gi) => (
                  <div key={gi}>
                    <div className="text-[10px] text-muted uppercase tracking-[0.25em] mb-2.5 text-center md:text-left">
                      {group}
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      {items.map((s, si) => (
                        <span 
                          key={si} 
                          className="text-xs px-3 py-1.5 rounded-md bg-[#1c1c1c] border border-stroke text-text-primary transition-colors duration-200 hover:border-[#4E85BF]/40 hover:text-[#89AACC] cursor-default"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Availability */}
              <div className="mt-8 p-4 rounded-xl bg-green-700/10 border border-green-700/20 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-green-400 shrink-0 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                <div>
                  <div className="text-xs text-green-400 font-medium mb-0.5">Open to opportunities</div>
                  <div className="text-[11px] text-muted">Frontend / Full-stack roles · Remote or Bengaluru</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
