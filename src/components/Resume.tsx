import { motion } from 'framer-motion';
import { SectionHeader } from './ui/SectionHeader';

const RESUME_SKILLS = [
  { group: "Frontend", items: ["React", "TypeScript", "Next.js", "Redux Toolkit", "Tailwind"] },
  { group: "Architecture", items: ["Micro Frontends", "Module Federation", "Atomic Design", "Design Systems"] },
  { group: "Backend & Cloud", items: ["Node.js", "AWS", "WebSockets", "OAuth 2.0", "Serverless"] },
  { group: "AI & Tooling", items: ["Claude", "Copilot", "Prompt Engineering", "LLM Workflows"] }
];

export default function Resume() {
  return (
    <section id="profile" className="bg-bg py-24 border-t border-white/5 relative">
      <div className="max-w-[900px] mx-auto px-6">
        <SectionHeader
          eyebrow="Profile"
          heading="A bit about"
          italic="me"
          sub="5+ years of frontend engineering experience across frontend, architecture, and cloud."
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

          <div className="p-8 md:p-10">
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
                <div className="text-[11px] text-muted">Frontend / Full-stack roles · Remote or Bengaluru or Pune</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
