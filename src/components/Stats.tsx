import { motion } from 'framer-motion';

const STATS = [
  { value: "5+", label: "Years Experience" },
  { value: "3+", label: "Platforms Architected" },
  { value: "90%", label: "Latency Reduction" }
];

export default function Stats() {
  return (
    <section className="bg-bg py-16 md:py-24 border-t border-white/5">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-white/5">
          {STATS.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              className="flex flex-col items-center text-center pt-8 md:pt-0 first:pt-0"
            >
              <span className="text-6xl md:text-7xl lg:text-8xl font-display text-text-primary mb-2">
                {stat.value}
              </span>
              <span className="text-sm md:text-base text-muted uppercase tracking-[0.2em]">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
