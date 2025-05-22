'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DailyUtterance from '@/components/DailyUtterance';
import LifeClock from '@/components/LifeClock';
import GiftKnowledgeButton from '@/components/GiftKnowledgeButton';
import { supabase } from '@/lib/supabase';

const TOTAL_DAYS = 77;

export default function Experience() {
  const [loading, setLoading] = useState(true);
  const [being, setBeing] = useState<any>(null);
  const [utterance, setUtterance] = useState<string | null>(null);
  const [day, setDay] = useState<number>(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrCreateBeing = async () => {
      try {
        let { data: being, error } = await supabase
          .from('beings')
          .select('*')
          .single();
        let newBeingCreated = false;
        if (error || !being) {
          const { data: newBeing, error: createError } = await supabase
            .from('beings')
            .insert({ current_day: 0, total_days: TOTAL_DAYS })
            .select()
            .single();
          if (createError) throw createError;
          being = newBeing;
          newBeingCreated = true;
        }
        setBeing(being);
        setDay(being.current_day || 0);
        const today = new Date().toISOString().split('T')[0];
        let utteranceData;
        if (newBeingCreated) {
          // Generate utterance for today if new being
          await fetch('/api/generate-utterance');
        }
        // Always fetch utterance for today
        const { data } = await supabase
          .from('utterances')
          .select('*')
          .eq('date', today)
          .single();
        utteranceData = data;
        setUtterance(utteranceData?.text || null);
      } catch (error) {
        setFeedback('Something went wrong connecting to the being.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrCreateBeing();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="animate-pulse-slow text-white font-serif text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black">
      {/* Animated, surreal background memory shapes */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0.7 }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: 'radial-gradient(ellipse at 60% 40%, #23232b 0%, #191921 60%, #000 100%)',
        }}
      />
      {/* Blurred memory orbs */}
      <motion.div
        className="absolute z-10"
        style={{ left: '10%', top: '20%' }}
        initial={{ scale: 1, opacity: 0.18 }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.18, 0.28, 0.18] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="180" height="180">
          <ellipse cx="90" cy="90" rx="80" ry="70" fill="#b6b6d8" filter="blur(18px)" />
        </svg>
      </motion.div>
      <motion.div
        className="absolute z-10"
        style={{ right: '12%', bottom: '18%' }}
        initial={{ scale: 1, opacity: 0.12 }}
        animate={{ scale: [1, 1.04, 1], opacity: [0.12, 0.22, 0.12] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="120" height="120">
          <ellipse cx="60" cy="60" rx="55" ry="50" fill="#e6e0c5" filter="blur(14px)" />
        </svg>
      </motion.div>

      {/* Poetic intro and user guidance */}
      <div className="absolute top-0 left-0 w-full text-center z-20 pt-10 pointer-events-none">
        <motion.h2
          className="font-serif text-2xl md:text-3xl text-[#e6e0c5] drop-shadow-lg mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          A softly glowing being drifts in memory.
        </motion.h2>
        <motion.p
          className="font-serif text-base md:text-lg text-[#b6b6d8] drop-shadow mb-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        >
          Each day, it speaks a single thought. Gift it a book or a feeling—tomorrow, its voice will change.
        </motion.p>
      </div>

      {/* Utterance or anticipation message - now above the being */}
      <div className="absolute w-full flex flex-col items-center z-30" style={{ top: '18vh' }}>
        <div className="mb-8">
          {utterance ? (
            <DailyUtterance text={utterance} />
          ) : (
            <motion.div
              className="font-serif text-xl text-[#b6b6d8] mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              The being is silent today. Return tomorrow for its next thought.
            </motion.div>
          )}
        </div>
      </div>

      {/* Organic, being-like SVG (core, aura, gentle face, animated) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20" style={{ pointerEvents: 'none', marginTop: '7vh' }}>
        <motion.svg
          width="360"
          height="360"
          viewBox="0 0 360 360"
          className="drop-shadow-2xl"
          initial={{ scale: 0.97, opacity: 0.92 }}
          animate={{ scale: [0.97, 1.08, 0.97], opacity: [0.92, 1, 0.92] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <defs>
            <radialGradient id="being-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#b6b6d8" stopOpacity="0.98" />
              <stop offset="60%" stopColor="#e6e0c5" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#23232b" stopOpacity="0.1" />
            </radialGradient>
            <radialGradient id="being-aura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#e6e0c5" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#b6b6d8" stopOpacity="0.01" />
            </radialGradient>
          </defs>
          {/* Aura */}
          <ellipse
            cx="180"
            cy="180"
            rx="130"
            ry="120"
            fill="url(#being-aura)"
            filter="blur(12px)"
          />
          {/* Core */}
          <ellipse
            cx="180"
            cy="180"
            rx="90"
            ry="80"
            fill="url(#being-core)"
            filter="blur(2.5px)"
          />
          {/* Eyes (animated blink) */}
          <motion.ellipse
            cx="155"
            cy="175"
            rx="10"
            ry="7"
            fill="#fff"
            style={{ opacity: 0.7 }}
            filter="blur(0.5px)"
            animate={{ opacity: [0.7, 0.7, 0.05, 0.7, 0.7] }}
            transition={{ duration: 6, times: [0, 0.42, 0.46, 0.5, 1], repeat: Infinity }}
          />
          <motion.ellipse
            cx="205"
            cy="175"
            rx="10"
            ry="7"
            fill="#fff"
            style={{ opacity: 0.7 }}
            filter="blur(0.5px)"
            animate={{ opacity: [0.7, 0.7, 0.05, 0.7, 0.7] }}
            transition={{ duration: 6, times: [0, 0.42, 0.46, 0.5, 1], repeat: Infinity }}
          />
          {/* Eye highlights (not animated) */}
          <ellipse
            cx="152"
            cy="172"
            rx="2.5"
            ry="2"
            fill="#e6e0c5"
            opacity="0.7"
          />
          <ellipse
            cx="202"
            cy="172"
            rx="2.5"
            ry="2"
            fill="#e6e0c5"
            opacity="0.7"
          />
          {/* Gentle mouth (breathing animation) */}
          <motion.path
            d="M162 200 Q180 215 198 200"
            stroke="#e6e0c5"
            strokeWidth="3"
            fill="none"
            opacity="0.5"
            strokeLinecap="round"
            filter="blur(0.3px)"
            animate={{
              d: [
                'M162 200 Q180 215 198 200', // relaxed
                'M162 200 Q180 220 198 200', // inhale (mouth opens a bit)
                'M162 200 Q180 215 198 200'  // exhale (back to relaxed)
              ]
            }}
            transition={{ duration: 7, repeat: Infinity, times: [0, 0.5, 1], ease: 'easeInOut' }}
          />
        </motion.svg>
      </div>

      {/* UI overlays */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 pointer-events-none z-30">
        <motion.div 
          className="w-full flex flex-col items-center space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <LifeClock currentDay={day} totalDays={TOTAL_DAYS} />
          <div className="pointer-events-auto">
            {being ? (
              <GiftKnowledgeButton />
            ) : (
              <div className="text-center text-[#b6b6d8] font-serif mt-2 animate-pulse">The being is not yet awake. Please return soon.</div>
            )}
          </div>
          {feedback && (
            <div className="text-center text-[#b6b6d8] font-serif mt-2 animate-pulse">{feedback}</div>
          )}
        </motion.div>
      </div>
    </main>
  );
} 