'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Book {
  title: string;
  author: string;
  summary: string;
}

export default function GiftKnowledgeButton() {
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [book, setBook] = useState<Book | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBook(null);
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/gift-book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vibe: prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unknown error');
      setBook(data.book);
      setPrompt('');
    } catch (err: any) {
      setError(err.message || 'Failed to gift knowledge');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsPromptOpen(false);
    setPrompt('');
    setError(null);
    setBook(null);
    setLoading(false);
  };

  return (
    <>
      <motion.button
        className="px-6 py-2 border border-white/50 font-serif text-base hover:bg-white/10 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsPromptOpen(true)}
      >
        Gift Knowledge
      </motion.button>
      <AnimatePresence>
        {isPromptOpen && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-deep-space border border-white/30 p-6 rounded-sm w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="font-serif text-xl mb-4">Gift Knowledge</h3>
              {book ? (
                <div className="space-y-4">
                  <div>
                    <div className="font-bold text-lg">{book.title}</div>
                    <div className="italic text-sm mb-2">by {book.author}</div>
                    <div className="text-sm opacity-80">{book.summary}</div>
                  </div>
                  <button
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 mt-2"
                    onClick={handleClose}
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="vibe-prompt" className="block text-sm mb-2 opacity-70">
                      Describe the vibe or feeling:
                    </label>
                    <input
                      id="vibe-prompt"
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g., gentle but sad, curious about stars"
                      className="w-full p-2 bg-black/50 border border-white/30 focus:border-white outline-none"
                      autoFocus
                      disabled={loading}
                    />
                  </div>
                  {error && <div className="text-red-400 mb-2">{error}</div>}
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      className="px-4 py-2 opacity-70 hover:opacity-100"
                      onClick={handleClose}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-white/10 hover:bg-white/20"
                      disabled={loading}
                    >
                      {loading ? 'Gifting...' : 'Gift'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 