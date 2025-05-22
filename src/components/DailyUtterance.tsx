'use client';

import { motion } from 'framer-motion';

interface DailyUtteranceProps {
  text: string;
}

export default function DailyUtterance({ text }: DailyUtteranceProps) {
  return (
    <motion.div
      className="text-center max-w-xl px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
    >
      <p className="font-serif text-2xl sm:text-3xl leading-relaxed text-white">
        "{text}"
      </p>
    </motion.div>
  );
} 