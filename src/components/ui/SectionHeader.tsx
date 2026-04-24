import { motion } from 'framer-motion';

interface SectionHeaderProps {
  eyebrow: string;
  heading: string;
  italic: string;
  sub?: string;
  cta?: string;
}

export function SectionHeader({ eyebrow, heading, italic, sub, cta }: SectionHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
      className="mb-14"
    >
      <div className="flex flex-col gap-0">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-8 h-px bg-stroke" />
          <span className="text-[11px] text-muted uppercase tracking-[0.3em]">{eyebrow}</span>
        </div>
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <h2 className="text-[clamp(32px,5vw,56px)] text-text-primary tracking-[-0.02em] leading-[1.1] mb-3">
              {heading} <span className="font-display italic">{italic}</span>
            </h2>
            {sub && <p className="text-muted text-sm max-w-[480px]">{sub}</p>}
          </div>
          {cta && (
            <button className="group relative inline-flex items-center justify-center rounded-full text-[13px] transition-transform duration-200 hover:scale-[1.03] shrink-0">
              <span className="absolute inset-[-2px] rounded-full bg-gradient-to-r from-[#89AACC] to-[#4E85BF] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="relative flex items-center gap-2 px-[22px] py-2.5 rounded-full bg-surface border border-stroke text-text-primary backdrop-blur-md transition-colors duration-300 group-hover:bg-bg group-hover:border-transparent">
                {cta} <span className="opacity-60 transition-transform duration-300 group-hover:translate-x-1">→</span>
              </span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
