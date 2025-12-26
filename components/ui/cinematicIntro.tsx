'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'

const letterVariants = {
  hidden: { y: 60, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.08,
      duration: 0.8,
      ease: [0.215, 0.61, 0.355, 1] as any,
    },
  }),
}

const taglineVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delay: 1.8, duration: 1.2 },
  },
}

export default function CinematicIntro({ onSkip }: { onSkip?: () => void }) {
  const title = 'SendWhich'

  useEffect(() => {
    if (!onSkip) return
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onSkip()
    }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [onSkip])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -12, transition: { duration: 0.6 } }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
      role="dialog"
      aria-label="Intro animation"
    >
      <div className="absolute inset-0 bg-black/95" />

      <div className="relative">
        {/* Glow effect behind text */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-indigo-500/18 via-purple-500/18 to-cyan-500/18 blur-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0.3, 0] }}
          transition={{ duration: 4.5, times: [0, 0.3, 0.6, 1] }}
        />

        <div className="flex overflow-hidden">
          {title.split('').map((char, i) => (
            <motion.span
              key={`${char}-${i}`}
              custom={i}
              variants={letterVariants}
              initial="hidden"
              animate="visible"
              className="text-7xl md:text-9xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-white"
            >
              {char}
            </motion.span>
          ))}
        </div>

        <motion.p
          variants={taglineVariants}
          initial="hidden"
          animate="visible"
          className="mt-6 text-2xl md:text-3xl font-light text-gray-300 text-center tracking-wide"
        >
          Share Smart. Share Secure.
        </motion.p>
      </div>

      <button
        onClick={() => onSkip?.()}
        aria-label="Skip intro"
        className="skip-button absolute top-6 right-6 text-sm text-gray-300/80"
      >
        Skip
      </button>
    </motion.div>
  )
}