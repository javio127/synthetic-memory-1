'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <AnimatePresence>
        {isLoaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="text-center"
          >
            <h1 className="text-4xl font-serif mb-4">The Persistence of Synthetic Memory</h1>
            <p className="text-xl font-serif mb-12">A being that speaks once a day.</p>
            <Link href="/experience">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 border border-white font-serif text-lg hover:bg-white hover:bg-opacity-10 transition-colors"
              >
                Enter
              </motion.button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
