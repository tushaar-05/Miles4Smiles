'use client';

import { motion } from 'framer-motion';

const MARQUEE_ITEMS = [
  '5KM CHARITY RUN',
  '₹30,000 TOTAL PRIZE POOL',
  '100% PROCEEDS DONATED',
  '500+ EXPECTED RUNNERS',
  'MALE, FEMALE & ADULT DIVISIONS',
  'TOP 3 WINNERS AWARDED PER CATEGORY',
  'REGISTER NOW',
];

export default function HeroMarquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]; // duplicate for seamless loop

  return (
    <div className="relative w-full overflow-hidden bg-orange-500 py-3 border-y border-orange-400/40">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          duration: 20,
          ease: 'linear',
          repeat: Infinity,
        }}
      >
        {items.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 px-6 text-white font-bold text-sm sm:text-base tracking-widest uppercase"
          >
            {item}
            <span className="text-white/50 text-lg">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
